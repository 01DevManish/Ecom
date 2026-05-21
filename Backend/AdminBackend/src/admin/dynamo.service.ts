import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

type RawRecord = Record<string, unknown>;

type InventoryItem = {
  source_pk: string;
  source_sk?: string;
  sku: string;
  title: string;
  slug: string;
  category: string;
  collection: string;
  description: string;
  image_url: string;
  mrp: number;
  sale_price: number;
  quantity_available: number;
  raw: Record<string, unknown>;
};

@Injectable()
export class DynamoService {
  private docClient: DynamoDBDocumentClient;
  private readonly imageCache = new Map<string, { imageUrl: string; expiresAt: number }>();
  private readonly imageCacheTtlMs = 1000 * 60 * 30; // 30 minutes

  constructor(private configService: ConfigService) {
    // Attempt to get from config, fallback to environment, fallback to hardcoded default
    const region = this.configService.get<string>('AWS_REGION') || process.env.AWS_REGION || 'ap-south-1';
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID') || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || process.env.AWS_SECRET_ACCESS_KEY;

    console.log(`[DynamoService] Initializing with:`);
    console.log(` - Region: ${region}`);
    console.log(` - AccessKey: ${accessKeyId ? 'PRESENT' : 'MISSING'}`);

    // If region is still undefined (shouldn't happen with fallback), force it
    const finalRegion = region || 'ap-south-1';

    const client = new DynamoDBClient({
      region: finalRegion,
      credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
      },
    });
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  private firstNonEmptyString(values: Array<string | number | undefined | null>, fallback = '') {
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) return value.trim();
      if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    }
    return fallback;
  }

  private stringValue(item: RawRecord, keys: string[], fallback = '') {
    for (const key of keys) {
      const value = item[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
      if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    }
    return fallback;
  }

  private numberValue(item: RawRecord, keys: string[], fallback = 0) {
    for (const key of keys) {
      const value = item[key];
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string') {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
    return fallback;
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private normalizeToken(value: string) {
    return (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private toCollectionLabel(value: string) {
    const v = (value || '').trim();
    return v || 'General';
  }

  private normalizeImageUrl(rawImage: string) {
    if (!rawImage) return '';
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) return rawImage;

    const cloudfrontDomain =
      this.configService.get<string>('NEXT_PUBLIC_CLOUDFRONT_DOMAIN')
      || this.configService.get<string>('CLOUDFRONT_DOMAIN')
      || '';
    const bucketName =
      this.configService.get<string>('AWS_S3_BUCKET_NAME')
      || this.configService.get<string>('NEXT_PUBLIC_AWS_S3_BUCKET')
      || '';
    const bucketRegion =
      this.configService.get<string>('NEXT_PUBLIC_AWS_S3_REGION')
      || this.configService.get<string>('AWS_REGION')
      || 'ap-south-1';
    const prefix = this.configService.get<string>('AWS_S3_PATH_PREFIX') || '';
    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
    const cleanKey = rawImage.replace(/^\/+/, '');
    const keyWithPrefix = cleanPrefix && !cleanKey.startsWith(cleanPrefix) ? `${cleanPrefix}/${cleanKey}` : cleanKey;

    if (cloudfrontDomain) return `${cloudfrontDomain.replace(/\/+$/, '')}/${keyWithPrefix}`;
    if (bucketName) return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${keyWithPrefix}`;
    return rawImage;
  }

  private getPayload(item: RawRecord) {
    const payload = item.payload;
    return payload && typeof payload === 'object' ? (payload as RawRecord) : null;
  }

  private getEntityType(item: RawRecord) {
    const value = item.entityType;
    return typeof value === 'string' ? value.toLowerCase() : '';
  }

  private normalizeRateItem(parent: RawRecord, rateItem: RawRecord, index: number): InventoryItem | null {
    const sku = this.firstNonEmptyString([this.stringValue(rateItem, ['sku', 'SKU', 'product_sku', 'item_code'])]);
    const title = this.firstNonEmptyString([this.stringValue(rateItem, ['productName', 'name', 'title'])], sku);
    if (!sku || !title) return null;

    const rate = this.numberValue(rateItem, ['rate', 'price', 'selling_price', 'sale_price'], 0);
    const discount = this.numberValue(rateItem, ['discount'], 0);
    const discountType = this.stringValue(rateItem, ['discountType'], 'amount').toLowerCase();
    const salePrice =
      !discount || discount <= 0
        ? rate
        : discountType === 'percentage'
          ? Math.max(0, Math.round((rate * (100 - discount) / 100) * 100) / 100)
          : Math.max(0, rate - discount);
    const mrp = this.numberValue(rateItem, ['mrp', 'MRP', 'list_price'], rate || salePrice);
    const stock = this.numberValue(rateItem, ['stock', 'quantity', 'qty', 'available'], 0);

    const sourcePk = this.firstNonEmptyString(
      [this.stringValue(parent, ['timestamp_id', 'id', 'PK', 'pk']), this.stringValue(parent, ['partition'])],
      'RATE',
    );

    return {
      source_pk: `${sourcePk}#${sku}#${index}`,
      source_sk: undefined,
      sku,
      title,
      slug: this.slugify(title),
      category: this.slugify(this.firstNonEmptyString([this.stringValue(rateItem, ['category', 'department'])], 'uncategorized')),
      collection: this.toCollectionLabel(this.firstNonEmptyString([
        this.stringValue(rateItem, ['collection', 'group', 'collectionName', 'collection_name', 'segment']),
        this.stringValue(parent, ['collection', 'group']),
      ])),
      description: `${title} from inventory.`,
      image_url: this.normalizeImageUrl(this.stringValue(rateItem, ['image', 'image_url', 'imageUrl', 's3_key', 'image_key'])),
      mrp: mrp || salePrice || rate,
      sale_price: salePrice || rate || mrp,
      quantity_available: stock,
      raw: parent,
    };
  }

  private extractInventoryItems(item: RawRecord): InventoryItem[] {
    const payload = this.getPayload(item);
    const entityType = this.getEntityType(item);

    if (entityType === 'dataset_inventory' && payload) {
      const sku = this.firstNonEmptyString([this.stringValue(payload, ['sku', 'barcodeSku', 'itemSku'])]);
      const title = this.firstNonEmptyString([this.stringValue(payload, ['productName', 'name', 'title'])], sku);
      if (!sku || !title) return [];

      const price = this.numberValue(payload, ['price', 'salePrice', 'sellingPrice', 'wholesalePrice'], 0);
      const mrp = this.numberValue(payload, ['mrp', 'MRP', 'listPrice'], price);
      const stock = this.numberValue(payload, ['stock', 'availableStock', 'quantity'], 0);

      return [{
        source_pk: this.firstNonEmptyString([this.stringValue(item, ['timestamp_id', 'id'])], `INV#${sku}`),
        source_sk: undefined,
        sku,
        title,
        slug: this.slugify(title),
        category: this.slugify(this.firstNonEmptyString([this.stringValue(payload, ['category', 'department'])], 'uncategorized')),
        collection: this.toCollectionLabel(this.firstNonEmptyString([
          this.stringValue(payload, ['collection', 'group', 'collectionName', 'collection_name', 'segment', 'itemGroup', 'productGroup']),
          this.stringValue(payload, ['category', 'department']),
        ])),
        description: this.stringValue(payload, ['description'], `${title} from inventory.`),
        image_url: this.normalizeImageUrl(this.firstNonEmptyString([
          this.stringValue(payload, ['imageUrl', 'image', 'thumbnail']),
          Array.isArray(payload.imageUrls) && payload.imageUrls.length ? String(payload.imageUrls[0]) : '',
        ])),
        mrp: mrp || price,
        sale_price: price || mrp,
        quantity_available: stock,
        raw: item,
      }];
    }

    if (payload && Array.isArray(payload.rates)) {
      return payload.rates
        .map((rateItem, index) =>
          rateItem && typeof rateItem === 'object'
            ? this.normalizeRateItem(item, rateItem as RawRecord, index)
            : null)
        .filter((row): row is InventoryItem => Boolean(row));
    }

    // Generic fallback for top-level product rows.
    const sku = this.firstNonEmptyString([this.stringValue(item, ['sku', 'SKU'])], 'SKU');
    const title = this.firstNonEmptyString([this.stringValue(item, ['title', 'name'])], sku || 'Untitled');
    const mrp = this.numberValue(item, ['mrp', 'MRP', 'price', 'list_price'], 0);
    const salePrice = this.numberValue(item, ['sale_price', 'salePrice', 'selling_price', 'price'], mrp);
    const quantity = this.numberValue(item, ['quantity_available', 'stock', 'quantity', 'available'], 0);

    if (sku === 'SKU' && title === 'SKU' && mrp === 0 && salePrice === 0 && quantity === 0) return [];

    return [{
      source_pk: this.firstNonEmptyString([this.stringValue(item, ['PK', 'pk', 'id'])], sku),
      source_sk: this.firstNonEmptyString([this.stringValue(item, ['SK', 'sk'])]) || undefined,
      sku,
      title,
      slug: this.slugify(this.stringValue(item, ['slug'], title || sku)),
      category: this.slugify(this.firstNonEmptyString([this.stringValue(item, ['category', 'department'])], 'uncategorized')),
      collection: this.toCollectionLabel(this.firstNonEmptyString([
        this.stringValue(item, ['collection', 'group', 'collectionName', 'collection_name', 'segment']),
        this.stringValue(item, ['category', 'department']),
      ])),
      description: this.stringValue(item, ['description'], `${title} from inventory.`),
      image_url: this.normalizeImageUrl(this.stringValue(item, ['image_url', 'imageUrl', 'image', 'thumbnail'])),
      mrp,
      sale_price: salePrice || mrp,
      quantity_available: quantity,
      raw: item,
    }];
  }

  async getAllSkus() {
    const tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME') || 'erpdev';
    const command = new ScanCommand({
      TableName: tableName,
      ProjectionExpression: 'sku',
    });
    try {
      const response = await this.docClient.send(command);
      return (response.Items || []).map((item) => item.sku).filter(Boolean);
    } catch (error) {
      console.error('DynamoDB Scan SKUs Error:', error);
      return [];
    }
  }

  async getInventory(limit: number = 10, cursor: string | null = null, query?: string, collection?: string) {
    const tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME') || 'erpdev';

    try {
      let lastEvaluatedKey = cursor ? JSON.parse(Buffer.from(cursor, 'base64').toString()) : undefined;
      const items: InventoryItem[] = [];

      const q = this.normalizeToken(query || '');
      const collectionFilter = (collection || '').trim().toLowerCase();

      while (items.length < limit) {
        const response = await this.docClient.send(
          new ScanCommand({
            TableName: tableName,
            Limit: Math.max(limit * 3, 30),
            ExclusiveStartKey: lastEvaluatedKey,
          }),
        );

        const mapped = (response.Items || []).flatMap((item) => this.extractInventoryItems(item as RawRecord));
        const filtered = mapped.filter((row) => {
          const matchesCollection = !collectionFilter || collectionFilter === 'all' || row.collection.toLowerCase() === collectionFilter;
          if (!matchesCollection) return false;
          if (!q) return true;
          const hay = [
            row.sku,
            row.title,
            row.collection,
            row.category,
            row.source_pk,
            row.source_sk || '',
          ].map((x) => this.normalizeToken(String(x || ''))).join(' ');
          return hay.includes(q);
        });
        items.push(...filtered);
        lastEvaluatedKey = response.LastEvaluatedKey;
        if (!lastEvaluatedKey) break;
      }

      const nextCursor = lastEvaluatedKey
        ? Buffer.from(JSON.stringify(lastEvaluatedKey)).toString('base64')
        : null;

      return { items: items.slice(0, limit), nextCursor };
    } catch (error) {
      console.error('DynamoDB Scan Inventory Error:', error);
      throw error;
    }
  }

  async getImageMapBySkus(skus: string[], maxScanItems = 3000) {
    const normalized = skus
      .map((sku) => String(sku || '').trim().toUpperCase())
      .filter(Boolean);
    if (!normalized.length) return {} as Record<string, string>;

    const now = Date.now();
    const found: Record<string, string> = {};
    const pending: string[] = [];

    for (const sku of normalized) {
      const cached = this.imageCache.get(sku);
      if (cached && cached.expiresAt > now) {
        found[sku] = cached.imageUrl;
      } else {
        if (cached) this.imageCache.delete(sku);
        pending.push(sku);
      }
    }

    if (!pending.length) return found;

    const target = new Set(pending);
    const tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME') || 'erpdev';

    let lastEvaluatedKey: Record<string, unknown> | undefined;
    let scanned = 0;

    do {
      const response = await this.docClient.send(
        new ScanCommand({
          TableName: tableName,
          ExclusiveStartKey: lastEvaluatedKey,
          Limit: 200,
        }),
      );

      const mapped = (response.Items || []).flatMap((item) => this.extractInventoryItems(item as RawRecord));
      for (const row of mapped) {
        const sku = String(row.sku || '').trim().toUpperCase();
        if (!sku || !target.has(sku) || !row.image_url) continue;
        if (!found[sku]) {
          found[sku] = row.image_url;
          this.imageCache.set(sku, { imageUrl: row.image_url, expiresAt: Date.now() + this.imageCacheTtlMs });
        }
      }

      lastEvaluatedKey = response.LastEvaluatedKey as Record<string, unknown> | undefined;
      scanned += (response.Items || []).length;
      if (Object.keys(found).length >= target.size) break;
    } while (lastEvaluatedKey && scanned < maxScanItems);

    return found;
  }

  async getInventoryCollections(maxScanItems = 3000) {
    const tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME') || 'erpdev';
    const set = new Set<string>();
    let lastEvaluatedKey: Record<string, unknown> | undefined;
    let scanned = 0;

    do {
      const response = await this.docClient.send(
        new ScanCommand({
          TableName: tableName,
          ExclusiveStartKey: lastEvaluatedKey,
          Limit: 200,
        }),
      );
      const mapped = (response.Items || []).flatMap((item) => this.extractInventoryItems(item as RawRecord));
      for (const row of mapped) {
        const value = this.toCollectionLabel(row.collection);
        if (value) set.add(value);
      }
      lastEvaluatedKey = response.LastEvaluatedKey as Record<string, unknown> | undefined;
      scanned += (response.Items || []).length;
    } while (lastEvaluatedKey && scanned < maxScanItems);

    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
}

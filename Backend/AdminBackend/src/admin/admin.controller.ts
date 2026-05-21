// @ts-nocheck
import { Controller, Get, Post, Delete, Query, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseService } from '../database/database.service';
import { DynamoService } from './dynamo.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly db: DatabaseService,
    private readonly dynamo: DynamoService
  ) {}

  private normalizeSiteId(siteId?: string) {
    const value = (siteId || 'quirkyhome').trim().toLowerCase();
    return value || 'quirkyhome';
  }

  private slugify(value: string) {
    return (value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private buildDefaultBuilderSchema(siteId: string) {
    const siteTitle = siteId === 'quirkyhome' ? 'QuirkyHome' : siteId.toUpperCase();
    return {
      themeSettings: {
        colors: {
          primary: '#008060',
          secondary: '#5c6ac4',
          background: '#ffffff',
          surface: '#f6f6f7',
          text: '#1a1a1a',
          textMuted: '#6d7175',
          accent: '#b98900',
          border: '#e1e3e5',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          headingFamily: 'Inter, system-ui, sans-serif',
          baseSize: '16px',
          headingWeight: '700',
        },
        spacing: {
          sectionPadding: '64px',
          containerMax: '1200px',
          borderRadius: '8px',
        },
      },
      pages: {
        home: {
          name: 'Home Page',
          slug: 'home',
          sections: [
            {
              id: 'banner-strip-1',
              type: 'BannerStrip',
              visible: true,
              settings: {
                text: 'Festive Home Refresh Sale - Up to 60% Off | Free shipping above Rs. 999',
                bgColor: '#008060',
                textColor: '#ffffff',
                link: '',
              },
            },
            {
              id: 'hero-banner-1',
              type: 'HeroBanner',
              visible: true,
              settings: {
                heading: `Buy Home Decor Items Online for Every Indian Home`,
                subheading: 'Shop bedsheets, wall decor, table lamps, kitchen essentials, dining pieces, planters, gifts, and curated home accessories at friendly prices.',
                badgeText: 'Festive Home Refresh Sale',
                button1Text: 'Shop the Sale',
                button1Link: '/search',
                button2Text: 'Explore Collections',
                button2Link: '/search',
                imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
                feature1: 'Fast delivery',
                feature2: 'Secure checkout',
                feature3: 'Curated picks',
              },
            },
            {
              id: 'search-band-1',
              type: 'SearchBand',
              visible: true,
              settings: {
                label: 'Search for',
                chips: 'Bedsheets, Artificial Plants, Photo Frames, Wall Clocks, Canvas Paintings, Table Lamps, Cushion Covers',
              },
            },
            {
              id: 'category-grid-1',
              type: 'CategoryGrid',
              visible: true,
              settings: {
                eyebrow: 'Shop by category',
                heading: 'Home decor, furnishing and essentials',
                subheading: 'Find bedding, wall decor, lighting, kitchen, dining, bath, garden, gifts, storage and showpieces in one place.',
              },
            },
            {
              id: 'collections-section-1',
              type: 'CollectionsSection',
              visible: true,
              settings: {
                eyebrow: 'Collections',
                heading: 'Shop by collection',
                subheading: 'Curated product sets to help you discover your style.',
              },
            },
            {
              id: 'product-grid-1',
              type: 'ProductGrid',
              visible: true,
              settings: {
                eyebrow: 'Sale picks',
                heading: 'Premium finds, friendly prices',
                subheading: 'Shop bestselling home decor products with clear pricing, ratings, wishlist and add-to-cart actions.',
              },
            },
            {
              id: 'promises-section-1',
              type: 'PromisesSection',
              visible: true,
              settings: {
                eyebrow: 'Why choose us',
                heading: 'A calmer, warmer way to shop for home',
              },
            },
            {
              id: 'newsletter-1',
              type: 'Newsletter',
              visible: true,
              settings: {
                eyebrow: 'Decor notes',
                heading: 'Ideas, offers and new drops',
                subheading: 'Get room styling inspiration, festive sale alerts and new home essentials in your inbox.',
                buttonText: 'Join Newsletter',
              },
            },
            {
              id: 'seo-article-1',
              type: 'SeoArticle',
              visible: true,
              settings: {
                content: `<h2>${siteTitle} - Buy Home Decor Items Online in India</h2><p>${siteTitle} is built for people who want beautiful home decor without making shopping feel complicated. Explore bedding, home furnishing, wall decor, table lamps, dining essentials, kitchen products, bath accessories, planters, storage baskets, showpieces and thoughtful gifts for Indian homes.</p><h2>Shop Home Decor by Category</h2><p>Whether you are refreshing a bedroom, setting up a living room, styling a dining table or choosing a housewarming gift, our category-led shopping experience helps you find the right product quickly.</p>`,
              },
            },
          ],
        },
      },
    };
  }

  private isLegacyBuilderSchema(schema: any) {
    const sections = schema?.pages?.home?.sections;
    if (!Array.isArray(sections)) return true;
    const types = sections.map((s: any) => s?.type).filter(Boolean);
    return types.includes('FeaturedCollection') || !types.includes('SearchBand') || !types.includes('BannerStrip');
  }

  private async ensureSiteScopedSchema() {
    await this.db.query(`
      alter table if exists products add column if not exists site_id varchar(50) not null default 'quirkyhome';
      alter table if exists product_variants add column if not exists site_id varchar(50) not null default 'quirkyhome';
      alter table if exists product_variants add column if not exists price numeric(12,2);
      alter table if exists product_variants add column if not exists quantity_available int not null default 0;
      alter table if exists orders add column if not exists site_id varchar(50) not null default 'quirkyhome';
      alter table if exists users add column if not exists site_id varchar(50) not null default 'quirkyhome';
      alter table if exists carts add column if not exists site_id varchar(50) not null default 'quirkyhome';
      alter table if exists wishlists add column if not exists site_id varchar(50) not null default 'quirkyhome';
      create index if not exists idx_products_site_id on products(site_id);
      create index if not exists idx_product_variants_site_id on product_variants(site_id);
      create index if not exists idx_orders_site_id on orders(site_id);
      create index if not exists idx_users_site_id on users(site_id);
      create index if not exists idx_carts_site_id on carts(site_id);
      create index if not exists idx_wishlists_site_id on wishlists(site_id);
    `);

    // Move SKU uniqueness from global to site-scoped for multi-tenant imports.
    await this.db.query(`
      do $$
      begin
        if exists (
          select 1
          from information_schema.table_constraints
          where table_name = 'product_variants'
            and constraint_type = 'UNIQUE'
            and constraint_name = 'product_variants_sku_key'
        ) then
          alter table product_variants drop constraint product_variants_sku_key;
        end if;
      end $$;
      create unique index if not exists uq_product_variants_site_sku on product_variants(site_id, sku);
    `);
  }

  private async ensureCollectionsSchema() {
    await this.db.query(`
      create table if not exists collections (
        id uuid primary key default gen_random_uuid(),
        name varchar(120) not null,
        slug varchar(140) not null,
        description text,
        image_url text,
        is_active boolean not null default true,
        sort_order int not null default 0,
        site_id varchar(50) not null default 'quirkyhome',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
      create table if not exists collection_products (
        collection_id uuid not null references collections(id) on delete cascade,
        product_slug varchar(260) not null,
        sort_order int not null default 0,
        created_at timestamptz not null default now(),
        primary key (collection_id, product_slug)
      );
      alter table if exists collections add column if not exists site_id varchar(50) not null default 'quirkyhome';
      alter table if exists collections add column if not exists is_active boolean not null default true;
      alter table if exists collections add column if not exists sort_order int not null default 0;
      create index if not exists idx_collections_site on collections(site_id);
      create unique index if not exists uq_collections_site_slug on collections(site_id, slug);
    `);
  }

  private async ensureBuilderSchema() {
    await this.db.query(`
      create table if not exists builder_pages (
        id varchar(50) not null,
        schema_json jsonb not null,
        site_id varchar(50) not null default 'quirkyhome',
        updated_at timestamptz not null default now()
      );
      alter table if exists builder_pages add column if not exists site_id varchar(50) not null default 'quirkyhome';
      do $$
      begin
        if exists (
          select 1
          from information_schema.table_constraints
          where table_name = 'builder_pages'
            and constraint_name = 'builder_pages_pkey'
            and constraint_type = 'PRIMARY KEY'
        ) then
          alter table builder_pages drop constraint builder_pages_pkey;
        end if;
      end $$;
      alter table builder_pages add primary key (id, site_id);
    `);
  }

  @Get('stats')
  async getStats(@Query('site_id') siteId: string, @Res() res: Response) {
    try {
      await this.ensureSiteScopedSchema();
      const currentSiteId = this.normalizeSiteId(siteId);
      const [users, products, orders, carts, wishlists] = await Promise.all([
        this.db.query('SELECT COUNT(*) as count FROM users where site_id = $1', [currentSiteId]),
        this.db.query('SELECT COUNT(*) as count FROM products where site_id = $1', [currentSiteId]),
        this.db.query('SELECT COUNT(*) as count FROM orders where site_id = $1', [currentSiteId]),
        this.db.query('SELECT COUNT(*) as count FROM carts where site_id = $1', [currentSiteId]),
        this.db.query('SELECT COUNT(*) as count FROM wishlists where site_id = $1', [currentSiteId]),
      ]);
      return res.json({
        totalUsers: parseInt(users.rows[0]?.count || '0'),
        totalProducts: parseInt(products.rows[0]?.count || '0'),
        totalOrders: parseInt(orders.rows[0]?.count || '0'),
        totalCarts: parseInt(carts.rows[0]?.count || '0'),
        totalWishlists: parseInt(wishlists.rows[0]?.count || '0'),
      });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  @Get('products')
  async getProducts(@Query('skus') skus: string, @Query('site_id') siteId: string, @Res() res: Response) {
    try {
      await this.ensureSiteScopedSchema();
      const currentSiteId = this.normalizeSiteId(siteId);
      if (skus === '1') {
        const rows = await this.db.query(
          `select distinct pv.sku
           from product_variants pv
           where pv.sku is not null and pv.is_active = true and pv.site_id = $1`,
          [currentSiteId],
        );
        return res.json({ skus: rows.rows.map(r => r.sku) });
      }
      const result = await this.db.query(
        `select p.id, p.title, p.slug, p.is_active, p.created_at,
          pv.sku,
          pv.sale_price::text as sale_price,
          pv.mrp::text as mrp,
          pv.quantity_available,
          pv.attributes->>'collection' as collection,
          c.slug as category, pi.image_url as image_url,
          (select count(*) from product_variants where product_id = p.id) as variant_count
         from products p
         left join product_variants pv on pv.product_id = p.id and pv.site_id = p.site_id
         left join product_category_map pcm on pcm.product_id = p.id
         left join categories c on c.id = pcm.category_id
         left join product_images pi on pi.product_id = p.id and pi.sort_order = 0
         where p.site_id = $1
         order by p.created_at desc limit 100`,
        [currentSiteId],
      );
      const rows = result.rows as any[];
      const missingImageSkus = rows
        .filter((row) => !row.image_url && row.sku)
        .map((row) => String(row.sku));

      if (missingImageSkus.length) {
        const imageMap = await this.dynamo.getImageMapBySkus(missingImageSkus);
        for (const row of rows) {
          const key = String(row.sku || '').trim().toUpperCase();
          if (!row.image_url && key && imageMap[key]) row.image_url = imageMap[key];
        }
      }

      return res.json(rows);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  @Get('inventory/dynamodb')
  async getDynamoInventory(
    @Query('limit') limit: string,
    @Query('cursor') cursor: string,
    @Query('q') q: string,
    @Query('collection') collection: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.dynamo.getInventory(parseInt(limit || '10'), cursor || null, q || '', collection || '');
      return res.json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to fetch DynamoDB inventory' });
    }
  }

  @Get('inventory/dynamodb/collections')
  async getDynamoCollections(@Res() res: Response) {
    try {
      const collections = await this.dynamo.getInventoryCollections();
      return res.json({ collections });
    } catch {
      return res.status(500).json({ error: 'Failed to fetch inventory collections' });
    }
  }

  @Post('inventory/import')
  async importProduct(@Body() item: any, @Query('site_id') siteId: string, @Res() res: Response) {
    try {
      await this.ensureSiteScopedSchema();
      const currentSiteId = this.normalizeSiteId(siteId);
      if (!item.sku) return res.status(400).json({ error: 'SKU is required' });

      const slugBase = this.slugify(item.slug || item.title || item.sku || 'product');
      const siteScopedSlug = `${slugBase}-${currentSiteId}`;

      const existingProduct = await this.db.query<{ id: string }>(
        'select id from products where site_id = $1 and slug = $2 limit 1',
        [currentSiteId, siteScopedSlug],
      );

      const productId = existingProduct.rows[0]?.id
        || (await this.db.query<{ id: string }>(
          `insert into products (title, slug, short_description, long_description, is_active, is_searchable, site_id)
           values ($1, $2, $3, $3, true, true, $4)
           returning id`,
          [item.title, siteScopedSlug, item.description || '', currentSiteId],
        )).rows[0]?.id;

      if (!productId) return res.status(500).json({ error: 'Failed to resolve product id' });

      const existingVariant = await this.db.query<{ id: string }>(
        'select id from product_variants where site_id = $1 and sku = $2 limit 1',
        [currentSiteId, item.sku],
      );
      let variantId = existingVariant.rows[0]?.id;

      if (variantId) {
        await this.db.query(
          `update product_variants
           set mrp = $1, sale_price = $2, price = $2, quantity_available = $3, updated_at = now(), product_id = $4
           where id = $5`,
          [item.mrp || 0, item.sale_price || 0, item.quantity_available || 0, productId, variantId],
        );
      } else {
        const createdVariant = await this.db.query<{ id: string }>(
          `insert into product_variants (product_id, sku, mrp, sale_price, quantity_available, is_active, site_id)
           values ($1, $2, $3, $4, $5, true, $6)
           returning id`,
          [productId, item.sku, item.mrp || 0, item.sale_price || 0, item.quantity_available || 0, currentSiteId],
        );
        variantId = createdVariant.rows[0]?.id;
        await this.db.query(
          `update product_variants
           set price = $1
           where site_id = $2 and sku = $3`,
          [item.sale_price || 0, currentSiteId, item.sku],
        );
      }

      if (variantId) {
        await this.db.query(
          `insert into inventory_items (variant_id, quantity_available)
           values ($1, $2)
           on conflict (variant_id) do update
           set quantity_available = excluded.quantity_available,
               updated_at = now()`,
          [variantId, item.quantity_available || 0],
        );

        await this.db.query(
          `insert into inventory_source_mapping (variant_id, source_system, source_table, source_pk, source_sk, include_in_sync, sync_status, last_synced_at)
           values ($1, 'dynamodb', $2, $3, $4, true, 'synced', now())
           on conflict (variant_id) do update
           set source_table = excluded.source_table,
               source_pk = excluded.source_pk,
               source_sk = excluded.source_sk,
               sync_status = 'synced',
               last_synced_at = now()`,
          [variantId, process.env.DYNAMODB_TABLE_NAME || 'erpdev', item.source_pk || item.sku, item.source_sk || null],
        );
      }

      // Save images to product_images table
      const imageUrls: string[] = [];
      if (typeof item.image_url === 'string' && item.image_url.trim()) {
        imageUrls.push(item.image_url.trim());
      }
      if (Array.isArray(item.image_urls)) {
        for (const url of item.image_urls) {
          if (typeof url === 'string' && url.trim() && !imageUrls.includes(url.trim())) {
            imageUrls.push(url.trim());
          }
        }
      }
      if (imageUrls.length === 0 && item.sku) {
        const imageMap = await this.dynamo.getImageMapBySkus([item.sku]);
        const skuKey = String(item.sku).trim().toUpperCase();
        if (imageMap[skuKey]) {
          imageUrls.push(imageMap[skuKey]);
        }
      }

      if (imageUrls.length > 0) {
        await this.db.query('delete from product_images where product_id = $1', [productId]);
        for (let i = 0; i < imageUrls.length; i++) {
          await this.db.query(
            `insert into product_images (product_id, variant_id, image_url, alt_text, sort_order)
             values ($1, $2, $3, $4, $5)`,
            [productId, variantId || null, imageUrls[i], `${item.title || 'Product'} image ${i + 1}`, i],
          );
        }
      }

      return res.json({ ok: true, productId });
    } catch (e) {
      console.error('Import Error:', e);
      return res.status(500).json({ error: `Failed to import product: ${e instanceof Error ? e.message : 'unknown error'}` });
    }
  }

  @Get('collections')
  async getCollections(
    @Query('products') products: string,
    @Query('site_id') siteId: string,
    @Res() res: Response,
  ) {
    try {
      await this.ensureCollectionsSchema();
      const currentSiteId = this.normalizeSiteId(siteId);
      const collectionsResult = await this.db.query(
        `select id, name, slug, description, image_url, is_active, sort_order
         from collections
         where site_id = $1
         order by sort_order asc, created_at desc`,
        [currentSiteId],
      );
      const collections = collectionsResult.rows as any[];

      if (products === '1' && collections.length) {
        const ids = collections.map((c) => c.id);
        const linkResult = await this.db.query(
          `select collection_id, product_slug, sort_order
           from collection_products
           where collection_id = any($1::uuid[])
           order by sort_order asc, created_at asc`,
          [ids],
        );
        const map = new Map<string, string[]>();
        for (const row of linkResult.rows as any[]) {
          const list = map.get(row.collection_id) || [];
          list.push(row.product_slug);
          map.set(row.collection_id, list);
        }
        return res.json({
          collections: collections.map((c) => ({ ...c, products: map.get(c.id) || [] })),
        });
      }

      return res.json({ collections: collections.map((c) => ({ ...c, products: [] })) });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to fetch collections' });
    }
  }

  @Post('collections')
  async createCollection(@Body() body: any, @Query('site_id') siteId: string, @Res() res: Response) {
    try {
      await this.ensureCollectionsSchema();
      const currentSiteId = this.normalizeSiteId(siteId);
      const name = String(body?.name || '').trim();
      if (!name) return res.status(400).json({ error: 'Collection name is required' });
      const baseSlug = this.slugify(name);
      const slug = `${baseSlug}-${currentSiteId}`;
      const description = String(body?.description || '').trim() || null;
      const productSlugs = Array.isArray(body?.products) ? body.products.map((x: any) => String(x || '').trim()).filter(Boolean) : [];

      const created = await this.db.query<{ id: string }>(
        `insert into collections (name, slug, description, is_active, sort_order, site_id)
         values ($1, $2, $3, true, coalesce((select max(sort_order) + 1 from collections where site_id = $4), 0), $4)
         returning id`,
        [name, slug, description, currentSiteId],
      );

      const collectionId = created.rows[0]?.id;
      if (!collectionId) return res.status(500).json({ error: 'Failed to create collection' });

      for (let i = 0; i < productSlugs.length; i += 1) {
        await this.db.query(
          `insert into collection_products (collection_id, product_slug, sort_order)
           values ($1, $2, $3)
           on conflict (collection_id, product_slug) do update set sort_order = excluded.sort_order`,
          [collectionId, productSlugs[i], i],
        );
      }

      return res.json({ ok: true, id: collectionId, slug });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to create collection' });
    }
  }

  @Post('collections/update')
  async updateCollection(@Body() body: any, @Query('site_id') siteId: string, @Res() res: Response) {
    try {
      await this.ensureCollectionsSchema();
      const currentSiteId = this.normalizeSiteId(siteId);
      const id = String(body?.id || '').trim();
      if (!id) return res.status(400).json({ error: 'Collection id is required' });

      const isActive = typeof body?.is_active === 'boolean' ? body.is_active : null;
      const sortOrder = Number.isFinite(Number(body?.sort_order)) ? Number(body.sort_order) : null;
      const updates: string[] = [];
      const params: unknown[] = [];

      if (isActive !== null) {
        params.push(isActive);
        updates.push(`is_active = $${params.length}`);
      }
      if (sortOrder !== null) {
        params.push(sortOrder);
        updates.push(`sort_order = $${params.length}`);
      }
      if (!updates.length) return res.status(400).json({ error: 'No updatable fields provided' });

      params.push(id);
      params.push(currentSiteId);
      await this.db.query(
        `update collections
         set ${updates.join(', ')}, updated_at = now()
         where id = $${params.length - 1} and site_id = $${params.length}`,
        params,
      );

      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to update collection' });
    }
  }

  @Delete('collections')
  async deleteCollection(@Query('id') id: string, @Query('site_id') siteId: string, @Res() res: Response) {
    try {
      await this.ensureCollectionsSchema();
      const currentSiteId = this.normalizeSiteId(siteId);
      if (!id) return res.status(400).json({ error: 'Collection id is required' });
      await this.db.query('delete from collections where id = $1 and site_id = $2', [id, currentSiteId]);
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'Failed to delete collection' });
    }
  }

  @Get('builder')
  async getBuilder(@Query('site_id') siteId: string, @Res() res: Response) {
    try {
      await this.ensureBuilderSchema();
      const currentSiteId = this.normalizeSiteId(siteId);
      const result = await this.db.query<{ schema_json: Record<string, unknown> }>(
        `select schema_json
         from builder_pages
         where id = 'main' and site_id = $1
         limit 1`,
        [currentSiteId],
      );
      if (result.rows[0]?.schema_json) {
        const schema = result.rows[0].schema_json as any;
        if (this.isLegacyBuilderSchema(schema)) {
          const upgraded = this.buildDefaultBuilderSchema(currentSiteId);
          await this.db.query(
            `update builder_pages
             set schema_json = $1::jsonb, updated_at = now()
             where id = 'main' and site_id = $2`,
            [JSON.stringify(upgraded), currentSiteId],
          );
          return res.json({ schema: upgraded });
        }
        return res.json({ schema });
      }

      // Auto-bootstrap for new sites: copy schema from quirkyhome if available.
      const fallback = await this.db.query<{ schema_json: Record<string, unknown> }>(
        `select schema_json
         from builder_pages
         where id = 'main' and site_id = 'quirkyhome'
         limit 1`,
      );

      if (fallback.rows[0]?.schema_json) {
        const fallbackSchema = this.isLegacyBuilderSchema(fallback.rows[0].schema_json)
          ? this.buildDefaultBuilderSchema('quirkyhome')
          : fallback.rows[0].schema_json;
        await this.db.query(
          `insert into builder_pages (id, site_id, schema_json, updated_at)
           values ('main', $1, $2::jsonb, now())
           on conflict (id, site_id) do nothing`,
          [currentSiteId, JSON.stringify(fallbackSchema)],
        );
        return res.json({ schema: fallbackSchema });
      }

      const seeded = this.buildDefaultBuilderSchema(currentSiteId);
      await this.db.query(
        `insert into builder_pages (id, site_id, schema_json, updated_at)
         values ('main', $1, $2::jsonb, now())
         on conflict (id, site_id) do nothing`,
        [currentSiteId, JSON.stringify(seeded)],
      );
      return res.json({ schema: seeded });
    } catch {
      return res.status(500).json({ error: 'Failed to fetch builder schema' });
    }
  }

  @Post('builder')
  async saveBuilder(@Body() body: any, @Query('site_id') siteId: string, @Res() res: Response) {
    try {
      await this.ensureBuilderSchema();
      const currentSiteId = this.normalizeSiteId(siteId || body?.site_id);
      const schema = body?.schema;
      if (!schema || typeof schema !== 'object') return res.status(400).json({ error: 'schema is required' });

      await this.db.query(
        `insert into builder_pages (id, site_id, schema_json, updated_at)
         values ('main', $1, $2::jsonb, now())
         on conflict (id, site_id) do update
         set schema_json = excluded.schema_json, updated_at = now()`,
        [currentSiteId, JSON.stringify(schema)],
      );
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'Failed to save builder schema' });
    }
  }
}

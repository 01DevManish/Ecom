import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminProductsService {
  constructor(private readonly db: DatabaseService) {}

  async listAll() {
    const result = await this.db.query(
      `select p.id, p.title, p.slug, pv.sku,
         pv.attributes->>'collection' as collection,
         pv.sale_price::text, pv.mrp::text,
         ii.quantity_available, pi.image_url,
         c.slug as category, p.is_active, p.created_at::text
       from products p
       left join product_variants pv on pv.product_id = p.id
       left join inventory_items ii on ii.variant_id = pv.id
       left join product_images pi on pi.product_id = p.id and pi.sort_order = 0
       left join product_category_map pcm on pcm.product_id = p.id
       left join categories c on c.id = pcm.category_id
       order by p.created_at desc limit 100`,
    );
    return result.rows;
  }

  async getSkus() {
    const result = await this.db.query<{ sku: string }>(
      `select distinct pv.sku from product_variants pv where pv.sku is not null and pv.is_active = true`,
    );
    return { skus: result.rows.map((r) => r.sku) };
  }

  async deleteById(id: string) {
    await this.db.query('delete from products where id = $1', [id]);
    return { ok: true };
  }

  async clearAll() {
    await this.db.query('delete from products');
    return { ok: true, cleared: true };
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SitesService {
  constructor(private readonly db: DatabaseService) {}

  async listSites() {
    await this.db.query(`
      create table if not exists sites (
        id varchar(50) primary key,
        name varchar(100) not null,
        domain varchar(200) default '',
        logo_text varchar(10) not null default 'ST',
        brand_color varchar(20) not null default '#008060',
        created_at timestamptz not null default now()
      )
    `);

    await this.db.query(`
      insert into sites (id, name, domain, logo_text, brand_color)
      values ('quirkyhome', 'QuirkyHome', 'quirkyhome.in', 'QH', '#008060')
      on conflict (id) do nothing
    `);

    const result = await this.db.query('select * from sites order by created_at');
    return { sites: result.rows };
  }

  async createSite(body: any) {
    const { name, domain, brand_color } = body;
    if (!name) throw new HttpException('Store name is required', HttpStatus.BAD_REQUEST);

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 50);
    const logo_text = name.slice(0, 2).toUpperCase();

    await this.db.query(
      `insert into sites (id, name, domain, logo_text, brand_color)
       values ($1, $2, $3, $4, $5)`,
      [id, name, domain || '', logo_text, brand_color || '#008060'],
    );
    return { ok: true, site: { id, name, domain, logo_text, brand_color } };
  }

  async deleteSite(id: string) {
    if (!id || id === 'quirkyhome') throw new HttpException('Cannot delete this store', HttpStatus.BAD_REQUEST);
    await this.db.query('delete from sites where id = $1', [id]);
    return { ok: true };
  }
}

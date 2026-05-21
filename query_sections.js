const { Client } = require('pg');
require('dotenv').config({ path: 'AdminPanel/.env.local' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  try {
    const res = await client.query("select site_id, id, schema_json from builder_pages");
    for (const row of res.rows) {
      console.log(`Site: ${row.site_id}, Page: ${row.id}`);
      const schema = row.schema_json;
      if (schema && schema.pages) {
        for (const [pageKey, page] of Object.entries(schema.pages)) {
          console.log(`  Page: ${pageKey} (${page.name})`);
          console.log(`    Sections:`, page.sections?.map(s => `${s.type} (visible: ${s.visible})`));
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
main();

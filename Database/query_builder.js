const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_SFK9nH2uTaIi@ep-falling-unit-aocdzkhh-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log("Querying builder_pages...");
  try {
    const res = await pool.query("SELECT id, site_id, updated_at FROM builder_pages");
    console.log("builder_pages rows:", res.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

run();

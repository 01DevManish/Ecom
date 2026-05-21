const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_SFK9nH2uTaIi@ep-falling-unit-aocdzkhh-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log("Connecting to PostgreSQL...");
  try {
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log("\nFound tables:");
    const tables = tablesRes.rows.map(r => r.table_name);
    console.log(tables.join(", "));

    for (const table of tables) {
      try {
        const countRes = await pool.query(`SELECT COUNT(*) as count FROM "${table}"`);
        console.log(`- ${table}: ${countRes.rows[0].count} rows`);
      } catch (err) {
        console.log(`- ${table}: Error getting count (${err.message})`);
      }
    }
    
    console.log("\nSample sites:");
    try {
      const sitesRes = await pool.query(`SELECT * FROM sites LIMIT 5`);
      console.log(sitesRes.rows);
    } catch (err) {
      console.log("No sites table or error:", err.message);
    }

  } catch (err) {
    console.error("Database connection/query error:", err);
  } finally {
    await pool.end();
  }
}

run();

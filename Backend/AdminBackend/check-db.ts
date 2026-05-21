import { Pool } from 'pg';
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_SFK9nH2uTaIi@ep-falling-unit-aocdzkhh-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const res = await pool.query('SELECT email, role, is_active, password_hash FROM team_users');
    console.log('--- Team Users in DB ---');
    console.table(res.rows);
    await pool.end();
  } catch (e: any) {
    console.error('DB Error:', e.message);
  }
}
check();

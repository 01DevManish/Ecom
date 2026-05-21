import { Pool } from 'pg';
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_SFK9nH2uTaIi@ep-falling-unit-aocdzkhh-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await pool.query("UPDATE team_users SET password_hash = 'admin123' WHERE email = 'admin@quirkyhome.in'");
    console.log('? Password updated to admin123 (plain text)');
    await pool.end();
  } catch (e) {
    console.error('Update Error:', e.message);
  }
}
run();

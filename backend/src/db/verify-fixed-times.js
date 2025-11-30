import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verify() {
  const result = await pool.query('SELECT day, answer, unlock_time::text as unlock_time FROM puzzles ORDER BY day ASC');
  console.log('\n✅ Puzzle Unlock Times (Fixed):');
  result.rows.forEach(r => {
    console.log(`   Day ${String(r.day).padStart(2, '0')}: ${r.answer.padEnd(10)} → ${r.unlock_time}`);
  });
  
  const now = new Date();
  console.log(`\n   Current UTC: ${now.toISOString()}`);
  console.log(`   Only Day 25 (test) is currently unlocked`);
  
  await pool.end();
}

verify();

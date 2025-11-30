import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkUnlockTimes() {
  try {
    console.log('🔍 Checking puzzle unlock times...\n');
    
    const result = await pool.query(`
      SELECT day, answer, unlock_time
      FROM puzzles 
      ORDER BY day ASC
    `);
    
    console.log('Puzzle Unlock Times:');
    console.log('═════════════════════════════════════════════════');
    result.rows.forEach(r => {
      const date = new Date(r.unlock_time * 1000);
      console.log(`Day ${String(r.day).padStart(2, '0')}: ${r.answer.padEnd(10)} → ${date.toISOString()}`);
    });
    
    // Check current time
    const now = new Date();
    console.log('\n═════════════════════════════════════════════════');
    console.log(`Current UTC time: ${now.toISOString()}`);
    console.log(`Current timestamp: ${Math.floor(now.getTime() / 1000)}`);
    
    // Check what puzzles should be unlocked now
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const unlockedPuzzles = result.rows.filter(r => r.unlock_time <= currentTimestamp);
    console.log(`\nPuzzles unlocked now: ${unlockedPuzzles.length}/25`);
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUnlockTimes();

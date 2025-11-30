import pool from './src/db/pool.js';

async function updateUnlockTimes() {
  const client = await pool.connect();
  try {
    console.log('🔄 Updating puzzle unlock times to past date (for testing)...\n');

    const danishDate = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
    const baseDate = new Date(danishDate);
    baseDate.setHours(0, 0, 0, 0);
    baseDate.setDate(baseDate.getDate() - 1); // Yesterday so puzzles are unlocked

    const result = await client.query(
      `UPDATE puzzles SET unlock_time = $1 WHERE day IN (1, 2, 3, 4, 5)`,
      [baseDate]
    );

    console.log(`✅ Updated ${result.rowCount} puzzles to unlock time: ${baseDate}`);

    // Verify
    const verify = await client.query(
      `SELECT day, unlock_time FROM puzzles WHERE day IN (1, 2, 3, 4, 5) ORDER BY day`
    );
    console.log('\n📋 Puzzle unlock times:');
    verify.rows.forEach(row => {
      console.log(`  Day ${row.day}: ${row.unlock_time}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
    process.exit(0);
  }
}

updateUnlockTimes();

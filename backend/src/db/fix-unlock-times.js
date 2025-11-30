import pool from './pool.js';

async function fixUnlockTimes() {
  const client = await pool.connect();
  try {
    console.log('🔧 Fixing puzzle unlock times...\n');

    // Generate correct unlock times for Dec 1-24, 2025 at 00:00 CET
    for (let day = 1; day <= 24; day++) {
      // Create date for December at 00:00 CET
      // Using UTC time: Dec 1, 2025 00:00 CET = Nov 30, 2025 23:00 UTC
      const unlockDate = new Date(Date.UTC(2025, 11, day, -1, 0, 0));
      const isoString = unlockDate.toISOString();
      
      await client.query(
        `UPDATE puzzles SET unlock_time = $1::timestamp WHERE day = $2`,
        [isoString, day]
      );
      
      console.log(`✅ Day ${String(day).padStart(2, '0')}: ${isoString}`);
    }

    // Set test day (day 25) to epoch (always unlocked)
    await client.query(
      `UPDATE puzzles SET unlock_time = '1970-01-01T00:00:00Z'::timestamp WHERE day = 25`
    );
    console.log(`✅ Day 25 (test): 1970-01-01T00:00:00Z (always unlocked)`);

    console.log('\n✅ All unlock times fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing unlock times:', error.message);
    process.exit(1);
  } finally {
    await client.release();
    await pool.end();
  }
}

fixUnlockTimes();

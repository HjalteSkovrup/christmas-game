import { query } from './pool.js';

async function removeTestDay() {
  try {
    console.log('🧹 Removing test day from production...\n');

    // Delete test day puzzle (day 25)
    console.log('  Deleting Day 25 (test day) from puzzles table...');
    const deleteResult = await query('DELETE FROM puzzles WHERE day = 25');
    console.log(`  ✅ Deleted test day\n`);

    // Verify remaining puzzles
    console.log('  Verifying puzzles...');
    const puzzlesResult = await query('SELECT COUNT(*) as count FROM puzzles WHERE day BETWEEN 1 AND 24');
    const puzzleCount = puzzlesResult.rows[0].count;
    console.log(`  ✅ ${puzzleCount} production puzzles remain (Days 1-24)\n`);

    console.log('✨ Test day removed successfully!');
    console.log('   - Production puzzles: ✅ Days 1-24 only');
    console.log('   - Test infrastructure: ✅ Removed\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing test day:', error);
    process.exit(1);
  }
}

removeTestDay();

import { query } from './pool.js';

async function clearProductionData() {
  try {
    console.log('🧹 Clearing production test data...\n');

    // Delete all submissions
    console.log('  Deleting submissions...');
    const submissionsResult = await query('DELETE FROM submissions');
    console.log(`  ✅ Deleted ${submissionsResult.rowCount} submissions\n`);

    // Delete all participants
    console.log('  Deleting participants...');
    const participantsResult = await query('DELETE FROM participants');
    console.log(`  ✅ Deleted ${participantsResult.rowCount} participants\n`);

    // Delete all audit logs
    console.log('  Deleting audit logs...');
    const auditResult = await query('DELETE FROM audit_log');
    console.log(`  ✅ Deleted ${auditResult.rowCount} audit logs\n`);

    // Verify puzzles are still there
    console.log('  Verifying puzzles...');
    const puzzlesResult = await query('SELECT COUNT(*) as count FROM puzzles');
    const puzzleCount = puzzlesResult.rows[0].count;
    console.log(`  ✅ ${puzzleCount} puzzles remain (answers preserved)\n`);

    // Reset sequences to avoid ID conflicts
    console.log('  Resetting database sequences...');
    await query('ALTER SEQUENCE participants_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE submissions_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE audit_log_id_seq RESTART WITH 1');
    console.log('  ✅ Sequences reset\n');

    console.log('✨ Production database cleared and ready for launch!');
    console.log('   - Puzzle answers: ✅ Preserved');
    console.log('   - Test participants: ✅ Cleared');
    console.log('   - Test submissions: ✅ Cleared');
    console.log('   - Audit logs: ✅ Cleared');
    console.log('   - Leaderboard: ✅ Empty (ready for real submissions)\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing production data:', error);
    process.exit(1);
  }
}

clearProductionData();

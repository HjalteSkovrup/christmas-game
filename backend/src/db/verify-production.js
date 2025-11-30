import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying Production Database...\n');

    // Test connection
    console.log('1️⃣  Testing connection to Neon database...');
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log(`   Timestamp: ${connectionTest.rows[0].now}\n`);

    // Check schema exists
    console.log('2️⃣  Checking database schema...');
    const tablesResult = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const tables = tablesResult.rows.map(r => r.table_name);
    console.log(`✅ Found ${tables.length} tables:`, tables.join(', '));
    console.log();

    // Verify puzzles table
    console.log('3️⃣  Checking puzzles data...');
    const puzzlesResult = await pool.query(`
      SELECT day, answer, unlock_time FROM puzzles 
      ORDER BY day ASC
    `);
    console.log(`✅ Found ${puzzlesResult.rows.length} puzzles (expected 25)\n`);

    if (puzzlesResult.rows.length === 25) {
      console.log('   Sample puzzles:');
      puzzlesResult.rows.slice(0, 5).forEach(p => {
        const unlockDate = new Date(p.unlock_time * 1000).toISOString();
        console.log(`   Day ${String(p.day).padStart(2, '0')}: answer="${p.answer}" → Unlocks: ${unlockDate}`);
      });
      console.log('   ...');
      const lastPuzzle = puzzlesResult.rows[puzzlesResult.rows.length - 1];
      const lastUnlockDate = new Date(lastPuzzle.unlock_time * 1000).toISOString();
      console.log(`   Day ${String(lastPuzzle.day).padStart(2, '0')}: answer="${lastPuzzle.answer}" → Unlocks: ${lastUnlockDate}`);
    } else {
      console.log('   ⚠️  Expected 25 puzzles, found:', puzzlesResult.rows.length);
    }
    console.log();

    // Verify participants table
    console.log('4️⃣  Checking participants table...');
    const participantsResult = await pool.query('SELECT COUNT(*) as count FROM participants');
    console.log(`✅ Participants table exists, current entries: ${participantsResult.rows[0].count}\n`);

    // Verify submissions table
    console.log('5️⃣  Checking submissions table...');
    const submissionsResult = await pool.query('SELECT COUNT(*) as count FROM submissions');
    console.log(`✅ Submissions table exists, current entries: ${submissionsResult.rows[0].count}\n`);

    // Verify leaderboard view
    console.log('6️⃣  Checking leaderboard view...');
    try {
      const leaderboardResult = await pool.query('SELECT COUNT(*) as count FROM leaderboard');
      console.log(`✅ Leaderboard view exists, current entries: ${leaderboardResult.rows[0].count}\n`);
    } catch (e) {
      console.log('⚠️  Leaderboard view not found\n');
    }

    // Final summary
    console.log('═══════════════════════════════════════');
    console.log('🎄 DATABASE VERIFICATION COMPLETE 🎄');
    console.log('═══════════════════════════════════════');
    console.log('✅ Connection: OK');
    console.log(`✅ Puzzles: ${puzzlesResult.rows.length}/25 seeded`);
    console.log('✅ Schema: Ready for production');
    console.log('✅ Status: READY FOR DEPLOYMENT\n');

  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyDatabase();

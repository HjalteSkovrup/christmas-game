import pool from './pool.js';

async function addTestDay() {
  const client = await pool.connect();
  try {
    console.log('🧪 Adding test day (Day 25 - Test Day)...\n');

    // Check if test day already exists
    const existing = await client.query(
      `SELECT id FROM puzzles WHERE day = 25`
    );

    if (existing.rows.length > 0) {
      console.log('⏭️  Test day (Day 25) already exists, skipping');
      console.log('\nYou can use Day 25 to test submissions anytime!');
      client.release();
      return;
    }

    // Create test day with unlock time in the past (always available)
    const testDate = new Date(0); // Unix epoch - very far in the past

    await client.query(
      `INSERT INTO puzzles (day, title, description, answer, unlock_time) 
       VALUES (25, 'Test Day - For Testing Only', 'Enter answer: test', 'test', $1)`,
      [testDate]
    );

    console.log(`✅ Created Test Day (Day 25): answer = "test"`);
    console.log(`\n📝 Usage:`);
    console.log(`   1. Select "Day 25" in the calendar`);
    console.log(`   2. Enter any Participant ID (e.g., "testuser")`);
    console.log(`   3. Enter any Passkey (e.g., "testpass")`);
    console.log(`   4. Enter answer: "test" (or "TEST", "Test", etc.)`);
    console.log(`\n✅ Test day is always unlocked and ready to use!\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if this is the main module
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('add-test-day.js')) {
  addTestDay().catch(err => {
    console.error('❌ Failed:', err);
    process.exit(1);
  });
}

export default addTestDay;

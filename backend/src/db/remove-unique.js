import pool from './pool.js';

async function removeUniqueConstraint() {
  const client = await pool.connect();
  try {
    console.log('🔄 Removing unique constraint from submissions table...\n');

    // Drop the unique constraint
    await client.query(`
      ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_participant_id_puzzle_id_key
    `);
    console.log('✅ Dropped UNIQUE constraint');
    console.log('\n✅ Users can now submit multiple times per puzzle!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if this is the main module
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('remove-unique.js')) {
  removeUniqueConstraint().catch(err => {
    console.error('❌ Failed:', err);
    process.exit(1);
  });
}

export default removeUniqueConstraint;

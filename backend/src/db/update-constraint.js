import pool from './pool.js';

async function updateConstraint() {
  const client = await pool.connect();
  try {
    console.log('🔄 Updating puzzle day constraint...\n');

    // Drop the old constraint
    await client.query(`
      ALTER TABLE puzzles DROP CONSTRAINT puzzles_day_check
    `);
    console.log('✅ Dropped old constraint');

    // Add new constraint that allows day 25
    await client.query(`
      ALTER TABLE puzzles ADD CONSTRAINT puzzles_day_check CHECK (day >= 1 AND day <= 25)
    `);
    console.log('✅ Added new constraint (allowing days 1-25)');
    console.log('\n✅ Constraint updated!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if this is the main module
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('update-constraint.js')) {
  updateConstraint().catch(err => {
    console.error('❌ Failed:', err);
    process.exit(1);
  });
}

export default updateConstraint;

import pool from './pool.js';

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running database migrations...');
    
    // Participants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        participant_id VARCHAR(50) UNIQUE NOT NULL,
        passkey_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created participants table');

    // Puzzles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS puzzles (
        id SERIAL PRIMARY KEY,
        day INTEGER UNIQUE NOT NULL CHECK (day >= 1 AND day <= 25),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        answer VARCHAR(255) NOT NULL,
        unlock_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created puzzles table');

    // Submissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        participant_id INTEGER NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
        puzzle_id INTEGER NOT NULL REFERENCES puzzles(id) ON DELETE CASCADE,
        answer_submitted VARCHAR(255) NOT NULL,
        is_correct BOOLEAN NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created submissions table');

    // Audit log table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        participant_id INTEGER REFERENCES participants(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created audit_log table');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_participant ON submissions(participant_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_puzzle ON submissions(puzzle_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_puzzles_day ON puzzles(day)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_participants_id ON participants(participant_id)
    `);
    console.log('✅ Created indexes');

    // Drop existing view if it exists and recreate
    await client.query(`DROP VIEW IF EXISTS leaderboard`);
    await client.query(`
      CREATE VIEW leaderboard AS
      SELECT 
        p.participant_id,
        COUNT(CASE WHEN s.is_correct = true THEN 1 END) as correct_answers,
        MAX(s.submitted_at) as last_submission
      FROM participants p
      LEFT JOIN submissions s ON p.id = s.participant_id
      GROUP BY p.id, p.participant_id
      ORDER BY correct_answers DESC, last_submission ASC
    `);
    console.log('✅ Created leaderboard view');
    
    console.log('\n✅ All database migrations completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Export for manual runs
export default runMigrations;

// Run migrations if this is the main module
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('migrations.js')) {
  runMigrations().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
}

import pool from './pool.js';

// Sample puzzles for testing
const samplePuzzles = [
  {
    day: 1,
    title: "New Year's Math",
    description: "What is 7 + 5?",
    answer: "12"
  },
  {
    day: 2,
    title: "Logic Puzzle",
    description: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "echo"
  },
  {
    day: 3,
    title: "Pattern Recognition",
    description: "Complete the sequence: 2, 4, 8, 16, ?",
    answer: "32"
  },
  {
    day: 4,
    title: "Word Play",
    description: "What word becomes shorter when you add two letters to it?",
    answer: "short"
  },
  {
    day: 5,
    title: "Christmas Trivia",
    description: "How many reindeer pull Santa's sleigh?",
    answer: "9"
  }
];

async function seedPuzzles() {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding sample puzzles...\n');

    // Get the current date in Danish timezone
    const danishDate = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
    const baseDate = new Date(danishDate);
    baseDate.setHours(0, 0, 0, 0); // Start at midnight

    for (const puzzle of samplePuzzles) {
      // Calculate unlock time for each day
      // For dev/testing: set all puzzles to be unlocked (yesterday)
      const unlockTime = new Date(baseDate);
      unlockTime.setDate(unlockTime.getDate() - 1);

      // Check if puzzle already exists
      const existing = await client.query(
        `SELECT id FROM puzzles WHERE day = $1`,
        [puzzle.day]
      );

      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO puzzles (day, title, description, answer, unlock_time) 
           VALUES ($1, $2, $3, $4, $5)`,
          [puzzle.day, puzzle.title, puzzle.description, puzzle.answer, unlockTime]
        );
        console.log(`✅ Added puzzle Day ${puzzle.day}: ${puzzle.title}`);
      } else {
        console.log(`⏭️  Puzzle Day ${puzzle.day} already exists, skipping`);
      }
    }

    console.log('\n✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if this is the main module
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('seed.js')) {
  seedPuzzles().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
}

export default seedPuzzles;

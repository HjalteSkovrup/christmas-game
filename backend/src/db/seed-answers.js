import pool from './pool.js';

// The 24 answers for the Christmas puzzle game
// Puzzles are described in Teams, only answers stored here
const answers = [
  { day: 1, answer: "8" },
  { day: 2, answer: "362" },
  { day: 3, answer: "58" },
  { day: 4, answer: "Hjalte" },
  { day: 5, answer: "Er" },
  { day: 6, answer: "-2.5" },
  { day: 7, answer: "B" },
  { day: 8, answer: "36" },
  { day: 9, answer: "96" },
  { day: 10, answer: "E" },
  { day: 11, answer: "365" },
  { day: 12, answer: "3" },
  { day: 13, answer: "Den" },
  { day: 14, answer: "C" },
  { day: 15, answer: "74" },
  { day: 16, answer: "11" },
  { day: 17, answer: "681" },
  { day: 18, answer: "Største" },
  { day: 19, answer: "Stjerne" },
  { day: 20, answer: "E" },
  { day: 21, answer: "7" },
  { day: 22, answer: "12" },
  { day: 23, answer: "3" },
  { day: 24, answer: "Punktum" }
];

async function seedAnswers() {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding 24 puzzle answers...\n');

    // Get the current date in Danish timezone
    const danishDate = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
    const baseDate = new Date(danishDate);
    baseDate.setHours(0, 0, 0, 0);

    let createdCount = 0;
    let skippedCount = 0;

    for (const item of answers) {
      // Calculate unlock time for each day
      // Set to Dec 1, 2025 00:00 UTC for day 1, Dec 2 for day 2, etc.
      const unlockTime = new Date(Date.UTC(2025, 11, item.day, 0, 0, 0)); // Dec is month 11

      // Check if puzzle already exists
      const existing = await client.query(
        `SELECT id FROM puzzles WHERE day = $1`,
        [item.day]
      );

      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO puzzles (day, title, description, answer, unlock_time) 
           VALUES ($1, $2, $3, $4, $5)`,
          [
            item.day, 
            `Day ${item.day}`, 
            `Check Teams for Day ${item.day} puzzle`, 
            item.answer,
            unlockTime
          ]
        );
        console.log(`✅ Day ${String(item.day).padStart(2, '0')}: "${item.answer}"`);
        createdCount++;
      } else {
        console.log(`⏭️  Day ${String(item.day).padStart(2, '0')}: Already exists, skipping`);
        skippedCount++;
      }
    }

    console.log(`\n✅ Seeding completed!`);
    console.log(`   Created: ${createdCount} answers`);
    console.log(`   Skipped: ${skippedCount} answers`);
    console.log(`\nAll 24 puzzle answers are now in the database.`);
    console.log(`Puzzle descriptions are shared via Teams.\n`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if this is the main module
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('seed-answers.js')) {
  seedAnswers().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
}

export default seedAnswers;

/**
 * Template: 24 Christmas Puzzles
 * Use this to add all 24 puzzles to your database
 * Update the unlock_time for each day
 */

export const allPuzzles = [
  {
    day: 1,
    title: "December 1st Mystery",
    description: "What has a head and a tail but no body?",
    answer: "coin"
  },
  {
    day: 2,
    title: "Mathematical Marvel",
    description: "What number comes next? 2, 4, 8, 16, ?",
    answer: "32"
  },
  {
    day: 3,
    title: "Riddle of the Sphinx",
    description: "What question can you never answer 'yes' to?",
    answer: "are you asleep"
  },
  {
    day: 4,
    title: "Logic Challenge",
    description: "I speak without a mouth and hear without ears. What am I?",
    answer: "echo"
  },
  {
    day: 5,
    title: "Christmas Counting",
    description: "How many reindeer pull Santa's sleigh?",
    answer: "9"
  },
  {
    day: 6,
    title: "Tricky Wording",
    description: "What word becomes shorter when you add two letters to it?",
    answer: "short"
  },
  {
    day: 7,
    title: "Winter Wisdom",
    description: "How many sides does a snowflake typically have?",
    answer: "6"
  },
  {
    day: 8,
    title: "Math Puzzle",
    description: "If you have 10 apples and remove 3, how many do you have?",
    answer: "3"
  },
  {
    day: 9,
    title: "Pattern Recognition",
    description: "Complete the series: A, Z, B, Y, C, X, D, ?",
    answer: "W"
  },
  {
    day: 10,
    title: "Holiday Trivia",
    description: "In what year was the first Christmas tree decorated?",
    answer: "1605"
  },
  {
    day: 11,
    title: "Wordplay Wizard",
    description: "What can run but never walks, has a mouth but never talks?",
    answer: "river"
  },
  {
    day: 12,
    title: "Number Game",
    description: "What is 25% of 80?",
    answer: "20"
  },
  {
    day: 13,
    title: "Mysterious Object",
    description: "I have keys but no locks. What am I?",
    answer: "piano"
  },
  {
    day: 14,
    title: "Logical Deduction",
    description: "If a rooster lays an egg on the roof, which way does it roll?",
    answer: "roosters don't lay eggs"
  },
  {
    day: 15,
    title: "Time Teaser",
    description: "How many months have 28 days?",
    answer: "all of them"
  },
  {
    day: 16,
    title: "Santa's Secret",
    description: "What do you call a line of people waiting to see Santa?",
    answer: "wait list"
  },
  {
    day: 17,
    title: "Cryptic Code",
    description: "I have a face and two hands, but no arms or legs. What am I?",
    answer: "clock"
  },
  {
    day: 18,
    title: "Mathematical Mystery",
    description: "What is the only number that is spelled with letters in alphabetical order?",
    answer: "forty"
  },
  {
    day: 19,
    title: "Hidden Riddle",
    description: "What has a neck but no head?",
    answer: "bottle"
  },
  {
    day: 20,
    title: "Festive Fun",
    description: "How many golden rings are mentioned in 'The Twelve Days of Christmas'?",
    answer: "5"
  },
  {
    day: 21,
    title: "Puzzle of Presence",
    description: "I have cities but no houses, forests but no trees, and water but no fish. What am I?",
    answer: "map"
  },
  {
    day: 22,
    title: "Seasonal Strategy",
    description: "If it takes 8 elves 8 hours to wrap 8 presents, how long does it take 1 elf to wrap 1 present?",
    answer: "8"
  },
  {
    day: 23,
    title: "Final Frontier",
    description: "What gets wetter the more it dries?",
    answer: "towel"
  },
  {
    day: 24,
    title: "The Grand Finale",
    description: "I'm full of keys but can't open any door. What am I?",
    answer: "keyboard"
  }
];

/**
 * Usage instructions:
 * 
 * 1. Create a new file: backend/src/db/seed-all-puzzles.js
 * 
 * 2. Add this content:
 * 
 * import pool from './pool.js';
 * import { allPuzzles } from '../../PUZZLES_TEMPLATE.js';
 * 
 * async function seedAllPuzzles() {
 *   const client = await pool.connect();
 *   try {
 *     console.log('🌱 Seeding all 24 Christmas puzzles...\n');
 * 
 *     const danishDate = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
 *     const baseDate = new Date(danishDate);
 *     baseDate.setHours(0, 0, 0, 0);
 * 
 *     for (const puzzle of allPuzzles) {
 *       const unlockTime = new Date(baseDate);
 *       unlockTime.setDate(unlockTime.getDate() + puzzle.day - 1);
 * 
 *       const existing = await client.query(
 *         `SELECT id FROM puzzles WHERE day = $1`,
 *         [puzzle.day]
 *       );
 * 
 *       if (existing.rows.length === 0) {
 *         await client.query(
 *           `INSERT INTO puzzles (day, title, description, answer, unlock_time)
 *            VALUES ($1, $2, $3, $4, $5)`,
 *           [puzzle.day, puzzle.title, puzzle.description, puzzle.answer, unlockTime]
 *         );
 *         console.log(`✅ Day ${puzzle.day}: ${puzzle.title}`);
 *       }
 *     }
 * 
 *     console.log('\n✅ All 24 puzzles seeded!');
 *   } catch (error) {
 *     console.error('❌ Error:', error);
 *     throw error;
 *   } finally {
 *     client.release();
 *   }
 * }
 * 
 * if (import.meta.url === `file://${process.argv[1]}`) {
 *   seedAllPuzzles().catch(err => {
 *     console.error(err);
 *     process.exit(1);
 *   });
 * }
 * 
 * 3. Run: node backend/src/db/seed-all-puzzles.js
 * 
 * CUSTOMIZE THESE PUZZLES!
 * Feel free to replace with your own puzzles, but keep:
 * - day: 1-24
 * - title: Unique title
 * - description: The puzzle/riddle
 * - answer: The correct answer (will be case-insensitive)
 */

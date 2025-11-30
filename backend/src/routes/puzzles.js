import express from 'express';
import { query } from '../db/pool.js';

const router = express.Router();

// Get all available puzzles (with daily unlock check for Danish timezone)
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, day, title, description, unlock_time FROM puzzles ORDER BY day ASC`
    );

    // Add Danish timezone check for which puzzles are unlocked
    const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
    const puzzles = result.rows.map(puzzle => ({
      ...puzzle,
      is_unlocked: new Date(puzzle.unlock_time) <= new Date(now)
    }));

    res.json(puzzles);
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    res.status(500).json({ error: 'Failed to fetch puzzles' });
  }
});

// Get specific puzzle
router.get('/:day', async (req, res) => {
  try {
    const { day } = req.params;
    const dayNum = parseInt(day);
    
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 24) {
      return res.status(400).json({ error: 'Invalid day (must be 1-24)' });
    }

    const result = await query(
      `SELECT id, day, title, description, unlock_time FROM puzzles WHERE day = $1`,
      [dayNum]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    const puzzle = result.rows[0];
    const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
    puzzle.is_unlocked = new Date(puzzle.unlock_time) <= new Date(now);

    res.json(puzzle);
  } catch (error) {
    console.error('Error fetching puzzle:', error);
    res.status(500).json({ error: 'Failed to fetch puzzle' });
  }
});

export default router;

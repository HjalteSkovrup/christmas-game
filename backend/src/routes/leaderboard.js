import express from 'express';
import { query } from '../db/pool.js';

const router = express.Router();

// Get real-time leaderboard
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT participant_id, CAST(correct_answers AS INTEGER) as correct_answers, last_submission FROM leaderboard LIMIT 100`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get leaderboard for specific participant
router.get('/:participant_id', async (req, res) => {
  try {
    const { participant_id } = req.params;
    
    const result = await query(
      `SELECT participant_id, correct_answers, last_submission FROM leaderboard WHERE participant_id = $1`,
      [participant_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;

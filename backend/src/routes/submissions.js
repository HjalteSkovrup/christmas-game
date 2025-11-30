import express from 'express';
import { query } from '../db/pool.js';
import { validatePasskey, logAudit } from '../middleware/auth.js';

const router = express.Router();

// Submit an answer
router.post('/', async (req, res) => {
  try {
    const { participant_id, passkey, puzzle_id, answer } = req.body;

    // Validate input
    if (!participant_id || !passkey || !puzzle_id || !answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate participant and passkey
    const participantResult = await query(
      `SELECT id FROM participants WHERE participant_id = $1`,
      [participant_id]
    );

    let participantDbId;
    if (participantResult.rows.length === 0) {
      // Create new participant on first submission
      const newParticipant = await query(
        `INSERT INTO participants (participant_id, passkey_hash) VALUES ($1, $2) RETURNING id`,
        [participant_id, Buffer.from(passkey).toString('base64')] // Simple hash for demo (use bcrypt in production)
      );
      participantDbId = newParticipant.rows[0].id;
    } else {
      participantDbId = participantResult.rows[0].id;
      
      // Verify passkey
      const dbPasskey = await query(
        `SELECT passkey_hash FROM participants WHERE participant_id = $1`,
        [participant_id]
      );
      
      if (Buffer.from(passkey).toString('base64') !== dbPasskey.rows[0].passkey_hash) {
        await logAudit(participantDbId, 'FAILED_PASSKEY', { puzzle_day: puzzle_id });
        return res.status(401).json({ error: 'Invalid passkey' });
      }
    }

    // Get puzzle by day number (puzzle_id is actually the day: 1-24)
    const puzzleResult = await query(
      `SELECT id, answer, day, unlock_time FROM puzzles WHERE day = $1`,
      [puzzle_id]
    );

    if (puzzleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    const puzzle = puzzleResult.rows[0];

    // Check if puzzle is unlocked (Danish timezone)
    const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
    if (new Date(puzzle.unlock_time) > new Date(now)) {
      await logAudit(participantDbId, 'EARLY_SUBMISSION', { puzzle_day: puzzle.day });
      return res.status(403).json({ error: 'Puzzle not yet unlocked' });
    }

    // Check if user already submitted a correct answer for this puzzle
    const existingCorrectSubmission = await query(
      `SELECT id FROM submissions WHERE participant_id = $1 AND puzzle_id = $2 AND is_correct = true`,
      [participantDbId, puzzle.id]
    );

    if (existingCorrectSubmission.rows.length > 0) {
      await logAudit(participantDbId, 'DUPLICATE_CORRECT', { puzzle_day: puzzle.day });
      return res.status(400).json({ error: 'You already submitted a correct answer for this puzzle' });
    }

    // Allow multiple submissions per puzzle - users can try as many times as they want (until correct)
    // Validate answer (case-insensitive)
    const isCorrect = answer.toLowerCase().trim() === puzzle.answer.toLowerCase().trim();

    // Store submission
    await query(
      `INSERT INTO submissions (participant_id, puzzle_id, answer_submitted, is_correct) 
       VALUES ($1, $2, $3, $4)`,
      [participantDbId, puzzle.id, answer, isCorrect]
    );

    await logAudit(participantDbId, 'SUBMISSION', { puzzle_day: puzzle.day, is_correct: isCorrect });

    res.json({
      success: true,
      is_correct: isCorrect,
      message: isCorrect ? '✅ Correct!' : '❌ Incorrect, try again!'
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

export default router;

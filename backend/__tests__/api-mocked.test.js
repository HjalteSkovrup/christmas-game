import { describe, test, expect, beforeEach, vi } from 'vitest';

// Mock data storage
const mockParticipants = new Map();
const mockSubmissions = [];
let participantIdCounter = 100;
let submissionIdCounter = 1;

// Mock puzzles data
const mockPuzzles = [
  { id: 1, day: 1, title: "New Year's Math", description: "What is 7 + 5?", answer: "12", unlock_time: new Date(Date.now() - 86400000) },
  { id: 2, day: 2, title: "Logic Puzzle", description: "I speak without a mouth...", answer: "echo", unlock_time: new Date(Date.now() - 86400000) },
  { id: 3, day: 3, title: "Pattern", description: "2, 4, 8, 16, ?", answer: "32", unlock_time: new Date(Date.now() - 86400000) },
  { id: 4, day: 4, title: "Word Play", description: "What word...", answer: "short", unlock_time: new Date(Date.now() - 86400000) },
  { id: 5, day: 5, title: "Trivia", description: "How many reindeer?", answer: "9", unlock_time: new Date(Date.now() - 86400000) }
];

// Mock the pool module with factory function
vi.mock('../src/db/pool.js', () => {
  const mockFn = vi.fn(async (text, params) => {
    // GET all puzzles
    if (text.includes('SELECT id, day, title, description') && !text.includes('WHERE')) {
      return { rows: mockPuzzles.map(p => ({ ...p, is_unlocked: true })) };
    }

    // GET single puzzle
    if (text.includes('SELECT id, day, title, description') && text.includes('WHERE day = $1')) {
      const puzzle = mockPuzzles.find(p => p.day === params[0]);
      if (!puzzle) return { rows: [] };
      return { rows: [{ ...puzzle, is_unlocked: true }] };
    }

    // SELECT participant
    if (text.includes('SELECT id FROM participants WHERE participant_id = $1')) {
      const participant = mockParticipants.get(params[0]);
      if (!participant) return { rows: [] };
      return { rows: [{ id: participant.id }] };
    }

    // INSERT participant
    if (text.includes('INSERT INTO participants')) {
      const id = ++participantIdCounter;
      mockParticipants.set(params[0], { id, participant_id: params[0], passkey_hash: params[1] });
      return { rows: [{ id }] };
    }

    // SELECT passkey_hash
    if (text.includes('SELECT passkey_hash FROM participants')) {
      const participant = mockParticipants.get(params[0]);
      if (!participant) return { rows: [] };
      return { rows: [{ passkey_hash: participant.passkey_hash }] };
    }

    // GET puzzle for submission
    if (text.includes('SELECT id, answer, day, unlock_time FROM puzzles WHERE day = $1')) {
      const puzzle = mockPuzzles.find(p => p.day === params[0]);
      if (!puzzle) return { rows: [] };
      return { rows: [puzzle] };
    }

    // GET puzzle for submission (by ID)
    if (text.includes('SELECT id, answer, day, unlock_time FROM puzzles WHERE id = $1')) {
      const puzzle = mockPuzzles.find(p => p.id === params[0]);
      if (!puzzle) return { rows: [] };
      return { rows: [puzzle] };
    }

    // CHECK existing correct submission (new check for duplicate correct answers)
    if (text.includes('SELECT id FROM submissions WHERE participant_id = $1 AND puzzle_id = $2 AND is_correct = true')) {
      const submission = mockSubmissions.find(s => s.participant_id === params[0] && s.puzzle_id === params[1] && s.is_correct === true);
      return { rows: submission ? [{ id: submission.id }] : [] };
    }

    // CHECK existing submission (for other checks)
    if (text.includes('SELECT id FROM submissions WHERE participant_id = $1 AND puzzle_id = $2')) {
      const submission = mockSubmissions.find(s => s.participant_id === params[0] && s.puzzle_id === params[1]);
      return { rows: submission ? [{ id: submission.id }] : [] };
    }

    // INSERT submission
    if (text.includes('INSERT INTO submissions')) {
      const submission = {
        id: submissionIdCounter++,
        participant_id: params[0],
        puzzle_id: params[1],
        answer_submitted: params[2],
        is_correct: params[3],
        submitted_at: new Date()
      };
      mockSubmissions.push(submission);
      return { rows: [submission] };
    }

    // GET leaderboard
    if (text.includes('leaderboard') || text.includes('participants p')) {
      const leaderboard = Array.from(mockParticipants.values()).map(p => {
        const correctCount = mockSubmissions.filter(s => s.participant_id === p.id && s.is_correct).length;
        const lastSubmission = mockSubmissions.filter(s => s.participant_id === p.id).pop()?.submitted_at;
        return {
          participant_id: p.participant_id,
          correct_answers: correctCount,
          last_submission: lastSubmission
        };
      }).sort((a, b) => b.correct_answers - a.correct_answers);
      return { rows: leaderboard };
    }

    // INSERT audit log
    if (text.includes('INSERT INTO audit_log')) {
      return { rows: [] };
    }

    return { rows: [] };
  });

  return {
    default: {
      connect: vi.fn(async () => ({ release: vi.fn() })),
      query: mockFn,
      on: vi.fn()
    },
    query: mockFn,
    getClient: vi.fn(async () => ({ release: vi.fn() }))
  };
});

// Now import after mocking
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import puzzleRoutes from '../src/routes/puzzles.js';
import submissionRoutes from '../src/routes/submissions.js';
import leaderboardRoutes from '../src/routes/leaderboard.js';

// Create test app
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/api/puzzles', puzzleRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Tests
describe('API with Mocked Database', () => {

  beforeEach(() => {
    mockParticipants.clear();
    mockSubmissions.length = 0;
    participantIdCounter = 100;
    submissionIdCounter = 1;
  });

  describe('Health & Basic', () => {
    test('GET /api/health returns ok', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Puzzle Endpoints', () => {
    test('GET /api/puzzles returns array of 5 puzzles', async () => {
      const response = await request(app)
        .get('/api/puzzles')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5);
    });

    test('GET /api/puzzles/1 returns Day 1 puzzle', async () => {
      const response = await request(app)
        .get('/api/puzzles/1')
        .expect(200);
      expect(response.body.day).toBe(1);
      expect(response.body.title).toBe("New Year's Math");
    });

    test('GET /api/puzzles/999 returns validation error', async () => {
      await request(app)
        .get('/api/puzzles/999')
        .expect(400);
    });
  });

  describe('Submission Endpoints', () => {
    test('POST /api/submissions creates new participant and submits answer', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .send({
          participant_id: 'testuser1',
          passkey: 'testpass123',
          puzzle_id: 1,
          answer: '12'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.is_correct).toBe(true);
      expect(mockParticipants.has('testuser1')).toBe(true);
    });

    test('POST /api/submissions returns 200 for correct answer', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .send({
          participant_id: 'user_correct',
          passkey: 'pass',
          puzzle_id: 2,
          answer: 'echo'
        })
        .expect(200);

      expect(response.body.is_correct).toBe(true);
    });

    test('POST /api/submissions returns is_correct: false for wrong answer', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .send({
          participant_id: 'user_wrong',
          passkey: 'pass',
          puzzle_id: 1,
          answer: 'wrong'
        })
        .expect(200);

      expect(response.body.is_correct).toBe(false);
    });

    test('POST /api/submissions rejects wrong passkey', async () => {
      // Create participant first
      mockParticipants.set('securityuser', { 
        id: 100, 
        participant_id: 'securityuser', 
        passkey_hash: Buffer.from('rightpass').toString('base64') 
      });

      const response = await request(app)
        .post('/api/submissions')
        .send({
          participant_id: 'securityuser',
          passkey: 'wrongpass',
          puzzle_id: 1,
          answer: '12'
        });

      expect(response.status).toBe(401);
    });

    test('POST /api/submissions prevents duplicate submission on same puzzle', async () => {
      // First submission - success
      await request(app)
        .post('/api/submissions')
        .send({
          participant_id: 'dup_user',
          passkey: 'pass',
          puzzle_id: 3,
          answer: '32'
        })
        .expect(200);

      // Second submission same puzzle - should fail
      const response = await request(app)
        .post('/api/submissions')
        .send({
          participant_id: 'dup_user',
          passkey: 'pass',
          puzzle_id: 3,
          answer: '32'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already submitted a correct answer');
    });

    test('Case-insensitive answer matching works', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .send({
          participant_id: 'case_user',
          passkey: 'pass',
          puzzle_id: 2,
          answer: 'ECHO'
        })
        .expect(200);

      expect(response.body.is_correct).toBe(true);
    });

    test('Answer with spaces gets trimmed and matched', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .send({
          participant_id: 'space_user',
          passkey: 'pass',
          puzzle_id: 2,
          answer: '  echo  '
        })
        .expect(200);

      expect(response.body.is_correct).toBe(true);
    });
  });

  describe('Leaderboard', () => {
    test('GET /api/leaderboard returns rankings', async () => {
      // Setup test data
      mockParticipants.set('leader1', { id: 100, participant_id: 'leader1', passkey_hash: 'hash1' });
      mockParticipants.set('leader2', { id: 101, participant_id: 'leader2', passkey_hash: 'hash2' });
      
      mockSubmissions.push({ participant_id: 100, puzzle_id: 1, is_correct: true });
      mockSubmissions.push({ participant_id: 100, puzzle_id: 2, is_correct: true });
      mockSubmissions.push({ participant_id: 101, puzzle_id: 1, is_correct: true });

      const response = await request(app)
        .get('/api/leaderboard')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].participant_id).toBe('leader1');
      expect(response.body[0].correct_answers).toBe(2);
      expect(response.body[1].correct_answers).toBe(1);
    });
  });

});

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const puzzleService = {
  async getPuzzles() {
    const response = await api.get('/puzzles');
    return response.data;
  },

  async getPuzzle(day) {
    const response = await api.get(`/puzzles/${day}`);
    return response.data;
  }
};

export const submissionService = {
  async submitAnswer(participant_id, passkey, puzzle_id, answer) {
    const response = await api.post('/submissions', {
      participant_id,
      passkey,
      puzzle_id,
      answer
    });
    return response.data;
  }
};

export const leaderboardService = {
  async getLeaderboard() {
    const response = await api.get('/leaderboard');
    return response.data;
  },

  async getParticipantScore(participant_id) {
    const response = await api.get(`/leaderboard/${participant_id}`);
    return response.data;
  }
};

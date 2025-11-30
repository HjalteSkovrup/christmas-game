import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../services/api';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadLeaderboard() {
    try {
      const data = await leaderboardService.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="leaderboard">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard">
      <h3>🏆 Leaderboard</h3>
      
      {leaderboard.length === 0 ? (
        <p className="empty">No submissions yet</p>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((entry, index) => (
            <div key={entry.participant_id} className="leaderboard-entry">
              <span className={`rank rank-${index === 0 ? '1' : index === 1 ? '2' : index === 2 ? '3' : 'n'}`}>
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `${index + 1}.`}
              </span>
              <span className="name">{entry.participant_id}</span>
              <span className="score">{entry.correct_answers}/24</span>
            </div>
          ))}
        </div>
      )}

      <button className="refresh-btn" onClick={loadLeaderboard}>
        🔄 Refresh
      </button>
    </div>
  );
}

export default Leaderboard;

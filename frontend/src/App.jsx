import React, { useState } from 'react';
import './App.css';
import DaySelector from './components/DaySelector';
import Leaderboard from './components/Leaderboard';
import { submissionService } from './services/api';

function App() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [participantId, setParticipantId] = useState('');
  const [passkey, setPasskey] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!participantId || !passkey || !answer) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await submissionService.submitAnswer(participantId, passkey, selectedDay, answer);
      setMessage(
        result.is_correct
          ? `✅ Correct! Great job on Day ${selectedDay}!`
          : `❌ Not quite right. Try again!`
      );
      setAnswer('');
      setLeaderboardKey(prev => prev + 1); // Refresh leaderboard
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <p className="company-credit">Brought to you by <a href="https://www.festinafinance.com/" target="_blank" rel="noopener noreferrer">Festina Finance</a> • Puzzles from <a href="https://nisseakademiet.dk/" target="_blank" rel="noopener noreferrer">Nisseakademiet</a></p>
        </div>
        <div className="header-title-section">
          <a href="https://www.festinafinance.com/" target="_blank" rel="noopener noreferrer" className="festina-logo">
            <div className="logo-top">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="80px" height="52px" viewBox="-123 -80.949 546 360" enableBackground="new -123 -80.949 546 360" xmlSpace="preserve">
                <polygon points="29.002,-80.949 423,-80.949 423,71.052 29.002,71.052 29.002,223.055 -123,223.055 -123,-80.949 "></polygon>
              </svg>
            </div>
            <div className="logo-bottom">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="80px" height="56px" viewBox="-123 -90.073 546 400" enableBackground="new -123 -90.073 546 400" xmlSpace="preserve">
                <polygon points="29.002,-90.073 423,-90.073 423,61.929 29.002,61.929 29.002,309.927 -123,309.927 -123,-90.073 "></polygon>
              </svg>
            </div>
          </a>
          <h1>Christmas game</h1>
          <div className="tree-spacer">🎄</div>
        </div>
        <p>24 Days of Puzzles - Check Teams for daily puzzles!</p>
      </header>
      <main className="main">
        <div className="day-selector-wrapper">
          <DaySelector selectedDay={selectedDay} onDaySelect={setSelectedDay} />

          <div className="submission-section">
            <h2>Submit Your Answer</h2>
            <p className="submission-subtitle">Day {selectedDay}</p>
            <form onSubmit={handleSubmit} className="submission-form">
              <div className="form-group">
                <label>Participant ID</label>
                <input
                  type="text"
                  value={participantId}
                  onChange={(e) => setParticipantId(e.target.value)}
                  placeholder="Your ID"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Passkey</label>
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Your passkey"
                  disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Your Answer</label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Answer'}
            </button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
        </div>

        <div className="leaderboard-wrapper">
          <Leaderboard key={leaderboardKey} />
          <div className="santa-decoration">
            <div className="santa-emoji">🎅</div>
            <p className="santa-message">Ho Ho Ho! 🎄 Merry Christmas! 🎄</p>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>© 2025 Christmas Game by Festina Finance. All rights reserved. <a href="https://www.festinafinance.com/" target="_blank" rel="noopener noreferrer">Visit Festina Finance →</a></p>
      </footer>
    </div>
  );
}

export default App;

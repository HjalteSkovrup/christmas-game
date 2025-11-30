import React from 'react';
import '../styles/DaySelector.css';
import { christmasJokes } from '../data/jokes';

function DaySelector({ selectedDay, onDaySelect }) {
  const days = Array.from({ length: 24 }, (_, i) => i + 1);
  const allDays = [...days, 25]; // Add day 25 as test day

  return (
    <div className="day-selector">
      <h2>Select a Day</h2>
      <div className="calendar-grid">
        {allDays.map((day) => (
          <button
            key={day}
            className={`calendar-day ${selectedDay === day ? 'selected' : ''} ${day === 25 ? 'test-day' : ''}`}
            onClick={() => onDaySelect(day)}
            title={day === 25 ? 'Test day - always available' : ''}
          >
            <div className="day-number">{day === 25 ? '🧪' : day}</div>
            <div className="day-emoji">{day === 25 ? 'TEST' : '🎄'}</div>
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="joke-section">
          <h3>{selectedDay === 25 ? '🧪 Test Day' : `Day ${selectedDay} Joke 😄`}</h3>
          <p className="joke-text">
            {selectedDay === 25 
              ? '"This is a test day. Answer with: test"'
              : `"${christmasJokes[selectedDay] || 'No joke available'}"`}
          </p>
        </div>
      )}
    </div>
  );
}

export default DaySelector;

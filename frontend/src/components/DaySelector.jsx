import React from 'react';
import '../styles/DaySelector.css';
import { christmasJokes } from '../data/jokes';

function DaySelector({ selectedDay, onDaySelect }) {
  const days = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div className="day-selector">
      <h2>Select a Day</h2>
      <div className="calendar-grid">
        {days.map((day) => (
          <button
            key={day}
            className={`calendar-day ${selectedDay === day ? 'selected' : ''}`}
            onClick={() => onDaySelect(day)}
          >
            <div className="day-number">{day}</div>
            <div className="day-emoji">🎄</div>
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="joke-section">
          <h3>Day {selectedDay} Joke 😄</h3>
          <p className="joke-text">
            {`"${christmasJokes[selectedDay] || 'No joke available'}"`}
          </p>
        </div>
      )}
    </div>
  );
}

export default DaySelector;

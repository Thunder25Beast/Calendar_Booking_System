// src/components/CalendarView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay
} from 'date-fns';
import './CalendarView.css';

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [currentMonth]);

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <button onClick={prevMonth}>Prev</button>
      <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={nextMonth}>Next</button>
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const dayEvents = events.filter(ev => isSameDay(new Date(ev.event_date), day));

        // Use custom classes for background colors:
        //  • No event => bg-empty
        //  • 1-2 events => bg-partial
        //  • 3 or more events => bg-full
        let cellClass = 'bg-empty';
        if (dayEvents.length > 0) {
          cellClass = dayEvents.length >= 3 ? 'bg-full' : 'bg-partial';
        }
        const textColor = isSameMonth(day, monthStart) ? 'black' : '#9ca3af';

        days.push(
          <div
            className={`calendar-cell ${cellClass}`}
            key={format(day, 'yyyy-MM-dd')}
            onClick={() => setSelectedDate(day)}
          >
            <span className="date-number" style={{ color: textColor }}>
              {formattedDate}
            </span>
            {dayEvents.length > 0 && (
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-grid" key={format(day, 'yyyy-MM-dd')}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderSelectedDateDetails = () => {
    const selectedDayEvents = events.filter(ev =>
      isSameDay(new Date(ev.event_date), selectedDate)
    );
    return (
      <div className="selected-date-details">
        <h3>Events on {format(selectedDate, 'PPP')}</h3>
        {/* Display selected date in dd-MM-yyyy format */}
        <input 
          type="text" 
          value={format(selectedDate, 'dd-MM-yyyy')} 
          readOnly 
          className="border p-2 rounded w-full mb-4"
        />
        {selectedDayEvents.length > 0 ? (
          <ul>
            {selectedDayEvents.map(ev => (
              <li key={ev.id}>
                <strong>{ev.title}</strong> ({ev.start_time} - {ev.end_time})
              </li>
            ))}
          </ul>
        ) : (
          <p>No events for this day.</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      {renderHeader()}
      {renderCells()}
      {renderSelectedDateDetails()}
    </div>
  );
};

export default CalendarView;

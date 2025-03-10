// src/components/EventList.js
import React from "react";
import "./EventList.css"; // Import the custom CSS file

const EventList = ({ events, onDelete, onEdit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 event-tile-container">
      {events.map((ev) => (
        <div
          key={ev.id }
          className="bg-white shadow-md rounded-lg p-4 transform hover:scale-105 transition duration-300 ease-in-out event-tile"
        >
          <div className="mb-3">
            <h3
              className="text-lg font-semibold event-title"
              style={{ color: "#4F6995" }}  // Primary color for consistency
            >
              {ev.title}
            </h3>
            <p className="text-sm text-gray-600 event-date">
              {new Date(ev.event_date).toLocaleDateString()}{" "}
              {/* {ev.start_time && `(${ev.start_time} - ${ev.end_time})`} */}
            </p>
            <p className="text-sm text-gray-600 event-time">
              {ev.start_time && `(${ev.start_time} - ${ev.end_time})`}
            </p>
          </div>
          <div className="flex justify-end space-x-2 event-actions">
            <button
              onClick={() => onEdit(ev)}
              className=" edit-btn bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(ev.id)}
              className="delete-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;

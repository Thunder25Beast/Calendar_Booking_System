// src/components/EventForm.js
import React, { useState, useEffect } from "react";
import "./EventForm.css"; // Import the custom CSS

// Change default initialData from {} to null
const EventForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [date, setDate] = useState(
    initialData?.event_date ? initialData.event_date.split("T")[0] : ""
  );
  const [startTime, setStartTime] = useState(initialData?.start_time || "");
  const [endTime, setEndTime] = useState(initialData?.end_time || "");

  useEffect(() => {
    // If editing (initialData exists and has an id), update the fields
    if (initialData && initialData.id) {
      setTitle(initialData.title || "");
      setDate(initialData.event_date ? initialData.event_date.split("T")[0] : "");
      setStartTime(initialData.start_time || "");
      setEndTime(initialData.end_time || "");
    } else if (initialData === null) {
      // Only clear the fields if initialData is explicitly null (i.e. not editing)
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
    }
    // If initialData is {} or a new object, it can cause repeated resets.
    // By default, use null when not editing.
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, date, start_time: startTime, end_time: endTime });
    // Do not clear fields here; let the parent reset editing mode as needed.
  };

  const clearFields = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
  };

  const animationClass = initialData?.id ? "edit-animation" : "create-animation";

  return (
    <form onSubmit={handleSubmit} className={`event-form flex flex-col gap-2 ${animationClass}`}>
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        {initialData?.id ? "Update Event" : "Add Event"}
      </button>
      <button type="button" onClick={clearFields} className="clear-btn">
        Clear
      </button>
      {initialData?.id && (
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel Edit
        </button>
      )}
    </form>
  );
};

export default EventForm;

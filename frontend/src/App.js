// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import RevoCalendar from "revo-calendar"; // Ensure this package is installed

import EventForm from "./components/EventForm";
import EventList from "./components/EventList";

const App = () => {
  // State for backend events (raw data)
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events", {
        params: { filterTitle: filter, sortBy },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filter, sortBy]);

  // Map backend events to RevoCalendar's expected format
  // Our backend events have keys: id, title, event_date, start_time, end_time
  // RevoCalendar expects: name, date (unix timestamp), allDay, extra, etc.
  const mappedEvents = events.map((ev) => ({
    name: ev.title,
    date: +new Date(ev.event_date), // Convert to a 13-digit timestamp
    allDay: false, // Adjust as needed
    extra: {
      text: `${ev.start_time || ""} - ${ev.end_time || ""}`.trim(),
      icon: "", // Optionally provide an SVG icon path here
    },
    id: ev.id, // Preserve id for our own purposes
  }));

  // Handler for adding an event via the EventForm component
  const addEvent = async (data) => {
    try {
      await axios.post("/api/events", data);
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Handler for updating an event
  const updateEvent = async (data) => {
    if (!editingEvent) return;
    try {
      await axios.put(`/api/events/${editingEvent.id}`, data);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Handler for deleting an event
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar Application</h1>

      {/* 1. RevoCalendar Section */}
      <div className="mb-8">
        <RevoCalendar
          events={mappedEvents}
          // You can optionally add callbacks; below are examples:
          addEvent={(dateObj) =>
            console.log("Date selected in calendar for adding event:", dateObj)
          }        
         
          
          // Customize appearance via props:
          highlightToday={true}
          lang="en"
          primaryColor="#4F6995"
          secondaryColor="#D7E6EE"
          todayColor="#3B3966"
          textColor="#333333"
          indicatorColor="orange"
          animationSpeed={300}
          sidebarWidth={180}
          detailWidth={280}
          showDetailToggler={true}
          showSidebarToggler={true}
          onePanelAtATime={false}
          openDetailsOnDateSelection={true}
          timeFormat24={true}
          showAllDayLabel={false}
          detailDateFormat="DD/MM/YYYY"
          dateSelected={(date) => console.log("Selected date:", date)}
          eventSelected={(index) => console.log("Event selected at index:", index)}
        />
      </div>

      {/* 2. Filtering and Sorting Controls */}
      <div className="mb-4 filter-sort-container">
        <input
          type="text"
          placeholder="Filter events by title"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">Sort By</option>
          <option value="event_date">Date Ascending</option>
          <option value="-event_date">Date Descending</option>
        </select>
      </div>

      {/* 3. Event Form for Creating/Editing Events */}
      <div className="mb-4">
        {editingEvent ? (
          <EventForm initialData={editingEvent} onSubmit={updateEvent}  onCancel={() => setEditingEvent(null)} />
        ) : (
          <EventForm onSubmit={addEvent} />
        )}
      </div>

      {/* 4. Event List for Viewing, Editing, and Deleting */}
      <div className="mb-4">
        <EventList
          events={events}
          onDelete={deleteEvent}
          onEdit={(ev) => setEditingEvent(ev)}
        />
      </div>
    </div>
  );
};

export default App;

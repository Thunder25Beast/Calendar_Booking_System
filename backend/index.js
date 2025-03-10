// index.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',       // Use your MySQL username
  password: 'Lak12',   // Use your MySQL password
  database: 'calendar_app_db', // The database created earlier
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create the 'events' table if it doesn't exist
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      event_date DATE NOT NULL,
      start_time TIME,   -- when the booking starts on that date
      end_time TIME      -- when the booking ends on that date
    )

    `);
    console.log('Events table ready.');
  } catch (err) {
    console.error('Error creating table:', err);
  }
})();

// CRUD Endpoints

// GET all events (with optional filtering and sorting)
// GET all events with optional filtering and sorting
app.get('/api/events', async (req, res) => {
  try {
    const { filterTitle, sortBy } = req.query;
    let query = 'SELECT * FROM events';
    const queryParams = [];
    
    if (filterTitle) {
      query += ' WHERE title LIKE ?';
      queryParams.push(`%${filterTitle}%`);
    }
    
    if (sortBy) {
      const direction = sortBy.startsWith('-') ? 'DESC' : 'ASC';
      query += ` ORDER BY event_date ${direction}`;
    }
    
    const [rows] = await pool.query(query, queryParams);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST a new event
// POST a new event (booking)
app.post('/api/events', async (req, res) => {
  try {
    const { title, date, start_time, end_time } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and Date are required' });
    }
    // Use start_time and end_time if provided (otherwise store as NULL)
    const [result] = await pool.query(
      'INSERT INTO events (title, event_date, start_time, end_time) VALUES (?, ?, ?, ?)',
      [title, date, start_time || null, end_time || null]
    );
    // Retrieve and return the newly created event
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT to update an event
// PUT to update an event (booking)
app.put('/api/events/:id', async (req, res) => {
  try {
    const { title, date, start_time, end_time } = req.body;
    const { id } = req.params;
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and Date are required' });
    }
    await pool.query(
      'UPDATE events SET title = ?, event_date = ?, start_time = ?, end_time = ? WHERE id = ?',
      [title, date, start_time || null, end_time || null, id]
    );
    // Retrieve and return the updated event
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

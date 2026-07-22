require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- MySQL connection pool ----
// Railway (and most hosts) give you a single connection string.
// If DATABASE_URL is set, use it. Otherwise fall back to individual vars.
const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });

// Create the table automatically if it doesn't exist yet
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      age INT NOT NULL,
      address VARCHAR(255) NOT NULL,
      email VARCHAR(150) NOT NULL,
      pin_code VARCHAR(20) NOT NULL,
      phone_number VARCHAR(20) NOT NULL,
      hobbies VARCHAR(500),
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table "students" is ready.');
}

// ---- API: receive form submission ----
app.post('/api/submit', async (req, res) => {
  try {
    const { name, age, address, email, pinCode, phoneNumber, hobbies } = req.body;

    // Basic server-side validation
    if (!name || !age || !address || !email || !pinCode || !phoneNumber) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const hobbiesStr = Array.isArray(hobbies) ? hobbies.join(', ') : (hobbies || '');

    await pool.query(
      `INSERT INTO students (name, age, address, email, pin_code, phone_number, hobbies)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, age, address, email, pinCode, phoneNumber, hobbiesStr]
    );

    res.json({ success: true, message: 'Form submitted successfully!' });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ error: 'Something went wrong while saving your response. Please try again.' });
  }
});

// Optional: simple endpoint to view all submissions (protect this in production!)
app.get('/api/submissions', async (req, res) => {
  try {
    const key = req.query.key;
    if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized. Add ?key=YOUR_ADMIN_KEY to the URL.' });
    }
    const [rows] = await pool.query('SELECT * FROM students ORDER BY submitted_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Could not fetch submissions.' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

ensureTable()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

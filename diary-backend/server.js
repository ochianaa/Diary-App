const express = require('express');
const cors = require('cors');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// GET all notes
app.get('/diary_notes', (req, res) => {
  db.query('SELECT * FROM diary_notes', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET notes by ID
app.get('/diary_notes/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM diary_notes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Note not found' });
    res.json(results[0]);
  });
});

// POST notes
app.post('/diary_notes', (req, res) => {
  const { title, content } = req.body;
  db.query(
    'INSERT INTO diary_notes (title, content) VALUES (?, ?)',
    [title, content],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: results.insertId, title, content });
    }
  );
});

// PUT notes
app.put('/diary_notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.query(
    'UPDATE diary_notes SET title = ?, content = ? WHERE id = ?',
    [title, content, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });
      res.json({ id, title, content });
    }
  );
});

// DELETE notes
app.delete('/diary_notes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM diary_notes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

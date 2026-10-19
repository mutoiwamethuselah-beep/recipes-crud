require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the frontend too (handy for single-link cloud deployment)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const getOne = db.prepare('SELECT * FROM recipes WHERE id = ?');

function validate(body) {
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    return 'title is required';
  }
  for (const f of ['prep_time_minutes', 'servings']) {
    if (body[f] !== undefined && body[f] !== null && body[f] !== '' && !Number.isInteger(Number(body[f]))) {
      return `${f} must be an integer`;
    }
  }
  return null;
}

const num = (v) => (v === undefined || v === null || v === '' ? null : Number(v));

// GET /api/recipes -> list all
app.get('/api/recipes', (req, res) => {
  const rows = db.prepare('SELECT * FROM recipes ORDER BY id').all();
  res.json(rows);
});

// GET /api/recipes/:id -> get one
app.get('/api/recipes/:id', (req, res) => {
  const row = getOne.get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Recipe not found' });
  res.json(row);
});

// POST /api/recipes -> create
app.post('/api/recipes', (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const b = req.body;
  const info = db
    .prepare(
      `INSERT INTO recipes (title, category, ingredients, instructions, prep_time_minutes, servings)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(b.title.trim(), b.category || null, b.ingredients || null, b.instructions || null, num(b.prep_time_minutes), num(b.servings));
  res.status(201).json(getOne.get(info.lastInsertRowid));
});

// PUT /api/recipes/:id -> update
app.put('/api/recipes/:id', (req, res) => {
  if (!getOne.get(req.params.id)) return res.status(404).json({ error: 'Recipe not found' });
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const b = req.body;
  db.prepare(
    `UPDATE recipes
     SET title = ?, category = ?, ingredients = ?, instructions = ?,
         prep_time_minutes = ?, servings = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(b.title.trim(), b.category || null, b.ingredients || null, b.instructions || null, num(b.prep_time_minutes), num(b.servings), req.params.id);
  res.json(getOne.get(req.params.id));
});

// DELETE /api/recipes/:id -> delete
app.delete('/api/recipes/:id', (req, res) => {
  const row = getOne.get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Recipe not found' });
  db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id);
  res.json({ message: 'Recipe deleted', deleted: row });
});

// JSON 404 + error handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

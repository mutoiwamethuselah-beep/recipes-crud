require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Uses the SQLite that is built into Node.js (v22.13 or newer) - no native install needed.
let DatabaseSync;
try {
  ({ DatabaseSync } = require('node:sqlite'));
} catch (e) {
  console.error('This project needs Node.js 22.13 or newer (SQLite is built in).');
  console.error('Download the LTS version from https://nodejs.org and try again.');
  process.exit(1);
}

const dbFile = path.resolve(__dirname, process.env.DB_FILE || './recipes.db');
const db = new DatabaseSync(dbFile);

// Create the table and seed sample data only the first time (new DB)
const tableExists = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='recipes'")
  .get();

if (!tableExists) {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
  console.log('Database created and seeded from schema.sql');
}

module.exports = db;

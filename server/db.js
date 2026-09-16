const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'quiz.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
  }
});

function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Questions table
      db.run(`
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          question_text TEXT NOT NULL,
          options TEXT NOT NULL, -- JSON array string
          correct_option INTEGER NOT NULL, -- index 0-3
          difficulty TEXT DEFAULT 'medium',
          source TEXT DEFAULT 'static',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Rooms table
      db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          room_code TEXT UNIQUE NOT NULL,
          host_id TEXT NOT NULL,
          categories TEXT NOT NULL, -- JSON array
          question_count INTEGER DEFAULT 10,
          timer_seconds INTEGER DEFAULT 15,
          status TEXT DEFAULT 'LOBBY',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Players table
      db.run(`
        CREATE TABLE IF NOT EXISTS players (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          room_code TEXT NOT NULL,
          nickname TEXT NOT NULL,
          score INTEGER DEFAULT 0,
          socket_id TEXT NOT NULL,
          is_host INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Game Sessions table
      db.run(`
        CREATE TABLE IF NOT EXISTS game_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          room_code TEXT NOT NULL,
          question_id INTEGER NOT NULL,
          start_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

// Helper methods for DB interaction
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  db,
  initDatabase,
  runQuery,
  getQuery,
  allQuery
};

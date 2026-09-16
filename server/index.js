const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase, allQuery, runQuery, getQuery } = require('./db');
const { seedQuestionsIfEmpty } = require('./questionsSeed');
const { fetchAndGenerateNewsQuestions, initNewsCronJob } = require('./newsService');
const { initSocketHandlers } = require('./socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// REST API Endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const rows = await allQuery('SELECT category, COUNT(*) as count FROM questions GROUP BY category ORDER BY category ASC');
    const categories = rows.map(r => ({ category: r.category, count: r.count }));
    const totalRow = await getQuery('SELECT COUNT(*) as total FROM questions');
    res.json({ categories, totalQuestions: totalRow ? totalRow.total : 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/questions', async (req, res) => {
  try {
    const questions = await allQuery('SELECT id, category, question_text, options, correct_option, difficulty, source FROM questions ORDER BY id DESC');
    const parsed = questions.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));
    res.json({ questions: parsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const { category, questionText, options, correctOption, difficulty } = req.body;
    if (!category || !questionText || !options || correctOption === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await runQuery(
      `INSERT INTO questions (category, question_text, options, correct_option, difficulty, source)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [category, questionText, JSON.stringify(options), parseInt(correctOption), difficulty || 'medium', 'admin_rest']
    );

    res.json({ success: true, id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news/refresh', async (req, res) => {
  const result = await fetchAndGenerateNewsQuestions();
  res.json(result);
});

// Initialize database & start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDatabase();
    await seedQuestionsIfEmpty();
    initNewsCronJob();
    initSocketHandlers(io);

    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 AUREX Live Trivia Server running at http://localhost:${PORT}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();

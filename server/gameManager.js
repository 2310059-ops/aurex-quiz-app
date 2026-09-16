const { allQuery, runQuery } = require('./db');

// In-memory active game state storage
const activeRooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

class RoomState {
  constructor(roomCode, hostSocketId, hostNickname, settings) {
    this.roomCode = roomCode;
    this.hostSocketId = hostSocketId;
    this.settings = {
      categories: settings.categories || ['General Knowledge'],
      questionCount: settings.questionCount || 10,
      timerSeconds: settings.timerSeconds || 15,
      difficulty: settings.difficulty || 'all'
    };
    this.status = 'LOBBY';
    this.players = new Map();
    this.questions = [];
    this.currentQuestionIndex = -1;
    this.timer = null;
    this.questionStartTime = 0;
    this.timeRemaining = 0;
    this.answersReceived = new Map();
    this.questionHistory = [];

    this.addPlayer(hostSocketId, hostNickname, true);
  }

  addPlayer(socketId, nickname, isHost = false) {
    const player = {
      socketId,
      nickname,
      score: 0,
      streak: 0,
      isHost,
      totalResponseTimeSec: 0,
      totalAnswered: 0,
      correctCount: 0,
      avgResponseTimeSec: 0,
      lastResponseTimeSec: 0,
      lastAnswerResult: null
    };
    this.players.set(socketId, player);
    return player;
  }

  removePlayer(socketId) {
    this.players.delete(socketId);
    if (socketId === this.hostSocketId && this.players.size > 0) {
      const nextHost = this.players.values().next().value;
      this.hostSocketId = nextHost.socketId;
      nextHost.isHost = true;
    }
  }

  getPlayersList() {
    return Array.from(this.players.values()).map(p => ({
      socketId: p.socketId,
      nickname: p.nickname,
      score: p.score,
      streak: p.streak,
      isHost: p.isHost,
      correctCount: p.correctCount || 0,
      totalAnswered: p.totalAnswered || 0,
      accuracyPct: p.totalAnswered > 0 ? Math.round(((p.correctCount || 0) / p.totalAnswered) * 100) : 0,
      totalTimeSec: p.totalResponseTimeSec ? p.totalResponseTimeSec.toFixed(1) : '0.0',
      avgResponseTimeSec: p.avgResponseTimeSec ? p.avgResponseTimeSec.toFixed(1) : '0.0',
      lastResponseTimeSec: p.lastResponseTimeSec ? p.lastResponseTimeSec.toFixed(1) : '-'
    }));
  }

  getLeaderboard() {
    return this.getPlayersList().sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-breaker: lower average response time wins
      return (parseFloat(a.avgResponseTimeSec) || 99) - (parseFloat(b.avgResponseTimeSec) || 99);
    });
  }
}

async function createRoom(socketId, nickname, settings) {
  let roomCode = generateRoomCode();
  while (activeRooms.has(roomCode)) {
    roomCode = generateRoomCode();
  }

  const room = new RoomState(roomCode, socketId, nickname, settings);
  activeRooms.set(roomCode, room);

  try {
    await runQuery(
      `INSERT INTO rooms (room_code, host_id, categories, question_count, timer_seconds, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        roomCode,
        socketId,
        JSON.stringify(room.settings.categories),
        room.settings.questionCount,
        room.settings.timerSeconds,
        'LOBBY'
      ]
    );
  } catch (err) {
    console.error('Error persisting room to DB:', err);
  }

  return room;
}

function getRoom(roomCode) {
  return activeRooms.get(roomCode ? roomCode.toUpperCase() : '');
}

async function prepareQuestions(room) {
  const { categories, questionCount, difficulty } = room.settings;
  
  let sql = 'SELECT * FROM questions';
  const params = [];
  const conditions = [];

  if (categories && categories.length > 0 && !categories.includes('All')) {
    const placeholders = categories.map(() => '?').join(',');
    conditions.push(`category IN (${placeholders})`);
    params.push(...categories);
  }

  if (difficulty && difficulty !== 'all') {
    conditions.push('difficulty = ?');
    params.push(difficulty);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY RANDOM() LIMIT ?';
  params.push(questionCount);

  let fetchedQuestions = await allQuery(sql, params);

  if (fetchedQuestions.length < questionCount) {
    fetchedQuestions = await allQuery('SELECT * FROM questions ORDER BY RANDOM() LIMIT ?', [questionCount]);
  }

  room.questions = fetchedQuestions.map(q => ({
    id: q.id,
    category: q.category,
    questionText: q.question_text,
    options: JSON.parse(q.options),
    correctOption: q.correct_option,
    difficulty: q.difficulty
  }));
}

async function startGame(roomCode, io) {
  const room = getRoom(roomCode);
  if (!room || room.status !== 'LOBBY') return false;

  await prepareQuestions(room);
  if (room.questions.length === 0) return false;

  room.status = 'GAME_ACTIVE';
  room.currentQuestionIndex = 0;
  
  io.to(room.roomCode).emit('game_started', {
    totalQuestions: room.questions.length,
    settings: room.settings
  });

  sendNextQuestion(room, io);
  return true;
}

function sendNextQuestion(room, io) {
  if (room.currentQuestionIndex >= room.questions.length) {
    endGame(room, io);
    return;
  }

  const q = room.questions[room.currentQuestionIndex];
  room.status = 'QUESTION_ACTIVE';
  room.answersReceived.clear();
  room.timeRemaining = room.settings.timerSeconds;
  room.questionStartTime = Date.now();

  io.to(room.roomCode).emit('new_question', {
    questionIndex: room.currentQuestionIndex + 1,
    totalQuestions: room.questions.length,
    category: q.category,
    difficulty: q.difficulty,
    questionText: q.questionText,
    options: q.options,
    timerSeconds: room.settings.timerSeconds
  });

  if (room.timer) clearInterval(room.timer);

  room.timer = setInterval(() => {
    room.timeRemaining--;

    io.to(room.roomCode).emit('timer_tick', {
      timeRemaining: room.timeRemaining,
      totalTime: room.settings.timerSeconds
    });

    if (room.timeRemaining <= 0) {
      clearInterval(room.timer);
      revealAnswer(room, io);
    }
  }, 1000);
}

function processAnswer(roomCode, socketId, optionIndex) {
  const room = getRoom(roomCode);
  if (!room || room.status !== 'QUESTION_ACTIVE') return null;
  if (room.answersReceived.has(socketId)) return null;

  const q = room.questions[room.currentQuestionIndex];
  const player = room.players.get(socketId);
  if (!player) return null;

  // Calculate precise response time in seconds
  const responseTimeMs = Date.now() - room.questionStartTime;
  const responseTimeSec = Math.max(0.1, parseFloat((responseTimeMs / 1000).toFixed(2)));

  player.lastResponseTimeSec = responseTimeSec;
  player.totalResponseTimeSec += responseTimeSec;
  player.totalAnswered++;
  player.avgResponseTimeSec = player.totalResponseTimeSec / player.totalAnswered;

  const isCorrect = optionIndex === q.correctOption;
  let pointsEarned = 0;

  if (isCorrect) {
    player.correctCount = (player.correctCount || 0) + 1;
    player.streak++;
    // Speed Bonus Formula: 500 base + up to 500 points depending on fast response time
    const speedRatio = Math.max(0, (room.settings.timerSeconds - responseTimeSec) / room.settings.timerSeconds);
    const speedBonus = Math.round(500 * speedRatio);
    const streakBonus = Math.min(player.streak * 50, 250);
    pointsEarned = 500 + speedBonus + streakBonus;
    player.score += pointsEarned;
  } else {
    player.streak = 0;
  }

  player.lastAnswerResult = { isCorrect, pointsEarned, selectedOption: optionIndex, responseTimeSec };

  const answerPayload = {
    optionIndex,
    responseTimeSec,
    isCorrect,
    pointsEarned
  };

  room.answersReceived.set(socketId, answerPayload);

  if (room.answersReceived.size >= room.players.size) {
    if (room.timer) clearInterval(room.timer);
    setTimeout(() => {
      revealAnswer(room, ioRef);
    }, 400);
  }

  return { isCorrect, pointsEarned, currentScore: player.score, streak: player.streak, responseTimeSec };
}

let ioRef = null;
function setIoReference(io) {
  ioRef = io;
}

function revealAnswer(room, io) {
  room.status = 'REVEAL_ANSWER';
  const q = room.questions[room.currentQuestionIndex];

  const roundRecord = {
    questionIndex: room.currentQuestionIndex + 1,
    questionText: q.questionText,
    category: q.category,
    correctOptionIndex: q.correctOption,
    correctOptionText: q.options[q.correctOption],
    playerAnswers: []
  };

  room.players.forEach((player, sId) => {
    const ans = room.answersReceived.get(sId);
    roundRecord.playerAnswers.push({
      nickname: player.nickname,
      selectedOption: ans ? ans.optionIndex : null,
      responseTimeSec: ans ? ans.responseTimeSec : null,
      isCorrect: ans ? ans.isCorrect : false,
      pointsEarned: ans ? ans.pointsEarned : 0,
      score: player.score
    });
  });

  room.questionHistory.push(roundRecord);

  io.to(room.roomCode).emit('answer_reveal', {
    correctOptionIndex: q.correctOption,
    correctOptionText: q.options[q.correctOption],
    leaderboard: room.getLeaderboard(),
    roundAnswers: roundRecord.playerAnswers
  });

  setTimeout(() => {
    room.currentQuestionIndex++;
    if (room.currentQuestionIndex < room.questions.length) {
      sendNextQuestion(room, io);
    } else {
      endGame(room, io);
    }
  }, 4500);
}

function endGame(room, io) {
  room.status = 'GAME_OVER';
  if (room.timer) clearInterval(room.timer);

  const leaderboard = room.getLeaderboard();

  try {
    runQuery('UPDATE rooms SET status = ? WHERE room_code = ?', ['FINISHED', room.roomCode]);
  } catch (err) {
    console.error('Error updating finished room in DB:', err);
  }

  io.to(room.roomCode).emit('game_over', {
    leaderboard,
    questionHistory: room.questionHistory,
    totalQuestions: room.questions.length
  });
}

function resetRoomToLobby(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return false;

  room.status = 'LOBBY';
  room.currentQuestionIndex = -1;
  room.questions = [];
  room.questionHistory = [];
  room.answersReceived.clear();
  room.players.forEach(p => {
    p.score = 0;
    p.streak = 0;
    p.totalResponseTimeSec = 0;
    p.totalAnswered = 0;
    p.correctCount = 0;
    p.avgResponseTimeSec = 0;
    p.lastResponseTimeSec = 0;
    p.lastAnswerResult = null;
  });

  return true;
}

module.exports = {
  activeRooms,
  createRoom,
  getRoom,
  startGame,
  processAnswer,
  setIoReference,
  resetRoomToLobby
};

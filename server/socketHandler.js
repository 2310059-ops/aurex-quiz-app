const {
  activeRooms,
  createRoom,
  getRoom,
  startGame,
  processAnswer,
  setIoReference,
  resetRoomToLobby
} = require('./gameManager');
const { runQuery, allQuery } = require('./db');
const { fetchAndGenerateNewsQuestions } = require('./newsService');

function initSocketHandlers(io) {
  setIoReference(io);

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Create Room
    socket.on('create_room', async (data, callback) => {
      try {
        const { nickname, settings, avatar, titleBadge } = data || {};
        if (!nickname) {
          return callback && callback({ error: 'Nickname is required' });
        }

        const room = await createRoom(socket.id, nickname.trim(), settings || {}, avatar || '🦊', titleBadge || '⚡ Speed Demon');
        socket.join(room.roomCode);

        console.log(`[Socket] Room created: ${room.roomCode} by ${nickname} (${avatar || '🦊'})`);

        const responseData = {
          roomCode: room.roomCode,
          players: room.getPlayersList(),
          settings: room.settings,
          isHost: true
        };

        if (callback) callback({ success: true, data: responseData });
      } catch (err) {
        console.error('Error creating room:', err);
        if (callback) callback({ error: 'Failed to create room' });
      }
    });

    // Join Room
    socket.on('join_room', (data, callback) => {
      try {
        const { roomCode, nickname, avatar, titleBadge } = data || {};
        if (!roomCode || !nickname) {
          return callback && callback({ error: 'Room code and nickname are required' });
        }

        const room = getRoom(roomCode);
        if (!room) {
          return callback && callback({ error: 'Room not found. Please check the 6-character room code.' });
        }

        if (room.status !== 'LOBBY') {
          return callback && callback({ error: 'Game is already in progress in this room.' });
        }

        const player = room.addPlayer(socket.id, nickname.trim(), false, avatar || '🦊', titleBadge || '⚡ Speed Demon');
        socket.join(room.roomCode);

        console.log(`[Socket] Player ${nickname} joined room ${room.roomCode}`);

        // Broadcast updated players list to room
        io.to(room.roomCode).emit('players_updated', {
          players: room.getPlayersList()
        });

        if (callback) {
          callback({
            success: true,
            data: {
              roomCode: room.roomCode,
              players: room.getPlayersList(),
              settings: room.settings,
              isHost: false
            }
          });
        }
      } catch (err) {
        console.error('Error joining room:', err);
        if (callback) callback({ error: 'Failed to join room' });
      }
    });

    // Update Room Settings (Host only)
    socket.on('update_settings', (data) => {
      const { roomCode, settings } = data || {};
      const room = getRoom(roomCode);

      if (room && room.hostSocketId === socket.id && room.status === 'LOBBY') {
        room.settings = { ...room.settings, ...settings };
        io.to(room.roomCode).emit('settings_updated', { settings: room.settings });
      }
    });

    // Start Game (Host only)
    socket.on('start_game', async (data, callback) => {
      const { roomCode } = data || {};
      const room = getRoom(roomCode);

      if (!room || room.hostSocketId !== socket.id) {
        return callback && callback({ error: 'Only the room host can start the game.' });
      }

      const started = await startGame(roomCode, io);
      if (!started) {
        return callback && callback({ error: 'Failed to start game. Please check questions availability.' });
      }

      if (callback) callback({ success: true });
    });

    // Submit Answer
    socket.on('submit_answer', (data, callback) => {
      const { roomCode, optionIndex } = data || {};
      const result = processAnswer(roomCode, socket.id, optionIndex);

      if (callback) callback({ success: !!result, data: result });
    });

    // Play Again / Replay with Refreshed Questions
    socket.on('play_again', async (data) => {
      const { roomCode, startImmediately } = data || {};
      const room = getRoom(roomCode);

      if (room && room.hostSocketId === socket.id) {
        resetRoomToLobby(roomCode);
        if (startImmediately) {
          const started = await startGame(roomCode, io);
          if (!started) {
            io.to(room.roomCode).emit('returned_to_lobby', {
              players: room.getPlayersList(),
              settings: room.settings,
              error: 'Could not prepare new questions.'
            });
          }
        } else {
          io.to(room.roomCode).emit('returned_to_lobby', {
            players: room.getPlayersList(),
            settings: room.settings
          });
        }
      }
    });

    // Quick Reaction Emoji
    socket.on('send_reaction', (data) => {
      const { roomCode, emoji, nickname } = data || {};
      if (roomCode && emoji) {
        io.to(roomCode).emit('new_reaction', {
          socketId: socket.id,
          nickname,
          emoji
        });
      }
    });

    // Admin Add Question
    socket.on('admin_add_question', async (data, callback) => {
      try {
        const { category, questionText, options, correctOption, difficulty } = data || {};
        if (!category || !questionText || !options || correctOption === undefined) {
          return callback && callback({ error: 'Invalid question parameters' });
        }

        await runQuery(
          `INSERT INTO questions (category, question_text, options, correct_option, difficulty, source)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [category, questionText, JSON.stringify(options), parseInt(correctOption), difficulty || 'medium', 'admin']
        );

        if (callback) callback({ success: true, message: 'Question added successfully' });
      } catch (err) {
        if (callback) callback({ error: err.message });
      }
    });

    // Admin Refresh Daily News
    socket.on('admin_refresh_news', async (data, callback) => {
      const result = await fetchAndGenerateNewsQuestions();
      if (callback) callback(result);
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      
      activeRooms.forEach((room) => {
        if (room.players.has(socket.id)) {
          const p = room.players.get(socket.id);
          room.removePlayer(socket.id);

          if (room.players.size === 0) {
            setTimeout(() => {
              if (room.players.size === 0) {
                activeRooms.delete(room.roomCode);
                console.log(`[Socket] Cleaned up inactive room: ${room.roomCode}`);
              }
            }, 120000);
          } else {
            io.to(room.roomCode).emit('players_updated', {
              players: room.getPlayersList(),
              message: `${p.nickname} left the room.`
            });
          }
        }
      });
    });
  });
}

module.exports = {
  initSocketHandlers
};

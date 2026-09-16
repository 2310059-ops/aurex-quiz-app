// Real-Time Multiplayer Quiz App Client Logic
document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const CATEGORY_META = {
    'General Knowledge': { icon: '🧠', color: '#818cf8', bg: 'rgba(99, 102, 241, 0.2)', preset: 'academic' },
    'Cricket & Sports': { icon: '🏏', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', preset: 'sports' },
    'Daily News & World Affairs': { icon: '📰', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)', preset: 'sports' },
    'Movies & Entertainment': { icon: '🎬', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)', preset: 'pop' },
    'Tech & AI': { icon: '💻', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)', preset: 'tech' },
    'Space & Astronomy': { icon: '🚀', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)', preset: 'tech' },
    'Science & Nature': { icon: '🧬', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', preset: 'tech' },
    'History & Civilizations': { icon: '🏛️', color: '#eab308', bg: 'rgba(234, 179, 8, 0.2)', preset: 'academic' },
    'Geography & Wonders': { icon: '🌍', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.2)', preset: 'academic' },
    'Music & Pop Culture': { icon: '🎵', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.2)', preset: 'pop' },
    'Food & Global Cuisine': { icon: '🍕', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', preset: 'pop' },
    'Gaming & Esports': { icon: '🎮', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)', preset: 'pop' },
    'Mythology & Literature': { icon: '📚', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.2)', preset: 'academic' }
  };

  function getCatMeta(catName) {
    return CATEGORY_META[catName] || { icon: '💡', color: '#818cf8', bg: 'rgba(99, 102, 241, 0.2)', preset: 'academic' };
  }

  const state = {
    roomCode: null,
    nickname: 'Player',
    isHost: false,
    categoriesData: [],
    selectedCategories: [],
    settings: {
      categories: [],
      questionCount: 10,
      timerSeconds: 15,
      difficulty: 'all'
    },
    currentQuestion: null,
    selectedOption: null,
    streak: 0,
    isSolo: false
  };

  const views = {
    hero: document.getElementById('view-hero'),
    lobby: document.getElementById('view-lobby'),
    game: document.getElementById('view-game'),
    reveal: document.getElementById('view-reveal'),
    end: document.getElementById('view-end')
  };

  const modalHost = document.getElementById('modal-host-settings');
  const modalAdmin = document.getElementById('modal-admin');

  function switchView(targetViewId) {
    Object.keys(views).forEach(key => {
      if (key === targetViewId) {
        views[key].classList.add('active');
      } else {
        views[key].classList.remove('active');
      }
    });
  }

  socket.on('connect', () => {
    document.getElementById('status-text').textContent = 'Connected';
    document.querySelector('.status-dot').style.background = 'var(--accent-green)';
  });

  socket.on('disconnect', () => {
    document.getElementById('status-text').textContent = 'Disconnected';
    document.querySelector('.status-dot').style.background = 'var(--accent-red)';
  });

  // Fetch Categories & Setup Interactive UI
  async function loadCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) {
        state.categoriesData = data.categories;
        const defaultCat = data.categories.find(c => c.category === 'General Knowledge') ? 'General Knowledge' : (data.categories[0] ? data.categories[0].category : 'General Knowledge');
        state.selectedCategories = [defaultCat];

        // Update Stat Badges
        const elCatCount = document.getElementById('stat-total-categories');
        const elQCount = document.getElementById('stat-total-questions');
        if (elCatCount) elCatCount.textContent = data.categories.length;
        if (elQCount) elQCount.textContent = `${data.totalQuestions || 80}+`;

        renderHeroCategoryGrid(data.categories);
        renderModalCategoryGrid(data.categories);
        populateAdminCategoryDropdown(data.categories);
        updateQuestionPoolSummary();
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }

  function renderHeroCategoryGrid(categories) {
    const grid = document.getElementById('hero-category-grid');
    if (!grid) return;
    grid.innerHTML = '';

    categories.forEach(item => {
      const meta = getCatMeta(item.category);
      const card = document.createElement('div');
      card.className = 'hero-cat-card';
      card.style.setProperty('--cat-color', meta.color);
      card.style.setProperty('--cat-bg', meta.bg);

      card.innerHTML = `
        <div class="hero-cat-top">
          <div class="hero-cat-icon">${meta.icon}</div>
          <span class="hero-cat-badge">${item.count} Qs</span>
        </div>
        <div class="hero-cat-name">${escapeHtml(item.category)}</div>
        <div class="hero-cat-btn">Play Category Practice ➔</div>
      `;

      card.addEventListener('click', () => {
        window.soundFx.playSelect();
        launchSoloPractice([item.category]);
      });

      grid.appendChild(card);
    });
  }

  function renderModalCategoryGrid(categories, filterQuery = '') {
    const grid = document.getElementById('modal-category-grid');
    if (!grid) return;
    grid.innerHTML = '';

    categories.forEach(item => {
      if (filterQuery && !item.category.toLowerCase().includes(filterQuery.toLowerCase())) {
        return;
      }

      const meta = getCatMeta(item.category);
      const isSelected = state.selectedCategories.includes(item.category);

      const card = document.createElement('div');
      card.className = `cat-select-card ${isSelected ? 'selected' : ''}`;
      card.style.setProperty('--cat-color', meta.color);
      card.style.setProperty('--cat-bg', meta.bg);
      card.dataset.category = item.category;

      card.innerHTML = `
        <span class="cat-icon">${meta.icon}</span>
        <div class="cat-info">
          <span class="cat-title">${escapeHtml(item.category)}</span>
          <span class="cat-count-sub">${item.count} Questions</span>
        </div>
        <div class="cat-check">✓</div>
      `;

      card.addEventListener('click', () => {
        window.soundFx.playSelect();
        const idx = state.selectedCategories.indexOf(item.category);
        if (idx > -1) {
          if (state.selectedCategories.length > 1) {
            state.selectedCategories.splice(idx, 1);
          }
        } else {
          state.selectedCategories.push(item.category);
        }
        renderModalCategoryGrid(categories, filterQuery);
        updateQuestionPoolSummary();
      });

      grid.appendChild(card);
    });

    const countBadge = document.getElementById('category-selected-count');
    if (countBadge) countBadge.textContent = state.selectedCategories.length;
  }

  function updateQuestionPoolSummary() {
    let totalMatching = 0;
    state.categoriesData.forEach(c => {
      if (state.selectedCategories.includes(c.category)) {
        totalMatching += c.count;
      }
    });

    const matchingCountEl = document.getElementById('matching-questions-count');
    if (matchingCountEl) {
      matchingCountEl.textContent = `${totalMatching}+`;
    }
  }

  function populateAdminCategoryDropdown(categories) {
    const select = document.getElementById('admin-category-select');
    if (!select) return;
    select.innerHTML = '';
    categories.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.category;
      opt.textContent = c.category;
      select.appendChild(opt);
    });
  }

  // Category Presets & Select All / Clear All
  const btnSelectAll = document.getElementById('btn-cat-select-all');
  const btnClearAll = document.getElementById('btn-cat-clear-all');
  const searchInput = document.getElementById('input-category-search');

  if (btnSelectAll) {
    btnSelectAll.addEventListener('click', () => {
      window.soundFx.playSelect();
      state.selectedCategories = state.categoriesData.map(c => c.category);
      renderModalCategoryGrid(state.categoriesData, searchInput ? searchInput.value : '');
      updateQuestionPoolSummary();
    });
  }

  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      window.soundFx.playSelect();
      if (state.categoriesData.length > 0) {
        state.selectedCategories = [state.categoriesData[0].category];
      }
      renderModalCategoryGrid(state.categoriesData, searchInput ? searchInput.value : '');
      updateQuestionPoolSummary();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderModalCategoryGrid(state.categoriesData, e.target.value);
    });
  }

  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      window.soundFx.playSelect();
      document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const preset = chip.dataset.preset;
      if (preset === 'all') {
        state.selectedCategories = state.categoriesData.map(c => c.category);
      } else {
        state.selectedCategories = state.categoriesData
          .filter(c => getCatMeta(c.category).preset === preset)
          .map(c => c.category);
        if (state.selectedCategories.length === 0 && state.categoriesData.length > 0) {
          state.selectedCategories = [state.categoriesData[0].category];
        }
      }
      renderModalCategoryGrid(state.categoriesData, searchInput ? searchInput.value : '');
      updateQuestionPoolSummary();
    });
  });

  // Sound Toggle
  const btnSound = document.getElementById('btn-sound-toggle');
  btnSound.addEventListener('click', () => {
    const isMuted = window.soundFx.toggleMute();
    btnSound.textContent = isMuted ? '🔇' : '🔊';
  });

  // Hero & Join Room Flow
  const cardCreateRoom = document.getElementById('card-create-room');
  const cardJoinTrigger = document.getElementById('card-join-room-trigger');
  const boxJoinForm = document.getElementById('box-join-form');
  const btnJoinSubmit = document.getElementById('btn-join-submit');
  const btnJoinCancel = document.getElementById('btn-join-cancel');

  cardCreateRoom.addEventListener('click', () => {
    window.soundFx.playSelect();
    modalHost.classList.add('active');
  });

  cardJoinTrigger.addEventListener('click', () => {
    window.soundFx.playSelect();
    boxJoinForm.style.display = 'flex';
  });

  btnJoinCancel.addEventListener('click', () => {
    boxJoinForm.style.display = 'none';
  });

  btnJoinSubmit.addEventListener('click', () => {
    const nickname = document.getElementById('input-nickname').value.trim();
    const roomCode = document.getElementById('input-room-code').value.trim().toUpperCase();

    if (!nickname || !roomCode) {
      alert('Please enter both your Nickname and the 6-character Room Code.');
      return;
    }

    state.nickname = nickname;
    window.soundFx.playSelect();

    socket.emit('join_room', { roomCode, nickname }, (response) => {
      if (response.error) {
        alert(response.error);
      } else if (response.success) {
        state.roomCode = response.data.roomCode;
        state.isHost = response.data.isHost;
        setupLobbyUI(response.data);
        switchView('lobby');
      }
    });
  });

  // Host Settings & Create Room
  document.getElementById('btn-close-host-modal').addEventListener('click', () => {
    modalHost.classList.remove('active');
  });

  function setupChips(containerId, isMulti = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;

      window.soundFx.playSelect();

      if (isMulti) {
        chip.classList.toggle('selected');
        if (container.querySelectorAll('.chip.selected').length === 0) {
          chip.classList.add('selected');
        }
      } else {
        container.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      }
    });
  }

  setupChips('host-count-chips', false);
  setupChips('host-timer-chips', false);
  setupChips('host-diff-chips', false);

  document.getElementById('btn-create-lobby-confirm').addEventListener('click', () => {
    const nickname = document.getElementById('host-nickname-input').value.trim() || 'QuizHost';
    state.nickname = nickname;

    const countChip = document.querySelector('#host-count-chips .chip.selected');
    const timerChip = document.querySelector('#host-timer-chips .chip.selected');
    const diffChip = document.querySelector('#host-diff-chips .chip.selected');

    const settings = {
      categories: state.selectedCategories.length > 0 ? state.selectedCategories : ['General Knowledge'],
      questionCount: parseInt(countChip.dataset.value),
      timerSeconds: parseInt(timerChip.dataset.value),
      difficulty: diffChip.dataset.value
    };

    window.soundFx.playSelect();

    socket.emit('create_room', { nickname, settings }, (response) => {
      modalHost.classList.remove('active');
      if (response.error) {
        alert(response.error);
      } else if (response.success) {
        state.roomCode = response.data.roomCode;
        state.isHost = true;
        setupLobbyUI(response.data);
        switchView('lobby');
      }
    });
  });

  function setupLobbyUI(data) {
    document.getElementById('display-room-code').textContent = data.roomCode;
    document.getElementById('player-count').textContent = data.players.length;

    document.getElementById('summary-categories').textContent = data.settings.categories.length > 3
      ? `${data.settings.categories.slice(0, 3).join(', ')} + ${data.settings.categories.length - 3} more`
      : data.settings.categories.join(', ');
    document.getElementById('summary-count').textContent = data.settings.questionCount;
    document.getElementById('summary-timer').textContent = `${data.settings.timerSeconds}s`;
    document.getElementById('summary-difficulty').textContent = data.settings.difficulty.toUpperCase();

    const btnStart = document.getElementById('btn-start-game');
    btnStart.style.display = state.isHost ? 'flex' : 'none';

    renderPlayersGrid(data.players);
  }

  function renderPlayersGrid(players) {
    const container = document.getElementById('players-list-container');
    container.innerHTML = '';

    players.forEach(p => {
      const card = document.createElement('div');
      card.className = 'player-card';
      const initial = p.nickname.charAt(0).toUpperCase();

      card.innerHTML = `
        <div class="player-avatar">${initial}</div>
        <div class="player-info">
          <div class="player-name">${escapeHtml(p.nickname)}</div>
          ${p.isHost ? '<div class="host-tag">👑 ROOM HOST</div>' : '<div style="font-size: 0.75rem; color: var(--text-muted);">Player</div>'}
        </div>
      `;
      container.appendChild(card);
    });

    document.getElementById('player-count').textContent = players.length;
  }

  document.getElementById('btn-copy-code').addEventListener('click', () => {
    navigator.clipboard.writeText(state.roomCode);
    window.soundFx.playSelect();
    const btn = document.getElementById('btn-copy-code');
    btn.textContent = 'COPIED!';
    setTimeout(() => btn.textContent = 'COPY', 2000);
  });

  document.getElementById('btn-leave-lobby').addEventListener('click', () => {
    window.location.reload();
  });

  document.getElementById('btn-start-game').addEventListener('click', () => {
    window.soundFx.playSelect();
    socket.emit('start_game', { roomCode: state.roomCode }, (response) => {
      if (response && response.error) {
        alert(response.error);
      }
    });
  });

  socket.on('players_updated', (data) => {
    renderPlayersGrid(data.players);
  });

  socket.on('game_started', () => {
    window.soundFx.playSelect();
    switchView('game');
  });

  socket.on('new_question', (data) => {
    state.currentQuestion = data;
    state.selectedOption = null;

    switchView('game');

    document.getElementById('badge-question-num').textContent = `Q ${data.questionIndex} / ${data.totalQuestions}`;

    // Update Question Progress Bar
    const progressBar = document.getElementById('question-progress-bar');
    if (progressBar) {
      const pct = Math.round((data.questionIndex / data.totalQuestions) * 100);
      progressBar.style.width = `${pct}%`;
    }

    // Dynamic Category Badge styling
    const catBadge = document.getElementById('badge-category');
    const catMeta = getCatMeta(data.category);
    catBadge.textContent = `${catMeta.icon} ${data.category}`;
    catBadge.style.setProperty('--cat-color', catMeta.color);
    catBadge.style.setProperty('--cat-bg', catMeta.bg);

    // Streak badge
    const streakBadge = document.getElementById('badge-streak');
    streakBadge.textContent = state.streak > 1 ? `🔥 ${state.streak}x Streak!` : `🔥 Streak ${state.streak}`;

    document.getElementById('display-question-text').textContent = data.questionText;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    data.options.forEach((optText, idx) => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.dataset.index = idx;
      card.innerHTML = `
        <div class="option-key">${idx + 1}</div>
        <div class="option-text">${escapeHtml(optText)}</div>
        <span class="kbd-hint">Press ${idx + 1}</span>
      `;

      card.addEventListener('click', () => submitAnswerChoice(idx));
      optionsContainer.appendChild(card);
    });

    updateTimerProgress(data.timerSeconds, data.timerSeconds);
  });

  function submitAnswerChoice(idx) {
    if (state.selectedOption !== null) return;

    state.selectedOption = idx;
    window.soundFx.playSelect();

    const cards = document.querySelectorAll('.option-card');
    cards.forEach((c, i) => {
      if (i === idx) c.classList.add('selected');
      else c.style.opacity = '0.4';
    });

    socket.emit('submit_answer', {
      roomCode: state.roomCode,
      optionIndex: idx
    });
  }

  document.addEventListener('keydown', (e) => {
    if (views.game.classList.contains('active')) {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        submitAnswerChoice(idx);
      }
    }
  });

  socket.on('timer_tick', (data) => {
    updateTimerProgress(data.timeRemaining, data.totalTime);
    if (data.timeRemaining <= 3 && data.timeRemaining > 0) {
      window.soundFx.playTick();
    }
  });

  function updateTimerProgress(timeRemaining, totalTime) {
    const textEl = document.getElementById('timer-seconds-text');
    const ringEl = document.getElementById('timer-progress-ring');
    textEl.textContent = Math.max(0, timeRemaining);

    const circumference = 251.2;
    const ratio = Math.max(0, timeRemaining) / totalTime;
    const offset = circumference * (1 - ratio);
    ringEl.style.strokeDashoffset = offset;

    if (timeRemaining <= 3) {
      ringEl.style.stroke = 'var(--accent-red)';
    } else {
      ringEl.style.stroke = 'var(--primary-glow)';
    }
  }

  socket.on('answer_reveal', (data) => {
    const { correctOptionIndex, correctOptionText, leaderboard, roundAnswers } = data;

    const myAnswer = roundAnswers.find(a => a.nickname === state.nickname);
    const isCorrect = myAnswer ? myAnswer.isCorrect : false;
    const pointsEarned = myAnswer ? myAnswer.pointsEarned : 0;
    const responseTimeSec = myAnswer && myAnswer.responseTimeSec ? `${myAnswer.responseTimeSec}s` : 'Time Expired';

    if (isCorrect) {
      state.streak++;
      if (state.streak >= 2 && window.soundFx.playCombo) {
        window.soundFx.playCombo(state.streak);
      } else {
        window.soundFx.playCorrect();
      }
      document.getElementById('reveal-status-icon').textContent = state.streak > 2 ? '🔥' : '🎉';
      document.getElementById('reveal-status-title').textContent = state.streak > 2 ? `${state.streak}x Combo Streak!` : 'Correct Answer!';
      document.getElementById('reveal-points-text').textContent = `+${pointsEarned} Points (Speed + Streak)`;
      document.getElementById('reveal-points-text').style.color = 'var(--accent-green)';
      document.getElementById('reveal-speed-info').textContent = `⏱️ Answered in ${responseTimeSec}`;
    } else {
      state.streak = 0;
      window.soundFx.playWrong();
      document.getElementById('reveal-status-icon').textContent = '❌';
      document.getElementById('reveal-status-title').textContent = 'Incorrect!';
      document.getElementById('reveal-points-text').textContent = '+0 Points';
      document.getElementById('reveal-points-text').style.color = 'var(--accent-red)';
      document.getElementById('reveal-speed-info').textContent = `⏱️ Response Time: ${responseTimeSec}`;
    }

    document.getElementById('display-correct-answer').textContent = correctOptionText;

    const cards = document.querySelectorAll('.option-card');
    cards.forEach((c, idx) => {
      if (idx === correctOptionIndex) c.classList.add('correct');
      else if (idx === state.selectedOption && !isCorrect) c.classList.add('wrong');
    });

    switchView('reveal');

    let countdown = 4;
    const countEl = document.getElementById('reveal-countdown');
    countEl.textContent = countdown;
    const interval = setInterval(() => {
      countdown--;
      if (countEl) countEl.textContent = countdown;
      if (countdown <= 0) clearInterval(interval);
    }, 1000);
  });

  socket.on('game_over', (data) => {
    const { leaderboard } = data;
    window.soundFx.playFanfare();
    launchConfetti();

    switchView('end');

    const p1 = leaderboard[0] || { nickname: 'N/A', score: 0, totalTimeSec: '0.0', avgResponseTimeSec: '0.0', accuracyPct: 0 };
    const p2 = leaderboard[1] || { nickname: 'N/A', score: 0, totalTimeSec: '0.0', avgResponseTimeSec: '0.0', accuracyPct: 0 };
    const p3 = leaderboard[2] || { nickname: 'N/A', score: 0, totalTimeSec: '0.0', avgResponseTimeSec: '0.0', accuracyPct: 0 };

    // Update 1st Rank Champion Reward Card Banner
    const rewardCard = document.getElementById('champion-reward-card');
    if (rewardCard) {
      document.getElementById('reward-winner-name').textContent = p1.nickname;
      document.getElementById('reward-badge-score').textContent = `🏆 ${p1.score} Final Points`;
      document.getElementById('reward-badge-time').textContent = `⏱️ ${p1.totalTimeSec || '0.0'}s Total Speed`;
      document.getElementById('reward-badge-accuracy').textContent = `🎯 ${p1.accuracyPct || 0}% Accuracy (${p1.correctCount || 0}/${p1.totalAnswered || 0})`;
    }

    // Update Podium Steps
    document.getElementById('podium-name-1').textContent = p1.nickname;
    document.getElementById('podium-score-1').textContent = `${p1.score} pts`;
    document.getElementById('podium-time-1').textContent = `⏱️ Total: ${p1.totalTimeSec || '0.0'}s (${p1.avgResponseTimeSec || '0.0'}s/q)`;

    document.getElementById('podium-name-2').textContent = p2.nickname;
    document.getElementById('podium-score-2').textContent = `${p2.score} pts`;
    document.getElementById('podium-time-2').textContent = `⏱️ Total: ${p2.totalTimeSec || '0.0'}s (${p2.avgResponseTimeSec || '0.0'}s/q)`;

    document.getElementById('podium-name-3').textContent = p3.nickname;
    document.getElementById('podium-score-3').textContent = `${p3.score} pts`;
    document.getElementById('podium-time-3').textContent = `⏱️ Total: ${p3.totalTimeSec || '0.0'}s (${p3.avgResponseTimeSec || '0.0'}s/q)`;

    // Render Full Leaderboard with All Participants
    const elTotalParticipants = document.getElementById('total-participants-count');
    if (elTotalParticipants) elTotalParticipants.textContent = leaderboard.length;

    const tbody = document.getElementById('tbody-final-leaderboard');
    tbody.innerHTML = '';

    const rankBadges = ['🥇', '🥈', '🥉'];

    leaderboard.forEach((player, rank) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-glass)';
      tr.style.background = rank === 0 ? 'rgba(245, 158, 11, 0.08)' : 'transparent';
      const rankIcon = rankBadges[rank] || `#${rank + 1}`;

      tr.innerHTML = `
        <td style="padding: 0.85rem 1rem; font-weight: 800; color: ${rank === 0 ? 'var(--accent-amber)' : 'var(--text-main)'}; font-size: 1.1rem;">${rankIcon}</td>
        <td style="padding: 0.85rem 1rem; font-weight: 700;">${escapeHtml(player.nickname)} ${player.isHost ? '<span style="font-size:0.75rem; color:var(--accent-amber);">[HOST]</span>' : ''}</td>
        <td style="padding: 0.85rem 1rem; font-weight: 600; color: var(--accent-green);">🎯 ${player.accuracyPct || 0}% (${player.correctCount || 0}/${player.totalAnswered || 0})</td>
        <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--accent-cyan);">⏱️ ${player.totalTimeSec || '0.0'}s</td>
        <td style="padding: 0.85rem 1rem; font-weight: 600; color: var(--text-muted);">${player.avgResponseTimeSec || '0.0'}s / q</td>
        <td style="padding: 0.85rem 1rem; font-weight: 800; color: var(--primary-glow); font-size: 1.05rem;">${player.score} pts</td>
      `;
      tbody.appendChild(tr);
    });

    const btnPlayAgain = document.getElementById('btn-play-again');
    btnPlayAgain.style.display = state.isHost ? 'inline-flex' : 'none';
  });

  document.getElementById('btn-play-again').addEventListener('click', () => {
    socket.emit('play_again', { roomCode: state.roomCode });
  });

  socket.on('returned_to_lobby', (data) => {
    setupLobbyUI(data);
    switchView('lobby');
  });

  document.getElementById('btn-return-lobby').addEventListener('click', () => {
    window.location.reload();
  });

  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      socket.emit('send_reaction', {
        roomCode: state.roomCode,
        nickname: state.nickname,
        emoji
      });
      triggerFloatingEmoji(emoji);
    });
  });

  socket.on('new_reaction', (data) => {
    triggerFloatingEmoji(data.emoji);
  });

  function triggerFloatingEmoji(emoji) {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emoji;
    el.style.left = `${Math.random() * 70 + 15}%`;
    el.style.bottom = '10%';
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 2500);
  }

  function launchSoloPractice(selectedCats = null) {
    state.nickname = 'Solo Challenger';
    state.isSolo = true;
    const catList = selectedCats || state.categoriesData.map(c => c.category);

    socket.emit('create_room', {
      nickname: state.nickname,
      settings: {
        categories: catList,
        questionCount: 5,
        timerSeconds: 15,
        difficulty: 'all'
      }
    }, (response) => {
      if (response.success) {
        state.roomCode = response.data.roomCode;
        state.isHost = true;
        socket.emit('start_game', { roomCode: state.roomCode });
      }
    });
  }

  document.getElementById('btn-solo-practice').addEventListener('click', () => {
    window.soundFx.playSelect();
    launchSoloPractice(null);
  });

  const btnAdminOpen = document.getElementById('btn-admin-open');
  const btnAdminClose = document.getElementById('btn-close-admin-modal');

  btnAdminOpen.addEventListener('click', () => {
    window.soundFx.playSelect();
    modalAdmin.classList.add('active');
  });

  btnAdminClose.addEventListener('click', () => {
    modalAdmin.classList.remove('active');
  });

  document.getElementById('form-admin-add-question').addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('admin-category-select').value;
    const questionText = document.getElementById('admin-qtext').value.trim();
    const options = [
      document.getElementById('admin-opt0').value.trim(),
      document.getElementById('admin-opt1').value.trim(),
      document.getElementById('admin-opt2').value.trim(),
      document.getElementById('admin-opt3').value.trim()
    ];
    const correctOption = parseInt(document.getElementById('admin-correct-select').value);
    const difficulty = document.getElementById('admin-diff-select').value;

    socket.emit('admin_add_question', {
      category,
      questionText,
      options,
      correctOption,
      difficulty
    }, (res) => {
      if (res.success) {
        alert('Question added successfully to database!');
        document.getElementById('form-admin-add-question').reset();
        loadCategories(); // Reload category counts
      } else {
        alert(`Error: ${res.error}`);
      }
    });
  });

  document.getElementById('btn-trigger-news').addEventListener('click', () => {
    const btn = document.getElementById('btn-trigger-news');
    btn.textContent = '⏳ Refreshing News...';
    btn.disabled = true;

    socket.emit('admin_refresh_news', {}, (res) => {
      btn.textContent = '📰 Refresh News API';
      btn.disabled = false;
      if (res.success) {
        alert(`Success! Refreshed Daily News questions. ${res.addedCount} new trivia questions generated.`);
        loadCategories();
      } else {
        alert(`Notice: ${res.error || 'News refreshed.'}`);
      }
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function launchConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }

  // Initial Load
  loadCategories();
});

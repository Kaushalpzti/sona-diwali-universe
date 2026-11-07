(() => {
  'use strict';

  const C = window.SONA_CONTENT;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const FINAL_TARGET = 20;
  const STORAGE_KEY = 'sonas-diwali-universe-progress-v2';

  const freshState = () => ({
    hearts: 0,
    awards: [],
    found: [],
    openedLetters: [],
    litDiyas: [],
    redeemedCoupons: [],
    customPhotos: {},
    quizDone: false,
    memoryDone: false,
    catchBest: 0,
    diyaBest: 0
  });

  let state = freshState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = { ...freshState(), ...JSON.parse(saved) };
  } catch (_) {
    state = freshState();
  }

  let toastTimer = null;
  let activeGameCleanup = null;
  let currentTrackIndex = 0;
  let isMusicPlaying = false;
  window.sonaSoundEnabled = true;

  // Save progress
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
    updateProgress();
  }

  // Award hearts
  function award(id, points, message) {
    if (state.awards.includes(id)) return false;
    state.awards.push(id);
    state.hearts += points;
    save();
    playChime();
    showToast(message || `You collected +${points} heart${points === 1 ? '' : 's'}! 💖`);
    createFloatingHeartBurst();
    return true;
  }

  // Update progress displays
  function updateProgress() {
    const safeHearts = Math.max(0, state.hearts);
    const percent = Math.min(100, Math.round((safeHearts / FINAL_TARGET) * 100));

    $('#heartCount').textContent = `${safeHearts} ${safeHearts === 1 ? 'heart' : 'hearts'} collected`;
    $('#navHeartCount').textContent = `${safeHearts}`;
    $('#progressPercent').textContent = `${percent}%`;
    $('#progressFill').style.width = `${percent}%`;

    const unlocked = safeHearts >= FINAL_TARGET;
    $('#unlockStatus').textContent = unlocked ? 'Secret finale letter unlocked! 💖' : `${FINAL_TARGET - safeHearts} hearts to unlock`;
    $('#lockSymbol').textContent = unlocked ? '💖' : '🔒';
    $('#finaleProgressText').textContent = `${Math.min(safeHearts, FINAL_TARGET)} / ${FINAL_TARGET} hearts collected`;
    $('#finaleButton').disabled = !unlocked;
    $('#finaleLock').textContent = unlocked ? '💖' : '🔒';
    $('#finaleDescription').textContent = unlocked
      ? 'You lit up every corner of our universe. Your grand finale surprise is ready, my Sona.'
      : `Collect ${FINAL_TARGET} hearts from your little adventures to open the final letter & grand fireworks show.`;
    $('#finale').classList.toggle('unlocked', unlocked);

    $$('[data-game]').forEach(card => {
      const id = card.dataset.game;
      if (
        state.awards.some(a => a.startsWith(`game-${id}`)) ||
        (id === 'hidden' && state.found.length === 5) ||
        (id === 'quiz' && state.quizDone) ||
        (id === 'memory' && state.memoryDone)
      ) {
        card.classList.add('completed');
      }
    });
  }

  // Toast feedback
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  // Modal controls
  function openModal(html) {
    stopActiveGame();
    $('#modalContent').innerHTML = html;
    const m = $('#modal');
    if (!m.open) m.showModal();
  }

  function closeModal() {
    stopActiveGame();
    const m = $('#modal');
    if (m.open) m.close();
    $('#modalContent').innerHTML = '';
  }

  function stopActiveGame() {
    if (typeof activeGameCleanup === 'function') activeGameCleanup();
    activeGameCleanup = null;
  }

  // Web Audio Synthesizer Sound Engine
  function getAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!window.__sonaAudioCtx) window.__sonaAudioCtx = new AudioCtx();
        if (window.__sonaAudioCtx.state === 'suspended') window.__sonaAudioCtx.resume();
        return window.__sonaAudioCtx;
      }
    } catch (_) {}
    return null;
  }

  function playTap() {
    if (!window.sonaSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (_) {}
  }

  function playChime() {
    if (!window.sonaSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const start = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.45);
      });
    } catch (_) {}
  }

  function playDiyaSound() {
    if (!window.sonaSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch (_) {}
  }

  function playStampSound() {
    if (!window.sonaSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.17);
    } catch (_) {}
  }

  // Floating Heart Particle Burst
  function createFloatingHeartBurst() {
    const burst = document.createElement('div');
    burst.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(burst);

    for (let i = 0; i < 18; i++) {
      const heart = document.createElement('span');
      heart.textContent = ['💖', '✨', '🪔', '♡', '🌸'][i % 5];
      heart.style.cssText = `
        position: absolute;
        left: ${40 + Math.random() * 20}%;
        bottom: 25%;
        font-size: ${18 + Math.random() * 18}px;
        transform: translate(-50%, 0);
        animation: floatBurst 1.8s cubic-bezier(0.12, 0.8, 0.3, 1) forwards;
        --dx: ${(Math.random() - 0.5) * 260}px;
        --dy: -${150 + Math.random() * 250}px;
      `;
      burst.appendChild(heart);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatBurst {
        0% { transform: translate(0, 0) scale(0.6); opacity: 1; }
        100% { transform: translate(var(--dx), var(--dy)) scale(1.3) rotate(25deg); opacity: 0; }
      }
    `;
    burst.appendChild(style);
    setTimeout(() => burst.remove(), 2000);
  }

  // Music System
  const bgMusic = $('#bgMusic');

  function setTrack(index) {
    currentTrackIndex = (index + C.audioTracks.length) % C.audioTracks.length;
    const track = C.audioTracks[currentTrackIndex];
    bgMusic.src = track.file;
    $('#dockTrackTitle').textContent = track.title;
  }

  async function playMusic() {
    try {
      getAudioContext();
      if (!bgMusic.src) setTrack(currentTrackIndex);
      await bgMusic.play();
      isMusicPlaying = true;
      $('#dockDisc').classList.add('playing');
      $('#dockPlayBtn').textContent = '⏸';
      $('#musicIcon').textContent = '🎶';
      $('#musicToggle').classList.add('active');
    } catch (err) {
      isMusicPlaying = false;
      $('#dockDisc').classList.remove('playing');
      $('#dockPlayBtn').textContent = '▶';
      $('#musicToggle').classList.remove('active');
      showToast('Music play was paused by browser. Tap Play on dock to listen! 🎵');
    }
  }

  function pauseMusic() {
    bgMusic.pause();
    isMusicPlaying = false;
    $('#dockDisc').classList.remove('playing');
    $('#dockPlayBtn').textContent = '▶';
    $('#musicIcon').textContent = '🎵';
    $('#musicToggle').classList.remove('active');
  }

  function toggleMusic() {
    if (isMusicPlaying) pauseMusic();
    else playMusic();
  }

  function nextTrack() {
    setTrack(currentTrackIndex + 1);
    playMusic();
    showToast(`Playing: ${C.audioTracks[currentTrackIndex].title}`);
  }

  // Live Love Journey Timer
  function initLoveTimer() {
    const startDate = new Date(C.startDate || '2025-05-05T00:00:00');

    function update() {
      const now = new Date();
      const diffMs = now - startDate;

      if (diffMs < 0) {
        $('#timerDays').textContent = '0';
        $('#timerHours').textContent = '0';
        $('#timerMinutes').textContent = '0';
        $('#timerSeconds').textContent = '0';
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      $('#timerDays').textContent = days;
      $('#timerHours').textContent = hours;
      $('#timerMinutes').textContent = minutes;
      $('#timerSeconds').textContent = seconds;
    }

    update();
    setInterval(update, 1000);
  }

  // Render 5-Diya Ceremony
  function renderDiyaCeremony() {
    const row = $('#diyaCeremonyRow');
    row.innerHTML = C.diyas.map(diya => {
      const isLit = state.litDiyas.includes(diya.id);
      return `
        <div class="ceremony-diya-card ${isLit ? 'lit' : ''}" data-diya-id="${diya.id}" role="button" tabindex="0">
          <div class="diya-icon-wrap">
            <span class="diya-candle-flame"></span>
            <span class="diya-candle-bowl">🪔</span>
          </div>
          <b class="diya-name-en">${diya.name}</b>
          <span class="diya-name-hi">${diya.hindi}</span>
          <span class="diya-status-tag">${isLit ? 'GLOWING ✨' : 'TAP TO LIGHT'}</span>
        </div>
      `;
    }).join('');

    $$('.ceremony-diya-card', row).forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.diyaId;
        const diya = C.diyas.find(d => d.id === id);
        if (!diya) return;

        playDiyaSound();

        if (!state.litDiyas.includes(id)) {
          state.litDiyas.push(id);
          card.classList.add('lit');
          $('.diya-status-tag', card).textContent = 'GLOWING ✨';
          award(`ceremony-${id}`, 1, `You lit the ${diya.name}! +1 heart 🪔`);
        }

        openModal(`
          <div class="modal-eyebrow">🪔 CEREMONY BLESSING · ${diya.hindi}</div>
          <h3>${diya.name} ✨</h3>
          <div class="letter-paper" style="text-align:center;font-size:18px;">
            <p>${diya.message}</p>
          </div>
          <div class="modal-actions" style="justify-content:center;">
            <button class="btn btn-primary" id="diyaWishClose">Receive Blessing ♡</button>
          </div>
        `);
        $('#diyaWishClose').addEventListener('click', closeModal);

        if (state.litDiyas.length === C.diyas.length && !state.awards.includes('ceremony-all-diyas')) {
          award('ceremony-all-diyas', 3, 'All 5 sacred Diyas are shining! May your life be endlessly illuminated! 🪔✨');
          $('#ceremonyStatus').innerHTML = '<b>✨ All 5 sacred Diyas are fully glowing! Happy Diwali, Sona! ✨</b>';
        }
      });
    });

    if (state.litDiyas.length === C.diyas.length) {
      $('#ceremonyStatus').innerHTML = '<b>✨ All 5 sacred Diyas are fully glowing! Happy Diwali, Sona! ✨</b>';
    }
  }

  // Phuljhadi (Digital Sparkler) Canvas
  function initSparkler() {
    const canvas = $('#sparklerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let particles = [];
    let isDrawing = false;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    function addSparks(x, y, count = 8) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          alpha: 1,
          size: 1.5 + Math.random() * 2.5,
          color: ['#ffd166', '#ff758f', '#fff', '#f4a261', '#ffbe0b'][Math.floor(Math.random() * 5)],
          decay: 0.025 + Math.random() * 0.035
        });
      }
    }

    function animate() {
      ctx.fillStyle = 'rgba(8, 3, 16, 0.22)';
      ctx.fillRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    }
    animate();

    function handlePointer(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
      addSparks(x, y, 10);
      playTap();
      $('#sparklerHint').style.opacity = '0';
      if (!state.awards.includes('sparkler-played')) {
        award('sparkler-played', 1, 'Digital phuljhadi sparkling! +1 heart 🎇');
      }
    }

    canvas.addEventListener('pointerdown', e => {
      isDrawing = true;
      handlePointer(e);
    });
    canvas.addEventListener('pointermove', e => {
      if (isDrawing) handlePointer(e);
    });
    window.addEventListener('pointerup', () => { isDrawing = false; });
    canvas.addEventListener('touchmove', e => {
      handlePointer(e);
      e.preventDefault();
    }, { passive: false });

    $('#clearSparkler').addEventListener('click', () => {
      particles = [];
      ctx.clearRect(0, 0, width, height);
      $('#sparklerHint').style.opacity = '1';
    });
  }

  // Sky Lantern Release System
  function initSkyLantern() {
    const fleet = $('#lanternFleet');
    const select = $('#lanternWishSelect');
    const customInput = $('#customWishInput');
    const releaseBtn = $('#releaseLanternBtn');

    select.addEventListener('change', () => {
      if (select.value === 'custom') {
        customInput.style.display = 'block';
        customInput.focus();
      } else {
        customInput.style.display = 'none';
      }
    });

    releaseBtn.addEventListener('click', () => {
      let wish = select.value === 'custom' ? customInput.value.trim() : select.value;
      if (!wish) wish = "May Sona always smile brightly! ♡";

      playDiyaSound();

      const lantern = document.createElement('div');
      lantern.className = 'floating-lantern';
      lantern.style.left = `${15 + Math.random() * 70}%`;
      lantern.style.animationDuration = `${5.5 + Math.random() * 2.5}s`;

      lantern.innerHTML = `
        <div class="lantern-shape">🏮</div>
        <div class="lantern-wish-text">${wish}</div>
      `;
      fleet.appendChild(lantern);

      lantern.addEventListener('animationend', () => lantern.remove());

      award('lantern-released', 1, 'Your sky lantern is floating among the stars! 🏮✨');
      showToast('Lantern released with your warm wish! 🏮✨');
      if (select.value === 'custom') customInput.value = '';
    });
  }

  // Polaroid Photo Wall & Uploader / Lightbox
  function renderPhotos() {
    const grid = $('#photoGrid');
    grid.innerHTML = C.photos.map((photo, i) => {
      const customImg = state.customPhotos[photo.file];
      const initialSrc = customImg || `assets/photos/${photo.file}`;
      const fallbackSrc = `assets/photos/${photo.svgFallback}`;

      return `
        <article class="polaroid-card" data-photo-index="${i}">
          <div class="polaroid-tape"></div>
          <div class="polaroid-img-holder">
            <img src="${initialSrc}" 
                 alt="${photo.title}" 
                 loading="lazy" 
                 onerror="if(this.src.indexOf('.svg') === -1) { this.src='${fallbackSrc}'; }" />
          </div>
          <div class="polaroid-meta">
            <h4 class="polaroid-title">${photo.title}</h4>
            <p class="polaroid-caption">${photo.caption}</p>
            <span class="polaroid-date">✦ ${photo.date || 'Memories'} ✦</span>
          </div>
        </article>
      `;
    }).join('');

    $$('.polaroid-card', grid).forEach(card => {
      card.addEventListener('click', () => {
        const idx = Number(card.dataset.photoIndex);
        openLightbox(idx);
      });
    });
  }

  function openLightbox(idx) {
    const photo = C.photos[idx];
    if (!photo) return;
    playTap();
    const customImg = state.customPhotos[photo.file];
    const src = customImg || `assets/photos/${photo.file}`;

    const lbImg = $('#lightboxImg');
    lbImg.src = src;
    lbImg.onerror = () => { lbImg.src = `assets/photos/${photo.svgFallback}`; };

    $('#lightboxTitle').textContent = photo.title;
    $('#lightboxDesc').textContent = photo.caption;
    $('#lightboxDate').textContent = photo.date || 'Our Little Forever';

    const lb = $('#lightbox');
    lb.classList.add('show');
    lb.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    const lb = $('#lightbox');
    lb.classList.remove('show');
    lb.setAttribute('aria-hidden', 'true');
  }

  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightbox').addEventListener('click', e => {
    if (e.target === $('#lightbox')) closeLightbox();
  });

  // Photo Uploader & Instant Preview
  $('#photoFileInput').addEventListener('change', e => {
    const files = [...e.target.files];
    if (!files.length) return;

    files.forEach((file, index) => {
      if (index >= C.photos.length) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const targetPhoto = C.photos[index];
        state.customPhotos[targetPhoto.file] = ev.target.result;
        save();
        renderPhotos();
      };
      reader.readAsDataURL(file);
    });

    award('custom-photo-added', 2, 'New memories added to your Polaroid Wall! 📸💖');
    showToast(`${files.length} photo(s) previewed on your polaroid wall! ✨`);
    e.target.value = '';
  });

  $('#resetPhotosBtn').addEventListener('click', () => {
    state.customPhotos = {};
    save();
    renderPhotos();
    showToast('Reset polaroids to default aesthetic illustrations! 🌸');
  });

  // Open When... Letters
  function renderLetters() {
    $('#letterGrid').innerHTML = C.letters.map(letter => `
      <button class="letter-card" data-letter="${letter.id}">
        <span class="letter-icon">${letter.icon}</span>
        <h4>${letter.title}</h4>
        <p>${letter.teaser}</p>
        <span class="letter-read">${state.openedLetters.includes(letter.id) ? 'OPENED ♡' : 'OPEN LETTER →'}</span>
      </button>
    `).join('');
  }

  function openLetter(id) {
    const letter = C.letters.find(item => item.id === id);
    if (!letter) return;
    playTap();

    openModal(`
      <div class="modal-eyebrow">A LETTER FOR THIS MOMENT · ${letter.icon}</div>
      <h3>${letter.title}</h3>
      <div class="letter-paper">${letter.body}</div>
      <div class="modal-actions" style="justify-content:center;">
        <button class="btn btn-primary" id="letterDone">Keep this close to your heart 💗</button>
      </div>
    `);

    if (!state.openedLetters.includes(id)) {
      state.openedLetters.push(id);
      award(`letter-${id}`, 1, `Letter opened: "${letter.title}" +1 heart 💌`);
      renderLetters();
    }
    $('#letterDone').addEventListener('click', closeModal);
  }

  // 11:11 Wish Galaxy
  function renderGalaxy() {
    const sky = $('#galaxySky');
    const positions = [
      [15, 22], [32, 65], [44, 18], [58, 75], [74, 25], [84, 55],
      [22, 50], [68, 48], [48, 86], [88, 18], [12, 78], [56, 38]
    ];
    sky.querySelectorAll('.galaxy-star').forEach(e => e.remove());

    positions.forEach(([x, y], i) => {
      const star = document.createElement('button');
      star.className = 'galaxy-star';
      star.type = 'button';
      star.textContent = i % 3 === 0 ? '✦' : '✧';
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.animationDelay = `${(i % 5) * 0.4}s`;
      star.setAttribute('aria-label', 'Reveal a wish');
      star.addEventListener('click', () => revealWish(i));
      sky.appendChild(star);
    });
  }

  function revealWish(index) {
    const wish = C.wishes[index % C.wishes.length];
    $('#wishResult').textContent = `“${wish}”`;
    playTap();
    if (!state.awards.includes('wish-galaxy')) {
      award('wish-galaxy', 1, 'A wish is now floating in our universe. ✨');
    }
  }

  // Games Launcher
  function launchGame(id) {
    playTap();
    if (id === 'catch') return startCatchGame();
    if (id === 'diya') return startDiyaGame();
    if (id === 'quiz') return startQuiz();
    if (id === 'hidden') return startHiddenHearts();
    if (id === 'memory') return startMemoryGame();
    if (id === 'fortune') return startFortuneCookie();
  }

  // Game 1: Catch My Love
  function startCatchGame() {
    openModal(`
      <div class="modal-eyebrow">GAME 01 · QUICK REFLEXES</div>
      <h3>Catch My Love ♡</h3>
      <p class="modal-lead">Tap the falling hearts and festive sweets before they hit the ground. Catch at least 5 to win!</p>
      <div class="arena-hud">
        <span>Hearts Caught: <b id="gameScore">0</b></span>
        <span>Time Left: <b id="gameTime">20</b>s</span>
      </div>
      <div class="arena" id="gameArena" aria-label="Tap falling items"></div>
      <div class="modal-actions">
        <button class="btn btn-primary" id="startCatch">Start Catching <span>💖</span></button>
      </div>
    `);

    let score = 0, time = 20, spawnTimer, clockTimer, running = false;
    const arena = $('#gameArena');

    const finish = () => {
      if (!running) return;
      running = false;
      clearInterval(spawnTimer);
      clearInterval(clockTimer);
      arena.innerHTML = '';
      $('#startCatch').textContent = 'Play Again ↻';
      $('#gameTime').textContent = '0';
      $('#gameScore').textContent = score;

      if (score >= 5) {
        state.catchBest = Math.max(state.catchBest, score);
        award('game-catch', 3, `Catch My Love cleared with ${score} points! +3 hearts 💖`);
      } else {
        showToast('Good try! Catch at least 5 items to earn your reward.');
      }
    };

    const spawn = () => {
      const item = document.createElement('button');
      item.className = 'falling-item';
      item.type = 'button';
      item.textContent = ['💖', '♥', '🌸', '🪔', '🍬'][Math.floor(Math.random() * 5)];
      item.style.left = `${6 + Math.random() * 84}%`;
      item.style.top = '-35px';
      item.style.animationDuration = `${1.8 + Math.random() * 1.1}s`;

      item.addEventListener('click', () => {
        if (!running) return;
        score++;
        $('#gameScore').textContent = score;
        item.remove();
        playTap();
      });
      item.addEventListener('animationend', () => item.remove());
      arena.appendChild(item);
    };

    const start = () => {
      clearInterval(spawnTimer);
      clearInterval(clockTimer);
      arena.innerHTML = '';
      score = 0;
      time = 20;
      running = true;
      $('#gameScore').textContent = '0';
      $('#gameTime').textContent = '20';
      $('#startCatch').textContent = 'Catching in progress…';
      spawn();
      spawnTimer = setInterval(spawn, 550);
      clockTimer = setInterval(() => {
        time--;
        $('#gameTime').textContent = time;
        if (time <= 0) finish();
      }, 1000);
    };

    $('#startCatch').addEventListener('click', start);
    activeGameCleanup = () => {
      running = false;
      clearInterval(spawnTimer);
      clearInterval(clockTimer);
    };
  }

  // Game 2: Diya Dash
  function startDiyaGame() {
    openModal(`
      <div class="modal-eyebrow">GAME 02 · DIWALI CHALLENGE</div>
      <h3>Diya Dash 🪔</h3>
      <p class="modal-lead">Tap the golden diyas to collect them. Avoid the pesky rain clouds 🌧️! You have 20 seconds.</p>
      <div class="arena-hud">
        <span>Diyas: <b id="gameScore">0</b></span>
        <span>Time Left: <b id="gameTime">20</b>s</span>
      </div>
      <div class="arena" id="gameArena"></div>
      <div class="modal-actions">
        <button class="btn btn-primary" id="startDiya">Start Diya Dash <span>🪔</span></button>
      </div>
    `);

    let score = 0, time = 20, spawnTimer, clockTimer, running = false;
    const arena = $('#gameArena');

    const finish = () => {
      if (!running) return;
      running = false;
      clearInterval(spawnTimer);
      clearInterval(clockTimer);
      arena.innerHTML = '';
      $('#startDiya').textContent = 'Play Again ↻';
      $('#gameTime').textContent = '0';

      if (score >= 5) {
        state.diyaBest = Math.max(state.diyaBest, score);
        award('game-diya', 3, `Diya Dash completed with ${score} diyas! +3 hearts 🪔`);
      } else {
        showToast('Keep glowing! Collect 5 diyas for your reward.');
      }
    };

    const spawn = () => {
      const isCloud = Math.random() < 0.25;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = `falling-item ${isCloud ? 'obstacle' : ''}`;
      item.textContent = isCloud ? '🌧️' : '🪔';
      item.style.left = `${6 + Math.random() * 84}%`;
      item.style.top = '-35px';
      item.style.animationDuration = `${1.9 + Math.random() * 1.0}s`;

      item.addEventListener('click', () => {
        if (!running) return;
        if (isCloud) {
          score = Math.max(0, score - 1);
        } else {
          score++;
          playDiyaSound();
        }
        $('#gameScore').textContent = score;
        item.remove();
      });
      item.addEventListener('animationend', () => item.remove());
      arena.appendChild(item);
    };

    const start = () => {
      clearInterval(spawnTimer);
      clearInterval(clockTimer);
      arena.innerHTML = '';
      score = 0;
      time = 20;
      running = true;
      $('#gameScore').textContent = '0';
      $('#gameTime').textContent = '20';
      $('#startDiya').textContent = 'Dashing in progress…';
      spawn();
      spawnTimer = setInterval(spawn, 580);
      clockTimer = setInterval(() => {
        time--;
        $('#gameTime').textContent = time;
        if (time <= 0) finish();
      }, 1000);
    };

    $('#startDiya').addEventListener('click', start);
    activeGameCleanup = () => {
      running = false;
      clearInterval(spawnTimer);
      clearInterval(clockTimer);
    };
  }

  // Game 3: Love Quiz
  function startQuiz() {
    let current = 0, right = 0;

    const render = () => {
      if (current >= C.quiz.length) {
        const note = right === C.quiz.length
          ? 'Full marks! You know our story inside out, my smart Buchua! 🥹💖'
          : `${right} out of ${C.quiz.length}! Our little story is still your favourite book, right? ♡`;

        openModal(`
          <div class="modal-eyebrow">GAME 03 · OUR ROMANTIC STORY</div>
          <h3>Quiz Complete! 💖</h3>
          <p class="modal-lead">${note}</p>
          <div class="letter-paper" style="text-align:center;">
            <span style="font-size:52px;color:var(--pink);">${right} / ${C.quiz.length}</span><br />
            A story written in starlight.
          </div>
          <div class="modal-actions" style="justify-content:center;">
            <button class="btn btn-primary" id="quizDone">Keep Exploring <span>♡</span></button>
          </div>
        `);
        state.quizDone = true;
        award('game-quiz', 3, 'Love Quiz completed! +3 hearts ✨');
        $('#quizDone').addEventListener('click', closeModal);
        return;
      }

      const q = C.quiz[current];
      openModal(`
        <div class="modal-eyebrow">QUESTION ${current + 1} OF ${C.quiz.length}</div>
        <h3>Love Story Quiz 💌</h3>
        <div class="quiz-progress"><span style="width:${((current) / C.quiz.length) * 100}%"></span></div>
        <p class="modal-lead" style="font-family:var(--font-serif);font-size:20px;color:#fff;">${q.question}</p>
        <div id="quizChoices">
          ${q.choices.map((choice, i) => `
            <button class="quiz-choice" data-choice="${i}">${choice}</button>
          `).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
        <div class="modal-actions">
          <button class="btn btn-primary" id="quizNext" disabled>
            ${current === C.quiz.length - 1 ? 'See Results' : 'Next Question'} <span>→</span>
          </button>
        </div>
      `);

      $$('.quiz-choice').forEach(button => button.addEventListener('click', () => {
        if ($('#quizNext').disabled === false) return;
        const selected = Number(button.dataset.choice);
        const correct = selected === q.answer;
        if (correct) right++;

        $$('.quiz-choice').forEach((b, i) => {
          b.disabled = true;
          if (i === q.answer) {
            b.style.borderColor = 'rgba(255, 209, 102, 0.8)';
            b.style.background = 'rgba(255, 209, 102, 0.15)';
          }
          if (i === selected && !correct) {
            b.style.borderColor = 'rgba(255, 80, 80, 0.8)';
            b.style.background = 'rgba(255, 80, 80, 0.15)';
          }
        });

        $('#quizFeedback').textContent = correct ? `✨ ${q.note}` : `Almost! ${q.note}`;
        $('#quizNext').disabled = false;
        playTap();
      }));

      $('#quizNext').addEventListener('click', () => {
        current++;
        render();
      });
    };

    render();
  }

  // Game 4: Find Hidden Charms
  function startHiddenHearts() {
    const objects = [
      { id: 'moon', icon: '🌙', label: 'Moonlight' },
      { id: 'rangoli', icon: '🪔', label: 'Rangoli Diya' },
      { id: 'lantern', icon: '🏮', label: 'Sky Lantern' },
      { id: 'star', icon: '✦', label: 'Starlight' },
      { id: 'gift', icon: '🎁', label: 'Gift Ribbon' }
    ];

    openModal(`
      <div class="modal-eyebrow">GAME 04 · TREASURE HUNT</div>
      <h3>Find Hidden Charms ♡</h3>
      <p class="modal-lead">Five lucky keepsakes are hiding inside our universe. Tap each one to uncover its hidden love charm!</p>
      <div class="arena-hud">
        <span>Found: <b id="foundCount">${state.found.length}</b> / 5</span>
        <span>Look closely ✧</span>
      </div>
      <div class="hidden-hunt">
        ${objects.map(o => `
          <button class="hunt-object ${state.found.includes(o.id) ? 'found' : ''}" data-hunt="${o.id}" ${state.found.includes(o.id) ? 'disabled' : ''}>
            <span>${state.found.includes(o.id) ? '💖' : o.icon}</span>
            <small>${state.found.includes(o.id) ? 'FOUND ♡' : o.label}</small>
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="huntMessage"></div>
    `);

    $$('[data-hunt]').forEach(button => button.addEventListener('click', () => {
      const id = button.dataset.hunt;
      if (state.found.includes(id)) return;
      state.found.push(id);
      button.classList.add('found');
      button.disabled = true;
      button.innerHTML = `<span>💖</span><small>FOUND ♡</small>`;
      $('#foundCount').textContent = state.found.length;
      $('#huntMessage').textContent = C.hiddenHeartMessages[state.found.length - 1];
      playChime();
      award(`hidden-${id}`, 1, 'A hidden love charm found! +1 heart 💖');

      if (state.found.length === 5) {
        $('#huntMessage').textContent = 'You found every hidden charm in our little universe! You found all my love too. 💖';
      }
    }));
  }

  // Game 5: Memory Match
  function startMemoryGame() {
    const icons = ['🪔', '💖', '🌙', '🌸', '🎁', '🧸'];
    let cards = [...icons, ...icons].map((icon, i) => ({ id: i, icon, pair: icon }));

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    let first = null, lock = false, matches = 0, moves = 0;

    openModal(`
      <div class="modal-eyebrow">GAME 05 · MEMORY MATCH</div>
      <h3>Little Memory Match ♡</h3>
      <p class="modal-lead">Find all 6 matching romantic pairs. Tap two cards at a time to flip them over!</p>
      <div class="arena-hud">
        <span>Pairs Found: <b id="matchCount">0</b> / 6</span>
        <span>Moves Made: <b id="moveCount">0</b></span>
      </div>
      <div class="memory-board" id="memoryBoard">
        ${cards.map(card => `
          <button class="memory-card" data-card="${card.id}" aria-label="Flip Card">?</button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="memoryMessage"></div>
    `);

    const board = $('#memoryBoard');
    $$('[data-card]', board).forEach(button => button.addEventListener('click', () => {
      if (lock || button.classList.contains('flipped') || button.classList.contains('matched')) return;
      const card = cards.find(c => c.id === Number(button.dataset.card));
      button.classList.add('flipped');
      button.textContent = card.icon;
      playTap();

      if (!first) {
        first = { button, card };
        return;
      }

      moves++;
      $('#moveCount').textContent = moves;

      if (first.card.pair === card.pair) {
        button.classList.add('matched');
        first.button.classList.add('matched');
        first = null;
        matches++;
        $('#matchCount').textContent = matches;
        playChime();

        if (matches === 6) {
          $('#memoryMessage').textContent = 'All 6 pairs matched! You have the sweetest and sharpest mind. ✨';
          state.memoryDone = true;
          award('game-memory', 4, 'Memory Match cleared! +4 hearts 💖');
        }
      } else {
        lock = true;
        const previous = first;
        first = null;
        setTimeout(() => {
          previous.button.classList.remove('flipped');
          previous.button.textContent = '?';
          button.classList.remove('flipped');
          button.textContent = '?';
          lock = false;
        }, 750);
      }
    }));
  }

  // Game 6: Magic Love Fortune Cookie
  function startFortuneCookie() {
    const fortunes = C.fortunes || [
      "Your smile lights up Kaushal's entire world.",
      "You are loved far more deeply than words could ever describe."
    ];
    const picked = fortunes[Math.floor(Math.random() * fortunes.length)];

    openModal(`
      <div class="modal-eyebrow">GAME 06 · SWEET COMPLIMENT</div>
      <h3>Magic Love Fortune 🥠</h3>
      <p class="modal-lead">Tap the golden fortune cookie to crack it open and reveal Sona's secret compliment!</p>
      <div class="gift-reveal">
        <span class="gift-box-big" id="fortuneCookie" style="cursor:pointer;">🥠</span>
        <h4 id="fortuneTitle">Tap to Crack Cookie!</h4>
        <p id="fortuneBody" style="font-family:var(--font-serif);font-size:18px;color:#fce4ee;margin:14px 0;"></p>
        <button class="btn btn-primary" id="openCookieBtn">Crack Open <span>✨</span></button>
      </div>
    `);

    const openCookie = () => {
      playDiyaSound();
      $('#fortuneCookie').textContent = '🥠✨';
      $('#fortuneCookie').classList.add('open');
      $('#fortuneTitle').textContent = 'A Sweet Truth For Sona:';
      $('#fortuneBody').textContent = `“${picked}”`;
      $('#openCookieBtn').disabled = true;
      $('#openCookieBtn').textContent = 'Cookie Cracked ♡';
      award('game-fortune', 2, 'Magic Love Fortune cracked open! +2 hearts 🥠✨');
    };

    $('#openCookieBtn').addEventListener('click', openCookie);
    $('#fortuneCookie').addEventListener('click', openCookie);
  }

  // Surprises Launcher
  function launchSurprise(id) {
    playTap();
    if (id === 'scratch') return openScratch();
    if (id === 'gift') return openGift();
    if (id === 'wheel') return openWheel();
    if (id === 'coupons') return openCoupons();
    if (id === 'password') return openPassword();
    if (id === 'hug') return showHug();
    if (id === 'audio') return openAudio();
  }

  // Surprise 1: Scratch & Reveal Card
  function openScratch() {
    const message = C.scratchMessages[Math.floor(Math.random() * C.scratchMessages.length)];
    openModal(`
      <div class="modal-eyebrow">A SECRET GOLDEN NOTE</div>
      <h3>Scratch & Reveal ✧</h3>
      <p class="modal-lead">Use your mouse or finger to scratch off the golden metallic layer below!</p>
      <div class="scratch-wrap">
        <div class="scratch-reveal">${message}</div>
        <canvas class="scratch-canvas" id="scratchCanvas"></canvas>
      </div>
      <p class="section-subtitle" style="text-align:center;margin-top:12px;">Keep scratching to illuminate the hidden words ♡</p>
    `);

    const canvas = $('#scratchCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#ffd166');
    grad.addColorStop(0.5, '#f4a261');
    grad.addColorStop(1, '#ff758f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = 'rgba(26, 11, 38, 0.35)';
    ctx.font = '700 13px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE WITH LOVE ✨', rect.width / 2, rect.height / 2);

    let drawing = false, checks = 0, awarded = false;
    const scratch = e => {
      const box = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - box.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - box.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      checks++;
      if (checks > 18 && !awarded) {
        awarded = true;
        award('surprise-scratch', 2, 'Hidden message revealed! +2 hearts 💌');
      }
    };

    canvas.addEventListener('pointerdown', e => { drawing = true; scratch(e); });
    canvas.addEventListener('pointermove', e => { if (drawing) scratch(e); });
    window.addEventListener('pointerup', () => { drawing = false; });
  }

  // Surprise 2: Mystery Gift Box
  function openGift() {
    const gift = C.giftMessages[Math.floor(Math.random() * C.giftMessages.length)];
    openModal(`
      <div class="modal-eyebrow">A FESTIVE GIFT BOX</div>
      <h3>Mystery Gift Box 🎁</h3>
      <p class="modal-lead">A little treat picked directly from Kaushal's heart. Tap the box to untie the ribbon!</p>
      <div class="gift-reveal">
        <span class="gift-box-big" id="giftBox">🎁</span>
        <h4 id="giftTitle">Still wrapped tight…</h4>
        <p id="giftBody">Tap the button to open it!</p>
        <button class="btn btn-primary" id="openGiftButton">Unwrap My Gift <span>✧</span></button>
      </div>
    `);

    $('#openGiftButton').addEventListener('click', () => {
      playDiyaSound();
      const box = $('#giftBox');
      box.classList.add('open');
      box.textContent = '💖';
      $('#giftTitle').textContent = gift.title;
      $('#giftBody').textContent = gift.body;
      $('#openGiftButton').disabled = true;
      $('#openGiftButton').textContent = 'Gift Opened ♡';
      award('surprise-gift', 2, 'Mystery gift box opened! +2 hearts 🎁');
    });
  }

  // Surprise 3: Spin The Wheel of Love
  let lastRotation = 0;
  function openWheel() {
    openModal(`
      <div class="modal-eyebrow">LET FATE CHOOSE A CUTE TREAT</div>
      <h3>Spin The Love Wheel 🎡</h3>
      <p class="modal-lead">Whatever it lands on, you get to redeem it from Kaushal without any arguments!</p>
      <div class="wheel-wrap">
        <div class="wheel-pointer">▼</div>
        <div class="love-wheel" id="loveWheel"></div>
      </div>
      <div class="wheel-result" id="wheelResult">Ready when you are, Buchua.</div>
      <div class="modal-actions" style="justify-content:center;">
        <button class="btn btn-primary" id="spinWheel">Spin For Love <span>↻</span></button>
      </div>
    `);

    $('#spinWheel').addEventListener('click', () => {
      const idx = Math.floor(Math.random() * C.wheelPrizes.length);
      const segment = 360 / C.wheelPrizes.length;
      lastRotation += 360 * 5 + (360 - idx * segment - segment / 2);
      $('#loveWheel').style.transform = `rotate(${lastRotation}deg)`;
      $('#spinWheel').disabled = true;
      $('#wheelResult').textContent = 'Spinning the magic wheel…';

      setTimeout(() => {
        $('#wheelResult').textContent = `Your treat: ${C.wheelPrizes[idx]} ♡`;
        $('#spinWheel').disabled = false;
        $('#spinWheel').textContent = 'Spin Again ↻';
        award('surprise-wheel', 2, 'Love Wheel spun! +2 hearts ✨');
      }, 4200);
    });
  }

  // Surprise 4: Redeemable Love Coupons
  function openCoupons() {
    openModal(`
      <div class="modal-eyebrow">EXCLUSIVE LOVE PASSES</div>
      <h3>Redeemable Love Coupons 🎟️</h3>
      <p class="modal-lead">Special vouchers Sona can redeem anytime. Tap 'Redeem' to stamp a coupon!</p>
      <div class="coupons-modal-grid">
        ${C.coupons.map(coupon => {
          const isRedeemed = state.redeemedCoupons.includes(coupon.id);
          return `
            <div class="coupon-item ${isRedeemed ? 'redeemed' : ''}" data-coupon-id="${coupon.id}">
              <div class="coupon-top">
                <span class="coupon-icon">${coupon.icon}</span>
                <span class="coupon-tag">${coupon.tag}</span>
              </div>
              <h4 class="coupon-title">${coupon.title}</h4>
              <p class="coupon-desc">${coupon.desc}</p>
              <p class="coupon-fine">${coupon.finePrint}</p>
              <button class="btn btn-xs btn-primary coupon-redeem-btn" ${isRedeemed ? 'disabled' : ''}>
                ${isRedeemed ? 'Redeemed ♡' : 'Redeem Now 🎟️'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `);

    $$('.coupon-redeem-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const item = e.target.closest('.coupon-item');
        const cid = item.dataset.couponId;
        if (state.redeemedCoupons.includes(cid)) return;

        playStampSound();
        state.redeemedCoupons.push(cid);
        item.classList.add('redeemed');
        btn.disabled = true;
        btn.textContent = 'Redeemed ♡';
        award(`coupon-${cid}`, 1, 'Coupon redeemed! Kaushal will honour it wholeheartedly ♡');
      });
    });
  }

  // Surprise 5: Secret Room (Password Protected)
  function openPassword() {
    openModal(`
      <div class="modal-eyebrow">A ROOM ONLY YOU CAN ENTER</div>
      <h3>The Secret Room 🔐</h3>
      <p class="modal-lead">A tiny word between us is the key. Hint: Think of the sweet nickname Kaushal calls you…</p>
      <form class="secret-form" id="secretForm">
        <input id="secretInput" type="text" autocomplete="off" placeholder="Enter secret word (e.g. BUCHUA)" class="form-input" />
        <button class="btn btn-primary" type="submit">Unlock</button>
      </form>
      <div class="secret-result" id="secretResult"></div>
    `);

    $('#secretForm').addEventListener('submit', e => {
      e.preventDefault();
      const val = $('#secretInput').value.trim().toUpperCase();
      const valid = val === String(C.secretPassword).toUpperCase() || val === 'SONA';

      if (valid) {
        playChime();
        $('#secretResult').innerHTML = `
          <b>Secret Room Unlocked! 💖</b><br />
          No matter how many stars shine in the universe, my eyes will always search for you. 
          You are my safe harbour, my favourite laugh, and my greatest blessing. Happy Diwali, Buchua. ♡
        `;
        award('surprise-password', 2, 'Secret room unlocked! +2 hearts 🔐💖');
      } else {
        $('#secretResult').textContent = 'Not quite, my love! Hint: It starts with B and ends with A (Buchua) ♡';
      }
    });
  }

  // Surprise 6: Digital Hug
  function showHug() {
    playChime();
    const overlay = $('#hugOverlay');
    $('#hugNickname').textContent = C.nickname || 'Buchua';
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    const holder = $('#hugBurst');
    holder.innerHTML = '';
    for (let i = 0; i < 24; i++) {
      const heart = document.createElement('span');
      heart.className = 'hug-heart';
      heart.textContent = ['💖', '♥', '🌸', '🫂', '🤍'][i % 5];
      heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 85}vw`);
      heart.style.animationDelay = `${Math.random() * 0.9}s`;
      holder.appendChild(heart);
    }
    award('surprise-hug', 1, 'A tight, warm digital hug sent! +1 heart 🫂💖');
  }

  // Surprise 7: Voice Note & Sweet Melody
  function openAudio() {
    openModal(`
      <div class="modal-eyebrow">A PIECE OF MY HEART IN SOUND</div>
      <h3>Voice Note & Sweet Melody 🎙️</h3>
      <p class="modal-lead">For the quiet moments when you want to feel Kaushal right beside you.</p>
      <div class="letter-paper" style="text-align:center;">
        <span style="font-size:44px;color:var(--pink);">🎵</span><br />
        A sweet instrumental melody is ready for you.<br />
        <small style="color:var(--text-muted);font-size:12px;">(You can also replace assets/audio/sona-voice-message.mp3 with your personal voice recording anytime!)</small>
      </div>
      <audio id="voicePlayer" controls style="width:100%;margin-top:16px;" src="assets/audio/sona-voice-message.mp3" preload="auto"></audio>
    `);

    const player = $('#voicePlayer');
    player.addEventListener('play', () => {
      award('surprise-audio', 1, 'Sweet melody / voice note played! +1 heart 🎙️💖');
    });
  }

  // Secret Finale Letter & Grand Fireworks
  function openFinale() {
    if (state.hearts < FINAL_TARGET) {
      showToast(`The grand finale is waiting for ${FINAL_TARGET} hearts! You have ${state.hearts}. ♡`);
      return;
    }

    const message = C.finalLetter.replaceAll('{{from}}', C.from);
    openModal(`
      <div class="modal-eyebrow" style="text-align:center;">THE FINAL PAGE OF OUR LITTLE UNIVERSE</div>
      <h3 style="text-align:center;">${C.finalLetterTitle} ✨</h3>
      <p class="modal-lead" style="text-align:center;">A letter from ${C.from}, written with all the love in the universe.</p>
      <div class="letter-paper">${message}</div>
      <div class="modal-actions" style="justify-content:center;">
        <button class="btn btn-primary" id="fireworksButton">
          <span>Make The Sky Sparkle 🎆</span>
        </button>
      </div>
    `);

    $('#fireworksButton').addEventListener('click', startFireworks);
  }

  function startFireworks() {
    playChime();
    const layer = document.createElement('div');
    layer.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden;';
    document.body.appendChild(layer);

    for (let i = 0; i < 85; i++) {
      const spark = document.createElement('i');
      spark.textContent = ['✦', '✧', '🎆', '💖', '🪔', '✨'][i % 6];
      spark.style.cssText = `
        position: absolute;
        left: ${5 + Math.random() * 90}%;
        top: ${10 + Math.random() * 80}%;
        font-style: normal;
        font-size: ${12 + Math.random() * 24}px;
        color: ${['#ffd166', '#ff758f', '#fff', '#7209b7', '#4cc9f0'][i % 5]};
        text-shadow: 0 0 16px currentColor;
        animation: fireworkPop ${0.8 + Math.random() * 1.4}s ease-out ${Math.random() * 0.6}s both;
      `;
      layer.appendChild(spark);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fireworkPop {
        0% { opacity: 0; transform: scale(0.1) translateY(50px); }
        30% { opacity: 1; }
        100% { opacity: 0; transform: scale(2.2) translateY(-90px); }
      }
    `;
    layer.appendChild(style);
    setTimeout(() => layer.remove(), 2800);
    showToast('Happy Diwali, My Sona. Keep shining brighter than every star! 💖✨');
  }

  // Background Ambient Canvas Particles
  function initAmbientCanvas() {
    const canvas = $('#ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.8 + Math.random() * 2.2,
        vy: -0.15 - Math.random() * 0.35,
        vx: (Math.random() - 0.5) * 0.2,
        alpha: Math.random(),
        da: 0.008 + Math.random() * 0.012
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.alpha += p.da;
        if (p.alpha <= 0.1 || p.alpha >= 0.85) p.da = -p.da;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, p.alpha);
        ctx.fillStyle = '#ffd166';
        ctx.shadowColor = '#ffd166';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Welcome Enter
    const enterUniverse = () => {
      playTap();
      playDiyaSound();
      $('#welcomeScreen').classList.add('leaving');
      $('#siteShell').classList.add('visible');
      $('#siteShell').setAttribute('aria-hidden', 'false');
      setTimeout(() => { $('#welcomeScreen').style.display = 'none'; }, 850);
      showToast(`Welcome to your festive universe, ${C.nickname || 'Sona'}! 💖✨`);
      playMusic();
    };

    $('#enterButton').addEventListener('click', enterUniverse);
    $('#welcomeDiyaAction').addEventListener('click', enterUniverse);
    $('#welcomeDiyaAction').addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') enterUniverse();
    });

    // Music Toggles
    $('#musicToggle').addEventListener('click', toggleMusic);
    $('#dockPlayBtn').addEventListener('click', toggleMusic);
    $('#dockNextBtn').addEventListener('click', nextTrack);

    // Sound FX Toggle
    $('#soundToggle').addEventListener('click', () => {
      window.sonaSoundEnabled = !window.sonaSoundEnabled;
      $('#soundIcon').textContent = window.sonaSoundEnabled ? '🔔' : '🔕';
      $('#soundToggle').classList.toggle('active', !window.sonaSoundEnabled);
      showToast(window.sonaSoundEnabled ? 'Sound effects enabled! 🔔' : 'Sound effects muted. 🔕');
    });

    // Mobile Menu
    const drawer = $('#mobileNavDrawer');
    $('#mobileMenuBtn').addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
    $$('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => drawer.classList.remove('open'));
    });

    // Global Modal & Overlays
    $('#modalClose').addEventListener('click', closeModal);
    $('#modal').addEventListener('click', e => {
      if (e.target === $('#modal')) closeModal();
    });

    $('#heroHug').addEventListener('click', showHug);
    $('#closeHug').addEventListener('click', () => $('#hugOverlay').classList.remove('show'));
    $('#hugOverlay').addEventListener('click', e => {
      if (e.target === $('#hugOverlay')) $('#hugOverlay').classList.remove('show');
    });

    $('#makeWish').addEventListener('click', () => {
      revealWish(Math.floor(Math.random() * C.wishes.length));
    });

    $('#finaleButton').addEventListener('click', openFinale);

    // Hero Diyas Click
    $('#heroDiyaLeft').addEventListener('click', () => {
      playDiyaSound();
      showToast('The flame of love burns steady and bright! 🪔✨');
    });
    $('#heroDiyaRight').addEventListener('click', () => {
      playDiyaSound();
      showToast('Another diya glowing for Sona! 🪔✨');
    });

    // Global Delegated Clicks
    document.addEventListener('click', e => {
      const gameBtn = e.target.closest('[data-open-game]');
      const surpriseBtn = e.target.closest('[data-surprise]');
      const letterBtn = e.target.closest('[data-letter]');

      if (gameBtn) launchGame(gameBtn.dataset.openGame);
      if (surpriseBtn) launchSurprise(surpriseBtn.dataset.surprise);
      if (letterBtn) openLetter(letterBtn.dataset.letter);
    });
  }

  // Initialization
  function init() {
    $('#welcomeName').textContent = `My ${C.name}`;
    $('#heroName').textContent = C.name;
    $('#fromName').textContent = C.from;
    $('#footerFrom').textContent = C.from.toUpperCase();
    document.title = `${C.name}'s Diwali Universe 💗✨`;

    setTrack(0);
    initLoveTimer();
    renderDiyaCeremony();
    initSparkler();
    initSkyLantern();
    renderPhotos();
    renderLetters();
    renderGalaxy();
    initAmbientCanvas();
    updateProgress();
    setupEventListeners();
  }

  // Start after DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

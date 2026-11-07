(() => {
  'use strict';

  const C = window.SONA_CONTENT;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const FINAL_TARGET = 20;
  const STORAGE_KEY = 'sonas-diwali-universe-mobile-v3';

  const freshState = () => ({
    hearts: 0,
    awards: [],
    openedLetters: [],
    litDiyas: [],
    redeemedCoupons: [],
    customPhotos: {},
    slotBest: '',
    stackerBest: 0,
    flyBest: 0,
    constellationDone: false,
    rangoliDone: false
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

  // Save state
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
    triggerHaptic();
    showToast(message || `Collected +${points} heart${points === 1 ? '' : 's'}! 💖`);
    createFloatingHeartBurst();
    return true;
  }

  // Haptic feedback (Mobile native feel)
  function triggerHaptic(ms = 40) {
    try {
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch (_) {}
  }

  // Update progress
  function updateProgress() {
    const safeHearts = Math.max(0, state.hearts);
    const percent = Math.min(100, Math.round((safeHearts / FINAL_TARGET) * 100));

    $('#heartCount').textContent = `${safeHearts} ${safeHearts === 1 ? 'heart' : 'hearts'} collected`;
    $('#navHeartCount').textContent = `${safeHearts}`;
    $('#progressPercent').textContent = `${percent}%`;
    $('#progressFill').style.width = `${percent}%`;

    const unlocked = safeHearts >= FINAL_TARGET;
    $('#unlockStatus').textContent = unlocked ? 'Secret finale letter unlocked! 💖' : `${FINAL_TARGET - safeHearts} hearts to unlock secret finale`;
    $('#lockSymbol').textContent = unlocked ? '💖' : '🔒';
    $('#finaleProgressText').textContent = `${Math.min(safeHearts, FINAL_TARGET)} / ${FINAL_TARGET} hearts collected`;
    $('#finaleButton').disabled = !unlocked;
    $('#finaleLock').textContent = unlocked ? '💖' : '🔒';
    $('#finaleDescription').textContent = unlocked
      ? 'You lit up every corner of our universe. Your grand finale surprise is ready, my Sona.'
      : `Collect ${FINAL_TARGET} hearts from your little adventures to open the final letter & grand fireworks show.`;
    $('#finale').classList.toggle('unlocked', unlocked);
  }

  // Toast feedback
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
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
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch (_) {}
  }

  function playChime() {
    if (!window.sonaSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        const start = ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
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
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (_) {}
  }

  function playSlotTick() {
    if (!window.sonaSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (_) {}
  }

  // Floating Heart Particle Burst
  function createFloatingHeartBurst() {
    const burst = document.createElement('div');
    burst.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(burst);

    for (let i = 0; i < 16; i++) {
      const heart = document.createElement('span');
      heart.textContent = ['💖', '✨', '🪔', '♡', '🌸'][i % 5];
      heart.style.cssText = `
        position: absolute;
        left: ${45 + Math.random() * 10}%;
        bottom: 30%;
        font-size: ${18 + Math.random() * 16}px;
        transform: translate(-50%, 0);
        animation: floatBurst 1.8s cubic-bezier(0.12, 0.8, 0.3, 1) forwards;
        --dx: ${(Math.random() - 0.5) * 240}px;
        --dy: -${140 + Math.random() * 220}px;
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

  // Audio Music System
  const bgMusic = $('#bgMusic');

  function setTrack(index) {
    currentTrackIndex = (index + C.audioTracks.length) % C.audioTracks.length;
    const track = C.audioTracks[currentTrackIndex];
    bgMusic.src = track.file;
  }

  async function playMusic() {
    try {
      getAudioContext();
      if (!bgMusic.src) setTrack(currentTrackIndex);
      await bgMusic.play();
      isMusicPlaying = true;
      $('#musicToggle').classList.add('playing');
      $('#musicPillLabel').textContent = 'Playing ♫';
    } catch (_) {
      isMusicPlaying = false;
      $('#musicToggle').classList.remove('playing');
      $('#musicPillLabel').textContent = 'Play ♫';
    }
  }

  function pauseMusic() {
    bgMusic.pause();
    isMusicPlaying = false;
    $('#musicToggle').classList.remove('playing');
    $('#musicPillLabel').textContent = 'Play ♫';
  }

  function toggleMusic() {
    if (isMusicPlaying) pauseMusic();
    else playMusic();
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

  // 5-Diya Sacred Ceremony with Ornate SVG
  function renderDiyaCeremony() {
    const row = $('#diyaCeremonyRow');
    row.innerHTML = C.diyas.map(diya => {
      const isLit = state.litDiyas.includes(diya.id);
      return `
        <div class="diya-card ${isLit ? 'lit' : ''}" data-diya-id="${diya.id}" role="button" tabindex="0">
          <div class="diya-card-img-wrap">
            <img src="assets/svg/diya-ornate.svg" alt="${diya.name}" class="diya-card-svg ${isLit ? '' : 'diya-unlit-mask'}" />
          </div>
          <b class="diya-card-title">${diya.name}</b>
          <span class="diya-card-hindi">${diya.hindi}</span>
          <span class="diya-card-tag">${isLit ? 'GLOWING ✨' : 'TAP TO LIGHT'}</span>
        </div>
      `;
    }).join('');

    $$('.diya-card', row).forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.diyaId;
        const diya = C.diyas.find(d => d.id === id);
        if (!diya) return;

        playDiyaSound();
        triggerHaptic(50);

        if (!state.litDiyas.includes(id)) {
          state.litDiyas.push(id);
          card.classList.add('lit');
          $('.diya-card-svg', card).classList.remove('diya-unlit-mask');
          $('.diya-card-tag', card).textContent = 'GLOWING ✨';
          award(`ceremony-${id}`, 1, `You lit the ${diya.name}! +1 heart 🪔`);
        }

        openModal(`
          <div class="card-eyebrow" style="text-align:center;">🪔 SACRED BLESSING · ${diya.hindi}</div>
          <h3 style="text-align:center;margin:6px 0 16px;">${diya.name} ✨</h3>
          <div style="width:110px;height:90px;margin:0 auto 12px;">
            <img src="assets/svg/diya-ornate.svg" alt="Diya" style="width:100%;height:100%;display:block;" />
          </div>
          <div class="letter-paper" style="text-align:center;font-size:16px;">
            <p>${diya.message}</p>
          </div>
          <div style="display:flex;justify-content:center;margin-top:16px;">
            <button class="btn btn-primary" id="diyaWishClose">Receive Blessing ♡</button>
          </div>
        `);
        $('#diyaWishClose').addEventListener('click', closeModal);

        if (state.litDiyas.length === C.diyas.length && !state.awards.includes('ceremony-all-diyas')) {
          award('ceremony-all-diyas', 3, 'All 5 sacred Diyas are shining bright for Sona! 🪔✨');
          $('#ceremonyStatus').innerHTML = '<b>✨ All 5 sacred Diyas are fully glowing! Happy Diwali, Sona! ✨</b>';
        }
      });
    });

    if (state.litDiyas.length === C.diyas.length) {
      $('#ceremonyStatus').innerHTML = '<b>✨ All 5 sacred Diyas are fully glowing! Happy Diwali, Sona! ✨</b>';
    }
  }

  // ==========================================================
  // BRAND NEW GAME 1: SKY LANTERN FLIGHT (उड़ता दीप)
  // ==========================================================
  function startSkyLanternFlight() {
    openModal(`
      <div class="card-eyebrow">GAME 01 · ACTION FLIGHT</div>
      <h3>Sky Lantern Flight 🏮</h3>
      <p class="section-info">Tap screen to keep your glowing paper lantern floating! Catch 6 golden hearts while dodging stormy rain clouds.</p>
      <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:var(--gold);margin-bottom:8px;">
        <span>Hearts: <b id="flyScore">0</b>/6</span>
        <span>Lives: <b id="flyLives">❤️❤️❤️</b></span>
      </div>
      <div class="fly-arena-wrap">
        <canvas id="flyCanvas"></canvas>
        <div class="arena-overlay-tap" id="flyTapOverlay">
          <span>👆 TAP SCREEN TO FLY! 👆<br /><small style="color:var(--text-muted);font-weight:400;">Avoid clouds 🌧️, catch hearts 💖</small></span>
        </div>
      </div>
    `);

    const canvas = $('#flyCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let score = 0, lives = 3, running = false;
    let lanternY = canvas.height / 2, lanternVy = 0;
    const gravity = 0.22, jump = -4.5;
    let items = [], particles = [];
    let frameId;

    const overlay = $('#flyTapOverlay');

    function flap() {
      if (!running) {
        running = true;
        overlay.style.display = 'none';
      }
      lanternVy = jump;
      playTap();
      triggerHaptic(30);

      // Add cute sparks under lantern
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: 55, y: lanternY + 18,
          vx: -1 - Math.random() * 2,
          vy: 1 + Math.random() * 2,
          alpha: 1,
          size: 2 + Math.random() * 2
        });
      }
    }

    canvas.addEventListener('pointerdown', e => {
      e.preventDefault();
      flap();
    });

    let spawnTimer = 0;
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (running) {
        lanternVy += gravity;
        lanternY += lanternVy;

        if (lanternY > canvas.height - 25) { lanternY = canvas.height - 25; lanternVy = 0; }
        if (lanternY < 20) { lanternY = 20; lanternVy = 0; }

        spawnTimer++;
        if (spawnTimer % 65 === 0) {
          const isHeart = Math.random() < 0.65;
          items.push({
            x: canvas.width + 20,
            y: 35 + Math.random() * (canvas.height - 70),
            type: isHeart ? 'heart' : 'cloud',
            symbol: isHeart ? '💖' : '🌧️',
            size: isHeart ? 22 : 26
          });
        }
      }

      // Draw lantern
      ctx.save();
      ctx.translate(55, lanternY);
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 12;
      ctx.fillText('🏮', 0, 0);
      ctx.restore();

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.03;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(255, 209, 102, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (running) item.x -= 2.6;

        ctx.font = `${item.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.symbol, item.x, item.y);

        // Collision check
        const dx = item.x - 55;
        const dy = item.y - lanternY;
        const dist = Math.hypot(dx, dy);

        if (dist < 26) {
          if (item.type === 'heart') {
            score++;
            $('#flyScore').textContent = score;
            playChime();
            triggerHaptic(60);
            items.splice(i, 1);

            if (score >= 6) {
              running = false;
              award('game-fly', 3, 'Sky Lantern Flight cleared with 6 hearts! +3 hearts 🏮💖');
              overlay.style.display = 'grid';
              overlay.innerHTML = `<span>🎉 YOU WON! 🎉<br />Sky Lantern reached the stars!<br /><small>Tap below to close</small></span>`;
              return;
            }
          } else {
            lives--;
            $('#flyLives').textContent = '❤️'.repeat(Math.max(0, lives));
            triggerHaptic(120);
            items.splice(i, 1);

            if (lives <= 0) {
              running = false;
              overlay.style.display = 'grid';
              overlay.innerHTML = `<span>🌧️ Rain overwhelmed the lantern!<br /><small>Tap anywhere to try again</small></span>`;
              return;
            }
          }
        } else if (item.x < -30) {
          items.splice(i, 1);
        }
      }

      frameId = requestAnimationFrame(loop);
    }

    loop();
    activeGameCleanup = () => {
      running = false;
      cancelAnimationFrame(frameId);
    };
  }

  // ==========================================================
  // BRAND NEW GAME 2: DIYA TOWER STACKER (दीया टॉवर)
  // ==========================================================
  function startDiyaStacker() {
    openModal(`
      <div class="card-eyebrow">GAME 02 · TIMING & BALANCE</div>
      <h3>Diya Tower Stacker 🪔</h3>
      <p class="section-info">Tap screen at the exact moment to stack swinging golden diyas! Build a 5-tier Diwali tower to win.</p>
      <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:var(--gold);margin-bottom:8px;">
        <span>Tiers Stacked: <b id="stackScore">0</b>/5</span>
        <span>Goal: 5 Tiers ✨</span>
      </div>
      <div class="stack-arena-wrap">
        <canvas id="stackCanvas"></canvas>
      </div>
      <div style="text-align:center;margin-top:10px;">
        <button class="btn btn-primary btn-full" id="stackDropBtn">Tap Screen or Click to Drop Diya 🪔</button>
      </div>
    `);

    const canvas = $('#stackCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const diyaImg = new Image();
    diyaImg.src = 'assets/svg/diya-ornate.svg';

    let stacked = [{ x: canvas.width / 2 - 32, y: canvas.height - 45, w: 64, h: 42 }];
    let swinging = { x: canvas.width / 2 - 32, y: 35, w: 64, h: 42, vx: 3.2 };
    let isFalling = false;
    let score = 0;
    let frameId;

    function drop() {
      if (isFalling || score >= 5) return;
      isFalling = true;
      playTap();
      triggerHaptic(40);
    }

    canvas.addEventListener('pointerdown', drop);
    $('#stackDropBtn').addEventListener('click', drop);

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Altar Base
      ctx.fillStyle = '#3a1854';
      ctx.fillRect(20, canvas.height - 8, canvas.width - 40, 8);

      // Draw stacked diyas
      stacked.forEach(d => {
        if (diyaImg.complete) ctx.drawImage(diyaImg, d.x, d.y, d.w, d.h);
        else {
          ctx.fillStyle = '#ffd166';
          ctx.fillRect(d.x, d.y, d.w, d.h);
        }
      });

      // Update swinging/falling diya
      if (!isFalling) {
        swinging.x += swinging.vx;
        if (swinging.x > canvas.width - swinging.w - 15 || swinging.x < 15) {
          swinging.vx = -swinging.vx;
        }

        // Hanging chain
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(swinging.x + swinging.w / 2, swinging.y);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        swinging.y += 6.5; // drop speed
        const topStacked = stacked[stacked.length - 1];

        if (swinging.y >= topStacked.y - swinging.h + 8) {
          // Check alignment
          const diff = Math.abs(swinging.x - topStacked.x);
          if (diff < 36) {
            // Good stack!
            score++;
            $('#stackScore').textContent = score;
            playChime();
            triggerHaptic(80);
            stacked.push({ x: swinging.x, y: topStacked.y - swinging.h + 8, w: swinging.w, h: swinging.h });

            if (score >= 5) {
              award('game-stacker', 3, 'Diya Tower completed! +3 hearts 🪔✨');
              showToast('✨ Sacred Diya Tower fully stacked! Happy Diwali! ✨');
              $('#stackDropBtn').disabled = true;
              $('#stackDropBtn').textContent = 'Tower Completed! 💖';
              return;
            }

            // Next tier
            swinging = {
              x: canvas.width / 2 - 32,
              y: 35,
              w: 64,
              h: 42,
              vx: (swinging.vx > 0 ? 1 : -1) * (3.2 + score * 0.45)
            };
            isFalling = false;
          } else {
            // Missed / Toppled
            showToast('The diya slipped! Tap to try again ♡');
            triggerHaptic(150);
            score = 0;
            $('#stackScore').textContent = '0';
            stacked = [{ x: canvas.width / 2 - 32, y: canvas.height - 45, w: 64, h: 42 }];
            swinging = { x: canvas.width / 2 - 32, y: 35, w: 64, h: 42, vx: 3.2 };
            isFalling = false;
          }
        }
      }

      // Draw active diya
      if (diyaImg.complete) ctx.drawImage(diyaImg, swinging.x, swinging.y, swinging.w, swinging.h);

      frameId = requestAnimationFrame(loop);
    }

    loop();
    activeGameCleanup = () => cancelAnimationFrame(frameId);
  }

  // ==========================================================
  // BRAND NEW GAME 3: LOVE JACKPOT SLOT MACHINE (प्यार का जैकपॉट)
  // ==========================================================
  function startLoveSlotMachine() {
    const symbols = ['🪔', '💖', '💍', '🌸', '🧸', '🎁'];

    openModal(`
      <div class="card-eyebrow">GAME 03 · CHANCE & ROMANCE</div>
      <h3>Love Jackpot Slot 🎰</h3>
      <p class="section-info">Pull the golden lever to spin the 3 reels! Hit 3 matching charms to win special couple promises.</p>
      <div class="slot-machine-wrap">
        <div class="slot-reels-box">
          <div class="slot-reel" id="reel1">🪔</div>
          <div class="slot-reel" id="reel2">💖</div>
          <div class="slot-reel" id="reel3">🪔</div>
        </div>
        <div class="slot-result-banner" id="slotBanner">Tap 'SPIN FOR LOVE' to win Sona's jackpot!</div>
        <button class="btn btn-primary btn-full btn-glow" id="slotSpinBtn">
          <span>SPIN FOR LOVE 🎰</span>
        </button>
      </div>
    `);

    const r1 = $('#reel1'), r2 = $('#reel2'), r3 = $('#reel3');
    const banner = $('#slotBanner');
    const spinBtn = $('#slotSpinBtn');

    spinBtn.addEventListener('click', () => {
      spinBtn.disabled = true;
      r1.classList.add('spinning');
      r2.classList.add('spinning');
      r3.classList.add('spinning');
      banner.textContent = 'Reels spinning with love…';
      playTap();
      triggerHaptic(40);

      let counter = 0;
      const tickTimer = setInterval(() => {
        counter++;
        r1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        r2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        r3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        playSlotTick();

        if (counter > 18) {
          clearInterval(tickTimer);
          r1.classList.remove('spinning');
          r2.classList.remove('spinning');
          r3.classList.remove('spinning');
          spinBtn.disabled = false;

          // Determine outcome (generous win rate for Sona!)
          const pick = symbols[Math.floor(Math.random() * symbols.length)];
          const winJackpot = Math.random() < 0.6; // 60% jackpot chance!

          if (winJackpot) {
            r1.textContent = pick;
            r2.textContent = pick;
            r3.textContent = pick;
            const matchStr = pick + pick + pick;
            const prize = C.slotPrizes.find(p => p.match === matchStr) || C.slotPrizes[0];
            banner.innerHTML = `<b>🎉 ${prize.title}</b><br /><small>${prize.text}</small>`;
            playChime();
            triggerHaptic(100);
            award('game-slot', 3, 'JACKPOT! Love slot matched! +3 hearts 🎰💖');
          } else {
            banner.textContent = 'Sweet Match! Kaushal awards you 10 forehead kisses & 1 infinite hug! ♡';
            playTap();
            award('game-slot', 1, 'Love slot spin completed! +1 heart ✨');
          }
        }
      }, 90);
    });
  }

  // ==========================================================
  // BRAND NEW GAME 4: MAGIC RANGOLI & PHULJHADI (जादुई रंगोली)
  // ==========================================================
  function startRangoliArt() {
    openModal(`
      <div class="card-eyebrow">GAME 04 · KALEIDOSCOPE ART</div>
      <h3>Magic Rangoli & Phuljhadi 🎨</h3>
      <p class="section-info">Draw with your finger to create 6-fold radial glowing Rangoli patterns, or switch to sizzling fireworks!</p>
      <div class="rangoli-draw-wrap">
        <canvas id="rangoliCanvas"></canvas>
      </div>
      <div class="rangoli-toolbar">
        <div style="display:flex;gap:6px;">
          <button class="palette-btn" style="background:#ffd166;" data-color="#ffd166"></button>
          <button class="palette-btn" style="background:#ff758f;" data-color="#ff758f"></button>
          <button class="palette-btn" style="background:#4cc9f0;" data-color="#4cc9f0"></button>
          <button class="palette-btn" style="background:#ffb703;" data-color="#ffb703"></button>
        </div>
        <button class="btn btn-xs btn-outline" id="clearRangoli">Clear Board</button>
      </div>
    `);

    const canvas = $('#rangoliCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let currentColor = '#ffd166';
    let isDrawing = false;
    let lastX = 0, lastY = 0;
    const cx = canvas.width / 2, cy = canvas.height / 2;

    $$('.palette-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentColor = btn.dataset.color;
        playTap();
      });
    });

    $('#clearRangoli').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      playTap();
    });

    function drawLine(x1, y1, x2, y2) {
      const angles = 6;
      const step = (Math.PI * 2) / angles;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.shadowColor = currentColor;
      ctx.shadowBlur = 8;

      for (let i = 0; i < angles; i++) {
        ctx.rotate(step);
        ctx.beginPath();
        ctx.moveTo(x1 - cx, y1 - cy);
        ctx.lineTo(x2 - cx, y2 - cy);
        ctx.stroke();

        // Mirrored line for floral symmetry
        ctx.beginPath();
        ctx.moveTo(-(x1 - cx), y1 - cy);
        ctx.lineTo(-(x2 - cx), y2 - cy);
        ctx.stroke();
      }
      ctx.restore();
    }

    function handlePointer(e) {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - r.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - r.top;

      if (isDrawing) {
        drawLine(lastX, lastY, x, y);
        if (!state.awards.includes('game-rangoli')) {
          award('game-rangoli', 3, 'Magic Rangoli pattern created! +3 hearts 🎨✨');
        }
      }
      lastX = x;
      lastY = y;
    }

    canvas.addEventListener('pointerdown', e => {
      isDrawing = true;
      const r = canvas.getBoundingClientRect();
      lastX = (e.clientX || (e.touches && e.touches[0].clientX)) - r.left;
      lastY = (e.clientY || (e.touches && e.touches[0].clientY)) - r.top;
    });
    canvas.addEventListener('pointermove', e => {
      if (isDrawing) handlePointer(e);
    });
    window.addEventListener('pointerup', () => { isDrawing = false; });
  }

  // ==========================================================
  // BRAND NEW GAME 5: CELESTIAL HEART CONSTELLATION (तारामंडल)
  // ==========================================================
  function startConstellation() {
    openModal(`
      <div class="card-eyebrow">GAME 05 · STAR PUZZLE</div>
      <h3>Celestial Heart Linker ✨</h3>
      <p class="section-info">Tap the numbered stars in sequence (1 → 2 → 3 → 4 → 5 → 1) to trace Kaushal & Sona's celestial heart!</p>
      <div class="constellation-wrap">
        <canvas id="constCanvas"></canvas>
      </div>
      <div style="text-align:center;font-size:12px;color:var(--gold);margin-top:8px;" id="constStatus">
        Tap Star #1 to begin tracing ✧
      </div>
    `);

    const canvas = $('#constCanvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const cx = canvas.width / 2, cy = canvas.height / 2;
    // 5 Heart Nodes
    const nodes = [
      { id: 1, x: cx, y: cy - 45 },
      { id: 2, x: cx + 55, y: cy - 75 },
      { id: 3, x: cx + 70, y: cy - 15 },
      { id: 4, x: cx, y: cy + 70 },
      { id: 5, x: cx - 70, y: cy - 15 },
      { id: 6, x: cx - 55, y: cy - 75 }
    ];

    let currentStep = 1;
    let connected = [];
    let frameId;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connected lines
      if (connected.length > 1) {
        ctx.strokeStyle = '#ff758f';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ff758f';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(connected[0].x, connected[0].y);
        for (let i = 1; i < connected.length; i++) {
          ctx.lineTo(connected[i].x, connected[i].y);
        }
        ctx.stroke();
      }

      // Draw nodes
      nodes.forEach(n => {
        const isDone = connected.some(c => c.id === n.id);
        const isNext = n.id === currentStep;

        ctx.fillStyle = isDone ? '#ff758f' : (isNext ? '#ffd166' : 'rgba(255,255,255,0.4)');
        ctx.shadowColor = isNext ? '#ffd166' : '#ff758f';
        ctx.shadowBlur = isNext ? 14 : 6;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isNext ? 9 : 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '10px DM Sans';
        ctx.textAlign = 'center';
        ctx.fillText(n.id, n.x, n.y - 12);
      });

      frameId = requestAnimationFrame(render);
    }
    render();

    canvas.addEventListener('pointerdown', e => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - r.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - r.top;

      nodes.forEach(n => {
        if (Math.hypot(n.x - x, n.y - y) < 22) {
          if (n.id === currentStep) {
            connected.push(n);
            playChime();
            triggerHaptic(40);
            currentStep++;

            if (currentStep > nodes.length) {
              connected.push(nodes[0]); // close the heart loop
              $('#constStatus').innerHTML = '<b>💖 Constellation linked! Kaushal & Sona written in the stars! 💖</b>';
              award('game-constellation', 3, 'Celestial Heart Constellation linked! +3 hearts ✨💖');
            } else {
              $('#constStatus').textContent = `Good! Now tap Star #${currentStep} ✧`;
            }
          }
        }
      });
    });

    activeGameCleanup = () => cancelAnimationFrame(frameId);
  }

  // Games Dispatcher
  function launchGame(id) {
    playTap();
    if (id === 'lantern-fly') return startSkyLanternFlight();
    if (id === 'stacker') return startDiyaStacker();
    if (id === 'slot') return startLoveSlotMachine();
    if (id === 'rangoli-art') return startRangoliArt();
    if (id === 'constellation') return startConstellation();
  }

  // ==========================================================
  // SURPRISES DISPATCHER
  // ==========================================================
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

  // Scratch Card
  function openScratch() {
    const message = C.scratchMessages[Math.floor(Math.random() * C.scratchMessages.length)];
    openModal(`
      <div class="card-eyebrow">A SECRET GOLDEN NOTE</div>
      <h3>Scratch & Reveal ✧</h3>
      <p class="section-info">Use your finger to scratch off the golden metallic layer below!</p>
      <div class="scratch-wrap">
        <div class="scratch-reveal">${message}</div>
        <canvas class="scratch-canvas" id="scratchCanvas"></canvas>
      </div>
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

    ctx.fillStyle = 'rgba(20, 8, 30, 0.4)';
    ctx.font = '700 12px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH WITH LOVE ✨', rect.width / 2, rect.height / 2);

    let drawing = false, checks = 0, awarded = false;
    const scratch = e => {
      const box = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - box.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - box.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
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

  // Mystery Gift Box
  function openGift() {
    const gift = C.giftMessages[Math.floor(Math.random() * C.giftMessages.length)];
    openModal(`
      <div class="card-eyebrow">A FESTIVE GIFT BOX</div>
      <h3>Mystery Gift Box 🎁</h3>
      <p class="section-info">Tap the gift box to untie the ribbon!</p>
      <div style="text-align:center;padding:14px 0;">
        <span class="gift-box-big" id="giftBox">🎁</span>
        <h4 id="giftTitle" style="margin:10px 0 4px;font-size:20px;">Still wrapped tight…</h4>
        <p id="giftBody" style="color:var(--text-muted);font-size:13px;margin-bottom:14px;">Tap button below to open!</p>
        <button class="btn btn-primary" id="openGiftBtn">Unwrap Gift ✧</button>
      </div>
    `);

    $('#openGiftBtn').addEventListener('click', () => {
      playDiyaSound();
      triggerHaptic(60);
      const box = $('#giftBox');
      box.classList.add('open');
      box.textContent = '💖';
      $('#giftTitle').textContent = gift.title;
      $('#giftBody').textContent = gift.body;
      $('#openGiftBtn').disabled = true;
      $('#openGiftBtn').textContent = 'Gift Opened ♡';
      award('surprise-gift', 2, 'Mystery gift box opened! +2 hearts 🎁');
    });
  }

  // Spin Wheel
  let wheelRot = 0;
  function openWheel() {
    openModal(`
      <div class="card-eyebrow">ROMANTIC WHEEL</div>
      <h3>Spin The Love Wheel 🎡</h3>
      <p class="section-info">Whatever prize it lands on, you get to redeem it from Kaushal without argument!</p>
      <div class="wheel-wrap">
        <div class="wheel-pointer">▼</div>
        <div class="love-wheel" id="loveWheel"></div>
      </div>
      <div class="wheel-result" id="wheelResult">Ready when you are, Buchua.</div>
      <div style="display:flex;justify-content:center;margin-top:12px;">
        <button class="btn btn-primary" id="spinWheelBtn">Spin Wheel ↻</button>
      </div>
    `);

    $('#spinWheelBtn').addEventListener('click', () => {
      const idx = Math.floor(Math.random() * C.wheelPrizes.length);
      const seg = 360 / C.wheelPrizes.length;
      wheelRot += 360 * 5 + (360 - idx * seg - seg / 2);
      $('#loveWheel').style.transform = `rotate(${wheelRot}deg)`;
      $('#spinWheelBtn').disabled = true;
      $('#wheelResult').textContent = 'Spinning magic…';
      playTap();

      setTimeout(() => {
        $('#wheelResult').textContent = `Your treat: ${C.wheelPrizes[idx]} ♡`;
        $('#spinWheelBtn').disabled = false;
        $('#spinWheelBtn').textContent = 'Spin Again ↻';
        playChime();
        award('surprise-wheel', 2, 'Love wheel spun! +2 hearts ✨');
      }, 4100);
    });
  }

  // Redeemable Coupons
  function openCoupons() {
    openModal(`
      <div class="card-eyebrow">ROMANTIC PASSES</div>
      <h3>Redeemable Love Coupons 🎟️</h3>
      <p class="section-info">Tap 'Redeem' to stamp a coupon! Kaushal will honour it with all his heart.</p>
      <div class="coupons-modal-grid">
        ${C.coupons.map(coupon => {
          const isRedeemed = state.redeemedCoupons.includes(coupon.id);
          return `
            <div class="coupon-item ${isRedeemed ? 'redeemed' : ''}" data-coupon-id="${coupon.id}">
              <div class="coupon-top">
                <span style="font-size:22px;">${coupon.icon}</span>
                <span class="coupon-tag">${coupon.tag}</span>
              </div>
              <h4 class="coupon-title">${coupon.title}</h4>
              <p class="coupon-desc">${coupon.desc}</p>
              <button class="btn btn-xs btn-primary coupon-redeem-btn" ${isRedeemed ? 'disabled' : ''}>
                ${isRedeemed ? 'Redeemed ♡' : 'Redeem Coupon 🎟️'}
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

        playTap();
        triggerHaptic(70);
        state.redeemedCoupons.push(cid);
        item.classList.add('redeemed');
        btn.disabled = true;
        btn.textContent = 'Redeemed ♡';
        award(`coupon-${cid}`, 1, 'Coupon redeemed! Kaushal will honour this with love ♡');
      });
    });
  }

  // Secret Room
  function openPassword() {
    openModal(`
      <div class="card-eyebrow">A SECRET ROOM</div>
      <h3>The Secret Room 🔐</h3>
      <p class="section-info">A special nickname between us is the key. Hint: It starts with B and ends with A (Buchua)...</p>
      <form class="secret-form" id="secretForm">
        <input id="secretInput" type="text" autocomplete="off" placeholder="Enter secret word..." class="form-input" />
        <button class="btn btn-primary" type="submit">Unlock</button>
      </form>
      <div id="secretResult" style="margin-top:14px;color:var(--pink-soft);font-family:var(--font-serif);font-style:italic;font-size:14.5px;"></div>
    `);

    $('#secretForm').addEventListener('submit', e => {
      e.preventDefault();
      const val = $('#secretInput').value.trim().toUpperCase();
      const valid = val === String(C.secretPassword).toUpperCase() || val === 'SONA';

      if (valid) {
        playChime();
        triggerHaptic(80);
        $('#secretResult').innerHTML = `
          <b>Secret Room Unlocked! 💖</b><br />
          No matter how many stars shine in the universe, my eyes will always search for you. 
          You are my safe harbour, my favourite laugh, and my greatest blessing. Happy Diwali, Buchua. ♡
        `;
        award('surprise-password', 2, 'Secret room unlocked! +2 hearts 🔐💖');
      } else {
        $('#secretResult').textContent = 'Not quite, my love! Hint: The sweet name I call you (Buchua) ♡';
      }
    });
  }

  // Digital Hug
  function showHug() {
    playChime();
    triggerHaptic(100);
    const overlay = $('#hugOverlay');
    $('#hugNickname').textContent = C.nickname || 'Buchua';
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    const holder = $('#hugBurst');
    holder.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('span');
      heart.className = 'hug-heart-fly';
      heart.textContent = ['💖', '♥', '🌸', '🫂', '🤍'][i % 5];
      heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}vw`);
      heart.style.animationDelay = `${Math.random() * 0.8}s`;
      holder.appendChild(heart);
    }
    award('surprise-hug', 1, 'A tight, warm digital hug sent! +1 heart 🫂💖');
  }

  // Voice Note & Melody
  function openAudio() {
    openModal(`
      <div class="card-eyebrow">ROMANTIC SOUNDS</div>
      <h3>Voice Note & Melody 🎙️</h3>
      <p class="section-info">Press play to listen to sweet music & Kaushal's melody for you.</p>
      <div class="letter-paper" style="text-align:center;padding:16px;">
        <span style="font-size:38px;color:var(--pink);">🎵</span><br />
        A sweet romantic melody is ready for you.<br />
        <small style="color:var(--text-muted);font-size:11px;">(You can also replace assets/audio/sona-voice-message.mp3 with your personal voice recording anytime!)</small>
      </div>
      <audio id="voicePlayer" controls style="width:100%;margin-top:14px;" src="assets/audio/sona-voice-message.mp3" preload="auto"></audio>
    `);

    $('#voicePlayer').addEventListener('play', () => {
      award('surprise-audio', 1, 'Sweet melody / voice note played! +1 heart 🎙️💖');
    });
  }

  // ==========================================================
  // SCRAPBOOK POLAROID & LIGHTBOX
  // ==========================================================
  function renderPhotos() {
    const grid = $('#photoGrid');
    grid.innerHTML = C.photos.map((photo, i) => {
      const customImg = state.customPhotos[photo.file];
      const initialSrc = customImg || `assets/photos/${photo.file}`;
      const fallbackSrc = `assets/photos/${photo.svgFallback}`;

      return `
        <article class="polaroid-card-item" data-photo-index="${i}">
          <div class="polaroid-clip-badge"></div>
          <div class="polaroid-photo-thumb">
            <img src="${initialSrc}" 
                 alt="${photo.title}" 
                 loading="lazy" 
                 onerror="if(this.src.indexOf('.svg') === -1) { this.src='${fallbackSrc}'; }" />
          </div>
          <div class="polaroid-card-caption">
            <span class="polaroid-caption-title">${photo.title}</span>
            <span class="polaroid-caption-sub">${photo.caption}</span>
          </div>
        </article>
      `;
    }).join('');

    $$('.polaroid-card-item', grid).forEach(card => {
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

    award('custom-photo-added', 2, 'New memories previewed on your polaroid wall! 📸💖');
    showToast(`${files.length} photo(s) previewed on your polaroid wall! ✨`);
    e.target.value = '';
  });

  $('#resetPhotosBtn').addEventListener('click', () => {
    state.customPhotos = {};
    save();
    renderPhotos();
    showToast('Reset to default aesthetic illustrations! 🌸');
  });

  // ==========================================================
  // LETTERS & GALAXY & FINALE
  // ==========================================================
  function renderLetters() {
    $('#letterGrid').innerHTML = C.letters.map(letter => `
      <div class="letter-mobile-card" data-letter="${letter.id}">
        <span class="letter-card-icon">${letter.icon}</span>
        <div class="letter-card-body">
          <h4>${letter.title}</h4>
          <p>${letter.teaser}</p>
        </div>
        <span class="letter-badge-status">${state.openedLetters.includes(letter.id) ? 'OPEN ♡' : 'READ →'}</span>
      </div>
    `).join('');
  }

  function openLetter(id) {
    const letter = C.letters.find(item => item.id === id);
    if (!letter) return;
    playTap();

    openModal(`
      <div class="card-eyebrow">A LETTER FOR THIS MOMENT · ${letter.icon}</div>
      <h3 style="margin:6px 0 14px;">${letter.title}</h3>
      <div class="letter-paper">${letter.body}</div>
      <div style="display:flex;justify-content:center;margin-top:16px;">
        <button class="btn btn-primary" id="letterDone">Keep Close To Heart 💗</button>
      </div>
    `);

    if (!state.openedLetters.includes(id)) {
      state.openedLetters.push(id);
      award(`letter-${id}`, 1, `Letter opened: "${letter.title}" +1 heart 💌`);
      renderLetters();
    }
    $('#letterDone').addEventListener('click', closeModal);
  }

  function renderGalaxy() {
    const sky = $('#galaxySky');
    const positions = [
      [16, 22], [32, 65], [44, 18], [58, 75], [74, 25], [84, 55],
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

  // Secret Finale
  function openFinale() {
    if (state.hearts < FINAL_TARGET) {
      showToast(`The grand finale is waiting for ${FINAL_TARGET} hearts! You have ${state.hearts}. ♡`);
      return;
    }

    const message = C.finalLetter.replaceAll('{{from}}', C.from);
    openModal(`
      <div class="card-eyebrow" style="text-align:center;">THE FINAL PAGE OF OUR LITTLE UNIVERSE</div>
      <h3 style="text-align:center;margin:6px 0 14px;">${C.finalLetterTitle} ✨</h3>
      <p class="section-info" style="text-align:center;">A letter from ${C.from}, written with all the love in the universe.</p>
      <div class="letter-paper">${message}</div>
      <div style="display:flex;justify-content:center;margin-top:16px;">
        <button class="btn btn-primary" id="fireworksButton">
          <span>Make The Sky Sparkle 🎆</span>
        </button>
      </div>
    `);

    $('#fireworksButton').addEventListener('click', startFireworks);
  }

  function startFireworks() {
    playChime();
    triggerHaptic(150);
    const layer = document.createElement('div');
    layer.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden;';
    document.body.appendChild(layer);

    for (let i = 0; i < 70; i++) {
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

  // Ambient Star Dust Particles
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

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.8 + Math.random() * 2,
        vy: -0.15 - Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.15,
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
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // Bottom Navigation Active State Handler
  function initBottomNav() {
    const tabs = $$('.dock-tab');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const sections = ['home', 'ceremony', 'games', 'memories', 'surprises'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 120;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
            break;
          }
        }
      }
    });

    tabs.forEach(t => {
      t.addEventListener('click', () => {
        playTap();
        triggerHaptic(25);
      });
    });
  }

  // Event Listeners
  function setupEventListeners() {
    const enterUniverse = () => {
      playTap();
      playDiyaSound();
      triggerHaptic(60);
      $('#welcomeScreen').classList.add('leaving');
      $('#siteShell').classList.add('visible');
      $('#siteShell').setAttribute('aria-hidden', 'false');
      setTimeout(() => { $('#welcomeScreen').style.display = 'none'; }, 800);
      showToast(`Welcome to your universe, ${C.nickname || 'Sona'}! 💖✨`);
      playMusic();
    };

    $('#enterButton').addEventListener('click', enterUniverse);
    $('#welcomeDiyaAction').addEventListener('click', enterUniverse);

    $('#musicToggle').addEventListener('click', toggleMusic);
    $('#soundToggle').addEventListener('click', () => {
      window.sonaSoundEnabled = !window.sonaSoundEnabled;
      $('#soundIcon').textContent = window.sonaSoundEnabled ? '🔔' : '🔕';
      $('#soundToggle').classList.toggle('muted', !window.sonaSoundEnabled);
      showToast(window.sonaSoundEnabled ? 'Sound effects on! 🔔' : 'Sound effects muted. 🔕');
    });

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

    $('#heroCenterDiya').addEventListener('click', () => {
      playDiyaSound();
      triggerHaptic(50);
      showToast('The golden flame of our love burns steady and warm! 🪔✨');
    });

    // Delegated Clicks
    document.addEventListener('click', e => {
      const gameBtn = e.target.closest('[data-open-game]');
      const surpriseBtn = e.target.closest('[data-surprise]');
      const letterBtn = e.target.closest('[data-letter]');

      if (gameBtn) launchGame(gameBtn.dataset.openGame);
      if (surpriseBtn) launchSurprise(surpriseBtn.dataset.surprise);
      if (letterBtn) openLetter(letterBtn.dataset.letter);
    });
  }

  // App Init
  function init() {
    $('#welcomeName').textContent = `My ${C.name}`;
    $('#heroName').textContent = C.name;
    $('#fromName').textContent = C.from;
    $('#footerFrom').textContent = C.from.toUpperCase();
    document.title = `${C.name}'s Diwali Universe 💗✨`;

    setTrack(0);
    initLoveTimer();
    renderDiyaCeremony();
    renderPhotos();
    renderLetters();
    renderGalaxy();
    initAmbientCanvas();
    initBottomNav();
    updateProgress();
    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

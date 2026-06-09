document.addEventListener('DOMContentLoaded', function() {
  console.log("HostMakedonija App: Initialized.");

  // ============================================
  // 1. WEB AUDIO SOUND EFFECTS SYNTHESIZER
  // ============================================
  const soundToggle = document.getElementById('sound-toggle');
  let audioCtx = null;
  let soundEnabled = false;

  const soundOnSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="volume-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
  const soundOffSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="volume-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundToggle.innerHTML = soundOnSVG;
        playSound('click');
      } else {
        soundToggle.innerHTML = soundOffSVG;
      }
    });
  }

  function playSound(type) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'countdown') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'start') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'cross') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1200, now + 0.06);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.warn("AudioContext failed to play sound: ", e);
    }
  }


  // ============================================
  // 2. DARK MODE THEME TOGGLER
  // ============================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const moonIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  function getSavedTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = sunIconSVG;
    } else {
      themeToggleBtn.innerHTML = moonIconSVG;
    }
  }

  if (themeToggleBtn) {
    applyTheme(getSavedTheme());
    themeToggleBtn.addEventListener('click', () => {
      playSound('click');
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }


  // ============================================
  // 3. DYNAMIC CARD SORTING
  // ============================================
  const cardsContainer = document.getElementById('hosting-cards-list');
  const sortButtons = document.querySelectorAll('.sort-btn');

  if (cardsContainer) {
    const originalCards = Array.from(cardsContainer.querySelectorAll('.hosting-card'));

    sortButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        playSound('click');
        sortButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const metric = this.getAttribute('data-sort');
        const sorted = [...originalCards];

        if (metric === 'rank') {
          sorted.sort((a, b) => parseInt(a.getAttribute('data-rank')) - parseInt(b.getAttribute('data-rank')));
        } else if (metric === 'price') {
          sorted.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
        } else if (metric === 'speed') {
          sorted.sort((a, b) => parseInt(a.getAttribute('data-speed')) - parseInt(b.getAttribute('data-speed')));
        } else if (metric === 'rating') {
          sorted.sort((a, b) => parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating')));
        }

        cardsContainer.innerHTML = '';
        sorted.forEach(card => {
          cardsContainer.appendChild(card);
        });
      });
    });
  }


  // ============================================
  // 4. INTERACTIVE CHART SYNC
  // ============================================
  const chartRows = document.querySelectorAll('.chart-row');
  const cards = document.querySelectorAll('.hosting-card');

  chartRows.forEach(row => {
    const targetId = row.getAttribute('data-target');
    const targetCard = document.getElementById(targetId);

    row.addEventListener('mouseenter', () => {
      if (targetCard) targetCard.classList.add('featured');
    });
    row.addEventListener('mouseleave', () => {
      if (targetCard && targetId !== 'hostinger') {
        targetCard.classList.remove('featured');
      }
    });

    row.addEventListener('click', () => {
      playSound('click');
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '3px solid var(--accent-indigo)';
        targetCard.style.outlineOffset = '6px';
        setTimeout(() => {
          targetCard.style.outline = 'none';
        }, 1500);
      }
    });
  });

  cards.forEach(card => {
    const cardId = card.id;
    const correspondingRow = document.querySelector(`.chart-row[data-target="${cardId}"]`);

    if (correspondingRow) {
      card.addEventListener('mouseenter', () => {
        correspondingRow.classList.add('active');
      });
      card.addEventListener('mouseleave', () => {
        correspondingRow.classList.remove('active');
      });
    }
  });


  // ============================================
  // 5. FAQ ACCORDION
  // ============================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', function() {
      playSound('click');
      const parent = this.parentElement;
      const isActive = parent.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });


  // ============================================
  // 6. GOOGLE ADS & AFFILIATE CLICK TRACKER
  // ============================================
  const trackerVars = {
    ajax_url: "https://hostmakedonija.com/wp-admin/admin-ajax.php"
  };

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
    return null;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get('gclid');
  const gbraid = urlParams.get('gbraid');
  const wbraid = urlParams.get('wbraid');
  const utmSource = urlParams.get('utm_source');

  let isGads = gclid || gbraid || wbraid;
  if (!isGads && utmSource && utmSource.toLowerCase() === 'google') {
    isGads = 'true';
  }

  if (isGads) {
    const cookieValue = gclid ? gclid : (gbraid ? gbraid : (wbraid ? wbraid : 'true'));
    console.log("Google Ads Lead Detected. Setting cookie: " + cookieValue);

    const date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    const secureStr = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = "gads_lead=" + encodeURIComponent(cookieValue) + "; expires=" + date.toUTCString() + "; path=/; SameSite=Lax" + secureStr;

    const landingData = new FormData();
    landingData.append('action', 'hostingmk_log_gads_landing_ajax');
    landingData.append('gclid', cookieValue);
    landingData.append('url', window.location.pathname + window.location.search);
    landingData.append('referrer', document.referrer || '');

    if (navigator.sendBeacon) {
      navigator.sendBeacon(trackerVars.ajax_url, landingData);
    } else {
      fetch(trackerVars.ajax_url, {
        method: 'POST',
        body: landingData,
        keepalive: true
      });
    }
  }

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-hosting');
    if (!btn) return;

    playSound('click');

    const gadsLead = getCookie('gads_lead');
    console.log("CTA Button Clicked. Cookie presence check: " + (gadsLead ? "Found" : "Not Found"));

    if (!gadsLead) return;

    const href = btn.getAttribute('href');
    const id = btn.getAttribute('id') || '';

    let hostingName = 'Unknown';
    if (id.startsWith('cta-')) {
      const rawName = id.replace('cta-', '');
      if (rawName === 'hostinger') hostingName = 'Hostinger';
      else if (rawName === 'siteground') hostingName = 'SiteGround';
      else if (rawName === 'bluehost') hostingName = 'Bluehost';
      else if (rawName === 'namecheap') hostingName = 'Namecheap';
      else if (rawName === 'dreamhost') hostingName = 'DreamHost';
      else if (rawName === 'a2hosting') hostingName = 'A2 Hosting';
      else if (rawName === 'greengeeks') hostingName = 'GreenGeeks';
      else if (rawName === 'hostgator') hostingName = 'HostGator';
      else hostingName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    } else {
      let text = btn.textContent || btn.innerText || '';
      text = text.replace('Get', '').replace('→', '').trim();
      if (text) hostingName = text;
    }

    console.log("Tracking outclick for: " + hostingName);
    const data = new FormData();
    data.append('action', 'hostingmk_log_affiliate_click');
    data.append('hosting_name', hostingName);
    data.append('outbound_url', href || '');
    data.append('gads_lead', gadsLead);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(trackerVars.ajax_url, data);
    } else {
      fetch(trackerVars.ajax_url, {
        method: 'POST',
        body: data,
        keepalive: true
      });
    }
  }, true);


  // ============================================
  // 7. SPACE RACER BENCHMARK MINIGAME
  // ============================================
  const racerCanvas = document.getElementById('racer-canvas');
  const startRaceBtn = document.getElementById('start-race-btn');
  const scoreboard = document.getElementById('scoreboard');
  const minigameSection = document.querySelector('.minigame-section');

  if (racerCanvas && startRaceBtn && scoreboard) {
    const ctx = racerCanvas.getContext('2d');
    let animationFrameId = null;
    let minigameActive = true;
    let gameState = 'idle'; // 'idle', 'countdown', 'racing', 'finished'
    let countdownVal = 3;
    let countdownTimer = 0;
    let gridOffset = 0;
    let finishedShips = [];
    let particles = [];

    const hosts = [
      { id: 'a2hosting', name: 'A2 Hosting', ping: 90, color: '#00e676', progress: 0, finished: false, finishTime: 0 },
      { id: 'siteground', name: 'SiteGround', ping: 120, color: '#b9f6ca', progress: 0, finished: false, finishTime: 0 },
      { id: 'hostinger', name: 'Hostinger', ping: 140, color: '#7c4dff', progress: 0, finished: false, finishTime: 0 },
      { id: 'greengeeks', name: 'GreenGeeks', ping: 165, color: '#00c853', progress: 0, finished: false, finishTime: 0 },
      { id: 'bluehost', name: 'Bluehost', ping: 180, color: '#2979ff', progress: 0, finished: false, finishTime: 0 },
      { id: 'dreamhost', name: 'DreamHost', ping: 195, color: '#00e5ff', progress: 0, finished: false, finishTime: 0 },
      { id: 'namecheap', name: 'Namecheap', ping: 210, color: '#ff3d00', progress: 0, finished: false, finishTime: 0 },
      { id: 'hostgator', name: 'HostGator', ping: 220, color: '#ffd600', progress: 0, finished: false, finishTime: 0 }
    ];

    function resizeCanvas() {
      racerCanvas.width = racerCanvas.parentElement.clientWidth;
      racerCanvas.height = 240;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function startRace() {
      startRaceBtn.disabled = true;
      finishedShips = [];
      particles = [];
      hosts.forEach(h => {
        h.progress = 0;
        h.finished = false;
        h.finishTime = 0;
      });
      gameState = 'countdown';
      countdownVal = 3;
      countdownTimer = Date.now();
      scoreboard.innerHTML = `STATUS: SYSTEM CALIBRATING... GET READY!`;
      playSound('countdown');
      
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      lastTime = Date.now();
      gameLoop();
    }

    startRaceBtn.addEventListener('click', startRace);

    let lastTime = Date.now();

    function gameLoop() {
      if (!minigameActive) return;
      
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      update(dt);
      draw();

      if (gameState !== 'idle') {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    }

    function update(dt) {
      if (gameState === 'countdown') {
        const elapsed = Date.now() - countdownTimer;
        if (elapsed > 1000) {
          countdownVal--;
          countdownTimer = Date.now();
          if (countdownVal > 0) {
            playSound('countdown');
          } else {
            gameState = 'racing';
            playSound('start');
            scoreboard.innerHTML = `STATUS: SPEED SIMULATION ACTIVE. RACING IN PROGRESS...`;
          }
        }
      } else if (gameState === 'racing') {
        gridOffset = (gridOffset + dt * 1.5) % 1.0;

        let allFinished = true;
        hosts.forEach(ship => {
          if (!ship.finished) {
            allFinished = false;
            // Base speed is deterministic based on ping
            const baseSpeed = (250 - ship.ping) / 450;
            const jitter = (Math.random() - 0.5) * 0.05;
            const currentSpeed = Math.max(0.05, baseSpeed + jitter);
            
            ship.progress += currentSpeed * dt;
            
            if (ship.progress >= 1.0) {
              ship.progress = 1.0;
              ship.finished = true;
              ship.finishTime = Date.now();
              finishedShips.push(ship);
              playSound('cross');
              
              const width = racerCanvas.width;
              const height = racerCanvas.height;
              const horizonY = height * 0.25;
              const startY = height * 0.82;
              const shipY = startY + 1.0 * (horizonY - startY);
              const laneT = (hosts.indexOf(ship) + 0.5) / 8;
              const startX = laneT * width;
              const horizonX = width * 0.45 + laneT * (width * 0.1);
              const shipX = startX + 1.0 * (horizonX - startX);
              
              for (let p = 0; p < 20; p++) {
                particles.push({
                  x: shipX,
                  y: shipY,
                  vx: (Math.random() - 0.5) * 120,
                  vy: (Math.random() - 0.5) * 120,
                  color: ship.color,
                  alpha: 1.0,
                  life: 0.8
                });
              }
            }
          }
        });

        if (finishedShips.length > 0) {
          scoreboard.innerHTML = `LEADERBOARD:<br>` + finishedShips.map((s, idx) => {
            const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `${idx + 1}.`));
            return `<span style="color:${s.color}; font-weight:bold;">${medal} ${s.name} (${s.ping}ms)</span>`;
          }).join(' | ');
        }

        if (allFinished) {
          gameState = 'finished';
          playSound('win');
          startRaceBtn.disabled = false;
          startRaceBtn.innerText = '⚡ Re-run Speed Test';
          
          const winnerId = finishedShips[0].id;
          const winnerCard = document.getElementById(winnerId);
          if (winnerCard) {
            winnerCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            winnerCard.style.outline = '4px solid #facc15';
            winnerCard.style.outlineOffset = '8px';
            setTimeout(() => {
              winnerCard.style.outline = 'none';
            }, 3000);
          }
        }
      }

      particles.forEach((p, idx) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        p.alpha = Math.max(0, p.life / 0.8);
        if (p.life <= 0) {
          particles.splice(idx, 1);
        }
      });
    }

    function draw() {
      const width = racerCanvas.width;
      const height = racerCanvas.height;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, width, height);

      const horizonY = height * 0.25;
      const startY = height * 0.82;

      const glow = ctx.createLinearGradient(0, horizonY - 30, 0, horizonY + 10);
      glow.addColorStop(0, 'rgba(79, 70, 229, 0.0)');
      glow.addColorStop(0.8, 'rgba(79, 70, 229, 0.3)');
      glow.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, horizonY - 30, width, 40);

      ctx.strokeStyle = 'rgba(79, 70, 229, 0.25)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= 8; i++) {
        const laneT = i / 8;
        const startX = laneT * width;
        const horizonX = width * 0.45 + laneT * (width * 0.1);
        
        ctx.beginPath();
        ctx.moveTo(startX, height);
        ctx.lineTo(horizonX, horizonY);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
      const linesCount = 8;
      for (let i = 0; i < linesCount; i++) {
        const lineT = ((i + gridOffset) / linesCount) % 1.0;
        const lineY = horizonY + Math.pow(lineT, 2) * (height - horizonY);
        
        const startLeftX = 0;
        const startRightX = width;
        const horLeftX = width * 0.45;
        const horRightX = width * 0.55;
        
        const currentLeftX = startLeftX + Math.pow(lineT, 2) * (horLeftX - startLeftX);
        const currentRightX = startRightX + Math.pow(lineT, 2) * (horRightX - startRightX);

        ctx.beginPath();
        ctx.moveTo(currentLeftX, lineY);
        ctx.lineTo(currentRightX, lineY);
        ctx.stroke();
      }

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(width * 0.45, horizonY);
      ctx.lineTo(width * 0.55, horizonY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      hosts.forEach((ship, idx) => {
        const laneT = (idx + 0.5) / 8;
        const startX = laneT * width;
        const horizonX = width * 0.45 + laneT * (width * 0.1);
        
        const shipX = startX + ship.progress * (horizonX - startX);
        const shipY = startY + ship.progress * (horizonY - startY);
        const scale = Math.max(0.25, 1.0 - ship.progress * 0.7);

        ctx.save();
        ctx.translate(shipX, shipY);
        ctx.scale(scale, scale);

        if (gameState === 'racing' && !ship.finished) {
          const flameHeight = 12 + Math.random() * 10;
          const flameGrad = ctx.createLinearGradient(0, 0, 0, flameHeight);
          flameGrad.addColorStop(0, '#facc15');
          flameGrad.addColorStop(0.4, '#f97316');
          flameGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(-5, 4);
          ctx.lineTo(5, 4);
          ctx.lineTo(0, 4 + flameHeight);
          ctx.closePath();
          ctx.fill();
        }

        ctx.fillStyle = ship.color;
        ctx.shadowColor = ship.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(-7, 4);
        ctx.lineTo(0, 0);
        ctx.lineTo(7, 4);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        const label = ship.id === 'a2hosting' ? 'A2' :
                      ship.id === 'siteground' ? 'SG' :
                      ship.id === 'hostinger' ? 'HR' :
                      ship.id === 'greengeeks' ? 'GG' :
                      ship.id === 'bluehost' ? 'BH' :
                      ship.id === 'dreamhost' ? 'DH' :
                      ship.id === 'namecheap' ? 'NC' : 'HG';
        ctx.fillText(label, 0, -16);
        ctx.restore();
      });

      particles.forEach(p => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (gameState === 'idle') {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ RETRO SPEED BENCHMARKLER ACTIVE. READY PLAYER ONE.', width / 2, height / 2);
      } else if (gameState === 'countdown') {
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 15;
        ctx.fillText(countdownVal.toString(), width / 2, height / 2 + 10);
        ctx.shadowBlur = 0;
      }
    }

    if (minigameSection) {
      minigameSection.addEventListener('contentvisibilityautostatechange', (e) => {
        if (e.skipped) {
          minigameActive = false;
        } else {
          minigameActive = true;
          if (gameState === 'racing' || gameState === 'countdown') {
            lastTime = Date.now();
            gameLoop();
          }
        }
      });

      if (!('contentVisibility' in document.documentElement.style)) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              minigameActive = true;
              if (gameState === 'racing' || gameState === 'countdown') {
                lastTime = Date.now();
                gameLoop();
              }
            } else {
              minigameActive = false;
            }
          });
        }, { rootMargin: '200px' });
        observer.observe(minigameSection);
      }
    }

    draw();
  }


  // ============================================
  // 8. THREE.JS 3D HERO ARENA
  // ============================================
  const heroCanvas = document.getElementById('three-hero-canvas');
  const heroContainer = document.querySelector('.hero-canvas-container');

  if (heroCanvas && heroContainer && typeof THREE !== 'undefined') {
    let threeActive = true;
    let scene, camera, renderer;
    let shieldRing1, shieldRing2, coreMesh, starfield;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 1000);
      camera.position.z = 10;

      renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true });
      renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const torusGeom1 = new THREE.TorusGeometry(3.2, 0.03, 8, 64);
      const torusMat1 = new THREE.MeshBasicMaterial({ color: 0x4f46e5, wireframe: true, transparent: true, opacity: 0.8 });
      shieldRing1 = new THREE.Mesh(torusGeom1, torusMat1);
      scene.add(shieldRing1);

      const torusGeom2 = new THREE.TorusGeometry(3.2, 0.03, 8, 64);
      const torusMat2 = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.8 });
      shieldRing2 = new THREE.Mesh(torusGeom2, torusMat2);
      shieldRing2.rotation.x = Math.PI / 2;
      scene.add(shieldRing2);

      const coreGeom = new THREE.IcosahedronGeometry(1.6, 1);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.95 });
      coreMesh = new THREE.Mesh(coreGeom, coreMat);
      scene.add(coreMesh);

      const starsCount = 800;
      const starsGeom = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starsCount * 3);
      for (let i = 0; i < starsCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 45;
        starPositions[i+1] = (Math.random() - 0.5) * 45;
        starPositions[i+2] = (Math.random() - 0.5) * 45;
      }
      starsGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starsMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.65
      });
      starfield = new THREE.Points(starsGeom, starsMat);
      scene.add(starfield);

      let mouseX = 0, mouseY = 0;
      let targetX = 0, targetY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
      });

      window.addEventListener('resize', () => {
        if (!heroContainer) return;
        camera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
      });

      function animateThree() {
        if (!threeActive) return;
        requestAnimationFrame(animateThree);

        shieldRing1.rotation.y += 0.004;
        shieldRing1.rotation.x += 0.001;

        shieldRing2.rotation.y -= 0.002;
        shieldRing2.rotation.x += 0.004;

        coreMesh.rotation.y += 0.008;
        coreMesh.rotation.z += 0.0015;

        starfield.rotation.y += 0.0003;

        targetX += (mouseX * 4 - targetX) * 0.05;
        targetY += (mouseY * 4 - targetY) * 0.05;

        camera.position.x = targetX;
        camera.position.y = -targetY;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }

      function startThree() {
        if (!threeActive) {
          threeActive = true;
          animateThree();
        }
      }

      function stopThree() {
        threeActive = false;
      }

      heroContainer.addEventListener('contentvisibilityautostatechange', (e) => {
        if (e.skipped) {
          stopThree();
        } else {
          startThree();
        }
      });

      if (!('contentVisibility' in document.documentElement.style)) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startThree();
            } else {
              stopThree();
            }
          });
        }, { rootMargin: '200px' });
        observer.observe(heroContainer);
      }

      animateThree();

    } catch (e) {
      console.warn("WebGL Initialization failed, falling back to static CSS background:", e);
    }
  }
});

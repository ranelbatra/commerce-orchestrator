/* ── OmniCommerce — main.js ───────────────────────────────────── */

// ── View helpers ─────────────────────────────────────────────────

function showView(id) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  requestAnimationFrame(() => el.classList.add('active'));
}

// ── Input View ───────────────────────────────────────────────────

const urlInput   = document.getElementById('url-input');
const inputCard  = document.getElementById('input-card');
const generateBtn = document.getElementById('generate-btn');
const inputError  = document.getElementById('input-error');

urlInput.addEventListener('focus', () => inputCard.classList.add('focused'));
urlInput.addEventListener('blur',  () => inputCard.classList.remove('focused'));

urlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleGenerate();
});

generateBtn.addEventListener('click', handleGenerate);

function handleGenerate() {
  const val = urlInput.value.trim();
  if (!val) {
    inputError.style.display = 'block';
    inputCard.style.borderColor = '#f87171';
    setTimeout(() => {
      inputError.style.display = 'none';
      inputCard.style.borderColor = '';
    }, 2000);
    return;
  }

  // Store product name from URL
  try {
    const parts = new URL(val).pathname.split('/').filter(Boolean);
    const slug = parts[parts.length - 1] || 'Product';
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    document.getElementById('product-name').textContent = name;
  } catch {
    document.getElementById('product-name').textContent = 'Product';
  }

  showView('view-processing');
  startProcessing();
}

// ── Processing View ──────────────────────────────────────────────

const STEP_DURATIONS = [1200, 1500, 1300, 1000];

function startProcessing() {
  const steps = Array.from(document.querySelectorAll('.step'));
  steps.forEach(s => { s.classList.remove('active', 'done'); });

  startOrbital();

  let i = 0;
  function runStep() {
    if (i >= steps.length) {
      stopOrbital();
      setTimeout(() => {
        showView('view-results');
        initResults();
      }, 300);
      return;
    }
    steps[i].classList.add('active');
    steps[i].style.opacity = '1';
    setTimeout(() => {
      steps[i].classList.remove('active');
      steps[i].classList.add('done');
      i++;
      runStep();
    }, STEP_DURATIONS[i]);
  }
  runStep();
}

// ── Orbital Canvas ───────────────────────────────────────────────

let orbitalRAF = null;
let orbAngle = 0;

function startOrbital() {
  const canvas = document.getElementById('orbital-canvas');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R1 = 82, R2 = 52;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Glow background
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
    grd.addColorStop(0, 'rgba(124,58,237,0.18)');
    grd.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, R1, 0, Math.PI * 2);
    ctx.strokeStyle = '#1e2640';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner ring (dashed)
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, R2, 0, Math.PI * 2);
    ctx.strokeStyle = '#161929';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Orbiting dot 1
    const a1 = (orbAngle * Math.PI) / 180;
    const x1 = cx + R1 * Math.cos(a1);
    const y1 = cy + R1 * Math.sin(a1);

    // Dot glow
    const dg = ctx.createRadialGradient(x1, y1, 0, x1, y1, 14);
    dg.addColorStop(0, 'rgba(124,58,237,0.4)');
    dg.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.beginPath();
    ctx.arc(x1, y1, 14, 0, Math.PI * 2);
    ctx.fillStyle = dg;
    ctx.fill();

    // Dot fill (violet→cyan gradient)
    const dotGrd = ctx.createLinearGradient(x1 - 7, y1 - 7, x1 + 7, y1 + 7);
    dotGrd.addColorStop(0, '#7c3aed');
    dotGrd.addColorStop(1, '#06b6d4');
    ctx.beginPath();
    ctx.arc(x1, y1, 7, 0, Math.PI * 2);
    ctx.fillStyle = dotGrd;
    ctx.fill();

    // Orbiting dot 2
    const a2 = ((orbAngle + 180) * Math.PI) / 180;
    const x2 = cx + R2 * Math.cos(a2);
    const y2 = cy + R2 * Math.sin(a2);
    ctx.beginPath();
    ctx.arc(x2, y2, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6,182,212,0.75)';
    ctx.fill();

    orbAngle = (orbAngle + 1.4) % 360;
    orbitalRAF = requestAnimationFrame(draw);
  }

  orbitalRAF = requestAnimationFrame(draw);
}

function stopOrbital() {
  if (orbitalRAF) { cancelAnimationFrame(orbitalRAF); orbitalRAF = null; }
}

// ── Results: init ────────────────────────────────────────────────

function initResults() {
  buildWaveform();
}

// ── Copy buttons ─────────────────────────────────────────────────

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).catch(() => {});
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Copied';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
  });
});

// ── Platform tabs ────────────────────────────────────────────────

document.querySelectorAll('.platform-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const parts = tab.dataset.platform.split(' · ');
    document.getElementById('platform-label').textContent = parts[0];
    // reset video
    setProgress(0);
    videoPlaying = false;
    document.getElementById('play-btn').innerHTML = '&#9654;';
  });
});

// ── Video player ─────────────────────────────────────────────────

let videoPlaying = false;
let videoProgress = 0;
let videoInterval = null;
let muted = false;

const playBtn   = document.getElementById('play-btn');
const muteBtn   = document.getElementById('mute-btn');
const timeLabel = document.getElementById('time-label');

playBtn.addEventListener('click', togglePlay);

function togglePlay() {
  videoPlaying = !videoPlaying;
  playBtn.innerHTML = videoPlaying ? '&#9646;&#9646;' : '&#9654;';
  if (videoPlaying) {
    videoInterval = setInterval(() => {
      videoProgress = Math.min(videoProgress + 0.5, 100);
      setProgress(videoProgress);
      if (videoProgress >= 100) {
        videoPlaying = false;
        playBtn.innerHTML = '&#9654;';
        clearInterval(videoInterval);
        videoProgress = 0;
      }
    }, 80);
  } else {
    clearInterval(videoInterval);
  }
}

function setProgress(pct) {
  videoProgress = pct;
  document.getElementById('progress-fill').style.width = pct + '%';
  const secs = Math.floor(pct * 0.3);
  timeLabel.textContent = secs + 's / 30s';
  syncWaveform(pct);
}

muteBtn.addEventListener('click', () => {
  muted = !muted;
  muteBtn.innerHTML = muted ? '&#128263;' : '&#128266;';
});

// ── Sidebar nav ──────────────────────────────────────────────────

document.querySelectorAll('.sidebar-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
    item.classList.add('active');
  });
});

// ── Language grid ────────────────────────────────────────────────

const langLabel    = document.getElementById('active-lang-label');
const exportLangBtn = document.getElementById('export-lang-btn');

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const lang = btn.dataset.lang;
    langLabel.textContent = lang;
    exportLangBtn.innerHTML = '&#11015; Export ' + lang;
  });
});

// ── Waveform ─────────────────────────────────────────────────────

const WAVE_BARS = 52;
let wavePlaying = false;
let waveInterval = null;
let waveProgress = 0;

function buildWaveform() {
  const container = document.getElementById('waveform');
  container.innerHTML = '';
  for (let i = 0; i < WAVE_BARS; i++) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    // natural-looking heights
    const h = 20 + Math.sin(i * 0.85) * 14 + Math.cos(i * 0.4) * 6;
    bar.style.height = Math.abs(h) + 'px';
    container.appendChild(bar);
  }
}

function syncWaveform(pct) {
  const bars = document.querySelectorAll('.wave-bar');
  const lit  = Math.floor((pct / 100) * WAVE_BARS);
  bars.forEach((b, i) => {
    b.classList.toggle('lit', i < lit);
  });
}

const wavePlayBtn = document.getElementById('wave-play-btn');
wavePlayBtn.addEventListener('click', () => {
  wavePlaying = !wavePlaying;
  wavePlayBtn.innerHTML = wavePlaying ? '&#9646;&#9646;' : '&#9654;';
  if (wavePlaying) {
    waveInterval = setInterval(() => {
      waveProgress = Math.min(waveProgress + 0.5, 100);
      syncWaveform(waveProgress);
      if (waveProgress >= 100) {
        wavePlaying = false;
        wavePlayBtn.innerHTML = '&#9654;';
        clearInterval(waveInterval);
        waveProgress = 0;
      }
    }, 80);
  } else {
    clearInterval(waveInterval);
  }
});

// ── Reset button ─────────────────────────────────────────────────

document.getElementById('reset-btn').addEventListener('click', () => {
  // Clean up
  clearInterval(videoInterval);
  clearInterval(waveInterval);
  videoPlaying = false;
  wavePlaying  = false;
  videoProgress = 0;
  waveProgress  = 0;
  urlInput.value = '';

  showView('view-input');
  // Re-show nav (it sits above views)
});

// ── Init ─────────────────────────────────────────────────────────

showView('view-input');

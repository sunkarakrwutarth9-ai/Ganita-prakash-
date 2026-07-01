/* =====================================================================
   GANITA PRAKASH — iOS 26 Liquid Glass theme engine + admin Customise panel
   Loaded on the REPLICA site only. Persists to localStorage so the admin's
   chosen look survives reloads. Nothing here touches the backend or the
   original site.
   ===================================================================== */
(function () {
  'use strict';

  var STORE_KEY = 'ganita_ios26_theme_v1';

  // ---- Design-token defaults (mirror :root in ios26.css) ----
  var DEFAULTS = {
    accent:      '#0A84FF',
    accent2:     '#5E5CE6',
    radius:      22,     // px
    blur:        22,     // px
    saturate:    180,    // %
    glassAlpha:  0.12,   // 0..0.45
    strokeAlpha: 0.22,   // 0..0.6
    text:        '#f5f7ff',
    font:        'system',
    wall:        ['#2b1d63', '#0b2a67', '#12124a', '#3a1560']
  };

  var FONTS = {
    system:  "-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI','Inter','Helvetica Neue',Arial,sans-serif",
    rounded: "'Nunito',ui-rounded,'SF Pro Rounded',-apple-system,'Segoe UI',sans-serif",
    serif:   "'Georgia','Times New Roman',ui-serif,serif",
    mono:    "ui-monospace,'SF Mono','Menlo','Consolas',monospace"
  };

  // Accent presets (primary + secondary)
  var ACCENTS = [
    ['#0A84FF', '#5E5CE6'], // iOS blue / indigo
    ['#30D158', '#0A84FF'], // green / blue
    ['#FF375F', '#FF9F0A'], // pink / orange
    ['#BF5AF2', '#5E5CE6'], // purple / indigo
    ['#FF9F0A', '#FF375F'], // orange / pink
    ['#64D2FF', '#0A84FF'], // cyan / blue
    ['#FFD60A', '#FF9F0A'], // yellow / orange
    ['#FF6482', '#BF5AF2']  // rose / purple
  ];

  // Wallpaper presets (4 blob colours)
  var WALLS = [
    ['#2b1d63', '#0b2a67', '#12124a', '#3a1560'], // Midnight (default)
    ['#0b3d5c', '#0f766e', '#0b3a4a', '#134e4a'], // Teal Deep
    ['#5a1e4a', '#7a1f3d', '#3a1140', '#611030'], // Sunset Berry
    ['#1e293b', '#334155', '#0f172a', '#1e1b4b'], // Slate
    ['#3b0764', '#6d28d9', '#1e1b4b', '#4c1d95'], // Violet
    ['#7c2d12', '#b45309', '#431407', '#78350f'], // Amber Night
    ['#052e2b', '#065f46', '#022c22', '#064e3b'], // Forest
    ['#0c1a3a', '#111827', '#020617', '#0b132b']  // Space (mono)
  ];

  var state = load();

  // -------------------- persistence --------------------
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return clone(DEFAULTS);
      var s = JSON.parse(raw);
      var out = clone(DEFAULTS);
      for (var k in s) { if (s.hasOwnProperty(k)) out[k] = s[k]; }
      if (!Array.isArray(out.wall) || out.wall.length !== 4) out.wall = clone(DEFAULTS.wall);
      return out;
    } catch (e) { return clone(DEFAULTS); }
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // -------------------- apply tokens --------------------
  function apply() {
    var r = document.documentElement.style;
    r.setProperty('--ig-accent', state.accent);
    r.setProperty('--ig-accent-2', state.accent2);
    r.setProperty('--ig-radius', state.radius + 'px');
    r.setProperty('--ig-blur', state.blur + 'px');
    r.setProperty('--ig-saturate', state.saturate + '%');
    r.setProperty('--ig-glass-alpha', String(state.glassAlpha));
    r.setProperty('--ig-stroke-alpha', String(state.strokeAlpha));
    r.setProperty('--ig-text', state.text);
    r.setProperty('--ig-font', FONTS[state.font] || FONTS.system);
    r.setProperty('--ig-wall-1', state.wall[0]);
    r.setProperty('--ig-wall-2', state.wall[1]);
    r.setProperty('--ig-wall-3', state.wall[2]);
    r.setProperty('--ig-wall-4', state.wall[3]);
  }

  // Apply as early as possible.
  apply();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  }

  // -------------------- Customise panel --------------------
  function esc(s){ return String(s); }

  function buildPanel() {
    var sec = document.getElementById('customise-section');
    if (!sec || sec.getAttribute('data-ig-built') === '1') return;

    var accentSwatches = ACCENTS.map(function (a, i) {
      return '<div class="ig-swatch" data-accent="' + i + '" title="Accent ' + (i + 1) + '" ' +
             'style="background:linear-gradient(135deg,' + a[0] + ',' + a[1] + ')"></div>';
    }).join('');

    var wallOpts = WALLS.map(function (w, i) {
      var bg = 'radial-gradient(60% 60% at 20% 20%,' + w[0] + ',transparent 60%),' +
               'radial-gradient(60% 60% at 80% 15%,' + w[3] + ',transparent 60%),' +
               'radial-gradient(70% 70% at 75% 85%,' + w[1] + ',transparent 62%),' +
               'linear-gradient(160deg,#0a0a1f,#0e0b23)';
      return '<div class="ig-wall-opt" data-wall="' + i + '" title="Wallpaper ' + (i + 1) + '" style="background:' + bg + '"></div>';
    }).join('');

    var fontOpts = ['system', 'rounded', 'serif', 'mono'].map(function (f) {
      return '<option value="' + f + '"' + (state.font === f ? ' selected' : '') + '>' +
             f.charAt(0).toUpperCase() + f.slice(1) + '</option>';
    }).join('');

    sec.innerHTML =
      '<h2 class="section-title">Customise &nbsp;·&nbsp; Liquid Glass</h2>' +
      '<p style="color:var(--ig-text-dim);margin-bottom:18px;">Change the look of the app live — like iOS 26. Your changes save automatically on this device.</p>' +
      '<div class="ig-cust-wrap">' +

        '<div class="ig-glass ig-cust-card">' +
          '<h3>Accent</h3>' +
          '<div class="ig-presets" id="ig-accent-presets">' + accentSwatches + '</div>' +
          '<div class="ig-row"><label>Primary</label><input type="color" id="ig-accent" value="' + state.accent + '"></div>' +
          '<div class="ig-row"><label>Secondary</label><input type="color" id="ig-accent2" value="' + state.accent2 + '"></div>' +
          '<div class="ig-row"><label>Text colour</label><input type="color" id="ig-text" value="' + state.text + '"></div>' +
        '</div>' +

        '<div class="ig-glass ig-cust-card">' +
          '<h3>Glass</h3>' +
          '<div class="ig-row"><label>Blur</label><input type="range" id="ig-blur" min="0" max="44" step="1" value="' + state.blur + '"><span class="ig-val" id="ig-blur-v">' + state.blur + '</span></div>' +
          '<div class="ig-row"><label>Opacity</label><input type="range" id="ig-glassAlpha" min="0" max="45" step="1" value="' + Math.round(state.glassAlpha * 100) + '"><span class="ig-val" id="ig-glassAlpha-v">' + Math.round(state.glassAlpha * 100) + '</span></div>' +
          '<div class="ig-row"><label>Border</label><input type="range" id="ig-strokeAlpha" min="0" max="60" step="1" value="' + Math.round(state.strokeAlpha * 100) + '"><span class="ig-val" id="ig-strokeAlpha-v">' + Math.round(state.strokeAlpha * 100) + '</span></div>' +
          '<div class="ig-row"><label>Vibrancy</label><input type="range" id="ig-saturate" min="100" max="260" step="5" value="' + state.saturate + '"><span class="ig-val" id="ig-saturate-v">' + state.saturate + '</span></div>' +
          '<div class="ig-row"><label>Corner radius</label><input type="range" id="ig-radius" min="0" max="40" step="1" value="' + state.radius + '"><span class="ig-val" id="ig-radius-v">' + state.radius + '</span></div>' +
        '</div>' +

        '<div class="ig-glass ig-cust-card">' +
          '<h3>Wallpaper</h3>' +
          '<div class="ig-wall-opts" id="ig-wall-opts">' + wallOpts + '</div>' +
          '<div class="ig-row" style="margin-top:14px;"><label>Custom blobs</label></div>' +
          '<div class="ig-row"><label>1</label><input type="color" id="ig-w0" value="' + state.wall[0] + '"><label>2</label><input type="color" id="ig-w1" value="' + state.wall[1] + '"></div>' +
          '<div class="ig-row"><label>3</label><input type="color" id="ig-w2" value="' + state.wall[2] + '"><label>4</label><input type="color" id="ig-w3" value="' + state.wall[3] + '"></div>' +
        '</div>' +

        '<div class="ig-glass ig-cust-card">' +
          '<h3>Typography</h3>' +
          '<div class="ig-row"><label>Font family</label><select id="ig-font">' + fontOpts + '</select></div>' +
          '<div class="ig-cust-actions">' +
            '<button class="ig-btn ig-btn-primary" id="ig-reset">Reset to default</button>' +
          '</div>' +
          '<p style="color:var(--ig-text-dim);font-size:.8rem;margin-top:12px;">Tip: pick an accent swatch and a wallpaper, then fine-tune blur &amp; opacity for the classic frosted-glass look.</p>' +
        '</div>' +

      '</div>';

    sec.setAttribute('data-ig-built', '1');
    wire();
  }

  function bindRange(id, key, transform, suffix) {
    var el = document.getElementById(id);
    var out = document.getElementById(id + '-v');
    if (!el) return;
    el.addEventListener('input', function () {
      var raw = parseFloat(el.value);
      state[key] = transform ? transform(raw) : raw;
      if (out) out.textContent = el.value + (suffix || '');
      apply(); save();
    });
  }
  function bindColor(id, key) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () { state[key] = el.value; apply(); save(); });
  }

  function wire() {
    bindColor('ig-accent', 'accent');
    bindColor('ig-accent2', 'accent2');
    bindColor('ig-text', 'text');
    bindRange('ig-blur', 'blur');
    bindRange('ig-radius', 'radius');
    bindRange('ig-saturate', 'saturate');
    bindRange('ig-glassAlpha', 'glassAlpha', function (v) { return v / 100; });
    bindRange('ig-strokeAlpha', 'strokeAlpha', function (v) { return v / 100; });

    var fontSel = document.getElementById('ig-font');
    if (fontSel) fontSel.addEventListener('change', function () { state.font = fontSel.value; apply(); save(); });

    // Accent presets
    var ap = document.getElementById('ig-accent-presets');
    if (ap) ap.addEventListener('click', function (e) {
      var t = e.target.closest('[data-accent]'); if (!t) return;
      var pair = ACCENTS[+t.getAttribute('data-accent')];
      state.accent = pair[0]; state.accent2 = pair[1];
      var a1 = document.getElementById('ig-accent'), a2 = document.getElementById('ig-accent2');
      if (a1) a1.value = pair[0]; if (a2) a2.value = pair[1];
      apply(); save();
    });

    // Wallpaper presets
    var wo = document.getElementById('ig-wall-opts');
    if (wo) wo.addEventListener('click', function (e) {
      var t = e.target.closest('[data-wall]'); if (!t) return;
      state.wall = WALLS[+t.getAttribute('data-wall')].slice();
      for (var i = 0; i < 4; i++) { var el = document.getElementById('ig-w' + i); if (el) el.value = state.wall[i]; }
      apply(); save();
    });

    // Custom wallpaper blobs
    for (var i = 0; i < 4; i++) {
      (function (idx) {
        var el = document.getElementById('ig-w' + idx);
        if (el) el.addEventListener('input', function () { state.wall[idx] = el.value; apply(); save(); });
      })(i);
    }

    var reset = document.getElementById('ig-reset');
    if (reset) reset.addEventListener('click', function () {
      state = clone(DEFAULTS); apply(); save();
      var sec = document.getElementById('customise-section');
      if (sec) { sec.removeAttribute('data-ig-built'); buildPanel(); }
    });
  }

  // Public hook — called from showSection('customise')
  window.igInitCustomise = buildPanel;
})();

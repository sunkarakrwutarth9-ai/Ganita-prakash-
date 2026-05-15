// In-app Formula Videos viewer. Self-contained: no network.
// Mirrors the main website's Formula Videos page layout (see web-app/app.js
// renderFormulaVideos): per-chapter cards with "Video Coming Soon" placeholders.
// When formula videos are uploaded later, just plug their YouTube IDs into the
// CHAPTERS_*_VIDEO_IDS maps below — the cards will turn into watchable
// thumbnails automatically.

const CHAPTERS_6 = [
  { number: '1', title: 'Patterns in Mathematics' },
  { number: '2', title: 'Lines and Angles' },
  { number: '3', title: 'Number Play' },
  { number: '4', title: 'Data Handling and Presentation' },
  { number: '5', title: 'Prime Time' },
  { number: '6', title: 'Perimeter and Area' },
  { number: '7', title: 'Fractions' },
  { number: '8', title: 'Playing with Constructions' },
  { number: '9', title: 'Symmetry' },
  { number: '10', title: 'The Other Side of Zero' },
];

const CHAPTERS_7 = [
  { number: '1', title: 'Large Numbers Around Us' },
  { number: '2', title: 'Arithmetic Expressions' },
  { number: '3', title: 'A Peek Beyond the Point' },
  { number: '4', title: 'Expressions Using Letter-Numbers' },
  { number: '5', title: 'Parallel and Intersecting Lines' },
  { number: '6', title: 'Number Play' },
  { number: '7', title: 'A Tale of Three Intersecting Lines' },
  { number: '8', title: 'Working with Fractions' },
  { number: '9', title: 'Constructions' },
  { number: '10', title: 'Computer Algorithms' },
  { number: '11', title: 'Comparing Quantities' },
  { number: '12', title: 'Symmetry' },
  { number: '13', title: 'Visualising Solid Shapes' },
  { number: '14', title: 'Cube and Cuboid' },
  { number: '15', title: 'Rational Numbers' },
];

// Optional: per-chapter YouTube video IDs. Empty for now → cards render
// "Video Coming Soon" exactly like the website. To enable a chapter's video,
// set CHAPTERS_*_VIDEO_IDS[chapterNumber] = 'YOUTUBE_VIDEO_ID'.
const CHAPTERS_6_VIDEO_IDS = {};
const CHAPTERS_7_VIDEO_IDS = {};

function buildFormulaVideosHtml(cls) {
  const active = String(cls) === '7' ? '7' : '6';
  const payload = JSON.stringify({
    c6: CHAPTERS_6,
    c7: CHAPTERS_7,
    v6: CHAPTERS_6_VIDEO_IDS,
    v7: CHAPTERS_7_VIDEO_IDS,
    active: active,
  }).replace(/<\/script>/gi, '<\\/script>');
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Formula Videos</title>
<style>
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin:0; padding:0; background:#0a0e27; color:#fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-height: 100vh; }
  .wrap { padding: 16px; max-width: 720px; margin: 0 auto; }
  h1 { font-size: 1.5em; margin: 0 0 6px; background: linear-gradient(135deg,#ff6600,#ff00ff); -webkit-background-clip:text; background-clip:text; color: transparent; font-weight: 800; letter-spacing: 0.5px; }
  .sub { color:#aaa; margin: 0 0 18px; font-size: 0.95em; line-height: 1.45; }
  .tabs { display:flex; gap:8px; margin-bottom: 18px; }
  .tab { flex:1; padding: 10px 14px; border-radius: 999px; background: rgba(255,255,255,0.06); color:#aaa; font-weight:700; text-align:center; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; }
  .tab.active { background: linear-gradient(135deg,#ff6600,#ff00ff); color:#fff; border-color: transparent; box-shadow: 0 4px 16px rgba(255,0,255,0.3); }
  .grid { display:grid; grid-template-columns: 1fr; gap: 14px; }
  @media (min-width: 520px) { .grid { grid-template-columns: 1fr 1fr; } }
  .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px; display:flex; flex-direction:column; gap: 10px; position: relative; overflow:hidden; }
  .num { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg,#ff6600,#ff00ff); display:flex; align-items:center; justify-content:center; font-weight: 800; color:#fff; font-size: 1.1em; box-shadow: 0 4px 12px rgba(255,0,255,0.25); }
  .title { font-size: 1.05em; font-weight: 700; color:#fff; line-height: 1.3; }
  .body { color:#aaa; font-size: 0.92em; font-style: italic; }
  .thumb { position: relative; border-radius: 10px; overflow:hidden; aspect-ratio: 16 / 9; background:#000; }
  .thumb img { width:100%; height:100%; object-fit: cover; display:block; }
  .thumb .play { position: absolute; inset: 0; display:flex; align-items:center; justify-content:center; font-size: 44px; color:#fff; text-shadow: 0 4px 16px rgba(0,0,0,0.8); }
  .badge { display:inline-block; padding: 6px 12px; border-radius: 999px; font-size: 0.78em; font-weight: 700; align-self: flex-start; }
  .badge.soon { background:#555; color:#eee; }
  .badge.go { background: linear-gradient(135deg,#ff6600,#ff00ff); color:#fff; }
  a.card-link { text-decoration: none; color: inherit; display: block; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>🧮 Formula Videos</h1>
    <p class="sub">Watch formula videos for each chapter. New videos are uploaded by your teacher — they appear here automatically.</p>
    <div class="tabs">
      <div class="tab" id="tab-6" onclick="switchTab('6')">Class 6</div>
      <div class="tab" id="tab-7" onclick="switchTab('7')">Class 7</div>
    </div>
    <div id="grid" class="grid"></div>
  </div>
<script>
const DATA = ${payload};
let activeTab = DATA.active;

function render() {
  const tab6 = document.getElementById('tab-6');
  const tab7 = document.getElementById('tab-7');
  tab6.classList.toggle('active', activeTab === '6');
  tab7.classList.toggle('active', activeTab === '7');
  const chapters = activeTab === '7' ? DATA.c7 : DATA.c6;
  const vids = activeTab === '7' ? DATA.v7 : DATA.v6;
  const grid = document.getElementById('grid');
  grid.innerHTML = chapters.map(ch => {
    const vid = vids[ch.number];
    if (vid) {
      const thumb = 'https://img.youtube.com/vi/' + vid + '/hqdefault.jpg';
      const watch = 'https://www.youtube.com/watch?v=' + vid;
      return '<a class="card-link" href="' + watch + '" target="_blank" rel="noopener">' +
        '<div class="card">' +
          '<div class="num">' + ch.number + '</div>' +
          '<div class="title">' + ch.title + '</div>' +
          '<div class="thumb"><img loading="lazy" src="' + thumb + '" alt="' + ch.title + '"><div class="play">▶</div></div>' +
          '<div class="badge go">🧮 Watch Formula Video</div>' +
        '</div></a>';
    }
    return '<div class="card">' +
      '<div class="num">' + ch.number + '</div>' +
      '<div class="title">' + ch.title + '</div>' +
      '<div class="body">Formula video coming soon!</div>' +
      '<div class="badge soon">📹 Video Coming Soon</div>' +
    '</div>';
  }).join('');
}

function switchTab(c) {
  activeTab = c;
  render();
}

render();
</script>
</body></html>`;
}

module.exports = { buildFormulaVideosHtml };

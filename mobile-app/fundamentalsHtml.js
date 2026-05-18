// In-app Fundamentals viewer. Self-contained: no network. Renders the same
// worksheet data as the website's Fundamentals section (Class 1-5 fundamentals
// for Class 6 students; Class 1-6 fundamentals for Class 7 students).
const { FUNDAMENTALS_W6, FUNDAMENTALS_W7 } = require('./fundamentalsData');

function buildFundamentalsHtml(cls) {
  const data = String(cls) === '7' ? FUNDAMENTALS_W7 : FUNDAMENTALS_W6;
  const label = String(cls) === '7' ? 'Class 1\u20136 Fundamentals' : 'Class 1\u20135 Fundamentals';
  // Inject data as JSON. JSON is a strict subset of JS so embed-safe inside <script>.
  // Escape `</script>` defensively in case content contains the literal sequence.
  const dataJson = JSON.stringify(data).replace(/<\/script>/gi, '<\\/script>');
  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<title>Fundamentals</title>
<style>
*,*:before,*:after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{margin:0;padding:0;background:#0a0e27;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased;}
.hdr{padding:16px 18px;background:linear-gradient(135deg,#1a1a3e 0%,#0d2137 100%);border-bottom:2px solid #00e5ff;}
.hdr h1{margin:0;font-size:18px;color:#00e5ff;letter-spacing:1px;}
.hdr p{margin:4px 0 0 0;color:#aaa;font-size:12px;}
.list{padding:14px;display:grid;grid-template-columns:1fr;gap:12px;}
@media (min-width:520px){.list{grid-template-columns:1fr 1fr;}}
.card{background:#16213E;border:1px solid #00e5ff40;border-radius:14px;padding:14px;cursor:pointer;}
.card .num{display:inline-block;background:linear-gradient(135deg,#00e5ff,#00b0ff);color:#000;font-weight:700;border-radius:8px;padding:4px 10px;font-size:12px;}
.card h3{margin:8px 0 4px;font-size:15px;color:#fff;}
.card p{margin:0;color:#aaa;font-size:12.5px;line-height:1.4;}
.card .badge{display:inline-block;margin-top:8px;background:#00e5ff;color:#000;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;}
.card.completed{border-color:#34c759;}
.card.completed .badge{background:#34c759;color:#000;}
.detail{padding:14px 16px;}
.detail .back{background:#16213E;color:#00e5ff;border:1px solid #00e5ff40;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:13px;}
.detail h2{margin:14px 0 6px;color:#00e5ff;font-size:18px;}
.detail .topic{background:#16213E;border:1px solid #2a2a4e;border-radius:10px;padding:12px;margin:10px 0;}
.detail .topic h4{margin:0 0 6px;color:#00d4ff;font-size:14px;}
.detail .topic .body{font-size:13.5px;line-height:1.55;color:#e3e3f0;white-space:pre-wrap;}
.start{display:block;width:100%;background:linear-gradient(135deg,#00d4ff,#0099ff);color:#fff;border:none;border-radius:10px;padding:14px;margin-top:14px;font-weight:700;font-size:14px;cursor:pointer;}
.q{background:#16213E;border:1px solid #2a2a4e;border-radius:10px;padding:12px;margin:10px 0;}
.q .qt{font-size:14px;margin-bottom:8px;color:#fff;}
.q .opt{display:block;width:100%;text-align:left;background:#0d1430;color:#fff;border:1px solid #2a2a4e;border-radius:8px;padding:10px 12px;margin:6px 0;font-size:13.5px;cursor:pointer;}
.q .opt.correct{background:#15622f;border-color:#34c759;}
.q .opt.wrong{background:#5b1d1d;border-color:#ff3b30;}
.q .why{margin-top:8px;color:#9fcaff;font-size:12.5px;background:#0d1430;border-left:3px solid #00d4ff;padding:8px 10px;border-radius:6px;display:none;}
.q.show .why{display:block;}
.bar{display:flex;gap:8px;flex-wrap:wrap;}
.score{margin-top:14px;padding:14px;background:#16213E;border:1px solid #34c75940;border-radius:10px;color:#34c759;font-weight:700;text-align:center;}
.hidden{display:none;}
</style>
</head>
<body>
<div class="hdr">
  <h1>Fundamentals \u2014 ${label}</h1>
  <p>Bridge Course \u2022 12 worksheets \u2022 5 MCQs each \u2022 always unlocked</p>
</div>
<div id="root"></div>
<script>
const DATA = ${dataJson};
const PROGRESS_KEY = 'gp_fund_progress_${String(cls)}';
function getProgress(){ try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');}catch(e){return {};} }
function setProgress(p){ try{localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));}catch(e){} }

function renderList(){
  const root = document.getElementById('root');
  const p = getProgress();
  let html = '<div class="list">';
  DATA.forEach((w, idx) => {
    const sc = p[w.id];
    const done = sc !== undefined;
    html += '<div class="card '+(done?'completed':'')+'" onclick="openWS(\\''+w.id+'\\')">';
    html += '<span class="num">W'+(idx+1)+'</span>';
    html += '<h3>'+escapeHtml(w.title)+'</h3>';
    html += '<p>'+escapeHtml(w.desc||'')+'</p>';
    html += '<span class="badge">'+(done?('Score '+sc+'%'):'Open')+'</span>';
    html += '</div>';
  });
  html += '</div>';
  root.innerHTML = html;
}
function openWS(id){
  const w = DATA.find(x=>x.id===id); if(!w)return;
  let html='<div class="detail">';
  html += '<button class="back" onclick="renderList()">\u2190 Back</button>';
  html += '<h2>'+escapeHtml(w.title)+'</h2>';
  html += '<p style="color:#aaa;font-size:13px;margin:0 0 10px 0;">'+escapeHtml(w.desc||'')+'</p>';
  if(w.topicContent && w.topicContent.length){
    html += '<h2 style="font-size:15px;">Concepts</h2>';
    w.topicContent.forEach(t => {
      html += '<div class="topic"><h4>'+escapeHtml(t.name)+'</h4>';
      html += '<div class="body">'+escapeHtml(t.content||'')+'</div></div>';
    });
  }
  html += '<button class="start" onclick="startQuiz(\\''+id+'\\')">Start 5-Question Worksheet</button>';
  html += '</div>';
  document.getElementById('root').innerHTML = html;
  window.scrollTo(0,0);
}
function startQuiz(id){
  const w = DATA.find(x=>x.id===id); if(!w)return;
  const qs = w.questions||[];
  const answered = new Array(qs.length).fill(null);
  let html = '<div class="detail">';
  html += '<button class="back" onclick="openWS(\\''+id+'\\')">\u2190 Back</button>';
  html += '<h2>Worksheet: '+escapeHtml(w.title)+'</h2>';
  qs.forEach((q,i) => {
    html += '<div class="q" id="q-'+i+'"><div class="qt">'+(i+1)+'. '+escapeHtml(q.q)+'</div>';
    (q.options||[]).forEach((o,oi) => {
      html += '<button class="opt" data-q="'+i+'" data-o="'+oi+'" onclick="answerQ(this,'+i+','+oi+','+q.answer+')">'+escapeHtml(o)+'</button>';
    });
    html += '<div class="why">'+escapeHtml(q.why||'')+'</div></div>';
  });
  html += '<button class="start" onclick="finishQuiz(\\''+id+'\\')">Finish & See Score</button>';
  html += '<div id="score"></div>';
  html += '</div>';
  document.getElementById('root').innerHTML = html;
  window._answered = answered; window._wsid = id;
  window.scrollTo(0,0);
}
function answerQ(btn, qi, oi, ans){
  if(window._answered[qi]!==null) return;
  window._answered[qi] = oi;
  const block = document.getElementById('q-'+qi);
  const opts = block.querySelectorAll('.opt');
  opts.forEach((b,bi)=>{
    if(bi===ans) b.classList.add('correct');
    else if(bi===oi) b.classList.add('wrong');
    b.disabled=true;
  });
  block.classList.add('show');
}
function finishQuiz(id){
  const w = DATA.find(x=>x.id===id); if(!w)return;
  const qs = w.questions||[];
  let correct = 0;
  qs.forEach((q,i)=>{ if(window._answered[i]===q.answer) correct++; });
  const pct = Math.round(correct*100/qs.length);
  const p = getProgress(); p[id] = pct; setProgress(p);
  document.getElementById('score').innerHTML = '<div class="score">You scored '+correct+' / '+qs.length+' ('+pct+'%)</div>';
  window.scrollTo(0, document.body.scrollHeight);
}
function escapeHtml(s){ if(s==null)return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
window.openWS = openWS; window.renderList = renderList; window.startQuiz = startQuiz; window.answerQ = answerQ; window.finishQuiz = finishQuiz;
renderList();
</script>
</body></html>`;
}

module.exports = { buildFundamentalsHtml };

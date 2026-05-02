// In-app whiteboard HTML5 canvas. Self-contained: no network, no external assets.
// Loaded into a WebView via source={{html: WHITEBOARD_HTML}}.
// Pen / Eraser / Highlighter / 8 colors / size / undo / redo / clear / save (data-URL).
const WHITEBOARD_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<title>Whiteboard</title>
<style>
*,*:before,*:after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;width:100%;margin:0;padding:0;background:#0a0e27;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;overflow:hidden;overscroll-behavior:none;touch-action:none;}
.bar{display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:#1A1A2E;border-bottom:1px solid #2a2a4e;align-items:center;}
.bar button,.bar .swatch{height:34px;min-width:34px;padding:0 10px;border-radius:8px;border:1px solid #2a2a4e;background:#16213E;color:#fff;font-weight:600;font-size:13px;cursor:pointer;}
.bar button.primary{background:linear-gradient(135deg,#00d4ff,#0099ff);border:none;color:#fff;}
.bar button.danger{background:linear-gradient(135deg,#ff4444,#cc0000);border:none;color:#fff;}
.bar button.ok{background:linear-gradient(135deg,#00ff88,#00cc66);border:none;color:#000;}
.bar button.active{outline:2px solid #00d4ff;}
.swatch{width:30px;min-width:30px;padding:0;border:2px solid #2a2a4e;}
.swatch.active{border-color:#fff;transform:scale(1.1);}
.size-row{display:flex;align-items:center;gap:6px;color:#aaa;font-size:12px;}
.size-row input{accent-color:#00d4ff;}
canvas{display:block;background:#fff;touch-action:none;}
.wrap{position:relative;width:100%;height:calc(100% - 96px);overflow:hidden;}
#hint{position:absolute;top:6px;right:8px;color:#666;font-size:11px;pointer-events:none;}
</style>
</head>
<body>
<div class="bar" id="topbar">
  <button class="primary" onclick="newPage()">+ New</button>
  <button class="danger" onclick="clearAll()">Clear</button>
  <button class="ok" onclick="savePNG()">Save PNG</button>
  <button onclick="undo()">&#8617;</button>
  <button onclick="redo()">&#8618;</button>
  <button onclick="toggleGrid()" id="gridBtn">Grid</button>
</div>
<div class="bar" id="toolbar">
  <button id="t-pen" class="active" onclick="setTool('pen')">Pen</button>
  <button id="t-eraser" onclick="setTool('eraser')">Eraser</button>
  <button id="t-highlight" onclick="setTool('highlight')">Highlight</button>
  <span class="swatch active" data-c="#000000" style="background:#000000"></span>
  <span class="swatch" data-c="#ff3b30" style="background:#ff3b30"></span>
  <span class="swatch" data-c="#0a84ff" style="background:#0a84ff"></span>
  <span class="swatch" data-c="#34c759" style="background:#34c759"></span>
  <span class="swatch" data-c="#ff9500" style="background:#ff9500"></span>
  <span class="swatch" data-c="#af52de" style="background:#af52de"></span>
  <span class="swatch" data-c="#ff2d55" style="background:#ff2d55"></span>
  <span class="swatch" data-c="#5856d6" style="background:#5856d6"></span>
  <span class="size-row">Size <input id="size" type="range" min="1" max="24" value="3" /><span id="sizeVal">3</span></span>
</div>
<div class="wrap"><canvas id="cv"></canvas><div id="hint">Draw with finger. Tap "Save PNG" to download.</div></div>
<script>
(function(){
  const cv=document.getElementById('cv');
  const ctx=cv.getContext('2d',{willReadFrequently:true});
  const wrap=cv.parentElement;
  let tool='pen',color='#000000',size=3,drawing=false,last=null,grid=false;
  const stack=[],redoStack=[];
  function resize(){
    const r=wrap.getBoundingClientRect();
    const dpr=window.devicePixelRatio||1;
    const w=Math.floor(r.width),h=Math.floor(r.height);
    if(cv.dataset.w==w&&cv.dataset.h==h)return;
    const old=document.createElement('canvas');
    old.width=cv.width;old.height=cv.height;
    if(cv.width)old.getContext('2d').drawImage(cv,0,0);
    cv.width=w*dpr;cv.height=h*dpr;cv.style.width=w+'px';cv.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
    if(old.width)ctx.drawImage(old,0,0,old.width/dpr,old.height/dpr);
    if(grid)drawGrid();
    cv.dataset.w=w;cv.dataset.h=h;
  }
  function drawGrid(){
    ctx.save();ctx.strokeStyle='#cfd8e3';ctx.lineWidth=0.5;
    const w=cv.clientWidth,h=cv.clientHeight,step=24;
    for(let x=0;x<=w;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<=h;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.restore();
  }
  function pos(e){
    const r=cv.getBoundingClientRect();
    const t=e.touches?e.touches[0]:e;
    return {x:t.clientX-r.left,y:t.clientY-r.top};
  }
  function snap(){
    try{stack.push(cv.toDataURL('image/png'));if(stack.length>30)stack.shift();redoStack.length=0;}catch(e){}
  }
  function start(e){e.preventDefault();drawing=true;last=pos(e);snap();}
  function move(e){
    if(!drawing)return;e.preventDefault();
    const p=pos(e);
    ctx.lineCap='round';ctx.lineJoin='round';
    if(tool==='eraser'){ctx.globalCompositeOperation='destination-out';ctx.lineWidth=size*4;ctx.strokeStyle='rgba(0,0,0,1)';}
    else if(tool==='highlight'){ctx.globalCompositeOperation='multiply';ctx.lineWidth=size*4;ctx.strokeStyle=color+'66';}
    else{ctx.globalCompositeOperation='source-over';ctx.lineWidth=size;ctx.strokeStyle=color;}
    ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();
    last=p;
  }
  function end(e){drawing=false;last=null;ctx.globalCompositeOperation='source-over';}
  cv.addEventListener('pointerdown',start);
  cv.addEventListener('pointermove',move);
  cv.addEventListener('pointerup',end);
  cv.addEventListener('pointercancel',end);
  cv.addEventListener('pointerleave',end);
  cv.addEventListener('touchstart',start,{passive:false});
  cv.addEventListener('touchmove',move,{passive:false});
  cv.addEventListener('touchend',end,{passive:false});
  window.setTool=function(t){tool=t;document.querySelectorAll('#toolbar button').forEach(b=>b.classList.remove('active'));const el=document.getElementById('t-'+t);if(el)el.classList.add('active');};
  window.clearAll=function(){snap();const w=cv.clientWidth,h=cv.clientHeight;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);if(grid)drawGrid();};
  window.newPage=window.clearAll;
  window.undo=function(){if(!stack.length)return;redoStack.push(cv.toDataURL('image/png'));const data=stack.pop();const img=new Image();img.onload=function(){ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,cv.clientWidth,cv.clientHeight);ctx.drawImage(img,0,0,cv.clientWidth,cv.clientHeight);};img.src=data;};
  window.redo=function(){if(!redoStack.length)return;stack.push(cv.toDataURL('image/png'));const data=redoStack.pop();const img=new Image();img.onload=function(){ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,cv.clientWidth,cv.clientHeight);ctx.drawImage(img,0,0,cv.clientWidth,cv.clientHeight);};img.src=data;};
  window.toggleGrid=function(){grid=!grid;document.getElementById('gridBtn').classList.toggle('active',grid);if(grid)drawGrid();else{ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.clientWidth,cv.clientHeight);}};
  window.savePNG=function(){
    const data=cv.toDataURL('image/png');
    if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(JSON.stringify({type:'save_png',data:data}));return;}
    const a=document.createElement('a');a.href=data;a.download='whiteboard-'+Date.now()+'.png';a.click();
  };
  document.querySelectorAll('.swatch').forEach(s=>s.addEventListener('click',()=>{
    document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('active'));
    s.classList.add('active');color=s.dataset.c;
  }));
  document.getElementById('size').addEventListener('input',e=>{size=+e.target.value;document.getElementById('sizeVal').textContent=size;});
  window.addEventListener('resize',resize);resize();
})();
</script>
</body></html>`;

module.exports = WHITEBOARD_HTML;

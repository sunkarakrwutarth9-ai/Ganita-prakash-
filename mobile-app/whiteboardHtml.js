// Tata Class Edge-style infinite whiteboard. Self-contained, offline, no network.
// Loaded into a WebView via source={{html: WHITEBOARD_HTML}}.
// Features: infinite pan/zoom, pen/eraser/highlighter, geometric shapes (line/arrow/rect/circle/triangle),
// math symbol pad, text tool, grids (square/dot/lined), 16 colors, multi-page, undo/redo (50), save PNG.
const WHITEBOARD_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<title>Whiteboard</title>
<style>
*,*:before,*:after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;width:100%;margin:0;padding:0;background:#0a0e27;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;overflow:hidden;overscroll-behavior:none;touch-action:none;user-select:none;-webkit-user-select:none;}
.bar{display:flex;flex-wrap:wrap;gap:4px;padding:6px;background:#1A1A2E;border-bottom:1px solid #2a2a4e;align-items:center;}
.bar button,.bar .swatch,.bar select{height:32px;min-width:32px;padding:0 8px;border-radius:8px;border:1px solid #2a2a4e;background:#16213E;color:#fff;font-weight:600;font-size:12px;cursor:pointer;outline:none;}
.bar button.primary{background:linear-gradient(135deg,#00d4ff,#0099ff);border:none;}
.bar button.danger{background:linear-gradient(135deg,#ff4444,#cc0000);border:none;}
.bar button.ok{background:linear-gradient(135deg,#00ff88,#00cc66);border:none;color:#000;}
.bar button.active{outline:2px solid #00d4ff;background:#0a3a5e;}
.swatch{width:26px;min-width:26px;padding:0;border:2px solid #2a2a4e;border-radius:50%;}
.swatch.active{border-color:#fff;transform:scale(1.15);}
.size-row{display:flex;align-items:center;gap:4px;color:#aaa;font-size:11px;}
.size-row input{accent-color:#00d4ff;width:80px;}
.wrap{position:relative;width:100%;height:calc(100% - 130px);overflow:hidden;background:#fff;}
canvas{display:block;touch-action:none;position:absolute;top:0;left:0;}
#hud{position:absolute;top:6px;left:8px;background:rgba(0,0,0,0.55);color:#fff;font-size:10px;padding:3px 6px;border-radius:4px;pointer-events:none;}
#pgctl{position:absolute;bottom:8px;right:8px;display:flex;gap:4px;background:rgba(26,26,46,0.92);padding:4px;border-radius:8px;}
#pgctl button{height:30px;min-width:30px;border-radius:6px;border:1px solid #2a2a4e;background:#16213E;color:#fff;font-weight:600;cursor:pointer;}
#pgctl span{align-self:center;color:#fff;font-size:11px;padding:0 6px;}
#mathpad{position:absolute;bottom:8px;left:8px;display:none;flex-wrap:wrap;gap:3px;background:rgba(26,26,46,0.95);padding:6px;border-radius:8px;max-width:60%;}
#mathpad.show{display:flex;}
#mathpad button{height:30px;min-width:30px;padding:0 6px;border-radius:6px;border:1px solid #2a2a4e;background:#16213E;color:#fff;font-size:13px;cursor:pointer;font-family:'Cambria Math','Latin Modern Math',serif;}
#textInput{position:absolute;display:none;border:1px dashed #0a84ff;padding:4px;background:rgba(255,255,255,0.95);color:#000;font-size:18px;font-family:inherit;outline:none;min-width:80px;}
.label{color:#aaa;font-size:11px;padding:0 4px;}
</style>
</head>
<body>
<div class="bar" id="topbar">
  <button class="primary" onclick="newPage()">+ Page</button>
  <button onclick="prevPage()">&#9664;</button>
  <span class="label" id="pgInfo">1/1</span>
  <button onclick="nextPage()">&#9654;</button>
  <button onclick="undo()" id="undoBtn">&#8617; Undo</button>
  <button onclick="redo()" id="redoBtn">&#8618; Redo</button>
  <button onclick="resetView()">&#8634; Fit</button>
  <button onclick="zoom(1.25)">+</button>
  <button onclick="zoom(0.8)">&#8722;</button>
  <button class="danger" onclick="clearPage()">Clear</button>
  <button class="ok" onclick="savePNG()">Save</button>
</div>
<div class="bar" id="toolbar">
  <button id="t-pen" class="active" onclick="setTool('pen')">&#9999; Pen</button>
  <button id="t-eraser" onclick="setTool('eraser')">Eraser</button>
  <button id="t-highlight" onclick="setTool('highlight')">Hilite</button>
  <button id="t-line" onclick="setTool('line')">Line</button>
  <button id="t-arrow" onclick="setTool('arrow')">&rarr;</button>
  <button id="t-rect" onclick="setTool('rect')">&#9645;</button>
  <button id="t-circle" onclick="setTool('circle')">&#9711;</button>
  <button id="t-triangle" onclick="setTool('triangle')">&#9651;</button>
  <button id="t-text" onclick="setTool('text')">T</button>
  <button id="t-pan" onclick="setTool('pan')">&#9995; Pan</button>
  <button id="t-math" onclick="toggleMath()">&radic;Math</button>
  <span class="label">Bg:</span>
  <select id="bgSel" onchange="setBg(this.value)">
    <option value="white">White</option>
    <option value="grid">Grid</option>
    <option value="dot">Dot</option>
    <option value="line">Lined</option>
    <option value="dark">Dark</option>
  </select>
</div>
<div class="bar" id="colorbar">
  <span class="swatch active" data-c="#000000" style="background:#000000"></span>
  <span class="swatch" data-c="#ffffff" style="background:#ffffff"></span>
  <span class="swatch" data-c="#ff3b30" style="background:#ff3b30"></span>
  <span class="swatch" data-c="#ff9500" style="background:#ff9500"></span>
  <span class="swatch" data-c="#ffcc00" style="background:#ffcc00"></span>
  <span class="swatch" data-c="#34c759" style="background:#34c759"></span>
  <span class="swatch" data-c="#00c7be" style="background:#00c7be"></span>
  <span class="swatch" data-c="#0a84ff" style="background:#0a84ff"></span>
  <span class="swatch" data-c="#5856d6" style="background:#5856d6"></span>
  <span class="swatch" data-c="#af52de" style="background:#af52de"></span>
  <span class="swatch" data-c="#ff2d55" style="background:#ff2d55"></span>
  <span class="swatch" data-c="#a2845e" style="background:#a2845e"></span>
  <span class="size-row">Size <input id="size" type="range" min="1" max="40" value="3" /><span id="sizeVal">3</span></span>
</div>
<div class="wrap" id="wrap">
  <canvas id="bg"></canvas>
  <canvas id="cv"></canvas>
  <canvas id="overlay"></canvas>
  <input id="textInput" />
  <div id="hud">Pen | 100% | Page 1</div>
  <div id="mathpad">
    <button onclick="insertMath('+')">+</button>
    <button onclick="insertMath('&#8722;')">&minus;</button>
    <button onclick="insertMath('&times;')">&times;</button>
    <button onclick="insertMath('&divide;')">&divide;</button>
    <button onclick="insertMath('=')">=</button>
    <button onclick="insertMath('&ne;')">&ne;</button>
    <button onclick="insertMath('&lt;')">&lt;</button>
    <button onclick="insertMath('&gt;')">&gt;</button>
    <button onclick="insertMath('&le;')">&le;</button>
    <button onclick="insertMath('&ge;')">&ge;</button>
    <button onclick="insertMath('&radic;')">&radic;</button>
    <button onclick="insertMath('&pi;')">&pi;</button>
    <button onclick="insertMath('&infin;')">&infin;</button>
    <button onclick="insertMath('&sum;')">&sum;</button>
    <button onclick="insertMath('&int;')">&int;</button>
    <button onclick="insertMath('&theta;')">&theta;</button>
    <button onclick="insertMath('&alpha;')">&alpha;</button>
    <button onclick="insertMath('&beta;')">&beta;</button>
    <button onclick="insertMath('&deg;')">&deg;</button>
    <button onclick="insertMath('&plusmn;')">&plusmn;</button>
    <button onclick="insertMath('&sup2;')">x&sup2;</button>
    <button onclick="insertMath('&sup3;')">x&sup3;</button>
    <button onclick="insertMath('&frac12;')">&frac12;</button>
    <button onclick="insertMath('&frac14;')">&frac14;</button>
    <button onclick="insertMath('&frac34;')">&frac34;</button>
  </div>
</div>
<script>
(function(){
  const wrap=document.getElementById('wrap');
  const bg=document.getElementById('bg'),cv=document.getElementById('cv'),ov=document.getElementById('overlay');
  const bgCtx=bg.getContext('2d'),ctx=cv.getContext('2d',{willReadFrequently:true}),ovCtx=ov.getContext('2d');
  const ti=document.getElementById('textInput');
  const hud=document.getElementById('hud');
  const sizeInput=document.getElementById('size'),sizeVal=document.getElementById('sizeVal');

  // Each "page" stores its own image data (the drawing layer)
  const pages=[]; // array of {data: ImageData (or null), strokes: array}
  let currentPage=0;
  let bgType='white';
  let tool='pen',color='#000000',size=3;
  let drawing=false,startPt=null,lastPt=null;
  let panZoom={x:0,y:0,scale:1};
  let isPanning=false, panStart=null, panZoomStart=null;
  let pinchInitialDist=0, pinchInitialScale=1, pinchCenter=null;
  const undoStack=[],redoStack=[];

  function dpr(){return window.devicePixelRatio||1;}

  function resize(){
    const r=wrap.getBoundingClientRect();
    const w=Math.max(1,Math.floor(r.width)),h=Math.max(1,Math.floor(r.height));
    [bg,cv,ov].forEach(c=>{
      c.width=w*dpr();c.height=h*dpr();
      c.style.width=w+'px';c.style.height=h+'px';
      c.getContext('2d').setTransform(dpr(),0,0,dpr(),0,0);
    });
    if(!pages.length){pages.push({data:null});}
    redrawAll();
  }

  function drawBg(){
    const w=cv.clientWidth,h=cv.clientHeight;
    bgCtx.clearRect(0,0,w,h);
    if(bgType==='dark'){bgCtx.fillStyle='#0a1424';bgCtx.fillRect(0,0,w,h);}
    else{bgCtx.fillStyle='#ffffff';bgCtx.fillRect(0,0,w,h);}
    if(bgType==='grid'){
      bgCtx.strokeStyle='#d8e0ec';bgCtx.lineWidth=0.5;
      const step=24*panZoom.scale;
      const offX=panZoom.x%step,offY=panZoom.y%step;
      for(let x=offX;x<=w;x+=step){bgCtx.beginPath();bgCtx.moveTo(x,0);bgCtx.lineTo(x,h);bgCtx.stroke();}
      for(let y=offY;y<=h;y+=step){bgCtx.beginPath();bgCtx.moveTo(0,y);bgCtx.lineTo(w,y);bgCtx.stroke();}
    }else if(bgType==='dot'){
      bgCtx.fillStyle='#b8c0d0';
      const step=20*panZoom.scale;
      const offX=panZoom.x%step,offY=panZoom.y%step;
      for(let x=offX;x<=w;x+=step){for(let y=offY;y<=h;y+=step){bgCtx.beginPath();bgCtx.arc(x,y,1.2,0,7);bgCtx.fill();}}
    }else if(bgType==='line'){
      bgCtx.strokeStyle='#cdd8e8';bgCtx.lineWidth=0.7;
      const step=28*panZoom.scale;
      const offY=panZoom.y%step;
      for(let y=offY;y<=h;y+=step){bgCtx.beginPath();bgCtx.moveTo(0,y);bgCtx.lineTo(w,y);bgCtx.stroke();}
    }
  }

  function applyTransform(c){
    c.setTransform(dpr()*panZoom.scale,0,0,dpr()*panZoom.scale,dpr()*panZoom.x,dpr()*panZoom.y);
  }

  function redrawAll(){
    ctx.setTransform(dpr(),0,0,dpr(),0,0);
    ctx.clearRect(0,0,cv.clientWidth,cv.clientHeight);
    drawBg();
    const pg=pages[currentPage];
    if(pg&&pg.data){
      // pg.data is a HTMLImageElement-like ImageBitmap
      ctx.setTransform(dpr()*panZoom.scale,0,0,dpr()*panZoom.scale,dpr()*panZoom.x,dpr()*panZoom.y);
      ctx.drawImage(pg.data,0,0);
      ctx.setTransform(dpr(),0,0,dpr(),0,0);
    }
    updateHUD();
  }

  function snapshotPage(){
    // Capture current strokes layer (without bg/overlay) into an offscreen canvas in world coords.
    // We render strokes directly to cv in world coords, so just take cv pixels and store de-transformed.
    // Simpler: store cv as ImageBitmap (in screen px), and re-render through transform when redrawing.
    // To support pan/zoom undo, store a high-res world-space canvas instead. We'll keep a separate worldCanvas.
  }

  // We'll maintain a single offscreen "world canvas" per page in world coordinates.
  function ensurePageCanvas(idx){
    if(!pages[idx])pages[idx]={data:null};
    if(!pages[idx].world){
      const wc=document.createElement('canvas');
      wc.width=4096;wc.height=4096;
      const wcx=wc.getContext('2d');
      wcx.fillStyle='rgba(0,0,0,0)';
      pages[idx].world=wc;
      pages[idx].wcx=wcx;
    }
  }

  function pushUndo(){
    ensurePageCanvas(currentPage);
    try{
      const w=pages[currentPage].world;
      const snap=document.createElement('canvas');
      snap.width=w.width;snap.height=w.height;
      snap.getContext('2d').drawImage(w,0,0);
      undoStack.push({page:currentPage,canvas:snap});
      if(undoStack.length>50)undoStack.shift();
      redoStack.length=0;
    }catch(e){console.warn('undo snap fail',e);}
  }

  function applySnap(snap){
    if(!snap)return;
    ensurePageCanvas(snap.page);
    currentPage=snap.page;
    const w=pages[currentPage].world;
    pages[currentPage].wcx.clearRect(0,0,w.width,w.height);
    pages[currentPage].wcx.drawImage(snap.canvas,0,0);
    renderPageToView();
  }

  function undo(){
    if(undoStack.length<=1)return;
    redoStack.push(undoStack.pop());
    applySnap(undoStack[undoStack.length-1]);
  }
  function redo(){
    if(!redoStack.length)return;
    const s=redoStack.pop();
    undoStack.push(s);
    applySnap(s);
  }

  function renderPageToView(){
    ctx.setTransform(dpr(),0,0,dpr(),0,0);
    ctx.clearRect(0,0,cv.clientWidth,cv.clientHeight);
    drawBg();
    ensurePageCanvas(currentPage);
    const w=pages[currentPage].world;
    ctx.save();
    ctx.setTransform(dpr()*panZoom.scale,0,0,dpr()*panZoom.scale,dpr()*panZoom.x*dpr()/dpr(),dpr()*panZoom.y*dpr()/dpr());
    // Above line simplified — but we want screen px = world px*scale + offset
    ctx.setTransform(dpr()*panZoom.scale,0,0,dpr()*panZoom.scale,dpr()*panZoom.x,dpr()*panZoom.y);
    ctx.drawImage(w,0,0);
    ctx.restore();
    ctx.setTransform(dpr(),0,0,dpr(),0,0);
    updateHUD();
  }

  function screenToWorld(x,y){
    return {x:(x-panZoom.x)/panZoom.scale, y:(y-panZoom.y)/panZoom.scale};
  }

  function getPos(e){
    const r=wrap.getBoundingClientRect();
    const t=(e.touches&&e.touches[0])?e.touches[0]:e;
    return {x:t.clientX-r.left,y:t.clientY-r.top};
  }

  function start(e){
    e.preventDefault();
    if(e.touches&&e.touches.length===2){
      // Pinch
      isPanning=true;
      pinchInitialDist=touchDist(e.touches);
      pinchInitialScale=panZoom.scale;
      panStart={x:(e.touches[0].clientX+e.touches[1].clientX)/2,y:(e.touches[0].clientY+e.touches[1].clientY)/2};
      panZoomStart={x:panZoom.x,y:panZoom.y};
      pinchCenter=panStart;
      return;
    }
    const sp=getPos(e);
    if(tool==='pan'){
      isPanning=true;
      panStart=sp;
      panZoomStart={x:panZoom.x,y:panZoom.y};
      return;
    }
    if(tool==='text'){
      const wp=screenToWorld(sp.x,sp.y);
      openTextInput(sp.x,sp.y,wp);
      return;
    }
    drawing=true;
    startPt=screenToWorld(sp.x,sp.y);
    lastPt=startPt;
    pushUndo();
    ensurePageCanvas(currentPage);
    if(tool==='pen'||tool==='highlight'||tool==='eraser'){
      const wcx=pages[currentPage].wcx;
      wcx.beginPath();
      wcx.moveTo(startPt.x,startPt.y);
      strokeStart(wcx);
    }
  }

  function strokeStart(wcx){
    if(tool==='eraser'){
      wcx.globalCompositeOperation='destination-out';
      wcx.strokeStyle='rgba(0,0,0,1)';
      wcx.lineWidth=size*3;
    }else if(tool==='highlight'){
      wcx.globalCompositeOperation='multiply';
      wcx.strokeStyle=color;
      wcx.globalAlpha=0.35;
      wcx.lineWidth=size*4;
    }else{
      wcx.globalCompositeOperation='source-over';
      wcx.strokeStyle=color;
      wcx.globalAlpha=1;
      wcx.lineWidth=size;
    }
    wcx.lineCap='round';wcx.lineJoin='round';
  }

  function move(e){
    e.preventDefault();
    if(e.touches&&e.touches.length===2&&isPanning){
      const d=touchDist(e.touches);
      const cx=(e.touches[0].clientX+e.touches[1].clientX)/2;
      const cy=(e.touches[0].clientY+e.touches[1].clientY)/2;
      const newScale=Math.min(8,Math.max(0.2,pinchInitialScale*(d/pinchInitialDist)));
      const r=wrap.getBoundingClientRect();
      const px=cx-r.left, py=cy-r.top;
      // Keep pinch center stationary in world: world_before = (p-x0)/s0 ; world_after = (p-x1)/s1 ; same -> x1 = p - world*s1
      const worldX=(px-panZoom.x)/panZoom.scale;
      const worldY=(py-panZoom.y)/panZoom.scale;
      panZoom.scale=newScale;
      panZoom.x=px-worldX*newScale;
      panZoom.y=py-worldY*newScale;
      renderPageToView();
      return;
    }
    const sp=getPos(e);
    if(isPanning){
      panZoom.x=panZoomStart.x+(sp.x-panStart.x);
      panZoom.y=panZoomStart.y+(sp.y-panStart.y);
      renderPageToView();
      return;
    }
    if(!drawing)return;
    const wp=screenToWorld(sp.x,sp.y);
    ensurePageCanvas(currentPage);
    const wcx=pages[currentPage].wcx;
    if(tool==='pen'||tool==='highlight'||tool==='eraser'){
      wcx.lineTo(wp.x,wp.y);
      wcx.stroke();
      // begin a new path so style updates take effect immediately
      wcx.beginPath();wcx.moveTo(wp.x,wp.y);
      lastPt=wp;
      renderPageToView();
    }else{
      // Shape tools: render preview on overlay
      ovCtx.setTransform(dpr(),0,0,dpr(),0,0);
      ovCtx.clearRect(0,0,ov.clientWidth,ov.clientHeight);
      ovCtx.setTransform(dpr()*panZoom.scale,0,0,dpr()*panZoom.scale,dpr()*panZoom.x,dpr()*panZoom.y);
      ovCtx.strokeStyle=color;ovCtx.lineWidth=size;ovCtx.lineCap='round';ovCtx.fillStyle='rgba(0,0,0,0)';
      const a=startPt,b=wp;
      ovCtx.beginPath();
      if(tool==='line'){ovCtx.moveTo(a.x,a.y);ovCtx.lineTo(b.x,b.y);ovCtx.stroke();}
      else if(tool==='arrow'){drawArrow(ovCtx,a,b);}
      else if(tool==='rect'){ovCtx.rect(a.x,a.y,b.x-a.x,b.y-a.y);ovCtx.stroke();}
      else if(tool==='circle'){const cxp=(a.x+b.x)/2,cyp=(a.y+b.y)/2,rx=Math.abs(b.x-a.x)/2,ry=Math.abs(b.y-a.y)/2;ovCtx.ellipse(cxp,cyp,rx,ry,0,0,7);ovCtx.stroke();}
      else if(tool==='triangle'){ovCtx.moveTo((a.x+b.x)/2,a.y);ovCtx.lineTo(a.x,b.y);ovCtx.lineTo(b.x,b.y);ovCtx.closePath();ovCtx.stroke();}
      ovCtx.setTransform(dpr(),0,0,dpr(),0,0);
    }
  }

  function drawArrow(c,a,b){
    c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();
    const ang=Math.atan2(b.y-a.y,b.x-a.x);
    const head=12+size;
    c.beginPath();
    c.moveTo(b.x,b.y);
    c.lineTo(b.x-head*Math.cos(ang-Math.PI/6),b.y-head*Math.sin(ang-Math.PI/6));
    c.moveTo(b.x,b.y);
    c.lineTo(b.x-head*Math.cos(ang+Math.PI/6),b.y-head*Math.sin(ang+Math.PI/6));
    c.stroke();
  }

  function end(e){
    e.preventDefault();
    if(isPanning){isPanning=false;return;}
    if(!drawing)return;
    drawing=false;
    const sp=getPos(e.changedTouches?{touches:[e.changedTouches[0]]}:e);
    const wp=screenToWorld(sp.x,sp.y);
    ensurePageCanvas(currentPage);
    const wcx=pages[currentPage].wcx;
    if(tool==='pen'||tool==='highlight'||tool==='eraser'){
      wcx.lineTo(wp.x,wp.y);wcx.stroke();
      wcx.globalCompositeOperation='source-over';wcx.globalAlpha=1;
    }else{
      // Commit shape
      wcx.save();
      wcx.strokeStyle=color;wcx.lineWidth=size;wcx.lineCap='round';wcx.fillStyle='rgba(0,0,0,0)';
      const a=startPt,b=wp;
      wcx.beginPath();
      if(tool==='line'){wcx.moveTo(a.x,a.y);wcx.lineTo(b.x,b.y);wcx.stroke();}
      else if(tool==='arrow'){drawArrow(wcx,a,b);}
      else if(tool==='rect'){wcx.rect(a.x,a.y,b.x-a.x,b.y-a.y);wcx.stroke();}
      else if(tool==='circle'){const cxp=(a.x+b.x)/2,cyp=(a.y+b.y)/2,rx=Math.abs(b.x-a.x)/2,ry=Math.abs(b.y-a.y)/2;wcx.ellipse(cxp,cyp,rx,ry,0,0,7);wcx.stroke();}
      else if(tool==='triangle'){wcx.moveTo((a.x+b.x)/2,a.y);wcx.lineTo(a.x,b.y);wcx.lineTo(b.x,b.y);wcx.closePath();wcx.stroke();}
      wcx.restore();
      ovCtx.clearRect(0,0,ov.clientWidth*dpr(),ov.clientHeight*dpr());
    }
    renderPageToView();
  }

  function touchDist(touches){
    const dx=touches[0].clientX-touches[1].clientX;
    const dy=touches[0].clientY-touches[1].clientY;
    return Math.sqrt(dx*dx+dy*dy);
  }

  function setTool(t){
    tool=t;
    document.querySelectorAll('#toolbar button').forEach(b=>b.classList.remove('active'));
    const el=document.getElementById('t-'+t);if(el)el.classList.add('active');
    updateHUD();
  }
  function setBg(b){bgType=b;renderPageToView();}
  function clearPage(){
    if(!confirm('Clear this page?'))return;
    pushUndo();
    ensurePageCanvas(currentPage);
    pages[currentPage].wcx.clearRect(0,0,4096,4096);
    renderPageToView();
  }
  function newPage(){
    pages.push({data:null});
    currentPage=pages.length-1;
    undoStack.length=0;redoStack.length=0;pushUndo();
    panZoom={x:0,y:0,scale:1};
    renderPageToView();
  }
  function nextPage(){if(currentPage<pages.length-1){currentPage++;panZoom={x:0,y:0,scale:1};renderPageToView();}}
  function prevPage(){if(currentPage>0){currentPage--;panZoom={x:0,y:0,scale:1};renderPageToView();}}
  function resetView(){panZoom={x:0,y:0,scale:1};renderPageToView();}
  function zoom(f){
    const r=wrap.getBoundingClientRect();
    const cx=r.width/2,cy=r.height/2;
    const wx=(cx-panZoom.x)/panZoom.scale, wy=(cy-panZoom.y)/panZoom.scale;
    panZoom.scale=Math.min(8,Math.max(0.2,panZoom.scale*f));
    panZoom.x=cx-wx*panZoom.scale; panZoom.y=cy-wy*panZoom.scale;
    renderPageToView();
  }
  function savePNG(){
    ensurePageCanvas(currentPage);
    const out=document.createElement('canvas');
    out.width=2048;out.height=1536;
    const oc=out.getContext('2d');
    oc.fillStyle='#fff';oc.fillRect(0,0,out.width,out.height);
    oc.drawImage(pages[currentPage].world,0,0,out.width,out.height);
    const u=out.toDataURL('image/png');
    const a=document.createElement('a');
    a.href=u;a.download='whiteboard-page-'+(currentPage+1)+'-'+Date.now()+'.png';
    document.body.appendChild(a);a.click();a.remove();
  }
  function toggleMath(){document.getElementById('mathpad').classList.toggle('show');}
  function insertMath(s){
    if(ti.style.display==='block'){ti.value+=s;ti.focus();return;}
    setTool('text');
    const r=wrap.getBoundingClientRect();
    openTextInput(r.width/2,r.height/2,screenToWorld(r.width/2,r.height/2),s);
  }
  function openTextInput(sx,sy,worldPt,initial){
    ti.value=initial||'';
    ti.style.display='block';
    ti.style.left=sx+'px';ti.style.top=sy+'px';
    ti.style.fontSize=Math.max(14,size*5)+'px';
    ti.style.color=color;
    setTimeout(()=>ti.focus(),20);
    ti._world=worldPt;
    ti.onblur=()=>commitText();
    ti.onkeydown=(ev)=>{if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();commitText();}};
  }
  function commitText(){
    const t=ti.value;
    const wp=ti._world;
    ti.style.display='none';ti.value='';
    if(!t||!wp)return;
    pushUndo();
    ensurePageCanvas(currentPage);
    const wcx=pages[currentPage].wcx;
    wcx.save();
    wcx.fillStyle=color;
    wcx.font=Math.max(14,size*5)+'px -apple-system,Segoe UI,Roboto,sans-serif';
    wcx.textBaseline='top';
    t.split('\\n').forEach((line,i)=>{wcx.fillText(line,wp.x,wp.y+i*Math.max(16,size*5+2));});
    wcx.restore();
    renderPageToView();
  }

  function updateHUD(){
    hud.textContent=tool.charAt(0).toUpperCase()+tool.slice(1)+' | '+Math.round(panZoom.scale*100)+'% | Page '+(currentPage+1)+'/'+pages.length;
    document.getElementById('pgInfo').textContent=(currentPage+1)+'/'+pages.length;
  }

  // Wire up
  ov.addEventListener('mousedown',start);
  ov.addEventListener('mousemove',move);
  ov.addEventListener('mouseup',end);
  ov.addEventListener('mouseleave',end);
  ov.addEventListener('touchstart',start,{passive:false});
  ov.addEventListener('touchmove',move,{passive:false});
  ov.addEventListener('touchend',end,{passive:false});
  ov.addEventListener('touchcancel',end,{passive:false});

  document.querySelectorAll('.swatch').forEach(s=>{
    s.addEventListener('click',()=>{
      color=s.dataset.c;
      document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('active'));
      s.classList.add('active');
    });
  });
  sizeInput.addEventListener('input',()=>{size=parseInt(sizeInput.value,10);sizeVal.textContent=size;});

  window.addEventListener('resize',resize);
  window.setTool=setTool;window.setBg=setBg;window.undo=undo;window.redo=redo;
  window.clearPage=clearPage;window.newPage=newPage;window.nextPage=nextPage;window.prevPage=prevPage;
  window.savePNG=savePNG;window.zoom=zoom;window.resetView=resetView;
  window.toggleMath=toggleMath;window.insertMath=insertMath;

  resize();
  pushUndo();
})();
</script>
</body></html>`;

module.exports = WHITEBOARD_HTML;

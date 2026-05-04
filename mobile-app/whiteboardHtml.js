// Tata Class Edge / SMART Notebook-style whiteboard.
// Self-contained, offline, no network. Loaded into a WebView via {{html: WHITEBOARD_HTML}}.
// Layout matches the user's reference image: blue top header, dark bottom toolbar with all
// drawing tools, left page panel with +, right scrollbar + page arrows, color/eraser popup.
const WHITEBOARD_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<title>Whiteboard</title>
<style>
*,*:before,*:after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;width:100%;margin:0;padding:0;background:#e9ecef;color:#222;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;overflow:hidden;overscroll-behavior:none;touch-action:none;user-select:none;-webkit-user-select:none;}
#header{position:absolute;top:0;left:0;right:0;height:42px;background:#1976D2;color:#fff;display:flex;align-items:center;justify-content:flex-start;padding:0 16px;font-weight:700;font-size:14px;letter-spacing:0.5px;box-shadow:0 1px 3px rgba(0,0,0,0.2);z-index:10;}
#header .title{flex:1;}
#header .meta{font-size:11px;font-weight:500;opacity:0.9;}
#stage{position:absolute;top:42px;bottom:120px;left:60px;right:0;background:#fff;border:1px solid #d0d0d0;overflow:hidden;}
#bg-cv,#cv,#ov{position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;}
#bg-cv{z-index:1;}
#cv{z-index:2;}
#ov{z-index:3;pointer-events:none;}
#scrollbar{position:absolute;top:42px;bottom:120px;right:0;width:14px;background:#f0f0f0;border-left:1px solid #d0d0d0;z-index:4;}
#scrollbar .thumb{position:absolute;top:6px;right:2px;width:10px;height:60px;background:#bbb;border-radius:5px;}
#pagepanel{position:absolute;left:0;top:42px;bottom:120px;width:60px;background:#f5f5f5;border-right:1px solid #d0d0d0;display:flex;flex-direction:column-reverse;align-items:center;padding:8px 0;gap:6px;overflow-y:auto;z-index:5;}
#pagepanel::-webkit-scrollbar{width:0;}
#pagepanel .pg{width:42px;height:50px;background:#fff;border:1px solid #c0c0c0;border-radius:3px;color:#333;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;cursor:pointer;}
#pagepanel .pg.active{border:2px solid #1976D2;background:#fff;}
#pagepanel .add{width:42px;height:42px;background:#fff;border:1px dashed #aaa;border-radius:3px;color:#777;font-size:24px;font-weight:300;display:flex;align-items:center;justify-content:center;cursor:pointer;}
#pgnav{position:absolute;bottom:122px;right:18px;display:flex;flex-direction:column;gap:1px;z-index:6;}
#pgnav button{width:22px;height:22px;background:#fff;border:1px solid #c0c0c0;color:#333;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;padding:0;}
#pgnav button:active{background:#e0e0e0;}
#toolbar{position:absolute;left:0;right:0;bottom:0;height:120px;background:#3a3a3a;display:flex;flex-direction:column;align-items:stretch;z-index:7;}
#popup{height:50px;background:#3a3a3a;display:none;align-items:center;justify-content:center;gap:12px;padding:0 16px;}
#popup.show{display:flex;}
#popup .swatch{width:34px;height:34px;border-radius:3px;border:2px solid #555;cursor:pointer;}
#popup .swatch.active{border:3px solid #fff;}
#popup .size{width:34px;height:34px;background:#4a4a4a;border:2px solid #555;border-radius:3px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
#popup .size.active{border-color:#fff;}
#popup .size .dot{background:#fff;border-radius:50%;}
#mathpad{height:50px;background:#3a3a3a;display:none;align-items:center;gap:4px;padding:0 12px;overflow-x:auto;}
#mathpad.show{display:flex;}
#mathpad button{min-width:38px;height:36px;background:#4a4a4a;border:1px solid #5a5a5a;color:#fff;font-size:18px;border-radius:3px;cursor:pointer;flex-shrink:0;}
#mathpad button:active{background:#1976D2;}
#tools{height:60px;background:#2a2a2a;display:flex;align-items:center;justify-content:flex-start;padding:0 6px;gap:2px;overflow-x:auto;-webkit-overflow-scrolling:touch;}
#tools::-webkit-scrollbar{height:4px;}
#tools::-webkit-scrollbar-thumb{background:#555;border-radius:2px;}
#tools button{flex-shrink:0;min-width:42px;height:48px;background:transparent;border:none;color:#fff;font-size:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border-radius:4px;padding:4px;}
#tools button:active{background:#1976D2;}
#tools button.active{background:#1976D2;}
#tools button .ic{font-size:20px;line-height:1;}
#tools button .lb{font-size:9px;line-height:1;opacity:0.85;}
#tools .sep{width:1px;height:36px;background:#555;margin:0 3px;flex-shrink:0;}
#textInput{position:absolute;display:none;background:transparent;border:1px dashed #1976D2;outline:none;font-family:inherit;color:inherit;padding:2px 4px;min-width:60px;z-index:9;}
#shapeMenu{position:absolute;display:none;flex-direction:column;background:#3a3a3a;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.4);padding:4px;z-index:8;}
#shapeMenu button{padding:8px 14px;background:transparent;border:none;color:#fff;font-size:12px;text-align:left;cursor:pointer;border-radius:3px;display:flex;align-items:center;gap:8px;}
#shapeMenu button:active{background:#1976D2;}
#bgMenu{position:absolute;display:none;flex-direction:column;background:#3a3a3a;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.4);padding:4px;z-index:8;min-width:130px;}
#bgMenu button{padding:8px 14px;background:transparent;border:none;color:#fff;font-size:12px;text-align:left;cursor:pointer;border-radius:3px;}
#bgMenu button:active{background:#1976D2;}
.toast{position:absolute;left:50%;top:60px;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:8px 16px;border-radius:6px;font-size:13px;z-index:20;display:none;}
.toast.show{display:block;animation:fade 1.5s forwards;}
@keyframes fade{0%{opacity:0;}10%{opacity:1;}80%{opacity:1;}100%{opacity:0;}}
</style></head>
<body>
<div id="header"><div class="title">WHITEBOARD &nbsp;//&nbsp; Untitled</div><div class="meta" id="meta">Pen · 100% · Page 1</div></div>

<div id="pagepanel">
  <button class="add" id="btn-addpage" title="Add page">+</button>
</div>

<div id="stage">
  <canvas id="bg-cv"></canvas>
  <canvas id="cv"></canvas>
  <canvas id="ov"></canvas>
  <input type="text" id="textInput" />
</div>
<div id="scrollbar"><div class="thumb"></div></div>
<div id="pgnav">
  <button id="pg-up">▲</button>
  <button id="pg-down">▼</button>
  <button id="pg-menu">⌄</button>
</div>

<div id="toolbar">
  <div id="mathpad">
    <button data-m="+">+</button><button data-m="−">−</button><button data-m="×">×</button>
    <button data-m="÷">÷</button><button data-m="=">=</button><button data-m="≠">≠</button>
    <button data-m="≤">≤</button><button data-m="≥">≥</button><button data-m="√">√</button>
    <button data-m="π">π</button><button data-m="∞">∞</button><button data-m="∑">∑</button>
    <button data-m="∫">∫</button><button data-m="θ">θ</button><button data-m="α">α</button>
    <button data-m="β">β</button><button data-m="°">°</button><button data-m="±">±</button>
    <button data-m="²">²</button><button data-m="³">³</button><button data-m="½">½</button>
    <button data-m="¼">¼</button><button data-m="¾">¾</button><button data-m="(">(</button>
    <button data-m=")">)</button>
  </div>

  <div id="popup">
    <div class="swatch" data-color="#000000" style="background:#000000"></div>
    <div class="swatch" data-color="#e53935" style="background:#e53935"></div>
    <div class="swatch" data-color="#43a047" style="background:#43a047"></div>
    <div class="swatch active" data-color="#1e88e5" style="background:#1e88e5"></div>
    <div class="swatch" data-color="#fb8c00" style="background:#fb8c00"></div>
    <div class="size" data-size="2"><div class="dot" style="width:6px;height:6px"></div></div>
    <div class="size active" data-size="6"><div class="dot" style="width:10px;height:10px"></div></div>
    <div class="size" data-size="14"><div class="dot" style="width:16px;height:16px"></div></div>
    <div class="size" data-size="28"><div class="dot" style="width:24px;height:24px"></div></div>
  </div>

  <div id="tools">
    <button id="t-grid" title="Background"><div class="ic">▦</div><div class="lb">Bg</div></button>
    <button id="t-open" title="Open"><div class="ic">📁</div><div class="lb">Open</div></button>
    <button id="t-newpage" title="New page"><div class="ic">▤</div><div class="lb">Page</div></button>
    <div class="sep"></div>
    <button id="t-select" title="Select"><div class="ic">↖</div><div class="lb">Sel</div></button>
    <button id="t-pen" class="active" title="Pen"><div class="ic">✎</div><div class="lb">Pen</div></button>
    <button id="t-marker" title="Highlighter"><div class="ic">🖍</div><div class="lb">Mark</div></button>
    <button id="t-eraser" title="Eraser"><div class="ic">🧽</div><div class="lb">Eraser</div></button>
    <button id="t-shapes" title="Shapes"><div class="ic">◯</div><div class="lb">Shape</div></button>
    <button id="t-ruler" title="Ruler"><div class="ic">📐</div><div class="lb">Ruler</div></button>
    <button id="t-line" title="Line"><div class="ic">／</div><div class="lb">Line</div></button>
    <button id="t-text" title="Text"><div class="ic">T¹</div><div class="lb">Text</div></button>
    <button id="t-math" title="Math"><div class="ic">∑</div><div class="lb">Math</div></button>
    <button id="t-crop" title="Crop"><div class="ic">⌗</div><div class="lb">Crop</div></button>
    <button id="t-image" title="Image"><div class="ic">🖼</div><div class="lb">Image</div></button>
    <div class="sep"></div>
    <button id="t-undo" title="Undo"><div class="ic">⟲</div><div class="lb">Undo</div></button>
    <button id="t-redo" title="Redo"><div class="ic">⟳</div><div class="lb">Redo</div></button>
    <button id="t-reset" title="Reset"><div class="ic">↻</div><div class="lb">Reset</div></button>
    <button id="t-mirror" title="Fit"><div class="ic">⛶</div><div class="lb">Fit</div></button>
    <button id="t-save" title="Save PNG"><div class="ic">💾</div><div class="lb">Save</div></button>
    <button id="t-clear" title="Clear page"><div class="ic">🗑</div><div class="lb">Clear</div></button>
  </div>
</div>

<div id="shapeMenu"></div>
<div id="bgMenu"></div>
<div class="toast" id="toast"></div>

<script>
(function(){
  const stage=document.getElementById('stage');
  const bgCv=document.getElementById('bg-cv'); const bgCtx=bgCv.getContext('2d');
  const cv=document.getElementById('cv'); const ctx=cv.getContext('2d',{willReadFrequently:true});
  const ov=document.getElementById('ov'); const ovCtx=ov.getContext('2d');
  const meta=document.getElementById('meta');
  const popup=document.getElementById('popup');
  const mathpad=document.getElementById('mathpad');
  const ti=document.getElementById('textInput');
  const shapeMenu=document.getElementById('shapeMenu');
  const bgMenu=document.getElementById('bgMenu');
  const toastEl=document.getElementById('toast');

  function showToast(t){toastEl.textContent=t;toastEl.classList.remove('show');void toastEl.offsetWidth;toastEl.classList.add('show');}

  let dpr=window.devicePixelRatio||1;
  let tool='pen', color='#1e88e5', size=6, bgType='white';
  let panZoom={x:0,y:0,scale:1};
  let drawing=false, lastPt=null, startPt=null, currentStroke=null;
  let pages=[]; let pageIdx=0;
  // Each page: {strokes:[], undo:[], redo:[], bgType:'white'}

  function newPage(){return {strokes:[], undo:[], redo:[], bgType:'white'};}
  pages.push(newPage());

  function fitCanvas(){
    const r=stage.getBoundingClientRect();
    [bgCv,cv,ov].forEach(c=>{
      c.width=Math.floor(r.width*dpr); c.height=Math.floor(r.height*dpr);
      c.style.width=r.width+'px'; c.style.height=r.height+'px';
    });
    redraw(); drawBg();
  }
  window.addEventListener('resize',fitCanvas);

  function drawBg(){
    const w=bgCv.width, h=bgCv.height;
    bgCtx.setTransform(1,0,0,1,0,0); bgCtx.clearRect(0,0,w,h);
    const t=pages[pageIdx].bgType||'white';
    if(t==='dark'){ bgCtx.fillStyle='#1a1f2e'; bgCtx.fillRect(0,0,w,h); }
    else { bgCtx.fillStyle='#ffffff'; bgCtx.fillRect(0,0,w,h); }
    if(t==='grid'||t==='dot'||t==='lined'){
      bgCtx.strokeStyle=t==='dark'?'#2a3144':'#e0e6ee';
      bgCtx.lineWidth=1*dpr;
      const step=24*dpr*panZoom.scale;
      const offX=(panZoom.x*dpr)%step, offY=(panZoom.y*dpr)%step;
      bgCtx.beginPath();
      if(t==='grid'){
        for(let x=offX;x<w;x+=step){bgCtx.moveTo(x,0);bgCtx.lineTo(x,h);}
        for(let y=offY;y<h;y+=step){bgCtx.moveTo(0,y);bgCtx.lineTo(w,y);}
        bgCtx.stroke();
      } else if(t==='lined'){
        for(let y=offY;y<h;y+=step){bgCtx.moveTo(0,y);bgCtx.lineTo(w,y);}
        bgCtx.stroke();
      } else { // dot
        bgCtx.fillStyle='#bbc6d4';
        for(let x=offX;x<w;x+=step) for(let y=offY;y<h;y+=step){bgCtx.beginPath();bgCtx.arc(x,y,1.2*dpr,0,Math.PI*2);bgCtx.fill();}
      }
    }
  }

  function applyTransform(c){c.setTransform(panZoom.scale*dpr,0,0,panZoom.scale*dpr,panZoom.x*dpr,panZoom.y*dpr);}

  function strokePath(c,s){
    c.lineCap='round'; c.lineJoin='round';
    c.strokeStyle=s.color; c.lineWidth=s.size;
    c.globalAlpha=s.alpha||1;
    if(s.type==='erase'){ c.globalCompositeOperation='destination-out'; c.strokeStyle='#000'; }
    else c.globalCompositeOperation='source-over';
    if(s.type==='free'||s.type==='erase'||s.type==='hi'){
      const p=s.points; if(!p||p.length<2)return;
      c.beginPath(); c.moveTo(p[0].x,p[0].y);
      for(let i=1;i<p.length;i++)c.lineTo(p[i].x,p[i].y);
      c.stroke();
    } else if(s.type==='line'){
      c.beginPath(); c.moveTo(s.a.x,s.a.y); c.lineTo(s.b.x,s.b.y); c.stroke();
    } else if(s.type==='arrow'){
      c.beginPath(); c.moveTo(s.a.x,s.a.y); c.lineTo(s.b.x,s.b.y); c.stroke();
      const ang=Math.atan2(s.b.y-s.a.y,s.b.x-s.a.x), head=10+s.size;
      c.beginPath();
      c.moveTo(s.b.x,s.b.y);
      c.lineTo(s.b.x-head*Math.cos(ang-Math.PI/6),s.b.y-head*Math.sin(ang-Math.PI/6));
      c.moveTo(s.b.x,s.b.y);
      c.lineTo(s.b.x-head*Math.cos(ang+Math.PI/6),s.b.y-head*Math.sin(ang+Math.PI/6));
      c.stroke();
    } else if(s.type==='rect'){
      c.beginPath(); c.rect(s.a.x,s.a.y,s.b.x-s.a.x,s.b.y-s.a.y); c.stroke();
    } else if(s.type==='circle'){
      const cx=(s.a.x+s.b.x)/2, cy=(s.a.y+s.b.y)/2, rx=Math.abs(s.b.x-s.a.x)/2, ry=Math.abs(s.b.y-s.a.y)/2;
      c.beginPath(); c.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); c.stroke();
    } else if(s.type==='triangle'){
      c.beginPath(); c.moveTo((s.a.x+s.b.x)/2,s.a.y);
      c.lineTo(s.a.x,s.b.y); c.lineTo(s.b.x,s.b.y); c.closePath(); c.stroke();
    } else if(s.type==='text'){
      c.fillStyle=s.color; c.globalCompositeOperation='source-over';
      c.font=s.font; c.textBaseline='top'; c.fillText(s.text,s.a.x,s.a.y);
    }
    c.globalAlpha=1; c.globalCompositeOperation='source-over';
  }

  function redraw(){
    ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,cv.width,cv.height);
    applyTransform(ctx);
    for(const s of pages[pageIdx].strokes) strokePath(ctx,s);
  }

  function clearOv(){ovCtx.setTransform(1,0,0,1,0,0); ovCtx.clearRect(0,0,ov.width,ov.height);}

  function getPt(e){
    const r=stage.getBoundingClientRect();
    const t=e.touches?e.touches[0]:e;
    const sx=t.clientX-r.left, sy=t.clientY-r.top;
    return {sx,sy,x:(sx-panZoom.x)/panZoom.scale,y:(sy-panZoom.y)/panZoom.scale};
  }

  let pinchDist=0, pinchCenter=null, twoFinger=false;
  cv.addEventListener('touchstart',onStart,{passive:false});
  cv.addEventListener('touchmove',onMove,{passive:false});
  cv.addEventListener('touchend',onEnd,{passive:false});
  cv.addEventListener('mousedown',onStart);
  cv.addEventListener('mousemove',onMove);
  cv.addEventListener('mouseup',onEnd);
  cv.addEventListener('mouseleave',onEnd);
  cv.addEventListener('wheel',(e)=>{
    e.preventDefault();
    const factor=e.deltaY<0?1.1:0.9;
    const r=stage.getBoundingClientRect();
    const mx=e.clientX-r.left, my=e.clientY-r.top;
    const wx=(mx-panZoom.x)/panZoom.scale, wy=(my-panZoom.y)/panZoom.scale;
    panZoom.scale=Math.max(0.2,Math.min(8,panZoom.scale*factor));
    panZoom.x=mx-wx*panZoom.scale; panZoom.y=my-wy*panZoom.scale;
    drawBg(); redraw(); updateMeta();
  },{passive:false});

  function onStart(e){
    e.preventDefault();
    if(e.touches && e.touches.length===2){
      twoFinger=true; drawing=false;
      const a=e.touches[0], b=e.touches[1];
      pinchDist=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
      pinchCenter={x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2};
      return;
    }
    twoFinger=false;
    const p=getPt(e);
    if(tool==='select'||tool==='pan'){
      drawing=true; lastPt={sx:p.sx,sy:p.sy};
      return;
    }
    if(tool==='text'){
      openTextInput(p);
      return;
    }
    drawing=true; startPt=p; lastPt=p;
    if(tool==='pen'){
      currentStroke={type:'free',color,size,points:[{x:p.x,y:p.y}]};
    } else if(tool==='marker'){
      currentStroke={type:'hi',color,size:size*3,alpha:0.35,points:[{x:p.x,y:p.y}]};
    } else if(tool==='eraser'){
      currentStroke={type:'erase',color:'#000',size:size*3,points:[{x:p.x,y:p.y}]};
    } else if(['line','arrow','rect','circle','triangle'].indexOf(tool)>=0){
      currentStroke={type:tool,color,size,a:{x:p.x,y:p.y},b:{x:p.x,y:p.y}};
    }
  }

  function onMove(e){
    e.preventDefault();
    if(twoFinger && e.touches && e.touches.length===2){
      const a=e.touches[0], b=e.touches[1];
      const d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
      const c={x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2};
      const r=stage.getBoundingClientRect();
      const mx=c.x-r.left, my=c.y-r.top;
      const wx=(mx-panZoom.x)/panZoom.scale, wy=(my-panZoom.y)/panZoom.scale;
      panZoom.scale=Math.max(0.2,Math.min(8,panZoom.scale*(d/pinchDist)));
      panZoom.x=mx-wx*panZoom.scale + (c.x-pinchCenter.x);
      panZoom.y=my-wy*panZoom.scale + (c.y-pinchCenter.y);
      pinchDist=d; pinchCenter=c;
      drawBg(); redraw(); updateMeta();
      return;
    }
    if(!drawing) return;
    const p=getPt(e);
    if(tool==='select'||tool==='pan'){
      panZoom.x+=p.sx-lastPt.sx; panZoom.y+=p.sy-lastPt.sy;
      lastPt={sx:p.sx,sy:p.sy};
      drawBg(); redraw(); return;
    }
    if(currentStroke){
      if(['free','hi','erase'].indexOf(currentStroke.type)>=0){
        currentStroke.points.push({x:p.x,y:p.y});
      } else {
        currentStroke.b={x:p.x,y:p.y};
      }
      // Live preview on overlay, transformed
      clearOv();
      applyTransform(ovCtx);
      strokePath(ovCtx,currentStroke);
      ovCtx.setTransform(1,0,0,1,0,0);
    }
  }

  function onEnd(e){
    if(twoFinger){ if(!e.touches || e.touches.length<2) twoFinger=false; return; }
    if(!drawing) return;
    drawing=false;
    if(currentStroke){
      pages[pageIdx].undo.push({op:'add'});
      pages[pageIdx].strokes.push(currentStroke);
      pages[pageIdx].redo.length=0;
      currentStroke=null;
      clearOv(); redraw();
    }
  }

  // Text input
  function openTextInput(p){
    ti.value=''; ti.style.display='block';
    ti.style.left=(60+p.sx)+'px';
    ti.style.top=(42+p.sy)+'px';
    ti.style.fontSize=Math.max(14,size*3)+'px';
    ti.style.color=color;
    ti._wp={x:p.x,y:p.y,fontPx:Math.max(14,size*3)};
    setTimeout(()=>ti.focus(),20);
  }
  ti.addEventListener('blur',commitText);
  ti.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); commitText(); }
    if(e.key==='Escape'){ ti.value=''; ti.style.display='none'; }
  });
  function commitText(){
    if(ti.style.display==='none') return;
    const txt=ti.value.trim();
    ti.style.display='none';
    if(!txt||!ti._wp) return;
    const stroke={type:'text',text:txt,color,a:{x:ti._wp.x,y:ti._wp.y},
      font:ti._wp.fontPx+'px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',size};
    pages[pageIdx].undo.push({op:'add'});
    pages[pageIdx].strokes.push(stroke);
    pages[pageIdx].redo.length=0;
    redraw();
  }

  // Tools
  function setTool(t,btn){
    tool=t;
    ['t-select','t-pen','t-marker','t-eraser','t-shapes','t-line','t-text','t-math','t-image','t-ruler','t-crop'].forEach(id=>{
      const b=document.getElementById(id); if(b) b.classList.remove('active');
    });
    if(btn) btn.classList.add('active');
    const wantPopup=['pen','marker','eraser','line','arrow','rect','circle','triangle'].indexOf(t)>=0;
    popup.classList.toggle('show',wantPopup);
    mathpad.classList.toggle('show',t==='math'||t==='text');
    updateMeta();
  }
  document.getElementById('t-select').onclick=function(){setTool('select',this);};
  document.getElementById('t-pen').onclick=function(){setTool('pen',this);};
  document.getElementById('t-marker').onclick=function(){setTool('marker',this);};
  document.getElementById('t-eraser').onclick=function(){setTool('eraser',this);};
  document.getElementById('t-line').onclick=function(){setTool('line',this);};
  document.getElementById('t-text').onclick=function(){setTool('text',this);};
  document.getElementById('t-math').onclick=function(){setTool('math',document.getElementById('t-math'));};
  document.getElementById('t-ruler').onclick=function(){showToast('Ruler — drag to draw straight lines');setTool('line',document.getElementById('t-line'));};
  document.getElementById('t-crop').onclick=function(){showToast('Crop coming soon');};
  document.getElementById('t-image').onclick=function(){
    const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
    inp.onchange=ev=>{
      const f=ev.target.files[0]; if(!f) return;
      const fr=new FileReader();
      fr.onload=function(r){
        const img=new Image();
        img.onload=function(){
          const cx=(stage.clientWidth/2-panZoom.x)/panZoom.scale;
          const cy=(stage.clientHeight/2-panZoom.y)/panZoom.scale;
          const w=Math.min(img.width,300), h=img.height*(w/img.width);
          const stk={type:'image',img,a:{x:cx-w/2,y:cy-h/2},w,h};
          // simple image renderer
          stk._draw=function(c){c.drawImage(img,this.a.x,this.a.y,this.w,this.h);};
          // Embed as data URL into a text-like stroke we can re-draw (here, draw immediately + push a "free" no-op):
          pages[pageIdx].undo.push({op:'add'});
          pages[pageIdx].strokes.push({type:'image',src:r.target.result,x:stk.a.x,y:stk.a.y,w,h});
          pages[pageIdx].redo.length=0;
          redraw();
        };
        img.src=r.target.result;
      };
      fr.readAsDataURL(f);
    };
    inp.click();
  };

  // Override strokePath to also handle image
  const origStrokePath=strokePath;
  strokePath=function(c,s){
    if(s.type==='image'){
      if(!s._cached){ s._cached=new Image(); s._cached.src=s.src; }
      try{ c.drawImage(s._cached,s.x,s.y,s.w,s.h); }catch(e){}
      return;
    }
    origStrokePath(c,s);
  };

  // Shapes menu
  const shapesList=[['line','／  Line'],['arrow','➜  Arrow'],['rect','▭  Rectangle'],['circle','○  Circle'],['triangle','△  Triangle']];
  shapeMenu.innerHTML=shapesList.map(([k,l])=>'<button data-shape="'+k+'">'+l+'</button>').join('');
  document.getElementById('t-shapes').onclick=function(e){
    const r=this.getBoundingClientRect();
    shapeMenu.style.display=shapeMenu.style.display==='flex'?'none':'flex';
    shapeMenu.style.left=r.left+'px';
    shapeMenu.style.bottom=(window.innerHeight-r.top+4)+'px';
  };
  shapeMenu.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    setTool(b.dataset.shape,document.getElementById('t-shapes'));
    shapeMenu.style.display='none';
  });

  // Background menu
  const bgList=[['white','White'],['grid','Grid'],['dot','Dot'],['lined','Lined'],['dark','Dark']];
  bgMenu.innerHTML=bgList.map(([k,l])=>'<button data-bg="'+k+'">'+l+'</button>').join('');
  document.getElementById('t-grid').onclick=function(){
    const r=this.getBoundingClientRect();
    bgMenu.style.display=bgMenu.style.display==='flex'?'none':'flex';
    bgMenu.style.left=r.left+'px';
    bgMenu.style.bottom=(window.innerHeight-r.top+4)+'px';
  };
  bgMenu.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    pages[pageIdx].bgType=b.dataset.bg; bgMenu.style.display='none'; drawBg();
  });

  // Undo / redo / clear / reset / save
  document.getElementById('t-undo').onclick=function(){
    const pg=pages[pageIdx]; if(pg.strokes.length===0) return;
    const last=pg.strokes.pop(); pg.redo.push(last); redraw();
  };
  document.getElementById('t-redo').onclick=function(){
    const pg=pages[pageIdx]; if(pg.redo.length===0) return;
    pg.strokes.push(pg.redo.pop()); redraw();
  };
  document.getElementById('t-clear').onclick=function(){
    pages[pageIdx].strokes.length=0; pages[pageIdx].redo.length=0; redraw();
  };
  document.getElementById('t-reset').onclick=function(){
    panZoom={x:0,y:0,scale:1}; drawBg(); redraw(); updateMeta();
  };
  document.getElementById('t-mirror').onclick=function(){
    panZoom={x:0,y:0,scale:1}; drawBg(); redraw(); updateMeta();
  };
  document.getElementById('t-save').onclick=function(){
    // Render to a single offscreen canvas: bg + drawings
    const off=document.createElement('canvas');
    off.width=cv.width; off.height=cv.height;
    const oc=off.getContext('2d');
    oc.drawImage(bgCv,0,0); oc.drawImage(cv,0,0);
    const url=off.toDataURL('image/png');
    const a=document.createElement('a'); a.href=url; a.download='whiteboard-page'+(pageIdx+1)+'.png'; a.click();
    showToast('Saved page as PNG');
  };
  document.getElementById('t-open').onclick=function(){showToast('Open file coming soon');};
  document.getElementById('t-newpage').onclick=function(){addPage();};

  // Math pad
  mathpad.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    const sym=b.dataset.m;
    if(ti.style.display==='block'){ ti.value+=sym; ti.focus(); return; }
    // place as text at center of stage
    const p={x:(stage.clientWidth/2-panZoom.x)/panZoom.scale,y:(stage.clientHeight/2-panZoom.y)/panZoom.scale,sx:stage.clientWidth/2,sy:stage.clientHeight/2};
    openTextInput(p); setTimeout(()=>{ti.value=sym;},30);
  });

  // Color/size popup
  popup.addEventListener('click',e=>{
    const sw=e.target.closest('.swatch');
    if(sw){ color=sw.dataset.color; popup.querySelectorAll('.swatch').forEach(x=>x.classList.remove('active')); sw.classList.add('active'); updateMeta(); return; }
    const sz=e.target.closest('.size');
    if(sz){ size=parseInt(sz.dataset.size,10); popup.querySelectorAll('.size').forEach(x=>x.classList.remove('active')); sz.classList.add('active'); updateMeta(); }
  });

  // Pages
  function renderPagePanel(){
    const panel=document.getElementById('pagepanel');
    [...panel.querySelectorAll('.pg')].forEach(n=>n.remove());
    pages.forEach((_,i)=>{
      const b=document.createElement('button');
      b.className='pg'+(i===pageIdx?' active':'');
      b.textContent=(i+1);
      b.onclick=()=>{pageIdx=i; renderPagePanel(); drawBg(); redraw(); updateMeta();};
      panel.appendChild(b);
    });
  }
  function addPage(){ pages.push(newPage()); pageIdx=pages.length-1; renderPagePanel(); drawBg(); redraw(); updateMeta(); }
  document.getElementById('btn-addpage').onclick=addPage;
  document.getElementById('pg-up').onclick=function(){if(pageIdx>0){pageIdx--;renderPagePanel();drawBg();redraw();updateMeta();}};
  document.getElementById('pg-down').onclick=function(){if(pageIdx<pages.length-1){pageIdx++;renderPagePanel();drawBg();redraw();updateMeta();}else addPage();};
  document.getElementById('pg-menu').onclick=function(){showToast('Page '+(pageIdx+1)+' of '+pages.length);};

  function updateMeta(){
    const labels={pen:'Pen',marker:'Highlighter',eraser:'Eraser',line:'Line',arrow:'Arrow',rect:'Rectangle',circle:'Circle',triangle:'Triangle',text:'Text',select:'Select',math:'Math',pan:'Pan'};
    meta.textContent=(labels[tool]||tool)+' · '+Math.round(panZoom.scale*100)+'% · Page '+(pageIdx+1)+'/'+pages.length;
  }

  // init
  fitCanvas(); renderPagePanel(); updateMeta();
  setTimeout(fitCanvas,100);
})();
</script>
</body></html>`;

module.exports = WHITEBOARD_HTML;

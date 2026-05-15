// Self-contained, native-looking in-app call UI for the APK.
// Bundled HTML — no website redirect, no app shell. Renders just the call:
// dark fullscreen background, remote video, local PIP, mute / camera / end
// buttons. Uses the WebView's WebRTC engine (Android System WebView) to
// negotiate the call against the backend's signaling API, so the actual
// audio/video flows peer-to-peer (with TURN relay fallback).
//
// URL params (set by App.js when opening the WebView):
//   token        - student's auth JWT
//   mode         - 'call' (outgoing) or 'answer' (incoming)
//   peerUserId   - admin's user id (for both directions; admin is id=1 for now,
//                  but APK passes whatever id signalled the call)
//   callType     - 'audio' or 'video'
//   callerName   - display name shown on the call screen
//   callId       - opaque call id (forwarded back in answer body)
//   apiUrl       - backend base URL

function buildCallHtml(params) {
  const safe = (s) => String(s == null ? '' : s).replace(/[<>"'&]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'})[c]);
  const apiUrl = params.apiUrl || 'https://app-lmanxcts.fly.dev';
  const token = params.token || '';
  const mode = params.mode === 'answer' ? 'answer' : 'call';
  const peerUserId = String(params.peerUserId || params.targetUserId || params.callerId || '');
  const callType = params.callType === 'video' ? 'video' : 'audio';
  const callerName = params.callerName || (callType === 'video' ? 'Video Call' : 'Voice Call');
  const callId = params.callId || '';

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="theme-color" content="#000000">
<title>${safe(callerName)}</title>
<style>
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
  html, body { margin: 0; padding: 0; height: 100vh; width: 100vw; background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
  .stage { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .remote-video {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: #0a0a14;
  }
  .audio-pulse {
    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, #1f2257 0%, #0a0a14 100%);
  }
  .avatar {
    width: 140px; height: 140px; border-radius: 50%;
    background: linear-gradient(135deg, #00d4ff, #ff00ff);
    display: flex; align-items: center; justify-content: center;
    font-size: 64px; font-weight: 800; color: #fff;
    box-shadow: 0 0 80px rgba(0, 212, 255, 0.5);
    animation: pulse 2.4s ease-in-out infinite;
    margin-bottom: 30px;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(0, 212, 255, 0.5); }
    50%      { transform: scale(1.05); box-shadow: 0 0 100px rgba(255, 0, 255, 0.7); }
  }
  .caller-name { font-size: 1.6em; font-weight: 700; margin-bottom: 6px; text-shadow: 0 2px 12px rgba(0,0,0,0.8); }
  .call-status { font-size: 1.0em; color: rgba(255,255,255,0.75); letter-spacing: 0.3px; }
  .topbar {
    position: absolute; top: 0; left: 0; right: 0; padding: 18px 18px 8px;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    background: linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0));
    pointer-events: none; text-align: center;
  }
  .topbar .name { font-size: 1.15em; font-weight: 700; }
  .topbar .state { font-size: 0.85em; color: rgba(255,255,255,0.75); }
  .topbar .timer { font-size: 0.9em; color: #4ade80; font-weight: 700; }
  .local-video {
    position: absolute; top: 90px; right: 18px;
    width: 110px; height: 150px; border-radius: 12px; object-fit: cover;
    background: #111; border: 2px solid rgba(255,255,255,0.25);
    box-shadow: 0 6px 18px rgba(0,0,0,0.6); z-index: 5;
  }
  .controls {
    position: absolute; left: 0; right: 0; bottom: 30px;
    display: flex; align-items: center; justify-content: center; gap: 18px;
    padding: 14px 12px; z-index: 6;
  }
  .ctrl {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(255,255,255,0.16);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; cursor: pointer; color: #fff;
    transition: transform 0.1s ease, background 0.15s ease;
  }
  .ctrl:active { transform: scale(0.92); }
  .ctrl.muted { background: #fff; color: #111; }
  .ctrl.end {
    width: 76px; height: 76px; background: #ef4444; box-shadow: 0 8px 24px rgba(239,68,68,0.5);
  }
  .ctrl.end:active { background: #dc2626; }
  .hidden { display: none !important; }
  .error-banner {
    position: absolute; left: 16px; right: 16px; top: 100px;
    background: rgba(239,68,68,0.92); color: #fff; padding: 10px 14px; border-radius: 12px;
    font-size: 0.9em; line-height: 1.3; text-align: center; z-index: 9;
  }
</style>
</head>
<body>
<div class="stage">
  <video id="remoteVideo" class="remote-video ${callType === 'audio' ? 'hidden' : ''}" autoplay playsinline></video>
  <div id="audioPulse" class="audio-pulse ${callType === 'video' ? 'hidden' : ''}">
    <div class="avatar">${safe((callerName || 'A').charAt(0).toUpperCase())}</div>
    <div class="caller-name">${safe(callerName)}</div>
    <div id="audioStatus" class="call-status">Connecting…</div>
  </div>
  <div class="topbar">
    <div class="name">${safe(callerName)}</div>
    <div id="state" class="state">Connecting…</div>
    <div id="timer" class="timer hidden">00:00</div>
  </div>
  <video id="localVideo" class="local-video ${callType === 'audio' ? 'hidden' : ''}" autoplay playsinline muted></video>
  <div id="errorBanner" class="error-banner hidden"></div>
  <div class="controls">
    <div class="ctrl" id="muteBtn" title="Mute mic">🎙️</div>
    <div class="ctrl ${callType === 'audio' ? 'hidden' : ''}" id="camBtn" title="Toggle camera">📷</div>
    <div class="ctrl ${callType === 'audio' ? 'hidden' : ''}" id="flipBtn" title="Flip camera">🔄</div>
    <div class="ctrl end" id="endBtn" title="End call">📞</div>
  </div>
</div>

<script>
(function(){
  var API_URL   = ${JSON.stringify(apiUrl)};
  var TOKEN     = ${JSON.stringify(token)};
  var MODE      = ${JSON.stringify(mode)};
  var PEER_ID   = ${JSON.stringify(peerUserId)};
  var CALL_TYPE = ${JSON.stringify(callType)};
  var CALL_ID   = ${JSON.stringify(callId)};

  var stateEl       = document.getElementById('state');
  var audioStatusEl = document.getElementById('audioStatus');
  var timerEl       = document.getElementById('timer');
  var remoteVideo   = document.getElementById('remoteVideo');
  var localVideo    = document.getElementById('localVideo');
  var muteBtn       = document.getElementById('muteBtn');
  var camBtn        = document.getElementById('camBtn');
  var flipBtn       = document.getElementById('flipBtn');
  var endBtn        = document.getElementById('endBtn');
  var errorBanner   = document.getElementById('errorBanner');

  var localStream  = null;
  var remoteStream = null;
  var pc           = null;
  var ws           = null;
  var iceServers   = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ];
  var iceCandQueue = [];
  var remoteSet    = false;
  var callStartedAt = 0;
  var timerInterval = null;
  var ended        = false;
  var muted        = false;
  var camOff       = false;
  var currentFacing = 'user';

  function setState(s) {
    if (stateEl) stateEl.textContent = s;
    if (audioStatusEl) audioStatusEl.textContent = s;
  }
  function showError(msg) {
    errorBanner.textContent = msg;
    errorBanner.classList.remove('hidden');
    setTimeout(function(){ try { errorBanner.classList.add('hidden'); } catch(_){} }, 6000);
  }
  function startTimer() {
    if (timerInterval) return;
    callStartedAt = Date.now();
    timerEl.classList.remove('hidden');
    timerInterval = setInterval(function() {
      var s = Math.floor((Date.now() - callStartedAt) / 1000);
      var mm = String(Math.floor(s/60)).padStart(2,'0');
      var ss = String(s%60).padStart(2,'0');
      timerEl.textContent = mm + ':' + ss;
    }, 1000);
  }

  function postBackend(path, body) {
    return fetch(API_URL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
      body: JSON.stringify(body)
    });
  }
  function getBackend(path) {
    return fetch(API_URL + path, { headers: { 'Authorization': 'Bearer ' + TOKEN } });
  }

  function loadIceServers() {
    return fetch(API_URL + '/api/ice-servers').then(function(r){return r.json();}).then(function(data){
      if (data && data.ice_servers && data.ice_servers.length) iceServers = data.ice_servers;
    }).catch(function(){});
  }

  function connectWS() {
    try {
      var wsUrl = API_URL.replace(/^http/, 'ws') + '/ws/signaling?token=' + encodeURIComponent(TOKEN);
      ws = new WebSocket(wsUrl);
      ws.onopen = function(){ /* connected */ };
      ws.onmessage = function(ev) {
        try {
          var m = JSON.parse(ev.data);
          if (m.type === 'answer' && m.sdp && pc) {
            if (!remoteSet) {
              pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: m.sdp }))
                .then(function(){ remoteSet = true; drainCandidates(); })
                .catch(function(e){ console.log('setRemote (answer) failed', e); });
            }
          } else if (m.type === 'ice_candidate' && m.candidate && pc) {
            var cand = new RTCIceCandidate({ candidate: m.candidate, sdpMid: m.sdp_mid, sdpMLineIndex: m.sdp_m_line_index });
            if (remoteSet) { pc.addIceCandidate(cand).catch(function(){}); }
            else { iceCandQueue.push(cand); }
          } else if (m.type === 'call_ended' || m.type === 'hangup') {
            endCall();
          }
        } catch (_) {}
      };
      ws.onerror = function(){};
      ws.onclose = function(){};
    } catch(_) {}
  }

  function wsSend(type, body) {
    try {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify(Object.assign({ type: type, to_user_id: PEER_ID }, body)));
        return true;
      }
    } catch(_) {}
    return false;
  }

  function drainCandidates() {
    while (iceCandQueue.length && pc && remoteSet) {
      var c = iceCandQueue.shift();
      try { pc.addIceCandidate(c); } catch(_){}
    }
  }

  function endCall() {
    if (ended) return; ended = true;
    setState('Call ended');
    try { if (timerInterval) clearInterval(timerInterval); } catch(_){}
    try { if (localStream) localStream.getTracks().forEach(function(t){ t.stop(); }); } catch(_){}
    try { if (pc) pc.close(); } catch(_){}
    try { if (ws) ws.close(); } catch(_){}
    // Notify backend / peer
    try { postBackend('/api/webrtc/end-call', { peer_user_id: parseInt(PEER_ID), call_id: CALL_ID }).catch(function(){}); } catch(_){}
    try { wsSend('hangup', { call_id: CALL_ID }); } catch(_){}
    // Tell native shell to close the WebView
    try {
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'call_ended' }));
    } catch(_){}
  }

  async function getMedia() {
    var constraints = CALL_TYPE === 'video'
      ? { audio: true, video: { facingMode: currentFacing, width: { ideal: 640 }, height: { ideal: 480 } } }
      : { audio: true, video: false };
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (CALL_TYPE === 'video') {
      localVideo.srcObject = localStream;
    }
  }

  function buildPC() {
    pc = new RTCPeerConnection({ iceServers: iceServers, iceCandidatePoolSize: 10 });
    localStream.getTracks().forEach(function(t){ pc.addTrack(t, localStream); });
    pc.ontrack = function(ev) {
      remoteStream = ev.streams[0];
      remoteVideo.srcObject = remoteStream;
      // Even for audio calls, we attach the audio track to the (hidden) remote
      // video element so it plays through speakers.
      if (CALL_TYPE === 'audio') {
        remoteVideo.classList.remove('hidden');
        remoteVideo.style.opacity = '0';
      }
    };
    pc.onicecandidate = function(ev) {
      if (!ev.candidate) return;
      var c = ev.candidate;
      var sent = wsSend('ice_candidate', {
        candidate: c.candidate, sdp_mid: c.sdpMid, sdp_m_line_index: c.sdpMLineIndex
      });
      if (!sent) {
        postBackend('/api/webrtc/ice-candidate', {
          peer_user_id: parseInt(PEER_ID),
          candidate: c.candidate, sdp_mid: c.sdpMid, sdp_m_line_index: c.sdpMLineIndex
        }).catch(function(){});
      }
    };
    pc.onconnectionstatechange = function() {
      var s = pc.connectionState;
      if (s === 'connected') { setState('Connected'); startTimer(); }
      else if (s === 'failed') { setState('Connection failed'); showError('Connection failed — please try again.'); }
      else if (s === 'disconnected') { setState('Reconnecting…'); }
    };
    pc.oniceconnectionstatechange = function() {
      if (pc.iceConnectionState === 'failed') { try { pc.restartIce(); } catch(_){} }
    };
  }

  async function placeOutgoing() {
    setState('Calling…');
    await getMedia();
    buildPC();
    var offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: CALL_TYPE === 'video' });
    await pc.setLocalDescription(offer);
    connectWS();
    var resp = await postBackend('/api/webrtc/offer', {
      target_user_id: parseInt(PEER_ID),
      sdp: pc.localDescription.sdp,
      call_type: CALL_TYPE
    });
    var data = await resp.json().catch(function(){return {};});
    if (data && data.call_id) CALL_ID = data.call_id;
  }

  async function answerIncoming() {
    setState('Connecting…');
    await getMedia();
    buildPC();
    connectWS();
    var pending = await getBackend('/api/webrtc/pending-calls').then(function(r){return r.json();}).catch(function(){return {};});
    var offerSdp = null;
    if (pending && pending.pending_calls && pending.pending_calls.length) {
      var first = pending.pending_calls[0];
      offerSdp = first.sdp;
      if (!CALL_ID) CALL_ID = first.call_id || '';
    }
    if (!offerSdp) {
      // Fallback to notifications
      var notif = await getBackend('/api/notifications').then(function(r){return r.json();}).catch(function(){return [];});
      for (var i = 0; i < notif.length; i++) {
        if (notif[i].notification_type === 'incoming_call') {
          try { var d = JSON.parse(notif[i].message); offerSdp = d.sdp; break; } catch(_){}
        }
      }
    }
    if (!offerSdp) { setState('Call unavailable'); showError('Could not retrieve incoming call. Please try again.'); return; }
    await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: offerSdp }));
    remoteSet = true; drainCandidates();
    await pc.setLocalDescription();
    var ans = pc.localDescription;
    wsSend('answer', { sdp: ans.sdp, call_id: CALL_ID });
    await postBackend('/api/webrtc/answer', { call_id: CALL_ID, caller_user_id: parseInt(PEER_ID), sdp: ans.sdp }).catch(function(){});
  }

  muteBtn.addEventListener('click', function() {
    muted = !muted;
    muteBtn.classList.toggle('muted', muted);
    muteBtn.textContent = muted ? '🔇' : '🎙️';
    if (localStream) localStream.getAudioTracks().forEach(function(t){ t.enabled = !muted; });
  });
  camBtn.addEventListener('click', function() {
    camOff = !camOff;
    camBtn.classList.toggle('muted', camOff);
    camBtn.textContent = camOff ? '📷̸' : '📷';
    if (localStream) localStream.getVideoTracks().forEach(function(t){ t.enabled = !camOff; });
  });
  flipBtn.addEventListener('click', async function() {
    if (CALL_TYPE !== 'video' || !localStream || !pc) return;
    currentFacing = currentFacing === 'user' ? 'environment' : 'user';
    try {
      var newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: currentFacing } });
      var newTrack = newStream.getVideoTracks()[0];
      var senders = pc.getSenders();
      for (var i = 0; i < senders.length; i++) {
        if (senders[i].track && senders[i].track.kind === 'video') {
          await senders[i].replaceTrack(newTrack);
        }
      }
      try { localStream.getVideoTracks().forEach(function(t){ t.stop(); }); } catch(_){}
      localStream = newStream;
      localVideo.srcObject = localStream;
    } catch(e) { /* ignore */ }
  });
  endBtn.addEventListener('click', function() { endCall(); });

  // Bootstrap.
  loadIceServers().then(function() {
    return MODE === 'answer' ? answerIncoming() : placeOutgoing();
  }).catch(function(e) {
    console.log('call setup failed', e);
    showError('Could not start the call: ' + (e && e.message ? e.message : 'unknown error'));
    setState('Call failed');
  });
})();
</script>
</body></html>`;
}

module.exports = { buildCallHtml };

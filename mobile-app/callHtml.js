// Self-contained in-app WebRTC call HTML for the APK. Bundled into the APK
// so there is NO website redirect, NO app shell load, and the call screen
// looks native.
//
// Why this file exists: the previous v1.9.8 / v1.9.10 builds either redirected
// to the website or used incorrect signaling endpoints, so the WebRTC peer
// connection never finished negotiating and media never flowed. This rewrite
// uses the *exact* same signaling that the web admin uses (verified against
// web-app/app.js):
//
//   - Offer:  POST /api/webrtc/offer  { target_user_id, sdp, call_type }
//   - Answer: POST /api/webrtc/answer { call_id, caller_user_id, sdp }
//   - ICE:    POST /api/webrtc/candidate { target_user_id, candidate, sdp_mid, sdp_m_line_index }
//   - End:    POST /api/webrtc/end-call?target_user_id=<n>
//   - Notif poll: GET /api/notifications  (then POST /api/notifications/<id>/read)
//   - WS (optional fast path): /ws/webrtc/{my_user_id}?token=...
//   - TURN fallback: a.relay.metered.ca with the credentials baked into
//     web-app/app.js — used when /api/ice-servers returns no servers.
//
// Required params (set by App.js when opening the WebView):
//   apiUrl       - backend base URL (https://app-lmanxcts.fly.dev)
//   token        - JWT for the student account
//   myUserId     - student's own user id (numeric)
//   peerUserId   - other side's user id (admin's id when student is callee, or callee's id when student is caller)
//   mode         - 'call' (outgoing) or 'answer' (incoming)
//   callType     - 'audio' or 'video'
//   callerName   - name to display
//   callId       - opaque call id (only set on the answer side; outgoing leaves blank and learns it from the offer response)
//   offerSdp     - (answer mode only) the offer SDP received from the incoming-call notification;
//                  passed directly so the WebView doesn't need to re-fetch from pending-calls
//                  or notifications (which may already be marked as read by the APK poller).

function buildCallHtml(params) {
  const safe = (s) => String(s == null ? '' : s).replace(/[<>"'&]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'})[c]);
  const apiUrl = params.apiUrl || 'https://app-lmanxcts.fly.dev';
  const token = params.token || '';
  const myUserId = String(params.myUserId || '');
  const mode = params.mode === 'answer' ? 'answer' : 'call';
  const peerUserId = String(params.peerUserId || params.targetUserId || params.callerId || '');
  const callType = params.callType === 'video' ? 'video' : 'audio';
  const callerName = params.callerName || (callType === 'video' ? 'Video Call' : 'Voice Call');
  const callId = params.callId || '';
  const offerSdp = params.offerSdp || '';

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
  .remote-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: #0a0a14; }
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
  .topbar .debug { font-size: 0.7em; color: rgba(255,255,255,0.55); margin-top: 4px; max-width: 90vw; word-break: break-word; }
  .local-video {
    position: absolute; top: 100px; right: 18px;
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
  .ctrl.end { width: 76px; height: 76px; background: #ef4444; box-shadow: 0 8px 24px rgba(239,68,68,0.5); }
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
  <audio id="remoteAudio" autoplay></audio>
  <div class="topbar">
    <div class="name">${safe(callerName)}</div>
    <div id="state" class="state">Connecting…</div>
    <div id="timer" class="timer hidden">00:00</div>
    <div id="debug" class="debug"></div>
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
  var API_URL    = ${JSON.stringify(apiUrl)};
  var TOKEN      = ${JSON.stringify(token)};
  var MY_USER_ID = ${JSON.stringify(myUserId)};
  var MODE       = ${JSON.stringify(mode)};
  var PEER_ID    = parseInt(${JSON.stringify(peerUserId)}) || 0;
  var CALL_TYPE  = ${JSON.stringify(callType)};
  var CALL_ID    = ${JSON.stringify(callId)};
  var OFFER_SDP  = ${JSON.stringify(offerSdp)};

  var stateEl       = document.getElementById('state');
  var audioStatusEl = document.getElementById('audioStatus');
  var timerEl       = document.getElementById('timer');
  var debugEl       = document.getElementById('debug');
  var remoteVideo   = document.getElementById('remoteVideo');
  var remoteAudio   = document.getElementById('remoteAudio');
  var localVideo    = document.getElementById('localVideo');
  var muteBtn       = document.getElementById('muteBtn');
  var camBtn        = document.getElementById('camBtn');
  var flipBtn       = document.getElementById('flipBtn');
  var endBtn        = document.getElementById('endBtn');
  var errorBanner   = document.getElementById('errorBanner');

  var localStream   = null;
  var remoteStream  = null;
  var pc            = null;
  var ws            = null;
  // TURN fallback identical to the web admin's. Keeps calls working on carrier
  // NAT where STUN alone fails.
  function turnFallback() {
    var u = atob('ZThkZDY1YjkyYWY0ZDEyZWYwZWQzYjg2');
    var c = atob('dVdkV05ta2h2eXFURXN3Tw==');
    return [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'turn:a.relay.metered.ca:80', username: u, credential: c },
      { urls: 'turn:a.relay.metered.ca:443', username: u, credential: c },
      { urls: 'turn:a.relay.metered.ca:443?transport=tcp', username: u, credential: c }
    ];
  }
  var iceServers   = turnFallback();
  var iceCandQueue = [];
  var remoteSet    = false;
  var callStartedAt = 0;
  var timerInterval = null;
  var pollInterval = null;
  var ended        = false;
  var muted        = false;
  var camOff       = false;
  var currentFacing = 'user';
  var seenNotifIds = {};
  var connectStartAt = 0;     // when we kicked off signaling
  var didRelayFallback = false; // have we already retried with relay-only?
  var callStartMaxNotifId = 0; // high-water-mark: max notification ID at call start
  var callStartTime = 0;       // timestamp when polling actually started (after flush)
  var CALL_END_GRACE_MS = 10000; // ignore call_ended for this many ms after poll start
  var signalingDone = false;    // true after offer/answer has been sent to backend

  function setState(s) {
    if (stateEl) stateEl.textContent = s;
    if (audioStatusEl) audioStatusEl.textContent = s;
  }
  function setDebug(s) { if (debugEl) debugEl.textContent = s; }
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
      body: JSON.stringify(body || {})
    });
  }
  function postBackendQuery(path) {
    return fetch(API_URL + path, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + TOKEN }
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

  // Optional fast-path WS — backend relays {type, target_id, data} to the peer.
  // If WS fails, the notification poller takes over the signaling.
  function connectWS() {
    if (!MY_USER_ID) return;
    try {
      var wsUrl = API_URL.replace(/^http/, 'ws') + '/ws/webrtc/' + encodeURIComponent(MY_USER_ID) + '?token=' + encodeURIComponent(TOKEN);
      ws = new WebSocket(wsUrl);
      ws.onopen = function(){ setDebug('ws connected'); };
      ws.onmessage = function(ev) {
        try {
          var m = JSON.parse(ev.data);
          var data = m.data || {};
          if (m.type === 'answer' && data.sdp) {
            applyAnswer(data.sdp);
          } else if (m.type === 'offer' && data.sdp) {
            // unexpected on this side, but accept it if pc has no remote yet
            applyOffer(data.sdp);
          } else if (m.type === 'ice_candidate' && data.candidate) {
            queueIce({ candidate: data.candidate, sdpMid: data.sdp_mid, sdpMLineIndex: data.sdp_m_line_index });
          } else if (m.type === 'call_ended' || m.type === 'hangup') {
            var wsElapsed = Date.now() - callStartTime;
            if (wsElapsed > CALL_END_GRACE_MS && signalingDone) {
              endCall(true);
            } else {
              setDebug('ws call_ended IGNORED (early/pre-signal), elapsed=' + wsElapsed + 'ms, signaled=' + signalingDone);
            }
          } else if (m.type === 'switch_to_gemini') {
            startGeminiVoiceChat();
          }
        } catch(_) {}
      };
      ws.onerror = function(){ setDebug('ws error'); };
      ws.onclose = function(){ setDebug('ws closed'); };
    } catch(_) {}
  }

  function wsSend(type, data) {
    try {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ type: type, target_id: PEER_ID, data: data }));
        return true;
      }
    } catch(_) {}
    return false;
  }

  function queueIce(candidateInit) {
    var cand;
    try { cand = new RTCIceCandidate(candidateInit); } catch(_) { return; }
    if (pc && remoteSet) {
      pc.addIceCandidate(cand).catch(function(e){ setDebug('addIce err: ' + (e && e.message)); });
    } else {
      iceCandQueue.push(cand);
    }
  }
  function drainCandidates() {
    while (iceCandQueue.length && pc && remoteSet) {
      var c = iceCandQueue.shift();
      try { pc.addIceCandidate(c).catch(function(){}); } catch(_){}
    }
  }

  function applyAnswer(sdp) {
    if (!pc || remoteSet) return;
    if (!sdp || typeof sdp !== 'string' || sdp.indexOf('v=0') !== 0) return;
    if (pc.signalingState !== 'have-local-offer') return;
    pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sdp }))
      .then(function(){ remoteSet = true; drainCandidates(); setDebug('remote answer applied'); })
      .catch(function(e){ setDebug('setRemote(answer) err: ' + (e && e.message)); });
  }
  function applyOffer(sdp) {
    if (!pc || remoteSet) return;
    if (!sdp || typeof sdp !== 'string' || sdp.indexOf('v=0') !== 0) return;
    pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: sdp }))
      .then(function(){
        remoteSet = true; drainCandidates();
        return pc.setLocalDescription();
      })
      .then(function(){
        var ans = pc.localDescription;
        wsSend('answer', { sdp: ans.sdp, call_id: CALL_ID });
        return postBackend('/api/webrtc/answer', { call_id: CALL_ID, caller_user_id: PEER_ID, sdp: ans.sdp });
      })
      .then(function(){ signalingDone = true; setDebug('answer sent, signaling done'); })
      .catch(function(e){ signalingDone = true; setDebug('answer flow err: ' + (e && e.message)); });
  }

  function endCall(remoteInitiated) {
    if (ended) return; ended = true;
    setState('Call ended');
    try { if (timerInterval) clearInterval(timerInterval); } catch(_){}
    try { if (pollInterval) clearInterval(pollInterval); } catch(_){}
    try { if (localStream) localStream.getTracks().forEach(function(t){ t.stop(); }); } catch(_){}
    try { if (pc) pc.close(); } catch(_){}
    try { if (ws) ws.close(); } catch(_){}
    // Notify backend / peer. Backend takes target_user_id as a QUERY param.
    if (!remoteInitiated && PEER_ID) {
      try { postBackendQuery('/api/webrtc/end-call?target_user_id=' + PEER_ID).catch(function(){}); } catch(_){}
    }
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
    if (localStream) localStream.getTracks().forEach(function(t){ pc.addTrack(t, localStream); });
    pc.ontrack = function(ev) {
      remoteStream = ev.streams[0];
      if (CALL_TYPE === 'video') {
        remoteVideo.srcObject = remoteStream;
      } else {
        // Audio call — pipe to <audio> so phone speaker plays it.
        remoteAudio.srcObject = remoteStream;
        try { remoteAudio.play().catch(function(){}); } catch(_){}
      }
    };
    pc.onicecandidate = function(ev) {
      if (!ev.candidate) return;
      var c = ev.candidate;
      var sent = wsSend('ice_candidate', {
        candidate: c.candidate, sdp_mid: c.sdpMid, sdp_m_line_index: c.sdpMLineIndex
      });
      if (!sent) {
        // HTTP fallback to backend ICE endpoint.
        postBackend('/api/webrtc/candidate', {
          target_user_id: PEER_ID,
          candidate: c.candidate, sdp_mid: c.sdpMid, sdp_m_line_index: c.sdpMLineIndex
        }).catch(function(){});
      }
    };
    pc.onconnectionstatechange = function() {
      var s = pc.connectionState;
      setDebug('state: ' + s + ' / ice: ' + pc.iceConnectionState + ' / sig: ' + pc.signalingState);
      if (s === 'connected') { setState('Connected'); startTimer(); }
      else if (s === 'failed') {
        setState('Connection failed');
        showError('Connection failed — retrying with relay…');
        retryWithRelayOnly();
      }
      else if (s === 'disconnected') {
        // Transient mobile-network jitter is common — keep the call up. If we
        // are STILL disconnected 8s later, only then surface the failure.
        setState('Reconnecting…');
        setTimeout(function() {
          if (!ended && pc && (pc.connectionState === 'disconnected' || pc.connectionState === 'failed')) {
            retryWithRelayOnly();
          }
        }, 8000);
      }
    };
    pc.oniceconnectionstatechange = function() {
      setDebug('ice: ' + pc.iceConnectionState + ' / state: ' + pc.connectionState);
      if (pc.iceConnectionState === 'failed') {
        try { pc.restartIce(); } catch(_){}
        retryWithRelayOnly();
      }
    };
  }

  // If the call hasn't connected after a few seconds with the normal config,
  // tear down the RTCPeerConnection and rebuild it forcing iceTransportPolicy
  // 'relay'. This drops every direct-path candidate and uses TURN only, which
  // is what the user's carrier NATs usually need. Idempotent — runs at most
  // once per call.
  function retryWithRelayOnly() {
    if (didRelayFallback || ended) return;
    didRelayFallback = true;
    setDebug('retry: relay-only');
    try { if (pc) pc.close(); } catch(_){}
    pc = new RTCPeerConnection({ iceServers: iceServers, iceCandidatePoolSize: 10, iceTransportPolicy: 'relay' });
    // Re-add tracks + handlers, then re-negotiate.
    if (localStream) localStream.getTracks().forEach(function(t){ pc.addTrack(t, localStream); });
    rebindPCHandlers();
    remoteSet = false; iceCandQueue.length = 0;
    if (MODE === 'answer') {
      // Re-pull the offer and answer with relay-only.
      answerIncoming();
    } else {
      // Caller path: create new offer.
      pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: CALL_TYPE === 'video' })
        .then(function(o){ return pc.setLocalDescription(o); })
        .then(function(){
          return postBackend('/api/webrtc/offer', {
            target_user_id: PEER_ID, sdp: pc.localDescription.sdp, call_type: CALL_TYPE
          });
        })
        .catch(function(e){ setDebug('relay-retry err: ' + (e && e.message)); });
    }
  }

  function rebindPCHandlers() {
    pc.ontrack = function(ev) {
      remoteStream = ev.streams[0];
      if (CALL_TYPE === 'video') remoteVideo.srcObject = remoteStream;
      else {
        remoteAudio.srcObject = remoteStream;
        try { remoteAudio.play().catch(function(){}); } catch(_){}
      }
    };
    pc.onicecandidate = function(ev) {
      if (!ev.candidate) return;
      var c = ev.candidate;
      var sent = wsSend('ice_candidate', {
        candidate: c.candidate, sdp_mid: c.sdpMid, sdp_m_line_index: c.sdpMLineIndex
      });
      if (!sent) {
        postBackend('/api/webrtc/candidate', {
          target_user_id: PEER_ID,
          candidate: c.candidate, sdp_mid: c.sdpMid, sdp_m_line_index: c.sdpMLineIndex
        }).catch(function(){});
      }
    };
    pc.onconnectionstatechange = function() {
      var s = pc.connectionState;
      setDebug('state: ' + s + ' / ice: ' + pc.iceConnectionState);
      if (s === 'connected') { setState('Connected'); startTimer(); }
    };
    pc.oniceconnectionstatechange = function() {
      setDebug('ice: ' + pc.iceConnectionState);
    };
  }

  // Flush stale call notifications before starting poll to prevent old
  // call_ended notifications from a previous call from ending this one.
  function flushStaleNotifications() {
    return getBackend('/api/notifications').then(function(r){ return r.json(); }).then(function(notifications){
      if (!Array.isArray(notifications)) return;
      for (var i = 0; i < notifications.length; i++) {
        var n = notifications[i];
        if (n.id > callStartMaxNotifId) callStartMaxNotifId = n.id;
        var callTypes = ['call_ended', 'call_answered', 'ice_candidate', 'incoming_call'];
        if (callTypes.indexOf(n.notification_type) !== -1) {
          seenNotifIds[n.id] = true;
          try { fetch(API_URL + '/api/notifications/' + n.id + '/read', { method: 'POST', headers: { 'Authorization': 'Bearer ' + TOKEN } }); } catch(_){}
        }
      }
      // Set callStartTime AFTER flush completes so the grace period starts
      // from when polling actually begins, not from when the network request started.
      callStartTime = Date.now();
      setDebug('flush done, maxId=' + callStartMaxNotifId + ', seen=' + Object.keys(seenNotifIds).length);
    }).catch(function(e){
      callStartTime = Date.now();
      setDebug('flush err: ' + (e && e.message));
    });
  }

  // Notification poller — primary signaling channel (works even when WS doesn't).
  function startNotifPoll() {
    if (pollInterval) clearInterval(pollInterval);
    // Flush stale notifications first, then start polling
    flushStaleNotifications().then(function() {
      pollInterval = setInterval(function() {
        if (ended) return;
        getBackend('/api/notifications').then(function(r){ return r.json(); }).then(function(notifications){
          if (!Array.isArray(notifications)) return;
          for (var i = 0; i < notifications.length; i++) {
            var n = notifications[i];
            if (seenNotifIds[n.id]) continue;
            if (n.is_read) { seenNotifIds[n.id] = true; continue; }
            var data; try { data = JSON.parse(n.message); } catch(_) { data = {}; }
            var consume = false;
            if (n.notification_type === 'call_answered' && data.sdp) {
              applyAnswer(data.sdp);
              consume = true;
            } else if (n.notification_type === 'incoming_call' && MODE === 'answer' && !remoteSet && data.sdp) {
              // Backup path for incoming side if we missed pending-calls
              CALL_ID = data.call_id || CALL_ID;
              applyOffer(data.sdp);
              consume = true;
            } else if (n.notification_type === 'ice_candidate' && data.candidate) {
              queueIce({ candidate: data.candidate, sdpMid: data.sdp_mid, sdpMLineIndex: data.sdp_m_line_index });
              consume = true;
            } else if (n.notification_type === 'call_ended') {
              // Only honor call_ended if: (a) notification was created AFTER this call started
              // (id > high-water-mark) AND (b) grace period has elapsed AND (c) signaling is done
              var elapsed = Date.now() - callStartTime;
              if (n.id > callStartMaxNotifId && elapsed > CALL_END_GRACE_MS && signalingDone) {
                setDebug('call_ended honoured, notif=' + n.id + ', age=' + elapsed + 'ms');
                endCall(true);
              } else {
                setDebug('call_ended IGNORED (stale/early/pre-signal), notif=' + n.id + ', maxId=' + callStartMaxNotifId + ', elapsed=' + elapsed + 'ms, signaled=' + signalingDone);
              }
              consume = true;
            } else if (n.notification_type === 'switch_to_gemini') {
              startGeminiVoiceChat();
              consume = true;
            }
            if (consume) {
              seenNotifIds[n.id] = true;
              try { fetch(API_URL + '/api/notifications/' + n.id + '/read', { method: 'POST', headers: { 'Authorization': 'Bearer ' + TOKEN } }); } catch(_){}
            }
          }
        }).catch(function(e){ setDebug('poll err: ' + (e && e.message)); });
      }, 1500);
    });
  }

  async function placeOutgoing() {
    setState('Calling…');
    try { await getMedia(); } catch(e) { showError('Mic/camera blocked: ' + (e && e.message)); setState('Permission denied'); return; }
    buildPC();
    var offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: CALL_TYPE === 'video' });
    await pc.setLocalDescription(offer);
    connectWS();
    startNotifPoll();
    setDebug('sending offer to peer ' + PEER_ID);
    var resp = await postBackend('/api/webrtc/offer', {
      target_user_id: PEER_ID,
      sdp: pc.localDescription.sdp,
      call_type: CALL_TYPE
    });
    try {
      var data = await resp.json();
      if (data && data.call_id) CALL_ID = data.call_id;
      signalingDone = true;
      setDebug('offer ok, call_id=' + CALL_ID);
    } catch(_) { signalingDone = true; }
  }

  async function answerIncoming() {
    setState('Connecting…');
    try { await getMedia(); } catch(e) { showError('Mic/camera blocked: ' + (e && e.message)); setState('Permission denied'); return; }
    buildPC();
    connectWS();
    startNotifPoll();
    // 1) Use the SDP passed directly from the APK notification (most reliable —
    //    avoids re-fetching from pending-calls or notifications which may be stale).
    var offerSdp = OFFER_SDP || null;
    // 2) Fallback: pull from pending-calls (in-memory on backend).
    if (!offerSdp) {
      var pending = await getBackend('/api/webrtc/pending-calls').then(function(r){return r.json();}).catch(function(){return {};});
      if (pending && pending.pending_calls && pending.pending_calls.length) {
        for (var i = 0; i < pending.pending_calls.length; i++) {
          var pc2 = pending.pending_calls[i];
          if (!PEER_ID || pc2.caller_id === PEER_ID) {
            offerSdp = pc2.sdp;
            if (!CALL_ID) CALL_ID = pc2.call_id || '';
            if (!PEER_ID) PEER_ID = pc2.caller_id;
            break;
          }
        }
      }
    }
    // 3) Last resort: pull from notifications (may already be marked read).
    if (!offerSdp) {
      var notif = await getBackend('/api/notifications').then(function(r){return r.json();}).catch(function(){return [];});
      for (var j = 0; j < notif.length; j++) {
        if (notif[j].notification_type === 'incoming_call') {
          try {
            var d = JSON.parse(notif[j].message);
            offerSdp = d.sdp;
            if (!CALL_ID) CALL_ID = d.call_id || '';
            if (!PEER_ID) PEER_ID = d.caller_id;
            break;
          } catch(_){}
        }
      }
    }
    if (!offerSdp) {
      setState('Call unavailable');
      showError('No incoming offer found. Ask caller to retry.');
      return;
    }
    setDebug('got offer, applying…');
    applyOffer(offerSdp);
  }

  // Gemini voice chat - activated when admin sends switch_to_gemini signal
  var geminiActive = false;
  var geminiRecog = null;
  function startGeminiVoiceChat() {
    if (geminiActive) return;
    geminiActive = true;
    // Mute mic in the WebRTC call
    if (localStream) localStream.getAudioTracks().forEach(function(t){ t.enabled = false; });
    // Replace call UI with Gemini voice chat
    document.querySelector('.stage').innerHTML =
      '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(180deg,#0a0a2e 0%,#1a1a3e 50%,#0a0a2e 100%);">' +
      '<div style="width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,#4285f4,#a855f7);display:flex;align-items:center;justify-content:center;font-size:64px;box-shadow:0 0 80px rgba(66,133,244,0.5);animation:pulse 2.4s ease-in-out infinite;margin-bottom:30px;">🤖</div>' +
      '<h2 style="color:#fff;margin-bottom:10px;font-size:1.6em;">Gemini AI</h2>' +
      '<p id="gStatus" style="color:#a0a0ff;margin-bottom:20px;font-size:1.1em;">Listening...</p>' +
      '<div id="gTranscript" style="max-height:200px;overflow-y:auto;width:90%;max-width:400px;margin-bottom:20px;padding:15px;background:rgba(255,255,255,0.05);border-radius:12px;font-size:0.9em;color:#ccc;"></div>' +
      '<div style="display:flex;gap:15px;">' +
      '<div class="ctrl" id="gMicBtn" style="background:#4285f4;">🎤</div>' +
      '<div class="ctrl end" id="gEndBtn">📞</div>' +
      '</div></div>';
    document.getElementById('gMicBtn').addEventListener('click', geminiListen);
    document.getElementById('gEndBtn').addEventListener('click', function(){ endCall(false); });
    // Greet the student via TTS
    geminiTTS('Hello! I am Gemini AI assistant. How can I help you with Mathematics today?');
  }

  function geminiListen() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      document.getElementById('gStatus').textContent = 'Speech recognition not supported';
      return;
    }
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (geminiRecog) try { geminiRecog.stop(); } catch(_){}
    geminiRecog = new SR();
    geminiRecog.continuous = false;
    geminiRecog.interimResults = true;
    geminiRecog.lang = 'en-IN';
    var gStat = document.getElementById('gStatus');
    var gMic = document.getElementById('gMicBtn');
    if (gStat) gStat.textContent = '🎤 Listening...';
    if (gMic) gMic.style.background = '#ef4444';
    var final = '';
    geminiRecog.onresult = function(ev) {
      var interim = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) final += ev.results[i][0].transcript;
        else interim += ev.results[i][0].transcript;
      }
      if (gStat) gStat.textContent = final || interim || 'Listening...';
    };
    geminiRecog.onend = function() {
      if (gMic) gMic.style.background = '#4285f4';
      if (final.trim()) geminiSend(final.trim());
      else if (gStat) gStat.textContent = 'Tap mic to speak';
    };
    geminiRecog.onerror = function() {
      if (gMic) gMic.style.background = '#4285f4';
      if (gStat) gStat.textContent = 'Tap mic to speak';
    };
    geminiRecog.start();
  }

  function geminiSend(text) {
    var gStat = document.getElementById('gStatus');
    var gTrans = document.getElementById('gTranscript');
    if (gStat) gStat.textContent = '🤔 Thinking...';
    if (gTrans) { gTrans.innerHTML += '<div style="margin-bottom:8px;"><span style="color:#4ade80;">You:</span> ' + text + '</div>'; gTrans.scrollTop = gTrans.scrollHeight; }
    postBackend('/api/ai/chat', { message: text, chapter_id: null })
      .then(function(r){ return r.json(); })
      .then(function(data) {
        var reply = (data && data.response) || 'Sorry, please try again.';
        if (gTrans) { gTrans.innerHTML += '<div style="margin-bottom:8px;"><span style="color:#a0a0ff;">Gemini:</span> ' + reply + '</div>'; gTrans.scrollTop = gTrans.scrollHeight; }
        geminiTTS(reply);
      })
      .catch(function() {
        if (gStat) gStat.textContent = 'Error. Tap mic to try again.';
      });
  }

  function geminiTTS(text) {
    var gStat = document.getElementById('gStatus');
    if (gStat) gStat.textContent = '🔊 Speaking...';
    if (!window.speechSynthesis) { if (gStat) gStat.textContent = 'Tap mic to speak'; return; }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN'; u.rate = 0.95; u.pitch = 1;
    u.onend = function() {
      if (gStat) gStat.textContent = 'Tap mic to ask another question';
      if (geminiActive) setTimeout(function(){ if (geminiActive) geminiListen(); }, 500);
    };
    u.onerror = function() { if (gStat) gStat.textContent = 'Tap mic to speak'; };
    window.speechSynthesis.speak(u);
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
  endBtn.addEventListener('click', function() { endCall(false); });

  // Bootstrap.
  loadIceServers().then(function() {
    connectStartAt = Date.now();
    // Connect watchdog: if we haven't reached 'connected' in 30s, force a
    // relay-only retry. Needs to be long enough for the callee to see the
    // incoming-call notification (polled every 3s) and tap Answer.
    setTimeout(function() {
      if (!ended && pc && pc.connectionState !== 'connected') {
        retryWithRelayOnly();
      }
    }, 30000);
    return MODE === 'answer' ? answerIncoming() : placeOutgoing();
  }).catch(function(e) {
    setDebug('boot err: ' + (e && e.message));
    showError('Could not start the call: ' + (e && e.message ? e.message : 'unknown error'));
    setState('Call failed');
  });
})();
</script>
</body></html>`;
}

module.exports = { buildCallHtml };

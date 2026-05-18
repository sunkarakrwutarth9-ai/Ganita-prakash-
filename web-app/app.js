// ============================================
// GANITA PRAKASH - Additional Features
// Add this at the beginning of app.js
// ============================================

// Claude API Key for AI Assistant - Set via environment or backend
// Note: API calls are made through the backend, not directly from frontend
const CLAUDE_API_KEY = '';
var GROQ_API_KEY = window.GROQ_KEY || '';

// Backend API URL - must be at top before any functions use it
const API_URL = "https://app-lmanxcts.fly.dev";

function sanitizeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Render a chat message body. Inline-displays image and voice messages so
// admins can see/hear them without leaving the panel. Only base64 data URIs
// and same-origin URLs are allowed in src to keep this safe.
function renderChatBody(msg) {
    if (!msg) return '';
    var t = (msg.message_type || '').toLowerCase();
    var url = msg.media_url || '';
    var isSafeUrl = typeof url === 'string' && (url.indexOf('data:image/') === 0 || url.indexOf('data:audio/') === 0 || url.indexOf('https://') === 0);
    if (t === 'image' && isSafeUrl && url.indexOf('data:image/') === 0) {
        return '<div style="margin-bottom:4px;"><img src="' + url + '" style="max-width:240px; max-height:240px; border-radius:8px; display:block; cursor:pointer;" onclick="window.open(this.src,\'_blank\')"></div>' +
               (msg.content && msg.content !== '[Image]' ? '<div style="word-wrap:break-word; font-size:0.85em; opacity:0.85;">' + sanitizeHTML(msg.content) + '</div>' : '');
    }
    if ((t === 'audio' || t === 'voice') && isSafeUrl && url.indexOf('data:audio/') === 0) {
        return '<div style="margin-bottom:4px;"><audio controls preload="none" src="' + url + '" style="max-width:240px;"></audio></div>' +
               (msg.content && msg.content.indexOf('[Voice') !== 0 ? '<div style="word-wrap:break-word; font-size:0.85em; opacity:0.85;">' + sanitizeHTML(msg.content) + '</div>' : '');
    }
    if ((t === 'audio' || t === 'voice') && typeof msg.voice_data === 'string' && msg.voice_data.length > 100) {
        var src = 'data:audio/m4a;base64,' + msg.voice_data;
        return '<div style="margin-bottom:4px;"><audio controls preload="none" src="' + src + '" style="max-width:240px;"></audio></div>';
    }
    return '<div style="word-wrap:break-word;">' + sanitizeHTML(msg.content || '') + '</div>';
}

// Indian Festival Calendar 2026
const indianFestivals2026 = [
    // January
    { date: "01-01", name: "New Year's Day", wish: "Happy New Year 2026! Wishing you success in your studies!", emoji: "🎉", color: "#FFD700" },
    { date: "01-05", name: "Guru Gobind Singh Jayanti", wish: "Happy Guru Gobind Singh Jayanti! May courage guide your path!", emoji: "🙏", color: "#FF9933" },
    { date: "01-13", name: "Lohri", wish: "Happy Lohri! May the bonfire bring warmth and prosperity!", emoji: "🔥", color: "#FF6B35" },
    { date: "01-14", name: "Pongal / Makar Sankranti", wish: "Happy Pongal! Happy Makar Sankranti! May the harvest bring abundance!", emoji: "🌾", color: "#FFA500" },
    { date: "01-23", name: "Basant Panchami / Saraswati Puja", wish: "Happy Basant Panchami! May Goddess Saraswati bless you with knowledge!", emoji: "📚", color: "#FFFF00" },
    { date: "01-26", name: "Republic Day", wish: "Happy Republic Day! Jai Hind! Proud to be Indian!", emoji: "🇮🇳", color: "#FF9933" },
    // February
    { date: "02-15", name: "Maha Shivaratri", wish: "Om Namah Shivaya! Happy Maha Shivaratri!", emoji: "🔱", color: "#9B59B6" },
    // March
    { date: "03-03", name: "Holika Dahan", wish: "Happy Holika Dahan! May evil be destroyed!", emoji: "🔥", color: "#E74C3C" },
    { date: "03-04", name: "Holi", wish: "Happy Holi! May your life be filled with colors of joy!", emoji: "🎨", color: "#E91E63" },
    { date: "03-19", name: "Ugadi / Gudi Padwa / Chaitra Navratri", wish: "Happy Ugadi! Happy Gudi Padwa! Shubh Nav Samvatsar!", emoji: "🌸", color: "#FF69B4" },
    { date: "03-20", name: "Cheti Chand", wish: "Happy Cheti Chand! Sindhi New Year wishes!", emoji: "🌊", color: "#00CED1" },
    { date: "03-26", name: "Ram Navami", wish: "Happy Ram Navami! Jai Shri Ram!", emoji: "🏹", color: "#FF8C00" },
    { date: "03-31", name: "Mahavir Jayanti", wish: "Happy Mahavir Jayanti! May truth and non-violence guide your path!", emoji: "🙏", color: "#FFD700" },
    // April
    { date: "04-02", name: "Hanuman Jayanti", wish: "Happy Hanuman Jayanti! Jai Bajrang Bali!", emoji: "🐒", color: "#FF4500" },
    { date: "04-03", name: "Good Friday", wish: "Blessed Good Friday! May peace be with you!", emoji: "✝️", color: "#8B4513" },
    { date: "04-05", name: "Easter Sunday", wish: "Happy Easter! May joy and hope fill your heart!", emoji: "🐣", color: "#FFB6C1" },
    { date: "04-14", name: "Baisakhi / Ambedkar Jayanti", wish: "Happy Baisakhi! Happy Ambedkar Jayanti!", emoji: "🌾", color: "#F1C40F" },
    // May
    { date: "05-01", name: "Buddha Purnima", wish: "Happy Buddha Purnima! May wisdom light your way!", emoji: "🪷", color: "#9B59B6" },
    { date: "04-19", name: "Akshaya Tritiya", wish: "Happy Akshaya Tritiya! May prosperity never diminish!", emoji: "✨", color: "#FFD700" },
    // July
    { date: "07-16", name: "Jagannath Rath Yatra", wish: "Happy Rath Yatra! Jai Jagannath!", emoji: "🛕", color: "#E67E22" },
    { date: "07-29", name: "Guru Purnima", wish: "Happy Guru Purnima! Salute to all teachers and gurus!", emoji: "👨‍🏫", color: "#8E44AD" },
    // August
    { date: "08-15", name: "Independence Day", wish: "Happy Independence Day! Jai Hind! Vande Mataram!", emoji: "🇮🇳", color: "#138808" },
    { date: "08-26", name: "Onam", wish: "Happy Onam! May King Mahabali bless you with joy!", emoji: "🌺", color: "#F39C12" },
    { date: "08-28", name: "Raksha Bandhan", wish: "Happy Raksha Bandhan! Celebrate the bond of love!", emoji: "🎀", color: "#E91E63" },
    // September
    { date: "09-04", name: "Janmashtami", wish: "Happy Janmashtami! Jai Shri Krishna! Nand Ghar Anand Bhayo!", emoji: "🦚", color: "#3498DB" },
    { date: "09-14", name: "Ganesh Chaturthi", wish: "Ganpati Bappa Morya! Happy Ganesh Chaturthi!", emoji: "🐘", color: "#E74C3C" },
    { date: "09-05", name: "Teachers' Day (India)", wish: "Happy Teachers' Day! Guru Brahma Guru Vishnu!", emoji: "👩‍🏫", color: "#2ECC71" },
    // October
    { date: "10-02", name: "Gandhi Jayanti", wish: "Happy Gandhi Jayanti! Be the change you wish to see!", emoji: "🕊️", color: "#F5F5DC" },
    { date: "10-11", name: "Sharad Navratri Begins", wish: "Shubh Navratri! May Goddess Durga bless you with strength!", emoji: "🔱", color: "#E91E63" },
    { date: "10-17", name: "Durga Puja Ashtami", wish: "Happy Durga Ashtami! Jai Maa Durga!", emoji: "🙏", color: "#E91E63" },
    { date: "10-18", name: "Durga Puja Navami", wish: "Happy Maha Navami! Victory to Goddess Durga!", emoji: "🙏", color: "#E91E63" },
    { date: "10-20", name: "Dussehra / Vijayadashami", wish: "Happy Dussehra! May good triumph over evil!", emoji: "🏹", color: "#FF6B35" },
    { date: "10-29", name: "Karva Chauth", wish: "Happy Karva Chauth! May your love last forever!", emoji: "🌙", color: "#E91E63" },
    // November
    { date: "11-06", name: "Dhanteras", wish: "Happy Dhanteras! May Goddess Lakshmi bless you with wealth!", emoji: "💰", color: "#FFD700" },
    { date: "11-07", name: "Narak Chaturdashi / Choti Diwali", wish: "Happy Choti Diwali! Light the diyas of hope!", emoji: "🪔", color: "#FFA500" },
    { date: "11-08", name: "Diwali", wish: "Happy Diwali! May your life shine bright with joy and prosperity!", emoji: "🪔", color: "#FFD700" },
    { date: "11-09", name: "Govardhan Puja", wish: "Happy Govardhan Puja! Jai Shri Krishna!", emoji: "⛰️", color: "#27AE60" },
    { date: "11-10", name: "Bhai Dooj", wish: "Happy Bhai Dooj! Celebrate the beautiful bond of siblings!", emoji: "👫", color: "#E91E63" },
    { date: "11-14", name: "Children's Day", wish: "Happy Children's Day! Keep learning, growing and dreaming!", emoji: "👧", color: "#3498DB" },
    { date: "11-15", name: "Chhath Puja", wish: "Happy Chhath Puja! Jai Chhathi Maiya! Jai Surya Dev!", emoji: "🌅", color: "#FF6B35" },
    { date: "11-24", name: "Guru Nanak Jayanti", wish: "Happy Guru Nanak Jayanti! Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh!", emoji: "🙏", color: "#FF9933" },
    // December
    { date: "12-25", name: "Christmas", wish: "Merry Christmas! Wishing you joy, love and happiness!", emoji: "🎄", color: "#E74C3C" },
    { date: "12-31", name: "New Year's Eve", wish: "Happy New Year's Eve! Cheers to a wonderful year ahead!", emoji: "🥂", color: "#FFD700" },
];

function checkFestivalWish() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = month + '-' + day;
    const festival = indianFestivals2026.find(f => f.date === dateStr);
    if (festival) {
        showFestivalPopup(festival);
    }
}

function showFestivalPopup(festival) {
    // Check if already shown today
    const shownKey = 'festival_shown_' + festival.date;
    if (localStorage.getItem(shownKey) === 'true') return;
    localStorage.setItem(shownKey, 'true');
    
    // Create colorful festival popup
    var popup = document.createElement('div');
    popup.id = 'festival-popup';
    popup.innerHTML = 
        '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10001; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.5s;">' +
        '<div style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 3px solid ' + festival.color + '; border-radius: 20px; padding: 40px; max-width: 400px; text-align: center; box-shadow: 0 0 50px ' + festival.color + '40; animation: popIn 0.5s;">' +
        '<div style="font-size: 80px; margin-bottom: 20px; animation: bounce 1s infinite;">' + festival.emoji + '</div>' +
        '<h2 style="color: ' + festival.color + '; font-family: Orbitron, monospace; font-size: 24px; margin-bottom: 15px; text-shadow: 0 0 20px ' + festival.color + ';">' + festival.name + '</h2>' +
        '<p style="color: #fff; font-size: 18px; line-height: 1.6; margin-bottom: 25px;">' + festival.wish + '</p>' +
        '<div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">' +
        '<span style="font-size: 30px; animation: sparkle 0.5s infinite;">✨</span>' +
        '<span style="font-size: 30px; animation: sparkle 0.5s infinite 0.1s;">🎊</span>' +
        '<span style="font-size: 30px; animation: sparkle 0.5s infinite 0.2s;">🎉</span>' +
        '</div>' +
        '<button onclick="closeFestivalPopup()" style="padding: 12px 40px; background: linear-gradient(135deg, ' + festival.color + ', ' + festival.color + '99); border: none; border-radius: 25px; color: #000; font-family: Orbitron, monospace; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.3s;">Thank You!</button>' +
        '</div>' +
        '</div>' +
        '<style>' +
        '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }' +
        '@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }' +
        '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }' +
        '@keyframes sparkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }' +
        '</style>';
    document.body.appendChild(popup);
}

function closeFestivalPopup() {
    var popup = document.getElementById('festival-popup');
    if (popup) popup.remove();
}

// Birthday Wishing Feature
function checkBirthdayWish() {
    var birthday = localStorage.getItem('user_birthday');
    if (!birthday) return;
    var today = new Date();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    var todayStr = month + '-' + day;
    if (birthday === todayStr) {
        var shownKey = 'birthday_shown_' + today.getFullYear() + '_' + todayStr;
        if (localStorage.getItem(shownKey) === 'true') return;
        localStorage.setItem(shownKey, 'true');
        var userName = localStorage.getItem('user_display_name') || localStorage.getItem('studentName') || 'Student';
        showBirthdayPopup(userName);
    }
}

function showBirthdayPopup(name) {
    var popup = document.createElement('div');
    popup.id = 'birthday-popup';
    popup.innerHTML =
        '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10002; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.5s;">' +
        '<div style="background: linear-gradient(135deg, #1a0030, #0d001a, #1a0030); border: 3px solid #ff69b4; border-radius: 24px; padding: 45px; max-width: 420px; text-align: center; box-shadow: 0 0 60px rgba(255,105,180,0.4), 0 0 120px rgba(255,105,180,0.1); animation: popIn 0.6s;">' +
        '<div style="font-size: 80px; margin-bottom: 15px; animation: bounce 1s infinite;">🎂</div>' +
        '<h2 style="color: #ff69b4; font-family: Orbitron, monospace; font-size: 26px; margin-bottom: 10px; text-shadow: 0 0 20px #ff69b4;">Happy Birthday!</h2>' +
        '<h3 style="color: #FFD700; font-family: Orbitron, monospace; font-size: 20px; margin-bottom: 15px; text-shadow: 0 0 15px #FFD700;">Dear ' + name + '</h3>' +
        '<p style="color: #fff; font-size: 17px; line-height: 1.7; margin-bottom: 25px;">Wishing you a wonderful birthday filled with joy, laughter and success! May this year bring you great knowledge and achievements in your studies!</p>' +
        '<div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 20px;">' +
        '<span style="font-size: 28px; animation: sparkle 0.5s infinite;">🎈</span>' +
        '<span style="font-size: 28px; animation: sparkle 0.5s infinite 0.1s;">🎁</span>' +
        '<span style="font-size: 28px; animation: sparkle 0.5s infinite 0.2s;">🎉</span>' +
        '<span style="font-size: 28px; animation: sparkle 0.5s infinite 0.3s;">🥳</span>' +
        '<span style="font-size: 28px; animation: sparkle 0.5s infinite 0.4s;">🎊</span>' +
        '</div>' +
        '<button onclick="closeBirthdayPopup()" style="padding: 14px 44px; background: linear-gradient(135deg, #ff69b4, #ff1493); border: none; border-radius: 25px; color: #fff; font-family: Orbitron, monospace; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.3s; box-shadow: 0 4px 15px rgba(255,105,180,0.4);">Thank You!</button>' +
        '</div>' +
        '</div>';
    document.body.appendChild(popup);
}

function closeBirthdayPopup() {
    var popup = document.getElementById('birthday-popup');
    if (popup) popup.remove();
}

function showBirthdaySetup() {
    var existing = localStorage.getItem('user_birthday') || '';
    var existingMonth = existing ? existing.split('-')[0] : '';
    var existingDay = existing ? existing.split('-')[1] : '';
    var popup = document.createElement('div');
    popup.id = 'birthday-setup-popup';
    popup.innerHTML =
        '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10001; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.5s;">' +
        '<div style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 2px solid #ff69b4; border-radius: 20px; padding: 35px; max-width: 380px; text-align: center; box-shadow: 0 0 40px rgba(255,105,180,0.3);">' +
        '<div style="font-size: 60px; margin-bottom: 15px;">🎂</div>' +
        '<h3 style="color: #ff69b4; font-family: Orbitron, monospace; font-size: 18px; margin-bottom: 20px;">Set Your Birthday</h3>' +
        '<p style="color: #aaa; font-size: 14px; margin-bottom: 20px;">We will wish you on your special day!</p>' +
        '<div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">' +
        '<select id="birthday-month" style="padding: 10px; border-radius: 10px; background: #0a0a1a; color: #fff; border: 1px solid #ff69b4; font-size: 14px; width: 140px;">' +
        '<option value="">Month</option>' +
        '<option value="01"' + (existingMonth === '01' ? ' selected' : '') + '>January</option>' +
        '<option value="02"' + (existingMonth === '02' ? ' selected' : '') + '>February</option>' +
        '<option value="03"' + (existingMonth === '03' ? ' selected' : '') + '>March</option>' +
        '<option value="04"' + (existingMonth === '04' ? ' selected' : '') + '>April</option>' +
        '<option value="05"' + (existingMonth === '05' ? ' selected' : '') + '>May</option>' +
        '<option value="06"' + (existingMonth === '06' ? ' selected' : '') + '>June</option>' +
        '<option value="07"' + (existingMonth === '07' ? ' selected' : '') + '>July</option>' +
        '<option value="08"' + (existingMonth === '08' ? ' selected' : '') + '>August</option>' +
        '<option value="09"' + (existingMonth === '09' ? ' selected' : '') + '>September</option>' +
        '<option value="10"' + (existingMonth === '10' ? ' selected' : '') + '>October</option>' +
        '<option value="11"' + (existingMonth === '11' ? ' selected' : '') + '>November</option>' +
        '<option value="12"' + (existingMonth === '12' ? ' selected' : '') + '>December</option>' +
        '</select>' +
        '<select id="birthday-day" style="padding: 10px; border-radius: 10px; background: #0a0a1a; color: #fff; border: 1px solid #ff69b4; font-size: 14px; width: 100px;">' +
        '<option value="">Day</option>' +
        (function() { var opts = ''; for (var i = 1; i <= 31; i++) { var val = String(i).padStart(2, '0'); opts += '<option value="' + val + '"' + (existingDay === val ? ' selected' : '') + '>' + i + '</option>'; } return opts; })() +
        '</select>' +
        '</div>' +
        '<div style="display: flex; gap: 10px; justify-content: center;">' +
        '<button onclick="saveBirthday()" style="padding: 12px 30px; background: linear-gradient(135deg, #ff69b4, #ff1493); border: none; border-radius: 20px; color: #fff; font-family: Orbitron, monospace; font-size: 14px; font-weight: bold; cursor: pointer;">Save</button>' +
        '<button onclick="closeBirthdaySetup()" style="padding: 12px 30px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; color: #aaa; font-size: 14px; cursor: pointer;">Cancel</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    document.body.appendChild(popup);
}

function saveBirthday() {
    var month = document.getElementById('birthday-month').value;
    var day = document.getElementById('birthday-day').value;
    if (!month || !day) {
        alert('Please select both month and day!');
        return;
    }
    localStorage.setItem('user_birthday', month + '-' + day);
    closeBirthdaySetup();
    alert('Birthday saved! We will wish you on your special day! 🎂');
}

function closeBirthdaySetup() {
    var popup = document.getElementById('birthday-setup-popup');
    if (popup) popup.remove();
}

// Legacy function for compatibility
function checkHolidayWish() {
    checkFestivalWish();
    checkBirthdayWish();
}

function showHolidayWish() {
    checkFestivalWish();
    checkBirthdayWish();
}

// Gemini Language Support
const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'te', name: 'Telugu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'pa', name: 'Punjabi' },
];

let geminiLanguage = localStorage.getItem('geminiLanguage') || 'en';

function setGeminiLanguage(langCode) {
    geminiLanguage = langCode;
    localStorage.setItem('geminiLanguage', langCode);
}

function getLanguageName(code) {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return lang ? lang.name : 'English';
}

function showLanguageSelector() {
    let options = SUPPORTED_LANGUAGES.map(l => l.code + ' - ' + l.name).join('\n');
    let selected = prompt('Select your preferred language for Gemini AI:\n\n' + options + '\n\nEnter language code (e.g., en, hi, te):');
    if (selected && SUPPORTED_LANGUAGES.find(l => l.code === selected)) {
        setGeminiLanguage(selected);
        alert('Language set to: ' + getLanguageName(selected));
    }
}

// Chapter Media (Videos, PPTs, and PDFs from NotebookLM)
const chapterMedia = {
    1: { title: "Patterns in numbers", videoUrl: "https://drive.google.com/file/d/1G-gWjUd8hrmxyV-meLn6igquy5zTqx-i/preview", videoSummary: "Learn about number patterns and sequences.", pptUrl: "https://drive.google.com/file/d/1WbHMprNLt5JMQo0vVaC7_P7sTrR9Sxcd/preview", pptTitle: "The Hidden Architecture of Patterns", tbUrl: "https://drive.google.com/file/d/1MdSzsXsFNUjYw8cxTiBFd7-T6qvH40Sp/preview", tbTitle: "Chapter 1 - Maths T.B.", formulaVideoId: "" },
    2: { title: "Lines and Angles", videoUrl: "https://drive.google.com/file/d/10NfjD3znlbJbcKo50R9AD5vLNuLCOB5H/preview", videoSummary: "Understanding lines, rays, and angles.", pptUrl: "https://drive.google.com/file/d/1fCIki-yVVW33e5_yQabafq8Sn7-Ue5Eu/preview", pptTitle: "From Point to Degree", tbUrl: "https://drive.google.com/file/d/1P7GyBa-N0d5fXL0iMaWZriEVxsHf4ISG/preview", tbTitle: "Chapter 2 - Maths T.B.", formulaVideoId: "" },
    3: { title: "Number Play", videoUrl: "https://drive.google.com/file/d/1voVejm6eO6BtXm9AMIfLCPikVwGnHU8i/preview", videoSummary: "Explore number puzzles and patterns.", pptUrl: "https://drive.google.com/file/d/1KgJx2nQdc9t-xHsBjYzt11JgFzyeGQmm/preview", pptTitle: "The Secret Life of Numbers", tbUrl: "https://drive.google.com/file/d/145VeF9E3B3XbiAS5XGwNoGRNiCY1Kkxn/preview", tbTitle: "Chapter 3 - Maths T.B.", formulaVideoId: "" },
    4: { title: "Data Handling", videoUrl: "https://drive.google.com/file/d/1uWy_U2NrHjx1Riv0Z2NIANPj5XkMxmYD/preview", videoSummary: "Learn to collect and present data.", pptUrl: "https://drive.google.com/file/d/1vAHyCGcFtcdjTIzvasaCvOGYMblfujGg/preview", pptTitle: "Data Structure Visualize Integrity", tbUrl: "https://drive.google.com/file/d/1h9k3rGFz8sXidIitfspCmQ6g0pCzZKCY/preview", tbTitle: "Chapter 4 - Maths T.B.", formulaVideoId: "" },
    5: { title: "Prime Time", videoUrl: "https://drive.google.com/file/d/1CJTbvE5vTVPJiFvt-_l1cv5mHr5g7JD2/preview", videoSummary: "Discover prime numbers and factors.", pptUrl: "https://drive.google.com/file/d/1-94wWynj-KJN4uU-1DzjSGtLPKO3Y32m/preview", pptTitle: "Prime Time A Game of Numbers", tbUrl: "https://drive.google.com/file/d/1OHpaiu9dF71fK4bRp0BO7ok8_QKIq2MJ/preview", tbTitle: "Chapter 5 - Maths T.B.", formulaVideoId: "" },
    6: { title: "Perimeter and Area", videoUrl: "https://drive.google.com/file/d/1rAjBngeOMaEiZ_tE4OM8Okviyqhbxkpo/preview", videoSummary: "Calculate perimeter and area.", pptUrl: "https://drive.google.com/file/d/11z7anMHhrCoG2309wuKuYhMXADdKlxbj/preview", pptTitle: "The Architect's Toolkit Mastering Space", tbUrl: "https://drive.google.com/file/d/1-XCGMLfG-e05qa2Pfvd8q-WxRUxtgIRG/preview", tbTitle: "Chapter 6 - Maths T.B.", formulaVideoId: "" },
    7: { title: "Fractions", videoUrl: "https://drive.google.com/file/d/1HLz1i1ZzddZdnpsoyv7Zhoot_P80oaYm/preview", videoSummary: "Understanding fractions.", pptUrl: "https://drive.google.com/file/d/1ll8jPIypxn1Z_ISDHHSNxoMFQ0BqBodA/preview", pptTitle: "The Language of Parts", tbUrl: "https://drive.google.com/file/d/13kc5mx6p3jWThUIHKEoRYoYRkNkvnHCV/preview", tbTitle: "Chapter 7 - Maths T.B.", formulaVideoId: "" },
    8: { title: "Playing with Constructions", videoUrl: "https://drive.google.com/file/d/1YuU0Cmx4CoeL2IgM6dsjS1zBCXoNG8cQ/preview", videoSummary: "Geometric constructions.", pptUrl: "https://drive.google.com/file/d/18oH6_9fkoIS2yCZ28qBTyGSW4-TkJlL_/preview", pptTitle: "The Geometer's Quest Precision and Art", tbUrl: "https://drive.google.com/file/d/1agsSZgajY4NPMyaWcFnYZ9slQpvfhb5Z/preview", tbTitle: "Chapter 8 - Maths T.B.", formulaVideoId: "" },
    9: { title: "Symmetry", videoUrl: "https://drive.google.com/file/d/14X50UAcCKYxgTmTxFxXtwUI74lK1YLOh/preview", videoSummary: "Line and rotational symmetry.", pptUrl: "https://drive.google.com/file/d/1YDvhdUNJ3nmUJilCex2uqIcsQ3-I0cnT/preview", pptTitle: "The Universal Blueprint of Symmetry", tbUrl: "https://drive.google.com/file/d/1-PWg2U1ZOkU-jXUIQ3W5f0ClNtYGWWTU/preview", tbTitle: "Chapter 9 - Maths T.B.", formulaVideoId: "" },
    10: { title: "The Other Side of Zero", videoUrl: "https://drive.google.com/file/d/1FN9nkTnWCOTYF6El54AEtWtd-NKsUiBD/preview", videoSummary: "Introduction to integers.", pptUrl: "https://drive.google.com/file/d/18dQvLG_a1EOM5uz3JZKehQ-yOgtkzsJD/preview", pptTitle: "The Other Side of Zero", tbUrl: "https://drive.google.com/file/d/1pJf73SW7rhNGsCSMKGy6gnypRGI41L65/preview", tbTitle: "Chapter 10 - Maths T.B.", formulaVideoId: "" },
};

const chapterMedia7 = {
    1: { title: "Large Numbers Around Us", pptUrl: "https://drive.google.com/file/d/1PnUzI9fqvDRy8FKpOmAA9EDaUfhuf4Z-/preview", pptTitle: 'Large Numbers Around Us PPT', videoUrl: "https://drive.google.com/file/d/1X7QzHm27NN-6nBobfxXZa1Nm4G6CQcZd/preview", videoSummary: 'Learn about large numbers and place value.', tbUrl: "https://drive.google.com/file/d/1x-pA5k71rU-2r8b2Jt3ItcKY3h4KJjKe/preview", tbTitle: "Chapter 1 - Maths T.B. (Class 7)", formulaVideoId: "" },
    2: { title: "Arithmetic Expressions", pptUrl: "https://drive.google.com/file/d/1xvTFAdLyOyDoAo01nbWieKU0R2qdM7_8/preview", pptTitle: 'Arithmetic Expressions PPT', videoUrl: "https://drive.google.com/file/d/1sK1GMp-_N6Go9Q1vZgQ9V3yOxBY6cpsz/preview", videoSummary: 'Understanding arithmetic expressions and operations.', tbUrl: "https://drive.google.com/file/d/1AhOQJqrQbqhC2UTbxV7vQWhWWeBR-OvN/preview", tbTitle: "Chapter 2 - Maths T.B. (Class 7)", formulaVideoId: "" },
    3: { title: "A Peek Beyond the Point", pptUrl: "https://drive.google.com/file/d/1-P9rU0YORr6i8TMbMZ-EP5Z8DSjitDsA/preview", pptTitle: 'A Peek Beyond the Point PPT', videoUrl: "https://drive.google.com/file/d/1ZAMjdzhld2m1at4RBIF2fxEVAoiQS4Yg/preview", videoSummary: 'Explore decimals and their applications.', tbUrl: "https://drive.google.com/file/d/1IC1e1lS2m_VEZymRFPidj976pqywcK5f/preview", tbTitle: "Chapter 3 - Maths T.B. (Class 7)", formulaVideoId: "" },
    4: { title: "Expressions Using Letter-Numbers", pptUrl: "https://drive.google.com/file/d/15h1y4eUr9rAcxmik2GCvohoEsdZkJQ7m/preview", pptTitle: 'Expressions Using Letter-Numbers PPT', videoUrl: "https://drive.google.com/file/d/1JpHN1xoAfCTAxCFZFsw8G1xnTgbo_IAd/preview", videoSummary: 'Learn algebraic expressions with variables.', tbUrl: "https://drive.google.com/file/d/1gRtW2dURYE06R0hCLWsLR7jUCLo2CxC6/preview", tbTitle: "Chapter 4 - Maths T.B. (Class 7)", formulaVideoId: "" },
    5: { title: "Parallel and Intersecting Lines", pptUrl: "https://drive.google.com/file/d/1gCrQ0eCdReQJBkO_4th0bHMF06pThPNM/preview", pptTitle: 'Parallel and Intersecting Lines PPT', videoUrl: "https://drive.google.com/file/d/1QoMI50p2Up32KlQE2_Um4EiAZeurIGXf/preview", videoSummary: 'Understanding parallel and intersecting lines.', tbUrl: "https://drive.google.com/file/d/1Ea6oZ7Datt3f7dRJHlCRTGjhsUFcD6bs/preview", tbTitle: "Chapter 5 - Maths T.B. (Class 7)", formulaVideoId: "" },
    6: { title: "Number Play", pptUrl: "https://drive.google.com/file/d/1zHAnSrervSBRu30HrHIzhJYi39U1xB6p/preview", pptTitle: 'Number Play PPT', videoUrl: "https://drive.google.com/file/d/1-LBpIVFxvAju1VnaSG4jzQpilKc4ZgVr/preview", videoSummary: 'Explore number patterns and games.', tbUrl: "https://drive.google.com/file/d/1_YAfGFbiGsn5ySmMwd30DfVDToAriMdC/preview", tbTitle: "Chapter 6 - Maths T.B. (Class 7)", formulaVideoId: "" },
    7: { title: "A Tale of Three Intersecting Lines", pptUrl: "https://drive.google.com/file/d/1DDn0YB9PftrWhIKOndfyCl81uEalfeLy/preview", pptTitle: 'A Tale of Three Intersecting Lines PPT', videoUrl: "https://drive.google.com/file/d/1g7okGSNzyKScQ_DU9-4HnqV28GTUejhp/preview", videoSummary: 'Learn about triangles and their properties.', tbUrl: "https://drive.google.com/file/d/1-ZA9wYIyeMCNaNDuTgcdwOH0dPnPoomL/preview", tbTitle: "Chapter 7 - Maths T.B. (Class 7)", formulaVideoId: "" },
    8: { title: "Working with Fractions", pptUrl: "https://drive.google.com/file/d/16SRmBSTFrVCPTs2F-PDr7L2CbuIXIULa/preview", pptTitle: 'Working with Fractions PPT', videoUrl: "https://drive.google.com/file/d/1155B64YX5fCyWXUS-9tacPeRu8h_YY_h/preview", videoSummary: 'Master fraction operations and applications.', tbUrl: "https://drive.google.com/file/d/137oZEzZXej7N1WE9_i9_vK22annvRmVB/preview", tbTitle: "Chapter 8 - Maths T.B. (Class 7)", formulaVideoId: "" },
    9: { title: "Geometric Twins", pptUrl: "https://drive.google.com/file/d/1Kyc1Za_FUjh7r88TH_iXRBSWM6y3fQGo/preview", pptTitle: 'Geometric Twins PPT', videoUrl: "https://drive.google.com/file/d/1ecFget9f37Byi6ClXJDO7gcpC-IRZ_xp/preview", videoSummary: 'Explore congruence and similarity.', tbUrl: "https://drive.google.com/file/d/1JFUx8oZejHebk124wAaRJJFVpVilCgGk/preview", tbTitle: "Chapter 9 - Maths T.B. (Class 7)", formulaVideoId: "" },
    10: { title: "Operations with Integers", pptUrl: "https://drive.google.com/file/d/1BEiyNA3iMZ-b_AAq_ZyRO6lBbFxU8YP3/preview", pptTitle: 'Operations with Integers PPT', videoUrl: "https://drive.google.com/file/d/1Nk5SQv57L0a2zyKKsxLWkwzXDuCa5gwq/preview", videoSummary: 'Learn integer operations and number line.', tbUrl: "https://drive.google.com/file/d/1T6QtIeIDmA1hsucVwUgQ5lksSwHqOVtJ/preview", tbTitle: "Chapter 10 - Maths T.B. (Class 7)", formulaVideoId: "" },
    11: { title: "Finding Common Ground", pptUrl: "https://drive.google.com/file/d/1TFSgekqFpsW8VqrHNkfnr6-gVukk2ZkG/preview", pptTitle: 'Finding Common Ground PPT', videoUrl: "https://drive.google.com/file/d/1yaWE9V03HIbXuthX0vd63mpiXSnv8k-j/preview", videoSummary: 'Discover LCM and HCF concepts.', tbUrl: "https://drive.google.com/file/d/1F3PMDh-BmYJfM3ztVr0BNrraIgzooJiP/preview", tbTitle: "Chapter 11 - Maths T.B. (Class 7)", formulaVideoId: "" },
    12: { title: "Another Peek Beyond the Point", pptUrl: "https://drive.google.com/file/d/1T-9lSIMekwNm0j0XJdIr_dnxwolf8hXB/preview", pptTitle: 'Another Peek Beyond the Point PPT', videoUrl: "https://drive.google.com/file/d/1jzYmHtHZMdp4de_nV1c8Xe9u960fi7ZD/preview", videoSummary: 'Advanced decimal operations and conversions.', tbUrl: "https://drive.google.com/file/d/17lA6-oyJBKqFoZ0DKlsrwHVYepGMNYRi/preview", tbTitle: "Chapter 12 - Maths T.B. (Class 7)", formulaVideoId: "" },
    13: { title: "Connecting the Dots", pptUrl: "https://drive.google.com/file/d/1h4s3Zs3czMcGU7oWWJaBJYY7cxKeO2VX/preview", pptTitle: 'Connecting the Dots PPT', videoUrl: "https://drive.google.com/file/d/1ASQposMDvgLpnZrImpfOHdX4SHJ18JOs/preview", videoSummary: 'Learn about coordinates and graphs.', tbUrl: "https://drive.google.com/file/d/1KBclaRaGhQBMdMWnuGftVrk8LyeZ0wF8/preview", tbTitle: "Chapter 13 - Maths T.B. (Class 7)", formulaVideoId: "" },
    14: { title: "Constructions and Tilings", pptUrl: "https://drive.google.com/file/d/1abaNUbx15SRQB57eDu9wm-L_G8gV9Vzm/preview", pptTitle: 'Constructions and Tilings PPT', videoUrl: "https://drive.google.com/file/d/17bAwK8jjRvDLZ5IJAOgWuz2v-C6jdAJS/preview", videoSummary: 'Master geometric constructions and tessellations.', tbUrl: "https://drive.google.com/file/d/1NQNn6WqdIWekahpNJ5nCTs3RR30eaOZU/preview", tbTitle: "Chapter 14 - Maths T.B. (Class 7)", formulaVideoId: "" },
    15: { title: "Finding the Unknown", pptUrl: "https://drive.google.com/file/d/1Z71FNDGqoCe9RokyCkR31N8BS26cp6zm/preview", pptTitle: 'Finding the Unknown PPT', videoUrl: "https://drive.google.com/file/d/1XhwisqNFJriBAo40l0tJ7kkdEDd91V1i/preview", videoSummary: 'Solve equations and find unknown values.', tbUrl: "https://drive.google.com/file/d/17myOn9QW3-AmvJR6MGmB8TmjL7XVObdW/preview", tbTitle: "Chapter 15 - Maths T.B. (Class 7)", formulaVideoId: "" }
};


console.log('Additional features loaded: Holidays, Languages, Chapter Media');

// ============================================
// BASICS SECTIONS - Pre-Chapter Foundation Worksheets
// Class 6: Class 1-5 fundamentals (12 worksheets, 5 MCQs each)
// Class 7: Class 1-6 fundamentals (12 worksheets, 5 MCQs each)
// All worksheets are UNLOCKED - no passing requirement
// Content sourced from Perplexity/NCERT research
// ============================================

const basicsWorksheets6 = [
    {
        id: "b6_1",
        title: "Number Sense & Place Value",
        desc: "Indian/International number system, place value, expanded form",
        topicContent: [{"name": "Indian Number System", "content": "In the Indian number system, we group digits starting from the right: Ones, Tens, Hundreds, Thousands, Ten Thousands, Lakhs, Ten Lakhs, Crores.\\n\\nExample: 8,74,865\\n\u2022 5 is in Ones place (value = 5)\\n\u2022 6 is in Tens place (value = 60)\\n\u2022 8 is in Hundreds place (value = 800)\\n\u2022 4 is in Thousands place (value = 4,000)\\n\u2022 7 is in Ten Thousands place (value = 70,000)\\n\u2022 8 is in Lakhs place (value = 8,00,000)\\n\\nCommas are placed after 3 digits from right, then every 2 digits: 8,74,865"}, {"name": "International Number System", "content": "In the International system, we group digits in sets of three from the right: Ones, Thousands, Millions, Billions.\\n\\nExample: 874,865\\n\u2022 Commas are placed every 3 digits from right\\n\u2022 874,865 = Eight hundred seventy-four thousand, eight hundred sixty-five\\n\\nConversion: 1 Lakh = 100 Thousand, 1 Crore = 10 Million"}, {"name": "Place Value & Expanded Form", "content": "Place Value = Face Value \u00d7 Position Value\\n\\nExample: In 32,405\\n\u2022 3 \u2192 3 \u00d7 10,000 = 30,000\\n\u2022 2 \u2192 2 \u00d7 1,000 = 2,000\\n\u2022 4 \u2192 4 \u00d7 100 = 400\\n\u2022 0 \u2192 0 \u00d7 10 = 0\\n\u2022 5 \u2192 5 \u00d7 1 = 5\\n\\nExpanded Form: 32,405 = 30,000 + 2,000 + 400 + 0 + 5\\n\\nSuccessor = Number + 1 (e.g., successor of 99,999 = 1,00,000)\\nPredecessor = Number - 1"}],
        questions: [
            { q: "What is the place value of 7 in 874,865?", options: ["7", "70,000", "7,000", "700"], answer: 1 , why: "The digit 7 is in the Ten Thousands place. Place Value = 7 × 10,000 = 70,000. Don\'t confuse face value (7) with place value (70,000)!"},
            { q: "Write 'Five lakh four thousand seven hundred seventy-eight' as a numeral.", options: ["5,04,778", "5,40,778", "54,778", "5,04,878"], answer: 0 , why: "Five lakh = 5,00,000. Four thousand = 4,000. Seven hundred seventy-eight = 778. So 5,00,000 + 4,000 + 778 = 5,04,778."},
            { q: "Which is the successor of 99,999?", options: ["1,00,001", "99,998", "1,00,000", "10,000"], answer: 2 , why: "Successor means the next number. 99,999 + 1 = 1,00,000. This is the smallest 6-digit number!"},
            { q: "What is the expanded form of 32,405?", options: ["30,000 + 2,000 + 400 + 5", "3,000 + 200 + 40 + 5", "30,000 + 200 + 40 + 5", "30,000 + 2,000 + 40 + 5"], answer: 0 , why: "32,405 = 30,000 + 2,000 + 400 + 0 + 5. Break each digit by its place value and add them together."},
            { q: "Which number is greatest: 45,786 or 45,768 or 45,876 or 45,687?", options: ["45,786", "45,768", "45,876", "45,687"], answer: 2 , why: "Compare digit by digit from left: all start with 45. Third digit: 8>7>6. So 45,876 is the greatest."},
        ]
    },
    {
        id: "b6_2",
        title: "Addition & Subtraction",
        desc: "Multi-digit addition, subtraction, word problems with carrying/borrowing",
        topicContent: [{"name": "Multi-digit Addition", "content": "Steps for multi-digit addition:\\n1. Write numbers one below the other, aligning place values\\n2. Start adding from the Ones column (rightmost)\\n3. If sum \u2265 10, write the ones digit and carry the tens digit\\n\\nExample: 4,567 + 3,894\\n  4567\\n+ 3894\\n------\\n  8461\\n\\nCarry: 7+4=11 (write 1, carry 1), 6+9+1=16 (write 6, carry 1), 5+8+1=14 (write 4, carry 1), 4+3+1=8"}, {"name": "Multi-digit Subtraction", "content": "Steps for subtraction with borrowing:\\n1. Align numbers by place value\\n2. Start from the rightmost column\\n3. If top digit < bottom digit, borrow 10 from the next column\\n\\nExample: 8,003 - 2,567\\n  8003\\n- 2567\\n------\\n  5436\\n\\nBorrowing: 3 can't subtract 7, borrow from hundreds \u2192 but 0, borrow from thousands \u2192 8 becomes 7, 0 becomes 10, then 0 becomes 9, 3 becomes 13. Now: 13-7=6, 9-6=3, 9-5=4, 7-2=5"}, {"name": "Word Problems", "content": "Key words to identify operations:\\n\u2022 Addition: total, sum, altogether, combined, in all\\n\u2022 Subtraction: difference, remaining, left, less than, how many more\\n\\nExample: A school has 2,456 boys and 1,893 girls. How many students in total?\\nSolution: 2,456 + 1,893 = 4,349 students\\n\\nTip: Always read the question carefully and identify what operation to use!"}],
        questions: [
            { q: "What is 4,567 + 3,894?", options: ["8,461", "8,361", "8,451", "7,461"], answer: 0 , why: "4,567 + 3,894: Add column by column from right. 7+4=11 (carry 1), 6+9+1=16 (carry 1), 5+8+1=14 (carry 1), 4+3+1=8. Answer: 8,461."},
            { q: "Subtract: 8,003 - 2,567 = ?", options: ["5,536", "5,436", "5,346", "6,436"], answer: 1 , why: "8,003 - 2,567: Borrow from thousands since hundreds and tens are 0. 13-7=6, 9-6=3, 9-5=4, 7-2=5. Answer: 5,436."},
            { q: "A school has 2,345 boys and 1,987 girls. How many students in total?", options: ["4,232", "4,332", "3,332", "4,342"], answer: 1 , why: "Total students = boys + girls = 2,456 + 1,893 = 4,349. The keyword \'total\' tells us to add."},
            { q: "What is 10,000 - 4,628?", options: ["5,472", "5,372", "6,372", "5,382"], answer: 1 , why: "When we borrow, the digit we borrow from decreases by 1, and the current digit gets +10. This is regrouping."},
            { q: "Find the sum: 1,234 + 2,345 + 3,456 = ?", options: ["7,035", "6,035", "7,135", "6,935"], answer: 0 , why: "Estimate by rounding to nearest thousand first, then add. This gives a quick approximate answer."},
        ]
    },
    {
        id: "b6_3",
        title: "Multiplication & Division",
        desc: "Tables, long multiplication, long division, remainders",
        topicContent: [{"name": "Multiplication Tables & Long Multiplication", "content": "Long Multiplication steps:\\n1. Multiply by ones digit\\n2. Multiply by tens digit (add a zero)\\n3. Add the results\\n\\nExample: 234 \u00d7 56\\n  234 \u00d7 6 = 1,404\\n  234 \u00d7 50 = 11,700\\n  Total = 1,404 + 11,700 = 13,104\\n\\nTip: Know your tables from 2 to 20 for speed!"}, {"name": "Long Division", "content": "Steps: Divide \u2192 Multiply \u2192 Subtract \u2192 Bring down (DMSB)\\n\\nExample: 2,019 \u00f7 3\\n\u2022 2 \u00f7 3 = 0 remainder 2\\n\u2022 20 \u00f7 3 = 6 remainder 2\\n\u2022 21 \u00f7 3 = 7 remainder 0\\n\u2022 09 \u00f7 3 = 3 remainder 0\\nAnswer: 673\\n\\nImportant: Division by 0 is UNDEFINED (not 0, not 1)!"}, {"name": "Remainders", "content": "When a number doesn't divide evenly, we get a remainder.\\n\\nDividend = Divisor \u00d7 Quotient + Remainder\\n\\nExample: 17 \u00f7 5 = 3 remainder 2\\nCheck: 5 \u00d7 3 + 2 = 15 + 2 = 17 \u2713\\n\\nThe remainder is always less than the divisor."}],
        questions: [
            { q: "What is 25 x 5?", options: ["120", "125", "115", "130"], answer: 1 , why: "25 × 5 = 125. Use the table of 25 or break it: 25 × 5 = (20 × 5) + (5 × 5) = 100 + 25 = 125."},
            { q: "What is 2,019 \u00f7 0?", options: ["0", "2,019", "1", "Undefined"], answer: 3 , why: "Division by 0 is undefined! You cannot divide anything into 0 groups. This is a fundamental math rule."},
            { q: "Find: 456 x 23 = ?", options: ["10,488", "10,388", "10,588", "9,488"], answer: 0 , why: "84 ÷ 7 = 12. Check: 12 × 7 = 84 ✓. Use long division: 7 goes into 84 twelve times."},
            { q: "What is the remainder when 257 is divided by 6?", options: ["1", "3", "5", "2"], answer: 0 , why: "156 × 23: Break it as 156×20 + 156×3 = 3120 + 468 = 3,588."},
            { q: "If 15 x ___ = 225, what is the missing number?", options: ["25", "15", "20", "12"], answer: 1 , why: "Dividend = Divisor × Quotient + Remainder. Always verify your division by this formula."},
        ]
    },
    {
        id: "b6_4",
        title: "BODMAS & Brackets",
        desc: "Order of operations: Brackets, Of, Division, Multiplication, Addition, Subtraction",
        topicContent: [{"name": "BODMAS Rule", "content": "BODMAS tells us the order to solve expressions:\\n\\nB - Brackets (solve first)\\nO - Of (means multiplication)\\nD - Division\\nM - Multiplication\\nA - Addition\\nS - Subtraction\\n\\nD and M have equal priority (left to right)\\nA and S have equal priority (left to right)\\n\\nExample: 8 + 4 \u00d7 3 = 8 + 12 = 20 (NOT 36!)\\nMultiplication comes before addition."}, {"name": "Types of Brackets", "content": "Three types of brackets (solve innermost first):\\n\\n( ) \u2192 Parentheses / Round brackets (solve first)\\n{ } \u2192 Curly brackets / Braces (solve second)\\n[ ] \u2192 Square brackets (solve third)\\n\\nExample: [2 + {3 \u00d7 (4 + 1)}]\\n= [2 + {3 \u00d7 5}]\\n= [2 + 15]\\n= 17"}],
        questions: [
            { q: "Solve: 1 + 2 \u00f7 3 x 4 = ?", options: ["4", "3.67", "3", "2"], answer: 0 , why: "BODMAS: Do multiplication before addition. 8 + 4 × 3 = 8 + 12 = 20, NOT (8+4) × 3 = 36."},
            { q: "Solve: 4 + (5 + 6) = ?", options: ["15", "56", "10", "46"], answer: 0 , why: "Solve innermost brackets first: ( ) then { } then [ ]. Work from inside out."},
            { q: "Solve: 1 \u2013 {(2 + 3) \u00f7 (4 \u2013 5)} = ?", options: ["6", "-4", "4", "Not defined"], answer: 0 , why: "Of means multiplication. \'½ of 20\' = ½ × 20 = 10. \'Of\' comes after Brackets in BODMAS."},
            { q: "Solve: 18 \u00f7 (3 x 2) + 5 = ?", options: ["8", "11", "17", "6"], answer: 0 , why: "Division and multiplication have equal priority - do them left to right."},
            { q: "Solve: (8 + 2) x (7 - 3) = ?", options: ["44", "40", "36", "48"], answer: 1 , why: "Addition and subtraction have equal priority - do them left to right after D and M."},
        ]
    },
    {
        id: "b6_5",
        title: "Factors & Multiples",
        desc: "Divisibility rules, prime/composite, HCF, LCM",
        topicContent: [{"name": "Factors & Divisibility Rules", "content": "A factor divides a number exactly (remainder = 0).\\n\\nDivisibility Rules:\\n\u2022 By 2: Last digit is even (0,2,4,6,8)\\n\u2022 By 3: Sum of digits divisible by 3\\n\u2022 By 4: Last 2 digits divisible by 4\\n\u2022 By 5: Last digit is 0 or 5\\n\u2022 By 6: Divisible by both 2 AND 3\\n\u2022 By 9: Sum of digits divisible by 9\\n\u2022 By 10: Last digit is 0\\n\\nExample: Is 372 divisible by 6?\\nBy 2? Yes (last digit 2). By 3? 3+7+2=12 (yes). So YES!"}, {"name": "Prime & Composite Numbers", "content": "Prime Number: Has exactly 2 factors (1 and itself)\\nExamples: 2, 3, 5, 7, 11, 13, 17, 19, 23...\\n\\nComposite Number: Has more than 2 factors\\nExamples: 4, 6, 8, 9, 10, 12...\\n\\nNote: 1 is neither prime nor composite!\\n2 is the only even prime number."}, {"name": "HCF & LCM", "content": "HCF (Highest Common Factor): Largest number that divides both numbers.\\nMethod: List factors or use prime factorization.\\n\\nLCM (Lowest Common Multiple): Smallest number divisible by both.\\nMethod: List multiples or use prime factorization.\\n\\nExample: HCF(12, 18)\\nFactors of 12: 1,2,3,4,6,12\\nFactors of 18: 1,2,3,6,9,18\\nHCF = 6\\n\\nLCM(12, 18)\\nMultiples of 12: 12,24,36...\\nMultiples of 18: 18,36...\\nLCM = 36\\n\\nFormula: HCF \u00d7 LCM = Product of numbers"}],
        questions: [
            { q: "Which of the following is a prime number?", options: ["15", "21", "23", "27"], answer: 2 , why: "Divisibility by 6: Number must be divisible by BOTH 2 and 3. Check: even number? Sum of digits divisible by 3?"},
            { q: "Find the LCM of 4, 8, and 12.", options: ["48", "24", "12", "96"], answer: 1 , why: "2 is the only even prime number. All other even numbers have 2 as a factor, so they\'re composite."},
            { q: "What is the HCF of 18 and 24?", options: ["4", "6", "8", "12"], answer: 1 , why: "HCF: List all factors of both numbers, find the highest common one. Or use prime factorization and take common primes with lowest powers."},
            { q: "Which number is divisible by both 3 and 5?", options: ["20", "25", "30", "35"], answer: 2 , why: "LCM: Find the smallest number divisible by both. Use prime factorization and take all primes with highest powers."},
            { q: "Prime factorization of 48 is:", options: ["2\u2074 x 3", "2\u00b3 x 6", "4 x 12", "2\u00b2 x 12"], answer: 0 , why: "HCF × LCM = Product of the two numbers. This is a useful formula to verify your answers!"},
        ]
    },
    {
        id: "b6_6",
        title: "Fractions",
        desc: "Equivalent fractions, comparison, addition, subtraction, simplification",
        topicContent: [{"name": "Understanding Fractions", "content": "A fraction represents a part of a whole.\\n\\nFraction = Numerator / Denominator\\n\\nTypes:\\n\u2022 Proper: Numerator < Denominator (e.g., 3/4)\\n\u2022 Improper: Numerator \u2265 Denominator (e.g., 7/4)\\n\u2022 Mixed: Whole + Fraction (e.g., 1\u00be)\\n\\nConversion: 7/4 = 1\u00be (divide 7\u00f74 = 1 remainder 3)"}, {"name": "Equivalent Fractions & Simplification", "content": "Equivalent fractions have the same value.\\nMultiply or divide both numerator and denominator by the same number.\\n\\n1/2 = 2/4 = 3/6 = 4/8 (all equal!)\\n\\nSimplification: Divide by HCF\\nExample: 12/18 \u2192 HCF is 6 \u2192 12\u00f76 / 18\u00f76 = 2/3"}, {"name": "Operations with Fractions", "content": "Addition/Subtraction: Make denominators same (LCM), then add/subtract numerators.\\n\\nExample: 1/3 + 1/4\\nLCM of 3,4 = 12\\n= 4/12 + 3/12 = 7/12\\n\\nComparison: Cross multiply\\n3/4 vs 2/3 \u2192 3\u00d73=9 vs 4\u00d72=8 \u2192 3/4 > 2/3"}],
        questions: [
            { q: "Simplify: 1/2 + 3/4 = ?", options: ["4/6", "5/4", "1", "2/4"], answer: 1 , why: "To convert improper fraction to mixed: Divide numerator by denominator. Quotient = whole part, remainder = new numerator."},
            { q: "Which fraction is equivalent to 2/3?", options: ["3/4", "4/6", "5/6", "6/12"], answer: 1 , why: "Equivalent fractions: Multiply or divide both top and bottom by the same number. The value stays the same!"},
            { q: "Subtract: 5/6 - 1/3 = ?", options: ["4/6", "1/2", "2/3", "1/6"], answer: 1 , why: "To add fractions with different denominators: Find LCM of denominators, convert both fractions, then add numerators."},
            { q: "Compare: Which is larger, 3/4 or 7/8?", options: ["3/4", "They are equal", "Cannot compare", "7/8"], answer: 3 , why: "Cross multiplication for comparison: a/b vs c/d → compare a×d with b×c."},
            { q: "Convert 91/10 to a decimal.", options: ["0.91", "9.1", "91.0", "9.01"], answer: 1 , why: "To simplify a fraction: Divide both numerator and denominator by their HCF."},
        ]
    },
    {
        id: "b6_7",
        title: "Decimals",
        desc: "Decimal place value, comparison, addition, subtraction, conversion",
        topicContent: [{"name": "Decimal Place Value", "content": "Decimals extend place value to the right of the decimal point.\\n\\nOnes . Tenths Hundredths Thousandths\\n  1   .   1/10    1/100     1/1000\\n\\nExample: 3.45\\n3 = 3 ones\\n4 = 4 tenths (4/10)\\n5 = 5 hundredths (5/100)\\n\\n0.1 = 1/10, 0.01 = 1/100, 0.001 = 1/1000"}, {"name": "Decimal Operations", "content": "Addition/Subtraction: Align decimal points, then add/subtract normally.\\n\\nExample: 3.45 + 2.7\\n  3.45\\n+ 2.70 (add zero to align)\\n------\\n  6.15\\n\\nComparing: Compare digit by digit from left.\\n0.45 vs 0.5 \u2192 0.45 < 0.50\\n\\nConversion: Fraction \u2194 Decimal\\n1/4 = 0.25, 3/5 = 0.6, 7/8 = 0.875"}],
        questions: [
            { q: "Add: 0.1 + 1.2 + 12.3 = ?", options: ["13.6", "12.6", "14.6", "13.5"], answer: 0 , why: "0.1 = 1/10, 0.01 = 1/100. Each position after decimal point is 10× smaller."},
            { q: "Which is greater: 0.45 or 0.405?", options: ["0.405", "They are equal", "0.45", "Cannot compare"], answer: 2 , why: "Align decimal points when adding/subtracting. Add trailing zeros if needed: 3.45 + 2.7 = 3.45 + 2.70 = 6.15."},
            { q: "Convert 3/5 to a decimal.", options: ["0.35", "0.6", "0.53", "0.3"], answer: 1 , why: "To compare decimals: Add trailing zeros to make same decimal places, then compare as whole numbers."},
            { q: "Subtract: 5.03 - 2.7 = ?", options: ["2.33", "2.43", "3.33", "2.36"], answer: 0 , why: "Fraction to decimal: Divide numerator by denominator. 3/4 = 3 ÷ 4 = 0.75."},
            { q: "Round 4.567 to one decimal place.", options: ["4.5", "4.6", "4.56", "5.0"], answer: 1 , why: "Decimal to fraction: 0.25 = 25/100 = 1/4 (simplify by dividing by HCF)."},
        ]
    },
    {
        id: "b6_8",
        title: "Negative Numbers & Integers",
        desc: "Number line, comparing, addition and subtraction with negatives",
        topicContent: [{"name": "Negative Numbers on the Number Line", "content": "The number line extends in both directions:\\n\\n\u2190... -4  -3  -2  -1  0  1  2  3  4 ...\u2192\\n\\nNumbers to the right are greater.\\nNumbers to the left are smaller.\\n\\n-3 < -1 < 0 < 2 < 5\\n\\nOpposite of 3 is -3 (same distance from 0, opposite side)"}, {"name": "Integer Operations", "content": "Addition Rules:\\n\u2022 Same signs: Add and keep the sign\\n  (+3) + (+5) = +8\\n  (-3) + (-5) = -8\\n\u2022 Different signs: Subtract and keep sign of larger\\n  (+7) + (-3) = +4\\n  (-7) + (+3) = -4\\n\\nSubtraction: Change to addition of opposite\\n  5 - (-3) = 5 + 3 = 8\\n  -5 - 3 = -5 + (-3) = -8"}],
        questions: [
            { q: "What is -89 + 98?", options: ["9", "-9", "187", "-187"], answer: 0 , why: "On the number line, numbers to the RIGHT are greater. So -1 > -3 because -1 is to the right of -3."},
            { q: "What is -985 - 689?", options: ["296", "-296", "1,674", "-1,674"], answer: 3 , why: "Same signs: Add magnitudes, keep the sign. (+5)+(+3)=+8, (-5)+(-3)=-8."},
            { q: "What is -5 + 6?", options: ["-11", "11", "1", "-1"], answer: 2 , why: "Different signs: Subtract smaller from larger magnitude, keep sign of larger. (+7)+(-3)=+4."},
            { q: "How many integers are between -6 and 6 (not including -6 and 6)?", options: ["13", "12", "11", "10"], answer: 2 , why: "Subtracting a negative = adding a positive. 5-(-3) = 5+3 = 8. Two negatives make a positive!"},
            { q: "The sum of two odd numbers is always:", options: ["Odd", "Even", "Prime", "Negative"], answer: 1 , why: "Absolute value |x| = distance from 0. Always positive. |-5| = 5, |3| = 3."},
        ]
    },
    {
        id: "b6_9",
        title: "Measurement & Units",
        desc: "Length, weight, capacity conversions, time calculations",
        topicContent: [{"name": "Length, Weight & Capacity", "content": "Length: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm\\n\\nWeight: 1 kg = 1000 g, 1 g = 1000 mg\\n\\nCapacity: 1 L = 1000 mL\\n\\nConversion: Multiply to go smaller, Divide to go bigger.\\nExample: 3.5 km = 3.5 \u00d7 1000 = 3500 m\\nExample: 2500 g = 2500 \u00f7 1000 = 2.5 kg"}, {"name": "Time Calculations", "content": "1 hour = 60 minutes, 1 minute = 60 seconds\\n1 day = 24 hours\\n\\nAdding Time:\\n2 hours 45 min + 1 hour 30 min\\n= 3 hours 75 min = 4 hours 15 min\\n\\n24-hour clock: 1:00 PM = 13:00, 9:30 PM = 21:30\\nFormula: PM time = 12 + hour"}],
        questions: [
            { q: "How many centimeters are in 2.5 meters?", options: ["25", "250", "2500", "0.25"], answer: 1 , why: "To convert km to m: Multiply by 1000. 3.5 km = 3500 m. Going to a smaller unit = multiply."},
            { q: "Convert 3 km 500 m to meters.", options: ["3,500 m", "3,050 m", "350 m", "35,000 m"], answer: 0 , why: "To convert g to kg: Divide by 1000. 2500 g = 2.5 kg. Going to a bigger unit = divide."},
            { q: "How many minutes are in 2 hours 15 minutes?", options: ["215", "135", "125", "145"], answer: 1 , why: "Time addition: Add hours and minutes separately. If minutes ≥ 60, subtract 60 and add 1 to hours."},
            { q: "1 kg = ___ grams", options: ["10", "100", "1,000", "10,000"], answer: 2 , why: "24-hour clock: Add 12 to PM hours. 3:30 PM = 15:30. Midnight = 00:00, Noon = 12:00."},
            { q: "A water bottle holds 1.5 litres. How many ml is that?", options: ["150 ml", "1,500 ml", "15 ml", "15,000 ml"], answer: 1 , why: "Always check your unit conversions! Write the conversion factor and cancel units to verify."},
        ]
    },
    {
        id: "b6_10",
        title: "Geometry Basics",
        desc: "Points, lines, rays, angles, types of triangles",
        topicContent: [{"name": "Points, Lines, Rays & Segments", "content": "Point: A location with no size (marked with a dot)\\nLine: Extends infinitely in both directions (\u2190\u2192)\\nRay: Starts at a point and extends infinitely in one direction (\u2192)\\nLine Segment: Has two endpoints (definite length)\\n\\nCollinear Points: Points on the same line\\nIntersecting Lines: Lines that cross at a point"}, {"name": "Angles & Their Types", "content": "An angle is formed when two rays share a common endpoint (vertex).\\n\\nTypes of Angles:\\n\u2022 Acute: Less than 90\u00b0 (e.g., 45\u00b0, 60\u00b0)\\n\u2022 Right: Exactly 90\u00b0\\n\u2022 Obtuse: Between 90\u00b0 and 180\u00b0 (e.g., 120\u00b0)\\n\u2022 Straight: Exactly 180\u00b0\\n\u2022 Reflex: Between 180\u00b0 and 360\u00b0\\n\\nComplementary: Two angles that add up to 90\u00b0\\nSupplementary: Two angles that add up to 180\u00b0"}, {"name": "Types of Triangles", "content": "By Sides:\\n\u2022 Equilateral: All 3 sides equal, all angles 60\u00b0\\n\u2022 Isosceles: 2 sides equal, 2 angles equal\\n\u2022 Scalene: All sides different\\n\\nBy Angles:\\n\u2022 Acute: All angles < 90\u00b0\\n\u2022 Right: One angle = 90\u00b0\\n\u2022 Obtuse: One angle > 90\u00b0\\n\\nAngle Sum Property: Sum of all angles in a triangle = 180\u00b0"}],
        questions: [
            { q: "How many endpoints does a ray have?", options: ["0", "1", "2", "3"], answer: 1 , why: "A line extends infinitely in both directions (no endpoints). A line segment has two endpoints. A ray has one endpoint."},
            { q: "A triangle with all three sides equal is called:", options: ["Isosceles", "Scalene", "Equilateral", "Right-angled"], answer: 2 , why: "Complementary angles add up to 90°. If one angle is 35°, the other is 90° - 35° = 55°."},
            { q: "An angle that measures exactly 90\u00b0 is called:", options: ["Acute", "Obtuse", "Right", "Straight"], answer: 2 , why: "Supplementary angles add up to 180°. If one angle is 110°, the other is 180° - 110° = 70°."},
            { q: "How many sides does a quadrilateral have?", options: ["3", "4", "5", "6"], answer: 1 , why: "Angle Sum Property: All three angles of a triangle always add up to exactly 180°."},
            { q: "Two lines that never meet are called:", options: ["Intersecting", "Perpendicular", "Parallel", "Concurrent"], answer: 2 , why: "Vertically opposite angles are equal. When two lines cross, the angles facing each other are equal."},
        ]
    },
    {
        id: "b6_11",
        title: "Perimeter & Area",
        desc: "Perimeter and area of rectangles, squares, triangles",
        topicContent: [{"name": "Perimeter", "content": "Perimeter = Total length around a shape\\n\\nRectangle: P = 2 \u00d7 (length + breadth)\\nSquare: P = 4 \u00d7 side\\nTriangle: P = side\u2081 + side\u2082 + side\u2083\\n\\nExample: Rectangle with l=8cm, b=5cm\\nP = 2 \u00d7 (8 + 5) = 2 \u00d7 13 = 26 cm"}, {"name": "Area", "content": "Area = Space occupied by a flat shape\\n\\nRectangle: A = length \u00d7 breadth\\nSquare: A = side \u00d7 side = side\u00b2\\nTriangle: A = \u00bd \u00d7 base \u00d7 height\\n\\nExample: Square with side 6cm\\nA = 6 \u00d7 6 = 36 cm\u00b2\\n\\nUnits: Area is always in square units (cm\u00b2, m\u00b2, km\u00b2)"}],
        questions: [
            { q: "Find the perimeter of a rectangle with length 12 cm and breadth 8 cm.", options: ["96 cm", "40 cm", "20 cm", "80 cm"], answer: 1 , why: "Rectangle perimeter = 2(l+b). Don\'t forget to multiply by 2 for both pairs of sides!"},
            { q: "Area of a square with side 9 cm is:", options: ["36 cm\u00b2", "81 cm\u00b2", "18 cm\u00b2", "72 cm\u00b2"], answer: 1 , why: "Square area = side × side = side². All sides are equal, so just square one side."},
            { q: "Find the area of a rectangle with length 15 m and breadth 6 m.", options: ["42 m\u00b2", "90 m\u00b2", "21 m\u00b2", "180 m\u00b2"], answer: 1 , why: "Triangle area = ½ × base × height. The height must be perpendicular to the base."},
            { q: "The perimeter of a square is 48 cm. What is the side length?", options: ["8 cm", "12 cm", "16 cm", "24 cm"], answer: 1 , why: "Area is measured in square units (cm², m²) because we\'re measuring 2D space."},
            { q: "Area of a triangle with base 10 cm and height 6 cm is:", options: ["60 cm\u00b2", "30 cm\u00b2", "16 cm\u00b2", "36 cm\u00b2"], answer: 1 , why: "Perimeter is measured in linear units (cm, m) because it\'s just the total length around the shape."},
        ]
    },
    {
        id: "b6_12",
        title: "Data Handling & Patterns",
        desc: "Tally marks, bar graphs, number patterns, sequences",
        topicContent: [{"name": "Tally Marks & Bar Graphs", "content": "Tally Marks: Used to count data in groups of 5\\n| = 1, || = 2, ||| = 3, |||| = 4, \u29f8|||| = 5\\n\\nBar Graph: Uses rectangular bars to represent data.\\n\u2022 Each bar has equal width\\n\u2022 Height shows the value\\n\u2022 Bars can be vertical or horizontal\\n\u2022 Always label axes and give a title"}, {"name": "Number Patterns & Sequences", "content": "Arithmetic Pattern: Same number added each time\\n2, 5, 8, 11, 14... (adding 3 each time)\\n\\nGeometric Pattern: Same number multiplied each time\\n2, 6, 18, 54... (multiplying by 3)\\n\\nTriangular Numbers: 1, 3, 6, 10, 15, 21...\\n(Add 1, then 2, then 3, then 4...)\\n\\nSquare Numbers: 1, 4, 9, 16, 25, 36...\\n(1\u00b2, 2\u00b2, 3\u00b2, 4\u00b2, 5\u00b2, 6\u00b2)"}],
        questions: [
            { q: "In a tally chart, how is the number 7 represented?", options: ["IIII II", "IIII III", "III IIII", "IIIIIII"], answer: 0 , why: "In a bar graph, the height of each bar represents the data value. Taller bar = larger value."},
            { q: "What comes next in the pattern: 2, 6, 18, 54, ___?", options: ["72", "108", "162", "216"], answer: 2 , why: "Tally marks: Group in 5s (||||) for easy counting. The 5th mark crosses the previous 4 diagonally."},
            { q: "In a bar graph, the tallest bar represents:", options: ["The smallest value", "The average value", "The largest value", "The median"], answer: 2 , why: "To find the mean (average): Add all values, then divide by how many values there are."},
            { q: "Find the next number: 5, 10, 20, 40, ___?", options: ["50", "60", "80", "100"], answer: 2 , why: "In arithmetic patterns, find the common difference by subtracting consecutive terms."},
            { q: "The mean (average) of 4, 8, 6, 10, 12 is:", options: ["6", "8", "10", "12"], answer: 1 , why: "Square numbers: 1, 4, 9, 16, 25... They\'re called square because they form perfect squares (1², 2², 3²...)."},
        ]
    },
];

const basicsWorksheets7 = [
    {
        id: "b7_1",
        title: "Large Numbers & Estimation",
        desc: "Indian/International system, rounding, estimation in lakhs and crores",
        topicContent: [{"name": "Indian & International System for Large Numbers", "content": "Indian System: ...Crores, Lakhs, Thousands, Hundreds, Tens, Ones\\n1 Lakh = 1,00,000\\n1 Crore = 1,00,00,000\\n\\nInternational System: ...Millions, Thousands, Ones\\n1 Million = 10,00,000 = 10 Lakhs\\n1 Billion = 1,00,00,00,000 = 100 Crores\\n\\nExample: 3,25,47,000\\nIndian: Three crore twenty-five lakh forty-seven thousand\\nInternational: 32,547,000 = Thirty-two million five hundred forty-seven thousand"}, {"name": "Estimation & Rounding", "content": "Rounding Rules:\\n\u2022 If digit < 5: Round down\\n\u2022 If digit \u2265 5: Round up\\n\\nRound 4,738 to nearest hundred: Look at tens (3 < 5) \u2192 4,700\\nRound 4,768 to nearest hundred: Look at tens (6 \u2265 5) \u2192 4,800\\n\\nEstimation: Round numbers first, then calculate.\\nEstimate 489 \u00d7 21 \u2248 500 \u00d7 20 = 10,000"}],
        questions: [
            { q: "What is 1 crore in the International system?", options: ["1 million", "10 million", "100 million", "1 billion"], answer: 1 , why: "In the Indian system, commas go after 3 digits from right, then every 2. In International, every 3 digits."},
            { q: "Round 4,56,789 to the nearest thousand.", options: ["4,56,000", "4,57,000", "4,60,000", "5,00,000"], answer: 1 , why: "Rounding: Look at the digit to the right of the position. If ≥5, round up; if <5, round down."},
            { q: "The predecessor of 10,00,000 is:", options: ["9,99,999", "10,00,001", "99,999", "9,99,000"], answer: 0 , why: "Estimation helps verify your answers. Round to easy numbers, calculate, then compare with your exact answer."},
            { q: "How many zeros are in 1 lakh?", options: ["4", "5", "6", "7"], answer: 1 , why: "1 Lakh = 100 Thousand, 1 Crore = 10 Million. Use these conversions between Indian and International systems."},
            { q: "Estimate 3,879 + 5,142 to the nearest hundred.", options: ["9,000", "9,100", "9,020", "8,900"], answer: 0 , why: "The successor of a number is number + 1. The predecessor is number - 1. Simple but important!"},
        ]
    },
    {
        id: "b7_2",
        title: "Whole Number Properties",
        desc: "Closure, commutative, associative, distributive properties",
        topicContent: [{"name": "Properties of Whole Numbers", "content": "Closure Property:\\n\u2022 Addition: a + b is always a whole number \u2713\\n\u2022 Subtraction: a - b may NOT be a whole number \u2717 (e.g., 3-5 = -2)\\n\u2022 Multiplication: a \u00d7 b is always a whole number \u2713\\n\u2022 Division: a \u00f7 b may NOT be a whole number \u2717\\n\\nCommutative Property:\\n\u2022 a + b = b + a \u2713\\n\u2022 a \u00d7 b = b \u00d7 a \u2713\\n\u2022 a - b \u2260 b - a \u2717\\n\u2022 a \u00f7 b \u2260 b \u00f7 a \u2717"}, {"name": "Associative & Distributive Properties", "content": "Associative Property:\\n(a + b) + c = a + (b + c) \u2713 for addition\\n(a \u00d7 b) \u00d7 c = a \u00d7 (b \u00d7 c) \u2713 for multiplication\\n\\nDistributive Property:\\na \u00d7 (b + c) = a\u00d7b + a\u00d7c\\n\\nExample: 15 \u00d7 102 = 15 \u00d7 (100 + 2) = 1500 + 30 = 1530\\n\\nIdentity Elements:\\nAdditive Identity: a + 0 = a\\nMultiplicative Identity: a \u00d7 1 = a"}],
        questions: [
            { q: "Which property states a + b = b + a?", options: ["Associative", "Commutative", "Distributive", "Closure"], answer: 1 , why: "Closure: If doing an operation on two whole numbers always gives a whole number, the operation is \'closed\'."},
            { q: "Find: 25 x 98 using distributive property = 25 x (100 - 2) = ?", options: ["2,450", "2,550", "2,350", "2,500"], answer: 0 , why: "Commutative: Order doesn\'t matter. a+b = b+a works, but a-b ≠ b-a (subtraction is NOT commutative)."},
            { q: "The additive identity (adding it gives the same number) is:", options: ["1", "0", "-1", "10"], answer: 1 , why: "Associative: Grouping doesn\'t matter. (a+b)+c = a+(b+c) for addition and multiplication only."},
            { q: "Which is true? (a x b) x c = a x (b x c) is the ___ property.", options: ["Commutative", "Distributive", "Associative", "Identity"], answer: 2 , why: "Distributive: a × (b+c) = a×b + a×c. This is super useful for mental math!"},
            { q: "Is subtraction commutative for whole numbers?", options: ["Yes, always", "No, never", "Only for positive numbers", "Only when a > b"], answer: 1 , why: "Identity elements: 0 for addition (a+0=a), 1 for multiplication (a×1=a). They don\'t change the number."},
        ]
    },
    {
        id: "b7_3",
        title: "BODMAS & Nested Brackets",
        desc: "Order of operations with (), {}, [], mixed operations",
        topicContent: [{"name": "BODMAS with Nested Brackets", "content": "Order of solving brackets:\\n1. ( ) Parentheses - innermost first\\n2. { } Braces\\n3. [ ] Square brackets\\n\\nThen: Of \u2192 Division \u2192 Multiplication \u2192 Addition \u2192 Subtraction\\n\\nExample: [{36 \u00f7 (8-2)} + 5] \u00d7 2\\n= [{36 \u00f7 6} + 5] \u00d7 2\\n= [6 + 5] \u00d7 2\\n= 11 \u00d7 2 = 22"}, {"name": "Mixed Operations", "content": "When multiple operations appear, follow BODMAS strictly:\\n\\nExample: 48 \u00f7 8 + 3 \u00d7 2 - 1\\n= 6 + 6 - 1 (do \u00f7 and \u00d7 first, left to right)\\n= 11\\n\\nCommon Mistake: 8 + 4 \u00d7 3 \u2260 36\\nCorrect: 8 + 4 \u00d7 3 = 8 + 12 = 20\\n\\nTip: Use brackets to make your work clearer!"}],
        questions: [
            { q: "Solve: (2\u00b3 - 1) \u00f7 (4 + (-2)) = ?", options: ["3.5", "2.5", "7", "1.5"], answer: 0 , why: "Solve innermost brackets first: ( ) → { } → [ ]. Then follow BODMAS for the remaining operations."},
            { q: "Simplify: 48 \u00f7 [12 - {8 - (6 - 2)}] = ?", options: ["6", "8", "12", "48"], answer: 1 , why: "In BODMAS, Division and Multiplication have EQUAL priority. Solve left to right."},
            { q: "Solve: 5 + {3 x (8 - 2)} = ?", options: ["23", "66", "48", "33"], answer: 0 , why: "Common mistake: 8 + 4 × 3 ≠ 36. Multiplication comes before addition: 8 + 12 = 20."},
            { q: "Solve: 100 - [50 + {20 - (10 + 5)}] = ?", options: ["55", "45", "35", "65"], answer: 1 , why: "\'Of\' means multiplication in BODMAS. ⅓ of 12 = ⅓ × 12 = 4."},
            { q: "Solve: 6 x 4 - 3 x 2 + 8 \u00f7 4 = ?", options: ["20", "18", "22", "24"], answer: 0 , why: "Always show your working step by step. This helps avoid mistakes and makes it easy to check."},
        ]
    },
    {
        id: "b7_4",
        title: "Factors, HCF & LCM",
        desc: "Prime factorization, HCF by division, LCM by prime method",
        topicContent: [{"name": "Prime Factorization", "content": "Every composite number can be written as a product of primes.\\n\\nFactor Tree Method:\\n60 = 2 \u00d7 30\\n   = 2 \u00d7 2 \u00d7 15\\n   = 2 \u00d7 2 \u00d7 3 \u00d7 5\\n   = 2\u00b2 \u00d7 3 \u00d7 5\\n\\nDivision Method: Keep dividing by smallest prime\\n60 \u00f7 2 = 30\\n30 \u00f7 2 = 15\\n15 \u00f7 3 = 5\\n5 \u00f7 5 = 1\\n60 = 2 \u00d7 2 \u00d7 3 \u00d7 5"}, {"name": "HCF & LCM by Prime Factorization", "content": "HCF: Product of COMMON primes with LOWEST powers\\nLCM: Product of ALL primes with HIGHEST powers\\n\\nExample: Find HCF and LCM of 24 and 36\\n24 = 2\u00b3 \u00d7 3\\n36 = 2\u00b2 \u00d7 3\u00b2\\n\\nHCF = 2\u00b2 \u00d7 3 = 12 (common primes, lower powers)\\nLCM = 2\u00b3 \u00d7 3\u00b2 = 72 (all primes, higher powers)\\n\\nCheck: HCF \u00d7 LCM = 12 \u00d7 72 = 864 = 24 \u00d7 36 \u2713"}],
        questions: [
            { q: "Find HCF of 36 and 48.", options: ["6", "12", "24", "8"], answer: 1 , why: "Factor tree: Keep breaking numbers into factor pairs until all factors are prime."},
            { q: "Find LCM of 12, 15, and 20.", options: ["120", "60", "180", "240"], answer: 1 , why: "HCF by prime factorization: Take COMMON primes with SMALLEST powers."},
            { q: "Prime factorization of 72 is:", options: ["2\u00b3 x 3\u00b2", "2\u00b2 x 3\u00b3", "2 x 36", "4 x 18"], answer: 0 , why: "LCM by prime factorization: Take ALL primes with LARGEST powers."},
            { q: "The product of HCF and LCM of two numbers equals:", options: ["Sum of the numbers", "Difference of the numbers", "Product of the numbers", "Average of the numbers"], answer: 2 , why: "Quick check: HCF × LCM = Product of the two numbers. Always verify!"},
            { q: "Is 91 a prime number?", options: ["Yes", "No, 91 = 7 x 13", "No, 91 = 9 x 11", "No, 91 = 3 x 31"], answer: 1 , why: "Every number\'s prime factorization is unique (Fundamental Theorem of Arithmetic)."},
        ]
    },
    {
        id: "b7_5",
        title: "Integers & Operations",
        desc: "Addition, subtraction, multiplication, division of integers",
        topicContent: [{"name": "Understanding Integers", "content": "Integers: ...,-3, -2, -1, 0, 1, 2, 3,...\\n\\nPositive integers: 1, 2, 3, ... (right of 0)\\nNegative integers: -1, -2, -3, ... (left of 0)\\nZero is neither positive nor negative.\\n\\nAbsolute Value: Distance from 0\\n|\u22125| = 5, |3| = 3, |0| = 0\\n\\nOrdering: -5 < -3 < -1 < 0 < 2 < 4"}, {"name": "Integer Arithmetic", "content": "Addition:\\n(+5) + (+3) = +8\\n(-5) + (-3) = -8\\n(+5) + (-3) = +2\\n(-5) + (+3) = -2\\n\\nSubtraction: Add the opposite\\na - b = a + (-b)\\n5 - (-3) = 5 + 3 = 8\\n\\nMultiplication/Division:\\n(+) \u00d7 (+) = (+)\\n(-) \u00d7 (-) = (+)\\n(+) \u00d7 (-) = (-)\\n(-) \u00d7 (+) = (-)"}],
        questions: [
            { q: "What is -7 x 2 \u00f7 (-5) + 3?", options: ["5.8", "0.2", "17.8", "-5.8"], answer: 0 , why: "Integer number line: ...,-3,-2,-1,0,1,2,3,... Numbers to the right are always greater."},
            { q: "What is the additive inverse of 7?", options: ["7", "-7", "0", "1/7"], answer: 1 , why: "Adding two negatives: Add the magnitudes, keep negative sign. (-3)+(-5) = -8."},
            { q: "Solve: (-15) + (-23) = ?", options: ["38", "-38", "8", "-8"], answer: 1 , why: "Multiplying/dividing signs: Same signs = positive, Different signs = negative."},
            { q: "Solve: (-48) \u00f7 8 = ?", options: ["6", "-6", "8", "-8"], answer: 1 , why: "Subtracting a negative = adding positive: 5-(-3) = 5+3 = 8."},
            { q: "Arrange in ascending order: -5, 3, -8, 0, 7", options: ["0, 3, 7, -5, -8", "-8, -5, 0, 3, 7", "7, 3, 0, -5, -8", "-5, -8, 0, 3, 7"], answer: 1 , why: "Zero is neither positive nor negative. It\'s the starting point of the number line."},
        ]
    },
    {
        id: "b7_6",
        title: "Fractions & Decimals Operations",
        desc: "Add, subtract, multiply, divide fractions and decimals",
        topicContent: [{"name": "Fraction Operations", "content": "Multiplication of Fractions:\\na/b \u00d7 c/d = (a\u00d7c)/(b\u00d7d)\\nExample: 2/3 \u00d7 4/5 = 8/15\\n\\nDivision of Fractions: Multiply by reciprocal\\na/b \u00f7 c/d = a/b \u00d7 d/c\\nExample: 2/3 \u00f7 4/5 = 2/3 \u00d7 5/4 = 10/12 = 5/6"}, {"name": "Decimal Operations", "content": "Multiplication of Decimals:\\nMultiply as whole numbers, then count decimal places.\\n2.5 \u00d7 1.3 = 25 \u00d7 13 = 325 \u2192 3.25 (2 decimal places)\\n\\nDivision of Decimals:\\nMake divisor a whole number by moving decimal.\\n4.5 \u00f7 0.5 = 45 \u00f7 5 = 9"}],
        questions: [
            { q: "Solve: 9/11 + 5/6 = ?", options: ["14/17", "109/66", "14/66", "54/66"], answer: 1 , why: "Multiplying fractions: Multiply numerators together and denominators together. Simplify if possible."},
            { q: "Solve: 0.3\u00b2 x 0.2\u00b3 = ?", options: ["0.00072", "0.072", "0.72", "0.0072"], answer: 0 , why: "Dividing fractions: Flip the second fraction (reciprocal) and multiply. a/b ÷ c/d = a/b × d/c."},
            { q: "Divide: 3/4 \u00f7 1/2 = ?", options: ["3/8", "3/2", "2/3", "6/4"], answer: 1 , why: "Decimal multiplication: Multiply as whole numbers, then count total decimal places in both numbers."},
            { q: "Convert 0.375 to a fraction in simplest form.", options: ["375/1000", "3/8", "37/100", "75/200"], answer: 1 , why: "Decimal division: Move decimal point in divisor to make it whole, move same in dividend."},
            { q: "Multiply: 2.5 x 0.4 = ?", options: ["10", "1.0", "0.1", "1"], answer: 1 , why: "Always simplify your final answer! Divide by common factors."},
        ]
    },
    {
        id: "b7_7",
        title: "Ratio & Proportion",
        desc: "Simplifying ratios, unitary method, cross multiplication",
        topicContent: [{"name": "Understanding Ratios", "content": "A ratio compares two quantities of the same kind.\\n\\nRatio of a to b = a : b = a/b\\n\\nSimplifying Ratios: Divide by HCF\\n12 : 18 \u2192 HCF = 6 \u2192 2 : 3\\n\\nEquivalent Ratios: Multiply/divide both parts by same number\\n2 : 3 = 4 : 6 = 6 : 9"}, {"name": "Proportion & Unitary Method", "content": "Proportion: Two equal ratios (a:b = c:d)\\nCross Multiplication: a\u00d7d = b\u00d7c\\n\\nUnitary Method: Find value of 1 unit first\\nExample: 5 pens cost \u20b960. What do 8 pens cost?\\n1 pen = \u20b960 \u00f7 5 = \u20b912\\n8 pens = \u20b912 \u00d7 8 = \u20b996"}],
        questions: [
            { q: "If a:b = 5:6, and b = 18, find a.", options: ["12", "15", "20", "10"], answer: 1 , why: "Ratio compares two quantities of the SAME kind. Always simplify by dividing both parts by HCF."},
            { q: "Solve: 3/4 = x/12. Find x.", options: ["9", "4", "16", "8"], answer: 0 , why: "Proportion: Two ratios are equal. a:b = c:d means a×d = b×c (cross multiplication)."},
            { q: "Simplify the ratio 48:64.", options: ["6:8", "3:4", "12:16", "24:32"], answer: 1 , why: "Unitary method: Find the value of 1 unit first, then multiply for required quantity."},
            { q: "If 5 pens cost Rs 60, how much do 8 pens cost?", options: ["Rs 80", "Rs 96", "Rs 48", "Rs 100"], answer: 1 , why: "Equivalent ratios: Multiply or divide both parts by the same number (like equivalent fractions)."},
            { q: "The ratio of boys to girls in a class is 3:2. If there are 18 boys, how many girls?", options: ["12", "10", "9", "15"], answer: 0 , why: "Speed, distance, time problems often use ratios and proportions."},
        ]
    },
    {
        id: "b7_8",
        title: "Algebra Basics",
        desc: "Algebraic expressions, evaluation, simple equations",
        topicContent: [{"name": "Algebraic Expressions", "content": "Variable: A letter representing an unknown number (x, y, n)\\nConstant: A fixed number (5, -3, 7)\\n\\nAlgebraic Expression: Combination of variables, constants and operations\\nExamples: 2x + 3, 5y - 7, 3a\u00b2 + 2a - 1\\n\\nTerms: Parts separated by + or -\\nIn 3x + 5y - 2: terms are 3x, 5y, -2\\nCoefficient: The number multiplied with variable (in 3x, coefficient is 3)"}, {"name": "Simple Equations", "content": "An equation has an = sign.\\n\\nSolving: Do the same operation on both sides.\\n\\nExample: 2x + 3 = 11\\n2x + 3 - 3 = 11 - 3\\n2x = 8\\nx = 8 \u00f7 2 = 4\\n\\nCheck: 2(4) + 3 = 8 + 3 = 11 \u2713\\n\\nTransposing: When a term moves across =, its sign changes.\\n2x + 3 = 11 \u2192 2x = 11 - 3 \u2192 2x = 8"}],
        questions: [
            { q: "If x = 2, find the value of 2x\u00b2 - 3x + 1.", options: ["3", "1", "5", "7"], answer: 0 , why: "Variable = letter for unknown, Constant = fixed number. In 3x+5: coefficient=3, variable=x, constant=5."},
            { q: "Simplify: 3a + 5a - 2a = ?", options: ["6a", "8a", "10a", "4a"], answer: 0 , why: "Like terms have the same variable part: 3x and 5x are like terms, but 3x and 3y are NOT."},
            { q: "Solve: x + 7 = 15. What is x?", options: ["22", "7", "8", "15"], answer: 2 , why: "Solving equations: Do the same operation on both sides to isolate the variable."},
            { q: "Factor: x\u00b2 + 4x + 4 = ?", options: ["(x+2)(x+2)", "(x+4)(x+1)", "(x+2)(x-2)", "(x-2)(x-2)"], answer: 0 , why: "Transposing: When moving a term to the other side, change its sign (+ becomes -, × becomes ÷)."},
            { q: "If 3x - 5 = 10, then x = ?", options: ["3", "5", "15", "7"], answer: 1 , why: "Always CHECK your answer by substituting it back into the original equation!"},
        ]
    },
    {
        id: "b7_9",
        title: "Geometry: Lines & Angles",
        desc: "Types of angles, complementary, supplementary, vertically opposite",
        topicContent: [{"name": "Types of Angles", "content": "Acute Angle: 0\u00b0 < angle < 90\u00b0\\nRight Angle: angle = 90\u00b0\\nObtuse Angle: 90\u00b0 < angle < 180\u00b0\\nStraight Angle: angle = 180\u00b0\\nReflex Angle: 180\u00b0 < angle < 360\u00b0\\nComplete Angle: angle = 360\u00b0"}, {"name": "Angle Relationships", "content": "Complementary Angles: Sum = 90\u00b0\\nIf one angle is 35\u00b0, complement = 90\u00b0 - 35\u00b0 = 55\u00b0\\n\\nSupplementary Angles: Sum = 180\u00b0\\nIf one angle is 110\u00b0, supplement = 180\u00b0 - 110\u00b0 = 70\u00b0\\n\\nVertically Opposite Angles: Equal when two lines cross\\nLinear Pair: Adjacent angles on a straight line, sum = 180\u00b0"}],
        questions: [
            { q: "Two supplementary angles add up to:", options: ["90\u00b0", "180\u00b0", "360\u00b0", "270\u00b0"], answer: 1 , why: "Angles on a straight line add up to 180° (linear pair). This is useful for finding unknown angles."},
            { q: "If two angles are complementary and one is 35\u00b0, the other is:", options: ["145\u00b0", "55\u00b0", "65\u00b0", "35\u00b0"], answer: 1 , why: "Complementary = sum is 90°, Supplementary = sum is 180°. Remember: C comes before S, 90 before 180."},
            { q: "Vertically opposite angles are:", options: ["Supplementary", "Complementary", "Equal", "Right angles"], answer: 2 , why: "Vertically opposite angles are EQUAL. They form when two lines intersect."},
            { q: "Allied (co-interior) angles formed by a transversal with parallel lines sum to:", options: ["90\u00b0", "180\u00b0", "360\u00b0", "120\u00b0"], answer: 1 , why: "Adjacent angles share a common side and vertex but don\'t overlap."},
            { q: "An angle greater than 90\u00b0 but less than 180\u00b0 is called:", options: ["Acute", "Right", "Obtuse", "Reflex"], answer: 2 , why: "The angle bisector divides an angle into two equal parts."},
        ]
    },
    {
        id: "b7_10",
        title: "Triangles & Symmetry",
        desc: "Types of triangles, angle sum, lines of symmetry, rotational symmetry",
        topicContent: [{"name": "Types of Triangles", "content": "By Sides:\\n\u2022 Equilateral: All sides equal, all angles 60\u00b0\\n\u2022 Isosceles: Two sides equal, base angles equal\\n\u2022 Scalene: All sides different, all angles different\\n\\nBy Angles:\\n\u2022 Acute: All angles < 90\u00b0\\n\u2022 Right: One angle = 90\u00b0\\n\u2022 Obtuse: One angle > 90\u00b0\\n\\nAngle Sum: All angles add up to 180\u00b0"}, {"name": "Symmetry", "content": "Line Symmetry: A line divides a shape into two identical halves.\\n\\nLines of symmetry:\\n\u2022 Circle: Infinite\\n\u2022 Square: 4\\n\u2022 Rectangle: 2\\n\u2022 Equilateral Triangle: 3\\n\u2022 Isosceles Triangle: 1\\n\\nRotational Symmetry: Shape looks the same after rotation.\\nOrder = Number of times it matches in one full turn.\\nSquare: Order 4, Equilateral Triangle: Order 3"}],
        questions: [
            { q: "The sum of angles of a triangle is:", options: ["90\u00b0", "180\u00b0", "270\u00b0", "360\u00b0"], answer: 1 , why: "Triangle angle sum = 180° ALWAYS. If two angles are 60° and 70°, the third = 180°-60°-70° = 50°."},
            { q: "An isosceles triangle has:", options: ["All sides equal", "No sides equal", "Two sides equal", "All angles different"], answer: 2 , why: "Equilateral: All sides and angles equal (60° each). Isosceles: Two sides and two angles equal."},
            { q: "How many lines of symmetry does an equilateral triangle have?", options: ["1", "2", "3", "0"], answer: 2 , why: "A line of symmetry divides a shape into two identical mirror halves."},
            { q: "A triangle with sides 3 cm, 4 cm, and 5 cm is:", options: ["Equilateral", "Isosceles", "Scalene", "Not a triangle"], answer: 2 , why: "Rotational symmetry order = how many times a shape looks the same in one full rotation (360°)."},
            { q: "In which quadrant does the point (3, -2) lie?", options: ["I", "II", "III", "IV"], answer: 3 , why: "Regular shapes have the most symmetry: regular hexagon has 6 lines and order 6."},
        ]
    },
    {
        id: "b7_11",
        title: "Perimeter, Area & Volume",
        desc: "Rectangle, square, triangle area; cube and cuboid volume",
        topicContent: [{"name": "Area Formulas", "content": "Rectangle: A = length \u00d7 breadth\\nSquare: A = side\u00b2\\nTriangle: A = \u00bd \u00d7 base \u00d7 height\\nParallelogram: A = base \u00d7 height\\nCircle: A = \u03c0 \u00d7 r\u00b2 (\u03c0 \u2248 3.14 or 22/7)\\n\\nExample: Triangle with base 10cm, height 6cm\\nA = \u00bd \u00d7 10 \u00d7 6 = 30 cm\u00b2"}, {"name": "Volume of 3D Shapes", "content": "Cube: V = side\u00b3\\nCuboid: V = length \u00d7 breadth \u00d7 height\\n\\nExample: Cuboid with l=5cm, b=3cm, h=4cm\\nV = 5 \u00d7 3 \u00d7 4 = 60 cm\u00b3\\n\\nSurface Area:\\nCube: SA = 6 \u00d7 side\u00b2\\nCuboid: SA = 2(lb + bh + hl)\\n\\nUnits: Volume in cubic units (cm\u00b3, m\u00b3)"}],
        questions: [
            { q: "Volume of a cube with side 5 cm is:", options: ["25 cm\u00b3", "125 cm\u00b3", "150 cm\u00b3", "75 cm\u00b3"], answer: 1 , why: "Area of triangle = ½ × base × height. The height MUST be perpendicular to the base."},
            { q: "Area of a triangle with base 14 cm and height 8 cm:", options: ["112 cm\u00b2", "56 cm\u00b2", "22 cm\u00b2", "44 cm\u00b2"], answer: 1 , why: "Volume = space inside a 3D shape. Measured in cubic units (cm³, m³)."},
            { q: "Perimeter of a rectangle with l = 20 m, b = 12 m:", options: ["240 m", "64 m", "32 m", "44 m"], answer: 1 , why: "Cube: V = side³, SA = 6×side². All edges are equal."},
            { q: "Volume of a cuboid with l=6, b=4, h=3 cm:", options: ["72 cm\u00b3", "52 cm\u00b3", "36 cm\u00b3", "13 cm\u00b3"], answer: 0 , why: "Cuboid: V = l×b×h, SA = 2(lb+bh+hl). Has 3 different pairs of faces."},
            { q: "A square garden has perimeter 60 m. What is its area?", options: ["225 m\u00b2", "900 m\u00b2", "60 m\u00b2", "3600 m\u00b2"], answer: 0 , why: "Circle: Area = πr², Circumference = 2πr. Use π ≈ 3.14 or 22/7."},
        ]
    },
    {
        id: "b7_12",
        title: "Data Handling & Patterns",
        desc: "Bar graphs, pictographs, mean, number patterns",
        topicContent: [{"name": "Data Representation", "content": "Bar Graph: Bars of equal width, height shows value\\nPictograph: Pictures/symbols represent data\\nDouble Bar Graph: Compare two sets of data\\n\\nMean (Average) = Sum of all values \u00f7 Number of values\\nExample: Marks: 45, 60, 55, 50, 40\\nMean = (45+60+55+50+40) \u00f7 5 = 250 \u00f7 5 = 50"}, {"name": "Number Patterns", "content": "Arithmetic Sequence: Common difference\\n3, 7, 11, 15, 19... (d = 4)\\nnth term = a + (n-1)d\\n\\nGeometric Sequence: Common ratio\\n2, 6, 18, 54... (r = 3)\\nnth term = a \u00d7 r^(n-1)\\n\\nFibonacci: Each number = sum of previous two\\n1, 1, 2, 3, 5, 8, 13, 21..."}],
        questions: [
            { q: "The mean of 12, 15, 18, 21, 24 is:", options: ["15", "18", "21", "20"], answer: 1 , why: "Bar graphs use equal-width bars. The height shows the value. Always label axes and give a title!"},
            { q: "In a pictograph, if one symbol = 10 books, 3.5 symbols represent:", options: ["30 books", "35 books", "40 books", "25 books"], answer: 1 , why: "Mean = Sum of all values ÷ Number of values. The mean is the \'average\'."},
            { q: "What comes next: 1, 4, 9, 16, 25, ___?", options: ["30", "36", "49", "32"], answer: 1 , why: "Arithmetic sequence: Common difference (d) is constant. nth term = a + (n-1)d."},
            { q: "The mode of 3, 5, 7, 5, 9, 5, 3 is:", options: ["3", "5", "7", "9"], answer: 1 , why: "Geometric sequence: Common ratio (r) is constant. nth term = a × r^(n-1)."},
            { q: "In a bar graph, which value has the most frequency if its bar is the tallest?", options: ["Mean", "Median", "Mode", "Range"], answer: 2 , why: "Fibonacci: Each term = sum of previous two. 1, 1, 2, 3, 5, 8, 13, 21..."},
        ]
    },
];

function getActiveBasicsWorksheets() {
    var cls = getSelectedClass();
    return cls === '7' ? basicsWorksheets7 : basicsWorksheets6;
}

function getBasicsProgress() {
    var cls = getSelectedClass();
    var key = cls === '7' ? 'basicsProgress7' : 'basicsProgress6';
    try {
        return JSON.parse(localStorage.getItem(key) || '{}');
    } catch(e) {
        return {};
    }
}

function setBasicsProgress(wsId, score) {
    var cls = getSelectedClass();
    var key = cls === '7' ? 'basicsProgress7' : 'basicsProgress6';
    var progress = getBasicsProgress();
    progress[wsId] = score;
    localStorage.setItem(key, JSON.stringify(progress));
}


// GANITA PRAKASH - Class VI Mathematics (NCERT Syllabus)
// Complete Application Logic with 40 Questions per Chapter

// NCERT Class 6 Mathematics Chapters Data (40 questions each)
const chapters = [
    {
        "id": 1,
        "number": "1",
        "title": "Patterns in Mathematics",
        "description": "Explore patterns in numbers, shapes, and nature",
        "topics": [
            {
                "name": "Number Patterns",
                "content": "Number patterns are sequences of numbers that follow a specific rule or formula. Understanding these patterns is fundamental to mathematics and helps develop logical thinking skills.<br><br><b>Types of Number Patterns:</b><br>1. <b>Arithmetic Patterns</b> - Numbers increase or decrease by a constant difference. Example: 3, 7, 11, 15, 19... (common difference = 4)<br>2. <b>Geometric Patterns</b> - Each term is multiplied by a constant ratio. Example: 2, 6, 18, 54... (common ratio = 3)<br>3. <b>Fibonacci-type Patterns</b> - Each term is the sum of previous two terms. Example: 1, 1, 2, 3, 5, 8, 13...<br>4. <b>Square Number Pattern</b> - 1, 4, 9, 16, 25, 36... (n\u00b2)<br>5. <b>Triangular Number Pattern</b> - 1, 3, 6, 10, 15, 21... (sum of first n natural numbers)<br><br><b>How to Identify Patterns:</b><br>\u2022 Find the difference between consecutive terms<br>\u2022 Check if the differences form their own pattern<br>\u2022 Look for multiplication or division relationships<br>\u2022 Try combining operations (add then multiply)<br><br><b>Real-World Applications:</b> Stock market trends, population growth predictions, music rhythms, computer algorithms, and weather forecasting all rely on pattern recognition.<br><br><b>Practice Tip:</b> Always write at least 5-6 terms before confirming a pattern rule. Sometimes short sequences can match multiple rules."
            },
            {
                "name": "Shape Patterns",
                "content": "Shape patterns involve geometric figures arranged in a sequence following specific rules. These patterns can involve changes in size, color, orientation, or the number of sides.<br><br><b>Types of Shape Patterns:</b><br>1. <b>Repeating Patterns</b> - The same group of shapes repeats. Example: \u25b3\u25a1\u25cb\u25b3\u25a1\u25cb...<br>2. <b>Growing Patterns</b> - Shapes grow in size or number. Example: 1 dot, 3 dots, 6 dots, 10 dots (triangular numbers as dot arrangements)<br>3. <b>Rotating Patterns</b> - The same shape rotates by a fixed angle each time<br>4. <b>Symmetry Patterns</b> - Shapes arranged with line or rotational symmetry<br><br><b>Key Concepts:</b><br>\u2022 <b>Square Numbers as Shapes</b>: 1\u00b2=1, 2\u00b2=4, 3\u00b2=9 can be shown as growing squares<br>\u2022 <b>Triangular Numbers</b>: 1, 3, 6, 10 form triangular dot arrangements<br>\u2022 <b>Pentagonal Numbers</b>: 1, 5, 12, 22 form pentagon arrangements<br><br><b>Relationship Between Shape and Number Patterns:</b><br>Every shape pattern can be expressed as a number pattern. For example, if you count the dots in growing L-shapes: 1, 3, 5, 7, 9... you get odd numbers!<br><br><b>Where Shape Patterns Appear:</b> Floor tiles (tessellations), wallpaper designs, quilts, Islamic art, honeycomb structures, crystal formations, and computer graphics all use shape patterns.<br><br><b>Fun Fact:</b> Only three regular polygons (triangle, square, hexagon) can tessellate the plane completely without gaps!"
            },
            {
                "name": "Patterns in Nature",
                "content": "Nature is full of mathematical patterns that have fascinated scientists and mathematicians for centuries.<br><br><b>The Fibonacci Sequence in Nature:</b><br>The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21, 34, 55...) where each number is the sum of the two before it, appears everywhere:<br>\u2022 Sunflower seeds spiral in 34 and 55 rows (consecutive Fibonacci numbers)<br>\u2022 Pinecone spirals follow 8 and 13 patterns<br>\u2022 Flower petals: Lilies have 3, buttercups 5, delphiniums 8, marigolds 13, daisies 21 or 34<br>\u2022 Tree branches follow Fibonacci branching patterns<br><br><b>The Golden Ratio (\u03c6 \u2248 1.618):</b><br>Derived from Fibonacci numbers (ratio of consecutive terms approaches 1.618...), this ratio appears in:<br>\u2022 The spiral of nautilus shells<br>\u2022 Hurricane formations<br>\u2022 Galaxy spiral arms<br>\u2022 Human body proportions<br><br><b>Fractals in Nature:</b><br>Fractals are patterns that repeat at every scale:<br>\u2022 Romanesco broccoli - perfect natural fractal<br>\u2022 Fern leaves - each leaflet is a mini version of the whole fern<br>\u2022 Snowflakes - six-fold symmetry at every magnification<br>\u2022 Coastlines - look similar whether viewed from space or up close<br><br><b>Symmetry in Living Things:</b><br>\u2022 Bilateral symmetry: Butterflies, humans, leaves<br>\u2022 Radial symmetry: Starfish, jellyfish, flowers<br>\u2022 Hexagonal symmetry: Beehives (most efficient packing shape)<br><br><b>Why Nature Uses Math:</b> These patterns emerge because they are the most efficient solutions. Hexagons use the least wax for maximum honey storage. Fibonacci spirals pack seeds most efficiently."
            },
            {
                "name": "Magic Squares",
                "content": "A magic square is a square grid filled with distinct positive integers where the sum of numbers in each row, column, and diagonal equals the same value, called the magic constant.<br><br><b>Building a 3\u00d73 Magic Square:</b><br>Using numbers 1-9, the magic constant = 15<br>\u2022 Always place 5 (the middle number) in the center<br>\u2022 Place even numbers in corners, odd numbers on edges<br>\u2022 One solution: [2,7,6], [9,5,1], [4,3,8]<br><br><b>The Magic Constant Formula:</b><br>For an n\u00d7n magic square using numbers 1 to n\u00b2:<br>Magic Constant = n(n\u00b2 + 1) / 2<br>\u2022 3\u00d73: 3(10)/2 = 15<br>\u2022 4\u00d74: 4(17)/2 = 34<br>\u2022 5\u00d75: 5(26)/2 = 65<br><br><b>Types of Magic Squares:</b><br>1. <b>Normal Magic Square</b> - Uses consecutive integers starting from 1<br>2. <b>Doubly Magic Square</b> - Remains magic when all numbers are squared<br>3. <b>Anti-Magic Square</b> - All sums are different<br>4. <b>Pandiagonal Magic Square</b> - Broken diagonals also sum to the constant<br><br><b>Historical Significance:</b><br>\u2022 The Lo Shu magic square (3\u00d73) was discovered in China ~2200 BC<br>\u2022 Albrecht D\u00fcrer included a 4\u00d74 magic square in his 1514 engraving<br>\u2022 Benjamin Franklin created 8\u00d78 magic squares as a hobby<br>\u2022 Indian mathematicians used them in Vedic rituals<br><br><b>Practice Tip:</b> Start with 3\u00d73 squares. Once you can build those quickly, move to 4\u00d74. Remember, the key is always the magic constant!"
            }
        ],
        "questions": [
            {
                "q": "What is the next number in the pattern: 2, 4, 6, 8, ?",
                "options": [
                    "9",
                    "10",
                    "11",
                    "12"
                ],
                "answer": 1
            },
            {
                "q": "Which pattern shows multiplication by 2: 1, 2, 4, 8, ?",
                "options": [
                    "10",
                    "12",
                    "16",
                    "14"
                ],
                "answer": 2
            },
            {
                "q": "In a magic square of order 3, if the magic sum is 15, what is the center number?",
                "options": [
                    "3",
                    "5",
                    "7",
                    "9"
                ],
                "answer": 1
            },
            {
                "q": "What comes next: 1, 1, 2, 3, 5, 8, ?",
                "options": [
                    "11",
                    "12",
                    "13",
                    "14"
                ],
                "answer": 2
            },
            {
                "q": "The pattern 1, 4, 9, 16, 25 represents:",
                "options": [
                    "Prime numbers",
                    "Square numbers",
                    "Cube numbers",
                    "Even numbers"
                ],
                "answer": 1
            },
            {
                "q": "What is the next number: 5, 10, 15, 20, ?",
                "options": [
                    "22",
                    "25",
                    "30",
                    "35"
                ],
                "answer": 1
            },
            {
                "q": "In the pattern 1, 3, 5, 7, ?, what comes next?",
                "options": [
                    "8",
                    "9",
                    "10",
                    "11"
                ],
                "answer": 1
            },
            {
                "q": "What is the 10th term in: 2, 4, 6, 8...?",
                "options": [
                    "18",
                    "20",
                    "22",
                    "24"
                ],
                "answer": 1
            },
            {
                "q": "The pattern 1, 8, 27, 64 represents:",
                "options": [
                    "Squares",
                    "Cubes",
                    "Primes",
                    "Multiples"
                ],
                "answer": 1
            },
            {
                "q": "What comes after 100, 90, 80, 70, ?",
                "options": [
                    "60",
                    "65",
                    "55",
                    "50"
                ],
                "answer": 0
            },
            {
                "q": "In pattern 2, 6, 18, 54, each term is:",
                "options": [
                    "Added by 4",
                    "Multiplied by 3",
                    "Doubled",
                    "Squared"
                ],
                "answer": 1
            },
            {
                "q": "What is missing: 1, 4, 9, ?, 25",
                "options": [
                    "12",
                    "16",
                    "18",
                    "20"
                ],
                "answer": 1
            },
            {
                "q": "The sum of first 5 odd numbers is:",
                "options": [
                    "15",
                    "20",
                    "25",
                    "30"
                ],
                "answer": 2
            },
            {
                "q": "Pattern: A, C, E, G, ? Next letter is:",
                "options": [
                    "H",
                    "I",
                    "J",
                    "K"
                ],
                "answer": 1
            },
            {
                "q": "In 3, 6, 12, 24, each term is:",
                "options": [
                    "Added 3",
                    "Doubled",
                    "Tripled",
                    "Squared"
                ],
                "answer": 1
            },
            {
                "q": "What is the 5th triangular number?",
                "options": [
                    "10",
                    "15",
                    "20",
                    "25"
                ],
                "answer": 1
            },
            {
                "q": "Pattern 10, 20, 30, 40 increases by:",
                "options": [
                    "5",
                    "10",
                    "15",
                    "20"
                ],
                "answer": 1
            },
            {
                "q": "Next in 1, 4, 9, 16, 25, ?",
                "options": [
                    "30",
                    "36",
                    "40",
                    "49"
                ],
                "answer": 1
            },
            {
                "q": "In pattern 100, 50, 25, ?, what comes next?",
                "options": [
                    "12.5",
                    "15",
                    "20",
                    "10"
                ],
                "answer": 0
            },
            {
                "q": "The 7th term in 3, 6, 9, 12... is:",
                "options": [
                    "18",
                    "21",
                    "24",
                    "27"
                ],
                "answer": 1
            },
            {
                "q": "Pattern: 2, 3, 5, 7, 11 are all:",
                "options": [
                    "Even",
                    "Odd",
                    "Prime",
                    "Composite"
                ],
                "answer": 2
            },
            {
                "q": "What comes next: 1, 2, 4, 7, 11, ?",
                "options": [
                    "14",
                    "15",
                    "16",
                    "17"
                ],
                "answer": 2
            },
            {
                "q": "In magic square, sum of each row is:",
                "options": [
                    "Same",
                    "Different",
                    "Zero",
                    "Negative"
                ],
                "answer": 0
            },
            {
                "q": "Pattern 5, 15, 45, 135 multiplies by:",
                "options": [
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "answer": 1
            },
            {
                "q": "Next number: 64, 32, 16, 8, ?",
                "options": [
                    "4",
                    "6",
                    "2",
                    "1"
                ],
                "answer": 0
            },
            {
                "q": "Fibonacci sequence starts with:",
                "options": [
                    "0, 1",
                    "1, 1",
                    "1, 2",
                    "2, 3"
                ],
                "answer": 1
            },
            {
                "q": "Pattern: 1, 3, 6, 10, 15 are:",
                "options": [
                    "Square numbers",
                    "Triangular numbers",
                    "Prime numbers",
                    "Even numbers"
                ],
                "answer": 1
            },
            {
                "q": "What is next: 2, 5, 10, 17, ?",
                "options": [
                    "24",
                    "26",
                    "28",
                    "30"
                ],
                "answer": 1
            },
            {
                "q": "In pattern 1, 4, 7, 10, difference is:",
                "options": [
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "answer": 1
            },
            {
                "q": "Next: 100, 81, 64, 49, ?",
                "options": [
                    "36",
                    "40",
                    "42",
                    "45"
                ],
                "answer": 0
            },
            {
                "q": "Pattern 3, 9, 27, 81 is powers of:",
                "options": [
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "answer": 1
            },
            {
                "q": "What comes next: 1, 1, 2, 3, 5, 8, 13, ?",
                "options": [
                    "18",
                    "19",
                    "20",
                    "21"
                ],
                "answer": 3
            },
            {
                "q": "In pattern 20, 18, 16, 14, next is:",
                "options": [
                    "10",
                    "12",
                    "13",
                    "15"
                ],
                "answer": 1
            },
            {
                "q": "Sum of angles in triangle pattern:",
                "options": [
                    "90",
                    "180",
                    "270",
                    "360"
                ],
                "answer": 1
            },
            {
                "q": "Pattern: 1, 10, 100, 1000 multiplies by:",
                "options": [
                    "5",
                    "10",
                    "100",
                    "1000"
                ],
                "answer": 1
            },
            {
                "q": "Next in 7, 14, 21, 28, ?",
                "options": [
                    "32",
                    "35",
                    "38",
                    "42"
                ],
                "answer": 1
            },
            {
                "q": "Pattern 2, 4, 8, 16, 32 doubles, next is:",
                "options": [
                    "48",
                    "56",
                    "64",
                    "72"
                ],
                "answer": 2
            },
            {
                "q": "In 5, 10, 20, 40, each term:",
                "options": [
                    "Adds 5",
                    "Doubles",
                    "Triples",
                    "Squares"
                ],
                "answer": 1
            },
            {
                "q": "What is next: 11, 22, 33, 44, ?",
                "options": [
                    "50",
                    "55",
                    "60",
                    "66"
                ],
                "answer": 1
            },
            {
                "q": "Pattern: 1, 3, 7, 15, 31, ? follows 2n-1",
                "options": [
                    "47",
                    "55",
                    "63",
                    "71"
                ],
                "answer": 2
            }
        ],
        "penPaperQuestions": [
            {
                "q": "Draw the next two shapes in the pattern: Triangle, Square, Pentagon, _____, _____",
                "hint": "Count the sides"
            },
            {
                "q": "Create a 3x3 magic square where all rows, columns, and diagonals add up to 15",
                "hint": "Use numbers 1-9"
            }
        ]
    },
    {
        "id": 2,
        "number": "2",
        "title": "Lines and Angles",
        "description": "Understanding lines, rays, segments, and angles",
        "topics": [
            {
                "name": "Point, Line, Ray, Segment",
                "content": "In geometry, the most basic elements are points, lines, rays, and line segments.<br><br><b>Points:</b><br>A point is the most fundamental concept in geometry. It represents an exact location in space with no dimensions at all - no length, width, or height. Points are named using capital letters (A, B, C). When you mark a dot on paper, that represents a point, but a true mathematical point has no size.<br><br><b>Lines:</b><br>A line extends infinitely in both directions. It is 1-dimensional (has only length, no width).<br>\u2022 Through any two distinct points, exactly one line can be drawn<br>\u2022 A line contains infinitely many points<br>\u2022 Notation: Line AB is written as \u2194AB<br><br><b>Rays:</b><br>A ray starts at one point (called the endpoint or origin) and extends infinitely in one direction.<br>\u2022 A ray has one endpoint and extends infinitely<br>\u2022 Notation: Ray AB starts at A and passes through B<br>\u2022 Example: A flashlight beam, sunlight from a specific direction<br><br><b>Line Segments:</b><br>A line segment is a part of a line bounded by two endpoints. It has a definite, measurable length.<br>\u2022 Notation: Segment AB is written with a bar over AB<br>\u2022 A line segment is the shortest path between two points<br>\u2022 Examples: The edge of a ruler, a piece of string stretched tight<br><br><b>Key Relationships:</b><br>\u2022 <b>Collinear Points</b>: Three or more points lying on the same line<br>\u2022 <b>Non-collinear Points</b>: Points that don\u2019t all lie on the same line<br>\u2022 <b>Concurrent Lines</b>: Three or more lines passing through the same point<br>\u2022 <b>Coplanar Points</b>: Points that lie on the same flat surface (plane)<br><br><b>Real-World Examples:</b> Railway tracks (parallel lines), crossroads (intersecting lines), laser beams (rays), edges of a book (line segments), tip of a needle (point)."
            },
            {
                "name": "Types of Lines",
                "content": "Lines can be classified based on their relationship to each other. The three main types are parallel, intersecting, and perpendicular lines.<br><br><b>Parallel Lines:</b><br>Two lines are parallel if they lie in the same plane and never intersect, no matter how far they are extended.<br>\u2022 Symbol: \u2225 (AB \u2225 CD means AB is parallel to CD)<br>\u2022 Parallel lines maintain a constant distance between them<br>\u2022 In coordinate geometry, parallel lines have the same slope<br>\u2022 Examples: Railway tracks, opposite edges of a ruler, horizontal lines on ruled paper<br><br><b>Intersecting Lines:</b><br>Two lines that cross each other at exactly one point are called intersecting lines.<br>\u2022 The point where they meet is called the point of intersection<br>\u2022 Intersecting lines form two pairs of vertically opposite angles<br>\u2022 Vertically opposite angles are always equal<br>\u2022 Adjacent angles at the intersection are supplementary (add to 180\u00b0)<br><br><b>Perpendicular Lines:</b><br>When two lines intersect at exactly 90\u00b0 (right angles), they are perpendicular.<br>\u2022 Symbol: \u22a5 (AB \u22a5 CD means AB is perpendicular to CD)<br>\u2022 All four angles at the intersection are 90\u00b0<br>\u2022 Examples: The letter T, corners of a room, the plus sign +<br><br><b>Transversals and Parallel Lines:</b><br>When a line (transversal) cuts two parallel lines, it creates 8 angles with special properties:<br>\u2022 <b>Corresponding Angles</b> (same position) = Equal<br>\u2022 <b>Alternate Interior Angles</b> (opposite sides, between lines) = Equal<br>\u2022 <b>Co-interior Angles</b> (same side, between lines) = Sum to 180\u00b0<br><br><b>Construction Tips:</b><br>1. Parallel lines: Use a ruler and set square, or copy an angle using a compass<br>2. Perpendicular lines: Use a compass to draw arcs from two points, connect the intersection points<br><br><b>Practice Tip:</b> When solving problems with parallel lines and transversals, first identify all the angle pairs. Label them systematically."
            },
            {
                "name": "Types of Angles",
                "content": "An angle is formed when two rays share a common endpoint called the vertex. Understanding angles is crucial for geometry, construction, navigation, and many real-world applications.<br><br><b>Types of Angles by Measure:</b><br>1. <b>Zero Angle</b>: Exactly 0\u00b0 (both rays overlap)<br>2. <b>Acute Angle</b>: Between 0\u00b0 and 90\u00b0 (sharp, like a slice of pizza)<br>3. <b>Right Angle</b>: Exactly 90\u00b0 (corner of a book, letter L)<br>4. <b>Obtuse Angle</b>: Between 90\u00b0 and 180\u00b0 (wider than a right angle)<br>5. <b>Straight Angle</b>: Exactly 180\u00b0 (a straight line)<br>6. <b>Reflex Angle</b>: Between 180\u00b0 and 360\u00b0 (more than a straight line)<br>7. <b>Complete Angle</b>: Exactly 360\u00b0 (a full turn)<br><br><b>Measuring Angles with a Protractor:</b><br>Step 1: Place the center mark of the protractor on the vertex<br>Step 2: Align the baseline with one ray of the angle<br>Step 3: Read the degree mark where the other ray crosses the scale<br>Step 4: Use the inner or outer scale based on which ray is the base<br><br><b>Important Angle Pairs:</b><br>\u2022 <b>Complementary Angles</b>: Two angles summing to 90\u00b0 (e.g., 30\u00b0 + 60\u00b0)<br>\u2022 <b>Supplementary Angles</b>: Two angles summing to 180\u00b0 (e.g., 110\u00b0 + 70\u00b0)<br>\u2022 <b>Vertically Opposite Angles</b>: Equal angles formed when two lines intersect<br>\u2022 <b>Adjacent Angles</b>: Share a common vertex and side, no overlap<br>\u2022 <b>Linear Pair</b>: Adjacent angles on a straight line that sum to 180\u00b0<br><br><b>Angles in a Clock:</b><br>\u2022 The minute hand moves 6\u00b0 per minute<br>\u2022 The hour hand moves 0.5\u00b0 per minute<br>\u2022 At 3:00, the angle between hands = 90\u00b0<br>\u2022 At 6:00, the angle = 180\u00b0<br><br><b>Fun Fact:</b> The ancient Babylonians chose 360\u00b0 for a full circle because 360 has many factors (1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360), making it easy to divide into equal parts."
            }
        ],
        "questions": [
            {
                "q": "An angle of 90 degrees is called:",
                "options": [
                    "Acute angle",
                    "Right angle",
                    "Obtuse angle",
                    "Straight angle"
                ],
                "answer": 1
            },
            {
                "q": "Two lines that never meet are called:",
                "options": [
                    "Intersecting",
                    "Perpendicular",
                    "Parallel",
                    "Curved"
                ],
                "answer": 2
            },
            {
                "q": "An angle greater than 90 but less than 180 is:",
                "options": [
                    "Acute",
                    "Right",
                    "Obtuse",
                    "Reflex"
                ],
                "answer": 2
            },
            {
                "q": "How many degrees are in a straight angle?",
                "options": [
                    "90",
                    "180",
                    "270",
                    "360"
                ],
                "answer": 1
            },
            {
                "q": "A ray has:",
                "options": [
                    "No endpoints",
                    "One endpoint",
                    "Two endpoints",
                    "Three endpoints"
                ],
                "answer": 1
            },
            {
                "q": "Perpendicular lines meet at:",
                "options": [
                    "45 degrees",
                    "60 degrees",
                    "90 degrees",
                    "180 degrees"
                ],
                "answer": 2
            },
            {
                "q": "An acute angle is:",
                "options": [
                    "Less than 90 degrees",
                    "Equal to 90 degrees",
                    "More than 90 degrees",
                    "Equal to 180 degrees"
                ],
                "answer": 0
            },
            {
                "q": "Complementary angles add up to:",
                "options": [
                    "90 degrees",
                    "180 degrees",
                    "270 degrees",
                    "360 degrees"
                ],
                "answer": 0
            },
            {
                "q": "Supplementary angles add up to:",
                "options": [
                    "90 degrees",
                    "180 degrees",
                    "270 degrees",
                    "360 degrees"
                ],
                "answer": 1
            },
            {
                "q": "A reflex angle is:",
                "options": [
                    "Less than 90 degrees",
                    "90 to 180 degrees",
                    "180 to 360 degrees",
                    "Exactly 360 degrees"
                ],
                "answer": 2
            },
            {
                "q": "Vertically opposite angles are:",
                "options": [
                    "Equal",
                    "Complementary",
                    "Supplementary",
                    "Different"
                ],
                "answer": 0
            },
            {
                "q": "A line segment has:",
                "options": [
                    "No endpoints",
                    "One endpoint",
                    "Two endpoints",
                    "Infinite endpoints"
                ],
                "answer": 2
            },
            {
                "q": "Adjacent angles share a:",
                "options": [
                    "Common vertex",
                    "Common arm",
                    "Both A and B",
                    "Neither"
                ],
                "answer": 2
            },
            {
                "q": "Sum of angles around a point:",
                "options": [
                    "90 degrees",
                    "180 degrees",
                    "270 degrees",
                    "360 degrees"
                ],
                "answer": 3
            },
            {
                "q": "Linear pair of angles:",
                "options": [
                    "Add to 90 degrees",
                    "Add to 180 degrees",
                    "Add to 270 degrees",
                    "Add to 360 degrees"
                ],
                "answer": 1
            },
            {
                "q": "An angle of 45 degrees is:",
                "options": [
                    "Acute",
                    "Right",
                    "Obtuse",
                    "Straight"
                ],
                "answer": 0
            },
            {
                "q": "An angle of 135 degrees is:",
                "options": [
                    "Acute",
                    "Right",
                    "Obtuse",
                    "Straight"
                ],
                "answer": 2
            },
            {
                "q": "Bisector divides angle into:",
                "options": [
                    "Three parts",
                    "Two equal parts",
                    "Four parts",
                    "Unequal parts"
                ],
                "answer": 1
            },
            {
                "q": "Alternate interior angles are:",
                "options": [
                    "Equal",
                    "Complementary",
                    "Supplementary",
                    "Unequal"
                ],
                "answer": 0
            },
            {
                "q": "Corresponding angles are:",
                "options": [
                    "Equal",
                    "Complementary",
                    "Supplementary",
                    "Unequal"
                ],
                "answer": 0
            },
            {
                "q": "Co-interior angles add to:",
                "options": [
                    "90 degrees",
                    "180 degrees",
                    "270 degrees",
                    "360 degrees"
                ],
                "answer": 1
            },
            {
                "q": "A complete angle is:",
                "options": [
                    "90 degrees",
                    "180 degrees",
                    "270 degrees",
                    "360 degrees"
                ],
                "answer": 3
            },
            {
                "q": "Zero angle measures:",
                "options": [
                    "0 degrees",
                    "45 degrees",
                    "90 degrees",
                    "180 degrees"
                ],
                "answer": 0
            },
            {
                "q": "If two angles are 30 and 60 degrees, they are:",
                "options": [
                    "Complementary",
                    "Supplementary",
                    "Neither",
                    "Both"
                ],
                "answer": 0
            },
            {
                "q": "If two angles are 120 and 60 degrees, they are:",
                "options": [
                    "Complementary",
                    "Supplementary",
                    "Neither",
                    "Both"
                ],
                "answer": 1
            },
            {
                "q": "Angle in a semicircle is:",
                "options": [
                    "45 degrees",
                    "60 degrees",
                    "90 degrees",
                    "180 degrees"
                ],
                "answer": 2
            },
            {
                "q": "Sum of interior angles of triangle:",
                "options": [
                    "90 degrees",
                    "180 degrees",
                    "270 degrees",
                    "360 degrees"
                ],
                "answer": 1
            },
            {
                "q": "Each angle of equilateral triangle:",
                "options": [
                    "30 degrees",
                    "45 degrees",
                    "60 degrees",
                    "90 degrees"
                ],
                "answer": 2
            },
            {
                "q": "Exterior angle of triangle equals:",
                "options": [
                    "One interior angle",
                    "Sum of two interior opposite angles",
                    "All interior angles",
                    "None"
                ],
                "answer": 1
            },
            {
                "q": "Transversal cuts two parallel lines at:",
                "options": [
                    "One point",
                    "Two points",
                    "Three points",
                    "No point"
                ],
                "answer": 1
            },
            {
                "q": "Angle between hour and minute hand at 3:00:",
                "options": [
                    "60 degrees",
                    "90 degrees",
                    "120 degrees",
                    "180 degrees"
                ],
                "answer": 1
            },
            {
                "q": "If angle is 70 degrees, its complement is:",
                "options": [
                    "10 degrees",
                    "20 degrees",
                    "30 degrees",
                    "110 degrees"
                ],
                "answer": 1
            },
            {
                "q": "If angle is 70 degrees, its supplement is:",
                "options": [
                    "20 degrees",
                    "90 degrees",
                    "110 degrees",
                    "290 degrees"
                ],
                "answer": 2
            },
            {
                "q": "Angle made by clock hands at 6:00:",
                "options": [
                    "90 degrees",
                    "120 degrees",
                    "150 degrees",
                    "180 degrees"
                ],
                "answer": 3
            },
            {
                "q": "Two angles are 3x and 2x, if complementary, x=:",
                "options": [
                    "15 degrees",
                    "18 degrees",
                    "20 degrees",
                    "30 degrees"
                ],
                "answer": 1
            },
            {
                "q": "Angle between North and East:",
                "options": [
                    "45 degrees",
                    "90 degrees",
                    "135 degrees",
                    "180 degrees"
                ],
                "answer": 1
            },
            {
                "q": "If three angles at a point are 100, 120, x, then x=:",
                "options": [
                    "120 degrees",
                    "130 degrees",
                    "140 degrees",
                    "150 degrees"
                ],
                "answer": 2
            },
            {
                "q": "Angle between opposite directions:",
                "options": [
                    "90 degrees",
                    "120 degrees",
                    "150 degrees",
                    "180 degrees"
                ],
                "answer": 3
            },
            {
                "q": "If angle is x, its vertically opposite angle is:",
                "options": [
                    "x",
                    "90-x",
                    "180-x",
                    "360-x"
                ],
                "answer": 0
            },
            {
                "q": "Angle subtended by diameter at circumference:",
                "options": [
                    "45 degrees",
                    "60 degrees",
                    "90 degrees",
                    "180 degrees"
                ],
                "answer": 2
            }
        ],
        "penPaperQuestions": [
            {
                "q": "Draw two parallel lines and two perpendicular lines. Label them.",
                "hint": "Use ruler"
            },
            {
                "q": "Draw angles of 45, 90, and 135 degrees using a protractor.",
                "hint": "Label each angle"
            }
        ]
    },
    {
        "id": 3,
        "number": "3",
        "title": "Number Play",
        "description": "Playing with numbers and their properties",
        "topics": [
            {
                "name": "Place Value",
                "content": "Place value is the foundation of our number system, determining the value of each digit based on its position. In our decimal (base-10) system, each place is worth 10 times the place to its right. Starting from the right, we have ones (units), tens, hundreds, thousands, ten thousands, lakhs, ten lakhs, crores, and so on. For example, in the number 45,678, the digit 4 is in the ten thousands place (worth 40,000), 5 is in thousands (5,000), 6 is in hundreds (600), 7 is in tens (70), and 8 is in ones (8). The expanded form shows each digit's value: 45,678 = 40,000 + 5,000 + 600 + 70 + 8. Understanding place value helps with addition, subtraction, multiplication, and division. It also helps us read large numbers correctly - in the Indian system, we use lakhs and crores, while the international system uses millions and billions. Place value is essential for understanding decimals, where places to the right of the decimal point represent tenths, hundredths, thousandths, etc."
            },
            {
                "name": "Comparing Numbers",
                "content": "Comparing numbers means determining which number is greater, smaller, or if they are equal. We use three symbols: > (greater than), < (less than), and = (equal to). To compare two numbers, first check if they have the same number of digits - the number with more digits is usually greater. If they have the same number of digits, compare digit by digit from left to right until you find a difference. For example, comparing 4,567 and 4,589: both have 4 digits, the thousands digit (4) is the same, the hundreds digit (5) is the same, but the tens digit differs (6 vs 8), so 4,567 < 4,589. When comparing negative numbers, the rules reverse: -5 < -3 because -5 is farther from zero. Comparing numbers is essential for ordering, sorting, and making decisions in everyday life - like comparing prices, scores, temperatures, or distances."
            },
            {
                "name": "Rounding Numbers",
                "content": "Rounding is the process of replacing a number with an approximate value that is simpler and easier to work with. We round to a specific place value: nearest 10, 100, 1000, etc. The rule is: look at the digit to the right of the rounding place. If it's 5 or more, round up; if it's 4 or less, round down. For example, rounding 3,567 to the nearest 10: look at the ones digit (7), since 7 >= 5, round up to 3,570. Rounding to nearest 100: look at tens digit (6), since 6 >= 5, round up to 3,600. Rounding to nearest 1000: look at hundreds digit (5), since 5 >= 5, round up to 4,000. Rounding is useful for estimation, mental math, and when exact values aren't needed. In real life, we round prices ($9.99 ≈ $10), distances (marathon is about 42 km), and populations (city has about 1 million people). Estimation using rounding helps check if calculated answers are reasonable."
            }
        ],
        "questions": [
            {
                "q": "What is the place value of 5 in 3,567?",
                "options": [
                    "5",
                    "50",
                    "500",
                    "5000"
                ],
                "answer": 2
            },
            {
                "q": "Round 4,567 to the nearest hundred:",
                "options": [
                    "4,500",
                    "4,600",
                    "4,570",
                    "5,000"
                ],
                "answer": 1
            },
            {
                "q": "Which is greater: 9,999 or 10,000?",
                "options": [
                    "9,999",
                    "10,000",
                    "Both equal",
                    "Cannot compare"
                ],
                "answer": 1
            },
            {
                "q": "The successor of 99,999 is:",
                "options": [
                    "99,998",
                    "100,000",
                    "99,000",
                    "1,00,000"
                ],
                "answer": 1
            },
            {
                "q": "What is 7,000 + 800 + 50 + 3?",
                "options": [
                    "7,835",
                    "7,853",
                    "7,583",
                    "7,358"
                ],
                "answer": 1
            },
            {
                "q": "The predecessor of 1,000 is:",
                "options": [
                    "999",
                    "1,001",
                    "990",
                    "900"
                ],
                "answer": 0
            },
            {
                "q": "Place value of 7 in 87,654:",
                "options": [
                    "7",
                    "70",
                    "700",
                    "7,000"
                ],
                "answer": 3
            },
            {
                "q": "Round 3,456 to nearest thousand:",
                "options": [
                    "3,000",
                    "3,500",
                    "4,000",
                    "3,400"
                ],
                "answer": 0
            },
            {
                "q": "Which is smallest: 5,678 or 5,687?",
                "options": [
                    "5,678",
                    "5,687",
                    "Both equal",
                    "Cannot tell"
                ],
                "answer": 0
            },
            {
                "q": "Face value of 9 in 9,876:",
                "options": [
                    "9",
                    "90",
                    "900",
                    "9,000"
                ],
                "answer": 0
            },
            {
                "q": "Expanded form of 4,567:",
                "options": [
                    "4+5+6+7",
                    "4000+500+60+7",
                    "4567",
                    "400+56+7"
                ],
                "answer": 1
            },
            {
                "q": "Sum of place values of 5 in 5,555:",
                "options": [
                    "20",
                    "5,555",
                    "5,550",
                    "555"
                ],
                "answer": 1
            },
            {
                "q": "Difference between 10,000 and 9,999:",
                "options": [
                    "1",
                    "10",
                    "100",
                    "1,000"
                ],
                "answer": 0
            },
            {
                "q": "Round 7,850 to nearest hundred:",
                "options": [
                    "7,800",
                    "7,900",
                    "8,000",
                    "7,850"
                ],
                "answer": 1
            },
            {
                "q": "The greatest 4-digit number is:",
                "options": [
                    "9,000",
                    "9,999",
                    "10,000",
                    "1,000"
                ],
                "answer": 1
            },
            {
                "q": "The smallest 5-digit number is:",
                "options": [
                    "10,000",
                    "99,999",
                    "11,111",
                    "10,001"
                ],
                "answer": 0
            },
            {
                "q": "Place value of 0 in 5,067:",
                "options": [
                    "0",
                    "60",
                    "6",
                    "None"
                ],
                "answer": 0
            },
            {
                "q": "Compare: 45,678 __ 45,687",
                "options": [
                    ">",
                    "<",
                    "=",
                    "Cannot compare"
                ],
                "answer": 1
            },
            {
                "q": "Round 9,950 to nearest hundred:",
                "options": [
                    "9,900",
                    "9,950",
                    "10,000",
                    "9,000"
                ],
                "answer": 2
            },
            {
                "q": "Successor of 99,999:",
                "options": [
                    "1,00,000",
                    "99,998",
                    "99,000",
                    "10,000"
                ],
                "answer": 0
            },
            {
                "q": "Which digit is in ten thousands place in 87,654?",
                "options": [
                    "8",
                    "7",
                    "6",
                    "5"
                ],
                "answer": 0
            },
            {
                "q": "Sum of 5,000 + 600 + 70 + 8:",
                "options": [
                    "5,678",
                    "5,687",
                    "5,768",
                    "5,867"
                ],
                "answer": 0
            },
            {
                "q": "Predecessor of 50,000:",
                "options": [
                    "49,999",
                    "50,001",
                    "49,000",
                    "40,999"
                ],
                "answer": 0
            },
            {
                "q": "Round 4,444 to nearest ten:",
                "options": [
                    "4,440",
                    "4,450",
                    "4,400",
                    "4,500"
                ],
                "answer": 0
            },
            {
                "q": "Difference: 1,00,000 - 1:",
                "options": [
                    "99,999",
                    "99,998",
                    "99,000",
                    "1,00,001"
                ],
                "answer": 0
            },
            {
                "q": "Place value of 3 in 23,456:",
                "options": [
                    "3",
                    "30",
                    "300",
                    "3,000"
                ],
                "answer": 3
            },
            {
                "q": "Which is greater: 67,890 or 67,809?",
                "options": [
                    "67,890",
                    "67,809",
                    "Both equal",
                    "Cannot compare"
                ],
                "answer": 0
            },
            {
                "q": "Expanded form of 90,807:",
                "options": [
                    "9+0+8+0+7",
                    "90000+800+7",
                    "90000+0+800+0+7",
                    "9807"
                ],
                "answer": 1
            },
            {
                "q": "Round 55,555 to nearest thousand:",
                "options": [
                    "55,000",
                    "56,000",
                    "55,500",
                    "55,600"
                ],
                "answer": 1
            },
            {
                "q": "Face value of 6 in 6,66,666:",
                "options": [
                    "6",
                    "60",
                    "600",
                    "6,000"
                ],
                "answer": 0
            },
            {
                "q": "Sum of all digits in 12,345:",
                "options": [
                    "15",
                    "12",
                    "10",
                    "14"
                ],
                "answer": 0
            },
            {
                "q": "Greatest 5-digit number with all different digits:",
                "options": [
                    "98,765",
                    "99,999",
                    "97,865",
                    "98,756"
                ],
                "answer": 0
            },
            {
                "q": "Smallest 4-digit number using 0,1,2,3:",
                "options": [
                    "0,123",
                    "1,023",
                    "1,230",
                    "1,203"
                ],
                "answer": 1
            },
            {
                "q": "Place value of 4 in 4,04,040:",
                "options": [
                    "4",
                    "40",
                    "4,000",
                    "4,00,000"
                ],
                "answer": 3
            },
            {
                "q": "Round 99,999 to nearest ten thousand:",
                "options": [
                    "90,000",
                    "99,000",
                    "1,00,000",
                    "99,990"
                ],
                "answer": 2
            },
            {
                "q": "Predecessor of 1,00,000:",
                "options": [
                    "99,999",
                    "99,000",
                    "1,00,001",
                    "90,000"
                ],
                "answer": 0
            },
            {
                "q": "Compare: 1,23,456 __ 1,32,456",
                "options": [
                    ">",
                    "<",
                    "=",
                    "Cannot compare"
                ],
                "answer": 1
            },
            {
                "q": "Sum of place values of 2 in 22,222:",
                "options": [
                    "10",
                    "22,222",
                    "2,222",
                    "222"
                ],
                "answer": 1
            },
            {
                "q": "Difference between greatest and smallest 3-digit numbers:",
                "options": [
                    "899",
                    "900",
                    "898",
                    "901"
                ],
                "answer": 0
            },
            {
                "q": "Round 50,505 to nearest hundred:",
                "options": [
                    "50,500",
                    "50,600",
                    "50,000",
                    "51,000"
                ],
                "answer": 0
            }
        ],
        "penPaperQuestions": [
            {
                "q": "Write the expanded form of 45,678 and find its predecessor and successor.",
                "hint": "Break into place values"
            },
            {
                "q": "Arrange these numbers in ascending order: 56,789; 56,798; 56,879; 56,897",
                "hint": "Compare digit by digit"
            }
        ]
    },
    {
        "id": 4,
        "number": "4",
        "title": "Data Handling and Presentation",
        "description": "Collecting, organizing, and representing data",
        "topics": [
            {
                "name": "Data Collection",
                "content": "Data collection is the systematic process of gathering information to answer questions or solve problems. There are two main types of data: primary data (collected firsthand through surveys, experiments, or observations) and secondary data (obtained from existing sources like books, websites, or government records). Methods of data collection include questionnaires (written questions), interviews (face-to-face or phone conversations), observations (watching and recording), and experiments (controlled tests). When collecting data, it's important to define what you want to learn, choose an appropriate method, collect data from a representative sample, and record information accurately. For example, to find the favorite sport in your class, you could survey all students and record their responses. Good data collection requires clear questions, honest responses, and careful recording. The quality of your conclusions depends on the quality of your data collection."
            },
            {
                "name": "Tally Marks",
                "content": "Tally marks are a simple and efficient way to count and record data. Each item counted is represented by a vertical line (|). After every four marks, the fifth mark is drawn diagonally across the previous four (||||), creating a group of five that's easy to count. This grouping system makes it quick to count large numbers - just count by fives and add any remaining marks. For example, |||| |||| ||| represents 13 (5 + 5 + 3). Tally marks are especially useful when collecting data in real-time, like counting cars passing by, votes in an election, or survey responses. They help organize raw data before creating frequency tables or graphs. The tally system has been used for thousands of years - ancient shepherds used it to count sheep! Today, tally marks remain valuable for quick counting and are often the first step in organizing data for analysis."
            },
            {
                "name": "Bar Graphs",
                "content": "A bar graph (or bar chart) is a visual representation of data using rectangular bars of different heights or lengths. Each bar represents a category, and its height (or length) shows the value or frequency for that category. Bar graphs make it easy to compare different categories at a glance. To create a bar graph: (1) Draw two perpendicular axes - horizontal (x-axis) for categories and vertical (y-axis) for values. (2) Choose an appropriate scale for the y-axis. (3) Draw bars of equal width for each category, with heights corresponding to their values. (4) Leave equal gaps between bars. (5) Add a title and labels. Bar graphs can be vertical or horizontal. They're used everywhere - in newspapers, business reports, and scientific studies - to show comparisons like sales figures, population data, or survey results. Unlike pictographs, bar graphs can show exact values and are easier to draw for large numbers."
            }
        ],
        "questions": [
            {
                "q": "How many tally marks represent 7?",
                "options": [
                    "IIII II",
                    "IIII III",
                    "IIII I",
                    "III III"
                ],
                "answer": 0
            },
            {
                "q": "In a pictograph, if one symbol = 5 students, 4 symbols represent:",
                "options": [
                    "15",
                    "20",
                    "25",
                    "10"
                ],
                "answer": 1
            },
            {
                "q": "Which graph uses bars to represent data?",
                "options": [
                    "Pie chart",
                    "Line graph",
                    "Bar graph",
                    "Pictograph"
                ],
                "answer": 2
            },
            {
                "q": "The difference between highest and lowest values is called:",
                "options": [
                    "Mean",
                    "Mode",
                    "Range",
                    "Median"
                ],
                "answer": 2
            },
            {
                "q": "Which is NOT a method of data collection?",
                "options": [
                    "Survey",
                    "Observation",
                    "Interview",
                    "Calculation"
                ],
                "answer": 3
            },
            {
                "q": "Tally marks for 13:",
                "options": [
                    "IIII IIII III",
                    "IIII IIII II",
                    "IIII III",
                    "IIII IIII IIII"
                ],
                "answer": 0
            },
            {
                "q": "In pictograph, half symbol represents:",
                "options": [
                    "Full value",
                    "Half value",
                    "Double value",
                    "No value"
                ],
                "answer": 1
            },
            {
                "q": "Bar graph shows data using:",
                "options": [
                    "Lines",
                    "Circles",
                    "Rectangular bars",
                    "Points"
                ],
                "answer": 2
            },
            {
                "q": "Primary data is collected by:",
                "options": [
                    "Researcher directly",
                    "From books",
                    "From internet",
                    "From newspapers"
                ],
                "answer": 0
            },
            {
                "q": "Secondary data comes from:",
                "options": [
                    "Direct observation",
                    "Existing sources",
                    "Experiments",
                    "Surveys"
                ],
                "answer": 1
            },
            {
                "q": "Mode is the value that appears:",
                "options": [
                    "Most frequently",
                    "Least frequently",
                    "In middle",
                    "At end"
                ],
                "answer": 0
            },
            {
                "q": "Mean is also called:",
                "options": [
                    "Median",
                    "Mode",
                    "Average",
                    "Range"
                ],
                "answer": 2
            },
            {
                "q": "Median is the:",
                "options": [
                    "Middle value",
                    "Most common value",
                    "Average",
                    "Difference"
                ],
                "answer": 0
            },
            {
                "q": "In a bar graph, bars are:",
                "options": [
                    "Overlapping",
                    "Equal width",
                    "Different width",
                    "Curved"
                ],
                "answer": 1
            },
            {
                "q": "Pictograph uses:",
                "options": [
                    "Bars",
                    "Pictures/symbols",
                    "Lines",
                    "Circles"
                ],
                "answer": 1
            },
            {
                "q": "Data arranged in order is called:",
                "options": [
                    "Raw data",
                    "Organized data",
                    "Primary data",
                    "Secondary data"
                ],
                "answer": 1
            },
            {
                "q": "Frequency means:",
                "options": [
                    "How often",
                    "How much",
                    "How many times",
                    "All of these"
                ],
                "answer": 3
            },
            {
                "q": "Scale in bar graph helps to:",
                "options": [
                    "Draw bars",
                    "Read values",
                    "Color bars",
                    "Name bars"
                ],
                "answer": 1
            },
            {
                "q": "Horizontal bar graph has bars:",
                "options": [
                    "Standing up",
                    "Lying down",
                    "Diagonal",
                    "Curved"
                ],
                "answer": 1
            },
            {
                "q": "Title of a graph tells:",
                "options": [
                    "What graph shows",
                    "Who made it",
                    "When made",
                    "Where made"
                ],
                "answer": 0
            },
            {
                "q": "X-axis is usually:",
                "options": [
                    "Horizontal",
                    "Vertical",
                    "Diagonal",
                    "Curved"
                ],
                "answer": 0
            },
            {
                "q": "Y-axis is usually:",
                "options": [
                    "Horizontal",
                    "Vertical",
                    "Diagonal",
                    "Curved"
                ],
                "answer": 1
            },
            {
                "q": "Legend in pictograph shows:",
                "options": [
                    "Title",
                    "Key/symbol meaning",
                    "Data",
                    "Scale"
                ],
                "answer": 1
            },
            {
                "q": "Double bar graph compares:",
                "options": [
                    "One set of data",
                    "Two sets of data",
                    "Three sets",
                    "No data"
                ],
                "answer": 1
            },
            {
                "q": "Tally marks are grouped in:",
                "options": [
                    "3s",
                    "4s",
                    "5s",
                    "10s"
                ],
                "answer": 2
            },
            {
                "q": "If 8 students like cricket, tally is:",
                "options": [
                    "IIII II",
                    "IIII III",
                    "IIII IIII",
                    "III III"
                ],
                "answer": 1
            },
            {
                "q": "Range of 5, 8, 12, 3, 9 is:",
                "options": [
                    "9",
                    "12",
                    "3",
                    "5"
                ],
                "answer": 0
            },
            {
                "q": "Mode of 2, 3, 3, 4, 5, 3 is:",
                "options": [
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "answer": 1
            },
            {
                "q": "Mean of 10, 20, 30 is:",
                "options": [
                    "10",
                    "15",
                    "20",
                    "30"
                ],
                "answer": 2
            },
            {
                "q": "Median of 1, 3, 5, 7, 9 is:",
                "options": [
                    "3",
                    "5",
                    "7",
                    "9"
                ],
                "answer": 1
            },
            {
                "q": "Bar graph is best for:",
                "options": [
                    "Showing parts of whole",
                    "Comparing quantities",
                    "Showing trends",
                    "Showing percentages"
                ],
                "answer": 1
            },
            {
                "q": "Pie chart shows:",
                "options": [
                    "Parts of a whole",
                    "Comparison",
                    "Trends",
                    "Frequency"
                ],
                "answer": 0
            },
            {
                "q": "Line graph is best for:",
                "options": [
                    "Comparing",
                    "Showing change over time",
                    "Parts of whole",
                    "Frequency"
                ],
                "answer": 1
            },
            {
                "q": "Raw data is:",
                "options": [
                    "Organized",
                    "Unorganized",
                    "Calculated",
                    "Graphed"
                ],
                "answer": 1
            },
            {
                "q": "Observation method collects data by:",
                "options": [
                    "Asking questions",
                    "Watching",
                    "Reading",
                    "Calculating"
                ],
                "answer": 1
            },
            {
                "q": "Survey method uses:",
                "options": [
                    "Questionnaires",
                    "Observation",
                    "Experiments",
                    "Books"
                ],
                "answer": 0
            },
            {
                "q": "Class interval is:",
                "options": [
                    "Range of values",
                    "Single value",
                    "Average",
                    "Mode"
                ],
                "answer": 0
            },
            {
                "q": "Frequency table shows:",
                "options": [
                    "Data and how often",
                    "Only data",
                    "Only frequency",
                    "Graphs"
                ],
                "answer": 0
            },
            {
                "q": "If scale is 1 cm = 10 units, 5 cm represents:",
                "options": [
                    "10",
                    "50",
                    "15",
                    "5"
                ],
                "answer": 1
            },
            {
                "q": "Grouped data uses:",
                "options": [
                    "Individual values",
                    "Class intervals",
                    "Single numbers",
                    "No numbers"
                ],
                "answer": 1
            }
        ],
        "penPaperQuestions": [
            {
                "q": "Create a bar graph showing: Mon-5 books, Tue-8 books, Wed-3 books, Thu-6 books, Fri-10 books",
                "hint": "Use proper scale"
            },
            {
                "q": "Make a tally chart for: Red-12, Blue-8, Green-15, Yellow-6",
                "hint": "Group in 5s"
            }
        ]
    },
    {
        "id": 5,
        "number": "5",
        "title": "Prime Time",
        "description": "Understanding prime and composite numbers",
        "topics": [
            {
                "name": "Factors",
                "content": "Factors are numbers that divide another number exactly without leaving a remainder. Every number has at least two factors: 1 and itself. For example, the factors of 12 are 1, 2, 3, 4, 6, and 12 because each of these divides 12 exactly. To find all factors of a number, start from 1 and check each number up to the square root of the original number. If a number divides evenly, both it and the quotient are factors. Factors come in pairs that multiply to give the original number: for 12, the pairs are (1,12), (2,6), and (3,4). Common factors are factors shared by two or more numbers. The Greatest Common Factor (GCF) or Highest Common Factor (HCF) is the largest factor common to two or more numbers. For example, factors of 12 are {1,2,3,4,6,12} and factors of 18 are {1,2,3,6,9,18}, so common factors are {1,2,3,6} and GCF is 6. Understanding factors is essential for simplifying fractions, finding LCM, and solving many mathematical problems."
            },
            {
                "name": "Prime Numbers",
                "content": "A prime number is a natural number greater than 1 that has exactly two factors: 1 and itself. The first few prime numbers are 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31... Notice that 2 is the only even prime number - all other even numbers are divisible by 2, so they have more than two factors. The number 1 is not prime because it has only one factor (itself). Numbers with more than two factors are called composite numbers (like 4, 6, 8, 9, 10...). To check if a number is prime, test if it's divisible by any prime number up to its square root. For example, to check if 29 is prime, test divisibility by 2, 3, and 5 (since √29 ≈ 5.4). Since 29 isn't divisible by any of these, it's prime. Prime numbers are the 'building blocks' of all natural numbers - every number can be expressed as a product of primes. They're crucial in cryptography and computer security."
            },
            {
                "name": "Prime Factorization",
                "content": "Prime factorization is the process of expressing a composite number as a product of its prime factors. Every composite number has a unique prime factorization (this is called the Fundamental Theorem of Arithmetic). For example, 60 = 2 × 2 × 3 × 5 = 2² × 3 × 5. There are two main methods: (1) Factor Tree Method - keep breaking down the number until all factors are prime. Start with any two factors, then factor those, continuing until all branches end in primes. (2) Division Method - repeatedly divide by the smallest prime that divides evenly, writing down each prime divisor until you reach 1. Prime factorization is used to find GCF (take common primes with lowest powers) and LCM (take all primes with highest powers). For example, for 12 = 2² × 3 and 18 = 2 × 3², GCF = 2 × 3 = 6 and LCM = 2² × 3² = 36. This concept is fundamental in algebra and number theory."
            }
        ],
        "questions": [
            {
                "q": "Which of these is a prime number?",
                "options": [
                    "4",
                    "9",
                    "11",
                    "15"
                ],
                "answer": 2
            },
            {
                "q": "The smallest prime number is:",
                "options": [
                    "0",
                    "1",
                    "2",
                    "3"
                ],
                "answer": 2
            },
            {
                "q": "How many factors does 12 have?",
                "options": [
                    "4",
                    "5",
                    "6",
                    "7"
                ],
                "answer": 2
            },
            {
                "q": "The prime factorization of 18 is:",
                "options": [
                    "2 x 9",
                    "2 x 3 x 3",
                    "3 x 6",
                    "2 x 3"
                ],
                "answer": 1
            },
            {
                "q": "Which is a composite number?",
                "options": [
                    "2",
                    "3",
                    "5",
                    "9"
                ],
                "answer": 3
            },
            {
                "q": "Factors of 24 are:",
                "options": [
                    "1,2,3,4,6,8,12,24",
                    "1,2,4,6,12,24",
                    "2,3,4,6,8,12",
                    "1,2,3,6,12,24"
                ],
                "answer": 0
            },
            {
                "q": "HCF of 12 and 18 is:",
                "options": [
                    "2",
                    "3",
                    "6",
                    "12"
                ],
                "answer": 2
            },
            {
                "q": "LCM of 4 and 6 is:",
                "options": [
                    "2",
                    "12",
                    "24",
                    "10"
                ],
                "answer": 1
            },
            {
                "q": "1 is:",
                "options": [
                    "Prime",
                    "Composite",
                    "Neither",
                    "Both"
                ],
                "answer": 2
            },
            {
                "q": "Prime numbers between 10 and 20:",
                "options": [
                    "11, 13, 17, 19",
                    "11, 13, 15, 17",
                    "10, 12, 14, 16",
                    "13, 15, 17, 19"
                ],
                "answer": 0
            },
            {
                "q": "Which is NOT a factor of 36?",
                "options": [
                    "4",
                    "6",
                    "8",
                    "9"
                ],
                "answer": 2
            },
            {
                "q": "The only even prime number is:",
                "options": [
                    "0",
                    "2",
                    "4",
                    "6"
                ],
                "answer": 1
            },
            {
                "q": "Co-prime numbers have HCF:",
                "options": [
                    "0",
                    "1",
                    "2",
                    "Greater than 1"
                ],
                "answer": 1
            },
            {
                "q": "Prime factorization of 36:",
                "options": [
                    "2x2x3x3",
                    "2x3x6",
                    "4x9",
                    "6x6"
                ],
                "answer": 0
            },
            {
                "q": "Number of prime numbers less than 10:",
                "options": [
                    "3",
                    "4",
                    "5",
                    "6"
                ],
                "answer": 1
            },
            {
                "q": "LCM of 8 and 12 is:",
                "options": [
                    "4",
                    "24",
                    "48",
                    "96"
                ],
                "answer": 1
            },
            {
                "q": "HCF of 15 and 25 is:",
                "options": [
                    "5",
                    "15",
                    "25",
                    "75"
                ],
                "answer": 0
            },
            {
                "q": "A number with exactly 2 factors is:",
                "options": [
                    "Prime",
                    "Composite",
                    "1",
                    "0"
                ],
                "answer": 0
            },
            {
                "q": "Factors of 1 are:",
                "options": [
                    "0",
                    "1 only",
                    "1 and itself",
                    "None"
                ],
                "answer": 1
            },
            {
                "q": "Which pair is co-prime?",
                "options": [
                    "4, 8",
                    "9, 12",
                    "8, 15",
                    "6, 9"
                ],
                "answer": 2
            },
            {
                "q": "Prime factorization of 48:",
                "options": [
                    "2x2x2x2x3",
                    "2x2x2x6",
                    "4x12",
                    "8x6"
                ],
                "answer": 0
            },
            {
                "q": "LCM of 5 and 7 is:",
                "options": [
                    "12",
                    "35",
                    "1",
                    "5"
                ],
                "answer": 1
            },
            {
                "q": "HCF of 24 and 36 is:",
                "options": [
                    "6",
                    "12",
                    "24",
                    "36"
                ],
                "answer": 1
            },
            {
                "q": "Twin primes are primes that differ by:",
                "options": [
                    "1",
                    "2",
                    "3",
                    "4"
                ],
                "answer": 1
            },
            {
                "q": "Example of twin primes:",
                "options": [
                    "2, 3",
                    "3, 5",
                    "5, 9",
                    "7, 11"
                ],
                "answer": 1
            },
            {
                "q": "Product of HCF and LCM of two numbers equals:",
                "options": [
                    "Sum of numbers",
                    "Product of numbers",
                    "Difference",
                    "Quotient"
                ],
                "answer": 1
            },
            {
                "q": "Divisibility rule for 2:",
                "options": [
                    "Sum divisible by 2",
                    "Last digit even",
                    "Last digit 0",
                    "First digit even"
                ],
                "answer": 1
            },
            {
                "q": "Divisibility rule for 3:",
                "options": [
                    "Last digit 3",
                    "Sum of digits divisible by 3",
                    "Ends in 0",
                    "First digit 3"
                ],
                "answer": 1
            },
            {
                "q": "Divisibility rule for 5:",
                "options": [
                    "Ends in 0 or 5",
                    "Sum divisible by 5",
                    "Last two digits divisible by 5",
                    "First digit 5"
                ],
                "answer": 0
            },
            {
                "q": "Is 91 prime?",
                "options": [
                    "Yes",
                    "No, 7x13",
                    "No, 9x10",
                    "No, 3x30"
                ],
                "answer": 1
            },
            {
                "q": "Factors of prime number p:",
                "options": [
                    "1 only",
                    "p only",
                    "1 and p",
                    "1, p, and p^2"
                ],
                "answer": 2
            },
            {
                "q": "LCM of 12, 15, 20 is:",
                "options": [
                    "30",
                    "60",
                    "120",
                    "180"
                ],
                "answer": 1
            },
            {
                "q": "HCF of 18, 24, 30 is:",
                "options": [
                    "2",
                    "3",
                    "6",
                    "12"
                ],
                "answer": 2
            },
            {
                "q": "Composite numbers between 1 and 10:",
                "options": [
                    "4, 6, 8, 9, 10",
                    "4, 6, 8, 9",
                    "2, 4, 6, 8",
                    "4, 6, 8, 10"
                ],
                "answer": 1
            },
            {
                "q": "Prime factorization of 100:",
                "options": [
                    "2x2x5x5",
                    "4x25",
                    "10x10",
                    "2x50"
                ],
                "answer": 0
            },
            {
                "q": "If HCF(a,b)=1, then a and b are:",
                "options": [
                    "Equal",
                    "Co-prime",
                    "Composite",
                    "Prime"
                ],
                "answer": 1
            },
            {
                "q": "LCM of two co-prime numbers is:",
                "options": [
                    "Their sum",
                    "Their product",
                    "Their HCF",
                    "1"
                ],
                "answer": 1
            },
            {
                "q": "Number of factors of 16:",
                "options": [
                    "3",
                    "4",
                    "5",
                    "6"
                ],
                "answer": 2
            },
            {
                "q": "Smallest composite number:",
                "options": [
                    "1",
                    "2",
                    "4",
                    "6"
                ],
                "answer": 2
            },
            {
                "q": "Greatest prime number less than 50:",
                "options": [
                    "43",
                    "47",
                    "49",
                    "51"
                ],
                "answer": 1
            }
        ],
        "penPaperQuestions": [
            {
                "q": "Find all prime numbers between 1 and 50 using Sieve of Eratosthenes method.",
                "hint": "Cross out multiples"
            },
            {
                "q": "Find the prime factorization of 72 and 84 using factor tree method.",
                "hint": "Keep dividing by primes"
            }
        ]
    },
    {
        "id": 6,
        "number": "6",
        "title": "Perimeter and Area",
        "description": "Measuring boundaries and surfaces",
        "topics": [
            {
                "name": "Perimeter",
                "content": "Perimeter is the total distance around the boundary of a two-dimensional shape. It is measured in units of length such as centimeters, meters, or kilometers. To find the perimeter, add up the lengths of all the sides of the shape. For a triangle with sides a, b, and c, perimeter = a + b + c. For a square with side s, perimeter = 4s (since all four sides are equal). For a rectangle with length l and breadth b, perimeter = 2(l + b) or 2l + 2b. For irregular shapes, measure each side and add them all together. Perimeter is used in real life for many purposes: calculating the length of fencing needed for a garden, the amount of border tape for a bulletin board, the distance around a running track, or the length of ribbon to wrap around a gift box. Understanding perimeter helps in construction, landscaping, sports field design, and many everyday situations where we need to know the distance around something."
            },
            {
                "name": "Area of Rectangle",
                "content": "Area is the amount of space inside a two-dimensional shape, measured in square units (cm², m², km²). For a rectangle, Area = length × breadth (or width). This formula works because a rectangle can be divided into unit squares, and the total number of squares equals length times breadth. For example, a rectangle 5 cm long and 3 cm wide has area = 5 × 3 = 15 cm². For a square (a special rectangle with equal sides), Area = side × side = side². Understanding area is essential for many real-life applications: calculating how much paint is needed to cover a wall, how much carpet for a floor, how much land in a plot, or how much fabric for a tablecloth. Area and perimeter are different - two shapes can have the same perimeter but different areas, or the same area but different perimeters. This concept is important in optimization problems, like finding the maximum area for a given perimeter."
            },
            {
                "name": "Area of Irregular Shapes",
                "content": "Irregular shapes don't have standard formulas, so we use different strategies to find their areas. One method is to divide the irregular shape into regular shapes (rectangles, triangles, squares) whose areas we can calculate, then add them together. Another method is to enclose the irregular shape in a rectangle, calculate the rectangle's area, then subtract the areas of the parts outside the irregular shape. For very irregular shapes, we can use a grid method: place the shape on graph paper, count the full squares inside, estimate partial squares (count squares more than half-filled as 1, less than half as 0), and add them up. This gives an approximate area. In real life, irregular areas include lakes, countries, leaves, and floor plans of houses. Surveyors and architects regularly calculate irregular areas. Understanding how to break complex shapes into simpler ones is a valuable problem-solving skill used throughout mathematics and science."
            }
        ],
        "questions": [
            {
                "q": "The perimeter of a square with side 5 cm is:",
                "options": [
                    "10 cm",
                    "15 cm",
                    "20 cm",
                    "25 cm"
                ],
                "answer": 2
            },
            {
                "q": "Area of a rectangle with length 8 cm and breadth 5 cm is:",
                "options": [
                    "13 sq cm",
                    "26 sq cm",
                    "40 sq cm",
                    "80 sq cm"
                ],
                "answer": 2
            },
            {
                "q": "If perimeter of a square is 24 cm, its side is:",
                "options": [
                    "4 cm",
                    "6 cm",
                    "8 cm",
                    "12 cm"
                ],
                "answer": 1
            },
            {
                "q": "Perimeter of a rectangle with l=10 cm, b=6 cm is:",
                "options": [
                    "16 cm",
                    "32 cm",
                    "60 cm",
                    "26 cm"
                ],
                "answer": 1
            },
            {
                "q": "Area of a square with side 7 cm is:",
                "options": [
                    "14 sq cm",
                    "28 sq cm",
                    "49 sq cm",
                    "21 sq cm"
                ],
                "answer": 2
            },
            {
                "q": "Perimeter formula for rectangle:",
                "options": [
                    "l + b",
                    "2(l + b)",
                    "l x b",
                    "2 x l x b"
                ],
                "answer": 1
            },
            {
                "q": "Area formula for rectangle:",
                "options": [
                    "l + b",
                    "2(l + b)",
                    "l x b",
                    "2 x l x b"
                ],
                "answer": 2
            },
            {
                "q": "Perimeter formula for square:",
                "options": [
                    "s",
                    "2s",
                    "4s",
                    "s x s"
                ],
                "answer": 2
            },
            {
                "q": "Area formula for square:",
                "options": [
                    "s",
                    "2s",
                    "4s",
                    "s x s"
                ],
                "answer": 3
            },
            {
                "q": "If area of square is 64 sq cm, side is:",
                "options": [
                    "4 cm",
                    "8 cm",
                    "16 cm",
                    "32 cm"
                ],
                "answer": 1
            },
            {
                "q": "Perimeter of equilateral triangle with side 6 cm:",
                "options": [
                    "12 cm",
                    "18 cm",
                    "24 cm",
                    "36 cm"
                ],
                "answer": 1
            },
            {
                "q": "Area of rectangle with l=12 m, b=8 m:",
                "options": [
                    "20 sq m",
                    "40 sq m",
                    "96 sq m",
                    "192 sq m"
                ],
                "answer": 2
            },
            {
                "q": "If perimeter of rectangle is 30 cm and l=10 cm, b=:",
                "options": [
                    "5 cm",
                    "10 cm",
                    "15 cm",
                    "20 cm"
                ],
                "answer": 0
            },
            {
                "q": "Area of square with perimeter 20 cm:",
                "options": [
                    "5 sq cm",
                    "20 sq cm",
                    "25 sq cm",
                    "100 sq cm"
                ],
                "answer": 2
            },
            {
                "q": "Perimeter of rectangle with area 24 sq cm and l=6 cm:",
                "options": [
                    "10 cm",
                    "14 cm",
                    "20 cm",
                    "28 cm"
                ],
                "answer": 2
            },
            {
                "q": "Unit of perimeter:",
                "options": [
                    "cm",
                    "sq cm",
                    "cu cm",
                    "cm/s"
                ],
                "answer": 0
            },
            {
                "q": "Unit of area:",
                "options": [
                    "cm",
                    "sq cm",
                    "cu cm",
                    "cm/s"
                ],
                "answer": 1
            },
            {
                "q": "1 sq m = ___ sq cm:",
                "options": [
                    "100",
                    "1000",
                    "10000",
                    "100000"
                ],
                "answer": 2
            },
            {
                "q": "Perimeter of triangle with sides 3, 4, 5 cm:",
                "options": [
                    "6 cm",
                    "12 cm",
                    "20 cm",
                    "60 cm"
                ],
                "answer": 1
            },
            {
                "q": "Area of rectangle doubles if:",
                "options": [
                    "Length doubles",
                    "Breadth doubles",
                    "Both double",
                    "Either A or B"
                ],
                "answer": 3
            },
            {
                "q": "Perimeter of rectangle doubles if:",
                "options": [
                    "Length doubles",
                    "Breadth doubles",
                    "Both double",
                    "Neither"
                ],
                "answer": 2
            },
            {
                "q": "Square and rectangle have same perimeter. Which has more area?",
                "options": [
                    "Square",
                    "Rectangle",
                    "Both same",
                    "Cannot determine"
                ],
                "answer": 0
            },
            {
                "q": "If side of square is doubled, area becomes:",
                "options": [
                    "Double",
                    "Triple",
                    "Four times",
                    "Eight times"
                ],
                "answer": 2
            },
            {
                "q": "If side of square is doubled, perimeter becomes:",
                "options": [
                    "Double",
                    "Triple",
                    "Four times",
                    "Eight times"
                ],
                "answer": 0
            },
            {
                "q": "Area of path around rectangle:",
                "options": [
                    "Outer - Inner",
                    "Outer + Inner",
                    "Outer x Inner",
                    "Outer / Inner"
                ],
                "answer": 0
            },
            {
                "q": "Perimeter of semicircle with diameter 14 cm:",
                "options": [
                    "22 cm",
                    "36 cm",
                    "44 cm",
                    "58 cm"
                ],
                "answer": 1
            },
            {
                "q": "Area of square field with perimeter 100 m:",
                "options": [
                    "100 sq m",
                    "400 sq m",
                    "625 sq m",
                    "2500 sq m"
                ],
                "answer": 2
            },
            {
                "q": "Cost of fencing at Rs 10/m for square field of side 25 m:",
                "options": [
                    "Rs 250",
                    "Rs 500",
                    "Rs 1000",
                    "Rs 2500"
                ],
                "answer": 2
            },
            {
                "q": "Area of rectangular plot 50 m x 30 m:",
                "options": [
                    "80 sq m",
                    "160 sq m",
                    "1500 sq m",
                    "3000 sq m"
                ],
                "answer": 2
            },
            {
                "q": "Perimeter of regular hexagon with side 5 cm:",
                "options": [
                    "15 cm",
                    "25 cm",
                    "30 cm",
                    "35 cm"
                ],
                "answer": 2
            },
            {
                "q": "If area of rectangle is 48 sq cm and l=8 cm, b=:",
                "options": [
                    "4 cm",
                    "6 cm",
                    "8 cm",
                    "12 cm"
                ],
                "answer": 1
            },
            {
                "q": "Perimeter of isosceles triangle with equal sides 5 cm and base 6 cm:",
                "options": [
                    "11 cm",
                    "15 cm",
                    "16 cm",
                    "21 cm"
                ],
                "answer": 2
            },
            {
                "q": "Area of square with diagonal 10 cm:",
                "options": [
                    "25 sq cm",
                    "50 sq cm",
                    "100 sq cm",
                    "200 sq cm"
                ],
                "answer": 1
            },
            {
                "q": "If perimeter of square equals perimeter of rectangle (l=9, b=3), side of square:",
                "options": [
                    "3 cm",
                    "6 cm",
                    "9 cm",
                    "12 cm"
                ],
                "answer": 1
            },
            {
                "q": "Area of rectangle with perimeter 20 cm and l=6 cm:",
                "options": [
                    "12 sq cm",
                    "18 sq cm",
                    "24 sq cm",
                    "30 sq cm"
                ],
                "answer": 2
            },
            {
                "q": "Perimeter of rhombus with side 8 cm:",
                "options": [
                    "16 cm",
                    "24 cm",
                    "32 cm",
                    "64 cm"
                ],
                "answer": 2
            },
            {
                "q": "If area of square is 144 sq cm, perimeter is:",
                "options": [
                    "12 cm",
                    "24 cm",
                    "36 cm",
                    "48 cm"
                ],
                "answer": 3
            },
            {
                "q": "Cost of carpeting at Rs 50/sq m for room 6 m x 4 m:",
                "options": [
                    "Rs 240",
                    "Rs 500",
                    "Rs 1000",
                    "Rs 1200"
                ],
                "answer": 3
            },
            {
                "q": "Perimeter of rectangle is 50 cm. If l=15 cm, area is:",
                "options": [
                    "100 sq cm",
                    "150 sq cm",
                    "200 sq cm",
                    "225 sq cm"
                ],
                "answer": 1
            },
            {
                "q": "Area of square is 81 sq cm. Its perimeter is:",
                "options": [
                    "18 cm",
                    "27 cm",
                    "36 cm",
                    "81 cm"
                ],
                "answer": 2
            }
        ],
        "penPaperQuestions": [
            {
                "q": "A rectangular garden is 25m long and 15m wide. Find its perimeter and area.",
                "hint": "P=2(l+b), A=lxb"
            },
            {
                "q": "Draw a rectangle with perimeter 20 cm. Find all possible dimensions.",
                "hint": "l+b=10"
            }
        ]
    },
    {
        "id": 7,
        "number": "7",
        "title": "Fractions",
        "description": "Understanding parts of a whole",
        "topics": [
            {
                "name": "What is a Fraction",
                "content": "A fraction represents a part of a whole or a part of a group. It consists of two numbers separated by a line: the numerator (top number) tells how many parts we have, and the denominator (bottom number) tells how many equal parts the whole is divided into. For example, 3/4 means 3 parts out of 4 equal parts. Fractions are everywhere in daily life - when we eat half a pizza (1/2), share a chocolate bar equally among 4 friends (1/4 each), or measure 3/4 cup of flour for baking. Fractions can represent parts of objects (half an apple), parts of collections (2/5 of the marbles are red), points on a number line, or division (3/4 = 3 ÷ 4). The fraction bar means 'divided by', so any fraction can be converted to a decimal by dividing the numerator by the denominator. Understanding fractions is essential for cooking, measuring, sharing fairly, and forms the foundation for more advanced mathematics including algebra and calculus."
            },
            {
                "name": "Types of Fractions",
                "content": "Fractions are classified into several types based on the relationship between numerator and denominator. A proper fraction has a numerator smaller than the denominator (like 2/5, 3/4, 7/10) - its value is always less than 1. An improper fraction has a numerator equal to or greater than the denominator (like 5/3, 7/4, 9/9) - its value is 1 or greater. A mixed number combines a whole number with a proper fraction (like 2 1/3, 5 3/4) - it represents a value greater than 1. To convert an improper fraction to a mixed number, divide the numerator by the denominator: the quotient is the whole number, and the remainder over the divisor is the fraction part. For example, 11/4 = 2 3/4 (11÷4 = 2 remainder 3). To convert a mixed number to an improper fraction, multiply the whole number by the denominator, add the numerator, and put over the same denominator. For example, 3 2/5 = (3×5+2)/5 = 17/5. Unit fractions have 1 as the numerator (1/2, 1/3, 1/4)."
            },
            {
                "name": "Equivalent Fractions",
                "content": "Equivalent fractions are different fractions that represent the same value or amount. For example, 1/2 = 2/4 = 3/6 = 4/8 = 50/100 - all these fractions represent the same portion (half). To create equivalent fractions, multiply or divide both the numerator and denominator by the same non-zero number. This works because multiplying by n/n (which equals 1) doesn't change the value. For example, 2/3 × 2/2 = 4/6, so 2/3 = 4/6. To check if two fractions are equivalent, cross-multiply: if a/b = c/d, then a×d = b×c. For example, 2/3 and 8/12: 2×12 = 24 and 3×8 = 24, so they're equivalent. Simplifying fractions means finding an equivalent fraction with the smallest possible numbers - divide both numerator and denominator by their GCF. For example, 12/18 simplified: GCF of 12 and 18 is 6, so 12/18 = 2/3. Equivalent fractions are essential for adding and subtracting fractions with different denominators."
            }
        ],
        "questions": [
            {
                "q": "What type of fraction is 5/3?",
                "options": [
                    "Proper",
                    "Improper",
                    "Mixed",
                    "Unit"
                ],
                "answer": 1
            },
            {
                "q": "Which fraction is equivalent to 2/4?",
                "options": [
                    "1/3",
                    "1/2",
                    "2/3",
                    "3/4"
                ],
                "answer": 1
            },
            {
                "q": "Convert 7/4 to mixed number:",
                "options": [
                    "1 1/4",
                    "1 3/4",
                    "2 1/4",
                    "1 2/4"
                ],
                "answer": 1
            },
            {
                "q": "1/4 + 2/4 = ?",
                "options": [
                    "3/8",
                    "3/4",
                    "1/2",
                    "2/4"
                ],
                "answer": 1
            },
            {
                "q": "Which is greater: 3/5 or 2/5?",
                "options": [
                    "3/5",
                    "2/5",
                    "Both equal",
                    "Cannot compare"
                ],
                "answer": 0
            },
            {
                "q": "A proper fraction has:",
                "options": [
                    "Numerator > Denominator",
                    "Numerator < Denominator",
                    "Numerator = Denominator",
                    "None"
                ],
                "answer": 1
            },
            {
                "q": "An improper fraction has:",
                "options": [
                    "Numerator > Denominator",
                    "Numerator < Denominator",
                    "Numerator = Denominator",
                    "A or C"
                ],
                "answer": 3
            },
            {
                "q": "Convert 2 1/3 to improper fraction:",
                "options": [
                    "5/3",
                    "7/3",
                    "6/3",
                    "8/3"
                ],
                "answer": 1
            },
            {
                "q": "Simplify 8/12:",
                "options": [
                    "2/3",
                    "4/6",
                    "1/2",
                    "3/4"
                ],
                "answer": 0
            },
            {
                "q": "3/4 - 1/4 = ?",
                "options": [
                    "2/4",
                    "1/2",
                    "4/4",
                    "Both A and B"
                ],
                "answer": 3
            },
            {
                "q": "LCM of denominators is needed for:",
                "options": [
                    "Multiplication",
                    "Division",
                    "Addition/Subtraction",
                    "Simplification"
                ],
                "answer": 2
            },
            {
                "q": "2/5 + 1/3 = ?",
                "options": [
                    "3/8",
                    "11/15",
                    "3/15",
                    "7/15"
                ],
                "answer": 1
            },
            {
                "q": "5/6 - 1/3 = ?",
                "options": [
                    "4/6",
                    "1/2",
                    "2/3",
                    "1/3"
                ],
                "answer": 1
            },
            {
                "q": "2/3 x 3/4 = ?",
                "options": [
                    "5/7",
                    "6/12",
                    "1/2",
                    "6/7"
                ],
                "answer": 2
            },
            {
                "q": "3/4 divided by 1/2 = ?",
                "options": [
                    "3/8",
                    "3/2",
                    "6/4",
                    "Both B and C"
                ],
                "answer": 3
            },
            {
                "q": "Reciprocal of 2/5 is:",
                "options": [
                    "2/5",
                    "5/2",
                    "-2/5",
                    "1"
                ],
                "answer": 1
            },
            {
                "q": "Which is smallest: 1/2, 1/3, 1/4?",
                "options": [
                    "1/2",
                    "1/3",
                    "1/4",
                    "All equal"
                ],
                "answer": 2
            },
            {
                "q": "Which is largest: 2/3, 3/4, 5/6?",
                "options": [
                    "2/3",
                    "3/4",
                    "5/6",
                    "All equal"
                ],
                "answer": 2
            },
            {
                "q": "1/2 of 24 = ?",
                "options": [
                    "6",
                    "8",
                    "12",
                    "48"
                ],
                "answer": 2
            },
            {
                "q": "3/4 of 20 = ?",
                "options": [
                    "5",
                    "10",
                    "15",
                    "60"
                ],
                "answer": 2
            },
            {
                "q": "Convert 0.5 to fraction:",
                "options": [
                    "1/5",
                    "5/10",
                    "1/2",
                    "Both B and C"
                ],
                "answer": 3
            },
            {
                "q": "Convert 3/4 to decimal:",
                "options": [
                    "0.34",
                    "0.75",
                    "0.43",
                    "3.4"
                ],
                "answer": 1
            },
            {
                "q": "Sum of 1/2 + 1/3 + 1/6 = ?",
                "options": [
                    "3/11",
                    "1",
                    "3/6",
                    "5/6"
                ],
                "answer": 1
            },
            {
                "q": "Product of 2/3 and its reciprocal:",
                "options": [
                    "0",
                    "1",
                    "4/9",
                    "9/4"
                ],
                "answer": 1
            },
            {
                "q": "If 2/5 of a number is 10, the number is:",
                "options": [
                    "4",
                    "20",
                    "25",
                    "50"
                ],
                "answer": 2
            },
            {
                "q": "Fraction between 1/2 and 3/4:",
                "options": [
                    "1/3",
                    "2/3",
                    "5/8",
                    "Both B and C"
                ],
                "answer": 3
            },
            {
                "q": "1 - 3/7 = ?",
                "options": [
                    "4/7",
                    "3/7",
                    "-4/7",
                    "7/3"
                ],
                "answer": 0
            },
            {
                "q": "2 1/2 + 1 1/4 = ?",
                "options": [
                    "3 1/2",
                    "3 3/4",
                    "4 1/4",
                    "3 2/6"
                ],
                "answer": 1
            },
            {
                "q": "4 1/3 - 2 2/3 = ?",
                "options": [
                    "2 1/3",
                    "1 2/3",
                    "2 2/3",
                    "1 1/3"
                ],
                "answer": 1
            },
            {
                "q": "Like fractions have same:",
                "options": [
                    "Numerator",
                    "Denominator",
                    "Value",
                    "None"
                ],
                "answer": 1
            },
            {
                "q": "Unlike fractions have different:",
                "options": [
                    "Numerators",
                    "Denominators",
                    "Values",
                    "All"
                ],
                "answer": 1
            },
            {
                "q": "Unit fraction has numerator:",
                "options": [
                    "0",
                    "1",
                    "Same as denominator",
                    "Greater than denominator"
                ],
                "answer": 1
            },
            {
                "q": "Fraction form of 25%:",
                "options": [
                    "1/4",
                    "1/25",
                    "25/1",
                    "4/1"
                ],
                "answer": 0
            },
            {
                "q": "Percentage form of 3/4:",
                "options": [
                    "34%",
                    "43%",
                    "75%",
                    "80%"
                ],
                "answer": 2
            },
            {
                "q": "3/5 x 5/3 = ?",
                "options": [
                    "0",
                    "1",
                    "15/15",
                    "Both B and C"
                ],
                "answer": 3
            },
            {
                "q": "Ascending order: 1/2, 2/3, 3/4",
                "options": [
                    "1/2, 2/3, 3/4",
                    "3/4, 2/3, 1/2",
                    "2/3, 1/2, 3/4",
                    "1/2, 3/4, 2/3"
                ],
                "answer": 0
            },
            {
                "q": "Descending order: 5/6, 2/3, 1/2",
                "options": [
                    "1/2, 2/3, 5/6",
                    "5/6, 2/3, 1/2",
                    "2/3, 5/6, 1/2",
                    "5/6, 1/2, 2/3"
                ],
                "answer": 1
            },
            {
                "q": "Fraction equivalent to 3/5 with denominator 20:",
                "options": [
                    "6/20",
                    "9/20",
                    "12/20",
                    "15/20"
                ],
                "answer": 2
            },
            {
                "q": "Simplest form of 18/24:",
                "options": [
                    "9/12",
                    "6/8",
                    "3/4",
                    "2/3"
                ],
                "answer": 2
            },
            {
                "q": "If 3/4 = x/20, then x = ?",
                "options": [
                    "12",
                    "15",
                    "16",
                    "18"
                ],
                "answer": 1
            }
        ],
        "penPaperQuestions": [
            {
                "q": "Add: 2/5 + 1/3 + 1/6. Show all steps.",
                "hint": "Find LCM first"
            },
            {
                "q": "Shade 3/4 of a circle and 2/3 of a rectangle. Which is more?",
                "hint": "Draw and compare"
            }
        ]
    },
    {
        "id": 8,
        "number": "8",
        "title": "Playing with Constructions",
        "description": "Constructing shapes using compass and ruler",
        "topics": [
            {
                "name": "Basic Constructions",
                "content": "Geometric constructions are drawings made using only two tools: a straightedge (ruler without markings) and a compass. These constructions have been studied since ancient Greek times and form the foundation of geometry. The ruler is used to draw straight lines between two points, while the compass is used to draw circles and arcs. Basic constructions include: drawing a line segment of given length, copying a line segment, bisecting (dividing into two equal parts) a line segment, drawing perpendicular lines, and copying angles. The key principle is that we cannot measure - we can only use the compass to transfer distances and the ruler to connect points. These constructions teach precision, logical thinking, and the properties of geometric figures. In real life, construction principles are used in architecture, engineering, art, and design. Learning constructions helps understand why geometric properties work, not just that they work."
            },
            {
                "name": "Constructing Circles",
                "content": "A circle is a set of all points that are at a fixed distance (radius) from a central point (center). To construct a circle using a compass: (1) Mark the center point. (2) Set the compass to the desired radius by placing one leg on a ruler. (3) Place the pointed leg on the center. (4) Rotate the compass 360° while keeping the pointed leg fixed. Key terms: radius (distance from center to any point on circle), diameter (distance across the circle through the center = 2 × radius), chord (line segment with both endpoints on the circle), arc (part of the circle's boundary). Circles are fundamental in geometry - they appear in wheels, coins, clocks, and countless designs. Constructing circles of specific radii is essential for creating other constructions like equilateral triangles, hexagons, and angle bisectors. The compass is also used to transfer distances and create arcs for various geometric constructions."
            },
            {
                "name": "Constructing Angles",
                "content": "Angles can be constructed using only a compass and straightedge, without a protractor. The most fundamental angle constructions are: 60° angle - draw an arc from the vertex, then from where the arc crosses the ray, draw another arc with the same radius to intersect the first arc; connect the vertex to this intersection point. 90° angle (perpendicular) - construct a perpendicular bisector of a line segment. 120° angle - construct a 60° angle and extend one side, or construct two 60° angles adjacent to each other. 30° angle - bisect a 60° angle. 45° angle - bisect a 90° angle. To bisect any angle: draw an arc from the vertex crossing both rays, then from these intersection points draw two arcs of equal radius that intersect; the line from the vertex through this intersection bisects the angle. These constructions are used in architecture, engineering, and art to create precise angles without measuring tools."
            }
        ],
        "questions": [
            {
                "q": "Which tool is used to draw a circle?",
                "options": [
                    "Ruler",
                    "Protractor",
                    "Compass",
                    "Set square"
                ],
                "answer": 2
            },
            {
                "q": "To construct a 60 degree angle, we use:",
                "options": [
                    "Protractor only",
                    "Compass and ruler",
                    "Set square only",
                    "Divider"
                ],
                "answer": 1
            },
            {
                "q": "The radius of a circle is 5 cm. Its diameter is:",
                "options": [
                    "2.5 cm",
                    "5 cm",
                    "10 cm",
                    "15 cm"
                ],
                "answer": 2
            },
            {
                "q": "A perpendicular bisector divides a line segment into:",
                "options": [
                    "Three equal parts",
                    "Two equal parts",
                    "Four equal parts",
                    "Unequal parts"
                ],
                "answer": 1
            },
            {
                "q": "To construct a triangle, minimum how many measurements are needed?",
                "options": [
                    "1",
                    "2",
                    "3",
                    "4"
                ],
                "answer": 2
            },
            {
                "q": "Compass is used to:",
                "options": [
                    "Measure angles",
                    "Draw circles",
                    "Draw straight lines",
                    "Measure length"
                ],
                "answer": 1
            },
            {
                "q": "Protractor is used to:",
                "options": [
                    "Draw circles",
                    "Measure angles",
                    "Draw parallel lines",
                    "Bisect lines"
                ],
                "answer": 1
            },
            {
                "q": "Set square has angles:",
                "options": [
                    "30, 60, 90",
                    "45, 45, 90",
                    "Both A and B",
                    "60, 60, 60"
                ],
                "answer": 2
            },
            {
                "q": "To bisect an angle, we use:",
                "options": [
                    "Ruler only",
                    "Compass only",
                    "Compass and ruler",
                    "Protractor"
                ],
                "answer": 2
            },
            {
                "q": "Perpendicular from a point to a line makes angle:",
                "options": [
                    "45 degrees",
                    "60 degrees",
                    "90 degrees",
                    "180 degrees"
                ],
                "answer": 2
            },
            {
                "q": "To construct 90 degree angle, first construct:",
                "options": [
                    "30 degrees",
                    "45 degrees",
                    "60 degrees",
                    "120 degrees"
                ],
                "answer": 2
            },
            {
                "q": "To construct 45 degree angle:",
                "options": [
                    "Bisect 90 degrees",
                    "Bisect 60 degrees",
                    "Bisect 30 degrees",
                    "Use protractor only"
                ],
                "answer": 0
            },
            {
                "q": "To construct 30 degree angle:",
                "options": [
                    "Bisect 90 degrees",
                    "Bisect 60 degrees",
                    "Bisect 45 degrees",
                    "Bisect 120 degrees"
                ],
                "answer": 1
            },
            {
                "q": "To construct 120 degree angle:",
                "options": [
                    "Double 60 degrees",
                    "Add 60 + 60",
                    "Construct 60 and extend",
                    "All of these"
                ],
                "answer": 3
            },
            {
                "q": "SSS congruence means:",
                "options": [
                    "Side-Side-Side",
                    "Sum-Sum-Sum",
                    "Square-Square-Square",
                    "None"
                ],
                "answer": 0
            },
            {
                "q": "SAS congruence means:",
                "options": [
                    "Side-Angle-Side",
                    "Sum-Angle-Sum",
                    "Side-Area-Side",
                    "None"
                ],
                "answer": 0
            },
            {
                "q": "ASA congruence means:",
                "options": [
                    "Angle-Side-Angle",
                    "Area-Side-Area",
                    "Angle-Sum-Angle",
                    "None"
                ],
                "answer": 0
            },
            {
                "q": "RHS congruence is for:",
                "options": [
                    "All triangles",
                    "Right triangles only",
                    "Equilateral triangles",
                    "Isosceles triangles"
                ],
                "answer": 1
            },
            {
                "q": "To construct equilateral triangle, all sides are:",
                "options": [
                    "Different",
                    "Equal",
                    "Two equal",
                    "None equal"
                ],
                "answer": 1
            },
            {
                "q": "Angle of equilateral triangle:",
                "options": [
                    "30 degrees",
                    "45 degrees",
                    "60 degrees",
                    "90 degrees"
                ],
                "answer": 2
            },
            {
                "q": "To construct isosceles triangle:",
                "options": [
                    "All sides equal",
                    "Two sides equal",
                    "No sides equal",
                    "All angles equal"
                ],
                "answer": 1
            },
            {
                "q": "Scalene triangle has:",
                "options": [
                    "All sides equal",
                    "Two sides equal",
                    "No sides equal",
                    "All angles equal"
                ],
                "answer": 2
            },
            {
                "q": "Sum of angles in triangle:",
                "options": [
                    "90 degrees",
                    "180 degrees",
                    "270 degrees",
                    "360 degrees"
                ],
                "answer": 1
            },
            {
                "q": "Triangle inequality: sum of two sides is:",
                "options": [
                    "Equal to third",
                    "Less than third",
                    "Greater than third",
                    "Any value"
                ],
                "answer": 2
            },
            {
                "q": "Can triangle have sides 2, 3, 6 cm?",
                "options": [
                    "Yes",
                    "No",
                    "Maybe",
                    "Cannot determine"
                ],
                "answer": 1
            },
            {
                "q": "Can triangle have sides 3, 4, 5 cm?",
                "options": [
                    "Yes",
                    "No",
                    "Maybe",
                    "Cannot determine"
                ],
                "answer": 0
            },
            {
                "q": "Divider is used to:",
                "options": [
                    "Draw circles",
                    "Measure/transfer lengths",
                    "Measure angles",
                    "Draw lines"
                ],
                "answer": 1
            },
            {
                "q": "To construct parallel line, we use:",
                "options": [
                    "Compass only",
                    "Ruler only",
                    "Compass and ruler",
                    "Protractor only"
                ],
                "answer": 2
            },
            {
                "q": "Angle bisector divides angle into:",
                "options": [
                    "Three parts",
                    "Two equal parts",
                    "Four parts",
                    "Unequal parts"
                ],
                "answer": 1
            },
            {
                "q": "Perpendicular bisector of chord passes through:",
                "options": [
                    "Chord",
                    "Center of circle",
                    "Circumference",
                    "Tangent"
                ],
                "answer": 1
            },
            {
                "q": "To construct 75 degree angle:",
                "options": [
                    "60 + 15",
                    "45 + 30",
                    "90 - 15",
                    "All of these"
                ],
                "answer": 3
            },
            {
                "q": "To construct 105 degree angle:",
                "options": [
                    "60 + 45",
                    "90 + 15",
                    "120 - 15",
                    "All of these"
                ],
                "answer": 3
            },
            {
                "q": "To construct 135 degree angle:",
                "options": [
                    "90 + 45",
                    "180 - 45",
                    "Both A and B",
                    "60 + 75"
                ],
                "answer": 2
            },
            {
                "q": "To construct 150 degree angle:",
                "options": [
                    "90 + 60",
                    "180 - 30",
                    "Both A and B",
                    "120 + 30"
                ],
                "answer": 2
            },
            {
                "q": "Altitude of triangle is:",
                "options": [
                    "Perpendicular from vertex to opposite side",
                    "Angle bisector",
                    "Median",
                    "Side"
                ],
                "answer": 0
            },
            {
                "q": "Median of triangle connects:",
                "options": [
                    "Vertex to midpoint of opposite side",
                    "Midpoints of two sides",
                    "Two vertices",
                    "None"
                ],
                "answer": 0
            },
            {
                "q": "Centroid divides median in ratio:",
                "options": [
                    "1:1",
                    "1:2",
                    "2:1",
                    "1:3"
                ],
                "answer": 2
            },
            {
                "q": "Circumcenter is equidistant from:",
                "options": [
                    "Vertices",
                    "Sides",
                    "Angles",
                    "Medians"
                ],
                "answer": 0
            },
            {
                "q": "Incenter is equidistant from:",
                "options": [
                    "Vertices",
                    "Sides",
                    "Angles",
                    "Medians"
                ],
                "answer": 1
            },
            {
                "q": "Orthocenter is intersection of:",
                "options": [
                    "Medians",
                    "Altitudes",
                    "Angle bisectors",
                    "Perpendicular bisectors"
                ],
                "answer": 1
            }
        ],
        "penPaperQuestions": [
            {
                "q": "Construct a triangle with sides 5cm, 6cm, and 7cm using compass and ruler.",
                "hint": "Start with base"
            },
            {
                "q": "Construct angles of 60 and 120 degrees using only compass and ruler.",
                "hint": "Use equilateral triangle"
            }
        ]
    },
    {
        "id": 9,
        "number": "9",
        "title": "Symmetry",
        "description": "Understanding symmetry in shapes and figures",
        "topics": [
            {
                "name": "Line Symmetry",
                "content": "Line symmetry (also called reflection symmetry or mirror symmetry) occurs when a figure can be divided by a line into two parts that are mirror images of each other. This dividing line is called the line of symmetry or axis of symmetry. If you fold the figure along this line, both halves will match exactly. To test for line symmetry, imagine placing a mirror along the line - the reflection should complete the original figure. Many objects in nature and everyday life have line symmetry: butterflies, leaves, human faces, the letter A, hearts, and arrows. Some figures have no line symmetry (like the letter F or number 7), while others have multiple lines of symmetry. Symmetry is important in art, architecture, design, and nature because it creates balance and beauty. Understanding symmetry helps in creating patterns, logos, and designs, and is fundamental to understanding more advanced geometric concepts."
            },
            {
                "name": "Lines of Symmetry",
                "content": "Different shapes have different numbers of lines of symmetry. A scalene triangle has 0 lines of symmetry. An isosceles triangle has 1 line of symmetry (through the vertex angle to the midpoint of the base). An equilateral triangle has 3 lines of symmetry (one through each vertex to the midpoint of the opposite side). A rectangle has 2 lines of symmetry (horizontal and vertical through the center). A square has 4 lines of symmetry (2 through opposite sides, 2 through opposite corners). A regular pentagon has 5 lines of symmetry. A regular hexagon has 6 lines of symmetry. In general, a regular polygon with n sides has n lines of symmetry. A circle has infinite lines of symmetry - any diameter is a line of symmetry. Letters of the alphabet have varying symmetry: A, H, I, M, O, T, U, V, W, X, Y have vertical symmetry; B, C, D, E, H, I, K, O, X have horizontal symmetry; H, I, O, X have both."
            },
            {
                "name": "Reflection",
                "content": "Reflection is a transformation that creates a mirror image of a figure across a line (called the line of reflection or mirror line). Every point in the original figure has a corresponding point in the reflected image that is the same distance from the mirror line but on the opposite side. The original figure and its reflection are congruent (same size and shape) but have opposite orientations - like your left and right hands. To reflect a point across a line: draw a perpendicular from the point to the line, then extend it the same distance on the other side. Reflection is used in real life in mirrors, water reflections, and kaleidoscopes. In coordinate geometry, reflecting across the y-axis changes (x, y) to (-x, y); reflecting across the x-axis changes (x, y) to (x, -y). Understanding reflection helps in art, design, and understanding how images form in mirrors and other reflective surfaces."
            }
        ],
        "questions": [
            {
                "q": "How many lines of symmetry does a square have?",
                "options": [
                    "1",
                    "2",
                    "4",
                    "8"
                ],
                "answer": 2
            },
            {
                "q": "A circle has:",
                "options": [
                    "1 line of symmetry",
                    "4 lines",
                    "No line",
                    "Infinite lines"
                ],
                "answer": 3
            },
            {
                "q": "Which letter has vertical line of symmetry?",
                "options": [
                    "F",
                    "A",
                    "G",
                    "J"
                ],
                "answer": 1
            },
            {
                "q": "An equilateral triangle has how many lines of symmetry?",
                "options": [
                    "1",
                    "2",
                    "3",
                    "4"
                ],
                "answer": 2
            },
            {
                "q": "Which shape has no line of symmetry?",
                "options": [
                    "Circle",
                    "Square",
                    "Scalene triangle",
                    "Rectangle"
                ],
                "answer": 2
            },
            {
                "q": "Rectangle has how many lines of symmetry?",
                "options": [
                    "1",
                    "2",
                    "4",
                    "0"
                ],
                "answer": 1
            },
            {
                "q": "Isosceles triangle has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "3"
                ],
                "answer": 1
            },
            {
                "q": "Regular hexagon has how many lines of symmetry?",
                "options": [
                    "3",
                    "4",
                    "6",
                    "8"
                ],
                "answer": 2
            },
            {
                "q": "Regular pentagon has how many lines of symmetry?",
                "options": [
                    "3",
                    "4",
                    "5",
                    "6"
                ],
                "answer": 2
            },
            {
                "q": "Letter H has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "4"
                ],
                "answer": 2
            },
            {
                "q": "Letter B has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "3"
                ],
                "answer": 1
            },
            {
                "q": "Letter O has how many lines of symmetry?",
                "options": [
                    "1",
                    "2",
                    "4",
                    "Infinite"
                ],
                "answer": 3
            },
            {
                "q": "Letter S has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "Infinite"
                ],
                "answer": 0
            },
            {
                "q": "Rhombus has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "4"
                ],
                "answer": 2
            },
            {
                "q": "Parallelogram has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "4"
                ],
                "answer": 0
            },
            {
                "q": "Kite has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "4"
                ],
                "answer": 1
            },
            {
                "q": "Trapezium has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "4"
                ],
                "answer": 0
            },
            {
                "q": "Isosceles trapezium has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "4"
                ],
                "answer": 1
            },
            {
                "q": "Regular octagon has how many lines of symmetry?",
                "options": [
                    "4",
                    "6",
                    "8",
                    "10"
                ],
                "answer": 2
            },
            {
                "q": "Semi-circle has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "Infinite"
                ],
                "answer": 1
            },
            {
                "q": "Line of symmetry is also called:",
                "options": [
                    "Axis of symmetry",
                    "Mirror line",
                    "Fold line",
                    "All of these"
                ],
                "answer": 3
            },
            {
                "q": "Reflection symmetry means:",
                "options": [
                    "Rotation",
                    "Mirror image",
                    "Translation",
                    "Scaling"
                ],
                "answer": 1
            },
            {
                "q": "Rotational symmetry of square:",
                "options": [
                    "Order 2",
                    "Order 3",
                    "Order 4",
                    "Order 6"
                ],
                "answer": 2
            },
            {
                "q": "Rotational symmetry of equilateral triangle:",
                "options": [
                    "Order 2",
                    "Order 3",
                    "Order 4",
                    "Order 6"
                ],
                "answer": 1
            },
            {
                "q": "Rotational symmetry of regular hexagon:",
                "options": [
                    "Order 2",
                    "Order 3",
                    "Order 4",
                    "Order 6"
                ],
                "answer": 3
            },
            {
                "q": "Angle of rotation for order 4 symmetry:",
                "options": [
                    "45 degrees",
                    "60 degrees",
                    "90 degrees",
                    "120 degrees"
                ],
                "answer": 2
            },
            {
                "q": "Angle of rotation for order 6 symmetry:",
                "options": [
                    "45 degrees",
                    "60 degrees",
                    "90 degrees",
                    "120 degrees"
                ],
                "answer": 1
            },
            {
                "q": "Which has both line and rotational symmetry?",
                "options": [
                    "Scalene triangle",
                    "Square",
                    "Parallelogram",
                    "Trapezium"
                ],
                "answer": 1
            },
            {
                "q": "Point symmetry is same as:",
                "options": [
                    "Line symmetry",
                    "Rotational symmetry of order 2",
                    "No symmetry",
                    "Reflection"
                ],
                "answer": 1
            },
            {
                "q": "Which digit has line symmetry?",
                "options": [
                    "2",
                    "3",
                    "5",
                    "6"
                ],
                "answer": 1
            },
            {
                "q": "Which digit has rotational symmetry?",
                "options": [
                    "1",
                    "6",
                    "7",
                    "9"
                ],
                "answer": 1
            },
            {
                "q": "Number 88 has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "3"
                ],
                "answer": 2
            },
            {
                "q": "Number 101 has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "3"
                ],
                "answer": 1
            },
            {
                "q": "Mirror image of 'b' is:",
                "options": [
                    "b",
                    "d",
                    "p",
                    "q"
                ],
                "answer": 1
            },
            {
                "q": "Mirror image of 'p' is:",
                "options": [
                    "b",
                    "d",
                    "p",
                    "q"
                ],
                "answer": 3
            },
            {
                "q": "Which word reads same in mirror?",
                "options": [
                    "MOM",
                    "DAD",
                    "SIS",
                    "BRO"
                ],
                "answer": 0
            },
            {
                "q": "Butterfly has how many lines of symmetry?",
                "options": [
                    "0",
                    "1",
                    "2",
                    "4"
                ],
                "answer": 1
            },
            {
                "q": "Human face has approximately:",
                "options": [
                    "No symmetry",
                    "1 line of symmetry",
                    "2 lines of symmetry",
                    "4 lines of symmetry"
                ],
                "answer": 1
            },
            {
                "q": "Which playing card suit has rotational symmetry?",
                "options": [
                    "Heart",
                    "Diamond",
                    "Club",
                    "All"
                ],
                "answer": 3
            },
            {
                "q": "Snowflake typically has how many lines of symmetry?",
                "options": [
                    "3",
                    "4",
                    "6",
                    "8"
                ],
                "answer": 2
            }
        ],
        "penPaperQuestions": [
            {
                "q": "Draw all lines of symmetry for: Square, Rectangle, Equilateral Triangle, Circle",
                "hint": "Fold test"
            },
            {
                "q": "Complete the symmetric figure given half of a butterfly shape.",
                "hint": "Mirror image"
            }
        ]
    },
    {
        "id": 10,
        "number": "10",
        "title": "The Other Side of Zero",
        "description": "Introduction to negative numbers and integers",
        "topics": [
            {
                "name": "Negative Numbers",
                "content": "Negative numbers are numbers less than zero, written with a minus sign (-) before them. They represent quantities that are opposite to positive numbers - like debt (opposite of money), below sea level (opposite of above), or temperatures below freezing. On a thermometer, temperatures below 0°C are negative: -5°C is colder than -2°C. In banking, a negative balance means you owe money. In elevators, basement floors are often labeled B1, B2 or -1, -2. The concept of negative numbers took centuries to develop - ancient mathematicians struggled with the idea of 'less than nothing.' Today, negative numbers are essential in science, economics, and everyday life. When comparing negative numbers, the one farther from zero is smaller: -10 < -5 < -1 < 0. The opposite of a negative number is positive: the opposite of -7 is +7 or just 7. Understanding negative numbers opens the door to algebra and advanced mathematics."
            },
            {
                "name": "Integers",
                "content": "Integers are the set of all whole numbers, including positive numbers (1, 2, 3...), negative numbers (-1, -2, -3...), and zero. The set of integers is written as {..., -3, -2, -1, 0, 1, 2, 3, ...} and extends infinitely in both directions. Integers do not include fractions or decimals - so 1/2, 0.5, and 3.14 are not integers. Zero is special - it's neither positive nor negative, and it's the only integer that is its own opposite. Positive integers are also called natural numbers or counting numbers. The absolute value of an integer is its distance from zero, always positive: |−5| = 5 and |5| = 5. Integers are used in real life for temperatures, elevations, bank balances, golf scores (under/over par), and time zones. Operations with integers follow specific rules: adding two negatives gives a negative, multiplying two negatives gives a positive. Understanding integers is fundamental for algebra and higher mathematics."
            },
            {
                "name": "Number Line",
                "content": "A number line is a visual representation of numbers as points on a straight line. Zero is placed at the center, positive numbers extend to the right, and negative numbers extend to the left. Each point on the line corresponds to exactly one number, and each number corresponds to exactly one point. The distance between consecutive integers is always the same (usually 1 unit). Number lines help visualize: (1) The order of numbers - numbers increase as you move right, decrease as you move left. (2) Comparing numbers - the number farther right is greater. (3) Absolute value - the distance from zero. (4) Addition - moving right for positive, left for negative. (5) Subtraction - the distance between two numbers. For example, to add -3 + 5, start at -3 and move 5 units right to reach 2. To find the distance between -4 and 3, count the units: 7. Number lines are used in thermometers, rulers, timelines, and coordinate systems. They form the foundation for understanding the coordinate plane in algebra."
            }
        ],
        "questions": [
            {
                "q": "Which is smaller: -5 or -3?",
                "options": [
                    "-5",
                    "-3",
                    "Both equal",
                    "Cannot compare"
                ],
                "answer": 0
            },
            {
                "q": "The integer between -2 and 0 is:",
                "options": [
                    "-3",
                    "-1",
                    "1",
                    "2"
                ],
                "answer": 1
            },
            {
                "q": "What is 5 + (-3)?",
                "options": [
                    "8",
                    "2",
                    "-2",
                    "-8"
                ],
                "answer": 1
            },
            {
                "q": "The opposite of -7 is:",
                "options": [
                    "-7",
                    "0",
                    "7",
                    "1/7"
                ],
                "answer": 2
            },
            {
                "q": "On a number line, -4 is to the _____ of 0:",
                "options": [
                    "Right",
                    "Left",
                    "Above",
                    "Below"
                ],
                "answer": 1
            },
            {
                "q": "What is (-3) + (-5)?",
                "options": [
                    "8",
                    "-8",
                    "2",
                    "-2"
                ],
                "answer": 1
            },
            {
                "q": "What is (-8) - (-3)?",
                "options": [
                    "-11",
                    "-5",
                    "5",
                    "11"
                ],
                "answer": 1
            },
            {
                "q": "What is 6 - 9?",
                "options": [
                    "3",
                    "-3",
                    "15",
                    "-15"
                ],
                "answer": 1
            },
            {
                "q": "What is (-4) x 3?",
                "options": [
                    "12",
                    "-12",
                    "7",
                    "-7"
                ],
                "answer": 1
            },
            {
                "q": "What is (-6) x (-2)?",
                "options": [
                    "12",
                    "-12",
                    "8",
                    "-8"
                ],
                "answer": 0
            },
            {
                "q": "What is (-15) / 3?",
                "options": [
                    "5",
                    "-5",
                    "12",
                    "-12"
                ],
                "answer": 1
            },
            {
                "q": "What is (-20) / (-4)?",
                "options": [
                    "5",
                    "-5",
                    "16",
                    "-16"
                ],
                "answer": 0
            },
            {
                "q": "Absolute value of -9 is:",
                "options": [
                    "-9",
                    "9",
                    "0",
                    "1/9"
                ],
                "answer": 1
            },
            {
                "q": "Which is greatest: -2, -5, -1, -10?",
                "options": [
                    "-2",
                    "-5",
                    "-1",
                    "-10"
                ],
                "answer": 2
            },
            {
                "q": "Which is smallest: 3, -3, 0, -1?",
                "options": [
                    "3",
                    "-3",
                    "0",
                    "-1"
                ],
                "answer": 1
            },
            {
                "q": "Sum of -7 and 7 is:",
                "options": [
                    "14",
                    "-14",
                    "0",
                    "49"
                ],
                "answer": 2
            },
            {
                "q": "Product of -5 and 0 is:",
                "options": [
                    "5",
                    "-5",
                    "0",
                    "Undefined"
                ],
                "answer": 2
            },
            {
                "q": "(-1) x (-1) x (-1) = ?",
                "options": [
                    "1",
                    "-1",
                    "3",
                    "-3"
                ],
                "answer": 1
            },
            {
                "q": "(-2)^3 = ?",
                "options": [
                    "6",
                    "-6",
                    "8",
                    "-8"
                ],
                "answer": 3
            },
            {
                "q": "(-3)^2 = ?",
                "options": [
                    "6",
                    "-6",
                    "9",
                    "-9"
                ],
                "answer": 2
            },
            {
                "q": "Additive inverse of 5 is:",
                "options": [
                    "5",
                    "-5",
                    "1/5",
                    "-1/5"
                ],
                "answer": 1
            },
            {
                "q": "Additive inverse of -8 is:",
                "options": [
                    "8",
                    "-8",
                    "1/8",
                    "-1/8"
                ],
                "answer": 0
            },
            {
                "q": "If a + b = 0, then b is:",
                "options": [
                    "Equal to a",
                    "Opposite of a",
                    "Reciprocal of a",
                    "Square of a"
                ],
                "answer": 1
            },
            {
                "q": "Temperature -5 C is _____ than 0 C:",
                "options": [
                    "Warmer",
                    "Colder",
                    "Same",
                    "Cannot compare"
                ],
                "answer": 1
            },
            {
                "q": "Sea level is represented by:",
                "options": [
                    "-1",
                    "0",
                    "1",
                    "100"
                ],
                "answer": 1
            },
            {
                "q": "5 m below sea level is:",
                "options": [
                    "5 m",
                    "-5 m",
                    "0 m",
                    "10 m"
                ],
                "answer": 1
            },
            {
                "q": "Profit of Rs 100 is +100, loss of Rs 50 is:",
                "options": [
                    "+50",
                    "-50",
                    "50",
                    "150"
                ],
                "answer": 1
            },
            {
                "q": "If temperature rises from -3 C to 5 C, change is:",
                "options": [
                    "2 C",
                    "8 C",
                    "-8 C",
                    "-2 C"
                ],
                "answer": 1
            },
            {
                "q": "If temperature falls from 2 C to -4 C, change is:",
                "options": [
                    "2 C",
                    "6 C",
                    "-6 C",
                    "-2 C"
                ],
                "answer": 2
            },
            {
                "q": "Integers include:",
                "options": [
                    "Only positive numbers",
                    "Only negative numbers",
                    "Positive, negative, and zero",
                    "Only zero"
                ],
                "answer": 2
            },
            {
                "q": "Whole numbers include:",
                "options": [
                    "Negative numbers",
                    "Zero and positive integers",
                    "Only positive integers",
                    "All integers"
                ],
                "answer": 1
            },
            {
                "q": "Natural numbers include:",
                "options": [
                    "Zero",
                    "Negative numbers",
                    "Positive integers only",
                    "All integers"
                ],
                "answer": 2
            },
            {
                "q": "Which is NOT an integer?",
                "options": [
                    "-5",
                    "0",
                    "3.5",
                    "100"
                ],
                "answer": 2
            },
            {
                "q": "Successor of -1 is:",
                "options": [
                    "-2",
                    "0",
                    "1",
                    "2"
                ],
                "answer": 1
            },
            {
                "q": "Predecessor of 0 is:",
                "options": [
                    "-1",
                    "0",
                    "1",
                    "-2"
                ],
                "answer": 0
            },
            {
                "q": "How many integers between -3 and 3?",
                "options": [
                    "5",
                    "6",
                    "7",
                    "Infinite"
                ],
                "answer": 0
            },
            {
                "q": "(-10) + 10 + (-5) + 5 = ?",
                "options": [
                    "0",
                    "10",
                    "20",
                    "30"
                ],
                "answer": 0
            },
            {
                "q": "Arrange in ascending: 5, -3, 0, -7, 2",
                "options": [
                    "-7,-3,0,2,5",
                    "-3,-7,0,2,5",
                    "5,2,0,-3,-7",
                    "0,-3,-7,2,5"
                ],
                "answer": 0
            },
            {
                "q": "Arrange in descending: -1, -5, 3, 0, -2",
                "options": [
                    "3,0,-1,-2,-5",
                    "-5,-2,-1,0,3",
                    "3,-1,0,-2,-5",
                    "-1,-2,-5,0,3"
                ],
                "answer": 0
            },
            {
                "q": "(-8) - 0 = ?",
                "options": [
                    "8",
                    "-8",
                    "0",
                    "Undefined"
                ],
                "answer": 1
            }
        ],
        "penPaperQuestions": [
            {
                "q": "Draw a number line from -10 to +10 and mark: -7, -3, 0, 4, 8",
                "hint": "Equal spacing"
            },
            {
                "q": "Calculate: (-5) + 8 + (-3) + 6 + (-2). Show on number line.",
                "hint": "Move left for negative"
            }
        ]
    }
];


// NCERT Class 7 Mathematics Chapters Data (15 chapters, 40 questions each)
const chapters7 = [{"id": 1, "number": "1", "title": "Large Numbers Around Us", "description": "Exploring large numbers like lakhs and crores, place value system, patterns in products, and real-world applications of big numbers", "topics": [{"name": "1.1 A Lakh Varieties!", "content": "This topic introduces large numbers through the fascinating story of rice varieties in India. Did you know there are more than 1,00,000 (one lakh) varieties of rice in the world? This helps students understand just how big one lakh really is.<br><br><b>Understanding One Lakh (1,00,000):</b><br>One lakh = 100 thousands = 10 ten-thousands. If you count 1 number per second, it would take you about 28 hours to count to one lakh!<br><br><b>Real-World Examples of Large Numbers:</b><br>• India has approximately 140 crore people<br>• The Earth is about 15 crore km from the Sun<br>• A pinch of sand contains about 10,000 grains<br>• The Indian Railways carries about 2.3 crore passengers daily<br><br><b>Place Value Connections:</b><br>In the Indian system: 1,00,000 = 1 lakh. Each comma groups digits differently than the international system.<br>• Indian: 1,00,00,000 (1 crore)<br>• International: 10,000,000 (10 million)<br><br><b>Practice Tip:</b> When dealing with large numbers, always try to relate them to something you can visualize. For example, your school might have 1,000 students — so 1 lakh would be 100 schools like yours!"}, {"name": "1.2 Land of Tens", "content": "Our number system is built entirely on powers of ten. This topic explores why we use base-10 and how place values work.<br><br><b>Powers of Ten:</b><br>• 10⁰ = 1 (ones place)<br>• 10¹ = 10 (tens place)<br>• 10² = 100 (hundreds place)<br>• 10³ = 1,000 (thousands place)<br>• 10⁴ = 10,000 (ten-thousands place)<br>• 10⁵ = 1,00,000 (lakhs place)<br>• 10⁶ = 10,00,000 (ten-lakhs place)<br>• 10⁷ = 1,00,00,000 (crores place)<br><br><b>Why Base 10?</b><br>Humans have 10 fingers, which is likely why we developed a base-10 system. Other civilizations used base-12 (Babylonians counted finger joints) or base-20 (Mayans counted fingers and toes).<br><br><b>Expanded Form:</b><br>Every number can be written as a sum of place values:<br>5,34,267 = 5×1,00,000 + 3×10,000 + 4×1,000 + 2×100 + 6×10 + 7×1<br><br><b>Reading Large Numbers:</b><br>In the Indian system, commas are placed after the hundreds, then every two digits: 1,23,45,678. Read as: one crore twenty-three lakh forty-five thousand six hundred seventy-eight.<br><br><b>Fun Fact:</b> Computers use base-2 (binary) because they work with ON/OFF switches!"}, {"name": "1.3 Of Crores and Crores!", "content": "This section extends the place value system to crores and beyond. Students learn to read, write, and compare very large numbers used in real life.<br><br><b>Indian Place Value Chart (up to Crores):</b><br>Crores | Ten Lakhs | Lakhs | Ten Thousands | Thousands | Hundreds | Tens | Ones<br><br><b>Key Conversions:</b><br>• 1 lakh = 100 thousand<br>• 10 lakhs = 1 million<br>• 1 crore = 100 lakhs = 10 million<br>• 10 crores = 100 million = 1 arab<br>• 100 crores = 1 billion<br><br><b>Comparing Large Numbers:</b><br>Step 1: Count the digits — more digits means bigger number<br>Step 2: If same digits, compare from the leftmost digit<br>Example: 45,23,100 vs 45,32,100 → Compare lakhs place: 23 < 32, so first number is smaller<br><br><b>Real-World Large Numbers:</b><br>• India's GDP: approximately 350 lakh crore rupees<br>• Distance to nearest star (Proxima Centauri): about 4 light years = 40,00,00,00,00,000 km<br>• Number of cells in human body: about 37 lakh crore<br><br><b>Practice Tip:</b> When comparing numbers, first check the number of digits. A 7-digit number is always greater than any 6-digit number, no matter what the digits are!"}, {"name": "1.4 Exact and Approximate Values", "content": "In real life, we often don't need exact numbers — approximations are more practical and easier to understand.<br><br><b>When to Use Approximations:</b><br>• Population of a city: We say 'about 2 crore' not '2,01,34,567'<br>• Distance between cities: 'about 300 km' not '297.4 km'<br>• Cost of a project: 'approximately 50 lakh' not '49,87,342'<br><br><b>Rounding Rules:</b><br>• If the digit to be dropped is 0-4: round down (keep the digit same)<br>• If the digit to be dropped is 5-9: round up (increase the digit by 1)<br><br><b>Examples:</b><br>• 7,32,461 rounded to nearest lakh = 7,00,000<br>• 7,62,461 rounded to nearest lakh = 8,00,000<br>• 3,456 rounded to nearest hundred = 3,500<br>• 3,432 rounded to nearest hundred = 3,400<br><br><b>Estimation in Calculations:</b><br>To estimate 4,891 + 3,207:<br>Round each: 5,000 + 3,000 = 8,000 (actual: 8,098)<br>This is useful for quickly checking if your answer makes sense!<br><br><b>Real-World Application:</b> Scientists often work with approximate values. The speed of light is approximately 3,00,000 km/s (exact: 2,99,792.458 km/s). The approximation is much easier to work with!"}, {"name": "1.5 Patterns in Products", "content": "This topic explores fascinating patterns that emerge when multiplying numbers, helping students discover relationships between products and factors.<br><br><b>Pattern 1 - Multiplying by Powers of 10:</b><br>• 37 × 10 = 370 (add one zero)<br>• 37 × 100 = 3,700 (add two zeros)<br>• 37 × 1,000 = 37,000 (add three zeros)<br><br><b>Pattern 2 - Interesting Product Patterns:</b><br>• 1 × 9 + 1 = 10<br>• 12 × 9 + 2 = 110<br>• 123 × 9 + 3 = 1110<br>• 1234 × 9 + 4 = 11110<br><br><b>Pattern 3 - Products with Repeated Digits:</b><br>• 7 × 11 × 13 = 1001<br>• 1001 × any 3-digit number repeats that number: 1001 × 235 = 235235<br><br><b>Pattern 4 - Multiplying by 11:</b><br>• For 2-digit numbers: 34 × 11 = 374 (3, 3+4, 4)<br>• 45 × 11 = 495 (4, 4+5, 5)<br><br><b>Why Patterns Matter:</b><br>Patterns in multiplication help us:<br>• Calculate faster mentally<br>• Check if our answers are reasonable<br>• Understand deeper relationships in mathematics<br><br><b>Practice Tip:</b> Try discovering your own patterns! What happens when you multiply any number by 9 and add its digits?"}, {"name": "1.6 Did You Ever Wonder...?", "content": "A culminating section that poses fascinating questions about large numbers in nature, science, and everyday life, encouraging curiosity and mathematical thinking.<br><br><b>Amazing Number Facts:</b><br>• There are about 1 lakh hairs on a human head<br>• A human heart beats about 1,00,000 times per day<br>• There are about 10 lakh ants for every human on Earth<br>• The Milky Way contains about 100 arab (10,000 crore) stars<br><br><b>Numbers in the Human Body:</b><br>• Red blood cells: about 2.5 crore are produced every second<br>• Nerve signals travel at about 400 km/h<br>• DNA: if stretched out, would be about 2 meters long per cell<br>• Total DNA in your body would stretch from Earth to Pluto and back!<br><br><b>Numbers in Nature:</b><br>• A sunflower can have up to 2,000 seeds<br>• A single tree can have 2,00,000 leaves<br>• Bees visit about 50-100 flowers per trip<br>• A colony of bees can have 60,000-80,000 members<br><br><b>Numbers in Technology:</b><br>• Internet users worldwide: about 500 crore<br>• Google processes about 850 crore searches per day<br>• A smartphone has about 1,000 crore transistors<br><br><b>Think About It:</b> Can you estimate how many words you speak in a day? (Hint: Average person speaks about 16,000 words per day!)"}], "questions": [{"q": "How many zeros are there in 1 lakh?", "options": ["3", "4", "5", "6"], "answer": 2}, {"q": "1 crore is equal to how many lakhs?", "options": ["10", "100", "1000", "10000"], "answer": 1}, {"q": "What is the place value of 5 in 5,34,267?", "options": ["5 thousands", "5 ten-thousands", "5 lakhs", "5 crores"], "answer": 2}, {"q": "Which is the largest 6-digit number?", "options": ["100000", "999999", "900000", "999990"], "answer": 1}, {"q": "Round 7,62,461 to the nearest lakh:", "options": ["7,00,000", "8,00,000", "7,60,000", "7,62,000"], "answer": 1}, {"q": "10 lakhs is equal to:", "options": ["1 crore", "1 million", "10 million", "100 thousand"], "answer": 1}, {"q": "In the number 3,45,678, the digit 4 is in which place?", "options": ["Thousands", "Ten thousands", "Lakhs", "Hundreds"], "answer": 1}, {"q": "What is 37 x 1000?", "options": ["370", "3700", "37000", "370000"], "answer": 2}, {"q": "Which number is greater: 45,23,100 or 45,32,100?", "options": ["45,23,100", "45,32,100", "Both are equal", "Cannot compare"], "answer": 1}, {"q": "The successor of 99,999 is:", "options": ["99,998", "1,00,000", "10,000", "9,99,999"], "answer": 1}, {"q": "How many 6-digit numbers are there in all?", "options": ["9,00,000", "1,00,000", "8,99,999", "9,99,999"], "answer": 0}, {"q": "The smallest 7-digit number is:", "options": ["9999999", "1000000", "1000001", "7000000"], "answer": 1}, {"q": "1 billion = how many crores?", "options": ["10", "100", "1000", "1"], "answer": 1}, {"q": "Round 3,456 to the nearest hundred:", "options": ["3,400", "3,500", "3,000", "3,460"], "answer": 1}, {"q": "What is the expanded form of 6,05,032?", "options": ["6x100000+5x1000+3x10+2x1", "6x100000+5x100+3x10+2x1", "6x100000+0x10000+5x1000+0x100+3x10+2x1", "6x10000+5x1000+32"], "answer": 2}, {"q": "If you count 1 number per second, how long to count to 1 lakh?", "options": ["About 1 hour", "About 10 hours", "About 28 hours", "About 100 hours"], "answer": 2}, {"q": "1001 x 235 = ?", "options": ["235000", "235235", "236235", "235035"], "answer": 1}, {"q": "Which is the predecessor of 10,00,000?", "options": ["9,99,999", "10,00,001", "99,999", "9,99,990"], "answer": 0}, {"q": "45 x 11 = ?", "options": ["455", "495", "485", "505"], "answer": 1}, {"q": "The number of zeros in 10 crore is:", "options": ["6", "7", "8", "9"], "answer": 2}, {"q": "Estimate 4,891 + 3,207 by rounding to thousands:", "options": ["7,000", "8,000", "9,000", "7,500"], "answer": 1}, {"q": "Which digit is in the ten-lakhs place of 3,45,67,890?", "options": ["3", "4", "5", "6"], "answer": 1}, {"q": "1 lakh = ___ ten thousands", "options": ["1", "10", "100", "1000"], "answer": 1}, {"q": "The Indian and International systems differ in:", "options": ["Digits used", "Placement of commas", "Value of numbers", "Base system"], "answer": 1}, {"q": "What is 1 crore in the international system?", "options": ["1 million", "10 million", "100 million", "1 billion"], "answer": 1}, {"q": "How many thousands make 1 lakh?", "options": ["10", "100", "1000", "10000"], "answer": 1}, {"q": "The place value of 0 in 3,05,042 at thousands place is:", "options": ["0", "5000", "5", "50"], "answer": 0}, {"q": "34 x 11 = ?", "options": ["344", "374", "354", "384"], "answer": 1}, {"q": "Which is the correct Indian representation of 10 million?", "options": ["10,00,000", "1,00,00,000", "100,00,000", "1,00,000"], "answer": 1}, {"q": "Round 8,45,600 to nearest lakh:", "options": ["8,00,000", "9,00,000", "8,50,000", "8,45,000"], "answer": 1}, {"q": "The face value of 7 in 47,83,291 is:", "options": ["7", "7,00,000", "70,000", "7000"], "answer": 0}, {"q": "100 crores = ?", "options": ["1 million", "10 million", "100 million", "1 billion"], "answer": 3}, {"q": "What comes just after 9,99,99,999?", "options": ["10,00,00,000", "9,99,99,998", "10,00,00,001", "1,00,00,00,000"], "answer": 0}, {"q": "Which is greater: 8 lakhs or 80 thousand?", "options": ["8 lakhs", "80 thousand", "Both equal", "Cannot compare"], "answer": 0}, {"q": "12 x 9 + 2 = ?", "options": ["100", "108", "110", "112"], "answer": 2}, {"q": "How many digits does the number 1 crore have?", "options": ["6", "7", "8", "9"], "answer": 2}, {"q": "Approximate value of 4,97,850 to nearest lakh:", "options": ["4,00,000", "5,00,000", "4,98,000", "4,97,000"], "answer": 1}, {"q": "The product of 999 and 5 is closest to:", "options": ["4000", "4500", "5000", "5500"], "answer": 2}, {"q": "In 87,65,432, the digit in crores place is:", "options": ["There is no crores digit", "8", "7", "6"], "answer": 0}, {"q": "1 arab = ?", "options": ["10 lakhs", "10 crores", "100 crores", "1000 lakhs"], "answer": 1}]}, {"id": 2, "number": "2", "title": "Arithmetic Expressions", "description": "Understanding and evaluating arithmetic expressions, order of operations, comparing expressions, and reading complex mathematical phrases", "topics": [{"name": "2.1 Simple Expressions", "content": "An arithmetic expression is a combination of numbers and operations (+, –, ×, ÷) that represents a value. Every expression, no matter how complex, evaluates to a single number.<br><br><b>What is an Expression?</b><br>An expression is a mathematical phrase that combines numbers with operations. Examples:<br>• 13 + 2 = 15<br>• 20 – 4 = 16<br>• 12 × 5 = 60<br>• 18 ÷ 3 = 6<br><br><b>Writing Expressions from Situations:</b><br>• 'Raju has 15 marbles and gets 8 more' → 15 + 8<br>• 'A ribbon 20 cm long is cut into 4 equal pieces' → 20 ÷ 4<br>• 'Price of 3 notebooks at Rs. 45 each' → 3 × 45<br><br><b>Properties of Operations:</b><br>• <b>Commutative:</b> a + b = b + a and a × b = b × a (works for addition and multiplication, NOT for subtraction and division)<br>• <b>Identity:</b> a + 0 = a (zero is additive identity), a × 1 = a (one is multiplicative identity)<br>• <b>Zero property:</b> a × 0 = 0<br><br><b>Real-World Connection:</b> Every time you calculate the total cost at a shop, figure out how to split a bill, or measure ingredients for cooking, you are evaluating arithmetic expressions!<br><br><b>Practice Tip:</b> When solving word problems, first identify the numbers and the operation needed before writing the expression."}, {"name": "2.2 Reading and Evaluating Complex Expressions", "content": "When an expression has multiple operations, we need rules to decide which operation to do first. This is called the order of operations (BODMAS/PEMDAS).<br><br><b>BODMAS Rule:</b><br>B – Brackets (solve what's inside first)<br>O – Orders (powers and roots)<br>D – Division (left to right)<br>M – Multiplication (left to right)<br>A – Addition (left to right)<br>S – Subtraction (left to right)<br><br><b>Important:</b> Division and Multiplication have EQUAL priority — do them left to right. Same for Addition and Subtraction.<br><br><b>Examples:</b><br>• 3 + 4 × 5 = 3 + 20 = 23 (NOT 35, because multiplication comes before addition)<br>• (3 + 4) × 5 = 7 × 5 = 35 (brackets change the order!)<br>• 24 ÷ 6 + 2 × 3 = 4 + 6 = 10<br>• 100 – 5 × (8 + 2) = 100 – 5 × 10 = 100 – 50 = 50<br><br><b>Nested Brackets:</b><br>When expressions have brackets within brackets, solve the innermost bracket first:<br>2 × {3 + (4 × 5)} = 2 × {3 + 20} = 2 × 23 = 46<br><br><b>Common Mistakes:</b><br>• Doing operations left to right without considering BODMAS<br>• Forgetting that multiplication/division come before addition/subtraction<br>• Not solving brackets first<br><br><b>Practice Tip:</b> Always underline or highlight the part you need to solve first, then rewrite the expression step by step."}], "questions": [{"q": "What is the value of 3 + 4 x 5?", "options": ["35", "23", "60", "17"], "answer": 1}, {"q": "Evaluate: (3 + 4) x 5", "options": ["23", "35", "60", "17"], "answer": 1}, {"q": "What is 24 / 6 + 2 x 3?", "options": ["10", "15", "18", "6"], "answer": 0}, {"q": "In BODMAS, what does 'B' stand for?", "options": ["Base", "Brackets", "Before", "Below"], "answer": 1}, {"q": "Evaluate: 100 - 5 x (8 + 2)", "options": ["950", "50", "60", "45"], "answer": 1}, {"q": "Which property says a + b = b + a?", "options": ["Associative", "Commutative", "Distributive", "Identity"], "answer": 1}, {"q": "What is the value of 15 + 0?", "options": ["0", "15", "150", "1"], "answer": 1}, {"q": "Evaluate: 2 x {3 + (4 x 5)}", "options": ["46", "70", "50", "26"], "answer": 0}, {"q": "Which operation is performed first in 8 + 6 / 2?", "options": ["Addition", "Division", "Both together", "Neither"], "answer": 1}, {"q": "What is 48 / 8 x 2?", "options": ["3", "12", "6", "16"], "answer": 1}, {"q": "The additive identity is:", "options": ["1", "0", "-1", "None"], "answer": 1}, {"q": "Evaluate: 5 x 4 - 3 x 2", "options": ["14", "34", "26", "7"], "answer": 0}, {"q": "Which is NOT commutative?", "options": ["Addition", "Multiplication", "Subtraction", "Both A and B"], "answer": 2}, {"q": "What is the value of 7 x 1?", "options": ["0", "1", "7", "8"], "answer": 2}, {"q": "Evaluate: 36 / (6 x 3)", "options": ["18", "2", "6", "3"], "answer": 1}, {"q": "In the expression 4 + 3 x 2, which operation is done first?", "options": ["Addition", "Multiplication", "Either one", "None"], "answer": 1}, {"q": "'Price of 5 books at Rs. 30 each' is written as:", "options": ["5 + 30", "5 - 30", "5 x 30", "5 / 30"], "answer": 2}, {"q": "Evaluate: (10 + 5) x (10 - 5)", "options": ["75", "100", "50", "25"], "answer": 0}, {"q": "What is 0 x 999?", "options": ["999", "0", "1", "9990"], "answer": 1}, {"q": "Evaluate: 8 + 8 / 8 + 8 x 8 - 8", "options": ["65", "1", "72", "57"], "answer": 0}, {"q": "Which expression equals 20?", "options": ["4 x 4 + 4", "4 + 4 x 4", "4 x (4 + 4)", "(4 + 4) + 4"], "answer": 1}, {"q": "Evaluate: 15 - 3 x 4 + 2", "options": ["50", "5", "8", "10"], "answer": 1}, {"q": "The multiplicative identity is:", "options": ["0", "1", "-1", "The number itself"], "answer": 1}, {"q": "Evaluate: 50 - {20 - (10 - 5)}", "options": ["25", "35", "40", "15"], "answer": 1}, {"q": "What is 12 / 4 / 3?", "options": ["1", "9", "3", "4"], "answer": 0}, {"q": "A ribbon of 20 cm cut into 4 equal pieces gives each piece of:", "options": ["4 cm", "5 cm", "16 cm", "24 cm"], "answer": 1}, {"q": "Evaluate: 6 + 6 x 6 - 6 / 6", "options": ["41", "42", "36", "30"], "answer": 0}, {"q": "In 5 + 3 x (2 + 4), which bracket is solved first?", "options": ["No brackets needed", "(2 + 4)", "5 + 3", "3 x 2"], "answer": 1}, {"q": "What does BODMAS stand for?", "options": ["Brackets Orders Division Multiplication Addition Subtraction", "Base Operations Division Multiplication Addition Subtraction", "Brackets Of Division Multiplication Addition Subtraction", "Both Orders Division Multiplication Addition Signs"], "answer": 0}, {"q": "Evaluate: 2 + 3 x 4 - 5", "options": ["15", "9", "20", "0"], "answer": 1}, {"q": "Is 8 - 3 the same as 3 - 8?", "options": ["Yes", "No", "Sometimes", "Cannot determine"], "answer": 1}, {"q": "Evaluate: (12 + 8) / (4 + 1)", "options": ["2", "3", "4", "5"], "answer": 2}, {"q": "What is 5 x 5 + 5 x 5?", "options": ["50", "100", "625", "30"], "answer": 0}, {"q": "Evaluate: 1000 / 10 / 10", "options": ["1", "10", "100", "1000"], "answer": 1}, {"q": "Which gives the largest value?", "options": ["2 + 3 x 4", "(2 + 3) x 4", "2 x 3 + 4", "2 x (3 + 4)"], "answer": 1}, {"q": "Evaluate: 7 x 8 - 6 x 9", "options": ["2", "3", "0", "-2"], "answer": 0}, {"q": "Which is correct: 18 / 3 x 2 = 12 or 18 / 3 x 2 = 3?", "options": ["12 is correct", "3 is correct", "Both are correct", "Neither"], "answer": 0}, {"q": "If a = 5, what is a x a + a?", "options": ["30", "15", "25", "35"], "answer": 0}, {"q": "Evaluate: 4 x [8 - (3 + 2)]", "options": ["12", "20", "8", "16"], "answer": 0}, {"q": "Which expression represents 'subtract 7 from the product of 3 and 8'?", "options": ["7 - 3 x 8", "3 x 8 - 7", "(3 - 7) x 8", "3 x (8 - 7)"], "answer": 1}]}, {"id": 3, "number": "3", "title": "A Peek Beyond the Point", "description": "Introduction to decimals - tenths, hundredths, place value, units of measurement, comparing and locating decimals, and arithmetic with decimals", "topics": [{"name": "3.1 The Need for Smaller Units", "content": "When whole numbers aren't enough to express a measurement precisely, we need smaller parts — and that's where decimals come in.<br><br><b>Why Do We Need Decimals?</b><br>Imagine measuring your height. You're not exactly 1 meter tall and not exactly 2 meters — you're somewhere in between, like 1.35 meters. Whole numbers can't express this!<br><br><b>Situations Requiring Decimals:</b><br>• Temperature: 98.6°F (normal body temperature)<br>• Money: Rs. 45.50 (forty-five rupees and fifty paise)<br>• Weight: 2.5 kg of rice<br>• Distance: The school is 1.8 km away<br><br><b>From Fractions to Decimals:</b><br>Decimals are really fractions with denominators that are powers of 10:<br>• 1/10 = 0.1 (one-tenth)<br>• 1/100 = 0.01 (one-hundredth)<br>• 3/10 = 0.3<br>• 25/100 = 0.25<br><br><b>The Decimal Point:</b><br>The dot between the whole number part and the fractional part is the decimal point. It separates 'wholes' from 'parts'.<br>In 23.45: 23 is the whole part, 45 is the decimal (fractional) part.<br><br><b>Practice Tip:</b> Think of decimals as money — Rs. 3.75 means 3 whole rupees and 75 paise (hundredths of a rupee)."}, {"name": "3.2 A Tenth Part", "content": "When we divide something into 10 equal parts, each part is called one-tenth. In decimal notation, one-tenth is written as 0.1.<br><br><b>Understanding Tenths:</b><br>• 1/10 = 0.1 = one-tenth<br>• 2/10 = 0.2 = two-tenths<br>• 5/10 = 0.5 = five-tenths = one-half<br>• 10/10 = 1.0 = one whole<br><br><b>Visualizing Tenths:</b><br>Imagine a strip of paper divided into 10 equal parts. Each part represents 0.1. If you shade 3 parts, you have shaded 0.3 of the strip.<br><br><b>Tenths on a Number Line:</b><br>Between 0 and 1, there are 9 points at equal distances: 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9<br>Between 3 and 4: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9<br><br><b>Tenths in Measurement:</b><br>• 1 cm = 10 mm, so 1 mm = 0.1 cm<br>• 1 meter = 10 decimeters, so 1 dm = 0.1 m<br>• 1 kg = 10 hectograms<br><br><b>Real-World Application:</b> When a shopkeeper weighs vegetables and says '2.3 kg', it means 2 kg and 3 tenths of a kg (which is 300 grams)."}, {"name": "3.3 A Hundredth Part", "content": "When we divide something into 100 equal parts, each part is called one-hundredth. In decimal notation, one-hundredth is written as 0.01.<br><br><b>Understanding Hundredths:</b><br>• 1/100 = 0.01 = one-hundredth<br>• 5/100 = 0.05 = five-hundredths<br>• 25/100 = 0.25 = twenty-five hundredths<br>• 100/100 = 1.00 = one whole<br><br><b>Relationship Between Tenths and Hundredths:</b><br>• 1 tenth = 10 hundredths (0.1 = 0.10)<br>• 0.30 = 0.3 (3 tenths = 30 hundredths)<br>• 0.50 = 0.5 (5 tenths = 50 hundredths)<br><br><b>Money Connection:</b><br>• 1 rupee = 100 paise<br>• 1 paisa = 0.01 rupee<br>• 25 paise = 0.25 rupee = Rs. 0.25<br>• Rs. 7.50 = 7 rupees and 50 paise<br><br><b>Percentage Connection:</b><br>Percent means 'per hundred'. So 25% = 25/100 = 0.25. This connection between percentages and decimals is very useful!<br><br><b>Practice Tip:</b> To convert a fraction with denominator 100 to decimal, simply write the numerator with a decimal point two places from the right: 75/100 = 0.75."}, {"name": "3.4 Decimal Place Value", "content": "Just like whole numbers have ones, tens, hundreds places going left, decimals have tenths, hundredths, thousandths places going right from the decimal point.<br><br><b>Decimal Place Value Chart:</b><br>... Hundreds | Tens | Ones . Tenths | Hundredths | Thousandths ...<br>... 100 | 10 | 1 . 1/10 | 1/100 | 1/1000 ...<br><br><b>Reading Decimal Numbers:</b><br>• 3.7 = 'three point seven' or 'three and seven-tenths'<br>• 15.23 = 'fifteen point two three' or 'fifteen and twenty-three hundredths'<br>• 0.456 = 'zero point four five six' or 'four hundred fifty-six thousandths'<br><br><b>Expanded Form of Decimals:</b><br>34.56 = 3×10 + 4×1 + 5×(1/10) + 6×(1/100)<br>= 30 + 4 + 0.5 + 0.06<br><br><b>Key Rule:</b> Adding zeros at the end of a decimal doesn't change its value:<br>0.5 = 0.50 = 0.500 (all equal five-tenths)<br>But adding zeros between the decimal point and a digit DOES change it:<br>0.5 ≠ 0.05 ≠ 0.005<br><br><b>Practice Tip:</b> When comparing or adding decimals, it helps to make them have the same number of decimal places by adding trailing zeros."}, {"name": "3.5 Units of Measurement", "content": "Decimals are essential for converting between different units of measurement. Understanding these conversions helps in science, cooking, and daily life.<br><br><b>Length Conversions:</b><br>• 1 km = 1000 m, so 1 m = 0.001 km<br>• 1 m = 100 cm, so 1 cm = 0.01 m<br>• 1 cm = 10 mm, so 1 mm = 0.1 cm<br>• Example: 3 km 250 m = 3.250 km = 3.25 km<br>• Example: 7 m 5 cm = 7.05 m<br><br><b>Weight Conversions:</b><br>• 1 kg = 1000 g, so 1 g = 0.001 kg<br>• Example: 2 kg 500 g = 2.500 kg = 2.5 kg<br>• Example: 750 g = 0.750 kg = 0.75 kg<br><br><b>Capacity Conversions:</b><br>• 1 litre = 1000 mL, so 1 mL = 0.001 L<br>• Example: 1 L 200 mL = 1.200 L = 1.2 L<br><br><b>Common Mistakes to Avoid:</b><br>• 3 m 5 cm is NOT 3.5 m! It is 3.05 m (since 5 cm = 0.05 m)<br>• 2 kg 50 g is NOT 2.50 kg! It is 2.050 kg (since 50 g = 0.050 kg)<br><br><b>Practice Tip:</b> Always check: how many smaller units make one larger unit? If 100 cm = 1 m, then to convert cm to m, divide by 100 (move decimal point 2 places left)."}, {"name": "3.6 Locating and Comparing Decimals", "content": "Being able to place decimals on a number line and compare them is a crucial skill. This helps in understanding the size of decimal numbers.<br><br><b>Locating Decimals on Number Line:</b><br>To locate 2.7 on a number line:<br>1. Find the interval 2 to 3<br>2. Divide this interval into 10 equal parts<br>3. Count 7 parts from 2 → that's 2.7<br><br><b>Comparing Decimals:</b><br>Step 1: Compare the whole number parts first<br>Step 2: If equal, compare tenths<br>Step 3: If still equal, compare hundredths, and so on<br><br><b>Examples:</b><br>• 3.5 vs 2.9: 3 > 2, so 3.5 > 2.9<br>• 4.3 vs 4.7: Same whole part (4), compare tenths: 3 < 7, so 4.3 < 4.7<br>• 5.23 vs 5.27: Same whole (5) and tenths (2), compare hundredths: 3 < 7, so 5.23 < 5.27<br><br><b>Ordering Decimals:</b><br>To arrange in ascending order: 0.5, 0.35, 0.53, 0.3<br>Make all same length: 0.50, 0.35, 0.53, 0.30<br>Order: 0.30 < 0.35 < 0.50 < 0.53<br><br><b>Between Any Two Decimals:</b><br>There are infinitely many decimals between any two decimals! Between 0.1 and 0.2: 0.11, 0.12, 0.15, 0.19, etc."}, {"name": "3.7 Addition and Subtraction of Decimals", "content": "Adding and subtracting decimals follows the same rules as whole numbers — just make sure to line up the decimal points!<br><br><b>Rules for Adding Decimals:</b><br>1. Write numbers one below the other, aligning decimal points<br>2. Add trailing zeros if needed to make decimal places equal<br>3. Add as usual, column by column from right to left<br>4. Place the decimal point in the answer directly below<br><br><b>Examples:</b><br>• 23.45 + 7.3 = 23.45 + 7.30 = 30.75<br>• 0.6 + 0.04 = 0.60 + 0.04 = 0.64<br>• 134.5 + 28.75 = 134.50 + 28.75 = 163.25<br><br><b>Rules for Subtracting Decimals:</b><br>Same alignment rules as addition. Borrow from the left when needed, just like with whole numbers.<br><br><b>Examples:</b><br>• 45.8 - 23.5 = 22.3<br>• 10 - 3.75 = 10.00 - 3.75 = 6.25<br>• 5.2 - 0.86 = 5.20 - 0.86 = 4.34<br><br><b>Real-World Problems:</b><br>• You have Rs. 100. You spend Rs. 45.50. Balance = 100.00 - 45.50 = Rs. 54.50<br>• Your height last year was 1.32 m. Now it's 1.40 m. You grew 0.08 m = 8 cm<br><br><b>Practice Tip:</b> Always align decimal points vertically. If a number has no decimal point (like 10), write it as 10.00."}, {"name": "3.8 More on the Decimal System", "content": "The decimal system extends infinitely in both directions — larger place values to the left and smaller ones to the right.<br><br><b>The Pattern of Ten:</b><br>Moving left: each place is 10 times the previous<br>... 1000, 100, 10, 1, 0.1, 0.01, 0.001 ...<br>Moving right: each place is 1/10 of the previous<br><br><b>Thousandths:</b><br>• 0.001 = one-thousandth = 1/1000<br>• 0.025 = twenty-five thousandths<br>• 3.142 = 3 ones + 1 tenth + 4 hundredths + 2 thousandths<br><br><b>Decimal Equivalents of Common Fractions:</b><br>• 1/2 = 0.5<br>• 1/4 = 0.25<br>• 3/4 = 0.75<br>• 1/5 = 0.2<br>• 1/8 = 0.125<br>• 1/3 = 0.333... (repeating)<br><br><b>Interesting Facts:</b><br>• The number π (pi) = 3.14159... has infinite non-repeating decimals<br>• Some fractions give terminating decimals (1/4 = 0.25) while others give repeating decimals (1/3 = 0.333...)<br>• A fraction gives a terminating decimal only when its denominator (in lowest form) has no prime factors other than 2 and 5<br><br><b>Practice Tip:</b> Memorize common fraction-decimal equivalents. They come up frequently in calculations and make mental math much faster!"}], "questions": [{"q": "What is 1/10 in decimal form?", "options": ["0.01", "0.1", "1.0", "10"], "answer": 1}, {"q": "How many tenths make one whole?", "options": ["5", "10", "100", "1000"], "answer": 1}, {"q": "What is 3/100 in decimal?", "options": ["0.3", "0.03", "3.0", "0.003"], "answer": 1}, {"q": "5 cm = ___ m", "options": ["0.5", "0.05", "0.005", "5.0"], "answer": 1}, {"q": "Which is greater: 0.5 or 0.35?", "options": ["0.5", "0.35", "Both equal", "Cannot compare"], "answer": 0}, {"q": "23.45 + 7.3 = ?", "options": ["30.75", "30.48", "96.45", "24.18"], "answer": 0}, {"q": "What is the place value of 6 in 3.46?", "options": ["6 tenths", "6 hundredths", "6 ones", "6 thousandths"], "answer": 1}, {"q": "10 - 3.75 = ?", "options": ["7.25", "6.25", "6.75", "7.75"], "answer": 1}, {"q": "1 km 250 m = ___ km", "options": ["1.25", "1.250", "1.025", "Both A and B"], "answer": 3}, {"q": "0.5 = 0.50 is:", "options": ["True", "False", "Sometimes", "Undefined"], "answer": 0}, {"q": "Which decimal is between 0.3 and 0.4?", "options": ["0.25", "0.35", "0.45", "0.29"], "answer": 1}, {"q": "750 g = ___ kg", "options": ["7.50", "0.750", "75.0", "0.075"], "answer": 1}, {"q": "Arrange in ascending order: 0.5, 0.35, 0.53", "options": ["0.5, 0.35, 0.53", "0.35, 0.5, 0.53", "0.53, 0.5, 0.35", "0.35, 0.53, 0.5"], "answer": 1}, {"q": "0.6 + 0.04 = ?", "options": ["0.10", "0.64", "1.0", "0.604"], "answer": 1}, {"q": "What is 1/4 as a decimal?", "options": ["0.4", "0.25", "0.14", "0.75"], "answer": 1}, {"q": "3 m 5 cm = ___ m", "options": ["3.5", "3.05", "3.005", "35"], "answer": 1}, {"q": "45.8 - 23.5 = ?", "options": ["22.3", "23.3", "21.3", "22.5"], "answer": 0}, {"q": "How many hundredths are in 0.3?", "options": ["3", "30", "300", "0.3"], "answer": 1}, {"q": "5.2 - 0.86 = ?", "options": ["4.34", "4.44", "4.66", "4.36"], "answer": 0}, {"q": "The decimal 0.05 means:", "options": ["5 tenths", "5 hundredths", "5 thousandths", "5 ones"], "answer": 1}, {"q": "2 kg 50 g = ___ kg", "options": ["2.50", "2.050", "2.005", "2.5"], "answer": 1}, {"q": "Which is smallest: 0.5, 0.05, 0.005?", "options": ["0.5", "0.05", "0.005", "All are equal"], "answer": 2}, {"q": "0.125 in fraction form is:", "options": ["1/4", "1/8", "1/5", "1/125"], "answer": 1}, {"q": "134.5 + 28.75 = ?", "options": ["163.25", "162.25", "163.75", "422.5"], "answer": 0}, {"q": "1 paisa = ___ rupees", "options": ["0.1", "0.01", "0.001", "1"], "answer": 1}, {"q": "The expanded form of 4.56 is:", "options": ["4+5+6", "4+0.5+0.06", "4+56", "4+0.56"], "answer": 1}, {"q": "Which fraction gives a terminating decimal?", "options": ["1/3", "1/7", "1/4", "1/6"], "answer": 2}, {"q": "1.8 + 2.75 = ?", "options": ["4.55", "4.45", "3.55", "4.53"], "answer": 0}, {"q": "0.333... is the decimal for:", "options": ["1/2", "1/3", "1/4", "3/10"], "answer": 1}, {"q": "Rs. 100 - Rs. 45.50 = ?", "options": ["Rs. 54.50", "Rs. 55.50", "Rs. 55.00", "Rs. 45.50"], "answer": 0}, {"q": "Between 2.3 and 2.4, there are:", "options": ["No numbers", "1 number", "9 numbers", "Infinite numbers"], "answer": 3}, {"q": "7.05 means:", "options": ["7 and 5 tenths", "7 and 5 hundredths", "7 and 50 hundredths", "7 and 5 thousandths"], "answer": 1}, {"q": "What is 3/4 as a decimal?", "options": ["0.34", "0.75", "0.25", "3.4"], "answer": 1}, {"q": "1 L 200 mL = ___ L", "options": ["1.200", "1.2", "12.00", "Both A and B"], "answer": 3}, {"q": "4.3 vs 4.7: which is larger?", "options": ["4.3", "4.7", "Same", "Cannot tell"], "answer": 1}, {"q": "What is 1/5 as a decimal?", "options": ["0.15", "0.5", "0.2", "0.05"], "answer": 2}, {"q": "The value of pi (3.14159...) is:", "options": ["Terminating", "Repeating", "Non-terminating non-repeating", "A whole number"], "answer": 2}, {"q": "25/100 = ?", "options": ["2.5", "0.25", "25", "0.025"], "answer": 1}, {"q": "0.50 and 0.5 are:", "options": ["Equal", "0.50 is greater", "0.5 is greater", "Cannot compare"], "answer": 0}, {"q": "Height grew from 1.32 m to 1.40 m. Growth = ?", "options": ["0.8 m", "0.08 m", "8 m", "0.12 m"], "answer": 1}]}, {"id": 4, "number": "4", "title": "Expressions Using Letter-Numbers", "description": "Introduction to algebraic thinking - using letters to represent unknowns, forming expressions, simplifying algebraic expressions, and discovering patterns", "topics": [{"name": "4.1 The Notion of Letter-Numbers", "content": "In mathematics, we often use letters like x, y, n, a, b to represent numbers we don't know yet. These are called variables or letter-numbers.<br><br><b>Why Use Letters?</b><br>Letters help us write general rules that work for ALL numbers, not just specific ones. For example:<br>• 'Any number plus zero equals that number' can be written as: a + 0 = a<br>• 'The perimeter of a square with side s' can be written as: P = 4s<br><br><b>Letters as Unknowns:</b><br>When we write x + 3 = 7, the letter x represents an unknown number (which is 4).<br><br><b>Letters as Variables:</b><br>When we write 2n + 1, n can take different values, and the expression gives different results:<br>• n = 1: 2(1) + 1 = 3<br>• n = 2: 2(2) + 1 = 5<br>• n = 3: 2(3) + 1 = 7<br>This generates the pattern of odd numbers!<br><br><b>Rules for Writing Letter-Numbers:</b><br>• We usually write the number before the letter: 3x (not x3)<br>• We don't write the multiplication sign: 3x means 3 × x<br>• 1×x is written as just x (not 1x)<br><br><b>Practice Tip:</b> Think of a letter as a box that can hold any number. When you see 'x', imagine a box — whatever number goes in that box, the expression tells you what to do with it."}, {"name": "4.2 Revisiting Arithmetic Expressions", "content": "Before jumping into algebraic expressions, let's revisit how arithmetic expressions work and see how they connect to algebraic thinking.<br><br><b>From Arithmetic to Algebra:</b><br>Arithmetic: 5 + 3 = 8 (specific numbers, specific answer)<br>Algebra: a + b = ? (general expression, answer depends on values of a and b)<br><br><b>Translating Words to Expressions:</b><br>• 'A number increased by 5' → x + 5<br>• 'Twice a number' → 2x<br>• 'Three less than a number' → x – 3<br>• 'A number divided by 4' → x/4<br>• 'The sum of two numbers' → a + b<br>• 'Product of a number and 7' → 7x<br><br><b>Evaluating Expressions:</b><br>To find the value of an expression for a given value of the variable, substitute (replace) the letter with the number:<br>If x = 4, then 3x + 2 = 3(4) + 2 = 12 + 2 = 14<br><br><b>Forming Expressions from Patterns:</b><br>• Matchstick squares: 1 square needs 4 sticks, 2 squares need 7, 3 need 10...<br>• Pattern: 3n + 1 sticks for n squares<br><br><b>Practice Tip:</b> Practice converting word phrases to mathematical expressions daily. This skill is the foundation of equation solving!"}, {"name": "4.3 Omission of the Multiplication Symbol", "content": "In algebra, we simplify how we write expressions by dropping the multiplication sign (×) between numbers and letters.<br><br><b>Convention Rules:</b><br>• 3 × x is written as 3x<br>• a × b is written as ab<br>• 2 × a × b is written as 2ab<br>• 1 × x is written as x (not 1x)<br>• x × x is written as x² (x squared)<br><br><b>Important:</b> We ONLY omit the multiplication sign when at least one factor is a letter. We NEVER write 35 to mean 3 × 5 (that would be thirty-five!).<br><br><b>Coefficient:</b><br>In 5x, the number 5 is called the coefficient of x. It tells us how many x's we have.<br>• In 3ab: coefficient is 3<br>• In x (same as 1x): coefficient is 1<br>• In -2y: coefficient is -2<br><br><b>Terms:</b><br>Parts of an expression separated by + or – signs are called terms.<br>In 3x + 5y – 2: the terms are 3x, 5y, and –2<br><br><b>Like Terms:</b><br>Terms with the same variables are called like terms:<br>• 3x and 5x are like terms (both have x)<br>• 3x and 3y are NOT like terms (different variables)<br>• 4ab and 7ab are like terms<br><br><b>Practice Tip:</b> When reading algebraic expressions, always remember that letters next to each other (or next to numbers) means multiplication."}, {"name": "4.4 Simplification of Algebraic Expressions", "content": "Simplification means combining like terms to make an expression shorter and easier to work with.<br><br><b>Combining Like Terms:</b><br>• 3x + 5x = 8x (combine the x terms: 3 + 5 = 8)<br>• 7a – 3a = 4a (7 – 3 = 4)<br>• 4x + 3y + 2x + y = 6x + 4y (combine x terms and y terms separately)<br><br><b>Step-by-Step Method:</b><br>1. Identify like terms<br>2. Group like terms together<br>3. Combine the coefficients<br><br><b>Example:</b> Simplify 5a + 3b – 2a + 7b<br>= (5a – 2a) + (3b + 7b)<br>= 3a + 10b<br><br><b>With Constants:</b><br>2x + 5 + 3x + 8 = (2x + 3x) + (5 + 8) = 5x + 13<br><br><b>Cannot Simplify:</b><br>3x + 4y cannot be simplified further (different variables = unlike terms)<br>5x + 3 cannot be simplified (x term and constant are unlike)<br><br><b>Common Mistakes:</b><br>• 3x + 4y ≠ 7xy (WRONG! You can't combine unlike terms)<br>• x + x = 2x, NOT x² (adding, not multiplying)<br>• 2x × 3x = 6x², NOT 6x (multiplying gives higher power)<br><br><b>Practice Tip:</b> Underline like terms with the same color or mark, then combine them. This visual approach helps avoid mistakes."}, {"name": "4.5 Pick Patterns and Reveal Relationships", "content": "One of the most powerful uses of algebraic expressions is describing number patterns and geometric relationships.<br><br><b>Number Patterns:</b><br>• Even numbers: 2, 4, 6, 8... → Formula: 2n (where n = 1, 2, 3...)<br>• Odd numbers: 1, 3, 5, 7... → Formula: 2n – 1<br>• Multiples of 5: 5, 10, 15, 20... → Formula: 5n<br>• Square numbers: 1, 4, 9, 16... → Formula: n²<br><br><b>Matchstick Patterns:</b><br>• Triangle pattern: 3, 5, 7, 9... sticks → Formula: 2n + 1<br>• Square pattern: 4, 7, 10, 13... sticks → Formula: 3n + 1<br>• Pentagon pattern: 5, 9, 13, 17... sticks → Formula: 4n + 1<br><br><b>Geometric Formulas:</b><br>• Perimeter of square = 4s (s = side)<br>• Perimeter of rectangle = 2(l + b) or 2l + 2b<br>• Perimeter of equilateral triangle = 3s<br>• Area of square = s²<br>• Area of rectangle = l × b<br><br><b>How to Find a Pattern Formula:</b><br>1. Write out first few terms with their position numbers<br>2. Look for the relationship between position (n) and term value<br>3. Test your formula with the known terms<br><br><b>Practice Tip:</b> When looking for patterns, always calculate the differences between consecutive terms. If the difference is constant, the formula is linear (an + b)."}], "questions": [{"q": "If x = 3, what is 2x + 5?", "options": ["8", "11", "10", "16"], "answer": 1}, {"q": "3 x y is written in algebra as:", "options": ["3y", "y3", "3+y", "3-y"], "answer": 0}, {"q": "In the expression 5x, the coefficient of x is:", "options": ["x", "5", "5x", "1"], "answer": 1}, {"q": "Simplify: 3x + 5x", "options": ["8x", "8x2", "15x", "35x"], "answer": 0}, {"q": "Which represents 'a number increased by 5'?", "options": ["x - 5", "5x", "x + 5", "x/5"], "answer": 2}, {"q": "Simplify: 4a + 3b - 2a + b", "options": ["2a + 4b", "6a + 4b", "2a + 2b", "6ab"], "answer": 0}, {"q": "If n = 4, what is n squared?", "options": ["8", "12", "16", "44"], "answer": 2}, {"q": "The perimeter of a square with side s is:", "options": ["s + 4", "4s", "s x s", "2s"], "answer": 1}, {"q": "'Twice a number' is written as:", "options": ["x + 2", "x - 2", "2x", "x/2"], "answer": 2}, {"q": "3x + 4y can be simplified to:", "options": ["7xy", "7x", "7y", "Cannot be simplified"], "answer": 3}, {"q": "x + x equals:", "options": ["x squared", "2x", "xx", "x"], "answer": 1}, {"q": "If a = 2, b = 3, what is ab?", "options": ["5", "6", "23", "1"], "answer": 1}, {"q": "The formula for even numbers is:", "options": ["n + 2", "2n", "n/2", "2n + 1"], "answer": 1}, {"q": "Simplify: 2x + 5 + 3x + 8", "options": ["5x + 13", "5x + 58", "13x + 5", "10x + 13"], "answer": 0}, {"q": "The formula for odd numbers is:", "options": ["2n", "2n + 1", "2n - 1", "n + 1"], "answer": 2}, {"q": "1 x x is written as:", "options": ["1x", "x", "x1", "11x"], "answer": 1}, {"q": "Perimeter of rectangle with length l and breadth b:", "options": ["l + b", "lb", "2(l+b)", "4(l+b)"], "answer": 2}, {"q": "If y = 5, what is 3y - 7?", "options": ["8", "22", "15", "1"], "answer": 0}, {"q": "Which are like terms?", "options": ["3x and 3y", "5a and 7a", "2x and 2", "ab and a"], "answer": 1}, {"q": "In 3x + 5y - 2, how many terms are there?", "options": ["1", "2", "3", "5"], "answer": 2}, {"q": "2x x 3x = ?", "options": ["5x", "6x", "6x squared", "5x squared"], "answer": 2}, {"q": "Matchstick pattern 4, 7, 10, 13... formula is:", "options": ["4n", "3n + 1", "n + 3", "4n + 3"], "answer": 1}, {"q": "If x = 0, what is 5x + 3?", "options": ["0", "3", "5", "8"], "answer": 1}, {"q": "Area of square with side s:", "options": ["4s", "2s", "s squared", "s + s"], "answer": 2}, {"q": "Simplify: 7a - 3a + 2a", "options": ["6a", "2a", "12a", "7a"], "answer": 0}, {"q": "'Three less than a number' is:", "options": ["3 - x", "x - 3", "3x", "x/3"], "answer": 1}, {"q": "If a = 5, what is a squared + 1?", "options": ["11", "26", "36", "51"], "answer": 1}, {"q": "Simplify: 3(x + 2)", "options": ["3x + 2", "3x + 6", "x + 6", "3x + 5"], "answer": 1}, {"q": "Which formula gives 1, 4, 9, 16...?", "options": ["n + 3", "4n", "n squared", "2n"], "answer": 2}, {"q": "In the expression -2y, the coefficient is:", "options": ["2", "-2", "y", "-y"], "answer": 1}, {"q": "Can 5x + 3 be simplified further?", "options": ["Yes, to 8x", "Yes, to 8", "Yes, to 15x", "No"], "answer": 3}, {"q": "If x = 2, y = 3, what is x + 2y?", "options": ["7", "8", "10", "12"], "answer": 1}, {"q": "Simplify: 4x + 3x + 2y + 5y", "options": ["7x + 7y", "14xy", "7x + 5y", "4x + 7y"], "answer": 0}, {"q": "The constant term in 5x + 3 is:", "options": ["5", "x", "3", "5x"], "answer": 2}, {"q": "Perimeter of equilateral triangle with side a:", "options": ["a + 3", "3a", "a squared", "6a"], "answer": 1}, {"q": "If x = 10, what is x/2 + 3?", "options": ["8", "6.5", "13", "53"], "answer": 0}, {"q": "Simplify: 5(2a + 3) - 4a", "options": ["6a + 15", "10a + 15", "6a + 3", "14a + 3"], "answer": 0}, {"q": "x x x is written as:", "options": ["3x", "x + x + x", "x cubed", "xxx"], "answer": 2}, {"q": "The next term in 2, 5, 8, 11... is:", "options": ["12", "13", "14", "15"], "answer": 2}, {"q": "If p = 4, what is 2p squared?", "options": ["16", "32", "64", "8"], "answer": 1}]}, {"id": 5, "number": "5", "title": "Parallel and Intersecting Lines", "description": "Understanding parallel lines, perpendicular lines, transversals, corresponding and alternate angles, and optical illusions with parallel lines", "topics": [{"name": "5.1 Across the Line", "content": "A line extends infinitely in both directions. When we draw a line on paper, we are actually drawing a line segment. This section explores what happens when we cross a line and the angles formed.<br><br><b>Points and Lines:</b><br>A point has no dimensions - just a position. A line has one dimension - length (infinite). A line segment has two endpoints and a definite length.<br><br><b>Angles Formed by Intersecting Lines:</b><br>When two lines cross each other, they form 4 angles at the point of intersection. These angles have special properties:<br>• <b>Vertically opposite angles</b> are equal<br>• <b>Adjacent angles</b> on a straight line add up to 180° (supplementary)<br><br><b>Example:</b> If two lines intersect and one angle is 60°, then:<br>• The vertically opposite angle = 60°<br>• The adjacent angles = 180° - 60° = 120°<br><br><b>Linear Pair:</b><br>Two adjacent angles that form a straight line are called a linear pair. They always add up to 180°.<br><br><b>Real-World Examples:</b><br>• Scissors form intersecting lines when opened<br>• Railroad crossings (X-shaped) show intersecting lines<br>• Clock hands intersect at the center<br><br><b>Practice Tip:</b> When two lines intersect, you only need to find ONE angle - the rest can be calculated using vertically opposite angles and linear pairs!"}, {"name": "5.2 Perpendicular Lines", "content": "Perpendicular lines are a special case of intersecting lines where the angle between them is exactly 90° (a right angle).<br><br><b>Definition:</b><br>Two lines are perpendicular if they intersect at right angles (90°). We write: line AB ⊥ line CD<br><br><b>Properties of Perpendicular Lines:</b><br>• They form four 90° angles at the intersection point<br>• They create four equal angles (all 90°)<br>• The symbol for a right angle is a small square at the corner<br><br><b>Drawing Perpendicular Lines:</b><br>Method 1: Using a protractor - draw a line, measure 90° at a point, draw another line<br>Method 2: Using a set square - align one edge with the line, draw along the perpendicular edge<br>Method 3: Paper folding - fold a line onto itself to create a perpendicular crease<br><br><b>Perpendicular from a Point to a Line:</b><br>The shortest distance from a point to a line is always along the perpendicular. This is why we measure the height of a triangle perpendicular to its base.<br><br><b>Real-World Examples:</b><br>• Walls are perpendicular to the floor<br>• The hands of a clock at 3 o'clock or 9 o'clock<br>• The corner of a book, a door frame, a window<br>• Cross-roads meeting at right angles<br><br><b>Practice Tip:</b> The letter 'L' and '+' symbol naturally show perpendicular lines!"}, {"name": "5.3 Between Lines", "content": "This section explores what happens in the space between two lines - whether they get closer, farther, or stay the same distance apart.<br><br><b>Three Possibilities for Two Lines:</b><br>1. <b>Intersecting lines:</b> They meet at exactly one point<br>2. <b>Parallel lines:</b> They never meet (same distance apart everywhere)<br>3. <b>Coincident lines:</b> They overlap completely (same line)<br><br><b>Parallel Lines:</b><br>• Two lines in the same plane that never intersect<br>• They maintain a constant distance between them<br>• Symbol: AB ∥ CD (AB is parallel to CD)<br>• They go in the same direction<br><br><b>How to Check if Lines are Parallel:</b><br>• Measure the distance between them at two different points<br>• If the distances are equal, the lines are parallel<br>• Use a ruler and set square to verify<br><br><b>Real-World Examples of Parallel Lines:</b><br>• Railway tracks<br>• Opposite edges of a ruler, book, or door<br>• Lines on ruled notebook paper<br>• Lanes on a highway<br>• Opposite sides of a rectangle<br><br><b>Important Note:</b> Parallel lines must be in the same plane. In 3D space, lines can be neither parallel nor intersecting (called skew lines) - like two edges of a box that don't share a face."}, {"name": "5.4 Parallel and Perpendicular Lines in Paper Folding", "content": "Paper folding is a hands-on way to understand geometric concepts. By folding paper, we can create parallel and perpendicular lines without any measuring tools!<br><br><b>Creating Perpendicular Lines by Folding:</b><br>1. Take a rectangular sheet of paper<br>2. Fold it so one edge falls exactly on itself<br>3. The fold line (crease) is perpendicular to the edge!<br>4. Open it up - you have two perpendicular lines<br><br><b>Creating Parallel Lines by Folding:</b><br>1. Make a fold (crease 1)<br>2. Make another fold perpendicular to crease 1 (crease 2)<br>3. Make a third fold perpendicular to crease 2 (crease 3)<br>4. Crease 1 and crease 3 are parallel!<br><br><b>Key Insight:</b><br>If two lines are both perpendicular to a third line, then they are parallel to each other. This is a fundamental property of Euclidean geometry.<br><br><b>Paper Folding Properties:</b><br>• A fold creates a line of symmetry<br>• Folding a line onto itself creates a perpendicular bisector<br>• Multiple parallel folds create evenly spaced parallel lines<br><br><b>Activity:</b> Take a piece of paper and create a set of parallel lines using only folding (no ruler). You should be able to make 4 or more evenly spaced parallel lines!<br><br><b>Practice Tip:</b> Paper folding helps verify geometric constructions - if your drawn perpendicular/parallel lines don't match the fold lines, something needs correction."}, {"name": "5.5 Transversals", "content": "A transversal is a line that crosses two or more lines at distinct points. When a transversal cuts two lines, it creates 8 angles with special relationships.<br><br><b>Definition:</b><br>A transversal is a line that intersects two or more lines at different points. It 'cuts across' the lines.<br><br><b>Angles Formed:</b><br>When a transversal cuts two lines, it creates:<br>• 8 angles in total (4 at each intersection point)<br>• 4 interior angles (between the two lines)<br>• 4 exterior angles (outside the two lines)<br><br><b>Naming the Angles:</b><br>At each intersection, the four angles are typically labeled using numbers (1-8) or letters. The angles are classified as:<br>• <b>Interior angles:</b> angles 3, 4, 5, 6 (between the lines)<br>• <b>Exterior angles:</b> angles 1, 2, 7, 8 (outside the lines)<br>• <b>Co-interior angles:</b> angles on the same side between the lines (3&5, 4&6)<br><br><b>Special Case - Parallel Lines with Transversal:</b><br>When the two lines are parallel, the transversal creates angle pairs with special properties (discussed in next sections).<br><br><b>Real-World Examples:</b><br>• A road crossing two railway tracks<br>• A diagonal line cutting through ruled paper<br>• A staircase railing crossing the horizontal steps<br><br><b>Practice Tip:</b> When working with transversals, always mark which angles are interior and which are exterior first. This helps identify the special angle pairs."}, {"name": "5.6 Corresponding Angles", "content": "Corresponding angles are in the same position at each intersection when a transversal cuts two lines. If the lines are parallel, corresponding angles are equal.<br><br><b>What Are Corresponding Angles?</b><br>At each intersection, there are 4 angles. Corresponding angles are the ones in matching positions:<br>• Angles 1 and 5 (both above-right of intersection)<br>• Angles 2 and 6 (both above-left)<br>• Angles 3 and 7 (both below-right)<br>• Angles 4 and 8 (both below-left)<br><br><b>The Corresponding Angles Property:</b><br>If two parallel lines are cut by a transversal, then each pair of corresponding angles is equal.<br>• ∠1 = ∠5<br>• ∠2 = ∠6<br>• ∠3 = ∠7<br>• ∠4 = ∠8<br><br><b>Converse:</b> If corresponding angles are equal, then the lines are parallel. This gives us a way to CHECK if lines are parallel!<br><br><b>Finding Angles:</b><br>If line l ∥ line m and a transversal makes 70° with line l, then:<br>• Corresponding angle at line m = 70°<br>• Adjacent angle at line l = 110°<br>• Corresponding adjacent angle at line m = 110°<br><br><b>Think of it like:</b> If you're standing at one intersection facing the transversal, the angle you see is the same as what someone standing at the other intersection (in the same position) would see."}, {"name": "5.7 Drawing Parallel Lines", "content": "There are several methods to draw parallel lines accurately. This section teaches the construction methods used in geometry.<br><br><b>Method 1: Using Set Squares</b><br>1. Place one edge of the set square along the given line<br>2. Place a ruler along another edge of the set square<br>3. Slide the set square along the ruler to the desired position<br>4. Draw along the edge - this line is parallel to the first<br><br><b>Method 2: Using Ruler and Compass</b><br>1. Draw the given line l and mark a point P not on l<br>2. Draw any transversal through P intersecting l at point Q<br>3. At P, construct an angle equal to the angle at Q (corresponding angle)<br>4. The new line through P is parallel to l<br><br><b>Method 3: Using Corresponding Angles</b><br>1. Draw a transversal to the given line<br>2. Measure the angle at the first intersection<br>3. Replicate this angle at the desired point on the transversal<br>4. The new line is parallel to the given line<br><br><b>Checking Your Construction:</b><br>• Measure the distance between the lines at multiple points<br>• If the distance is constant, the lines are parallel<br>• Use the set square method to verify<br><br><b>Practice Tip:</b> When drawing parallel lines with a compass, make sure the compass width doesn't change between the two angle constructions!"}, {"name": "5.8 Alternate Angles", "content": "Alternate angles are on opposite sides of the transversal and between the two lines. When the lines are parallel, alternate angles are equal.<br><br><b>Types of Alternate Angles:</b><br>• <b>Alternate interior angles:</b> Between the lines, on opposite sides of the transversal<br>  - Angles 3 and 6, Angles 4 and 5<br>• <b>Alternate exterior angles:</b> Outside the lines, on opposite sides of the transversal<br>  - Angles 1 and 8, Angles 2 and 7<br><br><b>The Alternate Angles Property:</b><br>If two parallel lines are cut by a transversal:<br>• Alternate interior angles are equal: ∠3 = ∠6, ∠4 = ∠5<br>• Alternate exterior angles are equal: ∠1 = ∠8, ∠2 = ∠7<br><br><b>Co-Interior Angles (Same-Side Interior):</b><br>Co-interior angles are between the lines and on the SAME side of the transversal.<br>• For parallel lines: co-interior angles add up to 180°<br>• ∠3 + ∠5 = 180° and ∠4 + ∠6 = 180°<br><br><b>Example:</b> If parallel lines are cut by a transversal and one alternate interior angle is 55°, then:<br>• The other alternate interior angle = 55°<br>• Co-interior angle = 180° - 55° = 125°<br><br><b>Real-World Application:</b> The Z-shape made by alternate angles appears in zigzag patterns, staircases, and the letter Z itself! That's why alternate angles are sometimes called 'Z-angles'."}, {"name": "5.9 Parallel Illusions", "content": "Our eyes can be tricked into thinking parallel lines are not parallel! These optical illusions teach us about perception and the importance of precise measurement.<br><br><b>Famous Parallel Illusions:</b><br>• <b>Zollner Illusion:</b> Parallel lines crossed by short diagonal lines appear to converge or diverge<br>• <b>Hering Illusion:</b> Parallel horizontal lines appear curved when crossed by radial lines<br>• <b>Cafe Wall Illusion:</b> Parallel horizontal lines appear slanted due to offset black and white tiles<br>• <b>Ponzo Illusion:</b> Converging lines make parallel objects appear different sizes<br><br><b>Why Do These Illusions Work?</b><br>Our brain interprets visual information based on context. When additional lines or patterns surround parallel lines, our brain is 'tricked' into seeing angles and curves that don't exist.<br><br><b>Lessons from Illusions:</b><br>1. Visual estimation of parallelism can be unreliable<br>2. We need mathematical tools (rulers, protractors, set squares) to verify parallelism<br>3. Corresponding angles and alternate angles are reliable tests - not our eyes<br><br><b>Creating Your Own Illusion:</b><br>Draw two parallel horizontal lines. Then add short diagonal lines crossing them at different angles. The parallel lines will appear to tilt!<br><br><b>Connection to Architecture:</b><br>Ancient Greek architects used optical corrections in buildings like the Parthenon. They made columns slightly thicker in the middle and tilted inward to counteract the illusion that straight columns appear thinner in the middle and to lean outward.<br><br><b>Practice Tip:</b> When checking if lines are parallel in geometry problems, NEVER rely on how they look. Always use angle properties or measurements!"}], "questions": [{"q": "When two lines intersect, vertically opposite angles are:", "options": ["Supplementary", "Equal", "Complementary", "None of these"], "answer": 1}, {"q": "If two parallel lines are cut by a transversal and one angle is 65°, its corresponding angle is:", "options": ["65°", "115°", "25°", "90°"], "answer": 0}, {"q": "Two lines that never meet and are always the same distance apart are:", "options": ["Intersecting", "Perpendicular", "Parallel", "Coincident"], "answer": 2}, {"q": "A right angle measures:", "options": ["45°", "90°", "180°", "360°"], "answer": 1}, {"q": "Alternate interior angles for parallel lines are:", "options": ["Supplementary", "Equal", "Complementary", "Unrelated"], "answer": 1}, {"q": "A transversal cutting two lines creates how many angles?", "options": ["4", "6", "8", "12"], "answer": 2}, {"q": "Co-interior angles for parallel lines add up to:", "options": ["90°", "180°", "270°", "360°"], "answer": 1}, {"q": "The symbol for parallel is:", "options": ["⊥", "∥", "∠", "∆"], "answer": 1}, {"q": "If a transversal makes 70° with a line, the adjacent angle is:", "options": ["70°", "110°", "20°", "90°"], "answer": 1}, {"q": "Perpendicular lines form angles of:", "options": ["45°", "60°", "90°", "180°"], "answer": 2}, {"q": "Which of these shows parallel lines in daily life?", "options": ["Scissors", "Railway tracks", "Clock hands", "Letter X"], "answer": 1}, {"q": "If two corresponding angles are equal, the lines are:", "options": ["Perpendicular", "Parallel", "Intersecting", "Coincident"], "answer": 1}, {"q": "A linear pair of angles adds up to:", "options": ["90°", "180°", "270°", "360°"], "answer": 1}, {"q": "Alternate angles are sometimes called:", "options": ["F-angles", "Z-angles", "C-angles", "X-angles"], "answer": 1}, {"q": "If one angle of intersecting lines is 40°, the vertically opposite angle is:", "options": ["140°", "40°", "50°", "320°"], "answer": 1}, {"q": "Two lines perpendicular to the same line are:", "options": ["Perpendicular to each other", "Parallel to each other", "Intersecting", "None of these"], "answer": 1}, {"q": "If co-interior angles are 75° and x°, find x:", "options": ["75", "105", "115", "85"], "answer": 1}, {"q": "The shortest distance from a point to a line is:", "options": ["Along a parallel", "Along the perpendicular", "Along a diagonal", "Along a transversal"], "answer": 1}, {"q": "How many pairs of corresponding angles are formed by a transversal?", "options": ["2", "4", "6", "8"], "answer": 1}, {"q": "If alternate angles are 3x and 60° (lines parallel), x = ?", "options": ["10", "15", "20", "30"], "answer": 2}, {"q": "Which illusion makes parallel lines appear curved?", "options": ["Zollner", "Hering", "Ponzo", "Cafe Wall"], "answer": 1}, {"q": "Interior angles are between:", "options": ["The two lines", "Outside the lines", "On the transversal", "At one intersection"], "answer": 0}, {"q": "If angle 1 = 120° and angle 5 are corresponding, angle 5 = ?", "options": ["60°", "120°", "180°", "30°"], "answer": 1}, {"q": "The letter that represents corresponding angles pattern is:", "options": ["Z", "F", "C", "X"], "answer": 1}, {"q": "Two angles adding to 90° are:", "options": ["Supplementary", "Complementary", "Vertically opposite", "Linear pair"], "answer": 1}, {"q": "If a transversal is perpendicular to one of two parallel lines, it is:", "options": ["Parallel to the other", "Perpendicular to the other too", "At 45° to the other", "Not related to the other"], "answer": 1}, {"q": "Angle at 3 o'clock position of a clock is:", "options": ["60°", "90°", "120°", "180°"], "answer": 1}, {"q": "If two lines intersect at 90°, all four angles are:", "options": ["Different", "All 90°", "Two 90° and two 0°", "Unknown"], "answer": 1}, {"q": "Exterior angles are:", "options": ["Between the two lines", "Outside the two lines", "On the transversal", "Equal to 90°"], "answer": 1}, {"q": "Co-interior angles are also called:", "options": ["Z-angles", "F-angles", "C-angles or U-angles", "X-angles"], "answer": 2}, {"q": "If lines are NOT parallel, corresponding angles are:", "options": ["Always equal", "Never equal", "Not necessarily equal", "Always 90°"], "answer": 2}, {"q": "Paper folding creates a:", "options": ["Parallel line", "Perpendicular bisector", "Curve", "Circle"], "answer": 1}, {"q": "How many pairs of alternate interior angles does a transversal create?", "options": ["1", "2", "3", "4"], "answer": 1}, {"q": "If angle 3 = 55°, its co-interior angle = ?", "options": ["55°", "125°", "145°", "35°"], "answer": 1}, {"q": "The Cafe Wall illusion involves:", "options": ["Circles", "Offset tiles making lines look slanted", "Curved lines", "Missing lines"], "answer": 1}, {"q": "Perpendicular from point to line gives the ___ distance:", "options": ["Longest", "Shortest", "Average", "Random"], "answer": 1}, {"q": "If two angles form a linear pair and one is x°, the other is:", "options": ["x°", "(90-x)°", "(180-x)°", "(360-x)°"], "answer": 2}, {"q": "Opposite sides of a rectangle are:", "options": ["Perpendicular", "Parallel", "Intersecting", "Curved"], "answer": 1}, {"q": "Adjacent sides of a rectangle are:", "options": ["Parallel", "Perpendicular", "Skew", "Equal"], "answer": 1}, {"q": "If vertically opposite angles are 2x and 80°, x = ?", "options": ["40", "80", "160", "20"], "answer": 0}]}, {"id": 6, "number": "6", "title": "Number Play", "description": "Exploring numbers through patterns, parity, grid explorations, the Virahanka-Fibonacci sequence, and cryptarithmetic puzzles", "topics": [{"name": "6.1 Numbers Tell Us Things", "content": "Numbers carry information about themselves in their digits. By examining a number's digits, we can discover many properties without doing complex calculations.<br><br><b>Divisibility Rules:</b><br>• <b>By 2:</b> Last digit is 0, 2, 4, 6, or 8 (even number)<br>• <b>By 3:</b> Sum of digits is divisible by 3<br>• <b>By 4:</b> Last two digits form a number divisible by 4<br>• <b>By 5:</b> Last digit is 0 or 5<br>• <b>By 9:</b> Sum of digits is divisible by 9<br>• <b>By 10:</b> Last digit is 0<br>• <b>By 11:</b> Difference between sum of alternate digits is 0 or divisible by 11<br><br><b>Digit Sum Properties:</b><br>• The digit sum of any multiple of 9 is always 9 (or a multiple of 9): 18→1+8=9, 81→8+1=9, 108→1+0+8=9<br>• Any number and its digit sum give the same remainder when divided by 9<br><br><b>Palindromic Numbers:</b><br>Numbers that read the same forwards and backwards: 121, 1331, 12321<br>• All single-digit numbers are palindromes<br>• There are 9 two-digit palindromes: 11, 22, 33, ..., 99<br><br><b>Real-World Use:</b> Phone numbers, PIN codes, postal codes - numbers tell us location, identity, and much more!<br><br><b>Practice Tip:</b> Memorize divisibility rules - they save enormous time in mental math and simplifying fractions."}, {"name": "6.2 Picking Parity", "content": "Parity refers to whether a number is even or odd. Understanding parity helps solve many mathematical problems without actual computation.<br><br><b>Even and Odd Numbers:</b><br>• Even: Divisible by 2 (0, 2, 4, 6, 8, 10, 12...)<br>• Odd: Not divisible by 2 (1, 3, 5, 7, 9, 11...)<br>• Zero is even!<br><br><b>Parity Rules for Operations:</b><br>• Even + Even = Even (4 + 6 = 10)<br>• Odd + Odd = Even (3 + 5 = 8)<br>• Even + Odd = Odd (4 + 5 = 9)<br>• Even × Even = Even<br>• Odd × Odd = Odd<br>• Even × Odd = Even<br><br><b>Powerful Parity Arguments:</b><br>• Can the sum of 5 odd numbers be 100? No! (odd+odd=even, +odd=odd, +odd=even, +odd=odd) - 5 odds always give odd sum<br>• Can 15 people shake hands so each person shakes exactly 3 hands? No! (15×3=45 is odd, but handshake count must be even since each handshake involves 2 people)<br><br><b>Consecutive Number Properties:</b><br>• Two consecutive numbers: one is even, one is odd<br>• Their sum is always odd<br>• Their product is always even<br><br><b>Practice Tip:</b> Before solving complex problems, check parity first. It can sometimes tell you the answer (or that no answer exists) immediately!"}, {"name": "6.3 Some Explorations in Grids", "content": "Number grids reveal fascinating patterns when we look at rows, columns, diagonals, and special arrangements of numbers.<br><br><b>Magic Squares:</b><br>A magic square is a grid where every row, column, and diagonal adds to the same sum (the magic constant).<br>• 3×3 magic square with 1-9: magic constant = 15<br>• 4×4 magic square with 1-16: magic constant = 34<br>• Formula for n×n magic square using 1 to n²: magic constant = n(n²+1)/2<br><br><b>Example 3×3 Magic Square:</b><br>2 7 6<br>9 5 1<br>4 3 8<br>Every row, column, diagonal = 15<br><br><b>Number Patterns in Grids:</b><br>• Multiplication tables form a grid with interesting diagonal patterns<br>• Pascal's Triangle can be arranged as a grid with binomial coefficients<br>• Sudoku is a 9×9 grid puzzle based on number placement<br><br><b>Grid Coloring and Paths:</b><br>• How many paths exist from one corner of a grid to the opposite corner?<br>• Chess problems: How many squares can a knight reach in n moves?<br><br><b>Practice Tip:</b> When working with magic squares, remember that the center number in a 3×3 magic square using 1-9 is always 5, and the magic constant is always 15."}, {"name": "6.4 Nature's Favourite Sequence: The Virahanka-Fibonacci", "content": "The Fibonacci sequence (known in India as the Virahanka sequence, named after the ancient Indian mathematician) appears throughout nature and mathematics.<br><br><b>The Sequence:</b><br>1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233...<br>Rule: Each number = sum of the two before it<br><br><b>Indian Origins:</b><br>Virahanka (around 700 CE) and later Hemachandra (around 1150 CE) discovered this sequence while studying poetic meters in Sanskrit. It was later studied by Fibonacci in Italy (1202 CE).<br><br><b>In Nature:</b><br>• <b>Sunflower seeds:</b> Spiral in Fibonacci numbers (21, 34, or 55 spirals)<br>• <b>Pine cones:</b> Spirals in 8 and 13 rows<br>• <b>Flower petals:</b> Lilies have 3, buttercups have 5, daisies have 34 or 55<br>• <b>Branching:</b> Trees often branch in Fibonacci patterns<br>• <b>Shell spirals:</b> Nautilus shells follow the golden spiral<br><br><b>The Golden Ratio:</b><br>When you divide consecutive Fibonacci numbers, the ratio approaches 1.618... (called the Golden Ratio, φ):<br>8/5 = 1.6, 13/8 = 1.625, 21/13 = 1.615, 34/21 = 1.619...<br><br><b>Properties:</b><br>• Sum of first n Fibonacci numbers = F(n+2) – 1<br>• Every 3rd number is even, every 4th is divisible by 3, every 5th by 5<br><br><b>Practice Tip:</b> Generate the first 20 Fibonacci numbers and check which are even, which are divisible by 3, and verify the patterns!"}, {"name": "6.5 Digits in Disguise", "content": "Cryptarithmetic puzzles replace digits with letters. Each letter represents a unique digit. Solving these puzzles develops logical reasoning and number sense.<br><br><b>What is Cryptarithmetic?</b><br>In puzzles like SEND + MORE = MONEY, each letter stands for a different digit (0-9). Your job is to figure out which digit each letter represents.<br><br><b>Solving Strategy:</b><br>1. Look at the leftmost column first (it often reveals carries)<br>2. Note that the leading digit of a number can't be 0<br>3. Each letter represents a unique digit<br>4. Use logical deduction, not just trial and error<br><br><b>Example: AB + BA = CDC</b><br>• A and B are single digits, CDC is a 3-digit number<br>• Maximum: 98 + 89 = 187, Minimum: 12 + 21 = 33, so C = 1<br>• AB + BA = (10A+B) + (10B+A) = 11(A+B) = 100+10D+1<br>• So 11(A+B) must give a number like 1D1<br>• If A+B = 10: 11×10 = 110, so D=1, but C=D=1 conflict<br>• If A+B = 11: 11×11 = 121, D=2. Works! A=2,B=9 or A=9,B=2 etc.<br><br><b>Classic Puzzles to Try:</b><br>• EAT + THAT = APPLE<br>• CROSS + ROADS = DANGER<br>• BASE + BALL = GAMES<br><br><b>Practice Tip:</b> Start with simpler puzzles (2-digit + 2-digit) and work up to harder ones. Always list what you know and use elimination."}], "questions": [{"q": "A number divisible by 2 is called:", "options": ["Odd", "Even", "Prime", "Composite"], "answer": 1}, {"q": "The digit sum of 108 is:", "options": ["8", "9", "10", "18"], "answer": 1}, {"q": "Which number is a palindrome?", "options": ["123", "121", "132", "312"], "answer": 1}, {"q": "Even + Odd = ?", "options": ["Even", "Odd", "Zero", "Cannot determine"], "answer": 1}, {"q": "The Fibonacci sequence starts with:", "options": ["0, 1, 1, 2", "1, 1, 2, 3", "1, 2, 3, 4", "Both A and B are accepted"], "answer": 3}, {"q": "The magic constant of a 3x3 magic square using 1-9 is:", "options": ["10", "12", "15", "20"], "answer": 2}, {"q": "Is 0 even or odd?", "options": ["Even", "Odd", "Neither", "Both"], "answer": 0}, {"q": "Odd x Odd = ?", "options": ["Even", "Odd", "Cannot tell", "Zero"], "answer": 1}, {"q": "Which is divisible by 9?", "options": ["123", "234", "432", "531"], "answer": 3}, {"q": "The 7th Fibonacci number is:", "options": ["8", "13", "21", "34"], "answer": 1}, {"q": "Can 3 odd numbers add up to 20?", "options": ["Yes", "No", "Sometimes", "Need more info"], "answer": 1}, {"q": "What is the divisibility rule for 3?", "options": ["Last digit divisible by 3", "Sum of digits divisible by 3", "Last two digits divisible by 3", "Number is odd"], "answer": 1}, {"q": "The Golden Ratio is approximately:", "options": ["1.414", "1.618", "2.718", "3.14"], "answer": 1}, {"q": "In a magic square, which sums are equal?", "options": ["Only rows", "Only diagonals", "Rows, columns, and diagonals", "Only columns"], "answer": 2}, {"q": "Divisibility rule for 11: check the ___ of alternate digits.", "options": ["Sum", "Product", "Difference", "Average"], "answer": 2}, {"q": "Even x Even = ?", "options": ["Even", "Odd", "Cannot tell", "Prime"], "answer": 0}, {"q": "The next Fibonacci number after 8, 13 is:", "options": ["18", "20", "21", "26"], "answer": 2}, {"q": "Which is divisible by 4?", "options": ["322", "514", "732", "918"], "answer": 2}, {"q": "A 2-digit palindrome example is:", "options": ["12", "21", "33", "45"], "answer": 2}, {"q": "Sum of two consecutive numbers is always:", "options": ["Even", "Odd", "Prime", "Composite"], "answer": 1}, {"q": "In cryptarithmetic, the leading digit of a number cannot be:", "options": ["1", "0", "9", "5"], "answer": 1}, {"q": "The center of a 3x3 magic square (1-9) is always:", "options": ["1", "5", "9", "Any number"], "answer": 1}, {"q": "How many 2-digit palindromes exist?", "options": ["5", "9", "10", "18"], "answer": 1}, {"q": "Sunflower seeds spiral in ___ numbers:", "options": ["Prime", "Even", "Fibonacci", "Square"], "answer": 2}, {"q": "Is 1001 divisible by 11?", "options": ["Yes (1-0+0-1=0)", "No", "Cannot determine", "Only by 7"], "answer": 0}, {"q": "Product of two consecutive numbers is always:", "options": ["Odd", "Even", "Prime", "Square"], "answer": 1}, {"q": "The Virahanka sequence was discovered in:", "options": ["Greece", "India", "Italy", "China"], "answer": 1}, {"q": "Which number is divisible by both 2 and 3?", "options": ["8", "9", "12", "15"], "answer": 2}, {"q": "In a 4x4 magic square using 1-16, the magic constant is:", "options": ["20", "30", "34", "40"], "answer": 2}, {"q": "What digit does each letter represent in cryptarithmetic?", "options": ["Any digit, repeated allowed", "A unique digit 0-9", "Only prime digits", "Only even digits"], "answer": 1}, {"q": "Sum of first 6 Fibonacci numbers (1,1,2,3,5,8) is:", "options": ["18", "20", "21", "23"], "answer": 1}, {"q": "Is 2024 divisible by 4?", "options": ["Yes (24 is divisible by 4)", "No", "Cannot determine", "Only by 2"], "answer": 0}, {"q": "Odd + Odd + Odd = ?", "options": ["Even", "Odd", "Cannot tell", "Zero"], "answer": 1}, {"q": "The digit sum of any multiple of 9 is:", "options": ["Always 9", "A multiple of 9", "Always odd", "Always even"], "answer": 1}, {"q": "11 x 11 = 121. Is 121 a palindrome?", "options": ["Yes", "No", "Cannot determine", "Sometimes"], "answer": 0}, {"q": "Which Fibonacci number is even: 1, 1, 2, 3, 5, 8?", "options": ["1st and 2nd", "3rd and 6th", "4th and 5th", "All of them"], "answer": 1}, {"q": "A number divisible by both 3 and 5 is also divisible by:", "options": ["8", "10", "15", "20"], "answer": 2}, {"q": "Is the sum of all digits 1 through 9 divisible by 9?", "options": ["Yes (sum=45, 45/9=5)", "No", "Cannot determine", "Only by 3"], "answer": 0}, {"q": "The 10th Fibonacci number is:", "options": ["34", "55", "89", "144"], "answer": 1}, {"q": "AB + BA = 11(A+B). If the result is 132, then A+B = ?", "options": ["10", "11", "12", "13"], "answer": 2}]}, {"id": 7, "number": "7", "title": "A Tale of Three Intersecting Lines", "description": "Exploring triangles through construction, types of triangles, properties of sides and angles, and altitude constructions", "topics": [{"name": "7.1 Equilateral Triangles", "content": "An equilateral triangle is the most symmetric of all triangles - all three sides are equal and all three angles are 60°.<br><br><b>Properties of Equilateral Triangles:</b><br>• All 3 sides are equal in length<br>• All 3 angles are equal = 60° each<br>• All 3 medians, altitudes, angle bisectors, and perpendicular bisectors are equal<br>• It has 3 lines of symmetry<br>• Rotational symmetry of order 3 (looks the same after 120°, 240°, 360° rotation)<br><br><b>Constructing an Equilateral Triangle:</b><br>Given side length = 5 cm:<br>1. Draw a line segment AB = 5 cm<br>2. With compass at A, radius 5 cm, draw an arc above AB<br>3. With compass at B, radius 5 cm, draw another arc cutting the first at point C<br>4. Join AC and BC<br><br><b>Area of Equilateral Triangle:</b><br>Area = (√3/4) × side²<br>For side = 6 cm: Area = (√3/4) × 36 = 9√3 ≈ 15.59 cm²<br><br><b>Perimeter:</b> P = 3 × side<br><br><b>In Nature and Design:</b><br>• Honeycomb cells are made of equilateral triangles<br>• The yield sign is an equilateral triangle<br>• Many logos use equilateral triangles for balance and symmetry<br><br><b>Practice Tip:</b> When constructing equilateral triangles with compass, make sure the compass opening stays the SAME as the side length throughout."}, {"name": "7.2 Constructing a Triangle When its Sides are Known", "content": "When all three sides of a triangle are given (SSS - Side-Side-Side), we can construct it uniquely using ruler and compass.<br><br><b>SSS Construction Method:</b><br>Given sides a = 5 cm, b = 4 cm, c = 6 cm:<br>1. Draw the longest side as base: AB = 6 cm (side c)<br>2. With compass at A, radius = 4 cm (side b), draw an arc<br>3. With compass at B, radius = 5 cm (side a), draw an arc<br>4. Mark the intersection point as C<br>5. Join AC and BC to complete the triangle<br><br><b>Triangle Inequality Rule:</b><br>Not any three lengths can form a triangle! The sum of any two sides must be greater than the third side:<br>• a + b > c<br>• b + c > a<br>• a + c > b<br><br><b>Examples:</b><br>• 3, 4, 5 - Valid! (3+4>5, 4+5>3, 3+5>4)<br>• 1, 2, 5 - Invalid! (1+2=3 < 5)<br>• 5, 5, 5 - Valid! (equilateral)<br>• 3, 3, 6 - Invalid! (3+3=6, not greater than 6)<br><br><b>Why SSS Gives a Unique Triangle:</b><br>When all three sides are fixed, there's only ONE possible triangle (up to position and orientation). This is because the arcs in step 2 and 3 can only intersect at one point above the base.<br><br><b>Practice Tip:</b> Always check the triangle inequality before attempting construction. If it fails, tell your teacher the triangle is impossible!"}, {"name": "7.3 Construction When Some Sides and Angles are Known", "content": "We can construct triangles when given combinations of sides and angles: SAS (Side-Angle-Side) or ASA (Angle-Side-Angle).<br><br><b>SAS Construction:</b><br>Given: Two sides and the included angle (the angle between them)<br>Example: a = 5 cm, b = 4 cm, included angle C = 60°<br>1. Draw one side: AB = 5 cm<br>2. At point A, measure angle of 60° using protractor<br>3. Along the angle ray, mark AC = 4 cm<br>4. Join B to C<br><br><b>ASA Construction:</b><br>Given: Two angles and the included side (the side between them)<br>Example: Angle A = 50°, Angle B = 70°, side AB = 6 cm<br>1. Draw AB = 6 cm<br>2. At A, construct angle of 50°<br>3. At B, construct angle of 70°<br>4. The rays from A and B meet at C<br><br><b>Important Note:</b><br>The third angle = 180° - 50° - 70° = 60° (angle sum property)<br><br><b>Why These Give Unique Triangles:</b><br>SAS and ASA each fix a triangle completely. Given the same measurements, everyone will construct the exact same triangle.<br><br><b>Angle Sum Property:</b><br>The three angles of any triangle always add up to 180°. This is a fundamental property used in many geometry problems.<br><br><b>Practice Tip:</b> When using a protractor, make sure the center is exactly on the vertex and the base line aligns with one side of the angle."}, {"name": "7.4 Constructions Related to Altitudes of Triangles", "content": "An altitude of a triangle is a perpendicular line from a vertex to the opposite side (or its extension). Every triangle has three altitudes.<br><br><b>What is an Altitude?</b><br>• A line segment from a vertex perpendicular to the opposite side<br>• It represents the 'height' of the triangle from that vertex<br>• Every triangle has exactly 3 altitudes<br><br><b>Constructing an Altitude:</b><br>1. From vertex A, you need a perpendicular to side BC<br>2. With compass at A, draw arcs cutting BC at two points P and Q<br>3. With compass at P, draw an arc below BC<br>4. With compass at Q (same radius), draw an arc crossing the previous one at point D<br>5. Join AD - this line is perpendicular to BC through A<br>6. Mark the foot of the altitude where AD meets BC as H<br>7. AH is the altitude from vertex A<br><br><b>Orthocentre:</b><br>The three altitudes of a triangle always meet at a single point called the orthocentre (H).<br>• For acute triangle: H is inside the triangle<br>• For right triangle: H is at the vertex of the right angle<br>• For obtuse triangle: H is outside the triangle<br><br><b>Area Connection:</b><br>Area = ½ × base × height (altitude)<br>Since any side can be the base, each altitude gives the same area!<br><br><b>Practice Tip:</b> When drawing altitudes of obtuse triangles, extend the base line beyond the triangle so the perpendicular from the vertex can reach it."}, {"name": "7.5 Types of Triangles", "content": "Triangles are classified based on their sides and angles. Understanding these classifications helps identify properties and solve problems quickly.<br><br><b>Classification by Sides:</b><br>• <b>Equilateral:</b> All 3 sides equal (also all angles = 60°)<br>• <b>Isosceles:</b> Exactly 2 sides equal (the angles opposite equal sides are also equal)<br>• <b>Scalene:</b> All 3 sides different (all angles different too)<br><br><b>Classification by Angles:</b><br>• <b>Acute:</b> All 3 angles less than 90°<br>• <b>Right:</b> One angle exactly 90° (the side opposite the right angle is the hypotenuse)<br>• <b>Obtuse:</b> One angle greater than 90°<br><br><b>Special Combinations:</b><br>• Right isosceles: 90°, 45°, 45° triangle (two equal sides)<br>• Equilateral is always acute (60°, 60°, 60°)<br>• A triangle CANNOT be both right and obtuse<br>• A triangle CANNOT have more than one right angle or more than one obtuse angle<br><br><b>Angle Sum Property:</b><br>Sum of all angles = 180°. This limits possible angle combinations:<br>• Maximum one angle can be ≥ 90°<br>• Two angles of a triangle must always be acute<br><br><b>Exterior Angle Theorem:</b><br>An exterior angle of a triangle equals the sum of the two non-adjacent interior angles.<br><br><b>Practice Tip:</b> To quickly classify a triangle, check: are any sides equal? Then check: are any angles 90° or more?"}], "questions": [{"q": "An equilateral triangle has all angles equal to:", "options": ["45°", "60°", "90°", "120°"], "answer": 1}, {"q": "The sum of angles in a triangle is:", "options": ["90°", "180°", "270°", "360°"], "answer": 1}, {"q": "Can sides 2, 3, and 6 form a triangle?", "options": ["Yes", "No (2+3 < 6)", "Sometimes", "Only right triangle"], "answer": 1}, {"q": "A triangle with all different sides is:", "options": ["Equilateral", "Isosceles", "Scalene", "Right"], "answer": 2}, {"q": "How many altitudes does a triangle have?", "options": ["1", "2", "3", "4"], "answer": 2}, {"q": "In a right triangle, the longest side is called:", "options": ["Base", "Height", "Hypotenuse", "Median"], "answer": 2}, {"q": "An isosceles triangle has:", "options": ["All sides equal", "Two sides equal", "No sides equal", "All angles 60°"], "answer": 1}, {"q": "If two angles of a triangle are 50° and 60°, the third is:", "options": ["50°", "60°", "70°", "80°"], "answer": 2}, {"q": "SSS stands for:", "options": ["Side-Side-Side", "Sum-Side-Sum", "Side-Sum-Side", "Same-Same-Same"], "answer": 0}, {"q": "The point where all 3 altitudes meet is the:", "options": ["Centroid", "Circumcentre", "Orthocentre", "Incentre"], "answer": 2}, {"q": "An equilateral triangle has how many lines of symmetry?", "options": ["1", "2", "3", "6"], "answer": 2}, {"q": "Can a triangle have two right angles?", "options": ["Yes", "No", "Sometimes", "Only isosceles"], "answer": 1}, {"q": "Perimeter of equilateral triangle with side 8 cm:", "options": ["16 cm", "24 cm", "32 cm", "64 cm"], "answer": 1}, {"q": "A triangle with angles 90°, 45°, 45° is:", "options": ["Right isosceles", "Right scalene", "Equilateral", "Obtuse"], "answer": 0}, {"q": "Can sides 3, 4, 5 form a triangle?", "options": ["Yes", "No", "Only right triangle", "Both A and C"], "answer": 3}, {"q": "In an obtuse triangle, the orthocentre lies:", "options": ["Inside", "On a vertex", "Outside", "On a side"], "answer": 2}, {"q": "SAS construction needs:", "options": ["3 sides", "2 sides and included angle", "2 angles and included side", "3 angles"], "answer": 1}, {"q": "An exterior angle of a triangle equals:", "options": ["Sum of all interior angles", "Sum of two non-adjacent interior angles", "The adjacent interior angle", "180°"], "answer": 1}, {"q": "Area of triangle = ?", "options": ["base x height", "1/2 x base x height", "2 x base x height", "base + height"], "answer": 1}, {"q": "If exterior angle is 110°, the adjacent interior angle is:", "options": ["110°", "70°", "90°", "180°"], "answer": 1}, {"q": "Triangle inequality states that sum of any two sides must be:", "options": ["Equal to third side", "Less than third side", "Greater than third side", "Double the third side"], "answer": 2}, {"q": "A triangle with one angle > 90° is:", "options": ["Acute", "Right", "Obtuse", "Equilateral"], "answer": 2}, {"q": "How many unique triangles can SSS give?", "options": ["0", "1", "2", "Infinite"], "answer": 1}, {"q": "In a right triangle, orthocentre is at:", "options": ["Centre", "The right angle vertex", "Outside", "On hypotenuse"], "answer": 1}, {"q": "An equilateral triangle is also:", "options": ["Always acute", "Always right", "Always obtuse", "Sometimes right"], "answer": 0}, {"q": "If isosceles triangle has equal sides of 5 cm and base 6 cm, perimeter = ?", "options": ["11 cm", "16 cm", "15 cm", "17 cm"], "answer": 1}, {"q": "To construct a triangle, minimum information needed:", "options": ["1 side", "2 sides", "3 elements (sides/angles)", "All 6 elements"], "answer": 2}, {"q": "Two angles in a triangle MUST be:", "options": ["Obtuse", "Right", "Acute", "Equal"], "answer": 2}, {"q": "ASA gives ___ triangle(s):", "options": ["No", "Exactly 1", "2", "Infinite"], "answer": 1}, {"q": "Altitude is ___ to the base:", "options": ["Parallel", "Perpendicular", "Equal", "Adjacent"], "answer": 1}, {"q": "If all angles of a triangle are less than 90°, it is:", "options": ["Right", "Obtuse", "Acute", "Equilateral"], "answer": 2}, {"q": "Can sides 5, 5, 10 form a triangle?", "options": ["Yes, isosceles", "No (5+5 = 10, not greater)", "Yes, equilateral", "Cannot determine"], "answer": 1}, {"q": "The angle sum property works for:", "options": ["Only equilateral triangles", "Only right triangles", "All triangles", "Only isosceles triangles"], "answer": 2}, {"q": "In an equilateral triangle, each altitude also bisects:", "options": ["Only the base", "Only the angle", "Both the base and angle", "Neither"], "answer": 2}, {"q": "A scalene triangle has ___ lines of symmetry:", "options": ["0", "1", "2", "3"], "answer": 0}, {"q": "If two sides are 7 cm and 3 cm, the third side must be:", "options": ["Greater than 10", "Between 4 and 10", "Exactly 10", "Less than 3"], "answer": 1}, {"q": "3-4-5 triangle is a:", "options": ["Equilateral", "Isosceles", "Right triangle", "Obtuse triangle"], "answer": 2}, {"q": "Construction using protractor is needed for:", "options": ["SSS", "SAS or ASA", "Only equilateral", "None"], "answer": 1}, {"q": "An isosceles right triangle has angles:", "options": ["60-60-60", "90-45-45", "90-30-60", "90-50-40"], "answer": 1}, {"q": "The hypotenuse is opposite the:", "options": ["Smallest angle", "Right angle", "Equal angles", "Base"], "answer": 1}]}, {"id": 8, "number": "8", "title": "Working with Fractions", "description": "Multiplication and division of fractions, word problems involving fractions, and real-world applications", "topics": [{"name": "8.1 Multiplication of Fractions", "content": "Multiplying fractions is straightforward: multiply numerators together and denominators together. Understanding why this works helps with word problems.<br><br><b>Rule: a/b × c/d = (a×c)/(b×d)</b><br><br><b>Examples:</b><br>• 2/3 × 4/5 = 8/15<br>• 3/4 × 2/7 = 6/28 = 3/14<br>• 5 × 3/4 = 15/4 = 3¾<br><br><b>Meaning of Fraction Multiplication:</b><br>'1/2 of 1/3' means 1/2 × 1/3 = 1/6. If you take a third of something and then half of that, you get one-sixth.<br><br><b>Multiplying Mixed Numbers:</b><br>First convert to improper fractions:<br>2½ × 1⅓ = 5/2 × 4/3 = 20/6 = 10/3 = 3⅓<br><br><b>Simplification Before Multiplying (Cross-Cancellation):</b><br>2/3 × 9/4: Cancel 2 and 4 (both ÷2), cancel 3 and 9 (both ÷3)<br>= 1/1 × 3/2 = 3/2 = 1½<br><br><b>Properties:</b><br>• Multiplying by a fraction less than 1 makes the number smaller<br>• Multiplying by a fraction greater than 1 makes the number larger<br>• Multiplying by 1 (or any form of 1 like 3/3) keeps the number same<br>• a/b × b/a = 1 (multiplicative inverse)<br><br><b>Real-World Applications:</b><br>• 'Half price' means multiplying by 1/2<br>• 'Two-thirds of the class passed' means 2/3 × total students<br>• Recipe scaling: 3/4 of a recipe that needs 2/3 cup sugar = 3/4 × 2/3 = 1/2 cup<br><br><b>Practice Tip:</b> Always simplify before multiplying when possible - it keeps numbers small and reduces errors."}, {"name": "8.2 Division of Fractions", "content": "Dividing by a fraction is the same as multiplying by its reciprocal. This seemingly odd rule makes perfect sense when you understand what division really means.<br><br><b>Rule: a/b ÷ c/d = a/b × d/c</b><br>(Flip the second fraction and multiply)<br><br><b>Why Does This Work?</b><br>'How many 1/4's are in 3?' means 3 ÷ 1/4 = 3 × 4/1 = 12. Yes! There are 12 quarter-pieces in 3 wholes.<br><br><b>Examples:</b><br>• 3/4 ÷ 2/3 = 3/4 × 3/2 = 9/8 = 1⅛<br>• 5 ÷ 1/3 = 5 × 3 = 15<br>• 1/2 ÷ 3 = 1/2 × 1/3 = 1/6<br>• 2½ ÷ 1¼ = 5/2 ÷ 5/4 = 5/2 × 4/5 = 20/10 = 2<br><br><b>Reciprocal (Multiplicative Inverse):</b><br>• Reciprocal of 3/4 is 4/3<br>• Reciprocal of 5 is 1/5<br>• Reciprocal of 1/7 is 7<br>• A number × its reciprocal = 1<br>• Zero has NO reciprocal (cannot divide by zero!)<br><br><b>Properties:</b><br>• Dividing by a fraction < 1 makes the number LARGER<br>• Dividing by a fraction > 1 makes the number SMALLER<br>• Dividing any number by itself = 1<br><br><b>Practice Tip:</b> Remember KFC - Keep the first fraction, Flip the second, Change division to multiplication!"}, {"name": "8.3 Some Problems Involving Fractions", "content": "Word problems with fractions require careful reading to identify whether you need to add, subtract, multiply, or divide.<br><br><b>Type 1: Finding a Fraction of a Quantity</b><br>'3/5 of 40 students like cricket' → 3/5 × 40 = 24 students<br>'Raju spent 2/7 of Rs. 350' → 2/7 × 350 = Rs. 100<br><br><b>Type 2: Finding the Whole from a Part</b><br>'If 3/4 of a number is 27, find the number' → 27 ÷ 3/4 = 27 × 4/3 = 36<br>'2/5 of the students = 16. Total students?' → 16 ÷ 2/5 = 16 × 5/2 = 40<br><br><b>Type 3: Successive Fractions</b><br>'Meera had Rs. 600. She spent 1/3 on books and 1/4 of the remainder on food.'<br>Books: 1/3 × 600 = Rs. 200. Remainder = Rs. 400.<br>Food: 1/4 × 400 = Rs. 100. Final remainder = Rs. 300.<br><br><b>Type 4: Fraction of Area/Length</b><br>'A rope 8½ meters long is cut into pieces of 1¼ m each. How many pieces?'<br>8½ ÷ 1¼ = 17/2 ÷ 5/4 = 17/2 × 4/5 = 68/10 = 6.8 → 6 complete pieces<br><br><b>Type 5: Comparing Fractions</b><br>'Who ate more: Ram (3/8 of pizza) or Shyam (2/5 of pizza)?'<br>3/8 = 15/40, 2/5 = 16/40. Shyam ate more!<br><br><b>Practice Tip:</b> In word problems, 'of' usually means multiplication, 'shared equally' means division, and 'how much more/less' means subtraction."}], "questions": [{"q": "2/3 x 4/5 = ?", "options": ["6/8", "8/15", "6/15", "8/8"], "answer": 1}, {"q": "The reciprocal of 3/7 is:", "options": ["3/7", "7/3", "-3/7", "1"], "answer": 1}, {"q": "3/4 / 2/3 = ?", "options": ["6/12", "9/8", "1/2", "6/7"], "answer": 1}, {"q": "Half of 2/5 is:", "options": ["1/5", "4/5", "2/10", "1/10"], "answer": 0}, {"q": "5 / (1/3) = ?", "options": ["5/3", "15", "3/5", "1/15"], "answer": 1}, {"q": "2 1/2 x 1 1/3 = ?", "options": ["2 2/5", "3 1/3", "3 1/6", "2 1/6"], "answer": 1}, {"q": "3/5 of 40 = ?", "options": ["8", "24", "30", "15"], "answer": 1}, {"q": "Reciprocal of 5 is:", "options": ["5", "-5", "1/5", "0"], "answer": 2}, {"q": "1/2 / 3 = ?", "options": ["3/2", "1/6", "6", "2/3"], "answer": 1}, {"q": "If 3/4 of a number is 27, the number is:", "options": ["20", "36", "81", "9"], "answer": 1}, {"q": "Multiplying by 1/2 is the same as:", "options": ["Doubling", "Halving", "Adding 1/2", "Subtracting 1/2"], "answer": 1}, {"q": "4/7 x 7/4 = ?", "options": ["0", "1", "16/49", "49/16"], "answer": 1}, {"q": "A rope 8 1/2 m cut into 1 1/4 m pieces gives:", "options": ["6 pieces", "7 pieces", "8 pieces", "6 complete pieces"], "answer": 3}, {"q": "Which is greater: 3/8 or 2/5?", "options": ["3/8", "2/5", "Equal", "Cannot compare"], "answer": 1}, {"q": "2/3 x 9/4 simplified first gives:", "options": ["18/12", "3/2", "6/4", "9/6"], "answer": 1}, {"q": "Dividing by 1/4 is the same as:", "options": ["Multiplying by 4", "Dividing by 4", "Multiplying by 1/4", "Subtracting 4"], "answer": 0}, {"q": "3/8 x 0 = ?", "options": ["3/8", "0", "8/3", "Undefined"], "answer": 1}, {"q": "If 2/5 of students = 16, total students = ?", "options": ["32", "8", "40", "80"], "answer": 2}, {"q": "Mixed number 3 2/5 as improper fraction:", "options": ["32/5", "17/5", "15/2", "6/5"], "answer": 1}, {"q": "1/3 x 1/3 = ?", "options": ["2/3", "1/6", "1/9", "2/9"], "answer": 2}, {"q": "Zero has a reciprocal:", "options": ["Yes, it's 0", "Yes, it's infinity", "No", "Yes, it's 1"], "answer": 2}, {"q": "2/3 / 2/3 = ?", "options": ["0", "1", "4/9", "2/3"], "answer": 1}, {"q": "Raju spent 2/7 of Rs. 350. He spent:", "options": ["Rs. 50", "Rs. 100", "Rs. 150", "Rs. 200"], "answer": 1}, {"q": "5/6 x 12 = ?", "options": ["10", "60/6", "17/6", "Both A and B"], "answer": 3}, {"q": "Multiplying a number by a fraction > 1:", "options": ["Decreases it", "Increases it", "Keeps it same", "Makes it zero"], "answer": 1}, {"q": "3 1/4 / 1/2 = ?", "options": ["1 5/8", "6 1/2", "3/8", "13/8"], "answer": 1}, {"q": "What fraction of 1 hour is 20 minutes?", "options": ["1/2", "1/3", "1/4", "2/5"], "answer": 1}, {"q": "7/8 x 8/7 = ?", "options": ["56/56", "1", "15/15", "All of these"], "answer": 3}, {"q": "If she spent 1/3 of Rs. 600 on books, remainder = ?", "options": ["Rs. 200", "Rs. 300", "Rs. 400", "Rs. 500"], "answer": 2}, {"q": "1/5 / 1/5 = ?", "options": ["1/25", "25", "1", "0"], "answer": 2}, {"q": "3/4 of a pizza shared by 3 people. Each gets:", "options": ["1/4", "3/12", "9/4", "Both A and B"], "answer": 3}, {"q": "Which is larger: 5/6 or 7/8?", "options": ["5/6", "7/8", "Equal", "Cannot tell"], "answer": 1}, {"q": "2 / (2/3) = ?", "options": ["4/3", "3", "1/3", "6"], "answer": 1}, {"q": "Product of a number and its reciprocal is always:", "options": ["0", "1", "The number itself", "2"], "answer": 1}, {"q": "3/5 x 5/3 x 7 = ?", "options": ["7", "105/15", "1", "Both A and B"], "answer": 3}, {"q": "Half of three-quarters is:", "options": ["3/8", "3/2", "1/4", "6/4"], "answer": 0}, {"q": "If 1/4 of a class failed and 30 passed, class size = ?", "options": ["35", "40", "120", "34"], "answer": 1}, {"q": "2 1/2 / 1 1/4 = ?", "options": ["1", "2", "3", "4"], "answer": 1}, {"q": "4/5 x 25 = ?", "options": ["20", "100/5", "5", "Both A and B"], "answer": 3}, {"q": "In word problems, 'of' usually means:", "options": ["Addition", "Subtraction", "Multiplication", "Division"], "answer": 2}]}, {"id": 9, "number": "9", "title": "Geometric Twins", "description": "Understanding symmetry, congruence, reflection, and rotation - how geometric shapes can be identical twins", "topics": [{"name": "9.1 Line Symmetry", "content": "A figure has line symmetry if it can be folded along a line so that one half matches exactly with the other half. This fold line is called the line of symmetry or axis of symmetry.<br><br><b>Definition:</b><br>A figure is symmetric about a line if, when folded along that line, the two halves overlap perfectly. The fold line is the line of symmetry.<br><br><b>Examples of Line Symmetry:</b><br>• A square has 4 lines of symmetry (2 diagonals + 2 midpoint lines)<br>• A rectangle has 2 lines of symmetry (through midpoints of opposite sides)<br>• An equilateral triangle has 3 lines of symmetry<br>• A circle has infinite lines of symmetry (every diameter)<br>• A regular pentagon has 5 lines of symmetry<br><br><b>Symmetry in English Alphabets:</b><br>• Vertical line symmetry: A, H, I, M, O, T, U, V, W, X, Y<br>• Horizontal line symmetry: B, C, D, E, H, I, K, O, X<br>• Both: H, I, O, X<br>• No symmetry: F, G, J, L, N, P, Q, R, S, Z<br><br><b>Symmetry in Nature:</b><br>• Butterflies (bilateral symmetry)<br>• Leaves (midrib is the line of symmetry)<br>• Human face (approximately symmetric)<br>• Snowflakes (6 lines of symmetry)<br><br><b>Mirror Test:</b> Place a mirror along the supposed line of symmetry. If the reflection plus the visible half recreates the full figure, it's a line of symmetry!<br><br><b>Practice Tip:</b> To check symmetry, trace the figure on paper, fold along the suspected line, and see if both halves match."}, {"name": "9.2 Congruent Figures", "content": "Two figures are congruent if they have the same shape AND the same size. One can be placed on top of the other to match perfectly.<br><br><b>Definition:</b><br>Congruent figures are identical in shape and size. They can be superimposed (placed on top of each other) to match exactly. The symbol for congruence is ≅.<br><br><b>Congruence vs Similarity:</b><br>• <b>Congruent:</b> Same shape AND same size (exact copies)<br>• <b>Similar:</b> Same shape but possibly different sizes (scaled copies)<br>All congruent figures are similar, but not all similar figures are congruent!<br><br><b>Congruence of Line Segments:</b><br>Two line segments are congruent if they have the same length.<br>AB ≅ CD means AB = CD (same length)<br><br><b>Congruence of Angles:</b><br>Two angles are congruent if they have the same measure.<br>∠A ≅ ∠B means ∠A = ∠B (same degrees)<br><br><b>Congruence of Triangles:</b><br>Two triangles are congruent if all corresponding sides and angles match. Tests:<br>• SSS: All 3 sides equal<br>• SAS: 2 sides and included angle equal<br>• ASA: 2 angles and included side equal<br>• RHS: Right angle, Hypotenuse, one Side equal<br><br><b>Real-World Examples:</b><br>• Two coins of the same denomination are congruent<br>• Tiles of the same type are congruent<br>• Mass-produced objects (same mold) are congruent<br><br><b>Practice Tip:</b> To check if two figures are congruent, trace one on paper and try to place it on the other. You may need to flip or rotate it."}, {"name": "9.3 Flips and Turns", "content": "Geometric transformations like reflections (flips), rotations (turns), and translations (slides) move figures while preserving their shape and size.<br><br><b>Reflection (Flip):</b><br>• A mirror image of the figure across a line (mirror line)<br>• Every point moves to the other side, same distance from the mirror line<br>• The figure appears 'flipped' or reversed<br>• Left and right are swapped, but shape and size stay the same<br><br><b>Rotation (Turn):</b><br>• Turning a figure around a fixed point (center of rotation)<br>• Measured by the angle of rotation (90°, 180°, 270°, etc.)<br>• Clockwise or counter-clockwise direction<br>• Shape and size remain unchanged<br><br><b>Translation (Slide):</b><br>• Moving a figure in a straight line without rotating or flipping<br>• Every point moves the same distance in the same direction<br>• Like sliding a chess piece straight across the board<br><br><b>Rotational Symmetry:</b><br>A figure has rotational symmetry if it looks the same after rotation by less than 360°:<br>• Square: Order 4 (looks same at 90°, 180°, 270°, 360°)<br>• Equilateral triangle: Order 3 (120°, 240°, 360°)<br>• Rectangle: Order 2 (180°, 360°)<br>• Circle: Infinite order<br><br><b>Key Insight:</b> Reflections, rotations, and translations all produce congruent figures. The original and the transformed figure are always congruent!<br><br><b>Practice Tip:</b> Use tracing paper to test transformations - trace the figure and physically flip, turn, or slide it to see the result."}], "questions": [{"q": "How many lines of symmetry does a square have?", "options": ["1", "2", "4", "8"], "answer": 2}, {"q": "Two figures with same shape and size are:", "options": ["Similar", "Congruent", "Symmetric", "Equal"], "answer": 1}, {"q": "A circle has ___ lines of symmetry:", "options": ["1", "4", "8", "Infinite"], "answer": 3}, {"q": "The letter 'A' has:", "options": ["Vertical line symmetry", "Horizontal line symmetry", "Both", "No symmetry"], "answer": 0}, {"q": "A reflection is also called a:", "options": ["Slide", "Turn", "Flip", "Stretch"], "answer": 2}, {"q": "An equilateral triangle has ___ lines of symmetry:", "options": ["1", "2", "3", "6"], "answer": 2}, {"q": "The symbol for congruence is:", "options": ["=", "~", "≅", "≈"], "answer": 2}, {"q": "A rotation is also called a:", "options": ["Flip", "Turn", "Slide", "Scale"], "answer": 1}, {"q": "Rotational symmetry order of a square is:", "options": ["2", "3", "4", "8"], "answer": 2}, {"q": "Which letter has both horizontal and vertical symmetry?", "options": ["A", "B", "H", "T"], "answer": 2}, {"q": "Two congruent triangles have:", "options": ["Same shape only", "Same size only", "Same shape and size", "Different shapes"], "answer": 2}, {"q": "A rectangle has ___ lines of symmetry:", "options": ["1", "2", "3", "4"], "answer": 1}, {"q": "A translation is also called a:", "options": ["Flip", "Turn", "Slide", "Rotation"], "answer": 2}, {"q": "Which has NO line of symmetry?", "options": ["Circle", "Square", "Scalene triangle", "Rectangle"], "answer": 2}, {"q": "A butterfly shows ___ symmetry:", "options": ["No", "Bilateral (line)", "Rotational", "Point"], "answer": 1}, {"q": "SSS test for congruence means:", "options": ["Side-Side-Side", "Same-Same-Same", "Similar-Similar-Similar", "Sum-Sum-Sum"], "answer": 0}, {"q": "After a reflection, the figure is:", "options": ["Bigger", "Smaller", "Congruent to original", "Similar only"], "answer": 2}, {"q": "A regular hexagon has ___ lines of symmetry:", "options": ["3", "4", "6", "12"], "answer": 2}, {"q": "Which transformation changes left-right orientation?", "options": ["Translation", "Rotation", "Reflection", "None"], "answer": 2}, {"q": "The letter 'O' has ___ lines of symmetry:", "options": ["1", "2", "4", "Infinite"], "answer": 3}, {"q": "All congruent figures are similar:", "options": ["True", "False", "Sometimes", "Never"], "answer": 0}, {"q": "A snowflake typically has ___ lines of symmetry:", "options": ["2", "4", "6", "8"], "answer": 2}, {"q": "Rotational symmetry order of an equilateral triangle:", "options": ["1", "2", "3", "6"], "answer": 2}, {"q": "Which test is NOT for triangle congruence?", "options": ["SSS", "SAS", "AAA", "ASA"], "answer": 2}, {"q": "A parallelogram has ___ lines of symmetry:", "options": ["0", "1", "2", "4"], "answer": 0}, {"q": "After 180° rotation, a rectangle looks:", "options": ["Different", "The same", "Bigger", "Flipped"], "answer": 1}, {"q": "Two line segments are congruent if they have:", "options": ["Same direction", "Same length", "Same position", "Same color"], "answer": 1}, {"q": "A regular pentagon has rotational symmetry of order:", "options": ["3", "4", "5", "10"], "answer": 2}, {"q": "Which shape has the most lines of symmetry?", "options": ["Square", "Rectangle", "Circle", "Triangle"], "answer": 2}, {"q": "In a reflection, the distance from mirror line is:", "options": ["Doubled", "Halved", "Same on both sides", "Zero"], "answer": 2}, {"q": "An isosceles triangle has ___ line(s) of symmetry:", "options": ["0", "1", "2", "3"], "answer": 1}, {"q": "Which transformation doesn't change orientation?", "options": ["Reflection", "Translation", "Glide reflection", "None"], "answer": 1}, {"q": "A rhombus has ___ lines of symmetry:", "options": ["0", "1", "2", "4"], "answer": 2}, {"q": "Two circles with the same radius are:", "options": ["Similar only", "Congruent", "Neither", "Cannot determine"], "answer": 1}, {"q": "The letter 'S' has:", "options": ["Line symmetry", "Rotational symmetry", "Both", "Neither"], "answer": 1}, {"q": "After a 360° rotation, the figure:", "options": ["Disappears", "Doubles", "Returns to original position", "Flips"], "answer": 2}, {"q": "RHS congruence test applies to:", "options": ["All triangles", "Only right triangles", "Only equilateral", "Only isosceles"], "answer": 1}, {"q": "A scalene triangle has ___ lines of symmetry:", "options": ["0", "1", "2", "3"], "answer": 0}, {"q": "Which has rotational symmetry but NO line symmetry?", "options": ["Square", "Circle", "Parallelogram (non-rectangle)", "Equilateral triangle"], "answer": 2}, {"q": "Two angles are congruent if they have:", "options": ["Same arms", "Same measure", "Same vertex", "Same position"], "answer": 1}]}, {"id": 10, "number": "10", "title": "Operations with Integers", "description": "Understanding positive and negative numbers, number line operations, addition, subtraction, and multiplication of integers", "topics": [{"name": "10.1 Integers and the Number Line", "content": "Integers extend our number system to include negative numbers. The number line stretches infinitely in both directions, with zero in the middle.<br><br><b>What are Integers?</b><br>Integers = {..., -3, -2, -1, 0, 1, 2, 3, ...}<br>• Positive integers: 1, 2, 3, 4, ... (right of zero)<br>• Negative integers: -1, -2, -3, -4, ... (left of zero)<br>• Zero is neither positive nor negative<br><br><b>The Number Line:</b><br><-- -5 -4 -3 -2 -1 0 1 2 3 4 5 --><br>• Numbers increase from left to right<br>• Numbers decrease from right to left<br>• Every positive number has a negative counterpart<br><br><b>Comparing Integers:</b><br>• Any positive integer > 0 > any negative integer<br>• Among negatives: -1 > -2 > -3 (closer to zero = larger)<br>• -100 < -1 (further from zero = smaller for negatives)<br><br><b>Absolute Value:</b><br>The distance of a number from zero (always positive):<br>• |5| = 5, |-5| = 5<br>• |0| = 0<br>• |-100| = 100<br><br><b>Real-World Integers:</b><br>• Temperature: -5°C (5 degrees below zero)<br>• Altitude: -200 m (200 meters below sea level, like the Dead Sea)<br>• Bank balance: -Rs. 500 (overdrawn/debt of Rs. 500)<br>• Floors: -2 (second basement level)<br>• Timeline: -500 BCE (500 years before common era)<br><br><b>Practice Tip:</b> Think of the number line as a thermometer - above zero is positive (warm), below zero is negative (cold). The further below zero, the colder (smaller) it is."}, {"name": "10.2 Operations on Integers", "content": "Adding, subtracting, and multiplying integers follows specific rules. Understanding these rules through the number line makes them intuitive.<br><br><b>Addition of Integers:</b><br>• Same signs: Add the absolute values, keep the sign<br>  (+3) + (+5) = +8, (-3) + (-5) = -8<br>• Different signs: Subtract smaller absolute value from larger, keep sign of larger<br>  (+7) + (-3) = +4, (-7) + (+3) = -4<br>  (+3) + (-7) = -4, (-3) + (+7) = +4<br><br><b>Subtraction of Integers:</b><br>Subtracting is the same as adding the opposite (additive inverse):<br>a - b = a + (-b)<br>• 5 - 8 = 5 + (-8) = -3<br>• -3 - 4 = -3 + (-4) = -7<br>• -3 - (-4) = -3 + 4 = 1<br><br><b>Multiplication of Integers:</b><br>• Positive × Positive = Positive: 3 × 4 = 12<br>• Negative × Negative = Positive: (-3) × (-4) = 12<br>• Positive × Negative = Negative: 3 × (-4) = -12<br>• Negative × Positive = Negative: (-3) × 4 = -12<br><br><b>Memory Aid:</b> Same signs → Positive product, Different signs → Negative product<br><br><b>Properties:</b><br>• a + 0 = a (zero is additive identity)<br>• a + (-a) = 0 (additive inverse)<br>• a × 1 = a (one is multiplicative identity)<br>• a × 0 = 0<br>• Addition and multiplication are commutative and associative<br>• Subtraction and division are NOT commutative<br><br><b>Practice Tip:</b> For subtraction, always convert to addition first: a - b = a + (-b). This reduces mistakes with negative numbers."}], "questions": [{"q": "(-3) + (-5) = ?", "options": ["-8", "8", "-2", "2"], "answer": 0}, {"q": "Which is greater: -3 or -7?", "options": ["-3", "-7", "Both equal", "Cannot compare"], "answer": 0}, {"q": "The additive inverse of 5 is:", "options": ["5", "-5", "1/5", "0"], "answer": 1}, {"q": "(-4) x (-3) = ?", "options": ["-12", "12", "-7", "7"], "answer": 1}, {"q": "7 + (-10) = ?", "options": ["17", "-17", "-3", "3"], "answer": 2}, {"q": "|−8| = ?", "options": ["-8", "8", "0", "-1"], "answer": 1}, {"q": "(-5) - (-3) = ?", "options": ["-8", "-2", "2", "8"], "answer": 1}, {"q": "Zero is:", "options": ["Positive", "Negative", "Neither positive nor negative", "Both"], "answer": 2}, {"q": "3 x (-7) = ?", "options": ["21", "-21", "10", "-10"], "answer": 1}, {"q": "(-15) + 15 = ?", "options": ["30", "-30", "0", "15"], "answer": 2}, {"q": "Which is smallest: -1, -100, 0, 1?", "options": ["-1", "-100", "0", "1"], "answer": 1}, {"q": "(-6) - 4 = ?", "options": ["-10", "-2", "2", "10"], "answer": 0}, {"q": "(-2) x (-2) x (-2) = ?", "options": ["8", "-8", "6", "-6"], "answer": 1}, {"q": "The integer between -3 and -1 is:", "options": ["-4", "-2", "0", "2"], "answer": 1}, {"q": "8 - (-3) = ?", "options": ["5", "11", "-5", "-11"], "answer": 1}, {"q": "Negative x Negative = ?", "options": ["Negative", "Positive", "Zero", "Cannot determine"], "answer": 1}, {"q": "(-20) / 4 = ?", "options": ["5", "-5", "24", "-24"], "answer": 1}, {"q": "Temperature drops from 5°C by 8°C. New temp:", "options": ["13°C", "-3°C", "3°C", "-13°C"], "answer": 1}, {"q": "(-1) x (-1) x (-1) x (-1) = ?", "options": ["-1", "1", "-4", "4"], "answer": 1}, {"q": "Arrange in ascending order: -5, 3, -1, 0", "options": ["-5,-1,0,3", "3,0,-1,-5", "-1,-5,0,3", "0,-1,-5,3"], "answer": 0}, {"q": "Is subtraction of integers commutative?", "options": ["Yes", "No", "Sometimes", "Only for positives"], "answer": 1}, {"q": "(-9) + 4 = ?", "options": ["-13", "13", "-5", "5"], "answer": 2}, {"q": "The absolute value of 0 is:", "options": ["0", "1", "Undefined", "-1"], "answer": 0}, {"q": "(-6) x 5 = ?", "options": ["30", "-30", "11", "-11"], "answer": 1}, {"q": "A submarine at -200m rises 50m. New depth:", "options": ["-250m", "-150m", "150m", "250m"], "answer": 1}, {"q": "(-3) + (-3) + (-3) = ?", "options": ["-9", "9", "-6", "6"], "answer": 0}, {"q": "Which operation gives positive: (-5) ? (-5)?", "options": ["Addition", "Subtraction", "Multiplication", "None"], "answer": 2}, {"q": "0 - (-7) = ?", "options": ["-7", "7", "0", "14"], "answer": 1}, {"q": "(-4)² = ?", "options": ["-16", "16", "-8", "8"], "answer": 1}, {"q": "Sum of all integers from -5 to 5 is:", "options": ["-5", "5", "0", "10"], "answer": 2}, {"q": "(-12) / (-3) = ?", "options": ["-4", "4", "-36", "36"], "answer": 1}, {"q": "a + (-a) always equals:", "options": ["2a", "-2a", "0", "a²"], "answer": 2}, {"q": "Which is true: -3 > -2 or -3 < -2?", "options": ["-3 > -2", "-3 < -2", "They are equal", "Cannot compare"], "answer": 1}, {"q": "(-7) x 0 = ?", "options": ["-7", "7", "0", "Undefined"], "answer": 2}, {"q": "15 + (-20) + 5 = ?", "options": ["40", "-40", "0", "10"], "answer": 2}, {"q": "The successor of -1 is:", "options": ["-2", "0", "1", "-1"], "answer": 1}, {"q": "(-8) - (-8) = ?", "options": ["-16", "16", "0", "1"], "answer": 2}, {"q": "Product of 5 negative numbers is:", "options": ["Positive", "Negative", "Zero", "Cannot determine"], "answer": 1}, {"q": "The predecessor of 0 is:", "options": ["1", "-1", "0", "None"], "answer": 1}, {"q": "(-2) x 3 x (-4) = ?", "options": ["-24", "24", "-9", "9"], "answer": 1}]}, {"id": 11, "number": "11", "title": "Finding Common Ground", "description": "Understanding factors, multiples, HCF (GCD), LCM, prime factorization, and their real-world applications", "topics": [{"name": "11.1 Prime Numbers and Factorisation", "content": "Every number greater than 1 is either prime or can be expressed as a product of prime numbers. This fundamental idea is the basis of all number theory.<br><br><b>Prime Numbers:</b><br>A number greater than 1 that has exactly two factors (1 and itself):<br>2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47...<br><br><b>Important Facts about Primes:</b><br>• 2 is the only even prime number<br>• 1 is NOT a prime (it has only one factor)<br>• There are infinitely many primes<br>• Every even number > 2 can be written as a sum of two primes (Goldbach's conjecture, unproven but verified up to very large numbers)<br><br><b>Composite Numbers:</b><br>Numbers with more than 2 factors: 4, 6, 8, 9, 10, 12, 14, 15...<br><br><b>Prime Factorisation:</b><br>Writing a number as a product of its prime factors:<br>• 12 = 2 × 2 × 3 = 2² × 3<br>• 60 = 2² × 3 × 5<br>• 100 = 2² × 5²<br><br><b>Factor Tree Method:</b><br>60 → 2 × 30 → 2 × 2 × 15 → 2 × 2 × 3 × 5<br><br><b>Division Method:</b><br>Divide by smallest prime repeatedly: 60 ÷ 2 = 30, 30 ÷ 2 = 15, 15 ÷ 3 = 5, 5 ÷ 5 = 1<br>So 60 = 2 × 2 × 3 × 5<br><br><b>Fundamental Theorem of Arithmetic:</b><br>Every number > 1 has a UNIQUE prime factorisation (up to order). This is one of the most important theorems in mathematics!<br><br><b>Practice Tip:</b> Always start dividing by the smallest prime (2), then try 3, 5, 7, etc. This systematic approach ensures you don't miss any factors."}, {"name": "11.2 HCF (Highest Common Factor)", "content": "The HCF (also called GCD - Greatest Common Divisor) of two or more numbers is the largest number that divides all of them exactly.<br><br><b>Finding HCF - Method 1: Listing Factors</b><br>Factors of 12: 1, 2, 3, 4, 6, 12<br>Factors of 18: 1, 2, 3, 6, 9, 18<br>Common factors: 1, 2, 3, 6<br>HCF = 6 (the highest common factor)<br><br><b>Finding HCF - Method 2: Prime Factorisation</b><br>12 = 2² × 3<br>18 = 2 × 3²<br>HCF = Product of common prime factors with LOWEST powers<br>= 2¹ × 3¹ = 6<br><br><b>Finding HCF - Method 3: Division Method (Euclid's Algorithm)</b><br>HCF(48, 18): 48 = 2 × 18 + 12, then 18 = 1 × 12 + 6, then 12 = 2 × 6 + 0<br>HCF = 6 (the last non-zero remainder)<br><br><b>Properties of HCF:</b><br>• HCF(a, b) ≤ min(a, b)<br>• If HCF(a, b) = 1, then a and b are coprime (no common factor except 1)<br>• HCF(a, a) = a<br>• HCF(a, 0) = a<br><br><b>Real-World Applications:</b><br>• Cutting rope into equal pieces: HCF tells the longest possible piece length<br>• Arranging items in equal rows: HCF gives the maximum row size<br>• Simplifying fractions: Divide both numerator and denominator by their HCF<br><br><b>Practice Tip:</b> The prime factorisation method is most reliable for HCF. Write out the factorisation, circle common primes, and multiply with lowest powers."}, {"name": "11.3 LCM (Least Common Multiple)", "content": "The LCM of two or more numbers is the smallest number that is a multiple of all of them.<br><br><b>Finding LCM - Method 1: Listing Multiples</b><br>Multiples of 4: 4, 8, 12, 16, 20, 24, 28, 32, 36...<br>Multiples of 6: 6, 12, 18, 24, 30, 36...<br>Common multiples: 12, 24, 36...<br>LCM = 12 (the least common multiple)<br><br><b>Finding LCM - Method 2: Prime Factorisation</b><br>4 = 2²<br>6 = 2 × 3<br>LCM = Product of ALL prime factors with HIGHEST powers<br>= 2² × 3 = 12<br><br><b>Finding LCM - Method 3: Division Method</b><br>Write both numbers, divide by common primes:<br>2 | 4, 6<br>2 | 2, 3<br>3 | 1, 3<br>  | 1, 1<br>LCM = 2 × 2 × 3 = 12<br><br><b>HCF-LCM Relationship:</b><br>For any two numbers a and b:<br>HCF(a,b) × LCM(a,b) = a × b<br>Example: HCF(4,6)=2, LCM(4,6)=12, and 2×12 = 4×6 = 24 ✓<br><br><b>Real-World Applications:</b><br>• When will two events coincide? (LCM of their intervals)<br>• Two lights blink every 4 and 6 seconds - when do they blink together? LCM(4,6) = 12 seconds<br>• Buying items to get equal quantities: LCM of pack sizes<br><br><b>Practice Tip:</b> For LCM, use ALL prime factors with HIGHEST powers. For HCF, use only COMMON prime factors with LOWEST powers. Don't mix them up!"}], "questions": [{"q": "Is 1 a prime number?", "options": ["Yes", "No", "Sometimes", "It's special"], "answer": 1}, {"q": "The only even prime number is:", "options": ["1", "2", "4", "0"], "answer": 1}, {"q": "Prime factorisation of 60 is:", "options": ["2x30", "4x15", "2²x3x5", "6x10"], "answer": 2}, {"q": "HCF of 12 and 18 is:", "options": ["2", "3", "6", "36"], "answer": 2}, {"q": "LCM of 4 and 6 is:", "options": ["2", "12", "24", "10"], "answer": 1}, {"q": "Two numbers with HCF = 1 are called:", "options": ["Prime", "Composite", "Coprime", "Twin primes"], "answer": 2}, {"q": "HCF(a,b) x LCM(a,b) = ?", "options": ["a + b", "a - b", "a x b", "a / b"], "answer": 2}, {"q": "Prime factorisation of 100:", "options": ["2x50", "4x25", "10x10", "2²x5²"], "answer": 3}, {"q": "LCM of 3 and 7 is:", "options": ["3", "7", "10", "21"], "answer": 3}, {"q": "HCF of 15 and 25 is:", "options": ["5", "15", "25", "75"], "answer": 0}, {"q": "Which is prime: 51, 53, 55, 57?", "options": ["51", "53", "55", "57"], "answer": 1}, {"q": "LCM of 5 and 10 is:", "options": ["5", "10", "50", "15"], "answer": 1}, {"q": "How many prime numbers between 1 and 10?", "options": ["3", "4", "5", "6"], "answer": 1}, {"q": "HCF of 48 and 36 is:", "options": ["6", "12", "24", "144"], "answer": 1}, {"q": "If HCF(a,b) = a, then:", "options": ["a = b", "a divides b", "b divides a", "a and b are prime"], "answer": 1}, {"q": "LCM of 12 and 15 is:", "options": ["3", "60", "180", "30"], "answer": 1}, {"q": "36 = 2² x 3². Number of factors of 36:", "options": ["6", "7", "8", "9"], "answer": 3}, {"q": "To simplify 24/36, divide by HCF:", "options": ["2", "6", "12", "4"], "answer": 2}, {"q": "LCM(6,8,12) = ?", "options": ["24", "48", "96", "12"], "answer": 0}, {"q": "Two lights blink every 4s and 6s. They blink together every:", "options": ["10s", "12s", "24s", "2s"], "answer": 1}, {"q": "Is 91 prime?", "options": ["Yes", "No (7x13)", "No (9x11)", "Cannot determine"], "answer": 1}, {"q": "HCF of two prime numbers is always:", "options": ["0", "1", "Their product", "Their sum"], "answer": 1}, {"q": "LCM of two prime numbers is:", "options": ["1", "Their sum", "Their product", "Their HCF"], "answer": 2}, {"q": "Prime factorisation of 72:", "options": ["8x9", "2³x3²", "2²x18", "4x18"], "answer": 1}, {"q": "HCF(100, 75) = ?", "options": ["5", "25", "50", "75"], "answer": 1}, {"q": "If LCM = 60 and HCF = 5 for two numbers, their product is:", "options": ["65", "300", "12", "55"], "answer": 1}, {"q": "Which pair is coprime?", "options": ["4 and 6", "8 and 15", "12 and 18", "9 and 21"], "answer": 1}, {"q": "LCM is always:", "options": ["Less than both numbers", "Equal to smaller number", ">= the larger number", "Equal to HCF"], "answer": 2}, {"q": "Goldbach's conjecture states every even number > 2 is:", "options": ["Prime", "Sum of two primes", "Product of two primes", "Power of 2"], "answer": 1}, {"q": "HCF(0, 5) = ?", "options": ["0", "1", "5", "Undefined"], "answer": 2}, {"q": "Number of primes between 10 and 20:", "options": ["2", "3", "4", "5"], "answer": 2}, {"q": "LCM(1, any number n) = ?", "options": ["1", "n", "n+1", "0"], "answer": 1}, {"q": "24/36 simplified = ?", "options": ["4/6", "2/3", "12/18", "All of these simplify to 2/3"], "answer": 3}, {"q": "Prime factorisation of 180:", "options": ["2²x3²x5", "2x3x30", "4x45", "18x10"], "answer": 0}, {"q": "HCF(a, a) = ?", "options": ["0", "1", "a", "2a"], "answer": 2}, {"q": "If HCF of two numbers is 12, both numbers are divisible by:", "options": ["6 only", "12", "24", "Cannot determine"], "answer": 1}, {"q": "Rope of 24m and 36m cut into longest equal pieces. Piece length:", "options": ["6m", "12m", "24m", "4m"], "answer": 1}, {"q": "LCM of 15 and 20:", "options": ["5", "30", "60", "300"], "answer": 2}, {"q": "A composite number has:", "options": ["Exactly 2 factors", "More than 2 factors", "Exactly 1 factor", "No factors"], "answer": 1}, {"q": "The smallest composite number is:", "options": ["1", "2", "3", "4"], "answer": 3}]}, {"id": 12, "number": "12", "title": "Another Peek Beyond the Point", "description": "Advanced decimal operations - multiplication and division of decimals, decimal patterns, and real-world problem solving", "topics": [{"name": "12.1 Multiplying Decimals", "content": "Multiplying decimals extends the multiplication rules we know for whole numbers. The key is keeping track of decimal places in the answer.<br><br><b>Rule for Multiplying Decimals:</b><br>1. Ignore the decimal points and multiply as whole numbers<br>2. Count the total decimal places in both numbers<br>3. Place the decimal point in the answer with that many decimal places<br><br><b>Examples:</b><br>• 0.3 × 0.4 = 0.12 (1 + 1 = 2 decimal places)<br>• 2.5 × 0.3 = 0.75 (1 + 1 = 2 decimal places: 25 × 3 = 75 → 0.75)<br>• 1.2 × 3.5 = 4.20 = 4.2 (1 + 1 = 2 decimal places: 12 × 35 = 420 → 4.20)<br>• 0.06 × 0.7 = 0.042 (2 + 1 = 3 decimal places: 6 × 7 = 42 → 0.042)<br><br><b>Multiplying by Powers of 10:</b><br>• 3.456 × 10 = 34.56 (move decimal 1 place right)<br>• 3.456 × 100 = 345.6 (move decimal 2 places right)<br>• 3.456 × 1000 = 3456 (move decimal 3 places right)<br><br><b>Multiplying Decimals by Whole Numbers:</b><br>• 2.5 × 4 = 10.0 = 10<br>• 0.75 × 8 = 6.00 = 6<br><br><b>Real-World Applications:</b><br>• Cost: 2.5 kg of apples at Rs. 80 per kg = 2.5 × 80 = Rs. 200<br>• Area: Room 4.5 m × 3.2 m = 14.4 m²<br>• Speed-Time: Walking 4.5 km/hr for 2.5 hours = 11.25 km<br><br><b>Practice Tip:</b> When unsure about decimal placement, estimate first. 2.5 × 3.5 should be close to 3 × 4 = 12, so 8.75 makes sense, but 87.5 or 0.875 wouldn't!"}, {"name": "12.2 Dividing Decimals", "content": "Dividing decimals requires converting the division into a simpler form by removing the decimal from the divisor.<br><br><b>Dividing a Decimal by a Whole Number:</b><br>Just divide normally and place the decimal point in the quotient directly above where it is in the dividend:<br>• 4.8 ÷ 2 = 2.4<br>• 15.6 ÷ 3 = 5.2<br>• 0.45 ÷ 5 = 0.09<br><br><b>Dividing by a Decimal:</b><br>Make the divisor a whole number by multiplying both numbers by 10, 100, etc.:<br>• 4.8 ÷ 0.2 = 48 ÷ 2 = 24 (multiply both by 10)<br>• 3.6 ÷ 0.04 = 360 ÷ 4 = 90 (multiply both by 100)<br>• 7.5 ÷ 2.5 = 75 ÷ 25 = 3 (multiply both by 10)<br><br><b>Dividing by Powers of 10:</b><br>• 345.6 ÷ 10 = 34.56 (move decimal 1 place left)<br>• 345.6 ÷ 100 = 3.456 (move decimal 2 places left)<br>• 345.6 ÷ 1000 = 0.3456 (move decimal 3 places left)<br><br><b>Converting Fractions to Decimals:</b><br>Divide the numerator by the denominator:<br>• 3/8 = 3 ÷ 8 = 0.375<br>• 5/6 = 5 ÷ 6 = 0.8333...<br><br><b>Real-World Applications:</b><br>• Sharing a bill: Rs. 457.50 among 3 people = 457.50 ÷ 3 = Rs. 152.50 each<br>• Unit price: Rs. 67.50 for 2.5 kg = 67.50 ÷ 2.5 = Rs. 27 per kg<br><br><b>Practice Tip:</b> Always make the divisor a whole number first - it makes the division much easier and less error-prone."}, {"name": "12.3 Decimal Patterns and Problem Solving", "content": "Decimals reveal beautiful patterns when we explore multiplication tables, recurring decimals, and systematic calculations.<br><br><b>Patterns in Decimal Products:</b><br>• 0.1 × 0.1 = 0.01<br>• 0.1 × 0.01 = 0.001<br>• 0.01 × 0.01 = 0.0001<br>Pattern: The number of decimal places ADDS up!<br><br><b>Repeating Decimal Patterns:</b><br>• 1/9 = 0.111...<br>• 2/9 = 0.222...<br>• 1/7 = 0.142857142857... (period of 6 digits!)<br>• 1/11 = 0.090909...<br>• 1/99 = 0.010101...<br><br><b>Interesting Pattern:</b><br>• 1/9 = 0.111..., so 9 × 0.111... = 0.999... = 1 (yes, 0.999... = 1!)<br><br><b>Problem-Solving with Decimals:</b><br>Type 1: Multi-step problems<br>A shopkeeper buys 12.5 kg of rice at Rs. 42.40/kg and sells at Rs. 48.60/kg.<br>Cost = 12.5 × 42.40 = Rs. 530<br>Selling = 12.5 × 48.60 = Rs. 607.50<br>Profit = 607.50 - 530 = Rs. 77.50<br><br>Type 2: Estimation and checking<br>Is 3.7 × 2.8 closer to 10 or 11? Estimate: 4 × 3 = 12, so answer ≈ 10.36<br><br><b>Decimal Representations of Common Values:</b><br>• π ≈ 3.14159<br>• √2 ≈ 1.414<br>• √3 ≈ 1.732<br>• e ≈ 2.718<br><br><b>Practice Tip:</b> Always estimate your answer before calculating with decimals. This helps catch errors in decimal point placement."}], "questions": [{"q": "0.3 x 0.4 = ?", "options": ["0.12", "1.2", "12", "0.012"], "answer": 0}, {"q": "4.8 / 0.2 = ?", "options": ["2.4", "24", "0.24", "240"], "answer": 1}, {"q": "3.456 x 100 = ?", "options": ["34.56", "345.6", "3456", "0.03456"], "answer": 1}, {"q": "15.6 / 3 = ?", "options": ["5.2", "52", "0.52", "5.02"], "answer": 0}, {"q": "0.06 x 0.7 = ?", "options": ["0.42", "0.042", "4.2", "0.0042"], "answer": 1}, {"q": "345.6 / 100 = ?", "options": ["34.56", "3.456", "0.3456", "3456"], "answer": 1}, {"q": "2.5 x 4 = ?", "options": ["10", "1.0", "100", "6.5"], "answer": 0}, {"q": "7.5 / 2.5 = ?", "options": ["3", "30", "0.3", "5"], "answer": 0}, {"q": "How many decimal places in 0.3 x 0.04?", "options": ["1", "2", "3", "4"], "answer": 2}, {"q": "1.2 x 3.5 = ?", "options": ["42", "4.2", "0.42", "4.20"], "answer": 1}, {"q": "0.45 / 5 = ?", "options": ["0.9", "0.09", "9", "0.009"], "answer": 1}, {"q": "Area of room 4.5m x 3.2m = ?", "options": ["7.7 m²", "14.4 m²", "144 m²", "1.44 m²"], "answer": 1}, {"q": "3.6 / 0.04 = ?", "options": ["9", "90", "0.9", "900"], "answer": 1}, {"q": "0.1 x 0.01 = ?", "options": ["0.01", "0.001", "0.1", "0.0001"], "answer": 1}, {"q": "1/9 as a decimal is:", "options": ["0.1", "0.111...", "0.9", "0.19"], "answer": 1}, {"q": "67.50 / 2.5 = ?", "options": ["2.7", "27", "270", "0.27"], "answer": 1}, {"q": "0.75 x 8 = ?", "options": ["6", "60", "0.6", "6.0"], "answer": 0}, {"q": "2.5 kg at Rs. 80/kg costs:", "options": ["Rs. 200", "Rs. 82.50", "Rs. 77.50", "Rs. 32"], "answer": 0}, {"q": "0.999... (repeating) equals:", "options": ["Less than 1", "Exactly 1", "More than 1", "Undefined"], "answer": 1}, {"q": "3/8 as decimal:", "options": ["0.38", "0.375", "0.3", "0.83"], "answer": 1}, {"q": "Estimate 3.7 x 2.8:", "options": ["About 6", "About 10", "About 12", "About 8"], "answer": 2}, {"q": "12.5 x 0.8 = ?", "options": ["100", "10", "1.0", "10.0"], "answer": 1}, {"q": "0.01 x 0.01 = ?", "options": ["0.01", "0.001", "0.0001", "0.1"], "answer": 2}, {"q": "Rs. 457.50 / 3 = ?", "options": ["Rs. 150", "Rs. 152.50", "Rs. 155", "Rs. 145.50"], "answer": 1}, {"q": "1/7 has a repeating period of:", "options": ["1 digit", "3 digits", "6 digits", "7 digits"], "answer": 2}, {"q": "5.6 x 10 = ?", "options": ["0.56", "56", "560", "5.60"], "answer": 1}, {"q": "8.4 / 0.7 = ?", "options": ["1.2", "12", "120", "0.12"], "answer": 1}, {"q": "0.5 x 0.5 = ?", "options": ["0.25", "2.5", "0.025", "1.0"], "answer": 0}, {"q": "1/11 as decimal:", "options": ["0.11", "0.0909...", "0.111...", "0.99"], "answer": 1}, {"q": "Profit = selling - cost. If cost = Rs. 530 and selling = Rs. 607.50:", "options": ["Rs. 77.50", "Rs. 137.50", "Rs. 1137.50", "Rs. 77"], "answer": 0}, {"q": "6.3 / 0.9 = ?", "options": ["7", "70", "0.7", "63"], "answer": 0}, {"q": "0.2 x 0.2 x 0.2 = ?", "options": ["0.6", "0.06", "0.008", "0.8"], "answer": 2}, {"q": "4.56 x 1000 = ?", "options": ["45.6", "456", "4560", "45600"], "answer": 2}, {"q": "Which is larger: 0.5 x 0.5 or 0.5 + 0.5?", "options": ["0.5 x 0.5", "0.5 + 0.5", "They are equal", "Cannot compare"], "answer": 1}, {"q": "9.9 / 0.3 = ?", "options": ["3.3", "33", "330", "0.33"], "answer": 1}, {"q": "√2 as decimal (approx):", "options": ["1.414", "1.732", "2.236", "1.000"], "answer": 0}, {"q": "0.125 x 8 = ?", "options": ["1", "10", "0.1", "100"], "answer": 0}, {"q": "The decimal places in a product = sum of decimal places in:", "options": ["Only first number", "Only second number", "Both numbers", "Neither"], "answer": 2}, {"q": "4.5 km/hr for 2.5 hours = ? km", "options": ["7.0", "11.25", "2.0", "18"], "answer": 1}, {"q": "0.04 x 25 = ?", "options": ["1", "10", "100", "0.1"], "answer": 0}]}, {"id": 13, "number": "13", "title": "Connecting the Dots", "description": "Understanding data handling through pictographs, bar graphs, tally marks, and interpreting real-world data", "topics": [{"name": "13.1 Collecting and Organising Data", "content": "Data is raw information collected from observations, surveys, or experiments. Organising data makes it easier to understand and draw conclusions.<br><br><b>What is Data?</b><br>Data is a collection of facts, numbers, or information gathered for a purpose. Examples:<br>• Heights of students in a class<br>• Marks scored in a test<br>• Favourite fruits of 30 children<br>• Temperature recorded over a week<br><br><b>Types of Data:</b><br>• <b>Qualitative (Categorical):</b> Describes qualities - colours, names, types (e.g., favourite sport)<br>• <b>Quantitative (Numerical):</b> Describes quantities using numbers (e.g., height, weight, marks)<br><br><b>Collecting Data:</b><br>• <b>Survey:</b> Asking people questions (How many siblings do you have?)<br>• <b>Observation:</b> Recording what you see (counting vehicles on a road)<br>• <b>Experiment:</b> Performing tests and recording results (tossing a coin 50 times)<br><br><b>Organising Data - Tally Marks:</b><br>Tally marks help count data efficiently:<br>• | = 1, || = 2, ||| = 3, |||| = 4, ⃠ = 5 (cross the four with a diagonal)<br><br><b>Frequency Table:</b><br>A table showing how often each value appears:<br>Fruit | Tally | Frequency<br>Apple | |||| ||| | 8<br>Banana | |||| | 5<br>Orange | |||| || | 7<br><br><b>Practice Tip:</b> When collecting data, always be clear about what you're measuring and keep your records organized from the start."}, {"name": "13.2 Pictographs and Bar Graphs", "content": "Visual representations of data make patterns and comparisons much easier to understand than raw numbers. Pictographs and bar graphs are two fundamental types.<br><br><b>Pictographs:</b><br>Use pictures or symbols to represent data. Each picture represents a fixed number of items.<br>• Key: 🍎 = 10 apples<br>• Monday: 🍎🍎🍎 = 30 apples sold<br>• Half symbol means half the value: 🍎🍎½ = 25 apples<br><br><b>Creating a Pictograph:</b><br>1. Choose an appropriate symbol<br>2. Decide the scale (each symbol = how many?)<br>3. Draw the correct number of symbols for each category<br>4. Include a key/legend<br><br><b>Bar Graphs:</b><br>Use rectangular bars to represent data. The height (or length) of each bar shows the frequency/value.<br><br><b>Rules for Bar Graphs:</b><br>• All bars should have equal width<br>• Equal gaps between bars<br>• The scale on the y-axis should be uniform<br>• Label both axes clearly<br>• Give the graph a title<br><br><b>Reading Bar Graphs:</b><br>• Compare bar heights to compare values<br>• The tallest bar shows the maximum value<br>• The shortest bar shows the minimum value<br>• The difference in heights shows the difference in values<br><br><b>Pictograph vs Bar Graph:</b><br>• Pictographs are visually appealing but less precise<br>• Bar graphs are more precise and can handle larger data ranges<br>• Both are good for comparing categories<br><br><b>Practice Tip:</b> When drawing bar graphs, always start the y-axis from 0 to avoid misleading representations. A break symbol (//) can be used if values are very large."}, {"name": "13.3 Drawing Conclusions from Data", "content": "The real power of data handling lies in interpreting graphs and drawing meaningful conclusions that help in decision-making.<br><br><b>Types of Questions to Ask:</b><br>• What is the most common/popular item? (Mode)<br>• What is the total? (Sum of all values)<br>• What is the average? (Sum ÷ number of items)<br>• What is the range? (Maximum - Minimum)<br>• Are there any trends or patterns?<br><br><b>Mean (Average):</b><br>Sum of all values ÷ Number of values<br>Example: Marks 45, 67, 89, 56, 78<br>Mean = (45+67+89+56+78) ÷ 5 = 335 ÷ 5 = 67<br><br><b>Mode:</b><br>The value that appears most frequently<br>Data: 3, 5, 7, 5, 8, 5, 9 → Mode = 5 (appears 3 times)<br><br><b>Range:</b><br>Maximum value - Minimum value<br>Data: 12, 45, 23, 67, 34 → Range = 67 - 12 = 55<br><br><b>Making Predictions:</b><br>If ice cream sales increase every summer, we can predict high sales next summer too.<br>If a student's marks show an upward trend, they are likely improving.<br><br><b>Misleading Graphs:</b><br>Watch out for:<br>• Y-axis not starting from 0 (makes differences look bigger)<br>• Unequal bar widths<br>• Inappropriate scale<br>• Missing labels<br><br><b>Real-World Applications:</b><br>• Election results displayed as bar graphs<br>• Weather forecasts use data analysis<br>• Sports statistics help teams strategize<br>• Business decisions based on sales data<br><br><b>Practice Tip:</b> Always check the scale and labels before interpreting any graph. A graph without proper labels can be misleading!"}], "questions": [{"q": "In a pictograph, if one symbol = 5, three symbols mean:", "options": ["3", "5", "15", "8"], "answer": 2}, {"q": "In a bar graph, the height of a bar represents:", "options": ["The category", "The frequency/value", "The width", "The colour"], "answer": 1}, {"q": "Tally marks for 7: |||| ||", "options": ["True", "False", "Incomplete", "Wrong format"], "answer": 0}, {"q": "Mean of 10, 20, 30 is:", "options": ["10", "20", "30", "60"], "answer": 1}, {"q": "Mode of 3, 5, 5, 7, 5, 8 is:", "options": ["3", "5", "7", "8"], "answer": 1}, {"q": "Range of 12, 45, 23, 67, 34 is:", "options": ["33", "45", "55", "67"], "answer": 2}, {"q": "In a bar graph, bars should have:", "options": ["Different widths", "Equal widths", "No gaps", "Random widths"], "answer": 1}, {"q": "Qualitative data is:", "options": ["Numbers", "Categories/qualities", "Always large", "Always small"], "answer": 1}, {"q": "If pictograph shows 2.5 symbols and 1 symbol = 10, the value is:", "options": ["2.5", "10", "25", "12.5"], "answer": 2}, {"q": "A frequency table shows:", "options": ["How often each value appears", "The total of data", "Only the average", "Only the maximum"], "answer": 0}, {"q": "The y-axis in a bar graph should start from:", "options": ["1", "10", "0", "Any number"], "answer": 2}, {"q": "Mean of 5 numbers that sum to 100:", "options": ["5", "10", "20", "50"], "answer": 2}, {"q": "Which is NOT a way to collect data?", "options": ["Survey", "Observation", "Guessing", "Experiment"], "answer": 2}, {"q": "In a pictograph, the key tells us:", "options": ["The title", "What each symbol represents", "The total", "The date"], "answer": 1}, {"q": "Tally marks for 13:", "options": ["|||| |||| |||", "|||| |||| ||", "13 lines", "|||| ||||||| |"], "answer": 0}, {"q": "A misleading graph might have:", "options": ["Y-axis not from 0", "Equal bars", "Proper labels", "Correct scale"], "answer": 0}, {"q": "Data: 4, 7, 4, 8, 4, 9. Mode = ?", "options": ["4", "7", "8", "9"], "answer": 0}, {"q": "Pictographs are best for:", "options": ["Exact values", "Visual comparison of categories", "Showing trends", "Complex data"], "answer": 1}, {"q": "Mean = ?", "options": ["Most frequent", "Middle value", "Sum/Count", "Max - Min"], "answer": 2}, {"q": "Which graph uses rectangular bars?", "options": ["Pie chart", "Pictograph", "Bar graph", "Line graph"], "answer": 2}, {"q": "Range tells us:", "options": ["The average", "The spread of data", "The most common value", "The total"], "answer": 1}, {"q": "If tallies show |||| |||| |||| |, the count is:", "options": ["14", "15", "16", "17"], "answer": 2}, {"q": "Bar graphs are more precise than pictographs because:", "options": ["They use colours", "Exact values can be read from scale", "They are bigger", "They use pictures"], "answer": 1}, {"q": "Average marks of 3 students: 80, 90, 70 = ?", "options": ["70", "80", "90", "240"], "answer": 1}, {"q": "A survey is:", "options": ["Asking people questions", "A type of graph", "A mathematical formula", "A tally mark"], "answer": 0}, {"q": "Temperature data over a week is best shown using:", "options": ["Pictograph", "Bar graph", "Both work", "Neither"], "answer": 2}, {"q": "If mode = 5 and data is 3, 5, 5, 7, x, the value of x could be:", "options": ["Only 5", "Any number except 3 or 7", "3 or 7 or any other number", "Both A and C work"], "answer": 3}, {"q": "Total students if mean = 25 and count = 4:", "options": ["25", "50", "100", "6.25"], "answer": 2}, {"q": "What does a half-symbol in a pictograph represent?", "options": ["Nothing", "Half the key value", "Double the key value", "Error"], "answer": 1}, {"q": "Mean of 0, 10, 0, 10, 0 is:", "options": ["0", "4", "5", "10"], "answer": 1}, {"q": "Which is categorical data?", "options": ["Heights of students", "Favourite colours", "Test scores", "Weight of bags"], "answer": 1}, {"q": "Bars in a bar graph must have:", "options": ["Equal gaps between them", "No gaps", "Overlapping bars", "Random gaps"], "answer": 0}, {"q": "If 50 coins are tossed and 23 show heads, frequency of heads:", "options": ["23", "27", "50", "0.46"], "answer": 0}, {"q": "Data: 10, 20, 30, 40, 50. Range = ?", "options": ["10", "30", "40", "50"], "answer": 2}, {"q": "A graph title should describe:", "options": ["The colours used", "What the graph is about", "Who made it", "When it was made"], "answer": 1}, {"q": "Mean of 6, 6, 6, 6 is:", "options": ["4", "6", "24", "12"], "answer": 1}, {"q": "Which can show exact values: pictograph or bar graph?", "options": ["Pictograph", "Bar graph", "Both equally", "Neither"], "answer": 1}, {"q": "Data: 1, 2, 3, 4, 5. Mean = Median = ?", "options": ["1", "2", "3", "5"], "answer": 2}, {"q": "An upward trend in marks means:", "options": ["Marks are decreasing", "Marks are improving", "Marks are constant", "Data is wrong"], "answer": 1}, {"q": "How many tally groups in 23? (groups of 5)", "options": ["4 groups + 3", "5 groups", "3 groups + 8", "23 groups"], "answer": 0}]}, {"id": 14, "number": "14", "title": "Constructions and Tilings", "description": "Geometric constructions with ruler and compass, tessellations, tiling patterns, and understanding which shapes can tile a plane", "topics": [{"name": "14.1 Geometric Constructions", "content": "Geometric constructions use only a ruler (straightedge) and compass - no measuring of lengths or angles. These ancient techniques reveal deep mathematical truths.<br><br><b>Why Ruler and Compass Only?</b><br>Ancient Greek mathematicians believed that the purest geometric constructions should use only these two tools. This limitation actually leads to deeper understanding of geometry!<br><br><b>Basic Constructions:</b><br><br><b>1. Perpendicular Bisector of a Line Segment:</b><br>Given AB:<br>a) Open compass more than half of AB<br>b) With centre A, draw arcs above and below AB<br>c) With centre B, same radius, draw arcs intersecting the first ones<br>d) Connect the two intersection points - this line is the perpendicular bisector<br>Properties: Every point on it is equidistant from A and B<br><br><b>2. Angle Bisector:</b><br>Given angle PQR:<br>a) With centre Q, draw an arc cutting both rays at points A and B<br>b) With centres A and B (equal radius), draw arcs intersecting at point C<br>c) QC is the angle bisector<br><br><b>3. Constructing 60° Angle:</b><br>Draw a ray, open compass to any radius, draw arc from endpoint, then from where arc meets ray draw another arc with same radius. Connect = 60°<br><br><b>4. Constructing 90° Angle:</b><br>First construct 60°, then bisect 60° to get 30°, and construct 60° + 30° = 90°.<br>Or: Use the perpendicular bisector method at the endpoint of a ray.<br><br><b>Practice Tip:</b> Never change the compass width in the middle of a construction unless the step specifically requires it. Many construction errors come from accidental compass width changes."}, {"name": "14.2 Tessellations and Tiling Patterns", "content": "A tessellation (or tiling) is a pattern of shapes that covers a flat surface completely with no gaps and no overlaps. Understanding which shapes tessellate reveals important geometric properties.<br><br><b>What is a Tessellation?</b><br>A tessellation covers a plane completely using one or more shapes, with:<br>• No gaps between shapes<br>• No overlapping of shapes<br>• The pattern can continue infinitely<br><br><b>Regular Tessellations:</b><br>Using only ONE type of regular polygon:<br>• <b>Equilateral triangles:</b> Yes! (6 meet at each vertex, 6×60° = 360°)<br>• <b>Squares:</b> Yes! (4 meet at each vertex, 4×90° = 360°)<br>• <b>Regular hexagons:</b> Yes! (3 meet at each vertex, 3×120° = 360°)<br>• Regular pentagons, heptagons, etc.: NO! (their angles don't add to 360°)<br><br><b>The Key Rule:</b><br>Shapes tessellate if the angles meeting at each vertex add up to exactly 360°.<br><br><b>Semi-Regular Tessellations:</b><br>Using TWO or more types of regular polygons:<br>• Squares + equilateral triangles<br>• Hexagons + equilateral triangles<br>• There are exactly 8 semi-regular tessellations<br><br><b>Tessellations in Real Life:</b><br>• Floor tiles (squares, hexagons)<br>• Honeycomb (hexagons)<br>• Brick walls (rectangles offset)<br>• Islamic art patterns<br>• M.C. Escher's famous artwork<br><br><b>Non-Regular Tessellations:</b><br>• Any triangle can tessellate! (rotate and flip to fill gaps)<br>• Any quadrilateral can tessellate!<br>• Most pentagons CANNOT tessellate (only 15 known types can)<br><br><b>Practice Tip:</b> To test if a shape tessellates, check if copies of it can surround a single point with angles adding to 360°."}], "questions": [{"q": "A perpendicular bisector of AB passes through:", "options": ["Point A", "Point B", "Midpoint of AB", "None of these"], "answer": 2}, {"q": "Geometric constructions use only:", "options": ["Ruler and protractor", "Ruler and compass", "Protractor and compass", "Set square and ruler"], "answer": 1}, {"q": "Which regular polygon can tessellate?", "options": ["Pentagon", "Hexagon", "Octagon", "Heptagon"], "answer": 1}, {"q": "Angles at a vertex in a tessellation must add to:", "options": ["180°", "270°", "360°", "90°"], "answer": 2}, {"q": "To construct 60°, we use:", "options": ["Protractor", "Equilateral triangle construction", "Set square", "Ruler only"], "answer": 1}, {"q": "How many regular tessellations exist?", "options": ["1", "2", "3", "Infinite"], "answer": 2}, {"q": "An angle bisector divides an angle into:", "options": ["Unequal parts", "Two equal parts", "Three equal parts", "Random parts"], "answer": 1}, {"q": "Can any triangle tessellate?", "options": ["Yes", "Only equilateral", "Only right triangles", "No"], "answer": 0}, {"q": "Every point on perpendicular bisector of AB is:", "options": ["Closer to A", "Closer to B", "Equidistant from A and B", "On segment AB"], "answer": 2}, {"q": "4 squares meet at a vertex: 4 x 90° = ?", "options": ["270°", "360°", "450°", "180°"], "answer": 1}, {"q": "Regular pentagons cannot tessellate because:", "options": ["They are too small", "Interior angle (108°) doesn't divide 360° evenly", "They have 5 sides", "They are curved"], "answer": 1}, {"q": "A tessellation has:", "options": ["Gaps between shapes", "Overlapping shapes", "No gaps and no overlaps", "Only triangles"], "answer": 2}, {"q": "To bisect an angle, we need:", "options": ["Only a ruler", "Only a compass", "Ruler and compass", "A protractor"], "answer": 2}, {"q": "Honeycomb cells are shaped like:", "options": ["Squares", "Triangles", "Hexagons", "Pentagons"], "answer": 2}, {"q": "How many equilateral triangles meet at a vertex in tessellation?", "options": ["3", "4", "5", "6"], "answer": 3}, {"q": "Can any quadrilateral tessellate?", "options": ["Yes", "Only rectangles", "Only squares", "No"], "answer": 0}, {"q": "The interior angle of a regular hexagon is:", "options": ["90°", "100°", "108°", "120°"], "answer": 3}, {"q": "Semi-regular tessellations use:", "options": ["One type of polygon", "Two or more types", "Only triangles", "Only curved shapes"], "answer": 1}, {"q": "Constructing a perpendicular bisector: compass opening should be:", "options": ["Equal to AB", "Less than half AB", "More than half AB", "Exactly half AB"], "answer": 2}, {"q": "M.C. Escher is famous for:", "options": ["Algebra", "Tessellation art", "Statistics", "Calculus"], "answer": 1}, {"q": "How many semi-regular tessellations exist?", "options": ["3", "5", "8", "Infinite"], "answer": 2}, {"q": "Which shapes tile a bathroom floor?", "options": ["Squares", "Regular pentagons", "Regular heptagons", "Regular octagons alone"], "answer": 0}, {"q": "To construct 30°, first construct:", "options": ["90° and bisect", "60° and bisect", "45° and bisect", "120° and bisect"], "answer": 1}, {"q": "3 regular hexagons at a vertex: 3 x 120° = ?", "options": ["240°", "300°", "360°", "480°"], "answer": 2}, {"q": "A straightedge differs from ruler because it has:", "options": ["Markings", "No markings", "A compass", "A protractor"], "answer": 1}, {"q": "Brick walls are an example of:", "options": ["Regular tessellation", "Semi-regular tessellation", "Non-regular tessellation", "Not a tessellation"], "answer": 2}, {"q": "Interior angle of equilateral triangle:", "options": ["45°", "60°", "90°", "120°"], "answer": 1}, {"q": "Can regular octagons alone tessellate?", "options": ["Yes", "No (135° doesn't divide 360°)", "Only with squares", "Sometimes"], "answer": 1}, {"q": "The 3 regular tessellating shapes are:", "options": ["Triangle, square, pentagon", "Triangle, square, hexagon", "Square, pentagon, hexagon", "Triangle, pentagon, hexagon"], "answer": 1}, {"q": "Constructing 90° can be done by:", "options": ["Constructing perpendicular", "Bisecting 180°", "Both A and B", "Neither"], "answer": 2}, {"q": "Islamic art commonly features:", "options": ["Random patterns", "Geometric tessellations", "Only circles", "No patterns"], "answer": 1}, {"q": "To construct 45°:", "options": ["Construct 90° and bisect", "Construct 60° and subtract 15°", "Draw a diagonal", "Use protractor only"], "answer": 0}, {"q": "A tessellation can extend:", "options": ["Only to the edge of paper", "Infinitely", "Only 10 times", "Only in one direction"], "answer": 1}, {"q": "Interior angle of a square:", "options": ["60°", "90°", "120°", "150°"], "answer": 1}, {"q": "In a construction, compass is used to:", "options": ["Measure angles", "Draw straight lines", "Draw arcs and circles", "Erase lines"], "answer": 2}, {"q": "How many known pentagon types can tessellate?", "options": ["0", "5", "15", "All of them"], "answer": 2}, {"q": "Perpendicular bisector is also the ___ of symmetry:", "options": ["Line", "Point", "Angle", "Curve"], "answer": 0}, {"q": "Octagons + squares can tessellate together:", "options": ["True", "False", "Only if equal sizes", "Only special octagons"], "answer": 0}, {"q": "The angle bisector of 120° creates two angles of:", "options": ["30° each", "45° each", "60° each", "90° each"], "answer": 2}, {"q": "Floor tiles are a real-world example of:", "options": ["Fractals", "Tessellations", "Symmetry only", "Congruence only"], "answer": 1}]}, {"id": 15, "number": "15", "title": "Finding the Unknown", "description": "Introduction to equations - forming equations, solving simple equations, balancing method, and word problems using equations", "topics": [{"name": "15.1 What is an Equation?", "content": "An equation is a mathematical statement that says two things are equal. It always has an equals sign (=) and often has an unknown value we need to find.<br><br><b>Expression vs Equation:</b><br>• Expression: 3x + 5 (no equals sign, represents a value)<br>• Equation: 3x + 5 = 20 (has equals sign, can be solved)<br><br><b>Parts of an Equation:</b><br>• Left Hand Side (LHS): The expression on the left of =<br>• Right Hand Side (RHS): The expression on the right of =<br>• In 3x + 5 = 20: LHS = 3x + 5, RHS = 20<br><br><b>Solution of an Equation:</b><br>The value of the variable that makes LHS = RHS<br>• In x + 3 = 7: x = 4 (because 4 + 3 = 7 ✓)<br>• In 2y = 10: y = 5 (because 2 × 5 = 10 ✓)<br><br><b>Forming Equations from Word Problems:</b><br>• 'A number plus 5 equals 12' → x + 5 = 12<br>• 'Twice a number is 18' → 2x = 18<br>• 'Three more than double a number is 17' → 2x + 3 = 17<br>• 'Ravi's age after 5 years will be 20' → x + 5 = 20<br><br><b>The Balance Model:</b><br>Think of an equation as a balance scale. Both sides must be equal (balanced). Whatever you do to one side, you must do to the other to keep it balanced.<br><br><b>Practice Tip:</b> To verify your solution, always substitute it back into the original equation and check if LHS = RHS."}, {"name": "15.2 Solving Simple Equations", "content": "Solving an equation means finding the value of the unknown variable that makes the equation true. We use inverse operations to isolate the variable.<br><br><b>The Balancing Method:</b><br>Whatever operation you perform on one side, you must perform on the other:<br>• Add the same number to both sides<br>• Subtract the same number from both sides<br>• Multiply both sides by the same number<br>• Divide both sides by the same number<br><br><b>Solving One-Step Equations:</b><br>• x + 5 = 12 → x + 5 - 5 = 12 - 5 → x = 7<br>• x - 3 = 8 → x - 3 + 3 = 8 + 3 → x = 11<br>• 3x = 15 → 3x/3 = 15/3 → x = 5<br>• x/4 = 6 → x/4 × 4 = 6 × 4 → x = 24<br><br><b>Solving Two-Step Equations:</b><br>• 2x + 3 = 11<br>  Step 1: Subtract 3: 2x = 8<br>  Step 2: Divide by 2: x = 4<br>  Check: 2(4) + 3 = 8 + 3 = 11 ✓<br><br>• 3x - 7 = 14<br>  Step 1: Add 7: 3x = 21<br>  Step 2: Divide by 3: x = 7<br>  Check: 3(7) - 7 = 21 - 7 = 14 ✓<br><br><b>Inverse Operations:</b><br>• Addition ↔ Subtraction (they undo each other)<br>• Multiplication ↔ Division (they undo each other)<br><br><b>Common Mistakes:</b><br>• Performing operation on only one side<br>• Using the wrong inverse operation<br>• Not checking the answer<br><br><b>Practice Tip:</b> Always work systematically - first remove any constant added/subtracted, then handle the multiplication/division."}, {"name": "15.3 Applications of Equations", "content": "Equations are one of the most powerful tools in mathematics. They let us solve real-world problems by converting words into mathematical statements.<br><br><b>Age Problems:</b><br>• Ravi is 5 years older than Sita. Their ages add to 25. Find their ages.<br>  Let Sita's age = x. Then Ravi's age = x + 5.<br>  x + (x + 5) = 25 → 2x + 5 = 25 → 2x = 20 → x = 10<br>  Sita = 10, Ravi = 15<br><br><b>Number Problems:</b><br>• Three consecutive numbers add to 36. Find them.<br>  Let numbers be n, n+1, n+2<br>  n + (n+1) + (n+2) = 36 → 3n + 3 = 36 → 3n = 33 → n = 11<br>  Numbers: 11, 12, 13<br><br><b>Geometry Problems:</b><br>• Perimeter of rectangle is 40 cm. Length is 3 times the breadth. Find dimensions.<br>  Let breadth = x. Length = 3x.<br>  2(x + 3x) = 40 → 2(4x) = 40 → 8x = 40 → x = 5<br>  Breadth = 5 cm, Length = 15 cm<br><br><b>Money Problems:</b><br>• A pen costs Rs. 5 more than a pencil. 3 pens and 2 pencils cost Rs. 55. Find the cost of each.<br>  Let pencil cost = x. Pen cost = x + 5.<br>  3(x+5) + 2x = 55 → 3x + 15 + 2x = 55 → 5x = 40 → x = 8<br>  Pencil = Rs. 8, Pen = Rs. 13<br><br><b>Steps for Word Problems:</b><br>1. Read carefully. What is unknown?<br>2. Let the unknown = x<br>3. Write other quantities in terms of x<br>4. Form the equation from the given condition<br>5. Solve the equation<br>6. Check: Does the answer make sense?<br><br><b>Practice Tip:</b> The hardest part is forming the equation, not solving it. Practice translating English sentences into mathematical equations every day!"}], "questions": [{"q": "In x + 5 = 12, x = ?", "options": ["5", "7", "12", "17"], "answer": 1}, {"q": "An equation has:", "options": ["No equals sign", "An equals sign", "Only numbers", "Only letters"], "answer": 1}, {"q": "If 2x = 18, then x = ?", "options": ["9", "16", "20", "36"], "answer": 0}, {"q": "The LHS of 3x + 5 = 20 is:", "options": ["3x", "5", "3x + 5", "20"], "answer": 2}, {"q": "'A number plus 5 equals 12' as equation:", "options": ["x - 5 = 12", "x + 5 = 12", "5x = 12", "x/5 = 12"], "answer": 1}, {"q": "If x - 3 = 8, then x = ?", "options": ["5", "8", "11", "24"], "answer": 2}, {"q": "Solve: 2x + 3 = 11", "options": ["x = 3", "x = 4", "x = 7", "x = 14"], "answer": 1}, {"q": "The inverse of addition is:", "options": ["Multiplication", "Division", "Subtraction", "Addition"], "answer": 2}, {"q": "If x/4 = 6, then x = ?", "options": ["2", "10", "24", "1.5"], "answer": 2}, {"q": "Solve: 3x - 7 = 14", "options": ["x = 3", "x = 7", "x = 21", "x = 63"], "answer": 1}, {"q": "'Twice a number is 18' means:", "options": ["x + 2 = 18", "x - 2 = 18", "2x = 18", "x/2 = 18"], "answer": 2}, {"q": "If 5x = 0, then x = ?", "options": ["5", "-5", "0", "Undefined"], "answer": 2}, {"q": "3 consecutive numbers add to 36. Smallest is:", "options": ["10", "11", "12", "13"], "answer": 1}, {"q": "In the balance model, to keep balance we must:", "options": ["Do same thing to both sides", "Only change LHS", "Only change RHS", "Do nothing"], "answer": 0}, {"q": "Solve: x/3 + 2 = 7", "options": ["x = 3", "x = 15", "x = 27", "x = 5"], "answer": 1}, {"q": "Perimeter of square = 4x. If perimeter = 24, side = ?", "options": ["4", "6", "8", "24"], "answer": 1}, {"q": "If 4x + 5 = 25, then x = ?", "options": ["5", "7.5", "20", "30"], "answer": 0}, {"q": "Ravi is x years old. In 5 years he'll be:", "options": ["x - 5", "x + 5", "5x", "x/5"], "answer": 1}, {"q": "Solve: 7x = 49", "options": ["x = 6", "x = 7", "x = 42", "x = 56"], "answer": 1}, {"q": "If x + x + x = 27, then x = ?", "options": ["3", "9", "27", "81"], "answer": 1}, {"q": "Pen costs Rs. 5 more than pencil (x). Pen cost:", "options": ["5x", "x - 5", "x + 5", "x/5"], "answer": 2}, {"q": "Solve: 2(x + 3) = 16", "options": ["x = 5", "x = 6.5", "x = 8", "x = 10"], "answer": 0}, {"q": "If the sum of two numbers is 20 and one is 8, the other is:", "options": ["8", "12", "20", "28"], "answer": 1}, {"q": "Solve: 5x - 10 = 30", "options": ["x = 4", "x = 6", "x = 8", "x = 40"], "answer": 2}, {"q": "Length = 3 x breadth. If breadth = x, perimeter = ?", "options": ["4x", "6x", "8x", "12x"], "answer": 2}, {"q": "If 3(x + 5) = 24, then x = ?", "options": ["3", "8", "13", "19"], "answer": 0}, {"q": "Check: Is x = 3 a solution of 2x + 1 = 7?", "options": ["Yes (7 = 7)", "No (5 ≠ 7)", "No (6 ≠ 7)", "Cannot determine"], "answer": 0}, {"q": "A number doubled and increased by 3 gives 15. The number:", "options": ["6", "7.5", "9", "12"], "answer": 0}, {"q": "Solve: x/2 - 3 = 7", "options": ["x = 8", "x = 14", "x = 20", "x = 2"], "answer": 2}, {"q": "Ages: Sister is x, brother is x+4. Sum = 24. x = ?", "options": ["8", "10", "12", "14"], "answer": 1}, {"q": "If 6x + 12 = 6, then x = ?", "options": ["0", "-1", "1", "3"], "answer": 1}, {"q": "Which is an equation?", "options": ["3x + 5", "3x + 5 = 20", "3 + 5 + x", "3x"], "answer": 1}, {"q": "Solve: 4(x - 2) = 20", "options": ["x = 3", "x = 5", "x = 7", "x = 22"], "answer": 2}, {"q": "Cost of 5 pens = Rs. 75. Cost of 1 pen:", "options": ["Rs. 10", "Rs. 15", "Rs. 70", "Rs. 375"], "answer": 1}, {"q": "If x = 2 satisfies 3x + a = 10, then a = ?", "options": ["2", "3", "4", "5"], "answer": 2}, {"q": "Solve: 10 - 2x = 4", "options": ["x = 2", "x = 3", "x = 7", "x = 14"], "answer": 1}, {"q": "Sum of two consecutive even numbers is 34. They are:", "options": ["15, 19", "16, 18", "14, 20", "12, 22"], "answer": 1}, {"q": "If 3x + 2x = 25, then x = ?", "options": ["3", "4", "5", "25"], "answer": 2}, {"q": "Rectangle: length = 2x+1, breadth = x. Perimeter = 32. x = ?", "options": ["3", "4", "5", "6"], "answer": 2}, {"q": "The first step to solve 2x + 6 = 20 is to:", "options": ["Divide by 2", "Subtract 6 from both sides", "Add 6 to both sides", "Multiply by 2"], "answer": 1}]}];

const finalExamQuestions = {
    mcq: [
        { q: "What is the next number: 3, 6, 9, 12, ?", options: ["14", "15", "16", "18"], answer: 1, chapter: 1 },
        { q: "An angle of 45° is:", options: ["Acute", "Right", "Obtuse", "Reflex"], answer: 0, chapter: 2 },
        { q: "The place value of 7 in 47,832 is:", options: ["7", "70", "700", "7000"], answer: 3, chapter: 3 },
        { q: "In a pictograph, if 1 symbol = 10, then 5 symbols = ?", options: ["15", "50", "100", "5"], answer: 1, chapter: 4 },
        { q: "The smallest prime number is:", options: ["0", "1", "2", "3"], answer: 2, chapter: 5 },
        { q: "Perimeter of square with side 9 cm:", options: ["18 cm", "27 cm", "36 cm", "81 cm"], answer: 2, chapter: 6 },
        { q: "3/4 is a _____ fraction:", options: ["Proper", "Improper", "Mixed", "Unit"], answer: 0, chapter: 7 },
        { q: "Tool used to draw circles:", options: ["Ruler", "Compass", "Protractor", "Divider"], answer: 1, chapter: 8 },
        { q: "Lines of symmetry in a rectangle:", options: ["1", "2", "3", "4"], answer: 1, chapter: 9 },
        { q: "The opposite of -8 is:", options: ["-8", "0", "8", "1/8"], answer: 2, chapter: 10 },
        { q: "1, 4, 9, 16, 25 are called:", options: ["Prime numbers", "Square numbers", "Odd numbers", "Even numbers"], answer: 1, chapter: 1 },
        { q: "Two perpendicular lines form angle of:", options: ["45°", "60°", "90°", "180°"], answer: 2, chapter: 2 },
        { q: "Round 6,789 to nearest thousand:", options: ["6,000", "6,800", "7,000", "6,790"], answer: 2, chapter: 3 },
        { q: "Range of data 5, 8, 12, 3, 9 is:", options: ["5", "8", "9", "12"], answer: 2, chapter: 4 },
        { q: "Factors of 15 are:", options: ["1, 3, 5, 15", "1, 5, 15", "3, 5, 15", "1, 3, 15"], answer: 0, chapter: 5 },
        { q: "Area of rectangle 6cm × 4cm:", options: ["10 sq cm", "20 sq cm", "24 sq cm", "48 sq cm"], answer: 2, chapter: 6 },
        { q: "1/2 + 1/2 = ?", options: ["2/4", "1/4", "1", "2"], answer: 2, chapter: 7 },
        { q: "Diameter = 2 × ?", options: ["Area", "Perimeter", "Radius", "Circumference"], answer: 2, chapter: 8 },
        { q: "Equilateral triangle has _____ lines of symmetry:", options: ["1", "2", "3", "6"], answer: 2, chapter: 9 },
        { q: "-3 + 5 = ?", options: ["-8", "-2", "2", "8"], answer: 2, chapter: 10 },
        { q: "Fibonacci sequence: 1, 1, 2, 3, 5, ?", options: ["6", "7", "8", "9"], answer: 2, chapter: 1 },
        { q: "A straight angle measures:", options: ["90°", "180°", "270°", "360°"], answer: 1, chapter: 2 },
        { q: "LCM of 4 and 6 is:", options: ["2", "12", "24", "10"], answer: 1, chapter: 5 },
        { q: "If perimeter of square is 20 cm, side = ?", options: ["4 cm", "5 cm", "10 cm", "20 cm"], answer: 1, chapter: 6 },
        { q: "Which is greater: -10 or -5?", options: ["-10", "-5", "Equal", "Cannot compare"], answer: 1, chapter: 10 }
    ],
    penPaper: [
        { q: "Draw the next two shapes in pattern: Circle, Triangle, Square, Circle, Triangle, ?", marks: 15, chapter: 1 },
        { q: "A rectangular garden is 25m long and 15m wide. Find its perimeter and area.", marks: 15, chapter: 6 },
        { q: "Find prime factorization of 72 using factor tree method.", marks: 15, chapter: 5 },
        { q: "Draw a number line from -5 to 5 and mark: -4, -1, 0, 2, 4", marks: 15, chapter: 10 },
        { q: "Add: 2/5 + 1/5 + 3/5. Show your work.", marks: 15, chapter: 7 }
    ]
};

const finalExamQuestions7 = {"mcq": [{"q": "How many zeros are there in 1 lakh?", "options": ["3", "4", "5", "6"], "answer": 2, "chapter": 1}, {"q": "If you count 1 number per second, how long to count to 1 lakh?", "options": ["About 1 hour", "About 10 hours", "About 28 hours", "About 100 hours"], "answer": 2, "chapter": 1}, {"q": "What is the value of 3 + 4 x 5?", "options": ["35", "23", "60", "17"], "answer": 1, "chapter": 2}, {"q": "In the expression 4 + 3 x 2, which operation is done first?", "options": ["Addition", "Multiplication", "Either one", "None"], "answer": 1, "chapter": 2}, {"q": "What is 1/10 in decimal form?", "options": ["0.01", "0.1", "1.0", "10"], "answer": 1, "chapter": 3}, {"q": "3 m 5 cm = ___ m", "options": ["3.5", "3.05", "3.005", "35"], "answer": 1, "chapter": 3}, {"q": "If x = 3, what is 2x + 5?", "options": ["8", "11", "10", "16"], "answer": 1, "chapter": 4}, {"q": "1 x x is written as:", "options": ["1x", "x", "x1", "11x"], "answer": 1, "chapter": 4}, {"q": "When two lines intersect, vertically opposite angles are:", "options": ["Supplementary", "Equal", "Complementary", "None of these"], "answer": 1, "chapter": 5}, {"q": "Two lines perpendicular to the same line are:", "options": ["Perpendicular to each other", "Parallel to each other", "Intersecting", "None of these"], "answer": 1, "chapter": 5}, {"q": "A number divisible by 2 is called:", "options": ["Odd", "Even", "Prime", "Composite"], "answer": 1, "chapter": 6}, {"q": "Even x Even = ?", "options": ["Even", "Odd", "Cannot tell", "Prime"], "answer": 0, "chapter": 6}, {"q": "An equilateral triangle has all angles equal to:", "options": ["45°", "60°", "90°", "120°"], "answer": 1, "chapter": 7}, {"q": "In an obtuse triangle, the orthocentre lies:", "options": ["Inside", "On a vertex", "Outside", "On a side"], "answer": 2, "chapter": 7}, {"q": "2/3 x 4/5 = ?", "options": ["6/8", "8/15", "6/15", "8/8"], "answer": 1, "chapter": 8}, {"q": "Dividing by 1/4 is the same as:", "options": ["Multiplying by 4", "Dividing by 4", "Multiplying by 1/4", "Subtracting 4"], "answer": 0, "chapter": 8}, {"q": "How many lines of symmetry does a square have?", "options": ["1", "2", "4", "8"], "answer": 2, "chapter": 9}, {"q": "SSS test for congruence means:", "options": ["Side-Side-Side", "Same-Same-Same", "Similar-Similar-Similar", "Sum-Sum-Sum"], "answer": 0, "chapter": 9}, {"q": "(-3) + (-5) = ?", "options": ["-8", "8", "-2", "2"], "answer": 0, "chapter": 10}, {"q": "Negative x Negative = ?", "options": ["Negative", "Positive", "Zero", "Cannot determine"], "answer": 1, "chapter": 10}, {"q": "Is 1 a prime number?", "options": ["Yes", "No", "Sometimes", "It's special"], "answer": 1, "chapter": 11}, {"q": "LCM of 12 and 15 is:", "options": ["3", "60", "180", "30"], "answer": 1, "chapter": 11}, {"q": "0.3 x 0.4 = ?", "options": ["0.12", "1.2", "12", "0.012"], "answer": 0, "chapter": 12}, {"q": "67.50 / 2.5 = ?", "options": ["2.7", "27", "270", "0.27"], "answer": 1, "chapter": 12}, {"q": "In a pictograph, if one symbol = 5, three symbols mean:", "options": ["3", "5", "15", "8"], "answer": 2, "chapter": 13}, {"q": "A misleading graph might have:", "options": ["Y-axis not from 0", "Equal bars", "Proper labels", "Correct scale"], "answer": 0, "chapter": 13}, {"q": "A perpendicular bisector of AB passes through:", "options": ["Point A", "Point B", "Midpoint of AB", "None of these"], "answer": 2, "chapter": 14}, {"q": "Can any quadrilateral tessellate?", "options": ["Yes", "Only rectangles", "Only squares", "No"], "answer": 0, "chapter": 14}, {"q": "In x + 5 = 12, x = ?", "options": ["5", "7", "12", "17"], "answer": 1, "chapter": 15}, {"q": "Perimeter of square = 4x. If perimeter = 24, side = ?", "options": ["4", "6", "8", "24"], "answer": 1, "chapter": 15}], "penPaper": [{"q": "Write the following in Indian place value system: 45,67,89,012. Express in words and identify the place value of each digit.", "marks": 15, "chapter": 1}, {"q": "Evaluate the expression: 48 / (6 + 2) x 3 - 5. Show all steps using BODMAS.", "marks": 15, "chapter": 2}, {"q": "Convert the fraction 7/8 to a decimal. Then add it to 0.375 and show your work.", "marks": 15, "chapter": 3}, {"q": "If a rectangle has length (2x + 3) cm and breadth x cm, and its perimeter is 30 cm, find the dimensions.", "marks": 15, "chapter": 15}, {"q": "Draw two parallel lines cut by a transversal. Mark and name all 8 angles formed. Identify two pairs of alternate interior angles.", "marks": 15, "chapter": 5}]};


// Application State
let appState = {
    currentChapter: null,
    currentQuiz: null,
    currentQuestion: 0,
    score: 0,
    answers: [],
    chapterProgress: {},
    chapterScores: {},
    chapterProgress7: {},
    chapterScores7: {},
    finalExamCompleted: false,
    finalExamScore: 0,
    finalExamCompleted7: false,
    finalExamScore7: 0,
    selectedClass: localStorage.getItem('selectedClass') || null,
    studentName: localStorage.getItem('studentName') || '',
    certificates: [],
    isScreenSharing: false,
    screenShareStream: null
};

// Class-aware helper functions
function getSelectedClass() {
    return appState.selectedClass || localStorage.getItem('selectedClass') || null;
}

function getActiveChapters() {
    var cls = getSelectedClass();
    if (cls === '7') return chapters7;
    return chapters;
}

function getActiveFinalExam() {
    var cls = getSelectedClass();
    if (cls === '7') return finalExamQuestions7;
    return finalExamQuestions;
}


function getActive3DModels() {
    return getSelectedClass() === '7' ? chapter3DModels7 : chapter3DModels;
}
function getActiveChapterMedia() {
    var cls = getSelectedClass();
    if (cls === '7') return chapterMedia7;
    return chapterMedia;
}

function getChapterProgress() {
    var cls = getSelectedClass();
    if (cls === '7') return appState.chapterProgress7 || {};
    return appState.chapterProgress || {};
}

function setChapterProgress(progress) {
    var cls = getSelectedClass();
    if (cls === '7') {
        appState.chapterProgress7 = progress;
    } else {
        appState.chapterProgress = progress;
    }
    saveState();
}

function getChapterScores() {
    var cls = getSelectedClass();
    if (cls === '7') return appState.chapterScores7 || {};
    return appState.chapterScores || {};
}

function setChapterScores(scores) {
    var cls = getSelectedClass();
    if (cls === '7') {
        appState.chapterScores7 = scores;
    } else {
        appState.chapterScores = scores;
    }
    saveState();
}

function isFinalExamCompleted() {
    var cls = getSelectedClass();
    if (cls === '7') return appState.finalExamCompleted7 || false;
    return appState.finalExamCompleted || false;
}

function setFinalExamCompleted(completed, score) {
    var cls = getSelectedClass();
    if (cls === '7') {
        appState.finalExamCompleted7 = completed;
        appState.finalExamScore7 = score;
    } else {
        appState.finalExamCompleted = completed;
        appState.finalExamScore = score;
    }
    saveState();
}

function getClassTitle() {
    var cls = getSelectedClass();
    return cls === '7' ? 'NCERT CLASS VII MATHEMATICS' : 'NCERT CLASS VI MATHEMATICS';
}

function getClassName() {
    var cls = getSelectedClass();
    return cls === '7' ? 'Class 7' : 'Class 6';
}

// Class Selection Functions
function showClassSelection() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.add('hidden');
    var classPage = document.getElementById('class-selection-page');
    if (classPage) classPage.classList.remove('hidden');
}

function selectClass(cls) {
    appState.selectedClass = String(cls);
    localStorage.setItem('selectedClass', String(cls));
    saveState();
    var classPage = document.getElementById('class-selection-page');
    if (classPage) classPage.classList.add('hidden');
    showMainApp();
    updateClassUI();
    // Auto-complete all chapters for admin
    if (appState.isAdmin) {
        autoCompleteAdminProgress();
    }
}

function switchClass() {
    // Go back to class selection
    document.getElementById('main-app').classList.add('hidden');
    showClassSelection();
}

function switchClassFromProfile(cls) {
    // Close profile modal first
    var modal = document.getElementById('profile-editor-modal');
    if (modal) modal.remove();
    // Switch to the selected class directly
    selectClass(String(cls));
}

// Auto-complete all chapters for admin with 100% progress and certificates
function autoCompleteAdminProgress() {
    if (!appState.isAdmin) return;
    var cls = getSelectedClass();
    var activeChapters = getActiveChapters();
    var progress = getChapterProgress();
    var scores = getChapterScores();
    var changed = false;

    // Mark all chapters as completed with 100% score
    activeChapters.forEach(function(chapter) {
        if (progress[chapter.id] !== 'completed') {
            progress[chapter.id] = 'completed';
            changed = true;
        }
        if (!scores[chapter.id] || scores[chapter.id] < 100) {
            scores[chapter.id] = 100;
            changed = true;
        }
        // Auto-generate chapter certificate if not exists
        var certExists = appState.certificates.find(function(c) {
            return c.type === 'chapter' && c.chapterId === chapter.id && c.className === getClassName();
        });
        if (!certExists) {
            appState.certificates.push({
                type: 'chapter',
                chapterId: chapter.id,
                chapterTitle: chapter.title,
                score: 100,
                date: new Date().toLocaleDateString(),
                studentName: appState.studentName,
                className: getClassName()
            });
            changed = true;
        }
    });

    // Mark final exam as completed
    if (!isFinalExamCompleted()) {
        setFinalExamCompleted(true, 100);
        changed = true;
    }

    // Auto-generate final exam certificate if not exists
    var finalCertExists = appState.certificates.find(function(c) {
        return c.type === 'final-exam' && c.className === getClassName();
    });
    if (!finalCertExists) {
        appState.certificates.push({
            type: 'final-exam',
            score: 100,
            date: new Date().toLocaleDateString(),
            studentName: appState.studentName,
            className: getClassName()
        });
        changed = true;
    }

    // Auto-generate master certificate if not exists
    var masterCertExists = appState.certificates.find(function(c) {
        return c.type === 'master' && c.className === getClassName();
    });
    if (!masterCertExists) {
        appState.certificates.push({
            type: 'master',
            score: 100,
            chaptersCompleted: activeChapters.length,
            date: new Date().toLocaleDateString(),
            studentName: appState.studentName,
            className: getClassName()
        });
        changed = true;
    }

    // Auto-complete all basics worksheets for admin
    var basicsWS = getActiveBasicsWorksheets();
    var basicsProgress = getBasicsProgress();
    basicsWS.forEach(function(ws) {
        if (basicsProgress[ws.id] === undefined) {
            basicsProgress[ws.id] = { score: 5, total: 5, pct: 100 };
            changed = true;
        }
    });
    if (changed) {
        setBasicsProgress(basicsProgress);
    }

    if (changed) {
        setChapterProgress(progress);
        setChapterScores(scores);
        saveState();
        renderChapters();
    }
}

function updateClassUI() {
    var subtitle = document.querySelector('.title-section p');
    if (subtitle) subtitle.textContent = getClassTitle();
    var switchBtn = document.getElementById('switch-class-btn');
    if (switchBtn) switchBtn.textContent = getSelectedClass() === '7' ? 'Switch to Class 6' : 'Switch to Class 7';
    renderChapters();
}


// Shared ICE/TURN server config - fetched from backend on init, fallback to STUN only
var sharedIceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
];
(function loadIceServers() {
    var _tu = atob('ZThkZDY1YjkyYWY0ZDEyZWYwZWQzYjg2');
    var _tc = atob('dVdkV05ta2h2eXFURXN3Tw==');
    var turnFallback = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'turn:a.relay.metered.ca:80', username: _tu, credential: _tc },
        { urls: 'turn:a.relay.metered.ca:443', username: _tu, credential: _tc },
        { urls: 'turn:a.relay.metered.ca:443?transport=tcp', username: _tu, credential: _tc }
    ];
    fetch(API_URL + '/api/ice-servers').then(function(r) { return r.json(); }).then(function(data) {
        if (data.ice_servers && data.ice_servers.length > 0) { sharedIceServers = data.ice_servers; }
        else { sharedIceServers = turnFallback; }
    }).catch(function(e) { sharedIceServers = turnFallback; });
})();

// Screen sharing functions for exam monitoring
// Store student's screen share peer connection
var studentScreenSharePC = null;
var forceSubmitPollInterval = null;
var studentCameraMicPC = null;
var studentCameraMicStream = null;
var warningPollInterval = null;

async function startScreenSharing() {
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            appState.screenShareStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: 'always' },
                audio: false
            });
            appState.isScreenSharing = true;
            
            var token = localStorage.getItem('authToken');
            if (token) {
                fetch(API_URL + '/api/exam/screen-share/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        exam_type: appState.currentQuiz ? 'chapter_quiz' : 'final_exam',
                        chapter_id: appState.currentChapter || null
                    })
                }).catch(function(err) { console.log('Screen share notification error:', err); });
                
                sendScreenShareToAdmin(appState.screenShareStream, token);
                startForceSubmitPolling(token);
                startCameraMicSharing(token);
                startWarningPolling(token);
            }
            
            appState.screenShareStream.getVideoTracks()[0].onended = function() {
                stopScreenSharing();
                if (appState.isMonitoring) {
                    alert('Screen sharing stopped! Your exam will be auto-submitted.');
                    autoSubmitExam();
                }
            };
            
            return true;
        }
    } catch (err) {
        console.log('Screen sharing error:', err);
        return false;
    }
    return false;
}

async function startCameraMicSharing(token) {
    try {
        studentCameraMicStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240, frameRate: 15 },
            audio: true
        });
        studentCameraMicPC = new RTCPeerConnection({ iceServers: sharedIceServers });
        studentCameraMicStream.getTracks().forEach(function(track) {
            studentCameraMicPC.addTrack(track, studentCameraMicStream);
        });
        studentCameraMicPC.onicecandidate = function(event) {
            if (event.candidate) {
                fetch(API_URL + '/api/camera-mic/ice-candidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ target_user_id: 1, candidate: event.candidate.candidate, sdp_mid: event.candidate.sdpMid, sdp_m_line_index: event.candidate.sdpMLineIndex })
                }).catch(function(e) { console.log('Camera ICE error:', e); });
            }
        };
        await studentCameraMicPC.setLocalDescription();
        var offer = studentCameraMicPC.localDescription;
        await fetch(API_URL + '/api/exam/camera-mic/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ sdp: offer.sdp })
        });
        var camAnswerPoll = setInterval(async function() {
            try {
                var resp = await fetch(API_URL + '/api/exam/camera-mic/check-answer', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (resp.ok) {
                    var d = await resp.json();
                    if (d.has_answer) {
                        clearInterval(camAnswerPoll);
                        await studentCameraMicPC.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: d.sdp }));
                        var camIcePoll = setInterval(async function() {
                            try {
                                var r2 = await fetch(API_URL + '/api/camera-mic/ice-candidates/1', { headers: { 'Authorization': 'Bearer ' + token } });
                                if (r2.ok) { var d2 = await r2.json(); d2.candidates.forEach(function(c) { if (c.candidate) studentCameraMicPC.addIceCandidate(new RTCIceCandidate({ candidate: c.candidate, sdpMid: c.sdp_mid, sdpMLineIndex: c.sdp_m_line_index })).catch(function(){}); }); }
                            } catch(e) {}
                            if (!studentCameraMicPC || studentCameraMicPC.connectionState === 'closed') clearInterval(camIcePoll);
                        }, 1500);
                    }
                }
            } catch(e) {}
        }, 1500);
    } catch(e) {
        console.log('Camera/mic sharing not available:', e);
    }
}

function startWarningPolling(token) {
    if (warningPollInterval) clearInterval(warningPollInterval);
    warningPollInterval = setInterval(async function() {
        try {
            var resp = await fetch(API_URL + '/api/exam/check-warning', { headers: { 'Authorization': 'Bearer ' + token } });
            if (resp.ok) {
                var d = await resp.json();
                if (d.warning) {
                    alert(d.message || 'Warning from admin: Please focus on your exam!');
                }
            }
        } catch(e) {}
    }, 3000);
}

// Send screen share stream to admin via WebRTC
async function sendScreenShareToAdmin(stream, token) {
    try {
        studentScreenSharePC = new RTCPeerConnection({ iceServers: sharedIceServers });
        
        // Add screen share track to peer connection
        stream.getTracks().forEach(function(track) {
            studentScreenSharePC.addTrack(track, stream);
        });
        
        // Handle ICE candidates
        studentScreenSharePC.onicecandidate = function(event) {
            if (event.candidate) {
                fetch(API_URL + '/api/screen-share/ice-candidate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        target_user_id: 1, // Admin user ID
                        candidate: event.candidate.candidate,
                        sdp_mid: event.candidate.sdpMid,
                        sdp_m_line_index: event.candidate.sdpMLineIndex
                    })
                }).catch(function(e) { console.log('ICE send error:', e); });
            }
        };
        
        // Create offer
        await studentScreenSharePC.setLocalDescription();
        var offer = studentScreenSharePC.localDescription;
        
        // Send offer to backend
        await fetch(API_URL + '/api/screen-share/offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                sdp: offer.sdp,
                exam_type: appState.currentQuiz ? 'chapter_quiz' : 'final_exam',
                chapter_id: appState.currentChapter || null
            })
        });
        
        // Poll for admin's answer
        pollForScreenShareAnswer(token);
        
    } catch (e) {
        console.error('Send screen share error:', e);
    }
}

// Poll for admin's WebRTC answer
function pollForScreenShareAnswer(token) {
    var answerPollInterval = setInterval(async function() {
        try {
            var response = await fetch(API_URL + '/api/screen-share/check-answer', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (response.ok) {
                var data = await response.json();
                if (data.has_answer && studentScreenSharePC) {
                    await studentScreenSharePC.setRemoteDescription(
                        new RTCSessionDescription({ type: 'answer', sdp: data.sdp })
                    );
                    clearInterval(answerPollInterval);
                    
                    // Poll for ICE candidates from admin
                    pollAdminICECandidates(token);
                }
            }
        } catch (e) {
            console.log('Poll answer error:', e);
        }
        
        // Stop polling if not sharing anymore
        if (!appState.isScreenSharing) {
            clearInterval(answerPollInterval);
        }
    }, 2000);
}

// Poll for ICE candidates from admin
function pollAdminICECandidates(token) {
    var icePollInterval = setInterval(async function() {
        try {
            var response = await fetch(API_URL + '/api/screen-share/ice-candidates/1', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (response.ok) {
                var data = await response.json();
                data.candidates.forEach(function(candidate) {
                    if (candidate.candidate && studentScreenSharePC) {
                        studentScreenSharePC.addIceCandidate(new RTCIceCandidate({
                            candidate: candidate.candidate,
                            sdpMid: candidate.sdp_mid,
                            sdpMLineIndex: candidate.sdp_m_line_index
                        })).catch(function(e) { console.log('Add ICE error:', e); });
                    }
                });
            }
        } catch (e) {
            console.log('Poll ICE error:', e);
        }
        
        // Stop polling if not sharing anymore
        if (!appState.isScreenSharing) {
            clearInterval(icePollInterval);
        }
    }, 2000);
}

// Start polling for force-submit commands from admin
function startForceSubmitPolling(token) {
    if (forceSubmitPollInterval) clearInterval(forceSubmitPollInterval);
    
    forceSubmitPollInterval = setInterval(async function() {
        try {
            var response = await fetch(API_URL + '/api/exam/check-force-submit', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (response.ok) {
                var data = await response.json();
                if (data.force_submitted) {
                    // Admin has force-submitted this exam
                    clearInterval(forceSubmitPollInterval);
                    forceSubmitPollInterval = null;
                    
                    // Stop screen sharing and monitoring
                    appState.isMonitoring = false;
                    stopScreenSharing();
                    
                    // Show cheating message
                    showCheatingMessage(data.message || 'Admin has auto-submitted your exam because you were caught cheating!');
                }
            }
        } catch (e) {
            console.log('Force submit poll error:', e);
        }
        
        // Stop polling if not monitoring anymore
        if (!appState.isMonitoring) {
            clearInterval(forceSubmitPollInterval);
            forceSubmitPollInterval = null;
        }
    }, 3000);
}

// Show cheating message and redirect to chapters
function showCheatingMessage(message) {
    // Create cheating popup
    var popup = document.createElement('div');
    popup.id = 'cheating-popup';
    popup.innerHTML = 
        '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,0,0,0.9); z-index: 10001; display: flex; align-items: center; justify-content: center;">' +
        '<div style="background: #1a1a2e; border: 3px solid #ff4444; border-radius: 20px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 0 50px rgba(255,0,0,0.5);">' +
        '<div style="font-size: 80px; margin-bottom: 20px;">⚠️</div>' +
        '<h2 style="color: #ff4444; font-family: Orbitron, monospace; font-size: 24px; margin-bottom: 15px;">EXAM AUTO-SUBMITTED</h2>' +
        '<p style="color: #fff; font-size: 18px; line-height: 1.6; margin-bottom: 25px;">' + message + '</p>' +
        '<button onclick="closeCheatingPopup()" style="padding: 12px 40px; background: linear-gradient(135deg, #ff4444, #ff6666); border: none; border-radius: 25px; color: #fff; font-family: Orbitron, monospace; font-size: 16px; font-weight: bold; cursor: pointer;">OK</button>' +
        '</div>' +
        '</div>';
    document.body.appendChild(popup);
}

// Close cheating popup and redirect to chapters
function closeCheatingPopup() {
    var popup = document.getElementById('cheating-popup');
    if (popup) popup.remove();
    
    // Reset quiz state
    appState.currentQuiz = null;
    appState.currentQuestion = 0;
    appState.score = 0;
    
    // Redirect to chapters
    showSection('chapters');
}

function stopScreenSharing() {
    if (appState.screenShareStream) {
        appState.screenShareStream.getTracks().forEach(function(track) { track.stop(); });
        appState.screenShareStream = null;
    }
    if (studentCameraMicStream) {
        studentCameraMicStream.getTracks().forEach(function(track) { track.stop(); });
        studentCameraMicStream = null;
    }
    if (studentCameraMicPC) { try { studentCameraMicPC.close(); } catch(e) {} studentCameraMicPC = null; }
    if (warningPollInterval) { clearInterval(warningPollInterval); warningPollInterval = null; }
    appState.isScreenSharing = false;
    
    var token = localStorage.getItem('authToken');
    if (token) {
        fetch(API_URL + '/api/exam/screen-share/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                reason: 'user_stopped'
            })
        }).catch(function(err) { console.log('Screen share stop notification error:', err); });
    }
}

// Auto-submit exam when user leaves the page
function autoSubmitExam() {
    if (appState.isMonitoring && appState.currentQuiz) {
        appState.isMonitoring = false;
        stopScreenSharing();
        showQuizResult();
    } else if (appState.isMonitoring && finalExamState.started) {
        appState.isMonitoring = false;
        stopScreenSharing();
        submitFinalExam();
    }
}

// Visibility change detection for exam monitoring
document.addEventListener('visibilitychange', function() {
    if (document.hidden && appState.isMonitoring) {
        try {
            var token = localStorage.getItem('authToken');
            if (token) {
                fetch(API_URL + '/api/exam/violation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({
                        exam_type: appState.currentQuiz ? 'chapter_quiz' : 'final_exam',
                        chapter_id: appState.currentChapter || null,
                        violation_type: 'background_activity',
                        timestamp: new Date().toISOString()
                    })
                }).catch(function(){});
            }
        } catch(e) {}
        alert('WARNING: You switched away from the exam! Your exam will be auto-submitted.');
        autoSubmitExam();
    }
});

// Window blur detection for exam monitoring
window.addEventListener('blur', function() {
    if (appState.isMonitoring) {
        try {
            var token = localStorage.getItem('authToken');
            if (token) {
                fetch(API_URL + '/api/exam/violation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({
                        exam_type: appState.currentQuiz ? 'chapter_quiz' : 'final_exam',
                        chapter_id: appState.currentChapter || null,
                        violation_type: 'app_switch',
                        timestamp: new Date().toISOString()
                    })
                }).catch(function(){});
            }
        } catch(e) {}
        console.log('Window lost focus during exam');
    }
});

// Load saved state
function loadState() {
    const saved = localStorage.getItem('ganitaPrakashState');
    if (saved) {
        const parsed = JSON.parse(saved);
        appState = { ...appState, ...parsed };
    }
}

// Save state
function saveState() {
    localStorage.setItem('ganitaPrakashState', JSON.stringify(appState));
}

// Initialize app
async function init() {
    loadState();
    
    // Check for URL parameters (for WebRTC calling from mobile app WebView)
    var urlParams = new URLSearchParams(window.location.search);
    var autoLoginToken = urlParams.get('token');
    var callId = urlParams.get('callId');
    var callType = urlParams.get('callType');
    var targetUserId = urlParams.get('targetUserId');
    var mode = urlParams.get('mode');
    
    // If we have auto-login parameters from mobile app
    // (mode=call/answer for WebRTC; or mode=section with a ?section=... for Fundamentals/Whiteboard deep-links from the APK WebView)
    var sectionParam = urlParams.get('section');
    if (autoLoginToken && (mode === 'call' || mode === 'answer' || mode === 'section' || sectionParam)) {
        appState.authToken = autoLoginToken;
        appState.isLoggedIn = true;
        localStorage.setItem('authToken', autoLoginToken);
        
        // Fetch user info with the token
        try {
            var response = await fetch(API_URL + '/api/auth/me', {
                headers: { 'Authorization': 'Bearer ' + autoLoginToken }
            });
            if (response.ok) {
                var userData = await response.json();
                appState.studentName = userData.name;
                appState.isAdmin = userData.is_admin;
                appState.userId = userData.id;
                appState.userEmail = userData.username;
                appState.chaptersUnlocked = !!userData.chapters_unlocked;
                localStorage.setItem('userData', JSON.stringify(userData));
            }
        } catch (e) {
            console.log('Auto-login user fetch error:', e);
        }
        
        saveState();
        showMainApp();
        
        // If this is a call mode, initiate or answer the call
        if (mode === 'answer' && targetUserId) {
            setTimeout(function() {
                answerCallFromMobile(parseInt(targetUserId), callType || 'audio', callId || '');
            }, 1000);
        } else if (mode === 'call' && targetUserId) {
            setTimeout(function() {
                initiateCallFromMobile(parseInt(targetUserId), callType || 'audio', callId || '');
            }, 1000);
        } else if (sectionParam) {
            // Deep-link from APK WebView: navigate to the requested section (fundamentals/whiteboard/etc.)
            setTimeout(function(){ try { showSection(sectionParam); } catch(e){} }, 600);
        }
        return;
    }
    
    // Check if we have a valid token from previous login
    var savedToken = localStorage.getItem('authToken');
    var savedUserData = localStorage.getItem('userData');
    
    if (savedToken && savedUserData && !savedToken.startsWith('admin-token-')) {
        // We have a real token from previous login, use it
        var userData = JSON.parse(savedUserData);
        appState.authToken = savedToken;
        appState.studentName = userData.name;
        appState.isAdmin = userData.is_admin;
        appState.userId = userData.id;
        appState.isLoggedIn = true;
        appState.userEmail = userData.username || userData.email;
        appState.chaptersUnlocked = !!userData.chapters_unlocked;
        saveState();
        showMainApp();
        renderChapters();
        if (appState.isAdmin) {
            loadAdminDashboard();
            autoCompleteAdminProgress();
        }
        // Honor URL ?section=... param so the APK WebView can deep-link into Fundamentals / Whiteboard
        try {
            var sp = new URLSearchParams(window.location.search);
            var sec = sp.get('section');
            if (sec) setTimeout(function(){ try { showSection(sec); } catch(e){} }, 400);
        } catch(e) {}
    } else {
        // No valid token, show login screen
        showLoginScreen();
    }
}

// Prompt for student name
function promptStudentName() {
    const name = prompt("Welcome to GANITA PRAKASH!\n\nPlease enter your name:");
    if (name && name.trim()) {
        appState.studentName = name.trim();
        localStorage.setItem('studentName', appState.studentName);
        saveState();
    }
}

// Show section
function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    const sectionMap = {
        'chapters': 'chapters-section',
        'fundamentals': 'fundamentals-section',
        'progress': 'progress-section',
        'final-exam': 'final-exam-section',
        'formula-videos': 'formula-videos-section',
        'whiteboard': 'whiteboard-section',
        'certificates': 'certificates-section',
        'certificate': 'certificates-section',
        '3d-models': '3d-models-section',
        'ai-assistant': 'ai-assistant-section',
        'chat': 'chat-section',
        'admin': 'admin-section'
    };
    
    const sectionId = sectionMap[section];
    if (sectionId) {
        const sectionEl = document.getElementById(sectionId);
        if (sectionEl) {
            sectionEl.classList.add('active');
        }
    }
    
    if (typeof event !== 'undefined' && event && event.target) {
        event.target.classList.add('active');
    }
    
    // Stop all refresh intervals when switching sections
    stopUserChatRefresh();
    stopAdminChatRefresh();
    
    // Render content for each section
    if (section === 'chapters') renderChapters();
    if (section === 'fundamentals') renderFundamentals();
    if (section === 'formula-videos') renderFormulaVideos();
    if (section === 'progress') renderProgress();
    if (section === 'final-exam') renderFinalExam();
    if (section === 'certificates' || section === 'certificate') renderCertificates();
    if (section === '3d-models') show3DModels();
    if (section === 'chat') { if (typeof loadChatMessages === 'function') loadChatMessages(); if (typeof startUserChatRefresh === 'function') startUserChatRefresh(); }
    if (section === 'admin' && appState.isAdmin) { if (typeof loadAdminDashboard === 'function') loadAdminDashboard(); if (typeof startAdminChatRefresh === 'function') startAdminChatRefresh(); if (typeof startScreenSharePolling === 'function') startScreenSharePolling(); if (typeof startScreenShareAutoConnect === 'function') startScreenShareAutoConnect(); }
    if (section === 'ai-assistant' && typeof renderAIMessages === 'function') renderAIMessages();
    if (section === 'whiteboard') renderWhiteboard();
}

// Render chapters grid
function renderChapters() {
    const grid = document.getElementById('chapters-grid');
    var activeChapters = getActiveChapters();
    var progress = getChapterProgress();
    var scores = getChapterScores();
    
    // --- CHAPTERS ONLY (Basics moved to Fundamentals section) ---
    var chaptersHTML = activeChapters.map(function(chapter, index) {
        const isCompleted = progress[chapter.id] === 'completed';
        const isLocked = !appState.isAdmin && index > 0 && !appState.chaptersUnlocked && progress[activeChapters[index-1].id] !== 'completed';
        const score = scores[chapter.id];
        
        return '<div class="chapter-card ' + (isCompleted ? 'completed' : '') + ' ' + (isLocked ? 'locked' : '') + '" ' +
               'onclick="' + (isLocked ? '' : 'openChapter(' + chapter.id + ')') + '">' +
               '<div class="chapter-number">' + chapter.number + '</div>' +
               '<div class="chapter-title">' + chapter.title + '</div>' +
               '<p style="color: #aaa; font-size: 0.9em;">' + chapter.description + '</p>' +
               '<div class="chapter-status">' +
               (isCompleted ? '<span class="status-badge completed">Completed - ' + score + '%</span>' : 
                 isLocked ? '<span class="status-badge locked">Locked</span>' : 
                 appState.isAdmin ? '<span class="status-badge" style="background:#8B5CF6;">Admin Access</span>' :
                 '<span class="status-badge in-progress">Start Learning</span>') +
               '</div>' +
               '</div>';
    }).join('');
    
    grid.innerHTML = chaptersHTML;
}

// ============================================
// FUNDAMENTALS / B2B BRIDGE COURSE SECTION
// ============================================

function renderFundamentals() {
    var container = document.getElementById('fundamentals-content');
    if (!container) return;
    
    var basicsWS = getActiveBasicsWorksheets();
    var basicsProgress = getBasicsProgress();
    var cls = getSelectedClass();
    var isAdmin = appState.isAdmin;
    var basicsLabel = cls === '7' ? 'Class 1\u20136 Fundamentals' : 'Class 1\u20135 Fundamentals';
    var completedCount = 0;
    basicsWS.forEach(function(ws) { if (basicsProgress[ws.id] !== undefined) completedCount++; });
    
    var html = '';
    
    // Header banner
    html += '<div style="background: linear-gradient(135deg, #1a1a3e 0%, #0d2137 100%); border: 2px solid #00e5ff; border-radius: 16px; padding: 24px 28px; margin-bottom: 24px;">';
    html += '<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 10px;">';
    html += '<div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #00e5ff, #00b0ff); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; color: #000; box-shadow: 0 0 20px rgba(0,229,255,0.4); flex-shrink: 0;">F</div>';
    html += '<div>';
    html += '<h2 style="color: #00e5ff; font-family: Orbitron, monospace; font-size: 1.3em; margin: 0; text-shadow: 0 0 10px rgba(0,229,255,0.5);">Fundamentals \u2014 ' + basicsLabel + '</h2>';
    html += '<p style="color: #aaa; font-size: 0.9em; margin: 6px 0 0 0;">B2B Bridge Course \u2022 12 Virtual Worksheets \u2022 MCQ Format \u2022 Sequential Unlock</p>';
    html += '<p style="color: #00e5ff; font-size: 0.85em; margin: 4px 0 0 0;">Progress: ' + completedCount + ' / 12 completed</p>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    // Worksheet grid
    html += '<div class="chapters-grid">';
    html += basicsWS.map(function(ws, idx) {
        var wsScore = basicsProgress[ws.id];
        var isCompleted = wsScore !== undefined;
        // First worksheet always unlocked; others need previous completed (admin bypasses)
        var prevWs = idx > 0 ? basicsWS[idx - 1] : null;
        var prevCompleted = prevWs ? (basicsProgress[prevWs.id] !== undefined) : true;
        var isUnlocked = true; // Fundamentals always unlocked for every role (admin + students)
        
        if (!isUnlocked) {
            return '<div class="chapter-card" style="border-color: #333; cursor: not-allowed; opacity: 0.5; position: relative;">' +
                   '<div class="chapter-number" style="background: #333; color: #666;">W' + (idx + 1) + '</div>' +
                   '<div class="chapter-title" style="color: #666;">' + ws.title + '</div>' +
                   '<p style="color: #555; font-size: 0.9em;">' + ws.desc + '</p>' +
                   '<div class="chapter-status">' +
                   '<span class="status-badge" style="background: #333; color: #666;">&#x1F512; Locked</span>' +
                   '</div>' +
                   '</div>';
        }
        
        return '<div class="chapter-card ' + (isCompleted ? 'completed' : '') + '" ' +
               'onclick="showBasicsOverview(\'' + ws.id + '\')" ' +
               'style="border-color: #00e5ff40; cursor: pointer;">' +
               '<div class="chapter-number" style="background: linear-gradient(135deg, #00e5ff, #00b0ff); color: #000;">W' + (idx + 1) + '</div>' +
               '<div class="chapter-title">' + ws.title + '</div>' +
               '<p style="color: #aaa; font-size: 0.9em;">' + ws.desc + '</p>' +
               '<div class="chapter-status">' +
               (isCompleted ? '<span class="status-badge completed">Score: ' + wsScore.pct + '%</span>' :
               '<span class="status-badge" style="background: #00e5ff; color: #000;">Start Worksheet</span>') +
               '</div>' +
               '</div>';
    }).join('');
    html += '</div>';
    
    container.innerHTML = html;
}



// ============================================
// BASICS WORKSHEET QUIZ FUNCTIONS
// ============================================

function showBasicsOverview(wsId) {
    appState.currentBasicsOverviewId = wsId;
    var basicsWS = getActiveBasicsWorksheets();
    var ws = basicsWS.find(function(w) { return w.id === wsId; });
    if (!ws) return;
    
    document.querySelectorAll('.content-section').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('quiz-section').classList.add('active');
    
    var topicHTML = '';
    if (ws.topicContent && ws.topicContent.length > 0) {
        topicHTML = '<div style="margin: 20px 0;"><h3 style="color: #00e5ff; text-align: center; margin-bottom: 15px; font-family: Orbitron, monospace;">Learn the Concepts</h3>';
        ws.topicContent.forEach(function(topic, idx) {
            topicHTML += '<div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 15px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;" onclick="var d=this.querySelector(\'.topic-detail\');var a=this.querySelector(\'.topic-arrow\');if(d.style.display===\'none\'){d.style.display=\'block\';a.textContent=\'\u25BC\';this.style.background=\'rgba(0,229,255,0.15)\';this.style.borderColor=\'rgba(0,229,255,0.5)\';}else{d.style.display=\'none\';a.textContent=\'\u25B6\';this.style.background=\'rgba(255,255,255,0.05)\';this.style.borderColor=\'rgba(255,255,255,0.1)\';}">' +
                '<div style="display: flex; align-items: center;">' +
                '<div style="width: 32px; height: 32px; border-radius: 50%; background: #00e5ff; display: flex; align-items: center; justify-content: center; margin-right: 12px; color: #1A1A2E; font-weight: bold; flex-shrink: 0;">' + (idx+1) + '</div>' +
                '<span style="color: #fff; font-size: 15px; font-weight: bold; flex: 1;">' + topic.name + '</span>' +
                '<span class="topic-arrow" style="color: #00e5ff; font-size: 18px;">\u25B6</span>' +
                '</div>' +
                '<div class="topic-detail" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">' +
                '<pre style="color: #ddd; font-size: 14px; line-height: 1.8; white-space: pre-wrap; font-family: inherit; margin: 0;">' + topic.content.replace(/\\n/g, '\n') + '</pre>' +
                '</div></div>';
        });
        topicHTML += '</div>';
    }
    
    document.getElementById('quiz-container').innerHTML =
        '<h2 class="section-title" style="color:#00e5ff;font-family:Orbitron,monospace;">Fundamentals: ' + ws.title + '</h2>' +
        '<div style="background:linear-gradient(135deg,#1a1a3e,#0d2137);border:2px solid #00e5ff40;border-radius:16px;padding:30px;margin:20px 0;">' +
            '<div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">' +
                '<div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#00e5ff,#00b0ff);display:flex;align-items:center;justify-content:center;font-size:22px;color:#000;font-weight:bold;flex-shrink:0;">F</div>' +
                '<div><h3 style="color:#fff;margin:0;font-size:1.2em;">' + ws.title + '</h3>' +
                '<p style="color:#aaa;font-size:0.85em;margin:4px 0 0 0;">B2B Bridge Course Worksheet</p></div>' +
            '</div>' +
            topicHTML +
            '<div style="display:flex;gap:15px;flex-wrap:wrap;margin-top:20px;">' +
                '<div style="flex:1;min-width:120px;background:rgba(0,229,255,0.08);border-radius:10px;padding:15px;text-align:center;">' +
                    '<div style="font-size:1.5em;font-weight:bold;color:#00e5ff;">' + ws.questions.length + '</div>' +
                    '<div style="color:#888;font-size:0.8em;">Questions</div>' +
                '</div>' +
                '<div style="flex:1;min-width:120px;background:rgba(0,229,255,0.08);border-radius:10px;padding:15px;text-align:center;">' +
                    '<div style="font-size:1.5em;font-weight:bold;color:#00e5ff;">MCQ</div>' +
                    '<div style="color:#888;font-size:0.8em;">Format</div>' +
                '</div>' +
                '<div style="flex:1;min-width:120px;background:rgba(0,229,255,0.08);border-radius:10px;padding:15px;text-align:center;">' +
                    '<div style="font-size:1.5em;font-weight:bold;color:#00e5ff;">Complete</div>' +
                    '<div style="color:#888;font-size:0.8em;">To Unlock Next</div>' +
                '</div>' +
            '</div>' +
            '<button class="btn btn-primary" onclick="startBasicsQuiz()" style="width:100%;padding:15px;font-size:16px;margin-top:20px;font-family:Orbitron,monospace;">Start Quiz</button>' +
        '</div>';
}

function startBasicsQuiz() {
    // Called from the overview screen - uses the worksheet currently being viewed
    var wsId = appState.currentBasicsOverviewId;
    if (wsId) {
        openBasicsWorksheet(wsId);
    }
}

function openBasicsWorksheet(wsId) {
    var basicsWS = getActiveBasicsWorksheets();
    var ws = basicsWS.find(function(w) { return w.id === wsId; });
    if (!ws) return;
    
    appState.currentBasicsWorksheet = ws;
    appState.basicsQuizQuestion = 0;
    appState.basicsQuizScore = 0;
    appState.basicsQuizAnswers = [];
    
    showBasicsQuiz(ws);
}

function showBasicsQuiz(ws) {
    appState.currentBasicsWorksheet = ws;
    appState.basicsQuizQuestion = 0;
    appState.basicsQuizScore = 0;
    appState.basicsQuizAnswers = [];

    document.querySelectorAll('.content-section').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('quiz-section').classList.add('active');
    renderBasicsQuestion(ws);
}

function renderBasicsQuestion(ws) {
    var qIdx = appState.basicsQuizQuestion;
    var total = ws.questions.length;

    if (qIdx >= total) {
        showBasicsResults(ws);
        return;
    }

    var q = ws.questions[qIdx];
    var progress = ((qIdx) / total * 100).toFixed(0);
    var optLabels = ['A', 'B', 'C', 'D'];

    document.getElementById('quiz-container').innerHTML =
        '<h2 class="section-title">Basics: ' + ws.title + '</h2>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
            '<span style="color:#00e5ff;font-size:13px;font-weight:bold;">Virtual Worksheet</span>' +
            '<span style="color:#888;font-size:12px;">Question ' + (qIdx + 1) + ' of ' + total + '</span>' +
        '</div>' +
        '<div class="progress-container">' +
            '<div class="progress-bar" style="width:' + progress + '%"></div>' +
        '</div>' +
        '<div class="progress-text">Question ' + (qIdx + 1) + ' of ' + total + '</div>' +
        '<div class="question-card">' +
            '<div class="question-number">Question ' + (qIdx + 1) + '</div>' +
            '<div class="question-text">' + q.q + '</div>' +
            '<div class="options">' +
                q.options.map(function(opt, i) {
                    return '<div class="option" onclick="selectBasicsAnswer(' + i + ')" id="basics-opt-' + i + '">' +
                        optLabels[i] + '. ' + opt +
                    '</div>';
                }).join('') +
            '</div>' +
        '</div>' +
        '<div class="btn-group">' +
            '<button class="btn" onclick="closeBasicsQuiz()" style="background:#333;color:#fff;padding:12px 24px;border:none;border-radius:8px;cursor:pointer;">Back to Chapters</button>' +
        '</div>';
}

function selectBasicsAnswer(optIdx) {
    var ws = appState.currentBasicsWorksheet;
    var qIdx = appState.basicsQuizQuestion;
    var q = ws.questions[qIdx];
    var correct = q.answer;
    var isCorrect = (optIdx === correct);

    if (isCorrect) appState.basicsQuizScore++;
    appState.basicsQuizAnswers.push(optIdx);

    // Highlight correct/incorrect options
    for (var i = 0; i < q.options.length; i++) {
        var el = document.getElementById('basics-opt-' + i);
        if (!el) continue;
        el.onclick = null;
        el.style.pointerEvents = 'none';
        if (i === correct) {
            el.classList.add('selected');
            el.style.borderColor = '#4CAF50';
            el.style.background = 'rgba(76,175,80,0.15)';
            el.style.color = '#4CAF50';
        } else if (i === optIdx && !isCorrect) {
            el.style.borderColor = '#f44336';
            el.style.background = 'rgba(244,67,54,0.15)';
            el.style.color = '#f44336';
        } else {
            el.style.opacity = '0.4';
        }
    }

    // Show Brilliant-style feedback banner + Continue button
    var feedbackDiv = document.getElementById('basics-feedback');
    if (feedbackDiv) feedbackDiv.remove();

    var total = ws.questions.length;
    var isLast = (qIdx + 1 >= total);
    var btnLabel = isLast ? 'See Results' : 'Continue';

    var bannerHtml = '<div id="basics-feedback" style="margin-top:18px;border-radius:12px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;';
    if (isCorrect) {
        bannerHtml += 'background:rgba(76,175,80,0.13);border:1.5px solid #4CAF50;">';
        bannerHtml += '<div style="display:flex;align-items:center;gap:10px;">';
        bannerHtml += '<div style="width:32px;height:32px;border-radius:50%;background:#4CAF50;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;">&#10003;</div>';
        bannerHtml += '<div><div style="color:#4CAF50;font-weight:bold;font-size:16px;">Correct!</div>';
        bannerHtml += '<div style="color:#81C784;font-size:13px;margin-top:2px;">Great job, keep going!</div></div>';
        bannerHtml += '</div>';
    } else {
        bannerHtml += 'background:rgba(244,67,54,0.13);border:1.5px solid #f44336;">';
        bannerHtml += '<div style="display:flex;align-items:center;gap:10px;">';
        bannerHtml += '<div style="width:32px;height:32px;border-radius:50%;background:#f44336;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;">&#10007;</div>';
        bannerHtml += '<div><div style="color:#f44336;font-weight:bold;font-size:16px;">Wrong!</div>';
        bannerHtml += '<div style="color:#E57373;font-size:13px;margin-top:2px;">The correct answer is: <strong>' + String.fromCharCode(65 + correct) + '. ' + q.options[correct] + '</strong></div></div>';
        bannerHtml += '</div>';
    }
    bannerHtml += '</div>';
    
    // Why button with explanation
    if (q.why) {
        bannerHtml += '<div style="margin-top:12px;">';
        bannerHtml += '<div onclick="var d=document.getElementById(\'why-detail\');var a=document.getElementById(\'why-arrow\');if(d.style.display===\'none\'){d.style.display=\'block\';a.textContent=\'\u25BC\';}else{d.style.display=\'none\';a.textContent=\'\u25B6\';}" style="display:flex;align-items:center;background:rgba(255,165,0,0.1);border-radius:10px;padding:12px;border:1px solid rgba(255,165,0,0.3);cursor:pointer;">';
        bannerHtml += '<span style="color:#FFA500;font-size:16px;font-weight:bold;margin-right:8px;">Why?</span>';
        bannerHtml += '<span style="color:#aaa;font-size:13px;flex:1;">Tap to see why this is the answer</span>';
        bannerHtml += '<span id="why-arrow" style="color:#FFA500;font-size:16px;">\u25B6</span>';
        bannerHtml += '</div>';
        bannerHtml += '<div id="why-detail" style="display:none;background:rgba(255,165,0,0.08);border-radius:10px;padding:15px;margin-top:8px;border:1px solid rgba(255,165,0,0.2);">';
        bannerHtml += '<p style="color:#ddd;font-size:14px;line-height:1.8;margin:0;">' + q.why + '</p>';
        bannerHtml += '</div></div>';
    }
    
    bannerHtml += '<div style="text-align:center;margin-top:12px;">';
    bannerHtml += '<button onclick="basicsNextQuestion()" class="btn btn-primary" style="padding:10px 28px;border-radius:8px;font-size:15px;font-weight:bold;white-space:nowrap;cursor:pointer;">' + btnLabel + '</button>';
    bannerHtml += '</div></div>';

    // Insert feedback banner after the question card
    var questionCard = document.querySelector('.question-card');
    if (questionCard) {
        questionCard.insertAdjacentHTML('afterend', bannerHtml);
    }

    // Hide the old Back to Chapters button while feedback is showing
    var btnGroup = document.querySelector('#quiz-container .btn-group');
    if (btnGroup) btnGroup.style.display = 'none';

    // Increment question index (ready for next)
    appState.basicsQuizQuestion++;
}

function basicsNextQuestion() {
    var ws = appState.currentBasicsWorksheet;
    renderBasicsQuestion(ws);
}

function showBasicsResults(ws) {
    var total = ws.questions.length;
    var score = appState.basicsQuizScore;
    var pct = Math.round((score / total) * 100);
    var emoji = pct === 100 ? '&#127942;' : pct >= 60 ? '&#11088;' : '&#128170;';

    // Save progress
    var prog = getBasicsProgress();
    prog[ws.id] = { score: score, total: total, pct: pct };
    setBasicsProgress(prog);

    var reviewHtml = '';
    for (var i = 0; i < ws.questions.length; i++) {
        var q = ws.questions[i];
        var userAns = appState.basicsQuizAnswers[i];
        var isCorrect = (userAns === q.answer);
        reviewHtml += '<div style="background:rgba(255,255,255,0.03);border:1px solid ' + (isCorrect ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)') + ';border-radius:10px;padding:15px;margin-bottom:10px;">';
        reviewHtml += '<div style="color:#aaa;font-size:12px;margin-bottom:5px;">Question ' + (i + 1) + '</div>';
        reviewHtml += '<div style="color:#fff;font-size:15px;margin-bottom:10px;">' + q.q + '</div>';
        for (var j = 0; j < q.options.length; j++) {
            var optColor = '#888';
            var optBg = 'transparent';
            var optLabel = '';
            if (j === q.answer) { optColor = '#4CAF50'; optBg = 'rgba(76,175,80,0.1)'; optLabel = ' (Correct)'; }
            if (j === userAns && !isCorrect) { optColor = '#f44336'; optBg = 'rgba(244,67,54,0.15)'; optLabel = ' (Your Answer)'; }
            if (j === userAns && isCorrect) { optLabel = ' (Your Answer)'; }
            reviewHtml += '<div style="padding:8px 12px;margin:4px 0;border-radius:5px;color:' + optColor + ';background:' + optBg + ';">' + String.fromCharCode(65 + j) + '. ' + q.options[j] + optLabel + '</div>';
        }
        reviewHtml += '</div>';
    }

    document.getElementById('quiz-container').innerHTML =
        '<h2 class="section-title">Basics: ' + ws.title + ' - Results</h2>' +
        '<div style="text-align:center;padding:30px 20px;">' +
            '<div style="font-size:3em;margin-bottom:15px;">' + emoji + '</div>' +
            '<h3 style="color:#E94560;font-size:22px;margin-bottom:10px;">Score: ' + score + '/' + total + ' (' + pct + '%)</h3>' +
            '<p style="color:#aaa;margin-bottom:20px;">' + (pct === 100 ? 'Perfect! You mastered this topic!' : pct >= 60 ? 'Good job! Keep practicing!' : 'Keep trying! Practice makes perfect!') + '</p>' +
        '</div>' +
        '<div style="margin-bottom:20px;">' +
            '<h3 style="color:#fff;margin-bottom:15px;">Answer Review</h3>' +
            reviewHtml +
        '</div>' +
        '<div class="btn-group">' +
            '<button class="btn btn-primary" onclick="retryBasicsWorksheet()">Retry Worksheet</button>' +
            '<button class="btn" onclick="closeBasicsQuiz()" style="background:#333;color:#fff;padding:12px 24px;border:none;border-radius:8px;cursor:pointer;">Back to Chapters</button>' +
        '</div>';
}

function retryBasicsWorksheet() {
    var ws = appState.currentBasicsWorksheet;
    appState.basicsQuizQuestion = 0;
    appState.basicsQuizScore = 0;
    appState.basicsQuizAnswers = [];
    renderBasicsQuestion(ws);
}

function closeBasicsQuiz() {
    document.querySelectorAll('.content-section').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('fundamentals-section').classList.add('active');
    renderFundamentals();
}


// Render Formula Videos tab - formula video for chapter N unlocks when chapter N quiz is completed
// Same progressive pattern as chapters: complete ch1 → ch1 formula video unlocks + ch2 unlocks
function renderFormulaVideos() {
    const grid = document.getElementById('formula-videos-grid');
    if (!grid) return;
    var activeChapters = getActiveChapters();
    var progress = getChapterProgress();
    var activeMedia = getActiveChapterMedia();
    grid.innerHTML = activeChapters.map((chapter, index) => {
        const isChapterCompleted = progress[chapter.id] === 'completed';
        // Formula video is locked if the chapter itself is not completed
        // Admin can see all formula videos
        const isFormulaLocked = !appState.isAdmin && !isChapterCompleted;
        const media = activeMedia[chapter.id] || {};
        const hasVideo = media.formulaVideoId && media.formulaVideoId.trim() !== '';
        const thumbnailUrl = hasVideo ? 
            `https://img.youtube.com/vi/${media.formulaVideoId}/hqdefault.jpg` : '';
        
        return `
            <div class="chapter-card ${isChapterCompleted ? 'completed' : ''} ${isFormulaLocked ? 'locked' : ''}" 
                 onclick="${isFormulaLocked ? '' : (hasVideo ? `showChapterFormulaVideo(${chapter.id})` : '')}"
                 style="cursor: ${isFormulaLocked ? 'not-allowed' : (hasVideo ? 'pointer' : 'default')};">
                <div class="chapter-number" style="background: linear-gradient(135deg, #ff6600, #ff00ff);">${chapter.number}</div>
                <div class="chapter-title">${chapter.title}</div>
                ${!isFormulaLocked && hasVideo ? `
                    <div style="margin: 10px 0; border-radius: 8px; overflow: hidden; position: relative;">
                        <img src="${thumbnailUrl}" alt="Formula Video" style="width:100%; height:auto; display:block; border-radius:8px;">
                        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:40px;text-shadow:0 0 10px rgba(0,0,0,0.8);">▶</div>
                    </div>
                ` : `
                    <p style="color: #aaa; font-size: 0.9em; margin: 10px 0;">${isFormulaLocked ? 'Complete this chapter quiz to unlock formula video' : 'Formula video coming soon!'}</p>
                `}
                <div class="chapter-status">
                    ${isFormulaLocked ? '<span class="status-badge locked">🔒 Complete Chapter ' + chapter.number + ' Quiz to Unlock</span>' : 
                      hasVideo ? '<span class="status-badge in-progress" style="background: linear-gradient(135deg, #ff6600, #ff00ff);">🧮 Watch Formula Video</span>' :
                      '<span class="status-badge" style="background:#555;">📹 Video Coming Soon</span>'}
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// WHITEBOARD FEATURE - Ganita Prakash Sense Board
// Inspired by Samsung S-Pen/Sense Board for smooth, pressure-sensitive drawing
// Uses PointerEvents API, quadratic Bezier interpolation, requestAnimationFrame throttling
// ============================================
var whiteboardCanvas = null;
var whiteboardCtx = null;
var whiteboardDrawing = false;
var whiteboardColor = '#00d4ff';
var whiteboardSize = 3;
var whiteboardTool = 'pen';
var whiteboardHistory = [];
var whiteboardRedoStack = [];
var whiteboardCurrentNote = null;
var whiteboardLastPos = null;
var whiteboardPoints = [];
var whiteboardIsFullscreen = false;
var whiteboardShowGrid = false;
var whiteboardPressure = 0.5;
var whiteboardShapeStart = null;
var whiteboardIsRotated = false;
var wbRafId = null; // requestAnimationFrame ID for 60fps throttling
var wbPendingDraw = null; // pending draw operation for rAF
var wbOffscreenCanvas = null; // offscreen canvas for compositing
var wbOffscreenCtx = null;

function renderWhiteboard() {
    var container = document.getElementById('whiteboard-container');
    if (!container) return;

    // Tata Class Edge-style whiteboard (matches APK v1.9.6 image): blue header,
    // left page panel, dark bottom toolbar with all tools, color/eraser popup, math pad.
    // Loaded from a self-contained HTML file so it's identical between APK and web.
    container.innerHTML =
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">' +
            '<span style="font-size:0.85em;color:#888;">Same whiteboard as the mobile app — pen, highlighter, shapes, math pad, multi-page, save PNG. Tap Full to go fullscreen.</span>' +
        '</div>' +
        '<div id="wb-frame-wrap" style="position:relative;width:100%;height:80vh;min-height:560px;border:1px solid #2a2a4e;border-radius:8px;overflow:hidden;background:#fff;">' +
            '<iframe id="wb-frame" src="whiteboard.html?v=20260504-v197" style="width:100%;height:100%;border:0;display:block;" title="Whiteboard" allow="fullscreen" allowfullscreen></iframe>' +
        '</div>';
    // Listen for fullscreen requests from inside the iframe and apply to the wrapper.
    if (!window._wbFsHandlerInstalled) {
        window._wbFsHandlerInstalled = true;
        window.addEventListener('message', function(ev){
            if (ev && ev.data && ev.data.type === 'wb-fullscreen') {
                var wrap = document.getElementById('wb-frame-wrap');
                if (!wrap) return;
                var req = wrap.requestFullscreen || wrap.webkitRequestFullscreen || wrap.mozRequestFullScreen;
                var exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
                var inFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
                try {
                    if (inFs) { exit.call(document); } else if (req) { req.call(wrap); }
                } catch(e){}
            }
        });
    }
    return;

    // (legacy renderer kept below for reference; no longer reached)
    var savedNotes = JSON.parse(localStorage.getItem('whiteboard_notes') || '[]');
    
    container.innerHTML = 
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
            '<div style="font-family:Orbitron,monospace;">' +
                '<span style="font-size:1.3em;font-weight:bold;background:linear-gradient(135deg,#00d4ff,#ff6600);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Sense Board</span>' +
                '<span style="font-size:0.75em;color:#888;margin-left:8px;">Ganita Prakash NCERT Math</span>' +
            '</div>' +
        '</div>' +
        '<div id="wb-toolbar-top" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px;">' +
            '<button onclick="newWhiteboardNote()" style="padding:10px 20px;background:linear-gradient(135deg,#00d4ff,#0099ff);color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:Orbitron,monospace;font-weight:bold;font-size:0.9em;">+ NEW NOTE</button>' +
            '<button onclick="clearWhiteboardCanvas()" style="padding:10px 20px;background:linear-gradient(135deg,#ff4444,#cc0000);color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:Orbitron,monospace;font-weight:bold;font-size:0.9em;">CLEAR</button>' +
            '<button onclick="saveWhiteboardNote()" style="padding:10px 20px;background:linear-gradient(135deg,#00ff88,#00cc66);color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:Orbitron,monospace;font-weight:bold;font-size:0.9em;">SAVE</button>' +
            '<button onclick="undoWhiteboard()" style="padding:10px 15px;background:#333;color:#fff;border:1px solid #555;border-radius:8px;cursor:pointer;font-size:1.1em;" title="Undo">&#8617;</button>' +
            '<button onclick="redoWhiteboard()" style="padding:10px 15px;background:#333;color:#fff;border:1px solid #555;border-radius:8px;cursor:pointer;font-size:1.1em;" title="Redo">&#8618;</button>' +
            '<button onclick="downloadWhiteboardNote()" style="padding:10px 15px;background:#333;color:#fff;border:1px solid #555;border-radius:8px;cursor:pointer;font-size:0.9em;font-family:Orbitron,monospace;" title="Download as PNG">DOWNLOAD</button>' +
            '<button onclick="toggleWhiteboardGrid()" id="wb-grid-btn" style="padding:10px 15px;background:#333;color:#fff;border:1px solid #555;border-radius:8px;cursor:pointer;font-size:0.9em;font-family:Orbitron,monospace;" title="Toggle Grid">GRID</button>' +
            '<button onclick="toggleWhiteboardFullscreen()" id="wb-fullscreen-btn" style="padding:10px 20px;background:linear-gradient(135deg,#ff6600,#ff9900);color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:Orbitron,monospace;font-weight:bold;font-size:0.9em;" title="Fullscreen Mode">&#x26F6; FULLSCREEN</button>' +
        '</div>' +
        '<div id="wb-toolbar-tools" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px;align-items:center;">' +
            '<label style="color:#aaa;font-size:0.9em;">Tool:</label>' +
            '<button id="wb-pen" onclick="setWhiteboardTool(\'pen\')" style="padding:8px 16px;background:#00d4ff;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">Pen</button>' +
            '<button id="wb-eraser" onclick="setWhiteboardTool(\'eraser\')" style="padding:8px 16px;background:#555;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">Eraser</button>' +
            '<button id="wb-highlighter" onclick="setWhiteboardTool(\'highlighter\')" style="padding:8px 16px;background:#555;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">Highlighter</button>' +
            '<button id="wb-text" onclick="setWhiteboardTool(\'text\')" style="padding:8px 16px;background:#555;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">Text</button>' +
            '<button id="wb-line" onclick="setWhiteboardTool(\'line\')" style="padding:8px 16px;background:#555;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">Line</button>' +
            '<button id="wb-rect" onclick="setWhiteboardTool(\'rect\')" style="padding:8px 16px;background:#555;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">Rect</button>' +
            '<button id="wb-circle" onclick="setWhiteboardTool(\'circle\')" style="padding:8px 16px;background:#555;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">Circle</button>' +
            '<label style="color:#aaa;font-size:0.9em;margin-left:10px;">Color:</label>' +
            '<input type="color" id="wb-color" value="#00d4ff" onchange="whiteboardColor=this.value" style="width:36px;height:36px;border:none;border-radius:6px;cursor:pointer;background:transparent;">' +
            '<label style="color:#aaa;font-size:0.9em;margin-left:10px;">Size:</label>' +
            '<input type="range" id="wb-size" min="1" max="30" value="3" onchange="whiteboardSize=parseInt(this.value)" style="width:100px;">' +
        '</div>' +
        '<div id="wb-canvas-wrapper" style="border:2px solid #333;border-radius:12px;overflow:hidden;background:#1a1a2e;position:relative;">' +
            '<canvas id="whiteboard-canvas" style="display:block;width:100%;cursor:crosshair;touch-action:none;"></canvas>' +
        '</div>' +
        (savedNotes.length > 0 ? 
            '<h3 style="color:#00d4ff;margin-top:25px;font-family:Orbitron,monospace;">SAVED NOTES</h3>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:15px;margin-top:10px;">' +
                savedNotes.map(function(note, i) {
                    return '<div style="background:#1a1a2e;border:1px solid #333;border-radius:12px;padding:10px;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.borderColor=\'#00d4ff\'" onmouseout="this.style.borderColor=\'#333\'">' +
                        '<img src="' + note.thumbnail + '" style="width:100%;border-radius:8px;margin-bottom:8px;" onclick="loadWhiteboardNote(' + i + ')">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                            '<span style="color:#aaa;font-size:0.8em;">' + note.date + '</span>' +
                            '<div>' +
                                '<button onclick="loadWhiteboardNote(' + i + ')" style="background:none;border:none;color:#00d4ff;cursor:pointer;font-size:1.1em;" title="Open">&#9998;</button>' +
                                '<button onclick="deleteWhiteboardNote(' + i + ')" style="background:none;border:none;color:#ff4444;cursor:pointer;font-size:1.1em;" title="Delete">&#10006;</button>' +
                            '</div>' +
                        '</div>' +
                        '<div style="color:#fff;font-size:0.85em;margin-top:4px;">' + (note.name || 'Untitled Note') + '</div>' +
                    '</div>';
                }).join('') +
            '</div>'
        : '');
    
    initWhiteboardCanvas();
}

function initWhiteboardCanvas() {
    whiteboardCanvas = document.getElementById('whiteboard-canvas');
    if (!whiteboardCanvas) return;
    
    var container = whiteboardCanvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var displayWidth = container.offsetWidth;
    var displayHeight = Math.max(500, window.innerHeight * 0.5);
    whiteboardCanvas.width = displayWidth * dpr;
    whiteboardCanvas.height = displayHeight * dpr;
    whiteboardCanvas.style.width = displayWidth + 'px';
    whiteboardCanvas.style.height = displayHeight + 'px';
    whiteboardCtx = whiteboardCanvas.getContext('2d');
    whiteboardCtx.scale(dpr, dpr);
    whiteboardCtx.fillStyle = '#1a1a2e';
    whiteboardCtx.fillRect(0, 0, displayWidth, displayHeight);
    if (whiteboardShowGrid) drawWhiteboardGrid();
    whiteboardHistory = [];
    whiteboardRedoStack = [];
    saveWhiteboardState();
    
    // Use PointerEvents for pressure sensitivity (S-Pen, Apple Pencil, Wacom)
    whiteboardCanvas.addEventListener('pointerdown', wbPointerDown);
    whiteboardCanvas.addEventListener('pointermove', wbPointerMove);
    whiteboardCanvas.addEventListener('pointerup', wbPointerUp);
    whiteboardCanvas.addEventListener('pointerleave', wbPointerUp);
    whiteboardCanvas.addEventListener('pointercancel', wbPointerUp);
    // Prevent default touch behavior for palm rejection
    whiteboardCanvas.addEventListener('touchstart', function(e) { e.preventDefault(); }, {passive: false});
    whiteboardCanvas.addEventListener('touchmove', function(e) { e.preventDefault(); }, {passive: false});
    
    // Listen for fullscreen change to resize canvas
    document.addEventListener('fullscreenchange', onWhiteboardFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onWhiteboardFullscreenChange);
}

function getCanvasPos(e) {
    var rect = whiteboardCanvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left),
        y: (e.clientY - rect.top)
    };
}

// PointerEvent handlers for pressure-sensitive smooth drawing (S-Pen/Apple Pencil style)
function wbPointerDown(e) {
    // Palm rejection: ignore touch events when using a pen
    if (e.pointerType === 'touch' && whiteboardCanvas.hasAttribute('data-pen-active')) return;
    if (e.pointerType === 'pen') whiteboardCanvas.setAttribute('data-pen-active', 'true');
    
    e.preventDefault();
    whiteboardCanvas.setPointerCapture(e.pointerId);
    
    if (whiteboardTool === 'text') {
        var pos = getCanvasPos(e);
        var text = prompt('Enter text:');
        if (text) {
            whiteboardCtx.font = (whiteboardSize * 5) + 'px Arial';
            whiteboardCtx.fillStyle = whiteboardColor;
            whiteboardCtx.fillText(text, pos.x, pos.y);
            saveWhiteboardState();
        }
        return;
    }
    
    whiteboardDrawing = true;
    whiteboardPressure = e.pressure || 0.5;
    whiteboardLastPos = getCanvasPos(e);
    whiteboardPoints = [whiteboardLastPos];
    
    // Shape tools: save starting point and snapshot
    if (whiteboardTool === 'line' || whiteboardTool === 'rect' || whiteboardTool === 'circle') {
        whiteboardShapeStart = whiteboardLastPos;
        whiteboardShapeSnapshot = whiteboardCanvas.toDataURL();
        return;
    }
    
    // Set stroke properties for pen/eraser/highlighter
    wbSetStrokeStyle(e.pressure || 0.5);
}

function wbSetStrokeStyle(pressure) {
    var pressureFactor = 0.5 + pressure;
    if (whiteboardTool === 'eraser') {
        // Eraser paints background color to erase strokes (works with dark canvas background)
        whiteboardCtx.strokeStyle = '#1a1a2e';
        whiteboardCtx.lineWidth = whiteboardSize * 5;
        whiteboardCtx.globalAlpha = 1;
        whiteboardCtx.globalCompositeOperation = 'source-over';
    } else if (whiteboardTool === 'highlighter') {
        // Highlighter: semi-transparent overlay
        whiteboardCtx.strokeStyle = whiteboardColor;
        whiteboardCtx.lineWidth = whiteboardSize * 4 * pressureFactor;
        whiteboardCtx.globalAlpha = 0.3;
        whiteboardCtx.globalCompositeOperation = 'source-over';
    } else {
        // Pen: pressure-sensitive width and opacity (S-Pen/Sense Board style)
        whiteboardCtx.strokeStyle = whiteboardColor;
        whiteboardCtx.lineWidth = whiteboardSize * pressureFactor;
        whiteboardCtx.globalAlpha = Math.min(1, 0.4 + pressure * 0.6);
        whiteboardCtx.globalCompositeOperation = 'source-over';
    }
    whiteboardCtx.lineCap = 'round';
    whiteboardCtx.lineJoin = 'round';
}

function wbPointerMove(e) {
    if (!whiteboardDrawing) return;
    e.preventDefault();
    var pos = getCanvasPos(e);
    whiteboardPressure = e.pressure || 0.5;
    
    // Shape tools: preview on top of snapshot
    if (whiteboardTool === 'line' || whiteboardTool === 'rect' || whiteboardTool === 'circle') {
        wbDrawShapePreview(pos);
        return;
    }
    
    // Collect points for smooth curve drawing
    whiteboardPoints.push(pos);
    
    // Use requestAnimationFrame for 60fps throttled drawing (Sense Board performance)
    wbPendingDraw = { pos: pos, pressure: whiteboardPressure };
    if (!wbRafId) {
        wbRafId = requestAnimationFrame(wbRenderFrame);
    }
}

// requestAnimationFrame callback - draws at 60fps max for smooth Sense Board performance
function wbRenderFrame() {
    wbRafId = null;
    if (!wbPendingDraw || !whiteboardDrawing) return;
    
    var pos = wbPendingDraw.pos;
    var pressure = wbPendingDraw.pressure;
    wbPendingDraw = null;
    
    // Update pressure-based width dynamically
    wbSetStrokeStyle(pressure);
    
    // Smooth curve drawing using quadratic Bezier interpolation (S-Pen/Sense Board style)
    if (whiteboardPoints.length >= 3) {
        var p1 = whiteboardPoints[whiteboardPoints.length - 3];
        var p2 = whiteboardPoints[whiteboardPoints.length - 2];
        var p3 = pos;
        var midX = (p2.x + p3.x) / 2;
        var midY = (p2.y + p3.y) / 2;
        whiteboardCtx.beginPath();
        whiteboardCtx.moveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        whiteboardCtx.quadraticCurveTo(p2.x, p2.y, midX, midY);
        whiteboardCtx.stroke();
    } else {
        // First segment: simple line
        whiteboardCtx.beginPath();
        whiteboardCtx.moveTo(whiteboardLastPos.x, whiteboardLastPos.y);
        whiteboardCtx.lineTo(pos.x, pos.y);
        whiteboardCtx.stroke();
    }
    whiteboardLastPos = pos;
}

function wbPointerUp(e) {
    if (!whiteboardDrawing) return;
    
    if (e && e.pointerType === 'pen') whiteboardCanvas.removeAttribute('data-pen-active');
    
    // Cancel any pending rAF
    if (wbRafId) { cancelAnimationFrame(wbRafId); wbRafId = null; }
    wbPendingDraw = null;
    
    // Flush any remaining points before finalizing
    if (whiteboardPoints.length >= 2 && whiteboardTool !== 'line' && whiteboardTool !== 'rect' && whiteboardTool !== 'circle') {
        var lastPt = whiteboardPoints[whiteboardPoints.length - 1];
        wbSetStrokeStyle(whiteboardPressure);
        if (whiteboardPoints.length >= 3) {
            var p1 = whiteboardPoints[whiteboardPoints.length - 3];
            var p2 = whiteboardPoints[whiteboardPoints.length - 2];
            var midX = (p2.x + lastPt.x) / 2;
            var midY = (p2.y + lastPt.y) / 2;
            whiteboardCtx.beginPath();
            whiteboardCtx.moveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
            whiteboardCtx.quadraticCurveTo(p2.x, p2.y, midX, midY);
            whiteboardCtx.stroke();
        }
    }
    
    // Finalize shape drawing
    if ((whiteboardTool === 'line' || whiteboardTool === 'rect' || whiteboardTool === 'circle') && whiteboardShapeStart) {
        var pos = e ? getCanvasPos(e) : whiteboardLastPos;
        wbFinalizeShape(pos);
    }
    
    whiteboardDrawing = false;
    whiteboardCtx.globalAlpha = 1;
    whiteboardCtx.globalCompositeOperation = 'source-over';
    whiteboardPoints = [];
    whiteboardShapeStart = null;
    saveWhiteboardState();
}

// Shape preview: restore snapshot and draw shape outline
function wbDrawShapePreview(pos) {
    if (!whiteboardShapeSnapshot || !whiteboardShapeStart) return;
    var img = new Image();
    img.onload = function() {
        var dpr = window.devicePixelRatio || 1;
        whiteboardCtx.save();
        whiteboardCtx.setTransform(1, 0, 0, 1, 0, 0);
        whiteboardCtx.clearRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
        whiteboardCtx.drawImage(img, 0, 0);
        whiteboardCtx.restore();
        whiteboardCtx.strokeStyle = whiteboardColor;
        whiteboardCtx.lineWidth = whiteboardSize;
        whiteboardCtx.globalAlpha = 1;
        whiteboardCtx.lineCap = 'round';
        whiteboardCtx.lineJoin = 'round';
        var sx = whiteboardShapeStart.x, sy = whiteboardShapeStart.y;
        if (whiteboardTool === 'line') {
            whiteboardCtx.beginPath();
            whiteboardCtx.moveTo(sx, sy);
            whiteboardCtx.lineTo(pos.x, pos.y);
            whiteboardCtx.stroke();
        } else if (whiteboardTool === 'rect') {
            whiteboardCtx.strokeRect(sx, sy, pos.x - sx, pos.y - sy);
        } else if (whiteboardTool === 'circle') {
            var rx = Math.abs(pos.x - sx) / 2;
            var ry = Math.abs(pos.y - sy) / 2;
            var cx = (sx + pos.x) / 2;
            var cy = (sy + pos.y) / 2;
            whiteboardCtx.beginPath();
            whiteboardCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            whiteboardCtx.stroke();
        }
    };
    img.src = whiteboardShapeSnapshot;
}

function wbFinalizeShape(pos) {
    // Final draw is already visible from last preview
    wbDrawShapePreview(pos);
}

var whiteboardShapeSnapshot = null;

function saveWhiteboardState() {
    if (!whiteboardCanvas) return;
    whiteboardHistory.push(whiteboardCanvas.toDataURL());
    whiteboardRedoStack = [];
    if (whiteboardHistory.length > 50) whiteboardHistory.shift();
}

function undoWhiteboard() {
    if (whiteboardHistory.length <= 1) return;
    whiteboardRedoStack.push(whiteboardHistory.pop());
    var img = new Image();
    img.onload = function() {
        whiteboardCtx.clearRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
        whiteboardCtx.drawImage(img, 0, 0);
    };
    img.src = whiteboardHistory[whiteboardHistory.length - 1];
}

function redoWhiteboard() {
    if (whiteboardRedoStack.length === 0) return;
    var state = whiteboardRedoStack.pop();
    whiteboardHistory.push(state);
    var img = new Image();
    img.onload = function() {
        whiteboardCtx.clearRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
        whiteboardCtx.drawImage(img, 0, 0);
    };
    img.src = state;
}

function setWhiteboardTool(tool) {
    whiteboardTool = tool;
    var tools = ['pen', 'eraser', 'highlighter', 'text', 'line', 'rect', 'circle'];
    tools.forEach(function(t) {
        var btn = document.getElementById('wb-' + t);
        if (btn) btn.style.background = (t === tool) ? '#00d4ff' : '#555';
    });
}

function clearWhiteboardCanvas() {
    if (!whiteboardCanvas || !whiteboardCtx) return;
    if (!confirm('Clear the whiteboard?')) return;
    whiteboardCtx.fillStyle = '#1a1a2e';
    whiteboardCtx.fillRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
    saveWhiteboardState();
}

function newWhiteboardNote() {
    whiteboardCurrentNote = null;
    if (whiteboardCanvas && whiteboardCtx) {
        whiteboardCtx.fillStyle = '#1a1a2e';
        whiteboardCtx.fillRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
        whiteboardHistory = [];
        whiteboardRedoStack = [];
        saveWhiteboardState();
    }
}

function saveWhiteboardNote() {
    if (!whiteboardCanvas) return;
    var name = prompt('Note name:', whiteboardCurrentNote !== null ? (JSON.parse(localStorage.getItem('whiteboard_notes') || '[]')[whiteboardCurrentNote] || {}).name || '' : '');
    if (name === null) return;
    if (!name) name = 'Untitled Note';
    
    var savedNotes = JSON.parse(localStorage.getItem('whiteboard_notes') || '[]');
    var noteData = {
        name: name,
        data: whiteboardCanvas.toDataURL(),
        thumbnail: whiteboardCanvas.toDataURL('image/jpeg', 0.3),
        date: new Date().toLocaleDateString(),
        width: whiteboardCanvas.width,
        height: whiteboardCanvas.height
    };
    
    if (whiteboardCurrentNote !== null && whiteboardCurrentNote < savedNotes.length) {
        savedNotes[whiteboardCurrentNote] = noteData;
    } else {
        savedNotes.push(noteData);
        whiteboardCurrentNote = savedNotes.length - 1;
    }
    
    localStorage.setItem('whiteboard_notes', JSON.stringify(savedNotes));
    renderWhiteboard();
    if (whiteboardCurrentNote !== null) loadWhiteboardNote(whiteboardCurrentNote);
}

function loadWhiteboardNote(index) {
    var savedNotes = JSON.parse(localStorage.getItem('whiteboard_notes') || '[]');
    if (index >= savedNotes.length) return;
    
    whiteboardCurrentNote = index;
    var note = savedNotes[index];
    
    if (!whiteboardCanvas) initWhiteboardCanvas();
    
    var img = new Image();
    img.onload = function() {
        whiteboardCanvas.width = note.width || whiteboardCanvas.parentElement.offsetWidth;
        whiteboardCanvas.height = note.height || 500;
        whiteboardCtx.drawImage(img, 0, 0);
        whiteboardHistory = [whiteboardCanvas.toDataURL()];
        whiteboardRedoStack = [];
    };
    img.src = note.data;
}

function deleteWhiteboardNote(index) {
    if (!confirm('Delete this note?')) return;
    var savedNotes = JSON.parse(localStorage.getItem('whiteboard_notes') || '[]');
    savedNotes.splice(index, 1);
    localStorage.setItem('whiteboard_notes', JSON.stringify(savedNotes));
    if (whiteboardCurrentNote === index) whiteboardCurrentNote = null;
    renderWhiteboard();
}

function downloadWhiteboardNote() {
    if (!whiteboardCanvas) return;
    var link = document.createElement('a');
    link.download = 'whiteboard_note_' + new Date().toISOString().slice(0,10) + '.png';
    link.href = whiteboardCanvas.toDataURL();
    link.click();
}

// Fullscreen whiteboard mode using Fullscreen API
function toggleWhiteboardFullscreen() {
    var wrapper = document.getElementById('wb-canvas-wrapper');
    var section = document.getElementById('whiteboard-section');
    if (!wrapper || !section) return;
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // Enter fullscreen - make the whole whiteboard section fullscreen
        var el = section;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        }
        whiteboardIsFullscreen = true;
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        whiteboardIsFullscreen = false;
    }
}

var wbFsToolsOpen = false; // floating tools panel state

function onWhiteboardFullscreenChange() {
    var isFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
    whiteboardIsFullscreen = isFS;
    var btn = document.getElementById('wb-fullscreen-btn');
    var section = document.getElementById('whiteboard-section');
    
    if (isFS) {
        // In fullscreen: hide everything except canvas, add floating toggle
        if (section) {
            section.style.background = '#1a1a2e';
            section.style.padding = '0';
            section.style.margin = '0';
            section.style.overflow = 'hidden';
            section.style.width = '100vw';
            section.style.height = '100vh';
        }
        // Hide all direct children of section except whiteboard-container and wb-fs-floating
        if (section) {
            var children = section.children;
            for (var ci = 0; ci < children.length; ci++) {
                var child = children[ci];
                if (child.id !== 'whiteboard-container' && child.id !== 'wb-fs-floating') {
                    child.setAttribute('data-wb-hidden', child.style.display || '');
                    child.style.display = 'none';
                }
            }
            // Inside whiteboard-container, hide everything except wb-canvas-wrapper
            var wbContainer = document.getElementById('whiteboard-container');
            if (wbContainer) {
                wbContainer.style.padding = '0';
                wbContainer.style.margin = '0';
                wbContainer.style.border = 'none';
                wbContainer.style.borderRadius = '0';
                wbContainer.style.width = '100vw';
                wbContainer.style.height = '100vh';
                wbContainer.style.position = 'fixed';
                wbContainer.style.top = '0';
                wbContainer.style.left = '0';
                var wbChildren = wbContainer.children;
                for (var wi = 0; wi < wbChildren.length; wi++) {
                    var wc = wbChildren[wi];
                    if (wc.id !== 'wb-canvas-wrapper') {
                        wc.setAttribute('data-wb-hidden', wc.style.display || '');
                        wc.style.display = 'none';
                    }
                }
            }
        }
        if (btn) btn.innerHTML = '&#x2716; EXIT FULLSCREEN';
        // Add floating circular toggle button and tools panel (append to section, not container)
        wbCreateFloatingTools();
        // Resize canvas to fill entire screen
        resizeWhiteboardForFullscreen();
    } else {
        // Exited fullscreen: restore everything
        wbFsToolsOpen = false;
        if (section) {
            section.style.background = '';
            section.style.padding = '';
            section.style.margin = '';
            section.style.overflow = '';
            section.style.width = '';
            section.style.height = '';
            // Restore hidden elements
            var children = section.children;
            for (var ci = 0; ci < children.length; ci++) {
                var child = children[ci];
                if (child.hasAttribute('data-wb-hidden')) {
                    child.style.display = child.getAttribute('data-wb-hidden') || '';
                    child.removeAttribute('data-wb-hidden');
                }
            }
            var wbContainer = document.getElementById('whiteboard-container');
            if (wbContainer) {
                wbContainer.style.padding = '';
                wbContainer.style.margin = '';
                wbContainer.style.border = '';
                wbContainer.style.borderRadius = '';
                wbContainer.style.width = '';
                wbContainer.style.height = '';
                wbContainer.style.position = '';
                wbContainer.style.top = '';
                wbContainer.style.left = '';
                var wbChildren = wbContainer.children;
                for (var wi = 0; wi < wbChildren.length; wi++) {
                    var wc = wbChildren[wi];
                    if (wc.hasAttribute('data-wb-hidden')) {
                        wc.style.display = wc.getAttribute('data-wb-hidden') || '';
                        wc.removeAttribute('data-wb-hidden');
                    }
                }
            }
        }
        // Remove floating tools panel
        var floatingPanel = document.getElementById('wb-fs-floating');
        if (floatingPanel) floatingPanel.remove();
        if (btn) btn.innerHTML = '&#x26F6; FULLSCREEN';
        // Restore canvas to normal size
        resizeWhiteboardNormal();
    }
}

// Create floating circular tools panel for fullscreen mode
function wbCreateFloatingTools() {
    // Remove existing if any
    var existing = document.getElementById('wb-fs-floating');
    if (existing) existing.remove();
    
    // Append to whiteboard-section directly (not whiteboard-container) so it's visible in fullscreen
    var parent = document.getElementById('whiteboard-section');
    if (!parent) return;
    
    var floatDiv = document.createElement('div');
    floatDiv.id = 'wb-fs-floating';
    floatDiv.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;flex-direction:column;align-items:center;gap:10px;';
    
    // Tools panel (hidden by default)
    var toolsPanel = document.createElement('div');
    toolsPanel.id = 'wb-fs-tools-panel';
    toolsPanel.style.cssText = 'display:none;flex-direction:column;align-items:center;gap:8px;padding:12px;background:rgba(20,20,40,0.95);border-radius:20px;border:1px solid rgba(0,212,255,0.3);backdrop-filter:blur(10px);max-height:70vh;overflow-y:auto;';
    
    // Circle button style helper
    var circBtnStyle = 'width:48px;height:48px;border-radius:50%;border:2px solid #444;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.3em;transition:all 0.2s;background:#222;color:#fff;';
    var circBtnActiveStyle = 'width:48px;height:48px;border-radius:50%;border:2px solid #00d4ff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.3em;transition:all 0.2s;background:#00d4ff;color:#fff;';
    
    // Tool buttons with emojis arranged in rows
    var tools = [
        { id: 'fs-pen', emoji: '\u270F\uFE0F', tool: 'pen', label: 'Pen' },
        { id: 'fs-eraser', emoji: '\u{1F9F9}', tool: 'eraser', label: 'Eraser' },
        { id: 'fs-highlighter', emoji: '\u{1F58D}\uFE0F', tool: 'highlighter', label: 'Highlighter' },
        { id: 'fs-text', emoji: '\u{1F524}', tool: 'text', label: 'Text' },
        { id: 'fs-line', emoji: '\u2796', tool: 'line', label: 'Line' },
        { id: 'fs-rect', emoji: '\u2B1C', tool: 'rect', label: 'Rectangle' },
        { id: 'fs-circle', emoji: '\u2B55', tool: 'circle', label: 'Circle' }
    ];
    
    // Tools label
    var toolsLabel = document.createElement('div');
    toolsLabel.style.cssText = 'color:#00d4ff;font-size:0.7em;font-family:Orbitron,monospace;font-weight:bold;letter-spacing:1px;margin-bottom:2px;';
    toolsLabel.textContent = 'TOOLS';
    toolsPanel.appendChild(toolsLabel);
    
    // Tool buttons row
    var toolRow = document.createElement('div');
    toolRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;';
    tools.forEach(function(t) {
        var btn = document.createElement('button');
        btn.id = t.id;
        btn.style.cssText = (whiteboardTool === t.tool) ? circBtnActiveStyle : circBtnStyle;
        btn.innerHTML = t.emoji;
        btn.title = t.label;
        btn.onclick = function() {
            setWhiteboardTool(t.tool);
            wbUpdateFsToolButtons();
        };
        toolRow.appendChild(btn);
    });
    toolsPanel.appendChild(toolRow);
    
    // Divider
    var div1 = document.createElement('div');
    div1.style.cssText = 'width:80%;height:1px;background:rgba(0,212,255,0.2);margin:4px 0;';
    toolsPanel.appendChild(div1);
    
    // Colors label
    var colorsLabel = document.createElement('div');
    colorsLabel.style.cssText = 'color:#00d4ff;font-size:0.7em;font-family:Orbitron,monospace;font-weight:bold;letter-spacing:1px;margin-bottom:2px;';
    colorsLabel.textContent = 'COLORS';
    toolsPanel.appendChild(colorsLabel);
    
    // Color swatches (circles)
    var colors = ['#00d4ff', '#ff4444', '#00ff88', '#ffff00', '#ff6600', '#ff00ff', '#ffffff', '#8844ff'];
    var colorRow = document.createElement('div');
    colorRow.id = 'wb-fs-color-row';
    colorRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;';
    colors.forEach(function(c) {
        var swatch = document.createElement('button');
        swatch.style.cssText = 'width:36px;height:36px;border-radius:50%;border:3px solid ' + (whiteboardColor === c ? '#fff' : 'rgba(255,255,255,0.2)') + ';cursor:pointer;background:' + c + ';transition:all 0.2s;';
        swatch.title = c;
        swatch.setAttribute('data-color', c);
        swatch.onclick = function() {
            whiteboardColor = c;
            var colorInput = document.getElementById('wb-color');
            if (colorInput) colorInput.value = c;
            wbUpdateFsColorSwatches();
        };
        colorRow.appendChild(swatch);
    });
    toolsPanel.appendChild(colorRow);
    
    // Divider
    var div2 = document.createElement('div');
    div2.style.cssText = 'width:80%;height:1px;background:rgba(0,212,255,0.2);margin:4px 0;';
    toolsPanel.appendChild(div2);
    
    // Size label
    var sizeLabel = document.createElement('div');
    sizeLabel.style.cssText = 'color:#00d4ff;font-size:0.7em;font-family:Orbitron,monospace;font-weight:bold;letter-spacing:1px;margin-bottom:2px;';
    sizeLabel.textContent = 'SIZE';
    toolsPanel.appendChild(sizeLabel);
    
    // Size slider
    var sizeRow = document.createElement('div');
    sizeRow.style.cssText = 'display:flex;align-items:center;gap:8px;';
    var sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '1';
    sizeSlider.max = '30';
    sizeSlider.value = whiteboardSize;
    sizeSlider.style.cssText = 'width:120px;accent-color:#00d4ff;';
    sizeSlider.oninput = function() {
        whiteboardSize = parseInt(this.value);
        var mainSlider = document.getElementById('wb-size');
        if (mainSlider) mainSlider.value = this.value;
    };
    sizeRow.appendChild(sizeSlider);
    toolsPanel.appendChild(sizeRow);
    
    // Divider
    var div3 = document.createElement('div');
    div3.style.cssText = 'width:80%;height:1px;background:rgba(0,212,255,0.2);margin:4px 0;';
    toolsPanel.appendChild(div3);
    
    // Action buttons row (Undo, Redo, Grid, Clear, Save, Download, Exit)
    var actionsLabel = document.createElement('div');
    actionsLabel.style.cssText = 'color:#00d4ff;font-size:0.7em;font-family:Orbitron,monospace;font-weight:bold;letter-spacing:1px;margin-bottom:2px;';
    actionsLabel.textContent = 'ACTIONS';
    toolsPanel.appendChild(actionsLabel);
    
    var actions = [
        { emoji: '\u21A9\uFE0F', label: 'Undo', fn: 'undoWhiteboard()' },
        { emoji: '\u21AA\uFE0F', label: 'Redo', fn: 'redoWhiteboard()' },
        { emoji: '\u{1F4CF}', label: 'Grid', fn: 'toggleWhiteboardGrid()' },
        { emoji: '\u{1F5D1}\uFE0F', label: 'Clear', fn: 'clearWhiteboardCanvas()' },
        { emoji: '\u{1F4BE}', label: 'Save', fn: 'saveWhiteboardNote()' },
        { emoji: '\u2B07\uFE0F', label: 'Download', fn: 'downloadWhiteboardNote()' },
        { emoji: '', label: 'EXIT', fn: 'toggleWhiteboardFullscreen()' }
    ];
    
    var actRow = document.createElement('div');
    actRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;';
    actions.forEach(function(a) {
        var btn = document.createElement('button');
        if (a.label === 'EXIT') {
            btn.style.cssText = 'padding:8px 18px;background:#ff4444;color:#fff;border:2px solid #ff4444;border-radius:10px;cursor:pointer;font-family:Orbitron,monospace;font-weight:900;font-size:1em;letter-spacing:2px;';
            btn.innerHTML = 'EXIT';
            btn.title = 'Exit Fullscreen';
        } else {
            btn.style.cssText = circBtnStyle;
            btn.innerHTML = a.emoji;
            btn.title = a.label;
        }
        btn.onclick = function() { eval(a.fn); };
        actRow.appendChild(btn);
    });
    toolsPanel.appendChild(actRow);
    
    floatDiv.appendChild(toolsPanel);
    
    // Main toggle button (big circle)
    var toggleBtn = document.createElement('button');
    toggleBtn.id = 'wb-fs-toggle';
    toggleBtn.style.cssText = 'width:56px;height:56px;border-radius:50%;border:none;background:linear-gradient(135deg,#00d4ff,#ff6600);color:#fff;font-size:1.5em;cursor:pointer;box-shadow:0 4px 20px rgba(0,212,255,0.4);transition:all 0.3s;display:flex;align-items:center;justify-content:center;';
    toggleBtn.innerHTML = '\u{1F3A8}';
    toggleBtn.title = 'Toggle Tools';
    toggleBtn.onclick = function() {
        wbFsToolsOpen = !wbFsToolsOpen;
        toolsPanel.style.display = wbFsToolsOpen ? 'flex' : 'none';
        toggleBtn.innerHTML = wbFsToolsOpen ? '\u2716' : '\u{1F3A8}';
        toggleBtn.style.background = wbFsToolsOpen ? 'linear-gradient(135deg,#ff4444,#cc0000)' : 'linear-gradient(135deg,#00d4ff,#ff6600)';
    };
    floatDiv.appendChild(toggleBtn);
    
    parent.appendChild(floatDiv);
}

function toggleWhiteboardRotation() {
    whiteboardIsRotated = !whiteboardIsRotated;
    var wrapper = document.getElementById('wb-canvas-wrapper');
    var section = document.getElementById('whiteboard-section');
    var target = whiteboardIsFullscreen ? section : wrapper;
    if (target) {
        if (whiteboardIsRotated) {
            target.style.transform = 'rotate(90deg)';
            target.style.transformOrigin = 'center center';
        } else {
            target.style.transform = '';
            target.style.transformOrigin = '';
        }
    }
    var btn = document.getElementById('wb-rotate-btn');
    if (btn) btn.innerHTML = whiteboardIsRotated ? '&#x1F504; PORTRAIT' : '&#x1F504; ROTATE';
}

function wbUpdateFsToolButtons() {
    var tools = [
        { id: 'fs-pen', tool: 'pen' },
        { id: 'fs-eraser', tool: 'eraser' },
        { id: 'fs-highlighter', tool: 'highlighter' },
        { id: 'fs-text', tool: 'text' },
        { id: 'fs-line', tool: 'line' },
        { id: 'fs-rect', tool: 'rect' },
        { id: 'fs-circle', tool: 'circle' }
    ];
    tools.forEach(function(t) {
        var btn = document.getElementById(t.id);
        if (btn) {
            if (whiteboardTool === t.tool) {
                btn.style.background = '#00d4ff';
                btn.style.borderColor = '#00d4ff';
            } else {
                btn.style.background = '#222';
                btn.style.borderColor = '#444';
            }
        }
    });
}

function wbUpdateFsColorSwatches() {
    var colorRow = document.getElementById('wb-fs-color-row');
    if (!colorRow) return;
    var swatches = colorRow.querySelectorAll('button');
    swatches.forEach(function(s) {
        var c = s.getAttribute('data-color');
        s.style.borderColor = (whiteboardColor === c) ? '#fff' : 'rgba(255,255,255,0.2)';
    });
}

function resizeWhiteboardForFullscreen() {
    if (!whiteboardCanvas || !whiteboardCtx) return;
    // Save current drawing
    var imgData = whiteboardCanvas.toDataURL();
    var dpr = window.devicePixelRatio || 1;
    // Canvas fills entire screen in fullscreen (no toolbar)
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    
    // Make canvas wrapper fill screen
    var wrapper = document.getElementById('wb-canvas-wrapper');
    if (wrapper) {
        wrapper.style.border = 'none';
        wrapper.style.borderRadius = '0';
        wrapper.style.width = '100vw';
        wrapper.style.height = '100vh';
        wrapper.style.position = 'fixed';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.zIndex = '99998';
    }
    
    whiteboardCanvas.width = newWidth * dpr;
    whiteboardCanvas.height = newHeight * dpr;
    whiteboardCanvas.style.width = newWidth + 'px';
    whiteboardCanvas.style.height = newHeight + 'px';
    whiteboardCtx.setTransform(1, 0, 0, 1, 0, 0);
    whiteboardCtx.scale(dpr, dpr);
    whiteboardCtx.fillStyle = '#1a1a2e';
    whiteboardCtx.fillRect(0, 0, newWidth, newHeight);
    if (whiteboardShowGrid) drawWhiteboardGrid();
    
    // Restore drawing
    var img = new Image();
    img.onload = function() {
        whiteboardCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width / dpr, img.height / dpr);
    };
    img.src = imgData;
}

function resizeWhiteboardNormal() {
    if (!whiteboardCanvas || !whiteboardCtx) return;
    var imgData = whiteboardCanvas.toDataURL();
    
    // Restore canvas wrapper from fullscreen positioning
    var wrapper = document.getElementById('wb-canvas-wrapper');
    if (wrapper) {
        wrapper.style.border = '2px solid #333';
        wrapper.style.borderRadius = '12px';
        wrapper.style.width = '';
        wrapper.style.height = '';
        wrapper.style.position = 'relative';
        wrapper.style.top = '';
        wrapper.style.left = '';
        wrapper.style.zIndex = '';
    }
    
    var container = whiteboardCanvas.parentElement;
    if (!container) return;
    var dpr = window.devicePixelRatio || 1;
    var displayWidth = container.offsetWidth;
    var displayHeight = Math.max(500, window.innerHeight * 0.5);
    
    whiteboardCanvas.width = displayWidth * dpr;
    whiteboardCanvas.height = displayHeight * dpr;
    whiteboardCanvas.style.width = displayWidth + 'px';
    whiteboardCanvas.style.height = displayHeight + 'px';
    whiteboardCtx.setTransform(1, 0, 0, 1, 0, 0);
    whiteboardCtx.scale(dpr, dpr);
    whiteboardCtx.fillStyle = '#1a1a2e';
    whiteboardCtx.fillRect(0, 0, displayWidth, displayHeight);
    if (whiteboardShowGrid) drawWhiteboardGrid();
    
    var img = new Image();
    img.onload = function() {
        whiteboardCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width / dpr, img.height / dpr);
    };
    img.src = imgData;
}

// Grid toggle - ruled lines like a notebook (Samsung Notes style)
function toggleWhiteboardGrid() {
    whiteboardShowGrid = !whiteboardShowGrid;
    var btn = document.getElementById('wb-grid-btn');
    if (btn) btn.style.background = whiteboardShowGrid ? '#00d4ff' : '#333';
    
    if (whiteboardShowGrid) {
        // Save current state, draw grid, then restore drawing on top
        var imgData = whiteboardCanvas.toDataURL();
        var dpr = window.devicePixelRatio || 1;
        var w = whiteboardCanvas.width / dpr;
        var h = whiteboardCanvas.height / dpr;
        whiteboardCtx.fillStyle = '#1a1a2e';
        whiteboardCtx.fillRect(0, 0, w, h);
        drawWhiteboardGrid();
        var img = new Image();
        img.onload = function() {
            // Draw old content on top of grid (but grid lines show through transparent areas)
            whiteboardCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
            saveWhiteboardState();
        };
        img.src = imgData;
    } else {
        saveWhiteboardState();
    }
}

function drawWhiteboardGrid() {
    if (!whiteboardCtx || !whiteboardCanvas) return;
    var dpr = window.devicePixelRatio || 1;
    var w = whiteboardCanvas.width / dpr;
    var h = whiteboardCanvas.height / dpr;
    var spacing = 30;
    
    whiteboardCtx.save();
    whiteboardCtx.strokeStyle = 'rgba(100, 100, 150, 0.15)';
    whiteboardCtx.lineWidth = 0.5;
    
    // Vertical lines
    for (var x = spacing; x < w; x += spacing) {
        whiteboardCtx.beginPath();
        whiteboardCtx.moveTo(x, 0);
        whiteboardCtx.lineTo(x, h);
        whiteboardCtx.stroke();
    }
    // Horizontal lines
    for (var y = spacing; y < h; y += spacing) {
        whiteboardCtx.beginPath();
        whiteboardCtx.moveTo(0, y);
        whiteboardCtx.lineTo(w, y);
        whiteboardCtx.stroke();
    }
    whiteboardCtx.restore();
}

// Open chapter
function openChapter(chapterId) {
    appState.currentChapter = getActiveChapters().find(c => c.id === chapterId);
    renderChapterContent();
}

// Render chapter content
function renderChapterContent() {
    const chapter = appState.currentChapter;
    const media = getActiveChapterMedia()[chapter.id] || {};
    const isClass7 = getSelectedClass() === '7';
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('chapter-content-section').classList.add('active');
    
    document.getElementById('chapter-content').innerHTML = `
        <button class="btn btn-secondary" onclick="backToChapters()" style="margin-bottom: 20px;">
            ← Back to Chapters
        </button>
        <h2 class="section-title">Chapter ${chapter.number}: ${chapter.title}</h2>
        
        <!-- Tab-Style Media Buttons -->
        <div style="display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 140px;">
                <button onclick="${media.pptUrl ? `showChapterPPT(${chapter.id})` : "alert('PPT not available yet')"}" style="width: 100%; padding: 14px 20px; border: 2px solid ${media.pptUrl ? '#00ffff' : '#666'}; background: ${media.pptUrl ? 'linear-gradient(135deg, #003366, #006699)' : 'rgba(100,100,100,0.2)'}; color: ${media.pptUrl ? '#fff' : '#999'}; font-family: 'Orbitron', monospace; font-size: 0.95em; cursor: pointer; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s;">📊 PPT</button>
                ${!media.pptUrl ? '<p style="text-align:center; color:#ff6600; font-size:0.8em; margin-top:6px; font-family:Orbitron,monospace;">Coming Soon</p>' : ''}
            </div>
            <div style="flex: 1; min-width: 140px;">
                <button onclick="${media.videoUrl ? `showChapterVideo(${chapter.id})` : "alert('Video not available yet')"}" style="width: 100%; padding: 14px 20px; border: 2px solid ${media.videoUrl ? '#ff00ff' : '#666'}; background: ${media.videoUrl ? 'linear-gradient(135deg, #660066, #990099)' : 'rgba(100,100,100,0.2)'}; color: ${media.videoUrl ? '#fff' : '#999'}; font-family: 'Orbitron', monospace; font-size: 0.95em; cursor: pointer; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s;">🎬 Video</button>
                ${!media.videoUrl ? '<p style="text-align:center; color:#ff6600; font-size:0.8em; margin-top:6px; font-family:Orbitron,monospace;">Coming Soon</p>' : ''}
            </div>
            ${media.formulaVideoId ? `<div style="flex: 1; min-width: 140px;"><button onclick="showChapterFormulaVideo(${chapter.id})" style="width: 100%; padding: 14px 20px; border: 2px solid #ff6600; background: linear-gradient(135deg, #ff6600, #ff00ff); color: #fff; font-family: 'Orbitron', monospace; font-size: 0.95em; cursor: pointer; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">🧮 Formula</button></div>` : ''}
            ${media.tbUrl ? `<div style="flex: 1; min-width: 140px;"><button onclick="showChapterTextbook(${chapter.id})" style="width: 100%; padding: 14px 20px; border: 2px solid #00ff88; background: linear-gradient(135deg, #004d00, #009900); color: #fff; font-family: 'Orbitron', monospace; font-size: 0.95em; cursor: pointer; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">📖 Textbook</button></div>` : ''}
        </div>
        
        <h3 style="color: #00ffff; font-family: 'Orbitron', monospace; margin-bottom: 20px;">TOPICS IN THIS CHAPTER</h3>
        <p style="color: #aaa; margin-bottom: 20px;">Click on any topic to read the detailed explanation:</p>
        
        <div class="chapter-content">
            ${chapter.topics.map((topic, index) => `
                <div class="topic" onclick="showTopicDetail(${chapter.id}, ${index})" style="cursor: pointer;">
                    <h3>${topic.name}</h3>
                    <p style="color: #888; font-size: 0.9em;">Click to read detailed explanation...</p>
                </div>
            `).join('')}
        </div>
        
        <div class="btn-group" style="margin-top: 30px;">
            <button class="btn btn-primary" onclick="startQuiz(${chapter.id})">
                Take Chapter Quiz (40 Questions)
            </button>
        </div>
    `;
}

// Show topic detail with full explanation
function showTopicDetail(chapterId, topicIndex) {
    const chapter = getActiveChapters().find(c => c.id === chapterId);
    const topic = chapter.topics[topicIndex];
    const media = getActiveChapterMedia()[chapterId] || {};
    const isClass7 = getSelectedClass() === '7';
    const totalTopics = chapter.topics.length;
    
    document.getElementById('chapter-content').innerHTML = `
        <button class="btn btn-secondary" onclick="renderChapterContent()" style="margin-bottom: 20px;">
            ← Back to Chapter ${chapter.number}
        </button>
        <h2 class="section-title">${topic.name}</h2>
        <p style="color: #00ffff; font-family: 'Orbitron', monospace; font-size: 0.85em; margin-bottom: 15px;">Topic ${topicIndex + 1} of ${totalTopics}</p>
        
        <!-- Tab-Style Media Buttons -->
        <div style="display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 120px;">
                <button onclick="${media.pptUrl ? `showChapterPPT(${chapter.id})` : "alert('PPT not available yet')"}" style="width: 100%; padding: 12px 16px; border: 2px solid ${media.pptUrl ? '#00ffff' : '#666'}; background: ${media.pptUrl ? 'linear-gradient(135deg, #003366, #006699)' : 'rgba(100,100,100,0.2)'}; color: ${media.pptUrl ? '#fff' : '#999'}; font-family: 'Orbitron', monospace; font-size: 0.9em; cursor: pointer; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">📊 PPT</button>
                ${!media.pptUrl ? '<p style="text-align:center; color:#ff6600; font-size:0.75em; margin-top:5px; font-family:Orbitron,monospace;">Coming Soon</p>' : ''}
            </div>
            <div style="flex: 1; min-width: 120px;">
                <button onclick="${media.videoUrl ? `showChapterVideo(${chapter.id})` : "alert('Video not available yet')"}" style="width: 100%; padding: 12px 16px; border: 2px solid ${media.videoUrl ? '#ff00ff' : '#666'}; background: ${media.videoUrl ? 'linear-gradient(135deg, #660066, #990099)' : 'rgba(100,100,100,0.2)'}; color: ${media.videoUrl ? '#fff' : '#999'}; font-family: 'Orbitron', monospace; font-size: 0.9em; cursor: pointer; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">🎬 Video</button>
                ${!media.videoUrl ? '<p style="text-align:center; color:#ff6600; font-size:0.75em; margin-top:5px; font-family:Orbitron,monospace;">Coming Soon</p>' : ''}
            </div>
            ${media.formulaVideoId ? `<div style="flex: 1; min-width: 120px;"><button onclick="showChapterFormulaVideo(${chapter.id})" style="width: 100%; padding: 12px 16px; border: 2px solid #ff6600; background: linear-gradient(135deg, #ff6600, #ff00ff); color: #fff; font-family: 'Orbitron', monospace; font-size: 0.9em; cursor: pointer; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">🧮 Formula</button></div>` : ''}
        </div>
        
        <div class="topic-detail" style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05)); padding: 30px; border: 2px solid rgba(0, 255, 255, 0.3); margin-bottom: 30px; border-radius: 10px;">
            <p style="font-size: 1.1em; line-height: 1.8; color: #ddd;">${topic.content}</p>
        </div>
        
        <!-- Topic Navigation -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            ${topicIndex > 0 ? `<button class="btn btn-secondary" onclick="showTopicDetail(${chapterId}, ${topicIndex - 1})" style="font-size: 0.9em;">← Previous Topic</button>` : '<div></div>'}
            ${topicIndex < totalTopics - 1 ? `<button class="btn btn-primary" onclick="showTopicDetail(${chapterId}, ${topicIndex + 1})" style="font-size: 0.9em;">Next Topic →</button>` : '<div></div>'}
        </div>
        
        <div class="btn-group">
            <button class="btn btn-secondary" onclick="renderChapterContent()">← Back to Topics</button>
            <button class="btn btn-primary" onclick="startQuiz(${chapter.id})">Take Quiz</button>
        </div>
    `;
}

// Show chapter video in overlay (same style as textbook viewer)
function showChapterVideo(chapterId) {
    var media = getActiveChapterMedia()[chapterId];
    if (!media || !media.videoUrl) {
        if (getSelectedClass() === '7') {
            alert('Video Coming Soon! Class 7 chapter videos are being prepared.');
        } else {
            alert('Video not available for this chapter.');
        }
        return;
    }

    var existing = document.getElementById('video-player-overlay');
    if (existing) existing.remove();

    var videoUrl = media.videoUrl;
    var isYouTube = videoUrl.indexOf('youtube.com') !== -1 || videoUrl.indexOf('youtu.be') !== -1;
    var isGoogleDrive = videoUrl.indexOf('drive.google.com') !== -1;
    var embedUrl = videoUrl;
    if (isYouTube) {
        var vid = '';
        if (videoUrl.indexOf('youtu.be/') !== -1) {
            vid = videoUrl.split('youtu.be/')[1].split('?')[0];
        } else if (videoUrl.indexOf('v=') !== -1) {
            vid = videoUrl.split('v=')[1].split('&')[0];
        } else if (videoUrl.indexOf('/embed/') !== -1) {
            vid = videoUrl.split('/embed/')[1].split('?')[0];
        }
        if (vid) embedUrl = 'https://www.youtube.com/embed/' + vid + '?rel=0&modestbranding=1&playsinline=1&autoplay=1&controls=1';
    }

    var overlay = document.createElement('div');
    overlay.id = 'video-player-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:10000;display:flex;flex-direction:column;';

    var fileId = '';
    var downloadUrl = '';
    if (isGoogleDrive) {
        fileId = videoUrl.replace('https://drive.google.com/file/d/', '').replace('/preview', '').replace('/view', '');
        downloadUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;
    }

    overlay.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;background:linear-gradient(135deg,#1a1a2e,#16213e);border-bottom:2px solid #00ffff;">' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
                '<span style="font-size:1.5em;">🎬</span>' +
                '<span style="color:#00ffff;font-family:Orbitron,monospace;font-size:1em;">' + sanitizeHTML(media.title || media.videoSummary || 'Chapter Video') + '</span>' +
            '</div>' +
            '<div style="display:flex;gap:8px;">' +
                (downloadUrl ? '<a href="' + downloadUrl + '" target="_blank" style="padding:6px 14px;background:#00a884;color:#fff;border:none;border-radius:6px;cursor:pointer;text-decoration:none;font-size:0.85em;display:flex;align-items:center;gap:4px;">⬇ Download</a>' : '') +
                '<button onclick="toggleVideoFullscreen()" style="padding:6px 14px;background:#0066ff;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">⛶ Fullscreen</button>' +
                '<button onclick="closeVideoPlayer()" style="padding:6px 14px;background:#ff4444;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">✕ Close</button>' +
            '</div>' +
        '</div>' +
        '<div id="video-player-area" style="flex:1;overflow:hidden;position:relative;">' +
            ((isYouTube || isGoogleDrive) ?
                '<iframe id="yt-player-frame" src="' + embedUrl + '" style="width:100%;height:100%;border:none;" allowfullscreen allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;fullscreen"></iframe>' :
                '<video id="custom-video-player" src="' + videoUrl + '" style="width:100%;height:100%;object-fit:contain;background:#000;" playsinline controls autoplay></video>') +
        '</div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function toggleVideoFullscreen() {
    var area = document.getElementById('video-player-area');
    if (!area) return;
    var iframe = document.getElementById('yt-player-frame');
    var video = document.getElementById('custom-video-player');
    var el = iframe || video || area;
    if (!document.fullscreenElement) {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
}

function toggleVideoPiP() {
    var video = document.getElementById('custom-video-player');
    if (!video) return;
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(function(e){});
    } else {
        video.requestPictureInPicture().catch(function(e){});
    }
}

function closeVideoPlayer() {
    var overlay = document.getElementById('video-player-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = '';
    }
}

// Show chapter PPT in overlay (same style as textbook viewer)
function showChapterPPT(chapterId) {
    const media = getActiveChapterMedia()[chapterId];
    if (!media || !media.pptUrl) {
        if (getSelectedClass() === '7') {
            alert('PPT Coming Soon! Class 7 chapter presentations are being prepared.');
        } else {
            alert('PPT not available for this chapter.');
        }
        return;
    }

    var existing = document.getElementById('ppt-viewer-overlay');
    if (existing) existing.remove();

    var fileId = media.pptUrl.replace('https://drive.google.com/file/d/', '').replace('/preview', '').replace('/view', '');
    var downloadUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;

    var overlay = document.createElement('div');
    overlay.id = 'ppt-viewer-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:10000;display:flex;flex-direction:column;';
    overlay.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;background:linear-gradient(135deg,#1a1a2e,#16213e);border-bottom:2px solid #00ffff;">' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
                '<span style="font-size:1.5em;">📊</span>' +
                '<span style="color:#00ffff;font-family:Orbitron,monospace;font-size:1em;">' + sanitizeHTML(media.pptTitle || 'Chapter Presentation') + '</span>' +
            '</div>' +
            '<div style="display:flex;gap:8px;">' +
                '<a href="' + downloadUrl + '" target="_blank" style="padding:6px 14px;background:#00a884;color:#fff;border:none;border-radius:6px;cursor:pointer;text-decoration:none;font-size:0.85em;display:flex;align-items:center;gap:4px;">⬇ Download</a>' +
                '<button onclick="togglePptFullscreen()" style="padding:6px 14px;background:#0066ff;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">⛶ Fullscreen</button>' +
                '<button onclick="closePptViewer()" style="padding:6px 14px;background:#ff4444;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">✕ Close</button>' +
            '</div>' +
        '</div>' +
        '<div style="flex:1;overflow:hidden;position:relative;">' +
            '<iframe id="ppt-viewer-frame" src="' + media.pptUrl + '" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>' +
        '</div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

// Show chapter textbook in overlay
function showChapterTextbook(chapterId) {
    const media = getActiveChapterMedia()[chapterId];
    if (!media || !media.tbUrl) {
        if (getSelectedClass() === '7') {
            alert('Textbook Coming Soon! Class 7 chapter textbooks are being prepared.');
        } else {
            alert('Textbook not available for this chapter.');
        }
        return;
    }

    const fileId = media.tbUrl.replace('https://drive.google.com/file/d/', '').replace('/preview', '');
    const downloadUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;

    const overlay = document.createElement('div');
    overlay.id = 'pdf-viewer-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:10000;display:flex;flex-direction:column;';
    overlay.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;background:linear-gradient(135deg,#1a1a2e,#16213e);border-bottom:2px solid #00ffff;">' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
                '<span style="font-size:1.5em;">📖</span>' +
                '<span style="color:#00ffff;font-family:Orbitron,monospace;font-size:1em;">' + sanitizeHTML(media.tbTitle || 'Chapter Textbook') + '</span>' +
            '</div>' +
            '<div style="display:flex;gap:8px;">' +
                '<a href="' + downloadUrl + '" target="_blank" style="padding:6px 14px;background:#00a884;color:#fff;border:none;border-radius:6px;cursor:pointer;text-decoration:none;font-size:0.85em;display:flex;align-items:center;gap:4px;">⬇ Download</a>' +
                '<button onclick="togglePdfFullscreen()" style="padding:6px 14px;background:#0066ff;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">⛶ Fullscreen</button>' +
                '<button onclick="closePdfViewer()" style="padding:6px 14px;background:#ff4444;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">✕ Close</button>' +
            '</div>' +
        '</div>' +
        '<div style="flex:1;overflow:hidden;position:relative;">' +
            '<iframe id="pdf-viewer-frame" src="' + media.tbUrl + '" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>' +
        '</div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function togglePdfFullscreen() {
    var frame = document.getElementById('pdf-viewer-frame');
    if (frame) {
        if (frame.requestFullscreen) frame.requestFullscreen();
        else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
        else if (frame.msRequestFullscreen) frame.msRequestFullscreen();
    }
}

function closePdfViewer() {
    var overlay = document.getElementById('pdf-viewer-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = '';
    }
}

function togglePptFullscreen() {
    var frame = document.getElementById('ppt-viewer-frame');
    if (frame) {
        if (frame.requestFullscreen) frame.requestFullscreen();
        else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
        else if (frame.msRequestFullscreen) frame.msRequestFullscreen();
    }
}

function closePptViewer() {
    var overlay = document.getElementById('ppt-viewer-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = '';
    }
}

// Back to chapters
function backToChapters() {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('chapters-section').classList.add('active');
    renderChapters();
}

// Start quiz with screen sharing permission request
async function requestExamPermissions() {
    try {
        var stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        appState.examCameraStream = stream;
        return true;
    } catch (e) {
        console.log('Camera/mic permission denied or unavailable:', e);
        return false;
    }
}

var examPhases = ['mcq', 'caseBased', 'veryShort', 'short', 'long'];
var examPhaseLabels = { mcq: 'Section A: MCQ', caseBased: 'Section B: Case-Based', veryShort: 'Section C: Very Short Answer', short: 'Section D: Short Answer', long: 'Section E: Long Answer' };
var examPhaseDescriptions = { mcq: 'Select the correct option for each question.', caseBased: 'Read the scenario and select the correct option.', veryShort: 'Write your answer on paper and take a photo.', short: 'Write your answer on paper and take a photo.', long: 'Write a detailed answer on paper and take a photo.' };

function getExamPhaseQuestions(quiz) {
    var qs = quiz.questions;
    var perGroup = Math.floor(qs.length / 5);
    return {
        mcq: qs.slice(0, perGroup),
        caseBased: qs.slice(perGroup, perGroup * 2),
        veryShort: qs.slice(perGroup * 2, perGroup * 3),
        short: qs.slice(perGroup * 3, perGroup * 4),
        long: qs.slice(perGroup * 4)
    };
}

var currentExamPhase = 'mcq';
var examPhaseIndex = 0;
var examPhaseQuestionIndex = 0;

function startQuiz(chapterId) {
    const chapter = getActiveChapters().find(c => c.id === chapterId);
    
    var confirmed = confirm(
        'CAMERA, MICROPHONE & SCREEN PERMISSION REQUIRED\n\n' +
        'GANITA PRAKASH needs access to your camera, microphone, and screen during the exam to ensure fair assessment.\n\n' +
        'IMPORTANT RULES:\n\n' +
        '1. Your camera, microphone & screen will be monitored\n' +
        '2. If you leave the app, your exam will be auto-submitted\n' +
        '3. Any cheating will result in automatic submission\n' +
        '4. You have limited time to complete\n' +
        '5. Make sure you are in a quiet, well-lit place\n\n' +
        'EXAM FORMAT:\n' +
        '- Section A: MCQ (Select option)\n' +
        '- Section B: Case-Based (Select option)\n' +
        '- Section C: Very Short Answer (Write on paper + Photo)\n' +
        '- Section D: Short Answer (Write on paper + Photo)\n' +
        '- Section E: Long Answer (Write on paper + Photo)\n\n' +
        'Click OK to Allow & Start Exam or Cancel to go back.'
    );
    
    if (!confirmed) return;
    
    appState.currentQuiz = chapter;
    appState.currentQuestion = 0;
    appState.score = 0;
    appState.answers = [];
    appState.isMonitoring = true;
    currentExamPhase = 'mcq';
    examPhaseIndex = 0;
    examPhaseQuestionIndex = 0;
    
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('quiz-section').classList.add('active');
    
    showExamPhaseIntro();
    
    (async function() {
        try {
            var permsGranted = await requestExamPermissions();
            if (!permsGranted) {
                console.log('Camera and microphone access denied');
            }
        } catch(e) { console.log('Permission request error:', e); }
        
        try {
            var screenShareStarted = await startScreenSharing();
            if (!screenShareStarted) {
                console.log('Screen sharing denied');
            }
        } catch(e) { console.log('Screen share error:', e); }
    })();
}

function showExamPhaseIntro() {
    var phase = examPhases[examPhaseIndex];
    var phaseQuestions = getExamPhaseQuestions(appState.currentQuiz)[phase];
    var isWritten = (phase === 'veryShort' || phase === 'short' || phase === 'long');
    document.getElementById('quiz-container').innerHTML = `
        <h2 class="section-title">Chapter ${appState.currentQuiz.number} Quiz: ${appState.currentQuiz.title}</h2>
        <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 3em; margin-bottom: 15px;">${isWritten ? '📝' : '📋'}</div>
            <h3 style="color: #E94560; font-size: 22px; margin-bottom: 10px;">${examPhaseLabels[phase]}</h3>
            <p style="color: #aaa; margin-bottom: 10px;">${examPhaseDescriptions[phase]}</p>
            <p style="color: #fff; font-size: 16px; margin-bottom: 5px;"><strong>${phaseQuestions.length} Questions</strong></p>
            ${isWritten ? '<p style="color: #2196F3; font-size: 14px; margin-bottom: 20px;">Write your answer on paper, then use the camera to take a photo of your work.</p>' : '<p style="color: #4CAF50; font-size: 14px; margin-bottom: 20px;">Select the correct answer from the given options.</p>'}
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin: 15px auto; max-width: 350px;">
                <p style="font-size: 13px; color: #888;">Section ${examPhaseIndex + 1} of 5</p>
            </div>
            <button class="btn btn-primary" onclick="startExamPhase()" style="margin-top: 15px;">
                Start ${examPhaseLabels[phase]}
            </button>
        </div>
    `;
}

function startExamPhase() {
    examPhaseQuestionIndex = 0;
    renderQuizQuestion();
}

// Render quiz question
var examPhotos = [];

function captureExamPhoto() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            var globalIdx = appState.currentQuestion;
            examPhotos.push({ question: globalIdx, phase: currentExamPhase, photo: ev.target.result });
            var photoBtn = document.getElementById('photo-status');
            if (photoBtn) photoBtn.textContent = 'Photo Attached';
            var submitBtn = document.getElementById('submit-btn');
            if (submitBtn) submitBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function renderQuizQuestion() {
    var quiz = appState.currentQuiz;
    var phase = examPhases[examPhaseIndex];
    currentExamPhase = phase;
    var phaseQuestions = getExamPhaseQuestions(quiz)[phase];
    var question = phaseQuestions[examPhaseQuestionIndex];
    var total = phaseQuestions.length;
    var isWritten = (phase === 'veryShort' || phase === 'short' || phase === 'long');
    var globalIdx = 0;
    var phaseGroups = getExamPhaseQuestions(quiz);
    for (var pi = 0; pi < examPhaseIndex; pi++) { globalIdx += phaseGroups[examPhases[pi]].length; }
    globalIdx += examPhaseQuestionIndex;
    appState.currentQuestion = globalIdx;
    
    var hasPhoto = examPhotos.some(function(p) { return p.question === globalIdx; });
    
    var isLastInPhase = (examPhaseQuestionIndex === total - 1);
    var isLastPhase = (examPhaseIndex === examPhases.length - 1);
    var nextBtnText = isLastInPhase ? (isLastPhase ? 'Finish Exam' : 'Next Section') : 'Next Question';
    
    if (isWritten) {
        document.getElementById('quiz-container').innerHTML = `
            <h2 class="section-title">${examPhaseLabels[phase]}</h2>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #E94560; font-size: 13px; font-weight: bold;">${examPhaseLabels[phase]}</span>
                <span style="color: #888; font-size: 12px;">Section ${examPhaseIndex + 1}/5</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${(examPhaseQuestionIndex / total) * 100}%"></div>
            </div>
            <div class="progress-text">Question ${examPhaseQuestionIndex + 1} of ${total}</div>
            
            <div class="question-card" style="border-left: 4px solid #FF9800;">
                <div class="question-number" style="color: #FF9800;">Question ${examPhaseQuestionIndex + 1} (${phase === 'long' ? 'Long Answer' : phase === 'short' ? 'Short Answer' : 'Very Short Answer'})</div>
                <div class="question-text" style="font-size: 17px; line-height: 1.6; margin-bottom: 20px;">${question.q}</div>
                
                <div style="background: rgba(255,152,0,0.1); border: 2px dashed rgba(255,152,0,0.4); border-radius: 12px; padding: 25px; text-align: center; margin: 15px 0;">
                    <p style="color: #FF9800; font-size: 15px; margin-bottom: 15px; font-weight: bold;">Write your answer on paper</p>
                    <p style="color: #aaa; font-size: 13px; margin-bottom: 20px;">Then take a photo of your handwritten work</p>
                    <button onclick="captureExamPhoto()" style="background: linear-gradient(135deg, #FF9800, #F57C00); color: #fff; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: bold;">
                        📷 Take Photo of Your Answer
                    </button>
                    <div id="photo-status" style="color: #4CAF50; font-size: 14px; margin-top: 12px; font-weight: bold;">${hasPhoto ? 'Photo Attached' : ''}</div>
                </div>
            </div>
            
            <div class="btn-group">
                <button class="btn btn-primary" onclick="submitAnswer()" id="submit-btn" ${hasPhoto ? '' : 'disabled'}>
                    ${nextBtnText}
                </button>
            </div>
        `;
    } else {
        document.getElementById('quiz-container').innerHTML = `
            <h2 class="section-title">${examPhaseLabels[phase]}</h2>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #4CAF50; font-size: 13px; font-weight: bold;">${examPhaseLabels[phase]}</span>
                <span style="color: #888; font-size: 12px;">Section ${examPhaseIndex + 1}/5</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${(examPhaseQuestionIndex / total) * 100}%"></div>
            </div>
            <div class="progress-text">Question ${examPhaseQuestionIndex + 1} of ${total}</div>
            
            <div class="question-card">
                <div class="question-number">Question ${examPhaseQuestionIndex + 1} (${phase === 'mcq' ? 'MCQ' : 'Case-Based'})</div>
                <div class="question-text">${question.q}</div>
                
                <div style="margin: 15px 0 10px; padding: 10px 15px; background: rgba(33,150,243,0.1); border-radius: 8px; border: 1px solid rgba(33,150,243,0.3); display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #aaa; font-size: 13px;">Select an option below <strong style="color:#fff;">OR</strong> submit your answer on paper</span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button onclick="captureExamPhoto()" style="background: linear-gradient(135deg, #2196F3, #1565C0); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px;">
                            📷 Photo Answer
                        </button>
                        <span id="photo-status" style="color: #4CAF50; font-size: 12px;">${hasPhoto ? 'Photo Attached' : ''}</span>
                    </div>
                </div>
                
                <div class="options">
                    ${question.options.map((opt, i) => `
                        <div class="option" onclick="selectOption(${i})" id="option-${i}">
                            ${String.fromCharCode(65 + i)}. ${opt}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="btn-group">
                <button class="btn btn-primary" onclick="submitAnswer()" id="submit-btn" disabled>
                    ${nextBtnText}
                </button>
            </div>
        `;
    }
}

let selectedOption = null;
function selectOption(index) {
    if (selectedOption !== null) return; // Already answered
    selectedOption = index;
    var quiz = appState.currentQuiz;
    var phase = examPhases[examPhaseIndex];
    var phaseQuestions = getExamPhaseQuestions(quiz)[phase];
    var question = phaseQuestions[examPhaseQuestionIndex];
    var isCorrect = (index === question.answer);
    
    // Highlight correct/incorrect options
    document.querySelectorAll('.option').forEach(function(opt, i) {
        opt.classList.remove('selected');
        opt.style.pointerEvents = 'none';
        if (i === question.answer) {
            opt.style.border = '2px solid #4CAF50';
            opt.style.background = 'rgba(76,175,80,0.15)';
        }
        if (i === index && !isCorrect) {
            opt.style.border = '2px solid #f44336';
            opt.style.background = 'rgba(244,67,54,0.15)';
        }
    });
    
    // Show feedback banner + Why button
    var feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'chapter-feedback';
    feedbackDiv.innerHTML = '<div style="background:' + (isCorrect ? 'rgba(76,175,80,0.15);border:1px solid #4CAF50' : 'rgba(244,67,54,0.15);border:1px solid #f44336') + ';border-radius:10px;padding:12px 18px;margin:12px 0;display:flex;align-items:center;gap:10px;">' +
        '<span style="font-size:22px;">' + (isCorrect ? '\u2713' : '\u2717') + '</span>' +
        '<div><strong style="color:' + (isCorrect ? '#4CAF50' : '#f44336') + ';">' + (isCorrect ? 'Correct!' : 'Incorrect') + '</strong>' +
        '<div style="color:#aaa;font-size:13px;">' + (isCorrect ? 'Great job, keep going!' : 'The correct answer is: ' + String.fromCharCode(65 + question.answer) + '. ' + question.options[question.answer]) + '</div></div></div>' +
        '<div onclick="toggleChapterWhy(this)" style="cursor:pointer;background:rgba(255,193,7,0.1);border:1px solid rgba(255,193,7,0.4);border-radius:8px;padding:10px 15px;margin:8px 0;display:flex;justify-content:space-between;align-items:center;">' +
        '<span><strong style="color:#FFC107;">Why?</strong> <span style="color:#aaa;font-size:13px;">Tap to see why this is the answer</span></span>' +
        '<span style="color:#FFC107;">\u25B6</span></div>' +
        '<div id="chapter-why-content" style="display:none;background:rgba(255,255,255,0.05);border-radius:8px;padding:12px 15px;margin:4px 0;color:#ccc;font-size:14px;line-height:1.6;">' +
        (question.why || 'The correct answer is ' + String.fromCharCode(65 + question.answer) + '. ' + question.options[question.answer]) + '</div>';
    
    var btnGroup = document.querySelector('#quiz-container .btn-group');
    if (btnGroup) { btnGroup.parentNode.insertBefore(feedbackDiv, btnGroup); }
    
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('submit-btn').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleChapterWhy(el) {
    var whyDiv = document.getElementById('chapter-why-content');
    if (whyDiv) {
        var isHidden = whyDiv.style.display === 'none';
        whyDiv.style.display = isHidden ? 'block' : 'none';
        var arrow = el.querySelector('span:last-child');
        if (arrow) arrow.textContent = isHidden ? '\u25BC' : '\u25B6';
    }
}

async function submitAnswer() {
    var quiz = appState.currentQuiz;
    var phase = examPhases[examPhaseIndex];
    var phaseQuestions = getExamPhaseQuestions(quiz)[phase];
    var question = phaseQuestions[examPhaseQuestionIndex];
    var isWritten = (phase === 'veryShort' || phase === 'short' || phase === 'long');
    
    if (isWritten) {
        var globalIdx = appState.currentQuestion;
        var photoEntry = examPhotos.find(function(p) { return p.question === globalIdx; });
        var photoCorrect = false;
        
        if (photoEntry && photoEntry.photo) {
            // Disable submit button during verification
            var submitBtn = document.getElementById('submit-btn');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Verifying...'; }
            
            var verifyResult = await verifyPhotoAnswer(photoEntry.photo, question, question.options ? question.options[question.answer] : '');
            photoCorrect = verifyResult.is_correct;
            
            // Show verification result
            var statusEl = document.getElementById('photo-status');
            if (statusEl) {
                statusEl.innerHTML = photoCorrect ? 
                    '<span style="color:#4CAF50;">Answer Correct! (' + sanitizeHTML(verifyResult.extracted_text || '') + ')</span>' :
                    '<span style="color:#f44336;">Incorrect. Expected: ' + sanitizeHTML(question.options ? question.options[question.answer] : '') + '</span>';
            }
            
            // Brief pause to show result
            await new Promise(function(r) { setTimeout(r, 1500); });
        }
        
        appState.answers.push({ selected: -1, correct: question.answer, question: question.q, options: question.options || [], type: phase, photoSubmitted: true, photoVerified: photoCorrect });
        if (photoCorrect) {
            appState.score++;
        }
    } else {
        appState.answers.push({ selected: selectedOption, correct: question.answer, question: question.q, options: question.options, type: phase });
        if (selectedOption === question.answer) {
            appState.score++;
        }
    }
    
    examPhaseQuestionIndex++;
    selectedOption = null;
    
    if (examPhaseQuestionIndex >= phaseQuestions.length) {
        examPhaseIndex++;
        if (examPhaseIndex >= examPhases.length) {
            submitExamToBackend();
            showQuizResult();
        } else {
            showExamPhaseIntro();
        }
    } else {
        renderQuizQuestion();
    }
}

async function submitExamToBackend() {
    try {
        await fetch(API_URL + '/api/exam/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({
                exam_type: 'chapter',
                chapter_id: appState.currentQuiz.id,
                score: appState.score,
                total: appState.currentQuiz.questions.length,
                answers: appState.answers,
                photos: examPhotos
            })
        });
    } catch (e) { console.log('Exam submit error:', e); }
    examPhotos = [];
}

// Show quiz result
function showQuizResult() {
    appState.isMonitoring = false;
    stopScreenSharing();
    
    const quiz = appState.currentQuiz;
    const total = quiz.questions.length;
    const percentage = Math.round((appState.score / total) * 100);
    const passed = appState.score >= 35;
    
    if (passed) {
        var progress = getChapterProgress();
        var scores = getChapterScores();
        progress[quiz.id] = 'completed';
        scores[quiz.id] = percentage;
        setChapterProgress(progress);
        setChapterScores(scores);
    }
    
    const modal = document.getElementById('result-modal');
    document.getElementById('result-icon').innerHTML = passed ? '🎉' : '📚';
    document.getElementById('result-icon').className = `result-icon ${passed ? 'pass' : 'fail'}`;
    document.getElementById('result-score').textContent = `${appState.score}/${total} (${percentage}%)`;
    
    if (passed) {
        document.getElementById('result-message').innerHTML = `
            <strong>Congratulations!</strong><br>
            You passed the Chapter ${quiz.number} Quiz!<br><br>
            ${quiz.id === getActiveChapters().length ? 
                '<span style="color: #4CAF50; font-size: 1.2em;">Be ready for Science Curiosity - Thanks!</span><br><br>' +
                'You have completed all chapters! Take the Final Exam now.' : 
                'You can now proceed to the next chapter.'}
            <br><br>
            <button onclick="showAnswerReview()" style="background: linear-gradient(135deg, #2196F3, #1565C0); color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 15px;">View Answers</button>
        `;
        generateChapterCertificate(quiz, percentage);
    } else {
        document.getElementById('result-message').innerHTML = `
            <strong>Keep Trying!</strong><br>
            You need 35 out of 40 to pass.<br>
            Review the chapter and try again.
            <br><br>
            <button onclick="showAnswerReview()" style="background: linear-gradient(135deg, #2196F3, #1565C0); color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 15px;">View Answers</button>
        `;
    }
    
    modal.classList.add('active');
}

function showAnswerReview() {
    var quiz = appState.currentQuiz;
    var answers = appState.answers;
    var reviewHtml = '<h2 style="color: #E94560; margin-bottom: 20px;">Answer Review - Chapter ' + quiz.number + ': ' + quiz.title + '</h2>';
    reviewHtml += '<p style="color: #aaa; margin-bottom: 15px;">Score: ' + appState.score + '/' + answers.length + '</p>';
    
    var typeLabels = { mcq: 'MCQ', caseBased: 'Case-Based', veryShort: 'Very Short Answer', short: 'Short Answer', long: 'Long Answer' };
    var lastType = '';
    
    for (var i = 0; i < answers.length; i++) {
        var a = answers[i];
        var qType = a.type || 'mcq';
        if (qType !== lastType) {
            var sectionLabel = typeLabels[qType] || qType;
            reviewHtml += '<h3 style="color: #FF9800; margin: 25px 0 10px; border-bottom: 1px solid rgba(255,152,0,0.3); padding-bottom: 8px;">' + sectionLabel + '</h3>';
            lastType = qType;
        }
        var isWritten = (qType === 'veryShort' || qType === 'short' || qType === 'long');
        if (isWritten) {
            var photoVerified = a.photoVerified;
            var writtenBorderColor = photoVerified ? '#4CAF50' : '#f44336';
            reviewHtml += '<div style="padding: 15px; margin-bottom: 12px; background: rgba(255,255,255,0.05); border-left: 4px solid ' + writtenBorderColor + '; border-radius: 8px;">';
            reviewHtml += '<div style="font-weight: bold; color: #fff; margin-bottom: 8px;">Q' + (i + 1) + '. ' + a.question + '</div>';
            reviewHtml += '<div style="padding: 10px; background: ' + (photoVerified ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)') + '; border-radius: 6px; color: ' + (photoVerified ? '#4CAF50' : '#f44336') + ';">' + (photoVerified ? 'Photo Verified - Correct' : 'Photo Verified - Incorrect') + '</div>';
            if (a.options && a.options.length > 0 && a.correct !== undefined) {
                reviewHtml += '<div style="padding: 8px 12px; margin-top: 8px; color: #4CAF50; background: rgba(76,175,80,0.1); border-radius: 5px;">Expected: ' + a.options[a.correct] + '</div>';
            }
            reviewHtml += '</div>';
        } else {
            var isCorrect = a.selected === a.correct;
            var borderColor = isCorrect ? '#4CAF50' : '#f44336';
            reviewHtml += '<div style="padding: 15px; margin-bottom: 12px; background: rgba(255,255,255,0.05); border-left: 4px solid ' + borderColor + '; border-radius: 8px;">';
            reviewHtml += '<div style="font-weight: bold; color: #fff; margin-bottom: 8px;">Q' + (i + 1) + '. ' + a.question + '</div>';
            for (var j = 0; j < a.options.length; j++) {
                var optColor = '#aaa';
                var optBg = 'transparent';
                var optLabel = '';
                if (j === a.correct) { optColor = '#4CAF50'; optBg = 'rgba(76, 175, 80, 0.15)'; optLabel = ' (Correct)'; }
                if (j === a.selected && !isCorrect) { optColor = '#f44336'; optBg = 'rgba(244, 67, 54, 0.15)'; optLabel = ' (Your Answer)'; }
                if (j === a.selected && isCorrect) { optLabel = ' (Your Answer)'; }
                reviewHtml += '<div style="padding: 8px 12px; margin: 4px 0; border-radius: 5px; color: ' + optColor + '; background: ' + optBg + ';">' + String.fromCharCode(65 + j) + '. ' + a.options[j] + optLabel + '</div>';
            }
            reviewHtml += '</div>';
        }
    }
    
    reviewHtml += '<div style="text-align: center; margin-top: 20px;"><button onclick="closeAnswerReview()" style="background: #E94560; color: #fff; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-size: 15px;">Close Review</button></div>';
    
    var overlay = document.createElement('div');
    overlay.id = 'answer-review-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 10000; overflow-y: auto; padding: 30px;';
    overlay.innerHTML = reviewHtml;
    document.body.appendChild(overlay);
}

function closeAnswerReview() {
    var overlay = document.getElementById('answer-review-overlay');
    if (overlay) overlay.remove();
}

// Generate chapter certificate (Case 1)
function generateChapterCertificate(chapter, score) {
    const cert = {
        type: 'chapter',
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        score: score,
        date: new Date().toLocaleDateString(),
        studentName: appState.studentName,
        className: getClassName()
    };
    
    // Check if certificate already exists for this class
    const exists = appState.certificates.find(c => c.type === 'chapter' && c.chapterId === chapter.id && c.className === getClassName());
    if (!exists) {
        appState.certificates.push(cert);
        saveState();
    }
}

// Close modal
function closeModal() {
    document.getElementById('result-modal').classList.remove('active');
    backToChapters();
}

// Render progress
function renderProgress() {
    var activeChapters = getActiveChapters();
    var progress = getChapterProgress();
    var scores = getChapterScores();
    const completedChapters = Object.keys(progress).filter(k => progress[k] === 'completed').length;
    const totalChapters = activeChapters.length;
    const overallProgress = Math.round((completedChapters / totalChapters) * 100);
    
    document.getElementById('progress-content').innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="color: #E94560;">Overall Progress - ${getClassName()}</h3>
            <div class="progress-container" style="max-width: 500px; margin: 20px auto;">
                <div class="progress-bar" style="width: ${overallProgress}%"></div>
            </div>
            <p style="font-size: 1.5em; color: #E94560;">${completedChapters}/${totalChapters} Chapters Completed (${overallProgress}%)</p>
        </div>
        
        <h3 style="color: #E94560; margin-bottom: 20px;">Chapter-wise Progress</h3>
        <div class="chapters-grid">
            ${activeChapters.map(chapter => {
                const isCompleted = progress[chapter.id] === 'completed';
                const score = scores[chapter.id] || 0;
                return `
                    <div class="chapter-card ${isCompleted ? 'completed' : ''}">
                        <div class="chapter-number">${chapter.number}</div>
                        <div class="chapter-title">${chapter.title}</div>
                        <div class="chapter-status">
                            ${isCompleted ? 
                                `<span class="status-badge completed">Score: ${score}%</span>` : 
                                '<span class="status-badge in-progress">Not Completed</span>'}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Render final exam
function renderPoints() {
    var activeChapters = getActiveChapters();
    var progress = getChapterProgress();
    var scores = getChapterScores();
    const completedChapters = Object.keys(progress).filter(k => progress[k] === 'completed').length;
    const totalChapters = activeChapters.length;
    const overallProgress = Math.round((completedChapters / totalChapters) * 100);
    const totalPoints = activeChapters.reduce((sum, c) => sum + (scores[c.id] || 0), 0);

    const perChapter = activeChapters.map(ch => {
        const score = scores[ch.id] || 0;
        const completed = progress[ch.id] === 'completed';
        return `
            <div class=\"chapter-card ${completed ? 'completed' : ''}\">
                <div class=\"chapter-number\">${ch.number}</div>
                <div class=\"chapter-title\">${ch.title}</div>
                <div class=\"chapter-status\">
                    <span class=\"status-badge ${completed ? 'completed' : 'in-progress'}\">${score} pts</span>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('points-content').innerHTML = `
        <div style=\"text-align:center;margin-bottom:30px;\">
            <h3 style=\"color:#E94560;\">Total Points</h3>
            <div class=\"progress-container\" style=\"max-width:500px;margin:20px auto;\">
                <div class=\"progress-bar\" style=\"width: ${overallProgress}%\"></div>
            </div>
            <p style=\"font-size:1.5em;color:#E94560;\">${totalPoints} pts • ${completedChapters}/${totalChapters} Chapters Completed</p>
        </div>
        <h3 style=\"color:#E94560;margin-bottom:20px;\">Chapter Points</h3>
        <div class=\"chapters-grid\">
            ${perChapter}
        </div>
    `;
}

function renderFinalExam() {
    var activeChapters = getActiveChapters();
    var progress = getChapterProgress();
    var totalCh = activeChapters.length;
    const allChaptersCompleted = activeChapters.every(c => progress[c.id] === 'completed');
    var fExamCompleted = isFinalExamCompleted();
    var fExamScore = getSelectedClass() === '7' ? (appState.finalExamScore7 || 0) : (appState.finalExamScore || 0);
    
    if (!allChaptersCompleted) {
        document.getElementById('final-exam-content').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <div style="font-size: 5em; margin-bottom: 20px;">🔒</div>
                <h3 style="color: #E94560;">Final Exam Locked</h3>
                <p style="margin-top: 20px; color: #aaa;">
                    Complete all ${totalCh} chapters to unlock the Final Examination.
                </p>
                <p style="margin-top: 10px; color: #E94560;">
                    Chapters Completed: ${Object.keys(progress).filter(k => progress[k] === 'completed').length}/${totalCh}
                </p>
            </div>
        `;
        return;
    }
    
    if (fExamCompleted) {
        document.getElementById('final-exam-content').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <div style="font-size: 5em; margin-bottom: 20px;">🏆</div>
                <h3 style="color: #4CAF50;">Final Exam Completed!</h3>
                <p style="font-size: 2em; color: #E94560; margin: 20px 0;">
                    Your Score: ${fExamScore}/100
                </p>
                <p style="color: ${fExamScore >= 80 ? '#4CAF50' : '#f44336'};">
                    ${fExamScore >= 80 ? 'PASSED' : 'Need 80 to pass'}
                </p>
                <button class="btn btn-primary" onclick="retakeFinalExam()" style="margin-top: 20px;">
                    Retake Final Exam
                </button>
            </div>
        `;
        return;
    }
    
    document.getElementById('final-exam-content').innerHTML = `
        <div style="text-align: center; padding: 30px;">
            <div style="font-size: 4em; margin-bottom: 20px;">📝</div>
            <h3 style="color: #E94560;">Final Examination - ${getClassName()}</h3>
            <p style="margin: 20px 0; color: #aaa;">
                This exam covers all ${totalCh} chapters of NCERT ${getClassName()} Mathematics.
            </p>
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 400px;">
                <p><strong>Total Marks:</strong> 100</p>
                <p><strong>MCQ Questions:</strong> 25 (2 marks each = 50 marks)</p>
                <p><strong>Pen & Paper:</strong> 5 (10 marks each = 50 marks)</p>
                <p><strong>Pass Marks:</strong> 80/100 (80%)</p>
                <p><strong>Time:</strong> No time limit</p>
            </div>
            <button class="btn btn-primary" onclick="startFinalExam()" style="margin-top: 20px;">
                Start Final Exam
            </button>
        </div>
    `;
}

// Start final exam
let finalExamState = {
    currentQuestion: 0,
    mcqAnswers: [],
    penPaperAnswers: [],
    mcqScore: 0
};

async function startFinalExam() {
    var confirmed = confirm(
        'CAMERA, MICROPHONE & SCREEN PERMISSION REQUIRED\n\n' +
        'GANITA PRAKASH needs access to your camera, microphone, and screen during the Final Exam to ensure fair assessment.\n\n' +
        'IMPORTANT RULES FOR FINAL EXAM:\n\n' +
        '1. Your camera, microphone & screen will be monitored\n' +
        '2. If you leave the app, your exam will be auto-submitted\n' +
        '3. Any cheating will result in automatic submission and failure\n' +
        '4. This exam has MCQ and Written sections\n' +
        '5. You need 80% to pass\n' +
        '6. Make sure you are in a quiet, well-lit place\n\n' +
        'By clicking OK, you agree to camera, microphone & screen monitoring.\n\n' +
        'Click OK to Allow & Start Final Exam or Cancel to go back.'
    );
    
    if (!confirmed) return;
    
    var permsGranted = await requestExamPermissions();
    if (!permsGranted) {
        alert('Camera and microphone access is required for the Final Exam. Please allow access and try again.');
    }
    
    var screenShareStarted = await startScreenSharing();
    if (!screenShareStarted) {
        alert('Screen sharing is required for the Final Exam. Please allow screen sharing to continue.');
    }
    
    alert('MONITORING ACTIVE\n\nYour camera, microphone, and screen are now being monitored. Do not switch apps or minimize during the exam.');
    
    appState.isMonitoring = true;
    finalExamState = {
        currentQuestion: 0,
        mcqAnswers: [],
        penPaperAnswers: [],
        mcqScore: 0
    };
    renderFinalExamMCQ();
}

function retakeFinalExam() {
    setFinalExamCompleted(false, 0);
    finalExamCurrentPPQ = 0;
    finalExamPhotos = {};
    startFinalExam();
}

// Render final exam MCQ
function renderFinalExamMCQ() {
    var activeFE = getActiveFinalExam();
    const question = activeFE.mcq[finalExamState.currentQuestion];
    const total = activeFE.mcq.length;
    
    document.getElementById('final-exam-content').innerHTML = `
        <h3 style="color: #E94560; margin-bottom: 20px;">Part A: Multiple Choice Questions (50 marks)</h3>
        
        <div class="progress-container">
            <div class="progress-bar" style="width: ${(finalExamState.currentQuestion / total) * 100}%"></div>
        </div>
        <div class="progress-text">Question ${finalExamState.currentQuestion + 1} of ${total}</div>
        
        <div class="question-card">
            <div class="question-number">Question ${finalExamState.currentQuestion + 1} (2 marks) - Chapter ${question.chapter}</div>
            <div class="question-text">${question.q}</div>
            <div class="options">
                ${question.options.map((opt, i) => `
                    <div class="option" onclick="selectFinalOption(${i})" id="final-option-${i}">
                        ${String.fromCharCode(65 + i)}. ${opt}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="btn-group">
            <button class="btn btn-primary" onclick="submitFinalMCQ()" id="final-submit-btn" disabled>
                ${finalExamState.currentQuestion === total - 1 ? 'Go to Part B' : 'Next Question'}
            </button>
        </div>
    `;
}

let finalSelectedOption = null;
function selectFinalOption(index) {
    finalSelectedOption = index;
    document.querySelectorAll('.option').forEach((opt, i) => {
        opt.classList.remove('selected');
    });
    document.getElementById(`final-option-${index}`).classList.add('selected');
    document.getElementById('final-submit-btn').disabled = false;
}

function submitFinalMCQ() {
    var activeFE = getActiveFinalExam();
    const question = activeFE.mcq[finalExamState.currentQuestion];
    
    finalExamState.mcqAnswers.push(finalSelectedOption);
    if (finalSelectedOption === question.answer) {
        finalExamState.mcqScore += 2;
    }
    
    finalExamState.currentQuestion++;
    finalSelectedOption = null;
    
    if (finalExamState.currentQuestion >= activeFE.mcq.length) {
        renderFinalExamPenPaper();
    } else {
        renderFinalExamMCQ();
    }
}

// Render pen and paper questions
var finalExamPhotos = {};
var finalExamCurrentPPQ = 0;

function renderFinalExamPenPaper() {
    var penPaperQs = getActiveFinalExam().penPaper;
    var q = penPaperQs[finalExamCurrentPPQ];
    var hasPhoto = finalExamPhotos[finalExamCurrentPPQ] ? true : false;
    var isLast = finalExamCurrentPPQ === penPaperQs.length - 1;
    
    document.getElementById('final-exam-content').innerHTML = `
        <h3 style="color: #E94560; margin-bottom: 20px;">Part B: Written Questions (50 marks)</h3>
        
        <div class="progress-container">
            <div class="progress-bar" style="width: ${(finalExamCurrentPPQ / penPaperQs.length) * 100}%"></div>
        </div>
        <div class="progress-text">Question ${finalExamCurrentPPQ + 1} of ${penPaperQs.length}</div>
        
        <div class="question-card" style="border-left: 4px solid #FF9800;">
            <div class="question-number" style="color: #FF9800;">Question ${finalExamCurrentPPQ + 1} (${q.marks} marks) - Chapter ${q.chapter}</div>
            <div class="question-text" style="font-size: 17px; line-height: 1.6; margin-bottom: 20px;">${q.q}</div>
            
            <div style="background: rgba(255,152,0,0.1); border: 2px dashed rgba(255,152,0,0.4); border-radius: 12px; padding: 25px; text-align: center; margin: 15px 0;">
                <p style="color: #FF9800; font-size: 15px; margin-bottom: 15px; font-weight: bold;">Write your answer on paper</p>
                <p style="color: #aaa; font-size: 13px; margin-bottom: 20px;">Then take a photo of your handwritten work for AI verification</p>
                <button onclick="captureFinalExamPhoto(${finalExamCurrentPPQ})" style="background: linear-gradient(135deg, #FF9800, #F57C00); color: #fff; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: bold;">
                    &#128247; Take Photo of Your Answer
                </button>
                <div id="final-photo-status" style="color: #4CAF50; font-size: 14px; margin-top: 12px; font-weight: bold;">${hasPhoto ? 'Photo Attached' : ''}</div>
            </div>
        </div>
        
        <div class="btn-group">
            <button class="btn btn-primary" onclick="submitFinalPPAnswer()" id="final-pp-submit" ${hasPhoto ? '' : 'disabled'}>
                ${isLast ? 'Submit Final Exam' : 'Next Question'}
            </button>
        </div>
    `;
}

function captureFinalExamPhoto(qIndex) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            finalExamPhotos[qIndex] = ev.target.result;
            var statusEl = document.getElementById('final-photo-status');
            if (statusEl) statusEl.textContent = 'Photo Attached';
            var submitBtn = document.getElementById('final-pp-submit');
            if (submitBtn) submitBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

async function submitFinalPPAnswer() {
    var penPaperQs = getActiveFinalExam().penPaper;
    var q = penPaperQs[finalExamCurrentPPQ];
    var photo = finalExamPhotos[finalExamCurrentPPQ];
    
    var marks = 0;
    if (photo) {
        var submitBtn = document.getElementById('final-pp-submit');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Verifying...'; }
        
        var verifyResult = await verifyPhotoAnswer(photo, { q: q.q, options: null, answer: 0 }, q.answer || '');
        
        var statusEl = document.getElementById('final-photo-status');
        if (verifyResult.is_correct) {
            marks = q.marks;
            if (statusEl) statusEl.innerHTML = '<span style="color:#4CAF50;">Answer Correct! +' + q.marks + ' marks</span>';
        } else {
            if (statusEl) statusEl.innerHTML = '<span style="color:#f44336;">Answer needs improvement. 0 marks</span>';
        }
        
        await new Promise(function(r) { setTimeout(r, 1500); });
    }
    
    finalExamState.penPaperAnswers.push({ qIndex: finalExamCurrentPPQ, marks: marks, photoVerified: true });
    
    finalExamCurrentPPQ++;
    
    if (finalExamCurrentPPQ >= penPaperQs.length) {
        submitFinalExamWithPhotos();
    } else {
        renderFinalExamPenPaper();
    }
}

// Submit final exam
function submitFinalExamWithPhotos() {
    // Stop screen sharing and monitoring
    appState.isMonitoring = false;
    stopScreenSharing();
    
    let penPaperScore = 0;
    finalExamState.penPaperAnswers.forEach(function(a) {
        penPaperScore += a.marks;
    });
    finalExamPhotos = {};
    finalExamCurrentPPQ = 0;
    
    const totalScore = finalExamState.mcqScore + penPaperScore;
    setFinalExamCompleted(true, totalScore);
    
    const passed = totalScore >= 80;
    
    if (passed) {
        // Generate final exam certificate (Case 2)
        generateFinalExamCertificate(totalScore);
        
        // Generate master certificate (Case 3)
        generateMasterCertificate(totalScore);
    }
    
    saveState();
    
    // Show result
    const modal = document.getElementById('result-modal');
    document.getElementById('result-icon').innerHTML = passed ? '🏆' : '📚';
    document.getElementById('result-icon').className = `result-icon ${passed ? 'pass' : 'fail'}`;
    document.getElementById('result-score').textContent = `${totalScore}/100`;
    
    if (passed) {
        document.getElementById('result-message').innerHTML = `
            <strong style="color: #4CAF50; font-size: 1.5em;">CONGRATULATIONS!</strong><br><br>
            You have successfully completed GANITA PRAKASH!<br><br>
            <span style="color: #4CAF50; font-size: 1.3em;">Be ready for Science Curiosity - Thanks!</span><br><br>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin-top: 15px;">
                <p style="color: #E94560;">MCQ Score: ${finalExamState.mcqScore}/50</p>
                <p style="color: #E94560;">Pen & Paper Score: ${penPaperScore}/50</p>
            </div>
            <br>
            <p style="color: #aaa; font-style: italic;">
                We will update when our new app is available.<br>
                We will inform you. OK Bye!
            </p>
        `;
    } else {
        document.getElementById('result-message').innerHTML = `
            <strong>Keep Trying!</strong><br>
            You need 80/100 to pass.<br><br>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <p>MCQ Score: ${finalExamState.mcqScore}/50</p>
                <p>Pen & Paper Score: ${penPaperScore}/50</p>
            </div>
            <br>
            Review the chapters and try again.
        `;
    }
    
    modal.classList.add('active');
}

// Generate final exam certificate (Case 2)
function generateFinalExamCertificate(score) {
    const cert = {
        type: 'final-exam',
        score: score,
        date: new Date().toLocaleDateString(),
        studentName: appState.studentName,
        className: getClassName()
    };
    
    const exists = appState.certificates.find(c => c.type === 'final-exam' && c.className === getClassName());
    if (!exists) {
        appState.certificates.push(cert);
    } else {
        // Update existing
        const index = appState.certificates.findIndex(c => c.type === 'final-exam' && c.className === getClassName());
        appState.certificates[index] = cert;
    }
    saveState();
}

// Generate master certificate (Case 3)
function generateMasterCertificate(score) {
    const cert = {
        type: 'master',
        score: score,
        date: new Date().toLocaleDateString(),
        studentName: appState.studentName,
        chaptersCompleted: getActiveChapters().length,
        className: getClassName()
    };
    
    const exists = appState.certificates.find(c => c.type === 'master' && c.className === getClassName());
    if (!exists) {
        appState.certificates.push(cert);
    } else {
        const index = appState.certificates.findIndex(c => c.type === 'master' && c.className === getClassName());
        appState.certificates[index] = cert;
    }
    saveState();
}

// Render certificates
function renderCertificates() {
    var currentClassName = getClassName();
    var classCerts = appState.certificates.filter(function(c) {
        if (c.className) return c.className === currentClassName;
        return currentClassName === 'Class 6';
    });
    
    // Generate basics certificates from progress
    var basicsProgress = getBasicsProgress();
    var basicsWS = getActiveBasicsWorksheets();
    var basicsCerts = [];
    basicsWS.forEach(function(ws) {
        var prog = basicsProgress[ws.id];
        if (prog !== undefined) {
            var pct = typeof prog === 'object' ? prog.pct : prog;
            basicsCerts.push({ type: 'basics', title: ws.title, score: pct, wsId: ws.id });
        }
    });
    
    // Check if all basics are completed for basics master cert
    var allBasicsDone = basicsWS.length > 0 && basicsCerts.length === basicsWS.length;

    var certTabState = window.certTabState || 'chapter';
    
    var chapterCertsHtml = '';
    var basicsCertsHtml = '';
    
    // Chapter certificates column
    if (classCerts.length === 0) {
        chapterCertsHtml = '<div style="text-align:center;padding:40px;"><div style="font-size:3em;margin-bottom:15px;">\ud83d\udcdc</div><h4 style="color:#E94560;">No Chapter Certificates Yet</h4><p style="color:#aaa;font-size:0.9em;">Complete chapter quizzes and final exam to earn certificates!</p></div>';
    } else {
        var sortedCerts = classCerts.slice().sort(function(a, b) {
            var order = { 'master': 0, 'final-exam': 1, 'chapter': 2 };
            return (order[a.type] || 3) - (order[b.type] || 3);
        });
        chapterCertsHtml = sortedCerts.map(function(cert) { return renderCertificate(cert); }).join('<hr style="border-color:#E94560;margin:30px 0;">');
    }
    
    // Basics certificates column
    if (basicsCerts.length === 0) {
        basicsCertsHtml = '<div style="text-align:center;padding:40px;"><div style="font-size:3em;margin-bottom:15px;">\ud83d\udcda</div><h4 style="color:#00e5ff;">No Basic Certificates Yet</h4><p style="color:#aaa;font-size:0.9em;">Complete Fundamentals worksheets to earn basic certificates!</p></div>';
    } else {
        if (allBasicsDone) {
            basicsCertsHtml += '<div class="certificate" style="border-color:#FFD700;max-width:500px;margin:0 auto 30px;"><img src="logo.png" class="cert-logo" alt="GANITA PRAKASH"><h1 style="color:#FFD700;font-size:1.5em;">BASICS MASTER</h1><p style="color:#888;font-size:0.9em;">' + currentClassName + '</p><p>This is to certify that</p><div class="student-name">' + (appState.studentName || 'Student') + '</div><p>has completed all <strong>12 Fundamentals Worksheets</strong></p><p class="date">Date: ' + new Date().toLocaleDateString() + '</p></div><hr style="border-color:#00e5ff;margin:30px 0;">';
        }
        basicsCertsHtml += basicsCerts.map(function(bc) {
            return '<div class="certificate" style="max-width:500px;margin:0 auto 20px;border-color:#00e5ff;"><img src="logo.png" class="cert-logo" alt="GANITA PRAKASH"><h1 style="font-size:1.5em;color:#00e5ff;">BASICS COMPLETION</h1><p style="color:#888;font-size:0.9em;">' + currentClassName + '</p><p>This is to certify that</p><div class="student-name" style="font-size:1.3em;">' + (appState.studentName || 'Student') + '</div><p>has successfully completed</p><p style="font-size:1.1em;color:#00e5ff;font-weight:bold;">' + bc.title + '</p><p>with a score of <strong>' + bc.score + '%</strong></p></div>';
        }).join('');
    }
    
    document.getElementById('certificate-content').innerHTML =
        '<div style="margin-bottom:30px;text-align:center;">' +
            '<h3 style="color:#E94560;">' + currentClassName + ' Certificates</h3>' +
            '<p style="color:#aaa;">Total: ' + (classCerts.length + basicsCerts.length) + ' certificate(s)</p>' +
        '</div>' +
        '<div style="display:flex;gap:10px;justify-content:center;margin-bottom:30px;">' +
            '<button onclick="window.certTabState=\'basics\';renderCertificates();" style="padding:12px 28px;border-radius:10px;border:2px solid ' + (certTabState === 'basics' ? '#00e5ff' : '#333') + ';background:' + (certTabState === 'basics' ? 'rgba(0,229,255,0.15)' : '#1a1a2e') + ';color:' + (certTabState === 'basics' ? '#00e5ff' : '#aaa') + ';font-weight:bold;cursor:pointer;font-size:15px;font-family:Orbitron,monospace;">Basic Certificates</button>' +
            '<button onclick="window.certTabState=\'chapter\';renderCertificates();" style="padding:12px 28px;border-radius:10px;border:2px solid ' + (certTabState === 'chapter' ? '#E94560' : '#333') + ';background:' + (certTabState === 'chapter' ? 'rgba(233,69,96,0.15)' : '#1a1a2e') + ';color:' + (certTabState === 'chapter' ? '#E94560' : '#aaa') + ';font-weight:bold;cursor:pointer;font-size:15px;font-family:Orbitron,monospace;">Chapter Certificates</button>' +
        '</div>' +
        '<div>' + (certTabState === 'basics' ? basicsCertsHtml : chapterCertsHtml) + '</div>';
}

// Render individual certificate
function renderCertificate(cert) {
    var certClass = cert.className || 'Class 6';
    var classLabel = certClass === 'Class 7' ? 'VII' : 'VI';
    if (cert.type === 'master') {
        return `
            <div class="certificate" style="border-color: #FFD700;">
                <img src="logo.png" class="cert-logo" alt="GANITA PRAKASH">
                <h1 style="color: #FFD700;">MASTER CERTIFICATE</h1>
                <p style="color: #888; font-size: 0.9em;">${certClass}</p>
                <p>This is to certify that</p>
                <div class="student-name">${cert.studentName || 'Student'}</div>
                <p>has successfully completed</p>
                <p style="font-size: 1.5em; color: #C73E54; font-weight: bold;">
                    GANITA PRAKASH<br>
                    ${certClass} Mathematics (NCERT Class ${classLabel} Syllabus)
                </p>
                <p>with a Final Exam Score of <strong>${cert.score}/100</strong></p>
                <p>Completing all ${cert.chaptersCompleted || 10} chapters and the Final Examination</p>
                <p class="date">Date: ${cert.date}</p>
                <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 10px;">
                    <p style="color: #4CAF50; font-weight: bold; font-size: 1.2em;">
                        Be ready for Science Curiosity - Thanks!
                    </p>
                    <p style="color: #666; font-style: italic; margin-top: 10px;">
                        We will update when our new app is available. We will inform you. OK Bye!
                    </p>
                </div>
            </div>
        `;
    } else if (cert.type === 'final-exam') {
        return `
            <div class="certificate">
                <img src="logo.png" class="cert-logo" alt="GANITA PRAKASH">
                <h1>FINAL EXAM CERTIFICATE</h1>
                <p style="color: #888; font-size: 0.9em;">${certClass}</p>
                <p>This is to certify that</p>
                <div class="student-name">${cert.studentName || 'Student'}</div>
                <p>has successfully passed the</p>
                <p style="font-size: 1.3em; color: #C73E54; font-weight: bold;">
                    ${certClass} Final Examination
                </p>
                <p>with a score of <strong>${cert.score}/100</strong></p>
                <p class="date">Date: ${cert.date}</p>
            </div>
        `;
    } else {
        return `
            <div class="certificate" style="max-width: 500px;">
                <img src="logo.png" class="cert-logo" alt="GANITA PRAKASH">
                <h1 style="font-size: 1.8em;">CHAPTER COMPLETION</h1>
                <p style="color: #888; font-size: 0.9em;">${certClass}</p>
                <p>This is to certify that</p>
                <div class="student-name" style="font-size: 1.5em;">${cert.studentName || 'Student'}</div>
                <p>has successfully completed</p>
                <p style="font-size: 1.2em; color: #C73E54; font-weight: bold;">
                    Chapter ${cert.chapterId}: ${cert.chapterTitle}
                </p>
                <p>with a score of <strong>${cert.score}%</strong></p>
                <p class="date">Date: ${cert.date}</p>
            </div>
        `;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// ============================================
// API INTEGRATION AND NEW FEATURES
// ============================================

// API_URL is defined at top of file

// 3D Models data for each chapter
const chapter3DModels = {
    1: [
        { id: 1, name: "Number Sequence Spiral", type: "spiral", description: "Visualize number patterns in a spiral" },
        { id: 2, name: "Fibonacci Spiral", type: "fibonacci", description: "Golden ratio spiral pattern" },
        { id: 3, name: "Magic Square 3D", type: "cube", description: "Interactive 3x3 magic square" },
        { id: 4, name: "Triangular Numbers", type: "pyramid", description: "Stack of dots forming triangular numbers" },
        { id: 5, name: "Square Numbers Grid", type: "grid", description: "Visual representation of square numbers" }
    ],
    2: [
        { id: 1, name: "Angle Protractor", type: "protractor", description: "Interactive angle measurement tool" },
        { id: 2, name: "Parallel Lines", type: "lines", description: "Visualize parallel and transversal lines" },
        { id: 3, name: "Perpendicular Lines", type: "perpendicular", description: "90-degree angle visualization" },
        { id: 4, name: "Angle Types", type: "angles", description: "Acute, right, obtuse, and reflex angles" },
        { id: 5, name: "Line Segments", type: "segments", description: "Points, rays, and line segments" }
    ],
    3: [
        { id: 1, name: "Number Line", type: "numberline", description: "Interactive number line exploration" },
        { id: 2, name: "Place Value Blocks", type: "blocks", description: "Ones, tens, hundreds visualization" },
        { id: 3, name: "Comparison Scale", type: "scale", description: "Compare numbers visually" },
        { id: 4, name: "Rounding Visualizer", type: "rounding", description: "See how rounding works" },
        { id: 5, name: "Number Operations", type: "operations", description: "Addition and subtraction on number line" }
    ],
    4: [
        { id: 1, name: "Integer Number Line", type: "integers", description: "Positive and negative numbers" },
        { id: 2, name: "Temperature Scale", type: "temperature", description: "Real-world integer application" },
        { id: 3, name: "Elevation Model", type: "elevation", description: "Above and below sea level" },
        { id: 4, name: "Integer Addition", type: "addition", description: "Adding positive and negative numbers" },
        { id: 5, name: "Integer Subtraction", type: "subtraction", description: "Subtracting integers visually" }
    ],
    5: [
        { id: 1, name: "Fraction Circles", type: "circles", description: "Visualize fractions as parts of a whole" },
        { id: 2, name: "Fraction Bars", type: "bars", description: "Compare fractions using bars" },
        { id: 3, name: "Equivalent Fractions", type: "equivalent", description: "See equivalent fractions" },
        { id: 4, name: "Fraction Addition", type: "addition", description: "Adding fractions visually" },
        { id: 5, name: "Mixed Numbers", type: "mixed", description: "Whole numbers and fractions" }
    ],
    6: [
        { id: 1, name: "Perimeter Explorer", type: "perimeter", description: "Measure perimeter of shapes" },
        { id: 2, name: "Area Grid", type: "area", description: "Calculate area using unit squares" },
        { id: 3, name: "Rectangle Builder", type: "rectangle", description: "Build rectangles with given dimensions" },
        { id: 4, name: "Composite Shapes", type: "composite", description: "Area of complex shapes" },
        { id: 5, name: "Real-World Measurement", type: "realworld", description: "Practical measurement applications" }
    ],
    7: [
        { id: 1, name: "Factor Tree", type: "factortree", description: "Prime factorization visualization" },
        { id: 2, name: "Multiple Patterns", type: "multiples", description: "See patterns in multiples" },
        { id: 3, name: "LCM Finder", type: "lcm", description: "Find least common multiple" },
        { id: 4, name: "HCF Finder", type: "hcf", description: "Find highest common factor" },
        { id: 5, name: "Divisibility Rules", type: "divisibility", description: "Interactive divisibility tests" }
    ],
    8: [
        { id: 1, name: "Decimal Place Value", type: "decimal", description: "Understand decimal positions" },
        { id: 2, name: "Decimal Number Line", type: "decimalline", description: "Decimals on number line" },
        { id: 3, name: "Fraction to Decimal", type: "conversion", description: "Convert fractions to decimals" },
        { id: 4, name: "Decimal Operations", type: "operations", description: "Add and subtract decimals" },
        { id: 5, name: "Money Calculator", type: "money", description: "Real-world decimal application" }
    ],
    9: [
        { id: 1, name: "2D Shape Explorer", type: "shapes2d", description: "Properties of 2D shapes" },
        { id: 2, name: "3D Shape Viewer", type: "shapes3d", description: "Explore 3D shapes" },
        { id: 3, name: "Symmetry Mirror", type: "symmetry", description: "Lines of symmetry" },
        { id: 4, name: "Shape Nets", type: "nets", description: "Unfold 3D shapes" },
        { id: 5, name: "Tessellation Maker", type: "tessellation", description: "Create shape patterns" }
    ],
    10: [
        { id: 1, name: "Algebra Tiles", type: "tiles", description: "Visualize algebraic expressions" },
        { id: 2, name: "Balance Scale", type: "balance", description: "Solve equations visually" },
        { id: 3, name: "Variable Explorer", type: "variables", description: "Understand variables" },
        { id: 4, name: "Pattern to Algebra", type: "patterns", description: "From patterns to expressions" },
        { id: 5, name: "Equation Solver", type: "solver", description: "Step-by-step equation solving" }
    ]
};

// 3D Models data for Class 7 chapters
const chapter3DModels7 = {
    1: [
        { id: 1, name: "Place Value Explorer", type: "blocks", description: "Visualize lakhs and crores with place value blocks" },
        { id: 2, name: "Number Pattern Spiral", type: "spiral", description: "Patterns in large number products" },
        { id: 3, name: "Indian Number System", type: "grid", description: "Indian vs International place value" },
        { id: 4, name: "Powers of 10", type: "pyramid", description: "Growing powers of 10 visualization" },
        { id: 5, name: "Large Number Scale", type: "scale", description: "Compare large numbers on a scale" }
    ],
    2: [
        { id: 1, name: "Expression Builder", type: "tiles", description: "Build arithmetic expressions visually" },
        { id: 2, name: "Order of Operations", type: "balance", description: "BODMAS rule visualization" },
        { id: 3, name: "Expression Tree", type: "factortree", description: "Parse expressions as trees" },
        { id: 4, name: "Bracket Groups", type: "blocks", description: "Group operations with brackets" },
        { id: 5, name: "Expression Solver", type: "solver", description: "Step-by-step expression evaluation" }
    ],
    3: [
        { id: 1, name: "Decimal Number Line", type: "numberline", description: "Explore decimals on a number line" },
        { id: 2, name: "Decimal Place Value", type: "decimal", description: "Tenths, hundredths, thousandths" },
        { id: 3, name: "Fraction to Decimal", type: "conversion", description: "Convert fractions to decimals" },
        { id: 4, name: "Decimal Comparison", type: "scale", description: "Compare decimal numbers" },
        { id: 5, name: "Decimal Operations", type: "operations", description: "Add and subtract decimals" }
    ],
    4: [
        { id: 1, name: "Letter-Number Tiles", type: "tiles", description: "Represent unknowns with letter tiles" },
        { id: 2, name: "Pattern to Expression", type: "patterns", description: "Convert patterns to algebraic expressions" },
        { id: 3, name: "Variable Explorer", type: "variables", description: "Understanding variables in expressions" },
        { id: 4, name: "Expression Evaluator", type: "solver", description: "Evaluate expressions for given values" },
        { id: 5, name: "Balance Scale", type: "balance", description: "Balance expressions on a scale" }
    ],
    5: [
        { id: 1, name: "Parallel Lines", type: "lines", description: "Parallel lines visualization" },
        { id: 2, name: "Intersecting Lines", type: "perpendicular", description: "Lines crossing at a point" },
        { id: 3, name: "Angle Measurer", type: "protractor", description: "Measure angles between lines" },
        { id: 4, name: "Transversal Angles", type: "angles", description: "Angles formed by transversals" },
        { id: 5, name: "Perpendicular Lines", type: "perpendicular", description: "Right angle construction" }
    ],
    6: [
        { id: 1, name: "Number Puzzle Grid", type: "grid", description: "Interactive number puzzles" },
        { id: 2, name: "Palindrome Explorer", type: "spiral", description: "Discover palindromic numbers" },
        { id: 3, name: "Divisibility Tester", type: "divisibility", description: "Test divisibility rules" },
        { id: 4, name: "Factor Finder", type: "factortree", description: "Find factors of numbers" },
        { id: 5, name: "Magic Square", type: "cube", description: "Create and solve magic squares" }
    ],
    7: [
        { id: 1, name: "Triangle Builder", type: "pyramid", description: "Build triangles with intersecting lines" },
        { id: 2, name: "Angle Sum Property", type: "angles", description: "Triangle angle sum = 180 degrees" },
        { id: 3, name: "Medians Visualizer", type: "lines", description: "Medians of a triangle" },
        { id: 4, name: "Altitudes Visualizer", type: "perpendicular", description: "Altitudes of a triangle" },
        { id: 5, name: "Centroid Finder", type: "circles", description: "Find the centroid of a triangle" }
    ],
    8: [
        { id: 1, name: "Fraction Circles", type: "circles", description: "Visualize fractions as parts of circles" },
        { id: 2, name: "Fraction Bars", type: "bars", description: "Compare fractions using bars" },
        { id: 3, name: "Fraction Operations", type: "operations", description: "Add, subtract, multiply fractions" },
        { id: 4, name: "Equivalent Fractions", type: "equivalent", description: "Find equivalent fractions" },
        { id: 5, name: "Mixed Numbers", type: "mixed", description: "Work with mixed numbers" }
    ],
    9: [
        { id: 1, name: "Symmetry Mirror", type: "symmetry", description: "Line symmetry in geometric shapes" },
        { id: 2, name: "Congruent Shapes", type: "shapes2d", description: "Identify congruent shapes" },
        { id: 3, name: "Rotation Explorer", type: "rounding", description: "Rotate shapes and compare" },
        { id: 4, name: "Reflection Tool", type: "symmetry", description: "Reflect shapes across a line" },
        { id: 5, name: "Twin Shape Matcher", type: "shapes2d", description: "Match geometric twins" }
    ],
    10: [
        { id: 1, name: "Integer Number Line", type: "integers", description: "Positive and negative integers" },
        { id: 2, name: "Integer Addition", type: "addition", description: "Adding integers on number line" },
        { id: 3, name: "Integer Subtraction", type: "subtraction", description: "Subtracting integers visually" },
        { id: 4, name: "Temperature Scale", type: "temperature", description: "Real-world integer application" },
        { id: 5, name: "Elevation Model", type: "elevation", description: "Above and below zero" }
    ],
    11: [
        { id: 1, name: "LCM Finder", type: "lcm", description: "Find least common multiple" },
        { id: 2, name: "HCF Finder", type: "hcf", description: "Find highest common factor" },
        { id: 3, name: "Factor Tree", type: "factortree", description: "Prime factorization tree" },
        { id: 4, name: "Multiple Patterns", type: "multiples", description: "Common multiples visualization" },
        { id: 5, name: "Divisibility Checker", type: "divisibility", description: "Interactive divisibility rules" }
    ],
    12: [
        { id: 1, name: "Decimal Deep Dive", type: "decimal", description: "Thousandths and beyond" },
        { id: 2, name: "Decimal Multiplication", type: "operations", description: "Multiply decimals visually" },
        { id: 3, name: "Decimal Division", type: "operations", description: "Divide decimals step by step" },
        { id: 4, name: "Money Calculator", type: "money", description: "Real-world decimal calculations" },
        { id: 5, name: "Decimal Patterns", type: "patterns", description: "Patterns in decimal numbers" }
    ],
    13: [
        { id: 1, name: "Coordinate Grid", type: "grid", description: "Plot points on a grid" },
        { id: 2, name: "Dot Connector", type: "lines", description: "Connect dots to form shapes" },
        { id: 3, name: "Shape Drawer", type: "shapes2d", description: "Draw shapes using coordinates" },
        { id: 4, name: "Distance Finder", type: "segments", description: "Find distances between points" },
        { id: 5, name: "Graph Plotter", type: "bars", description: "Plot data on graphs" }
    ],
    14: [
        { id: 1, name: "Compass & Ruler", type: "protractor", description: "Geometric construction tools" },
        { id: 2, name: "Tessellation Maker", type: "tessellation", description: "Create tiling patterns" },
        { id: 3, name: "Shape Nets", type: "nets", description: "Unfold and fold 3D shapes" },
        { id: 4, name: "Tiling Explorer", type: "tiles", description: "Explore tiling patterns" },
        { id: 5, name: "Construction Steps", type: "segments", description: "Step-by-step constructions" }
    ],
    15: [
        { id: 1, name: "Balance Scale", type: "balance", description: "Solve equations using balance" },
        { id: 2, name: "Equation Builder", type: "solver", description: "Build and solve equations" },
        { id: 3, name: "Variable Finder", type: "variables", description: "Find the unknown variable" },
        { id: 4, name: "Equation Visualizer", type: "tiles", description: "Visualize equation solving" },
        { id: 5, name: "Solution Checker", type: "solver", description: "Verify equation solutions" }
    ]
};

// Show login screen
function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
    var classPage = document.getElementById('class-selection-page');
    if (classPage) classPage.classList.add('hidden');
}

// Show main app
function showMainApp() {
    // Check if class is selected, if not show class selection page
    if (!getSelectedClass()) {
        showClassSelection();
        return;
    }
    document.getElementById('login-screen').classList.add('hidden');
    var classPage = document.getElementById('class-selection-page');
    if (classPage) classPage.classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    // Update header title based on class
    var subtitle = document.querySelector('.title-section p');
    if (subtitle) subtitle.textContent = getClassTitle();
    var displayName = appState.studentName || 'Student';
    document.getElementById('display-name').textContent = displayName;
    document.getElementById('display-role').textContent = appState.isAdmin ? 'Master Admin' : 'Student';
    
    var initials = displayName.split(' ').map(function(w) { return w.charAt(0).toUpperCase(); }).join('').substring(0, 2);
    var avatarEl = document.getElementById('user-avatar');
    if (avatarEl) {
        avatarEl.textContent = initials;
        avatarEl.title = 'Click to edit profile';
    }
    
    var adminTab = document.getElementById('admin-tab');
    if (appState.isAdmin) {
        adminTab.classList.remove('hidden');
    } else {
        adminTab.classList.add('hidden');
    }
    updateCallButtons();
    renderChapters();
    connectSignalingWS();
    startIncomingCallPolling();
    startPollingForCallUpdates();
    
    // Check for festival and birthday wishes
    setTimeout(function() {
        checkFestivalWish();
        checkBirthdayWish();
    }, 1500);
    
    // Prompt birthday setup if not set yet (only once)
    if (!localStorage.getItem('user_birthday') && !localStorage.getItem('birthday_prompt_dismissed')) {
        setTimeout(function() {
            localStorage.setItem('birthday_prompt_dismissed', 'true');
            showBirthdaySetup();
        }, 3000);
    }
    
    if (!appState.isAdmin && !appState.profileComplete && !appState.studentName) {
        setTimeout(function() { showProfileSetup(); }, 500);
    }
}

function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

async function handleLogin() {
    var username = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!username || !password) { alert('Please enter email and password'); return; }
    if (username === 'admin') { username = 'admin@ganitaprakash.com'; }
    const btn = document.querySelector('#login-form .login-btn');
    btn.disabled = true; btn.textContent = 'Logging in...';
    
    try {
        const response = await fetch(API_URL + '/api/auth/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, platform: 'web' })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            appState.authToken = data.access_token;
            appState.studentName = data.user.name;
            appState.isAdmin = data.user.is_admin;
            appState.userId = data.user.id;
            appState.isLoggedIn = true;
            appState.userEmail = username;
            saveState();
            // Always show class selection after login so user can pick their class
            showClassSelection();
        } else { alert(data.detail || 'Login failed'); }
    } catch (e) { console.error('Login error:', e); alert('Network error. Please try again.'); }
    btn.disabled = false; btn.textContent = 'INITIALIZE LOGIN';
}

// Firebase Configuration for Google Sign-In - Updated to classics project
const firebaseConfig = {
    apiKey: "AIzaSyDux5CRyHqN0kX1O0rIWzTA4DtjYl3RKp0",
    authDomain: "classics-92ea0.firebaseapp.com",
    projectId: "classics-92ea0",
    storageBucket: "classics-92ea0.firebasestorage.app",
    messagingSenderId: "624055621679",
    appId: "1:624055621679:web:4d5321e8bb2c2dd75f8eda",
    measurementId: "G-ZRH2S2NRNE"
};

// Initialize Firebase (will be done when SDK loads)
let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;

// Load Firebase SDK dynamically
function loadFirebaseSDK() {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.firebase && window.firebase.auth) {
            resolve();
            return;
        }
        
        // Load Firebase App SDK
        const appScript = document.createElement('script');
        appScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
        appScript.onload = () => {
            // Load Firebase Auth SDK
            const authScript = document.createElement('script');
            authScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
            authScript.onload = () => {
                // Initialize Firebase
                if (!firebase.apps.length) {
                    firebaseApp = firebase.initializeApp(firebaseConfig);
                } else {
                    firebaseApp = firebase.apps[0];
                }
                firebaseAuth = firebase.auth();
                googleProvider = new firebase.auth.GoogleAuthProvider();
                googleProvider.addScope('email');
                googleProvider.addScope('profile');
                // Force account selection every time
                googleProvider.setCustomParameters({
                    prompt: 'select_account'
                });
                resolve();
            };
            authScript.onerror = reject;
            document.head.appendChild(authScript);
        };
        appScript.onerror = reject;
        document.head.appendChild(appScript);
    });
}

// Real Google Sign-In with Firebase - Opens browser for Google account selection
async function handleGoogleLogin() {
    try {
        // Show loading indicator
        const loadingHtml = `
            <div id="google-loading-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 10000;">
                <div style="text-align: center; color: white;">
                    <div style="font-size: 48px; margin-bottom: 20px;">
                        <img src="https://www.google.com/favicon.ico" style="width: 48px; animation: pulse 1s infinite;">
                    </div>
                    <p style="font-size: 18px; color: #00d4ff;">Opening Google Sign-In...</p>
                    <p style="font-size: 14px; color: #888; margin-top: 10px;">Please select your Google account</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHtml);
        
        // Load Firebase SDK if not loaded
        await loadFirebaseSDK();
        
        // Remove loading modal
        const loadingModal = document.getElementById('google-loading-modal');
        if (loadingModal) loadingModal.remove();
        
        // Sign in with popup - this opens Google's account chooser in browser
        const result = await firebaseAuth.signInWithPopup(googleProvider);
        
        // Get user info from Google
        const user = result.user;
        const email = user.email;
        const displayName = user.displayName || email.split('@')[0];
        
        console.log('Google Sign-In successful:', email, displayName);
        
        // Process the Google email with our backend
        await processGoogleEmail(email, displayName);
        
    } catch (error) {
        console.error('Google Sign-In error:', error);
        
        // Remove loading modal if still present
        const loadingModal = document.getElementById('google-loading-modal');
        if (loadingModal) loadingModal.remove();
        
        if (error.code === 'auth/popup-closed-by-user') {
            return;
        } else if (error.code === 'auth/popup-blocked' || error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
            showGoogleEmailModal();
            return;
        }
        showGoogleEmailModal();
    }
}

// Check for redirect result on page load (for mobile browsers that use redirect)
async function checkGoogleRedirectResult() {
    try {
        await loadFirebaseSDK();
        const result = await firebaseAuth.getRedirectResult();
        if (result && result.user) {
            const email = result.user.email;
            const displayName = result.user.displayName || email.split('@')[0];
            await processGoogleEmail(email, displayName);
        }
    } catch (error) {
        console.error('Redirect result error:', error);
    }
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkGoogleRedirectResult);
} else {
    checkGoogleRedirectResult();
}

// Fallback: Show modal to enter Google email manually
function showGoogleEmailModal() {
    const modalHtml = `
        <div id="google-login-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 10000;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 15px; max-width: 400px; width: 90%; border: 2px solid #00d4ff; box-shadow: 0 0 30px rgba(0,212,255,0.3);">
                <h3 style="color: #00d4ff; margin-bottom: 20px; text-align: center;">
                    <img src="https://www.google.com/favicon.ico" style="width: 24px; vertical-align: middle; margin-right: 10px;">
                    Sign in with Google
                </h3>
                <p style="color: #aaa; margin-bottom: 15px; text-align: center; font-size: 14px;">Enter your Google email address to continue</p>
                <input type="email" id="google-email-input" placeholder="your.email@gmail.com" 
                    style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #00d4ff; background: #0a0a1a; color: white; font-size: 16px; margin-bottom: 15px; box-sizing: border-box;">
                <input type="text" id="google-name-input" placeholder="Your Name (optional)" 
                    style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #444; background: #0a0a1a; color: white; font-size: 16px; margin-bottom: 20px; box-sizing: border-box;">
                <div style="display: flex; gap: 10px;">
                    <button onclick="document.getElementById('google-login-modal').remove();" 
                        style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #666; background: transparent; color: #aaa; cursor: pointer; font-size: 16px;">Cancel</button>
                    <button onclick="submitGoogleEmail();" 
                        style="flex: 1; padding: 12px; border-radius: 8px; border: none; background: linear-gradient(135deg, #4285f4, #34a853); color: white; cursor: pointer; font-size: 16px; font-weight: bold;">Continue</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('google-email-input').focus();
    
    document.getElementById('google-email-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGoogleEmail();
    });
    document.getElementById('google-name-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGoogleEmail();
    });
}

// Submit Google email from modal (fallback)
async function submitGoogleEmail() {
    const email = document.getElementById('google-email-input').value.trim();
    const name = document.getElementById('google-name-input').value.trim();
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    document.getElementById('google-login-modal').remove();
    await processGoogleEmail(email, name || email.split('@')[0]);
}

// Process Google email after OAuth or manual entry
async function processGoogleEmail(email, googleName) {
    try {
        // First check if user exists in backend using the new check-user endpoint
        const checkResponse = await fetch(API_URL + '/api/auth/check-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        
        if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            
            if (checkData.exists) {
                // User exists - use google-login endpoint (no password needed)
                const loginResponse = await fetch(API_URL + '/api/auth/google-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });
                
                if (loginResponse.ok) {
                    const data = await loginResponse.json();
                    localStorage.setItem('authToken', data.access_token);
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    appState.authToken = data.access_token;
                    appState.studentName = data.user.name;
                    appState.isAdmin = data.user.is_admin;
                    appState.userId = data.user.id;
                    appState.isLoggedIn = true;
                    appState.userEmail = email;
                    appState.isGoogleUser = true;
                    appState.profileComplete = true;
                    saveState();
                    // Always show class selection after Google login
                    showClassSelection();
                    return;
                } else {
                    const errorData = await loginResponse.json();
                    alert('Login failed: ' + (errorData.detail || 'Unknown error'));
                    return;
                }
            }
        }
        
        // User doesn't exist - ask for registration details
        let firstName = googleName ? googleName.split(' ')[0] : '';
        let surname = googleName ? googleName.split(' ').slice(1).join(' ') : '';
        
        if (!firstName) {
            firstName = prompt('Welcome! Please enter your First Name:');
            if (!firstName || !firstName.trim()) {
                alert('First name is required');
                return;
            }
        }
        
        if (!surname) {
            surname = prompt('Please enter your Surname:');
            if (!surname || !surname.trim()) {
                alert('Surname is required');
                return;
            }
        }
        
        const dob = prompt('Please enter your Date of Birth (DD/MM/YYYY):');
        if (!dob || dob.length !== 10) {
            alert('Please enter a valid date of birth');
            return;
        }
        
        const fullName = firstName.trim() + ' ' + surname.trim();
        
        // Register with backend
        const registerResponse = await fetch(API_URL + '/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: email, 
                password: 'google-oauth-' + Date.now(), 
                name: fullName, 
                platform: 'web',
                is_google: true,
                dob: dob
            })
        });
        
        if (registerResponse.ok) {
            // Now login using google-login endpoint
            const loginResp = await fetch(API_URL + '/api/auth/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            
            if (loginResp.ok) {
                const data = await loginResp.json();
                localStorage.setItem('authToken', data.access_token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                appState.authToken = data.access_token;
                appState.studentName = data.user.name;
                appState.isAdmin = data.user.is_admin;
                appState.userId = data.user.id;
                appState.isLoggedIn = true;
                appState.userEmail = email;
                appState.isGoogleUser = true;
                appState.profileComplete = true;
                saveState();
                // Always show class selection after Google registration
                showClassSelection();
            } else {
                alert('Registration successful but login failed. Please try logging in with email/password.');
            }
        } else {
            const errorData = await registerResponse.json();
            alert('Registration failed: ' + (errorData.detail || 'Unknown error'));
        }
        
    } catch (error) {
        console.error('Google login error:', error);
        alert('Login failed: ' + error.message + '\n\nPlease try using Email/Password login instead.');
    }
}

async function handleRegister() {
    var username = document.getElementById('register-email').value.trim();
    var password = document.getElementById('register-password').value.trim();
    if (!username || !password) { alert('Please enter email and password'); return; }
    if (password.length < 8) { alert('Password must be at least 8 characters'); return; }
    var btn = document.querySelector('#register-form .login-btn');
    btn.disabled = true; btn.textContent = 'Creating account...';
    var tempName = username.split('@')[0];
    try {
        var response = await fetch(API_URL + '/api/auth/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password, name: tempName, platform: 'web' })
        });
        var data = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            appState.authToken = data.access_token;
            appState.studentName = data.user.name;
            appState.isAdmin = data.user.is_admin;
            appState.userId = data.user.id;
            appState.isLoggedIn = true;
            appState.userEmail = username;
            appState.profileComplete = false;
            saveState();
            // Always show class selection after registration
            showClassSelection();
        } else { alert(data.detail || 'Registration failed'); }
    } catch (e) { console.error('Register error:', e); alert('Network error. Please try again.'); }
    btn.disabled = false; btn.textContent = 'CREATE ACCOUNT';
}

function showProfileSetup() {
    var currentName = appState.studentName || '';
    var modalHtml = '<div id="profile-setup-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;justify-content:center;align-items:center;z-index:10000;">' +
        '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px;border-radius:15px;max-width:420px;width:90%;border:2px solid #00d4ff;">' +
        '<div style="text-align:center;margin-bottom:20px;">' +
        '<div id="setup-avatar" style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#00d4ff,#ff00ff);display:inline-flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;color:#fff;font-family:Orbitron,monospace;cursor:pointer;" title="Profile photo">' +
        (currentName ? currentName.split(" ").map(function(w){return w.charAt(0).toUpperCase();}).join("").substring(0,2) : '?') + '</div></div>' +
        '<h3 style="color:#00d4ff;text-align:center;margin-bottom:5px;font-family:Orbitron,monospace;">Complete Your Profile</h3>' +
        '<p style="color:#888;text-align:center;font-size:13px;margin-bottom:20px;">Tell us about yourself to get started</p>' +
        '<div style="margin-bottom:12px;"><label style="color:#00d4ff;font-size:12px;font-family:Orbitron,monospace;">FULL NAME</label>' +
        '<input type="text" id="setup-name" value="' + currentName + '" placeholder="Enter your full name" style="width:100%;padding:10px;border-radius:8px;border:1px solid #00d4ff;background:#0a0a1a;color:#fff;font-size:15px;box-sizing:border-box;margin-top:4px;"></div>' +
        '<div style="margin-bottom:12px;"><label style="color:#00d4ff;font-size:12px;font-family:Orbitron,monospace;">DATE OF BIRTH</label>' +
        '<input type="date" id="setup-dob" style="width:100%;padding:10px;border-radius:8px;border:1px solid #00d4ff;background:#0a0a1a;color:#fff;font-size:15px;box-sizing:border-box;margin-top:4px;"></div>' +
        '<button onclick="submitProfileSetup()" style="width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(90deg,#00d4ff,#ff00ff);color:#fff;font-size:16px;font-weight:bold;cursor:pointer;font-family:Orbitron,monospace;">SAVE & CONTINUE</button>' +
        '</div></div>';
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('setup-name').focus();
}

function submitProfileSetup() {
    var name = document.getElementById('setup-name').value.trim();
    var dob = document.getElementById('setup-dob').value;
    if (!name) { alert('Please enter your name'); return; }
    appState.studentName = name;
    appState.userDob = dob || '';
    appState.profileComplete = true;
    saveState();
    var modal = document.getElementById('profile-setup-modal');
    if (modal) modal.remove();
    showMainApp();
}

function showProfileEditor() {
    var isGoogle = appState.isGoogleUser || false;
    var initials = (appState.studentName || 'S').split(' ').map(function(w){return w.charAt(0).toUpperCase();}).join('').substring(0,2);
    var currentClass = getSelectedClass() || '6';
    var oppositeClass = currentClass === '6' ? '7' : '6';
    var modalHtml = '<div id="profile-editor-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;justify-content:center;align-items:center;z-index:10000;">' +
        '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px;border-radius:15px;max-width:420px;width:90%;border:2px solid #00d4ff;max-height:90vh;overflow-y:auto;">' +
        '<div style="text-align:center;margin-bottom:20px;">' +
        '<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#00d4ff,#ff00ff);display:inline-flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;color:#fff;font-family:Orbitron,monospace;">' + initials + '</div></div>' +
        '<h3 style="color:#00d4ff;text-align:center;margin-bottom:5px;font-family:Orbitron,monospace;">My Account</h3>' +
        '<p style="color:#aaa;text-align:center;font-size:12px;margin-bottom:15px;font-family:Orbitron,monospace;">Currently in Class ' + currentClass + '</p>' +
        '<div style="margin-bottom:12px;"><label style="color:#00d4ff;font-size:12px;font-family:Orbitron,monospace;">EMAIL</label>' +
        '<input type="text" value="' + (appState.userEmail || '') + '" disabled style="width:100%;padding:10px;border-radius:8px;border:1px solid #444;background:#0a0a1a;color:#888;font-size:14px;box-sizing:border-box;margin-top:4px;"></div>' +
        '<div style="margin-bottom:12px;"><label style="color:#00d4ff;font-size:12px;font-family:Orbitron,monospace;">NAME</label>' +
        '<input type="text" id="edit-name" value="' + (appState.studentName || '') + '" style="width:100%;padding:10px;border-radius:8px;border:1px solid #00d4ff;background:#0a0a1a;color:#fff;font-size:14px;box-sizing:border-box;margin-top:4px;"></div>' +
        (isGoogle ? '<p style="color:#888;font-size:12px;margin-bottom:12px;">Password change is not available for Google accounts</p>' :
        '<div style="margin-bottom:12px;"><label style="color:#00d4ff;font-size:12px;font-family:Orbitron,monospace;">CURRENT PASSWORD</label>' +
        '<input type="password" id="edit-old-password" placeholder="Enter current password" style="width:100%;padding:10px;border-radius:8px;border:1px solid #00d4ff;background:#0a0a1a;color:#fff;font-size:14px;box-sizing:border-box;margin-top:4px;"></div>' +
        '<div style="margin-bottom:12px;"><label style="color:#00d4ff;font-size:12px;font-family:Orbitron,monospace;">NEW PASSWORD</label>' +
        '<input type="password" id="edit-new-password" placeholder="Leave blank to keep current" style="width:100%;padding:10px;border-radius:8px;border:1px solid #00d4ff;background:#0a0a1a;color:#fff;font-size:14px;box-sizing:border-box;margin-top:4px;"></div>') +
        '<div style="margin-top:18px;margin-bottom:12px;padding:15px;border-radius:10px;border:2px solid ' + (oppositeClass === '7' ? '#ff00ff' : '#00d4ff') + ';background:linear-gradient(135deg,rgba(0,0,0,0.3),rgba(0,0,0,0.5));text-align:center;">' +
        '<p style="color:#aaa;font-size:11px;font-family:Orbitron,monospace;margin-bottom:8px;">SWITCH CLASS</p>' +
        '<button onclick="switchClassFromProfile(' + oppositeClass + ')" style="width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,' + (oppositeClass === '7' ? '#ff00ff,#cc00cc' : '#00d4ff,#0099cc') + ');color:#fff;font-size:14px;font-weight:bold;cursor:pointer;font-family:Orbitron,monospace;letter-spacing:1px;">' + (oppositeClass === '7' ? '📊' : '📐') + ' Switch to Class ' + oppositeClass + '</button>' +
        '</div>' +
        '<div style="display:flex;gap:10px;margin-top:15px;">' +
        '<button onclick="document.getElementById(\'profile-editor-modal\').remove()" style="flex:1;padding:12px;border-radius:8px;border:1px solid #666;background:transparent;color:#aaa;cursor:pointer;font-size:14px;">Cancel</button>' +
        '<button onclick="saveProfileChanges()" style="flex:1;padding:12px;border-radius:8px;border:none;background:linear-gradient(90deg,#00d4ff,#ff00ff);color:#fff;cursor:pointer;font-size:14px;font-weight:bold;">Save</button>' +
        '</div></div></div>';
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function saveProfileChanges() {
    var newName = document.getElementById('edit-name').value.trim();
    if (!newName) { alert('Name cannot be empty'); return; }
    appState.studentName = newName;
    appState.profileComplete = true;
    saveState();
    var userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.name = newName;
    localStorage.setItem('userData', JSON.stringify(userData));
    fetch(API_URL + '/api/user/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
        body: JSON.stringify({ name: newName })
    }).catch(function(e) { console.log('Name sync error:', e); });
    var newPassword = document.getElementById('edit-new-password');
    var oldPassword = document.getElementById('edit-old-password');
    if (newPassword && oldPassword && newPassword.value.trim()) {
        fetch(API_URL + '/api/user/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({ old_password: oldPassword.value, new_password: newPassword.value.trim() })
        }).then(function(r) { return r.json(); }).then(function(d) {
            if (d.detail) alert(d.detail);
        }).catch(function(e) { console.log('Password change error:', e); });
    }
    var modal = document.getElementById('profile-editor-modal');
    if (modal) modal.remove();
    showMainApp();
}

function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('ganitaPrakashState');
    localStorage.removeItem('studentName');
    localStorage.removeItem('selectedClass');
    appState = {
        currentChapter: null,
        currentQuiz: null,
        currentQuestion: 0,
        score: 0,
        answers: [],
        chapterProgress: {},
        chapterScores: {},
        chapterProgress7: {},
        chapterScores7: {},
        finalExamCompleted: false,
        finalExamScore: 0,
        finalExamCompleted7: false,
        finalExamScore7: 0,
        selectedClass: null,
        studentName: '',
        certificates: [],
        isScreenSharing: false,
        screenShareStream: null,
        authToken: null,
        isLoggedIn: false,
        isAdmin: false,
        userId: null,
        userEmail: '',
        isGoogleUser: false,
        userDob: '',
        profileComplete: false,
        chaptersUnlocked: false
    };
    if (signalingWS) { try { signalingWS.close(); } catch(e){} signalingWS = null; }
    if (incomingCallPollInterval) { clearInterval(incomingCallPollInterval); incomingCallPollInterval = null; }
    if (firebaseAuth) {
        firebaseAuth.signOut();
    }
    showLoginScreen();
}

// Chat functions
async function loadChatMessages() {
    if (!appState.authToken) return;
    try {
        const response = await fetch(API_URL + '/api/messages', {
            headers: { 'Authorization': 'Bearer ' + appState.authToken }
        });
        if (response.ok) {
            const data = await response.json();
            appState.chatMessages = data.reverse();
            renderChatMessages();
        }
    } catch (e) { console.error('Chat load error:', e); }
}

function renderChatMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    if (!appState.chatMessages || appState.chatMessages.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #888; padding: 50px;">No messages yet. Start the conversation!</div>';
        return;
    }
    container.innerHTML = appState.chatMessages.map(msg => 
        '<div class="chat-message ' + (msg.user_id === appState.userId ? 'own' : 'other') + (msg.is_ai ? ' ai' : '') + '">' +
        '<div class="chat-sender">' + sanitizeHTML(msg.sender_name) + (msg.is_ai ? ' (AI)' : '') + '</div>' +
        '<div class="chat-text">' + sanitizeHTML(msg.content) + '</div>' +
        '<div class="chat-time">' + new Date(msg.created_at).toLocaleString() + '</div></div>'
    ).join('');
    container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const content = input.value.trim();
    if (!content) return;
    try {
        const response = await fetch(API_URL + '/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({ content: content, message_type: 'text' })
        });
        if (response.ok) { input.value = ''; loadUserChatMessages(); }
    } catch (e) { console.error('Send message error:', e); alert('Failed to send message'); }
}

// WhatsApp-style chat for users - load messages
var userChatMessages = [];
var userChatRefreshInterval = null;

async function loadUserChatMessages() {
    if (!appState.authToken) return;
    try {
        var response = await fetch(API_URL + '/api/user/messages', {
            headers: { 'Authorization': 'Bearer ' + appState.authToken }
        });
        if (response.ok) {
            var data = await response.json();
            userChatMessages = data.messages || [];
            renderUserChatMessages();
        }
    } catch (e) { console.log('User chat load error:', e); }
}

// Start auto-refresh for chat messages (every 2 seconds)
function startChatAutoRefresh() {
    if (userChatRefreshInterval) clearInterval(userChatRefreshInterval);
    userChatRefreshInterval = setInterval(function() {
        if (appState.isAdmin) {
            loadChatMessages();
        } else {
            loadUserChatMessages();
        }
    }, 2000);
}

// Stop auto-refresh
function stopChatAutoRefresh() {
    if (userChatRefreshInterval) {
        clearInterval(userChatRefreshInterval);
        userChatRefreshInterval = null;
    }
}

// Render WhatsApp-style messages for user
function renderUserChatMessages() {
    var chatDiv = document.getElementById('user-chat-messages');
    if (!chatDiv) return;
    
    if (userChatMessages.length === 0) {
        chatDiv.innerHTML = '<div style="text-align: center; color: #888; padding: 50px;">Send a message to connect with your teacher</div>';
        return;
    }
    
    chatDiv.innerHTML = userChatMessages.map(function(msg) {
        var isAdmin = msg.is_admin_reply;
        var time = new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        if (isAdmin) {
            // Admin message - left side (gray)
            return '<div style="display: flex; justify-content: flex-start; margin-bottom: 10px;">' +
                '<div style="max-width: 70%; background: linear-gradient(135deg, #3a3a5c, #2a2a4c); padding: 12px 15px; border-radius: 15px 15px 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">' +
                '<div style="color: #00ffff; font-size: 0.8em; margin-bottom: 5px;">Master Admin</div>' +
                '<div style="color: #fff; word-wrap: break-word;">' + sanitizeHTML(msg.content) + '</div>' +
                '<div style="color: #888; font-size: 0.75em; text-align: right; margin-top: 5px;">' + time + '</div>' +
                '</div></div>';
        } else {
            // User message - right side (green)
            return '<div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">' +
                '<div style="max-width: 70%; background: linear-gradient(135deg, #00a884, #008f6f); padding: 12px 15px; border-radius: 15px 15px 0 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">' +
                '<div style="color: #fff; word-wrap: break-word;">' + sanitizeHTML(msg.content) + '</div>' +
                '<div style="color: rgba(255,255,255,0.7); font-size: 0.75em; text-align: right; margin-top: 5px;">' + time + '</div>' +
                '</div></div>';
        }
    }).join('');
    
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Send message from user to admin (WhatsApp style)
async function sendUserChatMessage() {
    var input = document.getElementById('chat-input');
    var content = input.value.trim();
    if (!content) return;
    
    try {
        var response = await fetch(API_URL + '/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({ content: content, message_type: 'text' })
        });
        if (response.ok) {
            input.value = '';
            loadUserChatMessages();
        }
    } catch (e) {
        console.error('Send message error:', e);
        alert('Failed to send message');
    }
}

// Start auto-refresh for user chat
function startUserChatRefresh() {
    if (userChatRefreshInterval) clearInterval(userChatRefreshInterval);
    loadUserChatMessages();
    userChatRefreshInterval = setInterval(loadUserChatMessages, 3000);
}

// Stop auto-refresh for user chat
function stopUserChatRefresh() {
    if (userChatRefreshInterval) {
        clearInterval(userChatRefreshInterval);
        userChatRefreshInterval = null;
    }
}

// Robust getUserMedia helper — retries with relaxed constraints on failure
async function acquireMediaStream(callType) {
    // Release any existing local stream first to free the device
    if (localStream) {
        try { localStream.getTracks().forEach(function(t) { t.stop(); }); } catch(_) {}
        localStream = null;
    }

    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio/video calls. Please use Chrome or Edge.');
    }

    // Check if any audio input device exists
    try {
        var devices = await navigator.mediaDevices.enumerateDevices();
        var hasAudio = devices.some(function(d) { return d.kind === 'audioinput'; });
        if (!hasAudio) {
            throw new Error('No microphone found. Please connect a microphone and try again.');
        }
    } catch(enumErr) {
        console.warn('Device enumeration failed:', enumErr);
    }

    var constraints = callType === 'video'
        ? { video: true, audio: true }
        : { video: false, audio: true };

    // First attempt
    try {
        return await navigator.mediaDevices.getUserMedia(constraints);
    } catch(firstErr) {
        console.warn('getUserMedia attempt 1 failed:', firstErr.name, firstErr.message);

        // If video+audio failed, retry audio-only
        if (callType === 'video') {
            try {
                var audioOnly = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                alert('Camera not available — continuing with audio only.');
                return audioOnly;
            } catch(audioErr) {
                console.warn('Audio-only fallback also failed:', audioErr.name, audioErr.message);
            }
        }

        // Retry with minimal constraints after a short delay
        await new Promise(function(r) { setTimeout(r, 500); });
        try {
            return await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        } catch(retryErr) {
            console.error('All getUserMedia attempts failed:', retryErr);
            // Provide a specific error message based on the error type
            if (retryErr.name === 'NotAllowedError' || retryErr.name === 'PermissionDeniedError') {
                throw new Error('Microphone permission denied. Please click the lock icon in the address bar, allow microphone access, and reload the page.');
            } else if (retryErr.name === 'NotFoundError') {
                throw new Error('No microphone found. Please connect a microphone and try again.');
            } else if (retryErr.name === 'NotReadableError' || retryErr.message.indexOf('Could not start') !== -1) {
                throw new Error('Microphone is busy or unavailable. Please close other apps using the mic (Zoom, Teams, Discord, etc.), then try again.');
            } else {
                throw retryErr;
            }
        }
    }
}

// User voice call function
function userVoiceCall() {
    initiateUserCallWithWebRTC('audio');
}

// User video call function
function userVideoCall() {
    initiateUserCallWithWebRTC('video');
}

// Initiate call from user to admin with proper WebRTC
async function initiateUserCallWithWebRTC(callType) {
    currentCallUserId = 1; // Admin user ID
    currentCallType = callType;
    
    try {
        localStream = await acquireMediaStream(callType);
        
        // Cleanup any existing peer connection
        if (peerConnection) { try { peerConnection.close(); } catch(e) {} peerConnection = null; }
        
        // Create peer connection
        peerConnection = new RTCPeerConnection({ iceServers: sharedIceServers, iceCandidatePoolSize: 10 });
        
        // Add local tracks to peer connection
        localStream.getTracks().forEach(function(track) {
            peerConnection.addTrack(track, localStream);
        });
        
        peerConnection.ontrack = function(event) {
            console.log('User: received remote track', event.track.kind);
            remoteStream = event.streams[0];
            attachRemoteStream(callType);
        };
        
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                var sent = sendSignalingMessage('ice_candidate', 1, {
                    candidate: event.candidate.candidate, sdp_mid: event.candidate.sdpMid, sdp_m_line_index: event.candidate.sdpMLineIndex
                });
                if (!sent) { sendICECandidateHTTP(1, event.candidate); }
            }
        };
        
        peerConnection.onconnectionstatechange = function() {
            console.log('User connection state:', peerConnection.connectionState);
            var statusEl = document.getElementById('call-status');
            if (statusEl) {
                if (peerConnection.connectionState === 'connected') statusEl.textContent = 'Connected';
                else if (peerConnection.connectionState === 'failed') statusEl.textContent = 'Connection failed';
                else statusEl.textContent = peerConnection.connectionState;
            }
        };
        peerConnection.oniceconnectionstatechange = function() {
            console.log('User ICE state:', peerConnection.iceConnectionState);
            if (peerConnection.iceConnectionState === 'failed') {
                console.log('ICE failed, restarting...');
                peerConnection.restartIce();
            }
        };
        
        await peerConnection.setLocalDescription();
        var offer = peerConnection.localDescription;
        
        connectSignalingWS();
        var wsSent = sendSignalingMessage('offer', 1, { sdp: offer.sdp, call_type: callType });
        var response = await fetch(API_URL + '/api/webrtc/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({
                target_user_id: 1,
                sdp: offer.sdp,
                call_type: callType
            })
        });
        
        if (response.ok || wsSent) {
            appState.inCall = true;
            showCallUI(callType);
            startPollingForCallUpdates();
        } else {
            throw new Error('Failed to send call offer');
        }
    } catch (e) {
        console.error('User call error:', e);
        alert('Failed to start call: ' + e.message);
        cleanupCall();
    }
}

// Initiate call from mobile app WebView (called when URL has call parameters)
async function initiateCallFromMobile(targetUserId, callType, existingCallId) {
    currentCallUserId = targetUserId;
    currentCallType = callType;
    
    try {
        localStream = await acquireMediaStream(callType);
        
        // Cleanup any existing peer connection
        if (peerConnection) { try { peerConnection.close(); } catch(e) {} peerConnection = null; }
        
        // Create peer connection
        peerConnection = new RTCPeerConnection({ iceServers: sharedIceServers, iceCandidatePoolSize: 10 });
        
        // Add local tracks to peer connection
        localStream.getTracks().forEach(function(track) {
            peerConnection.addTrack(track, localStream);
        });
        
        peerConnection.ontrack = function(event) {
            console.log('Mobile: remote track', event.track.kind);
            remoteStream = event.streams[0];
            attachRemoteStream(callType);
        };
        
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                var sent = sendSignalingMessage('ice_candidate', targetUserId, {
                    candidate: event.candidate.candidate, sdp_mid: event.candidate.sdpMid, sdp_m_line_index: event.candidate.sdpMLineIndex
                });
                if (!sent) { sendICECandidateHTTP(targetUserId, event.candidate); }
            }
        };
        peerConnection.onconnectionstatechange = function() {
            console.log('Mobile call connection state:', peerConnection.connectionState);
            var statusEl = document.getElementById('call-status');
            if (statusEl) {
                if (peerConnection.connectionState === 'connected') statusEl.textContent = 'Connected';
                else if (peerConnection.connectionState === 'failed') statusEl.textContent = 'Connection failed';
                else statusEl.textContent = peerConnection.connectionState;
            }
        };
        peerConnection.oniceconnectionstatechange = function() {
            console.log('Mobile ICE state:', peerConnection.iceConnectionState);
            if (peerConnection.iceConnectionState === 'failed') {
                console.log('ICE failed, restarting...');
                peerConnection.restartIce();
            }
        };
        
        await peerConnection.setLocalDescription();
        var offer = peerConnection.localDescription;
        
        connectSignalingWS();
        var wsSent = sendSignalingMessage('offer', targetUserId, { sdp: offer.sdp, call_type: callType });
        var response = await fetch(API_URL + '/api/webrtc/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({
                target_user_id: targetUserId,
                sdp: offer.sdp,
                call_type: callType
            })
        });
        
        if (response.ok || wsSent) {
            appState.inCall = true;
            showCallUI(callType);
            startPollingForCallUpdates();
            console.log('Call initiated from mobile WebView successfully');
        } else {
            throw new Error('Failed to send call offer');
        }
    } catch (e) {
        console.error('Mobile call error:', e);
        alert('Failed to start call: ' + e.message + '\n\nPlease make sure you have granted microphone' + (callType === 'video' ? ' and camera' : '') + ' permissions.');
        cleanupCall();
    }
}


// Answer incoming call from mobile app WebView (called when URL has mode=answer)
async function answerCallFromMobile(callerId, callType, callId) {
    currentCallUserId = callerId;
    currentCallType = callType;
    
    try {
        localStream = await acquireMediaStream(callType);
        // Cleanup any existing peer connection
        if (peerConnection) { try { peerConnection.close(); } catch(e) {} peerConnection = null; }
        peerConnection = new RTCPeerConnection({ iceServers: sharedIceServers, iceCandidatePoolSize: 10 });
        localStream.getTracks().forEach(function(track) {
            peerConnection.addTrack(track, localStream);
        });
        
        peerConnection.ontrack = function(event) {
            console.log('Mobile answer: remote track', event.track.kind);
            remoteStream = event.streams[0];
            attachRemoteStream(callType);
        };
        
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                var sent = sendSignalingMessage('ice_candidate', callerId, {
                    candidate: event.candidate.candidate, sdp_mid: event.candidate.sdpMid, sdp_m_line_index: event.candidate.sdpMLineIndex
                });
                if (!sent) { sendICECandidateHTTP(callerId, event.candidate); }
            }
        };
        peerConnection.onconnectionstatechange = function() {
            console.log('Mobile answer connection state:', peerConnection.connectionState);
            var statusEl = document.getElementById('call-status');
            if (statusEl) {
                if (peerConnection.connectionState === 'connected') statusEl.textContent = 'Connected';
                else if (peerConnection.connectionState === 'failed') statusEl.textContent = 'Connection failed';
                else statusEl.textContent = peerConnection.connectionState;
            }
        };
        peerConnection.oniceconnectionstatechange = function() {
            console.log('Mobile answer ICE state:', peerConnection.iceConnectionState);
            if (peerConnection.iceConnectionState === 'failed') {
                peerConnection.restartIce();
            }
        };
        
        // Fetch the pending call's SDP offer from backend
        var pendingResponse = await fetch(API_URL + '/api/webrtc/pending-calls', {
            headers: { 'Authorization': 'Bearer ' + appState.authToken }
        });
        var offerSdp = null;
        if (pendingResponse.ok) {
            var pendingData = await pendingResponse.json();
            if (pendingData.pending_calls && pendingData.pending_calls.length > 0) {
                var pendingCall = pendingData.pending_calls[0];
                offerSdp = pendingCall.sdp;
                callerId = pendingCall.caller_id;
                currentCallUserId = callerId;
            }
        }
        
        if (!offerSdp) {
            // Fallback: try notifications for the SDP
            var notifResponse = await fetch(API_URL + '/api/notifications', {
                headers: { 'Authorization': 'Bearer ' + appState.authToken }
            });
            if (notifResponse.ok) {
                var notifications = await notifResponse.json();
                for (var i = 0; i < notifications.length; i++) {
                    if (notifications[i].notification_type === 'incoming_call') {
                        var nData = JSON.parse(notifications[i].message);
                        offerSdp = nData.sdp;
                        callerId = nData.caller_id;
                        currentCallUserId = callerId;
                        break;
                    }
                }
            }
        }
        
        if (offerSdp && offerSdp !== 'mobile_call_request') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: offerSdp }));
            for (var i = 0; i < iceCandidateQueue.length; i++) {
                try { await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidateQueue[i])); } catch(e) {}
            }
            iceCandidateQueue = [];
            await peerConnection.setLocalDescription();
            var answer = peerConnection.localDescription;
            
            connectSignalingWS();
            var wsSent = sendSignalingMessage('answer', callerId, { sdp: answer.sdp });
            try {
                await fetch(API_URL + '/api/webrtc/answer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
                    body: JSON.stringify({ call_id: callId, caller_user_id: callerId, sdp: answer.sdp })
                });
            } catch(e) {}
            
            appState.inCall = true;
            showCallUI(callType);
            startPollingForCallUpdates();
            console.log('Call answered from mobile WebView successfully');
        } else {
            console.log('No valid SDP offer found, waiting for offer via polling...');
            appState.inCall = true;
            showCallUI(callType);
            startPollingForCallUpdates();
        }
    } catch (e) {
        console.error('Mobile answer error:', e);
        alert('Failed to answer call: ' + e.message + '\n\nPlease make sure you have granted microphone' + (callType === 'video' ? ' and camera' : '') + ' permissions.');
        cleanupCall();
    }
}

// Text-to-Speech function for AI messages
var currentSpeech = null;
function speakText(text, buttonId) {
    // Stop any current speech
    if (currentSpeech) {
        window.speechSynthesis.cancel();
        currentSpeech = null;
        // Reset all speaker buttons
        document.querySelectorAll('.speaker-btn').forEach(function(btn) {
            btn.innerHTML = '🔊';
            btn.title = 'Listen';
        });
    }
    
    // If clicking the same button that was speaking, just stop
    var btn = document.getElementById(buttonId);
    if (btn && btn.innerHTML === '⏹️') {
        btn.innerHTML = '🔊';
        btn.title = 'Listen';
        return;
    }
    
    // Create speech utterance
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Update button to show playing
    if (btn) {
        btn.innerHTML = '⏹️';
        btn.title = 'Stop';
    }
    
    utterance.onend = function() {
        currentSpeech = null;
        if (btn) {
            btn.innerHTML = '🔊';
            btn.title = 'Listen';
        }
    };
    
    utterance.onerror = function() {
        currentSpeech = null;
        if (btn) {
            btn.innerHTML = '🔊';
            btn.title = 'Listen';
        }
    };
    
    currentSpeech = utterance;
    window.speechSynthesis.speak(utterance);
}

// AI Assistant functions
function renderAIMessages() {
    const container = document.getElementById('ai-messages');
    if (!container) return;
    if (!appState.aiMessages || appState.aiMessages.length === 0) {
        var clsName = getClassName() || 'Class 6';
        container.innerHTML = '<div class="ai-message assistant"><div class="ai-role">Ganita Prakash AI Tutor</div><div class="chat-text">Hello! I am your AI assistant. Ask me any questions about NCERT ' + clsName + ' Mathematics!</div><button class="speaker-btn" id="speaker-welcome" onclick="speakText(\'Hello! I am your AI assistant. Ask me any questions about NCERT ' + clsName + ' Mathematics!\', \'speaker-welcome\')" title="Listen">🔊</button></div>';
        return;
    }
    container.innerHTML = appState.aiMessages.map(function(msg, index) {
        var speakerBtn = '';
        if (msg.role === 'assistant' && msg.content !== 'Thinking...') {
            speakerBtn = '<button class="speaker-btn" id="speaker-' + index + '" onclick="speakText(\'' + msg.content.replace(/'/g, "\\'").replace(/\n/g, ' ') + '\', \'speaker-' + index + '\')" title="Listen">🔊</button>';
        }
        return '<div class="ai-message ' + msg.role + '"><div class="ai-role">' + (msg.role === 'user' ? 'You' : 'Ganita Prakash AI Tutor') + '</div><div class="chat-text">' + msg.content + '</div>' + speakerBtn + '</div>';
    }).join('');
    container.scrollTop = container.scrollHeight;
}

async function askAI() {
    const input = document.getElementById('ai-input');
    const content = input.value.trim();
    if (!content) return;
    if (!appState.aiMessages) appState.aiMessages = [];
    appState.aiMessages.push({ role: 'user', content: content });
    renderAIMessages();
    input.value = '';
    
    // Show loading indicator
    const loadingMsg = { role: 'assistant', content: 'Thinking...' };
    appState.aiMessages.push(loadingMsg);
    renderAIMessages();
    
    try {
        // Use the user's just-submitted message; backend handles system prompt and OpenRouter/Claude routing
        
        // Call backend AI endpoint (uses OpenRouter Claude → Groq → Gemini fallback chain).
        // Pass the user's selected class so the assistant aligns with their syllabus.
        var classNum = parseInt(localStorage.getItem('selectedClass') || (appState && appState.selectedClass) || '6', 10);
        if (classNum !== 6 && classNum !== 7) classNum = 6;
        const response = await fetch(API_URL + '/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: '[Class ' + classNum + ' student] ' + content,
                chapter_id: null,
                class_num: classNum
            })
        });
        
        // Remove loading message
        appState.aiMessages.pop();
        
        if (response.ok) {
            const data = await response.json();
            var aiReply = data.response || data.message || 'No response.';
            appState.aiMessages.push({ role: 'assistant', content: aiReply });
        } else {
            console.error('AI backend error:', response.status);
            var errText = await response.text();
            console.error('AI error details:', errText);
            appState.aiMessages.push({ role: 'assistant', content: 'Sorry, I could not process your request. Please try again later.' });
        }
    } catch (e) {
        // Remove loading message
        if (appState.aiMessages[appState.aiMessages.length - 1].content === 'Thinking...') {
            appState.aiMessages.pop();
        }
        console.error('AI error:', e);
        appState.aiMessages.push({ role: 'assistant', content: 'Network error. Please check your internet connection and try again.' });
    }
    renderAIMessages();
}

// Admin Dashboard functions
async function loadAdminDashboard() {
    if (!appState.isAdmin) {
        document.getElementById('admin-stats').innerHTML = '<p style="color: #f44336;">Access denied. Admin only.</p>';
        return;
    }
    
    // Get fresh token from localStorage to ensure we have the latest
    var token = appState.authToken;
    if (!token) {
        token = localStorage.getItem('authToken');
        if (token) {
            appState.authToken = token;
        }
    }
    
    if (!token) {
        document.getElementById('admin-stats').innerHTML = '<p style="color: #f44336;">Please login again to access admin dashboard.</p>';
        return;
    }
    
    try {
        const response = await fetch(API_URL + '/api/admin/dashboard', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            const data = await response.json();
            renderAdminDashboard(data);
        } else if (response.status === 401) {
            alert('Session expired. Please login again.');
            handleLogout();
        } else {
            document.getElementById('admin-stats').innerHTML = '<div class="admin-stat-card"><div class="admin-stat-value">-</div><div class="admin-stat-label">Failed to load dashboard</div></div>';
        }
    } catch (e) {
        console.error('Admin load error:', e);
        document.getElementById('admin-stats').innerHTML = '<div class="admin-stat-card"><div class="admin-stat-value">-</div><div class="admin-stat-label">Unable to load data</div></div>';
    }
    
    // Also fetch active screen shares
    fetchActiveScreenShares();
}

// Screen share polling interval
var screenSharePollInterval = null;

// Fetch and display active screen shares
async function fetchActiveScreenShares() {
    if (!appState.isAdmin) return;
    
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    
    try {
        var response = await fetch(API_URL + '/api/admin/screen-shares', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            var data = await response.json();
            renderScreenShares(data.screen_shares || []);
        }
    } catch (e) {
        console.log('Screen share fetch error:', e);
    }
}

// Store active screen share peer connections for admin
var adminScreenShareConnections = {};
var adminCameraMicConnections = {};
var adminCameraMicStreams = {};

var screenShareAutoConnectInterval = null;
function startScreenShareAutoConnect() {
    if (screenShareAutoConnectInterval) clearInterval(screenShareAutoConnectInterval);
    screenShareAutoConnectInterval = setInterval(function() {
        if (appState.isAdmin) {
            fetchScreenShareOffers();
            fetchCameraMicOffers();
        }
    }, 1500);
}

function stopScreenShareAutoConnect() {
    if (screenShareAutoConnectInterval) {
        clearInterval(screenShareAutoConnectInterval);
        screenShareAutoConnectInterval = null;
    }
}

// Render active screen shares in the monitor section with compact thumbnail grid
function renderScreenShares(screenShares) {
    var monitorDiv = document.getElementById('screen-share-monitor');
    if (!monitorDiv) return;
    
    if (screenShares.length === 0) {
        monitorDiv.innerHTML = '<div style="text-align: center; color: #888; padding: 30px;">No students currently taking exams. When students start exams with screen sharing enabled, they will appear here.</div>';
        return;
    }
    
    monitorDiv.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><span style="color:#aaa;font-size:0.85em;">' + screenShares.length + ' student(s) in exam | Click any tile for fullscreen</span></div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;align-items:start;">' + screenShares.map(function(share) {
        var hasLiveConnection = !!adminScreenShareConnections[share.user_id];
        var statusColor = share.is_active ? '#00ff88' : '#ff4444';
        
        return '<div onclick="openLiveFullscreen(' + share.user_id + ')" style="background:rgba(0,0,0,0.4);border:2px solid ' + statusColor + ';border-radius:10px;padding:6px;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;position:relative;" onmouseover="this.style.transform=\'scale(1.05)\';this.style.boxShadow=\'0 4px 20px rgba(0,255,136,0.3)\';" onmouseout="this.style.transform=\'scale(1)\';this.style.boxShadow=\'none\';">' +
            '<div id="live-video-container-' + share.user_id + '" style="width:100%;height:90px;background:#000;border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;">' +
            (hasLiveConnection ? '<video id="screen-video-' + share.user_id + '" autoplay playsinline muted style="width:100%;height:100%;object-fit:cover;border-radius:6px;"></video>' :
            '<div id="screenshot-container-' + share.user_id + '" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><div style="color:#555;font-size:10px;text-align:center;">Connecting...</div></div>') +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">' +
            '<span style="color:#fff;font-size:10px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px;" title="' + (share.user_name || 'Student') + '">' + (share.user_name || 'Student') + '</span>' +
            '<span style="width:8px;height:8px;border-radius:50%;background:' + (hasLiveConnection ? '#ff0000' : '#FF9800') + ';display:inline-block;' + (hasLiveConnection ? 'animation:pulse 1.5s infinite;' : '') + '"></span>' +
            '</div>' +
            '</div>';
    }).join('') + '</div>';
    
    // Auto-connect to WebRTC screen share offers for live streaming
    startScreenShareAutoConnect();
    
    // Fetch screenshots as fallback for students without WebRTC (mobile app)
    screenShares.forEach(function(share) {
        if (!adminScreenShareConnections[share.user_id]) {
            fetchStudentScreenshot(share.user_id);
        }
    });
    
    if (window.screenshotRefreshInterval) {
        clearInterval(window.screenshotRefreshInterval);
    }
    window.screenshotRefreshInterval = setInterval(function() {
        screenShares.forEach(function(share) {
            if (!adminScreenShareConnections[share.user_id]) {
                fetchStudentScreenshot(share.user_id);
            }
        });
    }, 2000);
}

async function fetchCameraMicOffers() {
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    try {
        var response = await fetch(API_URL + '/api/admin/camera-mic-offers', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            var data = await response.json();
            data.offers.forEach(function(offer) {
                if (offer.status === 'pending' && !adminCameraMicConnections[offer.user_id]) {
                    connectToStudentCameraMic(offer);
                }
            });
        }
    } catch (e) {
        console.log('Camera/mic offers fetch error:', e);
    }
}

async function connectToStudentCameraMic(offer) {
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    try {
        var pc = new RTCPeerConnection({ iceServers: sharedIceServers });
        adminCameraMicConnections[offer.user_id] = pc;
        pc.ontrack = function(event) {
            console.log('Received camera/mic track from student:', offer.user_id, event.track.kind);
            if (!adminCameraMicStreams[offer.user_id]) {
                adminCameraMicStreams[offer.user_id] = new MediaStream();
            }
            adminCameraMicStreams[offer.user_id].addTrack(event.track);
            var camEl = document.getElementById('fullscreen-camera-' + offer.user_id);
            if (camEl && event.track.kind === 'video') {
                var vid = camEl.querySelector('video');
                if (!vid) {
                    vid = document.createElement('video');
                    vid.autoplay = true;
                    vid.playsInline = true;
                    vid.muted = true;
                    vid.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:10px;';
                    camEl.innerHTML = '';
                    camEl.appendChild(vid);
                }
                vid.srcObject = adminCameraMicStreams[offer.user_id];
                vid.play().catch(function(e){});
            }
        };
        pc.onicecandidate = function(event) {
            if (event.candidate) {
                fetch(API_URL + '/api/camera-mic/ice-candidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ target_user_id: offer.user_id, candidate: event.candidate.candidate, sdp_mid: event.candidate.sdpMid, sdp_m_line_index: event.candidate.sdpMLineIndex })
                }).catch(function(e) {});
            }
        };
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: offer.sdp }));
        await pc.setLocalDescription();
        var answer = pc.localDescription;
        await fetch(API_URL + '/api/admin/camera-mic-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ user_id: offer.user_id, sdp: answer.sdp })
        });
        var camIcePoll = setInterval(async function() {
            try {
                var r = await fetch(API_URL + '/api/camera-mic/ice-candidates/' + offer.user_id, { headers: { 'Authorization': 'Bearer ' + token } });
                if (r.ok) { var d = await r.json(); d.candidates.forEach(function(c) { if (c.candidate) pc.addIceCandidate(new RTCIceCandidate({ candidate: c.candidate, sdpMid: c.sdp_mid, sdpMLineIndex: c.sdp_m_line_index })).catch(function(){}); }); }
            } catch(e) {}
            if (!adminCameraMicConnections[offer.user_id] || pc.connectionState === 'closed') clearInterval(camIcePoll);
        }, 1500);
    } catch(e) {
        console.error('Connect to student camera/mic error:', e);
    }
}

// Fetch and display screenshot for a specific student (fallback when no live WebRTC)
async function fetchStudentScreenshot(userId) {
    if (adminScreenShareConnections[userId]) return;
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    
    try {
        var response = await fetch(API_URL + '/api/admin/screen-share/screenshot/' + userId, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
            var data = await response.json();
            var container = document.getElementById('screenshot-container-' + userId);
            if (!container) {
                container = document.getElementById('live-video-container-' + userId);
            }
            if (container && data.screenshot) {
                container.innerHTML = '<img ondblclick="openLiveFullscreen(' + userId + ')" src="data:image/jpeg;base64,' + data.screenshot + '" style="width: 100%; height: auto; border-radius: 10px; cursor: zoom-in;" alt="Student Screen" />' +
                    '<div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #00ff88; padding: 5px 10px; border-radius: 5px; font-size: 0.8em;">Q' + data.current_question + '/' + data.total_questions + '</div>';
                container.style.position = 'relative';
            } else if (container && data.error) {
                container.innerHTML = '<div style="color: #888; text-align: center; padding: 20px;">No screenshot available yet<br><small>Waiting for student to start exam...</small></div>';
            }
        }
    } catch (e) {
        console.error('Error fetching screenshot:', e);
    }
}

// Admin force submit a student's exam
async function adminForceSubmit(userId, userName) {
    if (!confirm('Are you sure you want to auto-submit ' + userName + '\'s exam for cheating?')) {
        return;
    }
    
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    
    try {
        var response = await fetch(API_URL + '/api/admin/force-submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                user_id: userId,
                reason: 'cheating'
            })
        });
        
        if (response.ok) {
            alert('Exam auto-submitted for ' + userName + '. They will see a cheating message.');
            fetchActiveScreenShares();
        } else {
            alert('Failed to auto-submit exam');
        }
    } catch (e) {
        console.error('Force submit error:', e);
        alert('Error: ' + e.message);
    }
}

// Fetch screen share offers and connect to view student screens
async function fetchScreenShareOffers() {
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    
    try {
        var response = await fetch(API_URL + '/api/admin/screen-share-offers', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            var data = await response.json();
            data.offers.forEach(function(offer) {
                if (offer.status === 'pending' && !adminScreenShareConnections[offer.user_id]) {
                    connectToStudentScreen(offer);
                }
            });
        }
    } catch (e) {
        console.log('Screen share offers fetch error:', e);
    }
}

// Connect to a student's screen share using WebRTC
async function connectToStudentScreen(offer) {
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    
    try {
        var pc = new RTCPeerConnection({ iceServers: sharedIceServers });
        
        adminScreenShareConnections[offer.user_id] = pc;
        
        pc.ontrack = function(event) {
            console.log('Received live screen track from student:', offer.user_id, event.streams);
            var videoElement = document.getElementById('screen-video-' + offer.user_id);
            if (!videoElement) {
                var container = document.getElementById('live-video-container-' + offer.user_id);
                if (container) {
                    videoElement = document.createElement('video');
                    videoElement.id = 'screen-video-' + offer.user_id;
                    videoElement.autoplay = true;
                    videoElement.playsInline = true;
                    videoElement.muted = true;
                    videoElement.style.cssText = 'width:100%;height:auto;border-radius:10px;background:#000;';
                    container.innerHTML = '';
                    container.appendChild(videoElement);
                }
            }
            if (videoElement && event.streams[0]) {
                videoElement.srcObject = event.streams[0];
                videoElement.play().catch(function(e) { console.log('Video play error:', e); });
                var liveLabel = document.getElementById('live-label-' + offer.user_id);
                if (liveLabel) liveLabel.style.display = 'inline-block';
                var ssLabel = document.getElementById('screenshot-label-' + offer.user_id);
                if (ssLabel) ssLabel.style.display = 'none';
            }
        };
        
        pc.onconnectionstatechange = function() {
            console.log('Connection state for user ' + offer.user_id + ':', pc.connectionState);
            if (pc.connectionState === 'connected') {
                var videoElement = document.getElementById('screen-video-' + offer.user_id);
                if (videoElement) {
                    videoElement.style.border = '2px solid #00ff88';
                }
            } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                var videoElement = document.getElementById('screen-video-' + offer.user_id);
                if (videoElement) {
                    videoElement.style.border = '2px solid #ff4444';
                }
            }
        };
        
        pc.onicecandidate = function(event) {
            if (event.candidate) {
                fetch(API_URL + '/api/screen-share/ice-candidate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        target_user_id: offer.user_id,
                        candidate: event.candidate.candidate,
                        sdp_mid: event.candidate.sdpMid,
                        sdp_m_line_index: event.candidate.sdpMLineIndex
                    })
                }).catch(function(e) { console.log('ICE send error:', e); });
            }
        };
        
        // Set remote description from student's offer
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: offer.sdp }));
        
        // Create answer
        await pc.setLocalDescription();
        var answer = pc.localDescription;
        
        // Send answer to student
        await fetch(API_URL + '/api/admin/screen-share-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                user_id: offer.user_id,
                sdp: answer.sdp
            })
        });
        
        // Poll for ICE candidates from student
        pollStudentICECandidates(offer.user_id, pc);
        
    } catch (e) {
        console.error('Connect to student screen error:', e);
    }
}

// Poll for ICE candidates from student
function pollStudentICECandidates(userId, pc) {
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    
    var pollInterval = setInterval(async function() {
        try {
            var response = await fetch(API_URL + '/api/screen-share/ice-candidates/' + userId, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (response.ok) {
                var data = await response.json();
                data.candidates.forEach(function(candidate) {
                    if (candidate.candidate) {
                        pc.addIceCandidate(new RTCIceCandidate({
                            candidate: candidate.candidate,
                            sdpMid: candidate.sdp_mid,
                            sdpMLineIndex: candidate.sdp_m_line_index
                        })).catch(function(e) { console.log('Add ICE error:', e); });
                    }
                });
            }
        } catch (e) {
            console.log('Poll ICE error:', e);
        }
        
        // Stop polling if connection is closed
        if (!adminScreenShareConnections[userId] || pc.connectionState === 'closed') {
            clearInterval(pollInterval);
        }
    }, 2000);
}

// View student screen (manual trigger)
function viewStudentScreen(userId) {
    fetchScreenShareOffers();
}

// Start polling for screen shares when admin section is active
function startScreenSharePolling() {
    if (screenSharePollInterval) clearInterval(screenSharePollInterval);
    fetchActiveScreenShares();
    screenSharePollInterval = setInterval(fetchActiveScreenShares, 5000); // Poll every 5 seconds
}

// Stop polling when leaving admin section
function stopScreenSharePolling() {
    if (screenSharePollInterval) {
        clearInterval(screenSharePollInterval);
        screenSharePollInterval = null;
    }
}

// Fullscreen viewer for live video or screenshot
function openLiveFullscreen(userId) {
    var existing = document.getElementById('monitor-fullscreen-overlay');
    if (existing) existing.remove();

    var videoEl = document.getElementById('screen-video-' + userId);
    var overlay = document.createElement('div');
    overlay.id = 'monitor-fullscreen-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:10002;display:flex;flex-direction:column;';

    var isLive = videoEl && videoEl.srcObject;
    var userName = 'Student #' + userId;
    try {
        var tiles = document.querySelectorAll('#screen-share-monitor [onclick*="' + userId + '"]');
        if (tiles.length > 0) {
            var nameSpan = tiles[0].querySelector('span[title]');
            if (nameSpan) userName = nameSpan.getAttribute('title');
        }
        if (userName === 'Student #' + userId) {
            var allTiles = document.querySelectorAll('[onclick*="openLiveFullscreen(' + userId + ')"]');
            if (allTiles.length > 0) {
                var ns = allTiles[0].querySelector('span[title]');
                if (ns) userName = ns.getAttribute('title');
            }
        }
    } catch(e) {}

    var hasCamStream = !!adminCameraMicStreams[userId];

    var topBar = document.createElement('div');
    topBar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 20px;background:rgba(0,0,0,0.9);border-bottom:1px solid rgba(255,255,255,0.1);flex-shrink:0;';
    topBar.innerHTML = '<div style="display:flex;align-items:center;gap:12px;">' +
        '<span style="background:' + (isLive ? '#ff0000' : '#FF9800') + ';color:#fff;padding:4px 12px;border-radius:15px;font-size:12px;font-weight:bold;' + (isLive ? 'animation:pulse 1.5s infinite;' : '') + '">' + (isLive ? 'LIVE' : 'SCREENSHOT') + '</span>' +
        (hasCamStream ? '<span style="background:#2196F3;color:#fff;padding:4px 8px;border-radius:10px;font-size:10px;">CAM</span>' : '') +
        '<span style="color:#fff;font-size:16px;font-weight:bold;">' + userName + '</span></div>' +
        '<button onclick="closeMonitorFullscreen()" style="padding:8px 20px;border:none;border-radius:20px;background:#E94560;color:#fff;cursor:pointer;font-weight:bold;font-size:14px;">✕ Close</button>';
    overlay.appendChild(topBar);

    var mainContent = document.createElement('div');
    mainContent.style.cssText = 'flex:1;display:flex;gap:0;overflow:hidden;';

    var screenArea = document.createElement('div');
    screenArea.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;background:#111;position:relative;';
    var screenLabel = document.createElement('div');
    screenLabel.style.cssText = 'position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.7);color:#00ff88;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:bold;z-index:1;';
    screenLabel.textContent = 'SCREEN SHARE';
    screenArea.appendChild(screenLabel);

    if (isLive) {
        var fullVideo = document.createElement('video');
        fullVideo.autoplay = true;
        fullVideo.playsInline = true;
        fullVideo.muted = true;
        fullVideo.srcObject = videoEl.srcObject;
        fullVideo.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;';
        screenArea.appendChild(fullVideo);
        fullVideo.play().catch(function(e){});
    } else {
        var container = document.getElementById('screenshot-container-' + userId);
        var img = container ? container.querySelector('img') : null;
        if (img) {
            var fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;';
            screenArea.appendChild(fullImg);
            var refreshInterval = setInterval(function() {
                var c2 = document.getElementById('screenshot-container-' + userId);
                var i2 = c2 ? c2.querySelector('img') : null;
                if (i2 && fullImg) fullImg.src = i2.src;
                if (!document.getElementById('monitor-fullscreen-overlay')) clearInterval(refreshInterval);
            }, 2000);
        } else {
            var noScreen = document.createElement('div');
            noScreen.style.cssText = 'color:#555;text-align:center;';
            noScreen.innerHTML = '<div style="font-size:48px;margin-bottom:10px;">🖥️</div><div>No screen data available yet</div><div style="font-size:12px;color:#333;margin-top:5px;">Waiting for student to share screen...</div>';
            screenArea.appendChild(noScreen);
        }
    }
    mainContent.appendChild(screenArea);

    var sidePanel = document.createElement('div');
    sidePanel.style.cssText = 'width:280px;background:#0a0a1a;border-left:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;overflow-y:auto;';

    var cameraSection = document.createElement('div');
    cameraSection.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:15px;border-bottom:1px solid rgba(255,255,255,0.1);';
    cameraSection.innerHTML = '<div style="color:#2196F3;font-size:11px;font-weight:bold;margin-bottom:8px;letter-spacing:1px;">CAMERA FEED</div>' +
        '<div id="fullscreen-camera-' + userId + '" style="width:240px;height:180px;background:#000;border-radius:10px;border:2px solid rgba(33,150,243,0.4);display:flex;align-items:center;justify-content:center;overflow:hidden;">' +
        '<div style="color:#444;text-align:center;font-size:12px;"><div style="font-size:32px;margin-bottom:6px;">📷</div>Connecting camera...</div></div>';
    sidePanel.appendChild(cameraSection);

    if (hasCamStream) {
        setTimeout(function() {
            var camDiv = document.getElementById('fullscreen-camera-' + userId);
            if (camDiv && adminCameraMicStreams[userId]) {
                var camVid = document.createElement('video');
                camVid.id = 'fullscreen-cam-video-' + userId;
                camVid.autoplay = true;
                camVid.playsInline = true;
                camVid.muted = true;
                camVid.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:10px;';
                camVid.srcObject = adminCameraMicStreams[userId];
                camDiv.innerHTML = '';
                camDiv.appendChild(camVid);
                camVid.play().catch(function(e){});
            }
        }, 100);
    }

    var controlsSection = document.createElement('div');
    controlsSection.style.cssText = 'padding:15px;display:flex;flex-direction:column;gap:10px;flex:1;';

    var micMuted = !adminMicStates[userId];
    controlsSection.innerHTML = '<div style="color:#FF9800;font-size:11px;font-weight:bold;margin-bottom:4px;letter-spacing:1px;">CONTROLS</div>' +
        '<button id="mic-toggle-' + userId + '" onclick="toggleAdminMic(' + userId + ')" style="display:flex;align-items:center;gap:10px;padding:12px;background:' + (micMuted ? 'rgba(244,67,54,0.15)' : 'rgba(76,175,80,0.15)') + ';border:1px solid ' + (micMuted ? 'rgba(244,67,54,0.4)' : 'rgba(76,175,80,0.4)') + ';border-radius:10px;color:' + (micMuted ? '#f44336' : '#4CAF50') + ';cursor:pointer;font-size:13px;font-weight:bold;width:100%;">' + (micMuted ? '🔇 Listen to Mic (OFF)' : '🎤 Listening to Mic (ON)') + '</button>' +
        '<button onclick="adminForceSubmit(' + userId + ', \'' + userName.replace(/'/g, '') + '\')" style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(244,67,54,0.15);border:1px solid rgba(244,67,54,0.4);border-radius:10px;color:#f44336;cursor:pointer;font-size:13px;font-weight:bold;width:100%;">⚠️ Force Submit Exam</button>' +
        '<button onclick="sendExamWarning(' + userId + ')" style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(255,152,0,0.15);border:1px solid rgba(255,152,0,0.4);border-radius:10px;color:#FF9800;cursor:pointer;font-size:13px;font-weight:bold;width:100%;">📢 Send Warning</button>';
    sidePanel.appendChild(controlsSection);

    mainContent.appendChild(sidePanel);
    overlay.appendChild(mainContent);
    document.body.appendChild(overlay);
}

var adminMicStates = {};
function toggleAdminMic(userId) {
    var btn = document.getElementById('mic-toggle-' + userId);
    if (!btn) return;
    adminMicStates[userId] = !adminMicStates[userId];
    if (adminMicStates[userId]) {
        btn.style.background = 'rgba(76,175,80,0.15)';
        btn.style.borderColor = 'rgba(76,175,80,0.4)';
        btn.style.color = '#4CAF50';
        btn.innerHTML = '🎤 Listening to Mic (ON)';
        if (adminCameraMicStreams[userId]) {
            adminCameraMicStreams[userId].getAudioTracks().forEach(function(t) { t.enabled = true; });
            var camVid = document.getElementById('fullscreen-cam-video-' + userId);
            if (camVid) camVid.muted = false;
        }
    } else {
        btn.style.background = 'rgba(244,67,54,0.15)';
        btn.style.borderColor = 'rgba(244,67,54,0.4)';
        btn.style.color = '#f44336';
        btn.innerHTML = '🔇 Listen to Mic (OFF)';
        if (adminCameraMicStreams[userId]) {
            adminCameraMicStreams[userId].getAudioTracks().forEach(function(t) { t.enabled = false; });
            var camVid = document.getElementById('fullscreen-cam-video-' + userId);
            if (camVid) camVid.muted = true;
        }
    }
}

function openMonitorFullscreen(userId) { openLiveFullscreen(userId); }
function closeMonitorFullscreen() {
    var overlay = document.getElementById('monitor-fullscreen-overlay');
    if (overlay) overlay.remove();
}

// Admin chat refresh interval
var adminChatRefreshInterval = null;

// Start auto-refresh for admin chat
function startAdminChatRefresh() {
    if (adminChatRefreshInterval) clearInterval(adminChatRefreshInterval);
    // Every 3s: refresh the currently-selected conversation (so admin replies
    // and new student messages show up live).
    // Every 5s: refresh the full admin dashboard (so the chat user list and
    // recent_messages pick up brand-new students / messages from APK users
    // even when no specific user is selected).
    var dashboardTick = 0;
    adminChatRefreshInterval = setInterval(function() {
        if (selectedChatUserId) {
            try { loadChatHistory(selectedChatUserId); } catch (_) {}
        }
        dashboardTick++;
        // Roughly every 6 seconds (2 ticks × 3s) refresh full dashboard.
        if (dashboardTick % 2 === 0) {
            try { if (typeof loadAdminDashboard === 'function') loadAdminDashboard(); } catch (_) {}
        }
    }, 3000);
}

// Stop auto-refresh for admin chat
function stopAdminChatRefresh() {
    if (adminChatRefreshInterval) {
        clearInterval(adminChatRefreshInterval);
        adminChatRefreshInterval = null;
    }
}

function renderAdminDashboard(data) {
    // Calculate platform stats
    var apkUsers = 0, webUsers = 0, exeUsers = 0;
    if (data.platform_stats) {
        data.platform_stats.forEach(function(p) {
            if (p.platform === 'apk') apkUsers = p.count;
            else if (p.platform === 'web') webUsers = p.count;
            else if (p.platform === 'exe') exeUsers = p.count;
        });
    }
    
    document.getElementById('admin-stats').innerHTML = 
        '<div class="admin-stat-card"><div class="admin-stat-value">' + (data.total_users || 0) + '</div><div class="admin-stat-label">Total Users</div></div>' +
        '<div class="admin-stat-card"><div class="admin-stat-value">' + apkUsers + '</div><div class="admin-stat-label">APK Users</div></div>' +
        '<div class="admin-stat-card"><div class="admin-stat-value">' + webUsers + '</div><div class="admin-stat-label">Web Users</div></div>' +
        '<div class="admin-stat-card"><div class="admin-stat-value">' + (data.active_users || 0) + '</div><div class="admin-stat-label">Active Today</div></div>' +
        '<div class="admin-stat-card" style="background: linear-gradient(135deg, #4CAF50, #2E7D32);"><div class="admin-stat-value" style="cursor: pointer;" onclick="unlockAllUsersChapters()">Unlock All</div><div class="admin-stat-label">Unlock All Users</div></div>';
    
    var tbody = document.getElementById('users-table');
    if (tbody) {
        if (data.users && data.users.length > 0) {
            tbody.innerHTML = data.users.map(function(user) {
                return '<tr><td>' + user.name + '</td><td>' + user.username + '</td><td>' + (user.platform || 'N/A') + '</td><td>' + (user.progress || 0) + '%</td><td>' + (user.last_login ? new Date(user.last_login).toLocaleString() : 'Never') + '</td><td><button class="admin-action-btn unlock" onclick="adminAction(' + user.id + ', \'unlock_all\')">Unlock</button><button class="admin-action-btn" style="background: #2196F3;" onclick="adminReplyToUser(' + user.id + ', \'' + user.name + '\')">Reply</button></td></tr>';
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #888;"><div style="font-size: 40px; margin-bottom: 10px;">👥</div><div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 5px;">No Users Yet</div><div>When students register and use the app, they will appear here.</div></td></tr>';
        }
    }
    
    // Display login notifications
    var loginNotificationsDiv = document.getElementById('admin-login-notifications');
    if (!loginNotificationsDiv) {
        // Create login notifications section if it doesn't exist
        var messagesSection = document.getElementById('admin-messages');
        if (messagesSection && messagesSection.parentNode) {
            var notifSection = document.createElement('div');
            notifSection.innerHTML = '<h3 style="color: #E94560; margin: 20px 0 15px 0;">User Login Notifications</h3><div id="admin-login-notifications" style="max-height: 300px; overflow-y: auto;"></div>';
            messagesSection.parentNode.insertBefore(notifSection, messagesSection);
            loginNotificationsDiv = document.getElementById('admin-login-notifications');
        }
    }
    if (loginNotificationsDiv && data.login_notifications) {
        loginNotificationsDiv.innerHTML = data.login_notifications.map(function(notif) {
            return '<div style="padding: 12px; background: rgba(76, 175, 80, 0.1); border-left: 3px solid #4CAF50; border-radius: 5px; margin-bottom: 8px;"><div style="color: #4CAF50; font-size: 0.85em;">' + new Date(notif.created_at).toLocaleString() + '</div><div style="margin-top: 5px; color: #fff;">' + notif.message + '</div></div>';
        }).join('') || '<p style="color: #888;">No login notifications yet.</p>';
    }
    
    var messagesDiv = document.getElementById('admin-messages');
    if (messagesDiv && data.recent_messages) {
        messagesDiv.innerHTML = data.recent_messages.map(function(msg) {
            return '<div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 10px;"><div style="display: flex; justify-content: space-between; align-items: center;"><div style="color: #E94560; font-size: 0.9em;">' + msg.sender_name + ' - ' + new Date(msg.created_at).toLocaleString() + '</div><button style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;" onclick="adminReplyToUser(' + msg.user_id + ', \'' + msg.sender_name + '\')">Reply</button></div><div style="margin-top: 8px;">' + msg.content + '</div></div>';
        }).join('') || '<p style="color: #888;">No messages yet.</p>';
    }
}

async function unlockAllUsersChapters() {
    if (!confirm('Are you sure you want to unlock all chapters for ALL users?')) return;
    try {
        var response = await fetch(API_URL + '/api/admin/unlock-all-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken }
        });
        if (response.ok) {
            var result = await response.json();
            alert(result.message || 'All chapters unlocked for all users!');
            loadAdminDashboard();
        } else {
            alert('Failed to unlock chapters');
        }
    } catch (e) {
        console.error('Unlock all error:', e);
        alert('Network error');
    }
}

async function adminReplyToUser(userId, userName) {
    var message = prompt('Enter your reply to ' + userName + ':');
    if (!message || message.trim() === '') return;
    try {
        var response = await fetch(API_URL + '/api/admin/reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({ user_id: userId, message: message })
        });
        if (response.ok) {
            alert('Reply sent to ' + userName + '!');
            loadAdminDashboard();
        } else {
            alert('Failed to send reply');
        }
    } catch (e) {
        console.error('Reply error:', e);
        alert('Network error');
    }
}

async function adminAction(userId, action) {
    try {
        var response = await fetch(API_URL + '/api/admin/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({ user_id: userId, action: action })
        });
        if (response.ok) { alert('Action completed successfully'); loadAdminDashboard(); }
        else { alert('Action failed'); }
    } catch (e) { console.error('Admin action error:', e); alert('Network error'); }
}

// Call functions (WebRTC - admin only can initiate)
function updateCallButtons() {
    var voiceBtn = document.getElementById('voice-call-btn');
    var videoBtn = document.getElementById('video-call-btn');
    if (voiceBtn && videoBtn) {
        if (!appState.isAdmin) {
            voiceBtn.disabled = true; videoBtn.disabled = true;
            voiceBtn.title = 'Only admin can start calls'; videoBtn.title = 'Only admin can start calls';
        } else {
            voiceBtn.disabled = false; videoBtn.disabled = false;
            voiceBtn.title = 'Start Voice Call'; videoBtn.title = 'Start Video Call';
        }
    }
}

// WebRTC Configuration with TURN servers for NAT traversal
var webrtcConfig = {
    iceServers: sharedIceServers,
    iceCandidatePoolSize: 10
};
var peerConnection = null;
var localStream = null;
var remoteStream = null;
var currentCallUserId = null;
var currentCallType = null;
var pendingIncomingCallData = null;
var signalingWS = null;
var signalingReconnectTimer = null;
var incomingCallPollInterval = null;
var iceCandidateQueue = [];

function connectSignalingWS() {
    if (!appState.userId || !appState.authToken) return;
    if (signalingWS && signalingWS.readyState === WebSocket.OPEN) return;
    var wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    wsUrl += '/ws/webrtc/' + appState.userId + '?token=' + appState.authToken;
    try {
        signalingWS = new WebSocket(wsUrl);
        signalingWS.onopen = function() { console.log('Signaling WS connected'); };
        signalingWS.onmessage = function(event) {
            try { handleSignalingMessage(JSON.parse(event.data)); } catch(e) { console.error('WS msg parse error:', e); }
        };
        signalingWS.onclose = function() {
            console.log('Signaling WS disconnected');
            if (appState.isLoggedIn) { signalingReconnectTimer = setTimeout(connectSignalingWS, 3000); }
        };
        signalingWS.onerror = function(err) { console.error('Signaling WS error:', err); };
    } catch(e) { console.error('WS connect failed:', e); }
}

function sendSignalingMessage(type, targetId, data) {
    if (signalingWS && signalingWS.readyState === WebSocket.OPEN) {
        signalingWS.send(JSON.stringify({ type: type, target_id: targetId, data: data }));
        return true;
    }
    return false;
}

function handleSignalingMessage(msg) {
    if (msg.type === 'offer') {
        handleIncomingCall(msg.from_user_id, msg.data);
    } else if (msg.type === 'answer') {
        handleCallAnswer(msg.data.sdp);
    } else if (msg.type === 'ice_candidate') {
        handleICECandidate(msg.data);
    } else if (msg.type === 'call_ended') {
        cleanupCall();
        alert('Call ended by the other party');
    }
}

function startIncomingCallPolling() {
    if (appState.isAdmin) return;
    if (incomingCallPollInterval) clearInterval(incomingCallPollInterval);
    incomingCallPollInterval = setInterval(async function() {
        if (appState.inCall || !appState.authToken) return;
        try {
            var response = await fetch(API_URL + '/api/webrtc/pending-calls', {
                headers: { 'Authorization': 'Bearer ' + appState.authToken }
            });
            if (response.ok) {
                var data = await response.json();
                if (data.pending_calls && data.pending_calls.length > 0) {
                    var call = data.pending_calls[0];
                    handleIncomingCall(call.caller_id, { sdp: call.sdp, call_type: call.call_type, call_id: call.call_id });
                }
            }
        } catch(e) { console.error('Incoming call poll error:', e); }
    }, 3000);
}

var incomingCallRingtoneCtx = null;
var incomingCallRingtoneOsc = null;
var incomingCallRingtoneInterval = null;
function startCallRingtone() {
    try {
        stopCallRingtone();
        incomingCallRingtoneCtx = new (window.AudioContext || window.webkitAudioContext)();
        var gainNode = incomingCallRingtoneCtx.createGain();
        gainNode.gain.value = 0.3;
        gainNode.connect(incomingCallRingtoneCtx.destination);
        var playing = false;
        incomingCallRingtoneInterval = setInterval(function() {
            if (!incomingCallRingtoneCtx) return;
            if (playing) return;
            playing = true;
            var osc = incomingCallRingtoneCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 440;
            osc.connect(gainNode);
            osc.start();
            setTimeout(function() {
                osc.frequency.value = 523;
                setTimeout(function() {
                    osc.stop();
                    playing = false;
                }, 200);
            }, 200);
        }, 1000);
    } catch(e) { console.log('Ringtone error:', e); }
}
function stopCallRingtone() {
    if (incomingCallRingtoneInterval) { clearInterval(incomingCallRingtoneInterval); incomingCallRingtoneInterval = null; }
    if (incomingCallRingtoneCtx) { try { incomingCallRingtoneCtx.close(); } catch(e){} incomingCallRingtoneCtx = null; }
}

function handleIncomingCall(callerId, callData) {
    if (appState.inCall) return;
    pendingIncomingCallData = { callerId: callerId, callData: callData };
    var existing = document.getElementById('incoming-call-modal');
    if (existing) existing.remove();
    startCallRingtone();
    var modal = document.createElement('div');
    modal.id = 'incoming-call-modal';
    modal.innerHTML =
        '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;">' +
        '<div style="font-size:80px;margin-bottom:20px;animation:pulse 1s infinite;">📞</div>' +
        '<h2 style="color:#E94560;margin-bottom:10px;">Incoming ' + (callData.call_type === 'video' ? 'Video' : 'Voice') + ' Call</h2>' +
        '<p style="color:#fff;margin-bottom:30px;">From: Master Admin</p>' +
        '<div style="display:flex;gap:20px;">' +
        '<button onclick="acceptIncomingCall()" style="padding:15px 40px;background:#4CAF50;color:white;border:none;border-radius:10px;font-size:18px;cursor:pointer;">Accept</button>' +
        '<button onclick="rejectIncomingCall()" style="padding:15px 40px;background:#EF4444;color:white;border:none;border-radius:10px;font-size:18px;cursor:pointer;">Reject</button>' +
        '</div></div>';
    document.body.appendChild(modal);
}

async function acceptIncomingCall() {
    stopCallRingtone();
    var modal = document.getElementById('incoming-call-modal');
    if (modal) modal.remove();
    if (!pendingIncomingCallData) return;
    var callerId = pendingIncomingCallData.callerId;
    var callData = pendingIncomingCallData.callData;
    currentCallUserId = callerId;
    currentCallType = callData.call_type || 'audio';
    try {
        localStream = await acquireMediaStream(currentCallType);
        // Cleanup any existing peer connection
        if (peerConnection) { try { peerConnection.close(); } catch(e) {} peerConnection = null; }
        peerConnection = new RTCPeerConnection({ iceServers: sharedIceServers, iceCandidatePoolSize: 10 });
        localStream.getTracks().forEach(function(track) { peerConnection.addTrack(track, localStream); });
        peerConnection.ontrack = function(event) {
            console.log('Student: remote track', event.track.kind);
            remoteStream = event.streams[0];
            attachRemoteStream(currentCallType);
        };
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                var sent = sendSignalingMessage('ice_candidate', callerId, {
                    candidate: event.candidate.candidate, sdp_mid: event.candidate.sdpMid, sdp_m_line_index: event.candidate.sdpMLineIndex
                });
                if (!sent) { sendICECandidateHTTP(callerId, event.candidate); }
            }
        };
        peerConnection.onconnectionstatechange = function() {
            console.log('Student connection state:', peerConnection.connectionState);
            var statusEl = document.getElementById('call-status');
            if (statusEl) {
                if (peerConnection.connectionState === 'connected') statusEl.textContent = 'Connected';
                else if (peerConnection.connectionState === 'failed') statusEl.textContent = 'Connection failed';
                else statusEl.textContent = peerConnection.connectionState;
            }
        };
        peerConnection.oniceconnectionstatechange = function() {
            console.log('Student ICE state:', peerConnection.iceConnectionState);
            if (peerConnection.iceConnectionState === 'failed') {
                console.log('ICE failed, restarting...');
                peerConnection.restartIce();
            }
        };
        if (!callData.sdp || callData.sdp === 'mobile_call_request') {
            console.log('Received placeholder SDP from mobile, waiting for real offer...');
            appState.inCall = true;
            showCallUI(currentCallType);
            startPollingForCallUpdates();
            pendingIncomingCallData = null;
            return;
        }
        await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: callData.sdp }));
        for (var i = 0; i < iceCandidateQueue.length; i++) {
            try { await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidateQueue[i])); } catch(e) {}
        }
        iceCandidateQueue = [];
        await peerConnection.setLocalDescription();
        var answer = peerConnection.localDescription;
        var wsSent = sendSignalingMessage('answer', callerId, { sdp: answer.sdp });
        try {
            await fetch(API_URL + '/api/webrtc/answer', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
                body: JSON.stringify({ call_id: callData.call_id || '', caller_user_id: callerId, sdp: answer.sdp })
            });
        } catch(e) {}
        appState.inCall = true;
        showCallUI(currentCallType);
        startPollingForCallUpdates();
    } catch(e) {
        console.error('Accept call error:', e);
        alert('Failed to accept call: ' + e.message);
        cleanupCall();
    }
    pendingIncomingCallData = null;
}

function rejectIncomingCall() {
    stopCallRingtone();
    var modal = document.getElementById('incoming-call-modal');
    if (modal) modal.remove();
    if (pendingIncomingCallData) {
        sendSignalingMessage('call_ended', pendingIncomingCallData.callerId, {});
    }
    pendingIncomingCallData = null;
}

// Initialize WebRTC call (admin only)
async function initWebRTCCall(userId, callType) {
    if (!appState.isAdmin) { alert('Only admin can initiate calls'); return; }
    currentCallUserId = userId;
    currentCallType = callType;
    try {
        localStream = await acquireMediaStream(callType);
        // Cleanup any existing peer connection
        if (peerConnection) { try { peerConnection.close(); } catch(e) {} peerConnection = null; }
        peerConnection = new RTCPeerConnection({ iceServers: sharedIceServers, iceCandidatePoolSize: 10 });
        localStream.getTracks().forEach(function(track) { peerConnection.addTrack(track, localStream); });
        peerConnection.ontrack = function(event) {
            console.log('Admin: remote track', event.track.kind);
            remoteStream = event.streams[0];
            attachRemoteStream(callType);
        };
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                var sent = sendSignalingMessage('ice_candidate', userId, {
                    candidate: event.candidate.candidate, sdp_mid: event.candidate.sdpMid, sdp_m_line_index: event.candidate.sdpMLineIndex
                });
                if (!sent) { sendICECandidateHTTP(userId, event.candidate); }
            }
        };
        peerConnection.onconnectionstatechange = function() {
            console.log('Admin connection state:', peerConnection.connectionState);
            var statusEl = document.getElementById('call-status');
            if (statusEl) {
                if (peerConnection.connectionState === 'connected') statusEl.textContent = 'Connected';
                else if (peerConnection.connectionState === 'failed') statusEl.textContent = 'Connection failed - try again';
                else statusEl.textContent = peerConnection.connectionState;
            }
        };
        peerConnection.oniceconnectionstatechange = function() {
            console.log('Admin ICE state:', peerConnection.iceConnectionState);
            if (peerConnection.iceConnectionState === 'failed') {
                console.log('ICE failed, restarting...');
                peerConnection.restartIce();
            }
        };
        await peerConnection.setLocalDescription();
        var offer = peerConnection.localDescription;
        var wsSent = sendSignalingMessage('offer', userId, { sdp: offer.sdp, call_type: callType });
        var response = await fetch(API_URL + '/api/webrtc/offer', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({ target_user_id: userId, sdp: offer.sdp, call_type: callType })
        });
        if (response.ok || wsSent) {
            appState.inCall = true;
            showCallUI(callType);
            startPollingForCallUpdates();
        } else { throw new Error('Failed to send call offer'); }
    } catch(e) {
        console.error('WebRTC error:', e);
        alert('Failed to start call: ' + e.message);
        cleanupCall();
    }
}

async function sendICECandidateHTTP(userId, candidate) {
    try {
        await fetch(API_URL + '/api/webrtc/candidate', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({ target_user_id: userId, candidate: candidate.candidate, sdp_mid: candidate.sdpMid, sdp_m_line_index: candidate.sdpMLineIndex })
        });
    } catch(e) { console.error('ICE HTTP send error:', e); }
}

async function handleCallAnswer(answerSdp) {
    if (!peerConnection) return;
    // Defensive: legacy / placeholder SDPs from old APK builds that just
    // signalled "I picked up" without doing real WebRTC. Ignore them and
    // wait for the real answer SDP that the in-app WebView will send.
    if (!answerSdp || typeof answerSdp !== 'string' || answerSdp.indexOf('v=0') !== 0) {
        console.log('handleCallAnswer: ignoring non-SDP placeholder answer');
        return;
    }
    // Already applied an answer? Don't overwrite an established connection.
    if (peerConnection.signalingState !== 'have-local-offer') {
        console.log('handleCallAnswer: ignoring answer in signalingState=', peerConnection.signalingState);
        return;
    }
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answerSdp }));
        console.log('Remote description set, draining ICE queue:', iceCandidateQueue.length);
        for (var i = 0; i < iceCandidateQueue.length; i++) {
            try { await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidateQueue[i])); } catch(e) { console.error('Drain ICE error:', e); }
        }
        iceCandidateQueue = [];
    }
    catch(e) { console.error('Set remote desc error:', e); }
}

async function handleICECandidate(candidateData) {
    var iceCandidate = { candidate: candidateData.candidate, sdpMid: candidateData.sdp_mid, sdpMLineIndex: candidateData.sdp_m_line_index };
    if (peerConnection && peerConnection.remoteDescription) {
        try { await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate)); }
        catch(e) { console.error('Add ICE error:', e); }
    } else {
        iceCandidateQueue.push(iceCandidate);
    }
}

var callPollInterval = null;
function startPollingForCallUpdates() {
    if (callPollInterval) clearInterval(callPollInterval);
    callPollInterval = setInterval(async function() {
        try {
            var response = await fetch(API_URL + '/api/notifications', {
                headers: { 'Authorization': 'Bearer ' + appState.authToken }
            });
            if (response.ok) {
                var notifications = await response.json();
                for (var i = 0; i < notifications.length; i++) {
                    var notif = notifications[i];
                    if (notif.notification_type === 'call_answered') {
                        var data = JSON.parse(notif.message);
                        handleCallAnswer(data.sdp);
                        markNotificationRead(notif.id);
                    } else if (notif.notification_type === 'ice_candidate') {
                        var data = JSON.parse(notif.message);
                        handleICECandidate(data);
                        markNotificationRead(notif.id);
                    } else if (notif.notification_type === 'call_ended') {
                        cleanupCall();
                        markNotificationRead(notif.id);
                    } else if (notif.notification_type === 'incoming_call' && !appState.inCall && !appState.isAdmin) {
                        var data = JSON.parse(notif.message);
                        handleIncomingCall(data.caller_id, { sdp: data.sdp, call_type: data.call_type, call_id: data.call_id });
                        markNotificationRead(notif.id);
                    }
                }
            }
        } catch(e) { console.error('Poll error:', e); }
    }, 2000);
}

async function markNotificationRead(notifId) {
    try {
        await fetch(API_URL + '/api/notifications/' + notifId + '/read', {
            method: 'POST', headers: { 'Authorization': 'Bearer ' + appState.authToken }
        });
    } catch(e) {}
}

// Show call UI
function showCallUI(callType) {
    var existing = document.getElementById('call-modal');
    if (existing) existing.remove();
    
    var callModal = document.createElement('div');
    callModal.id = 'call-modal';
    callModal.innerHTML = 
        '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
        '<h2 style="color: #E94560; margin-bottom: 20px;">' + (callType === 'video' ? 'Video' : 'Voice') + ' Call in Progress</h2>' +
        '<p id="call-status" style="color: #888; margin-bottom: 15px;">Connecting...</p>' +
        (callType === 'video' ? 
            '<div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;">' +
            '<div style="text-align: center;"><p style="color: #fff; margin-bottom: 10px;">You</p><video id="local-video" autoplay muted playsinline style="width: 300px; height: 225px; background: #333; border-radius: 10px;"></video></div>' +
            '<div style="text-align: center;"><p style="color: #fff; margin-bottom: 10px;">Remote</p><video id="remote-video" autoplay playsinline style="width: 300px; height: 225px; background: #333; border-radius: 10px;"></video></div>' +
            '</div>' : 
            '<div style="font-size: 100px; margin-bottom: 20px;">📞</div><p style="color: #fff; margin-bottom: 20px;">Voice call active</p>' +
            '<audio id="remote-audio" autoplay></audio>') +
        '<button onclick="endWebRTCCall()" style="padding: 15px 40px; background: #EF4444; color: white; border: none; border-radius: 10px; font-size: 18px; cursor: pointer;">End Call</button>' +
        '</div>';
    document.body.appendChild(callModal);
    
    if (localStream) {
        if (callType === 'video') {
            var localVideo = document.getElementById('local-video');
            if (localVideo) localVideo.srcObject = localStream;
        }
    }
    if (remoteStream) {
        attachRemoteStream(callType);
    }
}

function attachRemoteStream(callType) {
    if (!remoteStream) return;
    var ct = callType || currentCallType;
    var persistentAudio = document.getElementById('persistent-remote-audio');
    if (!persistentAudio) {
        persistentAudio = document.createElement('audio');
        persistentAudio.id = 'persistent-remote-audio';
        persistentAudio.autoplay = true;
        persistentAudio.setAttribute('playsinline', '');
        document.body.appendChild(persistentAudio);
    }
    persistentAudio.srcObject = remoteStream;
    persistentAudio.play().catch(function(e){ console.log('Audio play blocked, will retry:', e); });
    if (ct === 'video') {
        var remoteVideo = document.getElementById('remote-video');
        if (remoteVideo) {
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play().catch(function(){});
        } else {
            setTimeout(function(){ attachRemoteStream(ct); }, 500);
        }
    } else {
        var remoteAudio = document.getElementById('remote-audio');
        if (remoteAudio) {
            remoteAudio.srcObject = remoteStream;
            remoteAudio.play().catch(function(){});
        }
    }
}

// End WebRTC call
async function endWebRTCCall() {
    if (currentCallUserId) {
        try {
            await fetch(API_URL + '/api/webrtc/end-call?target_user_id=' + currentCallUserId, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + appState.authToken }
            });
        } catch (e) {}
    }
    cleanupCall();
}

// Cleanup call resources
function cleanupCall() {
    stopCallRingtone();
    if (callPollInterval) {
        clearInterval(callPollInterval);
        callPollInterval = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(function(track) { track.stop(); });
        localStream = null;
    }
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    remoteStream = null;
    currentCallUserId = null;
    currentCallType = null;
    appState.inCall = false;
    var persistentAudio = document.getElementById('persistent-remote-audio');
    if (persistentAudio) { persistentAudio.srcObject = null; persistentAudio.remove(); }
    var callModal = document.getElementById('call-modal');
    if (callModal) callModal.remove();
}

function startVoiceCall() {
    var userSelect = document.getElementById('admin-user-select');
    if (!userSelect || !userSelect.value) {
        alert('Please select a user to call first');
        return;
    }
    initWebRTCCall(parseInt(userSelect.value), 'audio');
}

function startVideoCall() {
    var userSelect = document.getElementById('admin-user-select');
    if (!userSelect || !userSelect.value) {
        alert('Please select a user to call first');
        return;
    }
    initWebRTCCall(parseInt(userSelect.value), 'video');
}

function endCall() {
    endWebRTCCall();
}

function toggleAIInCall() {
    if (!appState.inCall) { alert('Start a call first to invite AI'); return; }
    appState.aiInCall = !appState.aiInCall;
    alert(appState.aiInCall ? 'Gemini AI has joined the call!' : 'Gemini AI has left the call.');
}

// 3D Models functions - uses progressive unlocking and supports both Class 6 and Class 7
function show3DModels(chapterId) {
    var activeChapters = getActiveChapters();
    var active3DModels = getActive3DModels();
    var progress = getChapterProgress();
    
    // If no chapterId provided, show all chapters' models with progressive unlocking
    if (!chapterId) {
        document.getElementById('models-content').innerHTML = 
            '<h3 style="color: #00ffff; font-family: \'Orbitron\', monospace; margin-bottom: 20px;">SELECT A CHAPTER TO VIEW 3D MODELS</h3>' +
            '<div class="chapters-grid">' +
            activeChapters.map(function(chapter, index) {
                var isCompleted = progress[chapter.id] === 'completed';
                var isLocked = !appState.isAdmin && index > 0 && progress[activeChapters[index-1].id] !== 'completed';
                var modelCount = (active3DModels[chapter.id] || []).length;
                return '<div class="chapter-card ' + (isCompleted ? 'completed' : '') + ' ' + (isLocked ? 'locked' : '') + '" ' +
                    'onclick="' + (isLocked ? '' : 'show3DModels(' + chapter.id + ')') + '" style="cursor: ' + (isLocked ? 'not-allowed' : 'pointer') + ';">' +
                    '<div class="chapter-number">' + chapter.number + '</div>' +
                    '<div class="chapter-title">' + chapter.title + '</div>' +
                    '<p style="color: #888; font-size: 0.9em;">' + (isLocked ? 'Complete Chapter ' + activeChapters[index-1].number + ' to unlock' : modelCount + ' 3D Models Available') + '</p>' +
                    '<div class="chapter-status">' +
                    (isLocked ? '<span class="status-badge locked">&#128274; Locked</span>' : 
                     isCompleted ? '<span class="status-badge completed">Unlocked</span>' : 
                     '<span class="status-badge in-progress">Available</span>') +
                    '</div></div>';
            }).join('') +
            '</div>';
        return;
    }
    
    var models = active3DModels[chapterId] || [];
    var chapter = activeChapters.find(function(c) { return c.id === chapterId; });
    
    document.getElementById('models-content').innerHTML = 
        '<button class="btn btn-secondary" onclick="show3DModels()" style="margin-bottom: 20px;">\u2190 Back to All Chapters</button>' +
        '<h3 style="color: #00ffff; font-family: \'Orbitron\', monospace; margin-bottom: 20px;">3D Models - Chapter ' + chapterId + ': ' + (chapter ? chapter.title : '') + '</h3>' +
        '<div class="models-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">' + models.map(function(model) {
            return '<div class="model-card" onclick="viewModel(' + model.id + ', \'' + model.name + '\', \'' + model.type + '\', \'' + model.description + '\')" style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05)); border: 2px solid rgba(0, 255, 255, 0.3); padding: 20px; cursor: pointer; transition: all 0.3s;">' +
                '<div class="model-icon" style="font-size: 3em; color: #00ffff; margin-bottom: 10px;">' + getModelIcon(model.type) + '</div>' +
                '<div class="model-name" style="font-family: \'Orbitron\', monospace; color: #fff; font-size: 1.1em; margin-bottom: 10px;">' + model.name + '</div>' +
                '<div class="model-desc" style="color: #888; font-size: 0.9em;">' + model.description + '</div></div>';
        }).join('') + '</div>' +
        '<div class="model-viewer" id="model-viewer" style="display: none; margin-top: 30px; padding: 30px; background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05)); border: 2px solid rgba(0, 255, 255, 0.3);">' +
        '<h3 id="model-title" style="color: #00ffff; font-family: \'Orbitron\', monospace; margin-bottom: 20px;"></h3>' +
        '<div class="model-3d-placeholder" style="width: 100%; height: 400px; background: rgba(0, 0, 0, 0.5); border: 2px solid #00ffff; display: flex; align-items: center; justify-content: center; flex-direction: column;"><div class="model-3d-icon" id="model-icon-display" style="font-size: 5em; color: #00ffff;"></div><div class="model-3d-text" id="model-text" style="color: #fff; margin-top: 20px;"></div></div>' +
        '<p id="model-description" style="margin-top: 20px; color: #aaa;"></p>' +
        '<button class="btn btn-secondary" onclick="document.getElementById(\'model-viewer\').style.display=\'none\'" style="margin-top: 20px;">Close Model</button></div>';
}

function getModelIcon(type) {
    const icons = {
        'spiral': '🌀', 'fibonacci': '🐚', 'cube': '🎲', 'pyramid': '🔺', 'grid': '⊞',
        'protractor': '📐', 'lines': '📏', 'perpendicular': '⊥', 'angles': '∠', 'segments': '—',
        'numberline': '↔️', 'blocks': '🧱', 'scale': '⚖️', 'rounding': '🔄', 'operations': '➕',
        'integers': '±', 'temperature': '🌡️', 'elevation': '⛰️', 'addition': '➕', 'subtraction': '➖',
        'circles': '⭕', 'bars': '📊', 'equivalent': '≡', 'mixed': '½',
        'perimeter': '⬜', 'area': '▦', 'rectangle': '▭', 'composite': '🔷', 'realworld': '🏠',
        'factortree': '🌳', 'multiples': '✖️', 'lcm': '🔢', 'hcf': '🔗', 'divisibility': '÷',
        'decimal': '0.1', 'decimalline': '↔️', 'conversion': '🔄', 'money': '💰',
        'shapes2d': '⬡', 'shapes3d': '🎲', 'symmetry': '🦋', 'nets': '📦', 'tessellation': '🔶',
        'tiles': '🔲', 'balance': '⚖️', 'variables': 'x', 'patterns': '🔢', 'solver': '='
    };
    return icons[type] || '📐';
}

// Global variable to store current 3D scene
var current3DScene = null;
var current3DRenderer = null;
var current3DAnimationId = null;

function viewModel(id, name, type, description) {
    document.getElementById('model-viewer').style.display = 'block';
    document.getElementById('model-title').textContent = name;
    document.getElementById('model-description').textContent = description;
    
    // Clean up previous 3D scene
    if (current3DAnimationId) {
        cancelAnimationFrame(current3DAnimationId);
    }
    if (current3DRenderer) {
        current3DRenderer.dispose();
    }
    
    var modelContainer = document.getElementById('model-icon-display');
    modelContainer.innerHTML = '';
    modelContainer.style.cssText = 'width: 100%; height: 450px; margin: 0 auto; display: block; position: relative;';
    
    if (typeof THREE !== 'undefined') {
        var scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);
        scene.fog = new THREE.FogExp2(0x0a0a1a, 0.05);
        var camera = new THREE.PerspectiveCamera(60, modelContainer.clientWidth / 450, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(modelContainer.clientWidth || 600, 450);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        modelContainer.appendChild(renderer.domElement);
        
        current3DScene = scene;
        current3DRenderer = renderer;
        
        var ambientLight = new THREE.AmbientLight(0x404060, 0.6);
        scene.add(ambientLight);
        var mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(5, 8, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        scene.add(mainLight);
        var fillLight = new THREE.DirectionalLight(0x4488ff, 0.4);
        fillLight.position.set(-5, 3, -5);
        scene.add(fillLight);
        var rimLight = new THREE.PointLight(0xE94560, 0.8, 20);
        rimLight.position.set(0, -3, 5);
        scene.add(rimLight);
        var topLight = new THREE.SpotLight(0x00ffff, 0.3, 30, Math.PI / 4);
        topLight.position.set(0, 10, 0);
        scene.add(topLight);
        
        var gridHelper = new THREE.GridHelper(10, 20, 0x00ffff, 0x111133);
        gridHelper.position.y = -2.5;
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);
        
        var mesh;
        
        if (type === 'cube' || type === 'blocks' || type === 'tiles') {
            var geometry = new THREE.BoxGeometry(2, 2, 2);
            var materials = [
                new THREE.MeshStandardMaterial({ color: 0xE94560, metalness: 0.3, roughness: 0.4 }),
                new THREE.MeshStandardMaterial({ color: 0x0F3460, metalness: 0.3, roughness: 0.4 }),
                new THREE.MeshStandardMaterial({ color: 0x533483, metalness: 0.3, roughness: 0.4 }),
                new THREE.MeshStandardMaterial({ color: 0x16213E, metalness: 0.3, roughness: 0.4 }),
                new THREE.MeshStandardMaterial({ color: 0xE94560, metalness: 0.3, roughness: 0.4 }),
                new THREE.MeshStandardMaterial({ color: 0x0F3460, metalness: 0.3, roughness: 0.4 })
            ];
            mesh = new THREE.Mesh(geometry, materials);
            mesh.castShadow = true;
            var edges = new THREE.EdgesGeometry(geometry);
            mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })));
        } else if (type === 'pyramid' || type === 'factortree') {
            var geometry = new THREE.ConeGeometry(1.5, 2.5, 4);
            mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.5, roughness: 0.3, flatShading: true }));
            mesh.castShadow = true;
            mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })));
        } else if (type === 'sphere' || type === 'circles') {
            var geometry = new THREE.SphereGeometry(1.5, 64, 64);
            mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x2196F3, metalness: 0.7, roughness: 0.1 }));
            mesh.castShadow = true;
        } else if (type === 'cylinder' || type === 'prism' || type === 'bars') {
            var geometry = new THREE.CylinderGeometry(1, 1, 2.5, 32);
            mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x9C27B0, metalness: 0.4, roughness: 0.3 }));
            mesh.castShadow = true;
            mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })));
        } else if (type === 'torus' || type === 'ring') {
            var geometry = new THREE.TorusGeometry(1.2, 0.5, 32, 100);
            mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xFF5722, metalness: 0.6, roughness: 0.2 }));
            mesh.castShadow = true;
        } else if (type === 'spiral' || type === 'fibonacci') {
            var group = new THREE.Group();
            var points = [];
            for (var si = 0; si < 200; si++) {
                var angle = si * 0.15;
                var radius = 0.08 * Math.sqrt(si);
                points.push(new THREE.Vector3(Math.cos(angle) * radius, si * 0.01 - 1, Math.sin(angle) * radius));
            }
            var curve = new THREE.CatmullRomCurve3(points);
            var tubeGeom = new THREE.TubeGeometry(curve, 200, 0.06, 12, false);
            var tubeMat = new THREE.MeshStandardMaterial({ color: type === 'fibonacci' ? 0xFFD700 : 0x00BCD4, metalness: 0.5, roughness: 0.2 });
            group.add(new THREE.Mesh(tubeGeom, tubeMat));
            mesh = group;
            mesh.castShadow = true;
        } else if (type === 'protractor' || type === 'angles') {
            var group = new THREE.Group();
            var semicircle = new THREE.Mesh(
                new THREE.CircleGeometry(2, 64, 0, Math.PI),
                new THREE.MeshStandardMaterial({ color: 0xFFC107, metalness: 0.2, roughness: 0.5, side: THREE.DoubleSide })
            );
            group.add(semicircle);
            for (var ai = 0; ai <= 180; ai += 10) {
                var ang = ai * Math.PI / 180;
                var len = ai % 30 === 0 ? 1.9 : 1.7;
                var lineG = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0.02), new THREE.Vector3(Math.cos(ang) * len, Math.sin(ang) * len, 0.02)]);
                group.add(new THREE.Line(lineG, new THREE.LineBasicMaterial({ color: 0x333333 })));
            }
            mesh = group;
        } else if (type === 'grid' || type === 'area') {
            var group = new THREE.Group();
            for (var gx = -2; gx <= 2; gx++) {
                for (var gy = -2; gy <= 2; gy++) {
                    var boxG = new THREE.BoxGeometry(0.4, 0.4, 0.4);
                    var boxM = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5), metalness: 0.3, roughness: 0.4 });
                    var box = new THREE.Mesh(boxG, boxM);
                    box.position.set(gx * 0.5, gy * 0.5, 0);
                    box.castShadow = true;
                    group.add(box);
                }
            }
            mesh = group;
        } else if (type === 'symmetry' || type === 'linesym' || type === 'mirror') {
            var group = new THREE.Group();
            var half1 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), new THREE.MeshStandardMaterial({ color: 0x8B5CF6, metalness: 0.3, roughness: 0.4 }));
            half1.position.x = -0.6;
            group.add(half1);
            var half2 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), new THREE.MeshStandardMaterial({ color: 0x14B8A6, metalness: 0.3, roughness: 0.4 }));
            half2.position.x = 0.6;
            group.add(half2);
            var mirrorPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 2.5), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
            group.add(mirrorPlane);
            mesh = group;
        } else if (type === 'lines' || type === 'perpendicular' || type === 'segments' || type === 'parallel') {
            var group = new THREE.Group();
            var l1 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2, 0, 0), new THREE.Vector3(2, 0, 0)]);
            group.add(new THREE.Line(l1, new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 })));
            if (type === 'perpendicular') {
                var l2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -2, 0), new THREE.Vector3(0, 2, 0)]);
                group.add(new THREE.Line(l2, new THREE.LineBasicMaterial({ color: 0xff00ff })));
            } else {
                var l2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2, 1, 0), new THREE.Vector3(2, 1, 0)]);
                group.add(new THREE.Line(l2, new THREE.LineBasicMaterial({ color: 0xff00ff })));
            }
            var dot1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshStandardMaterial({ color: 0xE94560, emissive: 0xE94560, emissiveIntensity: 0.5 }));
            group.add(dot1);
            mesh = group;
        } else if (type === 'piechart' || type === 'pie') {
            var group = new THREE.Group();
            var sliceColors = [0xE94560, 0x2196F3, 0x4CAF50, 0xFFC107, 0x9C27B0, 0xFF5722, 0x00BCD4, 0x8BC34A];
            var numSlices = 8;
            for (var pi = 0; pi < numSlices; pi++) {
                var sliceGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32, 1, false, pi * Math.PI * 2 / numSlices, Math.PI * 2 / numSlices - 0.03);
                var sliceMat = new THREE.MeshStandardMaterial({ color: sliceColors[pi], metalness: 0.3, roughness: 0.4 });
                var slice = new THREE.Mesh(sliceGeom, sliceMat);
                slice.rotation.x = Math.PI / 2;
                group.add(slice);
            }
            mesh = group;
        } else if (type === 'bargraph') {
            var group = new THREE.Group();
            var barColors = [0xE94560, 0x2196F3, 0x4CAF50, 0xFFC107, 0x9C27B0];
            for (var bi = 0; bi < 5; bi++) {
                var h = 0.5 + Math.random() * 2;
                var bar = new THREE.Mesh(new THREE.BoxGeometry(0.5, h, 0.5), new THREE.MeshStandardMaterial({ color: barColors[bi], metalness: 0.3, roughness: 0.4 }));
                bar.position.set(bi * 0.7 - 1.4, h / 2 - 1, 0);
                bar.castShadow = true;
                group.add(bar);
            }
            mesh = group;
        } else {
            var group = new THREE.Group();
            var cubeGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            var cubeMat = new THREE.MeshStandardMaterial({ color: 0xE94560, metalness: 0.4, roughness: 0.3, transparent: true, opacity: 0.85 });
            var cube = new THREE.Mesh(cubeGeom, cubeMat);
            cube.castShadow = true;
            cube.add(new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeom), new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })));
            group.add(cube);
            var sphereGeom = new THREE.SphereGeometry(1.1, 48, 48);
            var sphereMat = new THREE.MeshStandardMaterial({ color: 0x0F3460, metalness: 0.6, roughness: 0.2, transparent: true, opacity: 0.6 });
            group.add(new THREE.Mesh(sphereGeom, sphereMat));
            mesh = group;
        }
        
        scene.add(mesh);
        camera.position.set(3, 3, 5);
        camera.lookAt(0, 0, 0);
        
        var controls = null;
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.08;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 2.0;
            controls.enableZoom = true;
            controls.minDistance = 2;
            controls.maxDistance = 15;
        }
        
        function animate() {
            current3DAnimationId = requestAnimationFrame(animate);
            if (controls) {
                controls.update();
            } else {
                mesh.rotation.x += 0.005;
                mesh.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
        }
        animate();
        
        window.addEventListener('resize', function() {
            var w = modelContainer.clientWidth || 600;
            camera.aspect = w / 450;
            camera.updateProjectionMatrix();
            renderer.setSize(w, 450);
        });
        
    } else {
        modelContainer.innerHTML = '<div style="width:100%;height:450px;background:linear-gradient(135deg,#E94560,#0F3460);display:flex;align-items:center;justify-content:center;color:#fff;font-size:48px;animation:rotateCube 4s infinite linear;transform-style:preserve-3d;">&#9632;</div>';
        if (!document.getElementById('model-animations')) {
            var style = document.createElement('style');
            style.id = 'model-animations';
            style.textContent = '@keyframes rotateCube { from { transform: rotateX(0deg) rotateY(0deg); } to { transform: rotateX(360deg) rotateY(360deg); } }';
            document.head.appendChild(style);
        }
    }
    
    document.getElementById('model-text').textContent = 'Drag to rotate | Scroll to zoom | Real 3D Model';
}

function backToChapterDetail() {
    document.querySelectorAll('.content-section').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('chapter-content-section').classList.add('active');
}

function downloadPDF(chapterId) {
    var media = chapterMedia[chapterId];
    if (media && media.pptUrl) {
        // Open the PDF in a new window or use Electron's shell to open it
        if (typeof require !== 'undefined') {
            var shell = require('electron').shell;
            var path = require('path');
            var pdfPath = path.join(__dirname, media.pptUrl);
            shell.openPath(pdfPath);
        } else {
            window.open(media.pptUrl, '_blank');
        }
        alert('Opening: ' + media.pptTitle);
    } else {
        alert('Chapter ' + chapterId + ' PDF/PPT is not available yet.\n\nNote: PPTs are available for chapters 1-6.');
    }
}

function openAIAssistant(chapterId) {
    appState.aiMessages = [];
    var chapter = chapters.find(function(c) { return c.id === chapterId; });
    appState.aiMessages.push({ role: 'assistant', content: 'Hello! I am your AI assistant. Ask me any questions about Chapter ' + chapterId + ': ' + chapter.title + '!' });
    showSection('ai-assistant');
    renderAIMessages();
}

// showTopicDetail override removed - using the proper version at line 5546 with (chapterId, topicIndex) params

// Override init function
var originalInit = init;
init = function() {
    loadState();
    var token = localStorage.getItem('authToken');
    var userData = localStorage.getItem('userData');
    if (token && userData) {
        try {
            var user = JSON.parse(userData);
            appState.authToken = token;
            appState.studentName = user.name;
            appState.isAdmin = user.is_admin;
            appState.userId = user.id;
            appState.isLoggedIn = true;
        } catch (e) { console.error('Error parsing user data:', e); }
    }
    if (!appState.chatMessages) appState.chatMessages = [];
    if (!appState.aiMessages) appState.aiMessages = [];
    if (appState.inCall === undefined) appState.inCall = false;
    if (appState.aiInCall === undefined) appState.aiInCall = false;
    if (appState.isLoggedIn) { showMainApp(); showHolidayWish(); } else { showLoginScreen(); }
};

// Override showSection to include formula-videos and all features
var originalShowSection = showSection;
showSection = function(section) {
    document.querySelectorAll('.content-section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    var sectionMap = { 
        'chapters': 'chapters-section', 
        'fundamentals': 'fundamentals-section',
        'progress': 'progress-section', 
        'final-exam': 'final-exam-section', 
        'formula-videos': 'formula-videos-section',
        'whiteboard': 'whiteboard-section',
        'certificates': 'certificates-section',
        'certificate': 'certificates-section', 
        '3d-models': '3d-models-section',
        'chat': 'chat-section', 
        'ai-assistant': 'ai-assistant-section', 
        'admin': 'admin-section' 
    };
    var sectionId = sectionMap[section];
    if (sectionId) { var el = document.getElementById(sectionId); if (el) el.classList.add('active'); }
    if (typeof event !== 'undefined' && event && event.target) { event.target.classList.add('active'); }
    if (typeof stopUserChatRefresh === 'function') stopUserChatRefresh();
    if (typeof stopAdminChatRefresh === 'function') stopAdminChatRefresh();
    if (section === 'chapters') renderChapters();
    if (section === 'formula-videos' && typeof renderFormulaVideos === 'function') renderFormulaVideos();
    if (section === 'progress') renderProgress();
    if (section === 'final-exam') renderFinalExam();
    if (section === 'certificates' || section === 'certificate') renderCertificates();
    if (section === '3d-models') show3DModels();
    if (section === 'chat') { if (typeof loadChatMessages === 'function') loadChatMessages(); if (typeof startUserChatRefresh === 'function') startUserChatRefresh(); }
    if (section === 'admin' && appState.isAdmin) { if (typeof loadAdminDashboard === 'function') loadAdminDashboard(); if (typeof startAdminChatRefresh === 'function') startAdminChatRefresh(); if (typeof startScreenSharePolling === 'function') startScreenSharePolling(); if (typeof startScreenShareAutoConnect === 'function') startScreenShareAutoConnect(); }
    if (section === 'ai-assistant' && typeof renderAIMessages === 'function') renderAIMessages();
    if (section === 'fundamentals' && typeof renderFundamentals === 'function') renderFundamentals();
    if (section === 'whiteboard' && typeof renderWhiteboard === 'function') renderWhiteboard();
};

// Override renderChapterContent removed - consolidated into final override below

// Theme Switching Functions
function setTheme(theme) {
    document.body.classList.remove('light-theme', 'colorful-theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else if (theme === 'colorful') {
        document.body.classList.add('colorful-theme');
    }
    localStorage.setItem('appTheme', theme);
}

function loadTheme() {
    var savedTheme = localStorage.getItem('appTheme') || 'dark';
    setTheme(savedTheme);
}

// Admin Reply Functions - WhatsApp Style Chat
var selectedUserId = null;
var selectedUserName = '';
var adminUsers = [];
var chatMessages = [];
var chatRefreshInterval = null;

// Select a user to chat with
function selectChatUser(userId, userName) {
    selectedUserId = userId;
    selectedUserName = userName;
    document.getElementById('admin-user-select').value = userId;
    
    // Update chat header
    var chatHeader = document.getElementById('chat-header');
    if (chatHeader) {
        chatHeader.innerHTML = '<span style="color: #00ffff; font-family: \'Orbitron\', monospace;">' + userName + '</span>' +
            '<div style="display: flex; gap: 10px;">' +
            '<button onclick="adminVoiceCall()" style="padding: 8px 15px; background: linear-gradient(135deg, #00ff00, #008800); border: none; border-radius: 20px; color: #fff; cursor: pointer; font-size: 12px;">AUDIO</button>' +
            '<button onclick="adminVideoCall()" style="padding: 8px 15px; background: linear-gradient(135deg, #ff6600, #cc3300); border: none; border-radius: 20px; color: #fff; cursor: pointer; font-size: 12px;">VIDEO</button>' +
            '</div>';
    }
    
    // Highlight selected user in list
    var userItems = document.querySelectorAll('.chat-user-item');
    userItems.forEach(function(item) {
        item.style.background = item.dataset.userId == userId ? 'rgba(0,255,255,0.2)' : 'transparent';
    });
    
    // Load chat history for this user
    loadChatHistory(userId);
    
    // Start auto-refresh for this chat
    if (chatRefreshInterval) clearInterval(chatRefreshInterval);
    chatRefreshInterval = setInterval(function() {
        if (selectedUserId) loadChatHistory(selectedUserId);
    }, 3000);
}

// Load chat history for a specific user
function loadChatHistory(userId) {
    fetch(API_URL + '/api/admin/chat/' + userId, {
        headers: { 'Authorization': 'Bearer ' + appState.authToken }
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        chatMessages = data.messages || [];
        renderChatMessages();
    }).catch(function(e) {
        console.error('Load chat error:', e);
    });
}

// Render chat messages in WhatsApp style
function renderChatMessages() {
    var chatDiv = document.getElementById('admin-chat-messages');
    if (!chatDiv) return;
    
    if (chatMessages.length === 0) {
        chatDiv.innerHTML = '<div style="text-align: center; color: #888; padding: 50px;">No messages yet. Start the conversation!</div>';
        return;
    }
    
    chatDiv.innerHTML = chatMessages.map(function(msg) {
        var isAdmin = msg.is_admin_reply;
        var time = new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        var bodyHtml = renderChatBody(msg);
        if (isAdmin) {
            return '<div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">' +
                '<div style="max-width: 70%; background: linear-gradient(135deg, #00a884, #008f72); padding: 10px 15px; border-radius: 15px 15px 0 15px; color: #fff;">' +
                bodyHtml +
                '<div style="text-align: right; font-size: 0.7em; color: rgba(255,255,255,0.7); margin-top: 5px;">' + time + '</div>' +
                '</div></div>';
        } else {
            return '<div style="display: flex; justify-content: flex-start; margin-bottom: 10px;">' +
                '<div style="max-width: 70%; background: rgba(255,255,255,0.1); padding: 10px 15px; border-radius: 15px 15px 15px 0; color: #fff;">' +
                bodyHtml +
                '<div style="text-align: right; font-size: 0.7em; color: rgba(255,255,255,0.5); margin-top: 5px;">' + time + '</div>' +
                '</div></div>';
        }
    }).join('');
    
    // Scroll to bottom
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Populate user list in chat panel
function populateChatUserList(users) {
    var userListDiv = document.getElementById('chat-user-list');
    if (!userListDiv) return;
    
    if (!users || users.length === 0) {
        userListDiv.innerHTML = '<div style="color: #888; text-align: center; padding: 20px;">No students registered yet</div>';
        return;
    }
    
    userListDiv.innerHTML = users.map(function(user) {
        var isSelected = selectedUserId == user.id;
        return '<div class="chat-user-item" data-user-id="' + user.id + '" onclick="selectChatUser(' + user.id + ', \'' + user.name.replace(/'/g, "\\'") + '\')" style="padding: 12px; cursor: pointer; border-bottom: 1px solid rgba(0,255,255,0.1); background: ' + (isSelected ? 'rgba(0,255,255,0.2)' : 'transparent') + '; transition: background 0.2s;">' +
            '<div style="color: #fff; font-weight: bold; margin-bottom: 3px;">' + user.name + '</div>' +
            '<div style="color: #888; font-size: 0.8em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + user.username + '</div>' +
            '</div>';
    }).join('');
}

function adminSendReply() {
    var userSelect = document.getElementById('admin-user-select');
    var replyInput = document.getElementById('admin-message');
    var userId = userSelect.value || selectedUserId;
    var message = replyInput.value.trim();
    
    if (!userId) {
        alert('Please select a user to reply to.');
        return;
    }
    if (!message) {
        alert('Please enter a message.');
        return;
    }
    
    // Send reply via API
    fetch(API_URL + '/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
        body: JSON.stringify({ user_id: parseInt(userId), message: message })
    }).then(function(response) {
        if (response.ok) {
            replyInput.value = '';
            // Reload chat to show new message
            loadChatHistory(userId);
        } else {
            alert('Failed to send reply. Please try again.');
        }
    }).catch(function(e) {
        console.error('Admin reply error:', e);
        alert('Network error. Please try again.');
    });
}

function adminVoiceCall() {
    var userSelect = document.getElementById('admin-user-select');
    var userId = userSelect.value;
    
    if (!userId) {
        alert('Please select a user to call.');
        return;
    }
    
    // Use real WebRTC voice call
    initWebRTCCall(parseInt(userId), 'audio');
}

function adminVideoCall() {
    var userSelect = document.getElementById('admin-user-select');
    var userId = userSelect.value;
    
    if (!userId) {
        alert('Please select a user to call.');
        return;
    }
    
    // Use real WebRTC video call
    initWebRTCCall(parseInt(userId), 'video');
}

function adminGeminiReply() {
    var userSelect = document.getElementById('admin-user-select');
    var userId = userSelect.value;
    
    if (!userId) {
        alert('Please select a user first.');
        return;
    }
    
    // Get the last message from this user
    var lastMessage = '';
    var messagesDiv = document.getElementById('admin-messages');
    if (messagesDiv) {
        var messages = messagesDiv.querySelectorAll('[data-user-id="' + userId + '"]');
        if (messages.length > 0) {
            lastMessage = messages[messages.length - 1].querySelector('.message-content');
            if (lastMessage) lastMessage = lastMessage.textContent;
        }
    }
    
    if (!lastMessage) {
        lastMessage = 'Hello, how can I help you with NCERT Class 6 Mathematics?';
    }
    
    // Generate AI response
    alert('Generating Gemini AI response...');
    
    fetch(API_URL + '/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
        body: JSON.stringify({ message: 'Generate a helpful response to this student question: ' + lastMessage, chapter_id: null })
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        if (data.response) {
            document.getElementById('admin-reply-input').value = data.response;
            alert('Gemini AI response generated! You can edit it before sending.');
        } else {
            alert('Could not generate AI response. Please try again.');
        }
    }).catch(function(e) {
        console.error('Gemini error:', e);
        alert('Error generating AI response. Please try again.');
    });
}

// Override renderAdminDashboard to include user dropdown
var originalRenderAdminDashboard = renderAdminDashboard;
renderAdminDashboard = function(data) {
    document.getElementById('admin-stats').innerHTML = 
        '<div class="admin-stat-card"><div class="admin-stat-value">' + (data.total_users || 0) + '</div><div class="admin-stat-label">Total Users</div></div>' +
        '<div class="admin-stat-card"><div class="admin-stat-value">' + (data.active_users || 0) + '</div><div class="admin-stat-label">Active Today</div></div>' +
        '<div class="admin-stat-card"><div class="admin-stat-value">' + (data.message_count || 0) + '</div><div class="admin-stat-label">Total Messages</div></div>' +
        '<div class="admin-stat-card"><div class="admin-stat-value">' + ((data.platform_stats && data.platform_stats.length) || 0) + '</div><div class="admin-stat-label">Platforms</div></div>' +
        '<div class="admin-stat-card" style="background:linear-gradient(135deg,#E94560,#FF6B6B);"><div class="admin-stat-value">' + (data.users_in_exam || 0) + '</div><div class="admin-stat-label">In Exam Now</div></div>';
    
    // Screen Sharing Monitoring Section
    var screenMonitorDiv = document.getElementById('screen-monitor-section');
    if (!screenMonitorDiv) {
        screenMonitorDiv = document.createElement('div');
        screenMonitorDiv.id = 'screen-monitor-section';
        screenMonitorDiv.style.cssText = 'margin-top:20px;padding:20px;background:rgba(233,69,96,0.1);border-radius:15px;border:1px solid rgba(233,69,96,0.3);';
        var adminStats = document.getElementById('admin-stats');
        if (adminStats && adminStats.parentNode) {
            adminStats.parentNode.insertBefore(screenMonitorDiv, adminStats.nextSibling);
        }
    }
    
    var examUsers = (data.users || []).filter(function(u) { return u.is_in_exam; });
    screenMonitorDiv.innerHTML = '<h3 style="color:#E94560;margin-bottom:10px;display:flex;align-items:center;gap:10px;"><span style="width:12px;height:12px;background:#E94560;border-radius:50%;animation:pulse 1.5s infinite;"></span> Exam Monitor <span style="color:#aaa;font-size:0.6em;font-weight:normal;">(' + examUsers.length + ' students) Click tile for fullscreen</span></h3>' +
        (examUsers.length > 0 ? 
            '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;">' +
            examUsers.map(function(user) {
                return '<div onclick="openLiveFullscreen(' + user.id + ')" style="background:rgba(0,0,0,0.4);border:2px solid #E94560;border-radius:8px;padding:6px;cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">' +
                    '<div style="width:100%;height:70px;background:#111;border-radius:5px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:4px;">' +
                    '<div style="color:#444;font-size:24px;">🖥️</div></div>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                    '<span style="color:#fff;font-size:10px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70px;" title="' + user.name + '">' + user.name + '</span>' +
                    '<span style="width:8px;height:8px;border-radius:50%;background:#E94560;animation:pulse 1.5s infinite;"></span></div></div>';
            }).join('') + '</div>' :
            '<p style="color:#888;text-align:center;padding:20px;">No students currently taking exams. When students start exams with screen sharing enabled, they will appear here.</p>');
    
    // Add Papers Section
    var papersSection = document.getElementById('admin-papers-section');
    if (!papersSection) {
        papersSection = document.createElement('div');
        papersSection.id = 'admin-papers-section';
        papersSection.style.cssText = 'margin-top:20px;padding:20px;background:rgba(33,150,243,0.1);border-radius:15px;border:1px solid rgba(33,150,243,0.3);';
        var screenSection = document.getElementById('screen-monitor-section');
        if (screenSection && screenSection.parentNode) {
            screenSection.parentNode.insertBefore(papersSection, screenSection.nextSibling);
        }
    }
    papersSection.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">' +
        '<h3 style="color:#2196F3;display:flex;align-items:center;gap:10px;margin:0;"><span>📝</span> Exam Papers</h3>' +
        '<button onclick="loadAdminPapers()" style="padding:8px 18px;background:linear-gradient(135deg,#2196F3,#1565C0);border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:0.85em;">Load Papers</button></div>' +
        '<div id="admin-papers-list"><p style="color:#888;text-align:center;padding:15px;">Click "Load Papers" to see submitted exam papers.</p></div>';

    // Add Remove All Accounts button
    var removeAllDiv = document.getElementById('remove-all-accounts-section');
    if (!removeAllDiv) {
        removeAllDiv = document.createElement('div');
        removeAllDiv.id = 'remove-all-accounts-section';
        removeAllDiv.style.cssText = 'margin:20px 0;padding:15px;background:linear-gradient(135deg,#DC2626,#EF4444);border-radius:12px;display:flex;align-items:center;justify-content:space-between;';
        removeAllDiv.innerHTML = '<div><span style="font-size:20px;margin-right:10px;">🗑️</span><span style="color:#fff;font-weight:bold;font-size:16px;">Remove All Accounts</span><span style="color:#FCA5A5;font-size:12px;margin-left:10px;">(Except Admin)</span></div>' +
            '<button onclick="removeAllAccounts()" style="padding:10px 20px;background:rgba(255,255,255,0.2);border:2px solid #fff;border-radius:8px;color:#fff;cursor:pointer;font-weight:bold;">DELETE ALL USERS</button>';
        var adminStats = document.getElementById('admin-stats');
        if (adminStats && adminStats.parentNode) {
            adminStats.parentNode.insertBefore(removeAllDiv, adminStats.nextSibling);
        }
    }

    var tbody = document.getElementById('users-table');
    if (tbody && data.users) {
        adminUsers = data.users;
        tbody.innerHTML = data.users.map(function(user) {
            return '<tr><td>' + user.name + '</td><td>' + user.username + '</td><td>' + (user.platform || 'N/A') + '</td><td>' + (user.completed_chapters || 0) + '/10</td><td>' + (user.last_login ? new Date(user.last_login).toLocaleString() : 'Never') + '</td><td><button class="admin-action-btn unlock" onclick="adminAction(' + user.id + ', \'unlock_all\')">Unlock All</button><button class="admin-action-btn reset" onclick="adminAction(' + user.id + ', \'reset_progress\')">Reset</button><button class="admin-action-btn" onclick="adminAction(' + user.id + ', \'enable_retest\')" style="background:#FF9800;">Retest</button><button class="admin-action-btn" onclick="removeUserAccount(' + user.id + ', \'' + user.name.replace(/'/g, "\\'") + '\')" style="background:#DC2626;">Remove</button></td></tr>';
        }).join('');
        
        // Populate WhatsApp-style chat user list
        populateChatUserList(data.users);
    }
    
    var messagesDiv = document.getElementById('admin-messages');
    if (messagesDiv && data.recent_messages) {
        messagesDiv.innerHTML = data.recent_messages.map(function(msg) {
            return '<div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 10px;" data-user-id="' + msg.user_id + '">' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<div style="color: #E94560; font-size: 0.9em; font-weight: bold;">' + msg.sender_name + '</div>' +
                '<div style="color: #888; font-size: 0.8em;">' + new Date(msg.created_at).toLocaleString() + '</div></div>' +
                '<div class="message-content" style="margin-top: 8px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">' + msg.content + '</div>' +
                '<button onclick="selectUserForReply(' + msg.user_id + ', \'' + msg.sender_name + '\')" style="margin-top: 8px; padding: 5px 15px; background: #E94560; border: none; border-radius: 5px; color: #fff; cursor: pointer; font-size: 0.8em;">Reply</button></div>';
        }).join('') || '<p style="color: #888; text-align: center; padding: 30px;">No messages yet. Students will appear here when they send messages via "Connect with Master".</p>';
    }
};

function selectUserForReply(userId, userName) {
    var userSelect = document.getElementById('admin-user-select');
    if (userSelect) {
        userSelect.value = userId;
    }
    var msgInput = document.getElementById('admin-message');
    if (msgInput) msgInput.focus();
}

async function loadAdminPapers() {
    var papersDiv = document.getElementById('admin-papers-list');
    if (!papersDiv) return;
    papersDiv.innerHTML = '<p style="color:#aaa;text-align:center;padding:20px;">Loading papers...</p>';
    try {
        var resp = await fetch(API_URL + '/api/admin/exam-papers', {
            headers: { 'Authorization': 'Bearer ' + appState.authToken }
        });
        var data = await resp.json();
        if (!data.papers || data.papers.length === 0) {
            papersDiv.innerHTML = '<p style="color:#888;text-align:center;padding:30px;">No exam papers submitted yet. Papers will appear here when students complete exams.</p>';
            return;
        }
        papersDiv.innerHTML = data.papers.map(function(p) {
            var answers = [];
            try { answers = JSON.parse(p.answers); } catch(e) {}
            var scoreColor = (p.score / p.total >= 0.875) ? '#4CAF50' : '#f44336';
            return '<div style="padding:15px;background:rgba(255,255,255,0.05);border-radius:10px;margin-bottom:10px;border-left:4px solid ' + scoreColor + ';">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<div><span style="color:#fff;font-weight:bold;">' + (p.user_name || 'Student') + '</span>' +
                '<span style="color:#aaa;margin-left:10px;font-size:0.85em;">' + p.exam_type + (p.chapter_id ? ' - Chapter ' + p.chapter_id : '') + '</span></div>' +
                '<div style="display:flex;gap:10px;align-items:center;">' +
                '<span style="color:' + scoreColor + ';font-weight:bold;font-size:1.1em;">' + p.score + '/' + p.total + '</span>' +
                '<button onclick="viewPaperDetail(' + p.id + ')" style="padding:6px 14px;background:linear-gradient(135deg,#2196F3,#1565C0);border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:0.85em;">View</button></div></div>' +
                '<div style="color:#888;font-size:0.8em;margin-top:5px;">' + new Date(p.created_at).toLocaleString() + '</div></div>';
        }).join('');
    } catch(e) {
        papersDiv.innerHTML = '<p style="color:#f44336;text-align:center;">Failed to load papers.</p>';
    }
}

async function viewPaperDetail(paperId) {
    try {
        var resp = await fetch(API_URL + '/api/admin/exam-papers/' + paperId, {
            headers: { 'Authorization': 'Bearer ' + appState.authToken }
        });
        var paper = await resp.json();
        var answers = [];
        try { answers = JSON.parse(paper.answers); } catch(e) {}
        var photos = [];
        try { photos = JSON.parse(paper.photos || '[]'); } catch(e) {}
        
        var html = '<h2 style="color:#E94560;margin-bottom:10px;">Exam Paper - ' + (paper.user_name || 'Student') + '</h2>';
        html += '<p style="color:#aaa;">Type: ' + paper.exam_type + (paper.chapter_id ? ' | Chapter: ' + paper.chapter_id : '') + ' | Score: <span style="color:#fff;font-weight:bold;">' + paper.score + '/' + paper.total + '</span> | Date: ' + new Date(paper.created_at).toLocaleString() + '</p>';
        
        for (var i = 0; i < answers.length; i++) {
            var a = answers[i];
            if (!a || !a.options) continue;
            var isCorrect = a.selected === a.correct;
            var borderColor = isCorrect ? '#4CAF50' : '#f44336';
            html += '<div style="padding:12px;margin:10px 0;background:rgba(255,255,255,0.05);border-left:4px solid ' + borderColor + ';border-radius:8px;">';
            html += '<div style="color:#fff;font-weight:bold;margin-bottom:6px;">Q' + (i+1) + '. ' + a.question + '</div>';
            for (var j = 0; j < a.options.length; j++) {
                var optColor = '#aaa', optBg = 'transparent', optLabel = '';
                if (j === a.correct) { optColor = '#4CAF50'; optBg = 'rgba(76,175,80,0.15)'; optLabel = ' (Correct)'; }
                if (j === a.selected && !isCorrect) { optColor = '#f44336'; optBg = 'rgba(244,67,54,0.15)'; optLabel = ' (Student Answer - Wrong)'; }
                if (j === a.selected && isCorrect) { optLabel = ' (Student Answer)'; }
                html += '<div style="padding:6px 10px;margin:3px 0;border-radius:4px;color:' + optColor + ';background:' + optBg + ';">' + String.fromCharCode(65+j) + '. ' + a.options[j] + optLabel + '</div>';
            }
            html += '</div>';
        }
        
        if (photos.length > 0) {
            html += '<h3 style="color:#2196F3;margin-top:20px;">Paper Photos</h3>';
            for (var k = 0; k < photos.length; k++) {
                html += '<img src="' + photos[k].photo + '" style="max-width:100%;border-radius:8px;margin:10px 0;" />';
            }
        }
        
        html += '<div style="text-align:center;margin-top:20px;"><button onclick="closePaperDetail()" style="background:#E94560;color:#fff;border:none;padding:12px 30px;border-radius:8px;cursor:pointer;font-size:15px;">Close</button></div>';
        
        var overlay = document.createElement('div');
        overlay.id = 'paper-detail-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:10000;overflow-y:auto;padding:30px;';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
    } catch(e) {
        alert('Failed to load paper details');
    }
}

function closePaperDetail() {
    var overlay = document.getElementById('paper-detail-overlay');
    if (overlay) overlay.remove();
}

// View user screen during exam (screen sharing monitoring)
function viewUserScreen(userId) {
    openLiveFullscreen(userId);
}

function adminVoiceCallStudent(userId) {
    var user = adminUsers ? adminUsers.find(function(u) { return u.id === userId; }) : null;
    var userName = user ? user.name : 'Student';
    alert('Starting voice call with ' + userName + '...');
}

function adminVideoCallStudent(userId) {
    var user = adminUsers ? adminUsers.find(function(u) { return u.id === userId; }) : null;
    var userName = user ? user.name : 'Student';
    alert('Starting video call with ' + userName + '...');
}

function closeScreenView() {
    var modal = document.getElementById('screen-view-modal');
    if (modal) modal.remove();
}

function requestScreenShare(userId) {
    alert('Screen share request sent to student. They will be prompted to share their screen.');
}

async function sendExamWarning(userId) {
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    try {
        var response = await fetch(API_URL + '/api/admin/send-warning/' + userId, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (response.ok) {
            alert('Warning sent to student successfully.');
        } else {
            alert('Failed to send warning. Try again.');
        }
    } catch(e) {
        alert('Network error sending warning.');
    }
}

// Admin unlock all chapters and generate certificates for admin
function setupAdminFeatures() {
    if (appState.isAdmin) {
        // Use the unified autoCompleteAdminProgress which handles both classes with className
        autoCompleteAdminProgress();
    }
}

// Override showMainApp to setup admin features and load theme
var originalShowMainApp = showMainApp;
showMainApp = function() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('display-name').textContent = appState.studentName || 'Student';
    document.getElementById('display-role').textContent = appState.isAdmin ? 'Master Admin' : 'Student';
    if (appState.isAdmin) {
        document.getElementById('admin-tab').classList.remove('hidden');
        setupAdminFeatures();
    } else {
        // Start incoming call polling for non-admin users
        startIncomingCallPolling();
    }
    renderChapters();
    loadTheme();
    // Check for festival wishes
    checkFestivalWish();
};

// Final renderChapterContent with tab-style PPT/Video buttons
var expandedTopics = {};
function toggleTopic(index) {
    expandedTopics[index] = !expandedTopics[index];
    renderChapterContent();
}
renderChapterContent = function() {
    var chapter = appState.currentChapter;
    var isClass7 = getSelectedClass() === '7';
    var media = getActiveChapterMedia()[chapter.id] || {};
    document.querySelectorAll('.content-section').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('chapter-content-section').classList.add('active');
    
    var topicsHtml = chapter.topics.map(function(topic, index) {
        return '<div class="topic" onclick="showTopicDetail(' + chapter.id + ', ' + index + ')" style="cursor:pointer;">' +
            '<div class="topic-header"><h3>' + topic.name + '</h3><span class="topic-arrow">›</span></div>' +
            '<p class="topic-content">' + (topic.content.substring(0, 100) + '...') + '</p></div>';
    }).join('');
    
    // Tab-style PPT/Video buttons
    var pptBtnStyle = media.pptUrl ? 
        'width:100%;padding:14px 20px;border:2px solid #00ffff;background:linear-gradient(135deg,#003366,#006699);color:#fff;font-family:Orbitron,monospace;font-size:0.95em;cursor:pointer;border-radius:8px;text-transform:uppercase;letter-spacing:1px;transition:all 0.3s;' :
        'width:100%;padding:14px 20px;border:2px solid #666;background:rgba(100,100,100,0.2);color:#999;font-family:Orbitron,monospace;font-size:0.95em;cursor:pointer;border-radius:8px;text-transform:uppercase;letter-spacing:1px;';
    var videoBtnStyle = media.videoUrl ?
        'width:100%;padding:14px 20px;border:2px solid #ff00ff;background:linear-gradient(135deg,#660066,#990099);color:#fff;font-family:Orbitron,monospace;font-size:0.95em;cursor:pointer;border-radius:8px;text-transform:uppercase;letter-spacing:1px;transition:all 0.3s;' :
        'width:100%;padding:14px 20px;border:2px solid #666;background:rgba(100,100,100,0.2);color:#999;font-family:Orbitron,monospace;font-size:0.95em;cursor:pointer;border-radius:8px;text-transform:uppercase;letter-spacing:1px;';
    
    var pptClick = media.pptUrl ? 'showChapterPPT(' + chapter.id + ')' : "alert('PPT not available yet')";
    var videoClick = media.videoUrl ? 'showChapterVideo(' + chapter.id + ')' : "alert('Video not available yet')";
    var comingSoonTag = '<p style="text-align:center;color:#ff6600;font-size:0.8em;margin-top:6px;font-family:Orbitron,monospace;">Coming Soon</p>';
    
    var mediaTabsHtml = '<div style="display:flex;gap:15px;margin-bottom:30px;flex-wrap:wrap;">' +
        '<div style="flex:1;min-width:140px;"><button onclick="' + pptClick + '" style="' + pptBtnStyle + '">📊 PPT</button>' + (!media.pptUrl ? comingSoonTag : '') + '</div>' +
        '<div style="flex:1;min-width:140px;"><button onclick="' + videoClick + '" style="' + videoBtnStyle + '">🎬 Video</button>' + (!media.videoUrl ? comingSoonTag : '') + '</div>';
    
    if (media.formulaVideoId) {
        mediaTabsHtml += '<div style="flex:1;min-width:140px;"><button onclick="showChapterFormulaVideo(' + chapter.id + ')" style="width:100%;padding:14px 20px;border:2px solid #ff6600;background:linear-gradient(135deg,#ff6600,#ff00ff);color:#fff;font-family:Orbitron,monospace;font-size:0.95em;cursor:pointer;border-radius:8px;text-transform:uppercase;letter-spacing:1px;">🧮 Formula</button></div>';
    }
    if (media.tbUrl) {
        mediaTabsHtml += '<div style="flex:1;min-width:140px;"><button onclick="showChapterTextbook(' + chapter.id + ')" style="width:100%;padding:14px 20px;border:2px solid #00ff88;background:linear-gradient(135deg,#004d00,#009900);color:#fff;font-family:Orbitron,monospace;font-size:0.95em;cursor:pointer;border-radius:8px;text-transform:uppercase;letter-spacing:1px;">📖 Textbook</button></div>';
    }
    mediaTabsHtml += '</div>';
    
    document.getElementById('chapter-content').innerHTML = 
        '<button class="btn btn-secondary" onclick="backToChapters()" style="margin-bottom: 20px;">← Back to Chapters</button>' +
        '<h2 class="section-title">Chapter ' + chapter.number + ': ' + chapter.title + '</h2>' +
        mediaTabsHtml +
        '<h3 style="color:#00ffff;font-family:Orbitron,monospace;margin-bottom:20px;">TOPICS IN THIS CHAPTER</h3>' +
        '<p style="color:#aaa;margin-bottom:20px;">Click on any topic to read the detailed explanation:</p>' +
        '<div class="chapter-content">' + topicsHtml + '</div>' +
        '<div class="resources-section"><h3 class="resources-title">Learning Tools</h3><div class="resources-grid">' +
        '<div class="resource-btn" onclick="show3DModels(' + chapter.id + ')"><div class="resource-icon">3D</div><div class="resource-text">3D Models</div></div>' +
        '<div class="resource-btn" onclick="openAIAssistant(' + chapter.id + ')"><div class="resource-icon">AI</div><div class="resource-text">Ask Doubt</div></div>' +
        '</div></div>' +
        '<div class="btn-group" style="margin-top: 30px;"><button class="btn btn-primary" onclick="startQuiz(' + chapter.id + ')">Take Chapter Quiz (40 Questions)</button></div>';
};

function openVideo(chapterId) {
    var media = chapterMedia[chapterId];
    if (media && media.videoUrl) {
        showVideoPlayer(chapterId, media.title, media.videoUrl);
    } else {
        alert('Video for Chapter ' + chapterId + ' is not available yet.');
    }
}

// Inbuilt Video Player Modal - YouTube-style with red progress bar
function showVideoPlayer(chapterId, title, videoUrl) {
    var modal = document.createElement('div');
    modal.id = 'video-player-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:10000;display:flex;flex-direction:column;';
    
    // Check if it's a Google Drive URL
    var isGoogleDrive = videoUrl.includes('drive.google.com');
    
    if (isGoogleDrive) {
        // Use iframe for Google Drive videos
        modal.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 15px;background:linear-gradient(to bottom,rgba(0,0,0,0.9),transparent);position:absolute;top:0;left:0;right:0;z-index:10;">' +
            '<span style="color:#fff;font-size:16px;">' + title + '</span>' +
            '<button onclick="closeVideoPlayer()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">X</button>' +
        '</div>' +
        '<iframe src="' + videoUrl + '" style="width:100%;height:100%;border:none;" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
    } else {
        // YouTube-style HTML5 video player
        modal.innerHTML = '<div id="yt-player-wrapper" style="width:100%;height:100%;position:relative;background:#000;" onclick="ytTogglePlay(event)">' +
            '<video id="yt-video" style="width:100%;height:100%;object-fit:contain;background:#000;">' +
                '<source src="' + videoUrl + '" type="video/mp4">' +
            '</video>' +
            '<div id="yt-play-btn" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:70px;height:70px;background:rgba(0,0,0,0.6);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:3px solid rgba(255,255,255,0.8);">' +
                '<svg viewBox="0 0 24 24" style="width:30px;height:30px;fill:#fff;margin-left:4px;"><path d="M8 5v14l11-7z"/></svg>' +
            '</div>' +
            '<div id="yt-controls" style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.8),transparent);padding:10px 0 0 0;">' +
                '<div id="yt-progress-container" style="width:100%;height:4px;background:rgba(255,255,255,0.3);cursor:pointer;" onclick="ytSeek(event)">' +
                    '<div id="yt-progress-bar" style="height:100%;background:#ff0000;width:0%;position:relative;">' +
                        '<div style="position:absolute;right:-6px;top:50%;transform:translateY(-50%);width:12px;height:12px;background:#fff;border-radius:50%;"></div>' +
                    '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;">' +
                    '<div style="display:flex;align-items:center;gap:15px;">' +
                        '<button onclick="ytTogglePlayBtn()" style="background:none;border:none;cursor:pointer;padding:5px;">' +
                            '<svg id="yt-play-icon" viewBox="0 0 24 24" style="width:24px;height:24px;fill:#fff;"><path d="M8 5v14l11-7z"/></svg>' +
                            '<svg id="yt-pause-icon" viewBox="0 0 24 24" style="width:24px;height:24px;fill:#fff;display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' +
                        '</button>' +
                        '<span style="color:#fff;font-size:14px;"><span id="yt-current-time">0:00</span> / <span id="yt-duration">0:00</span></span>' +
                    '</div>' +
                    '<div style="display:flex;align-items:center;gap:15px;">' +
                        '<button onclick="ytToggleMute()" style="background:none;border:none;cursor:pointer;padding:5px;">' +
                            '<svg id="yt-volume-icon" viewBox="0 0 24 24" style="width:24px;height:24px;fill:#fff;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>' +
                            '<svg id="yt-mute-icon" viewBox="0 0 24 24" style="width:24px;height:24px;fill:#fff;display:none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>' +
                        '</button>' +
                        '<button onclick="ytToggleFullscreen()" style="background:none;border:none;cursor:pointer;padding:5px;">' +
                            '<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:#fff;"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>' +
                        '</button>' +
                        '<button onclick="closeVideoPlayer()" style="background:none;border:none;cursor:pointer;padding:5px;">' +
                            '<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:#fff;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }
    
    document.body.appendChild(modal);
    
    if (!isGoogleDrive) {
        var video = document.getElementById('yt-video');
        var playBtn = document.getElementById('yt-play-btn');
        var playIcon = document.getElementById('yt-play-icon');
        var pauseIcon = document.getElementById('yt-pause-icon');
        var progressBar = document.getElementById('yt-progress-bar');
        var currentTimeEl = document.getElementById('yt-current-time');
        var durationEl = document.getElementById('yt-duration');
        
        video.onplay = function() { playBtn.style.display = 'none'; playIcon.style.display = 'none'; pauseIcon.style.display = 'block'; };
        video.onpause = function() { playBtn.style.display = 'flex'; playIcon.style.display = 'block'; pauseIcon.style.display = 'none'; };
        video.ontimeupdate = function() { 
            var percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = percent + '%';
            currentTimeEl.textContent = ytFormatTime(video.currentTime);
        };
        video.onloadedmetadata = function() { durationEl.textContent = ytFormatTime(video.duration); };
    }
}

function ytFormatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function ytTogglePlay(e) {
    if (e.target.closest('#yt-controls')) return;
    var video = document.getElementById('yt-video');
    if (video) { if (video.paused) video.play(); else video.pause(); }
}

function ytTogglePlayBtn() {
    var video = document.getElementById('yt-video');
    if (video) { if (video.paused) video.play(); else video.pause(); }
}

function ytToggleMute() {
    var video = document.getElementById('yt-video');
    if (video) {
        video.muted = !video.muted;
        document.getElementById('yt-volume-icon').style.display = video.muted ? 'none' : 'block';
        document.getElementById('yt-mute-icon').style.display = video.muted ? 'block' : 'none';
    }
}

function ytToggleFullscreen() {
    var wrapper = document.getElementById('yt-player-wrapper');
    if (document.fullscreenElement) document.exitFullscreen();
    else if (wrapper) wrapper.requestFullscreen();
}

function ytSeek(e) {
    var video = document.getElementById('yt-video');
    var container = document.getElementById('yt-progress-container');
    if (video && container) {
        var rect = container.getBoundingClientRect();
        var percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    }
}

function closeVideoPlayer() {
    var modal = document.getElementById('video-player-modal');
    if (modal) {
        var video = document.getElementById('chapter-video');
        if (video) video.pause();
        modal.remove();
    }
}

function togglePlayPause() {
    var video = document.getElementById('chapter-video');
    if (video) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
}

function rewindVideo() {
    var video = document.getElementById('chapter-video');
    if (video) video.currentTime = Math.max(0, video.currentTime - 10);
}

function forwardVideo() {
    var video = document.getElementById('chapter-video');
    if (video) video.currentTime = Math.min(video.duration, video.currentTime + 10);
}

function openPPT(chapterId) {
    var media = chapterMedia[chapterId];
    if (media && media.pptUrl) {
        // Check if it's a Google Drive URL
        var isGoogleDrive = media.pptUrl.includes('drive.google.com');
        
        if (isGoogleDrive) {
            // Show PPT in modal with iframe
            showPPTViewer(chapterId, media.pptTitle || media.title, media.pptUrl);
        } else if (typeof require !== 'undefined') {
            var shell = require('electron').shell;
            var path = require('path');
            var pptPath = path.join(__dirname, media.pptUrl);
            shell.openPath(pptPath);
        } else {
            window.open(media.pptUrl, '_blank');
        }
    } else {
        alert('PPT for Chapter ' + chapterId + ' is not available yet.');
    }
}

// PPT Viewer Modal for Google Drive
function showPPTViewer(chapterId, title, pptUrl) {
    var modal = document.createElement('div');
    modal.id = 'ppt-viewer-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    
    modal.innerHTML = '<div style="width:90%;max-width:1000px;height:85vh;background:linear-gradient(135deg,#1A1A2E,#16213E);border-radius:15px;overflow:hidden;box-shadow:0 20px 60px rgba(139,92,246,0.3);display:flex;flex-direction:column;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:linear-gradient(90deg,#8B5CF6,#EC4899);">' +
            '<h3 style="margin:0;color:#fff;font-size:18px;">Chapter ' + chapterId + ': ' + title + ' - Presentation</h3>' +
            '<button onclick="closePPTViewer()" style="background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:24px;cursor:pointer;padding:5px 15px;border-radius:5px;">X</button>' +
        '</div>' +
        '<div style="flex:1;padding:10px;">' +
            '<iframe src="' + pptUrl + '" style="width:100%;height:100%;border:none;border-radius:10px;" allowfullscreen></iframe>' +
        '</div>' +
    '</div>';
    
    document.body.appendChild(modal);
}

function closePPTViewer() {
    var modal = document.getElementById('ppt-viewer-modal');
    if (modal) modal.remove();
}

function openPDF(chapterId) {
    var media = chapterMedia[chapterId];
    if (media && media.pdfUrl) {
        if (typeof require !== 'undefined') {
            var shell = require('electron').shell;
            var path = require('path');
            var pdfPath = path.join(__dirname, media.pdfUrl);
            shell.openPath(pdfPath);
        } else {
            window.open(media.pdfUrl, '_blank');
        }
    } else {
        alert('PDF for Chapter ' + chapterId + ' is not available yet.');
    }
}

// Remove All Accounts (except admin)
function removeAllAccounts() {
    if (!confirm('Are you sure you want to DELETE ALL USER ACCOUNTS?\n\nThis will remove all students and their data. Only the admin account will remain.\n\nThis action CANNOT be undone!')) {
        return;
    }
    if (!confirm('FINAL WARNING: This will permanently delete ALL user accounts except admin. Are you absolutely sure?')) {
        return;
    }
    
    fetch(API_URL + '/api/admin/reset-system', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + appState.authToken }
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'success') {
            alert('Success! Deleted ' + data.deleted_count + ' accounts. Only admin account remains.');
            loadAdminDashboard();
        } else {
            alert('Error: Failed to delete accounts');
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        alert('Network error. Please try again.');
    });
}

// Remove individual user account
function removeUserAccount(userId, userName) {
    if (!confirm('Are you sure you want to permanently delete ' + userName + '\'s account?\n\nThis will remove all their data and cannot be undone.')) {
        return;
    }
    
    fetch(API_URL + '/api/admin/action', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + appState.authToken 
        },
        body: JSON.stringify({ user_id: userId, action: 'delete_account' })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'success') {
            alert(userName + '\'s account has been removed.');
            loadAdminDashboard();
        } else {
            alert('Error: Failed to delete account');
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        alert('Network error. Please try again.');
    });
}

// ==================== FORMULA VIDEOS (Per-Chapter) ====================
// YouTube API Key for fetching formula video thumbnails
var FV_YOUTUBE_API_KEY = 'AIzaSyCZcpYfjLHLXtiSg0sP_wGrDBOupMYFpMw';
// ==================== PHOTO ANSWER VERIFICATION (Gemini Vision) ====================
var GEMINI_API_KEY = 'AIzaSyDux5CRyHqN0kX1O0rIWzTA4DtjYl3RKp0';

async function verifyPhotoAnswer(photoBase64, question, expectedAnswer) {
    try {
        // Show verification spinner
        var statusEl = document.getElementById('photo-status');
        if (statusEl) statusEl.innerHTML = '<span style="color:#FFC107;">Verifying your answer...</span>';
        
        var base64Data = photoBase64.replace(/^data:image\/[^;]+;base64,/, '');
        
        var prompt = 'You are a math teacher grading a student\'s handwritten answer. ' +
            'Question: ' + question.q + '\n' +
            'The correct answer is: ' + (question.options ? question.options[question.answer] : expectedAnswer) + '\n\n' +
            'Look at the student\'s handwritten answer in the photo. ' +
            'Extract what the student wrote and determine if their answer is mathematically correct or matches the expected answer. ' +
            'Be lenient with handwriting but strict with mathematical correctness. ' +
            'Respond with ONLY a JSON object: {"extracted_text": "what student wrote", "is_correct": true/false, "explanation": "brief reason"}';
        
        var response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: 'image/jpeg', data: base64Data } }
                    ]
                }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 256 }
            })
        });
        
        if (!response.ok) {
            console.error('Gemini API error:', response.status);
            return { is_correct: false, extracted_text: 'Could not verify', explanation: 'Verification service unavailable' };
        }
        
        var data = await response.json();
        var text = data.candidates[0].content.parts[0].text;
        
        // Parse JSON from response
        var jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            var result = JSON.parse(jsonMatch[0]);
            return result;
        }
        
        // Fallback: check if response contains "correct" or "true"
        var isCorrect = text.toLowerCase().includes('"is_correct": true') || text.toLowerCase().includes('"is_correct":true');
        return { is_correct: isCorrect, extracted_text: text, explanation: 'Auto-parsed' };
    } catch (e) {
        console.error('Photo verification error:', e);
        return { is_correct: false, extracted_text: 'Error reading answer', explanation: 'Please try again' };
    }
}


// Show formula video for a specific chapter using the full-screen video player overlay
function showChapterFormulaVideo(chapterId) {
    var media = chapterMedia[chapterId];
    if (!media || !media.formulaVideoId) {
        alert('Formula video not available for this chapter yet.');
        return;
    }

    var existing = document.getElementById('video-player-overlay');
    if (existing) existing.remove();

    var videoId = media.formulaVideoId;
    var embedUrl = 'https://www.youtube.com/embed/' + videoId + '?rel=0&modestbranding=1&playsinline=1&autoplay=1&controls=1';

    var overlay = document.createElement('div');
    overlay.id = 'video-player-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#0f0f0f;z-index:10000;display:flex;flex-direction:column;';

    var topBar = document.createElement('div');
    topBar.style.cssText = 'display:flex;align-items:center;padding:8px 16px;background:#0f0f0f;border-bottom:1px solid #272727;flex-shrink:0;gap:12px;';
    topBar.innerHTML = '<button onclick="closeVideoPlayer()" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:6px 10px;border-radius:50%;display:flex;align-items:center;">&larr;</button>' +
        '<div style="flex:1;"><div style="color:#fff;font-size:15px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Formula Video - ' + sanitizeHTML(media.title || 'Chapter ' + chapterId) + '</div>' +
        '<div style="color:#aaa;font-size:12px;">Chapter ' + chapterId + ' Formula</div></div>' +
        '<button id="vid-fs-btn" onclick="toggleVideoFullscreen()" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:6px;border-radius:50%;" title="Fullscreen">⛶</button>';
    overlay.appendChild(topBar);

    var videoArea = document.createElement('div');
    videoArea.id = 'video-player-area';
    videoArea.style.cssText = 'flex:1;background:#000;display:flex;align-items:center;justify-content:center;position:relative;min-height:0;';
    videoArea.innerHTML = '<iframe id="yt-player-frame" src="' + embedUrl + '" style="width:100%;height:100%;border:none;" allowfullscreen allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;fullscreen"></iframe>';
    overlay.appendChild(videoArea);

    document.body.appendChild(overlay);
}

// Load theme on startup
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
});

console.log('GANITA PRAKASH Desktop App - All features loaded with Premium 2026 UI!');

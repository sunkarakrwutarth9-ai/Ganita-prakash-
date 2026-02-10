// ============================================
// GANITA PRAKASH - Additional Features
// Add this at the beginning of app.js
// ============================================

// Claude API Key for AI Assistant - Set via environment or backend
// Note: API calls are made through the backend, not directly from frontend
const CLAUDE_API_KEY = '';

function sanitizeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Indian Festival Calendar 2026
const indianFestivals2026 = [
    { date: "01-01", name: "New Year's Day", wish: "Happy New Year 2026! Wishing you success in your studies!", emoji: "🎉", color: "#FFD700" },
    { date: "01-13", name: "Lohri", wish: "Happy Lohri! May the bonfire bring warmth and prosperity!", emoji: "🔥", color: "#FF6B35" },
    { date: "01-14", name: "Pongal / Makar Sankranti", wish: "Happy Pongal! Happy Makar Sankranti! May the harvest bring abundance!", emoji: "🌾", color: "#FFA500" },
    { date: "01-20", name: "Guru Gobind Singh Jayanti", wish: "Happy Guru Gobind Singh Jayanti! May courage guide your path!", emoji: "🙏", color: "#FF9933" },
    { date: "01-23", name: "Basant Panchami / Saraswati Puja", wish: "Happy Basant Panchami! May Goddess Saraswati bless you with knowledge!", emoji: "📚", color: "#FFFF00" },
    { date: "01-26", name: "Republic Day", wish: "Happy Republic Day! Jai Hind! Proud to be Indian!", emoji: "🇮🇳", color: "#FF9933" },
    { date: "02-15", name: "Maha Shivaratri", wish: "Om Namah Shivaya! Happy Maha Shivaratri!", emoji: "🔱", color: "#9B59B6" },
    { date: "03-03", name: "Holika Dahan", wish: "Happy Holika Dahan! May evil be destroyed!", emoji: "🔥", color: "#E74C3C" },
    { date: "03-04", name: "Holi", wish: "Happy Holi! May your life be filled with colors of joy!", emoji: "🎨", color: "#E91E63" },
    { date: "03-19", name: "Ugadi / Gudi Padwa", wish: "Happy Ugadi! Happy Gudi Padwa! Shubh New Year!", emoji: "🌸", color: "#FF69B4" },
    { date: "03-20", name: "Cheti Chand", wish: "Happy Cheti Chand! Sindhi New Year wishes!", emoji: "🌊", color: "#00CED1" },
    { date: "03-21", name: "Eid ul-Fitr", wish: "Eid Mubarak! Wishing you peace and happiness!", emoji: "🌙", color: "#2ECC71" },
    { date: "03-26", name: "Ram Navami", wish: "Happy Ram Navami! Jai Shri Ram!", emoji: "🏹", color: "#FF8C00" },
    { date: "03-31", name: "Mahavir Jayanti", wish: "Happy Mahavir Jayanti! May truth guide your path!", emoji: "🙏", color: "#FFD700" },
    { date: "04-02", name: "Hanuman Jayanti", wish: "Happy Hanuman Jayanti! Jai Bajrang Bali!", emoji: "🐒", color: "#FF4500" },
    { date: "04-03", name: "Good Friday", wish: "Blessed Good Friday! May peace be with you!", emoji: "✝️", color: "#8B4513" },
    { date: "04-05", name: "Easter Sunday", wish: "Happy Easter! May joy and hope fill your heart!", emoji: "🐣", color: "#FFB6C1" },
    { date: "04-14", name: "Baisakhi / Ambedkar Jayanti", wish: "Happy Baisakhi! Happy Ambedkar Jayanti!", emoji: "🌾", color: "#F1C40F" },
    { date: "05-01", name: "Buddha Purnima", wish: "Happy Buddha Purnima! May wisdom light your way!", emoji: "🪷", color: "#9B59B6" },
    { date: "05-28", name: "Eid ul-Adha", wish: "Eid Mubarak! Wishing you joy and prosperity!", emoji: "🌙", color: "#2ECC71" },
    { date: "07-16", name: "Jagannath Rath Yatra", wish: "Happy Rath Yatra! Jai Jagannath!", emoji: "🛕", color: "#E67E22" },
    { date: "07-29", name: "Guru Purnima", wish: "Happy Guru Purnima! Salute to all teachers!", emoji: "👨‍🏫", color: "#8E44AD" },
    { date: "08-15", name: "Independence Day", wish: "Happy Independence Day! Jai Hind!", emoji: "🇮🇳", color: "#138808" },
    { date: "08-17", name: "Raksha Bandhan", wish: "Happy Raksha Bandhan! Celebrate the bond of love!", emoji: "🎀", color: "#E91E63" },
    { date: "08-24", name: "Janmashtami", wish: "Happy Janmashtami! Jai Shri Krishna!", emoji: "🦚", color: "#3498DB" },
    { date: "08-26", name: "Onam", wish: "Happy Onam! May King Mahabali bless you!", emoji: "🌺", color: "#F39C12" },
    { date: "09-03", name: "Ganesh Chaturthi", wish: "Ganpati Bappa Morya! Happy Ganesh Chaturthi!", emoji: "🐘", color: "#E74C3C" },
    { date: "10-02", name: "Gandhi Jayanti", wish: "Happy Gandhi Jayanti! Be the change you wish to see!", emoji: "🕊️", color: "#F5F5DC" },
    { date: "10-07", name: "Sharad Navratri Begins", wish: "Shubh Navratri! May Goddess Durga bless you!", emoji: "🔱", color: "#E91E63" },
    { date: "10-15", name: "Durga Puja Ashtami/Navami", wish: "Happy Durga Puja! Jai Maa Durga!", emoji: "🙏", color: "#E91E63" },
    { date: "10-16", name: "Dussehra / Vijayadashami", wish: "Happy Dussehra! May good triumph over evil!", emoji: "🏹", color: "#FF6B35" },
    { date: "10-25", name: "Karva Chauth", wish: "Happy Karva Chauth! May your love last forever!", emoji: "🌙", color: "#E91E63" },
    { date: "11-02", name: "Dhanteras", wish: "Happy Dhanteras! May wealth and prosperity come to you!", emoji: "💰", color: "#FFD700" },
    { date: "11-04", name: "Diwali", wish: "Happy Diwali! May your life shine bright with joy!", emoji: "🪔", color: "#FFD700" },
    { date: "11-05", name: "Govardhan Puja", wish: "Happy Govardhan Puja! Jai Shri Krishna!", emoji: "⛰️", color: "#27AE60" },
    { date: "11-06", name: "Bhai Dooj", wish: "Happy Bhai Dooj! Celebrate the bond of siblings!", emoji: "👫", color: "#E91E63" },
    { date: "11-10", name: "Chhath Puja", wish: "Happy Chhath Puja! Jai Chhathi Maiya!", emoji: "🌅", color: "#FF6B35" },
    { date: "11-14", name: "Children's Day", wish: "Happy Children's Day! Keep learning and growing!", emoji: "👧", color: "#3498DB" },
    { date: "11-19", name: "Guru Nanak Jayanti", wish: "Happy Guru Nanak Jayanti! Waheguru Ji Ka Khalsa!", emoji: "🙏", color: "#FF9933" },
    { date: "12-25", name: "Christmas", wish: "Merry Christmas! Wishing you joy and happiness!", emoji: "🎄", color: "#E74C3C" },
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

// Legacy function for compatibility
function checkHolidayWish() {
    checkFestivalWish();
}

function showHolidayWish() {
    checkFestivalWish();
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
    1: { title: "Patterns in numbers", videoUrl: "https://drive.google.com/file/d/1G-gWjUd8hrmxyV-meLn6igquy5zTqx-i/preview", videoSummary: "Learn about number patterns and sequences.", pptUrl: "https://drive.google.com/file/d/1WbHMprNLt5JMQo0vVaC7_P7sTrR9Sxcd/preview", pptTitle: "The Hidden Architecture of Patterns", tbUrl: "https://drive.google.com/file/d/1MdSzsXsFNUjYw8cxTiBFd7-T6qvH40Sp/preview", tbTitle: "Chapter 1 - Maths T.B." },
    2: { title: "Lines and Angles", videoUrl: "https://drive.google.com/file/d/10NfjD3znlbJbcKo50R9AD5vLNuLCOB5H/preview", videoSummary: "Understanding lines, rays, and angles.", pptUrl: "https://drive.google.com/file/d/1fCIki-yVVW33e5_yQabafq8Sn7-Ue5Eu/preview", pptTitle: "From Point to Degree", tbUrl: "https://drive.google.com/file/d/1P7GyBa-N0d5fXL0iMaWZriEVxsHf4ISG/preview", tbTitle: "Chapter 2 - Maths T.B." },
    3: { title: "Number Play", videoUrl: "https://drive.google.com/file/d/1voVejm6eO6BtXm9AMIfLCPikVwGnHU8i/preview", videoSummary: "Explore number puzzles and patterns.", pptUrl: "https://drive.google.com/file/d/1KgJx2nQdc9t-xHsBjYzt11JgFzyeGQmm/preview", pptTitle: "The Secret Life of Numbers", tbUrl: "https://drive.google.com/file/d/145VeF9E3B3XbiAS5XGwNoGRNiCY1Kkxn/preview", tbTitle: "Chapter 3 - Maths T.B." },
    4: { title: "Data Handling", videoUrl: "https://drive.google.com/file/d/1uWy_U2NrHjx1Riv0Z2NIANPj5XkMxmYD/preview", videoSummary: "Learn to collect and present data.", pptUrl: "https://drive.google.com/file/d/1vAHyCGcFtcdjTIzvasaCvOGYMblfujGg/preview", pptTitle: "Data Structure Visualize Integrity", tbUrl: "https://drive.google.com/file/d/1h9k3rGFz8sXidIitfspCmQ6g0pCzZKCY/preview", tbTitle: "Chapter 4 - Maths T.B." },
    5: { title: "Prime Time", videoUrl: "https://drive.google.com/file/d/1CJTbvE5vTVPJiFvt-_l1cv5mHr5g7JD2/preview", videoSummary: "Discover prime numbers and factors.", pptUrl: "https://drive.google.com/file/d/1-94wWynj-KJN4uU-1DzjSGtLPKO3Y32m/preview", pptTitle: "Prime Time A Game of Numbers", tbUrl: "https://drive.google.com/file/d/1OHpaiu9dF71fK4bRp0BO7ok8_QKIq2MJ/preview", tbTitle: "Chapter 5 - Maths T.B." },
    6: { title: "Perimeter and Area", videoUrl: "https://drive.google.com/file/d/1rAjBngeOMaEiZ_tE4OM8Okviyqhbxkpo/preview", videoSummary: "Calculate perimeter and area.", pptUrl: "https://drive.google.com/file/d/11z7anMHhrCoG2309wuKuYhMXADdKlxbj/preview", pptTitle: "The Architect's Toolkit Mastering Space", tbUrl: "https://drive.google.com/file/d/1-XCGMLfG-e05qa2Pfvd8q-WxRUxtgIRG/preview", tbTitle: "Chapter 6 - Maths T.B." },
    7: { title: "Fractions", videoUrl: "https://drive.google.com/file/d/1HLz1i1ZzddZdnpsoyv7Zhoot_P80oaYm/preview", videoSummary: "Understanding fractions.", pptUrl: "https://drive.google.com/file/d/1ll8jPIypxn1Z_ISDHHSNxoMFQ0BqBodA/preview", pptTitle: "The Language of Parts", tbUrl: "https://drive.google.com/file/d/13kc5mx6p3jWThUIHKEoRYoYRkNkvnHCV/preview", tbTitle: "Chapter 7 - Maths T.B." },
    8: { title: "Playing with Constructions", videoUrl: "https://drive.google.com/file/d/1YuU0Cmx4CoeL2IgM6dsjS1zBCXoNG8cQ/preview", videoSummary: "Geometric constructions.", pptUrl: "https://drive.google.com/file/d/18oH6_9fkoIS2yCZ28qBTyGSW4-TkJlL_/preview", pptTitle: "The Geometer's Quest Precision and Art", tbUrl: "https://drive.google.com/file/d/1agsSZgajY4NPMyaWcFnYZ9slQpvfhb5Z/preview", tbTitle: "Chapter 8 - Maths T.B." },
    9: { title: "Symmetry", videoUrl: "https://drive.google.com/file/d/14X50UAcCKYxgTmTxFxXtwUI74lK1YLOh/preview", videoSummary: "Line and rotational symmetry.", pptUrl: "https://drive.google.com/file/d/1YDvhdUNJ3nmUJilCex2uqIcsQ3-I0cnT/preview", pptTitle: "The Universal Blueprint of Symmetry", tbUrl: "https://drive.google.com/file/d/1-PWg2U1ZOkU-jXUIQ3W5f0ClNtYGWWTU/preview", tbTitle: "Chapter 9 - Maths T.B." },
    10: { title: "The Other Side of Zero", videoUrl: "https://drive.google.com/file/d/1FN9nkTnWCOTYF6El54AEtWtd-NKsUiBD/preview", videoSummary: "Introduction to integers.", pptUrl: "https://drive.google.com/file/d/18dQvLG_a1EOM5uz3JZKehQ-yOgtkzsJD/preview", pptTitle: "The Other Side of Zero", tbUrl: "https://drive.google.com/file/d/1pJf73SW7rhNGsCSMKGy6gnypRGI41L65/preview", tbTitle: "Chapter 10 - Maths T.B." },
};

console.log('Additional features loaded: Holidays, Languages, Chapter Media');
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
                "content": "Number patterns are sequences of numbers that follow a specific rule or formula. Understanding these patterns is fundamental to mathematics and helps develop logical thinking skills. The simplest patterns include counting numbers (1, 2, 3, 4, 5...), even numbers (2, 4, 6, 8, 10...), and odd numbers (1, 3, 5, 7, 9...). More complex patterns involve multiplication, such as powers of 2 (1, 2, 4, 8, 16, 32...) or multiples of any number. To identify a pattern, look at the difference between consecutive terms or the ratio between them. For example, in the sequence 3, 6, 9, 12, 15, each term increases by 3, making it a pattern of multiples of 3. Recognizing patterns helps in predicting future terms and understanding mathematical relationships that appear throughout algebra and higher mathematics."
            },
            {
                "name": "Shape Patterns",
                "content": "Shape patterns involve geometric figures arranged in a sequence following specific rules. These patterns can involve changes in size, color, orientation, or the number of sides. For example, a pattern might show a triangle, then a square, then a pentagon - each shape having one more side than the previous. Shape patterns help develop spatial reasoning and visual thinking skills. In mathematics, we study how shapes grow - like how square numbers (1, 4, 9, 16...) can be visualized as growing squares, or how triangular numbers (1, 3, 6, 10...) form triangular arrangements of dots. Understanding shape patterns is essential for geometry, art, architecture, and design. These patterns appear everywhere - in floor tiles, wallpaper designs, fabric prints, and even in nature's honeycomb structures."
            },
            {
                "name": "Patterns in Nature",
                "content": "Nature is full of mathematical patterns that have fascinated scientists and mathematicians for centuries. The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21...) appears in the spiral arrangement of sunflower seeds, the branching of trees, and the spiral shells of snails. Each Fibonacci number is the sum of the two preceding numbers. The golden ratio (approximately 1.618) derived from this sequence appears in flower petals, pinecones, and even hurricanes. Fractals are patterns that repeat at different scales - seen in snowflakes, fern leaves, and coastlines. Symmetry patterns appear in butterfly wings, starfish, and flowers. Hexagonal patterns appear in beehives because hexagons are the most efficient shape for storing honey. Studying patterns in nature helps us understand the mathematical principles underlying the natural world."
            },
            {
                "name": "Magic Squares",
                "content": "A magic square is a square grid filled with distinct positive integers where the sum of numbers in each row, column, and diagonal equals the same value, called the magic constant. The simplest magic square is 3x3, using numbers 1-9, with a magic constant of 15. To create a 3x3 magic square, place 5 in the center, then arrange other numbers so each line sums to 15. Magic squares have been studied for over 4,000 years, appearing in ancient China, India, and Arabia. They were believed to have mystical properties. The magic constant for an n×n magic square using numbers 1 to n² is n(n²+1)/2. For example, a 4x4 magic square has a constant of 34. Magic squares teach important concepts about number relationships, addition, and logical thinking. They appear in art, architecture, and even in Albrecht Dürer's famous engraving 'Melencolia I'."
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
                "content": "In geometry, the most basic elements are points, lines, rays, and line segments. A point is a precise location in space with no length, width, or height - it is represented by a dot and named with a capital letter (like point A). A line is a straight path that extends infinitely in both directions, having no endpoints. We represent a line with arrows on both ends and name it using two points on it (like line AB) or a single lowercase letter. A ray is a part of a line that has one endpoint and extends infinitely in one direction - think of a flashlight beam starting from the bulb and going forever. A line segment is a part of a line with two endpoints, having a definite length that can be measured. Understanding these basic elements is essential for studying all of geometry, as every shape and figure is made up of these fundamental components."
            },
            {
                "name": "Types of Lines",
                "content": "Lines can be classified based on their relationship to each other. Parallel lines are lines in the same plane that never intersect, no matter how far they are extended - like railway tracks or the opposite edges of a ruler. The symbol || is used to denote parallel lines (AB || CD). Perpendicular lines are lines that intersect at exactly 90 degrees (a right angle), forming an L-shape - like the corner of a book or the hands of a clock at 3 o'clock. The symbol ⊥ denotes perpendicular lines. Intersecting lines are lines that cross at exactly one point, and the angles formed at the intersection have special properties. Concurrent lines are three or more lines that pass through the same point. Understanding these relationships is crucial for construction, architecture, and navigation. In real life, we see parallel lines in ladder rungs, lined paper, and building structures."
            },
            {
                "name": "Types of Angles",
                "content": "An angle is formed when two rays share a common endpoint called the vertex. Angles are measured in degrees using a protractor. An acute angle measures less than 90 degrees - like the tip of a pizza slice or the hands of a clock at 2 o'clock. A right angle measures exactly 90 degrees, forming a perfect L-shape - like the corner of a book or a door frame. An obtuse angle measures more than 90 degrees but less than 180 degrees - like an open book or a reclining chair. A straight angle measures exactly 180 degrees, forming a straight line. A reflex angle measures more than 180 degrees but less than 360 degrees. A complete angle measures exactly 360 degrees, representing a full rotation. Complementary angles add up to 90 degrees, while supplementary angles add up to 180 degrees. Understanding angles is essential for construction, navigation, sports, and art."
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

// Application State
let appState = {
    currentChapter: null,
    currentQuiz: null,
    currentQuestion: 0,
    score: 0,
    answers: [],
    chapterProgress: {},
    chapterScores: {},
    finalExamCompleted: false,
    finalExamScore: 0,
    studentName: localStorage.getItem('studentName') || '',
    certificates: [],
    isScreenSharing: false,
    screenShareStream: null
};

// Screen sharing functions for exam monitoring
// Store student's screen share peer connection
var studentScreenSharePC = null;
var forceSubmitPollInterval = null;

async function startScreenSharing() {
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            appState.screenShareStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: 'always' },
                audio: false
            });
            appState.isScreenSharing = true;
            
            // Notify backend that screen sharing started
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
                
                // Send screen share via WebRTC to admin
                sendScreenShareToAdmin(appState.screenShareStream, token);
                
                // Start polling for force-submit commands
                startForceSubmitPolling(token);
            }
            
            // Handle when user stops sharing
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

// Send screen share stream to admin via WebRTC
async function sendScreenShareToAdmin(stream, token) {
    try {
        studentScreenSharePC = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        });
        
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
        var offer = await studentScreenSharePC.createOffer();
        await studentScreenSharePC.setLocalDescription(offer);
        
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
    appState.isScreenSharing = false;
    
    // Notify backend that screen sharing stopped
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
        alert('WARNING: You switched away from the exam! Your exam will be auto-submitted.');
        autoSubmitExam();
    }
});

// Window blur detection for exam monitoring
window.addEventListener('blur', function() {
    if (appState.isMonitoring) {
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
    if (autoLoginToken && mode === 'call') {
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
                localStorage.setItem('userData', JSON.stringify(userData));
            }
        } catch (e) {
            console.log('Auto-login user fetch error:', e);
        }
        
        saveState();
        showMainApp();
        
        // If this is a call mode, initiate the call
        if (callId && targetUserId) {
            setTimeout(function() {
                initiateCallFromMobile(parseInt(targetUserId), callType || 'audio', callId);
            }, 1000);
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
        saveState();
        showMainApp();
        renderChapters();
        if (appState.isAdmin) {
            loadAdminDashboard();
        }
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
        'progress': 'progress-section',
        'final-exam': 'final-exam-section',
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
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Stop all refresh intervals when switching sections
    stopUserChatRefresh();
    stopAdminChatRefresh();
    
    // Render content for each section
    if (section === 'chapters') renderChapters();
    if (section === 'progress') renderProgress();
    if (section === 'final-exam') renderFinalExam();
    if (section === 'certificates' || section === 'certificate') renderCertificates();
    if (section === '3d-models') show3DModels();
    if (section === 'chat') startUserChatRefresh(); // WhatsApp-style chat with auto-refresh
    if (section === 'admin' && appState.isAdmin) { loadAdminDashboard(); startAdminChatRefresh(); }
}

// Render chapters grid
function renderChapters() {
    const grid = document.getElementById('chapters-grid');
    grid.innerHTML = chapters.map((chapter, index) => {
        const isCompleted = appState.chapterProgress[chapter.id] === 'completed';
        // Admin has access to all chapters - no locking for admin
        const isLocked = !appState.isAdmin && index > 0 && appState.chapterProgress[chapters[index-1].id] !== 'completed';
        const score = appState.chapterScores[chapter.id];
        
        return `
            <div class="chapter-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}" 
                 onclick="${isLocked ? '' : `openChapter(${chapter.id})`}">
                <div class="chapter-number">${chapter.number}</div>
                <div class="chapter-title">${chapter.title}</div>
                <p style="color: #aaa; font-size: 0.9em;">${chapter.description}</p>
                <div class="chapter-status">
                    ${isCompleted ? `<span class="status-badge completed">Completed - ${score}%</span>` : 
                      isLocked ? '<span class="status-badge locked">Locked</span>' : 
                      appState.isAdmin ? '<span class="status-badge" style="background:#8B5CF6;">Admin Access</span>' :
                      '<span class="status-badge in-progress">Start Learning</span>'}
                </div>
            </div>
        `;
    }).join('');
}

// Open chapter
function openChapter(chapterId) {
    appState.currentChapter = chapters.find(c => c.id === chapterId);
    renderChapterContent();
}

// Render chapter content
function renderChapterContent() {
    const chapter = appState.currentChapter;
    const media = chapterMedia[chapter.id] || {};
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('chapter-content-section').classList.add('active');
    
    document.getElementById('chapter-content').innerHTML = `
        <button class="btn btn-secondary" onclick="backToChapters()" style="margin-bottom: 20px;">
            ← Back to Chapters
        </button>
        <h2 class="section-title">Chapter ${chapter.number}: ${chapter.title}</h2>
        
        <!-- Media Buttons -->
        <div class="btn-group" style="margin-bottom: 30px; flex-wrap: wrap;">
            ${media.videoUrl ? `<button class="btn btn-primary" onclick="showChapterVideo(${chapter.id})">📹 WATCH VIDEO</button>` : ''}
            ${media.pptUrl ? `<button class="btn btn-primary" onclick="showChapterPPT(${chapter.id})">📊 VIEW PPT</button>` : ''}
            ${media.tbUrl ? `<button class="btn btn-secondary" onclick="showChapterTextbook(${chapter.id})">📖 TEXTBOOK</button>` : ''}
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
    const chapter = chapters.find(c => c.id === chapterId);
    const topic = chapter.topics[topicIndex];
    const media = chapterMedia[chapterId] || {};
    
    document.getElementById('chapter-content').innerHTML = `
        <button class="btn btn-secondary" onclick="renderChapterContent()" style="margin-bottom: 20px;">
            ← Back to Chapter ${chapter.number}
        </button>
        <h2 class="section-title">${topic.name}</h2>
        
        <!-- Media Buttons -->
        <div class="btn-group" style="margin-bottom: 30px; flex-wrap: wrap;">
            ${media.videoUrl ? `<button class="btn btn-primary" onclick="showChapterVideo(${chapter.id})">📹 WATCH VIDEO</button>` : ''}
            ${media.pptUrl ? `<button class="btn btn-primary" onclick="showChapterPPT(${chapter.id})">📊 VIEW PPT</button>` : ''}
        </div>
        
        <div class="topic-detail" style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05)); padding: 30px; border: 2px solid rgba(0, 255, 255, 0.3); margin-bottom: 30px;">
            <p style="font-size: 1.1em; line-height: 1.8; color: #ddd;">${topic.content}</p>
        </div>
        
        <div class="btn-group">
            <button class="btn btn-secondary" onclick="renderChapterContent()">← Back to Topics</button>
            <button class="btn btn-primary" onclick="startQuiz(${chapter.id})">Take Quiz</button>
        </div>
    `;
}

// Show chapter video in modal
function showChapterVideo(chapterId) {
    const media = chapterMedia[chapterId];
    if (!media || !media.videoUrl) {
        alert('Video not available for this chapter.');
        return;
    }
    
    const modal = document.getElementById('result-modal');
    modal.style.display = 'flex';
    modal.querySelector('.modal-content').innerHTML = `
        <h2 style="color: #00ffff; font-family: 'Orbitron', monospace; margin-bottom: 20px;">${media.title} - Video</h2>
        <p style="color: #aaa; margin-bottom: 15px;">${media.videoSummary || ''}</p>
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; margin-bottom: 20px;">
            <iframe src="${media.videoUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 2px solid #00ffff;" allowfullscreen></iframe>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" onclick="closeModal()">CLOSE</button>
        </div>
    `;
}

// Show chapter PPT in modal
function showChapterPPT(chapterId) {
    const media = chapterMedia[chapterId];
    if (!media || !media.pptUrl) {
        alert('PPT not available for this chapter.');
        return;
    }
    
    const modal = document.getElementById('result-modal');
    modal.style.display = 'flex';
    modal.querySelector('.modal-content').innerHTML = `
        <h2 style="color: #00ffff; font-family: 'Orbitron', monospace; margin-bottom: 20px;">${media.pptTitle || 'Chapter Presentation'}</h2>
        <div style="position: relative; width: 100%; padding-bottom: 75%; margin-bottom: 20px;">
            <iframe src="${media.pptUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 2px solid #00ffff;" allowfullscreen></iframe>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" onclick="closeModal()">CLOSE</button>
        </div>
    `;
}

// Show chapter textbook in modal
function showChapterTextbook(chapterId) {
    const media = chapterMedia[chapterId];
    if (!media || !media.tbUrl) {
        alert('Textbook not available for this chapter.');
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

// Back to chapters
function backToChapters() {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('chapters-section').classList.add('active');
    renderChapters();
}

// Start quiz with screen sharing permission request
async function startQuiz(chapterId) {
    const chapter = chapters.find(c => c.id === chapterId);
    
    // Show screen sharing permission request first
    var confirmed = confirm(
        'SCREEN SHARING PERMISSION REQUIRED\n\n' +
        'GANITA PRAKASH needs to monitor your screen during the exam to ensure fair assessment.\n\n' +
        'IMPORTANT RULES:\n\n' +
        '1. Your screen will be monitored during the exam\n' +
        '2. If you leave the app, your exam will be auto-submitted\n' +
        '3. Any cheating will result in automatic submission\n' +
        '4. You have limited time to complete\n' +
        '5. Make sure you are in a quiet place\n\n' +
        'By clicking OK, you agree to screen monitoring.\n\n' +
        'Click OK to Allow & Start Exam or Cancel to go back.'
    );
    
    if (!confirmed) return;
    
    // Start screen sharing
    var screenShareStarted = await startScreenSharing();
    if (!screenShareStarted) {
        alert('Screen sharing is required for the exam. Please allow screen sharing to continue.');
    }
    
    // Show screen monitoring active notification
    alert('SCREEN MONITORING ACTIVE\n\nYour screen is now being monitored. Do not switch apps or minimize during the exam.');
    
    appState.currentQuiz = chapter;
    appState.currentQuestion = 0;
    appState.score = 0;
    appState.answers = [];
    appState.isMonitoring = true;
    
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('quiz-section').classList.add('active');
    
    renderQuizQuestion();
}

// Render quiz question
function renderQuizQuestion() {
    const quiz = appState.currentQuiz;
    const question = quiz.questions[appState.currentQuestion];
    const total = quiz.questions.length;
    
    document.getElementById('quiz-container').innerHTML = `
        <h2 class="section-title">Chapter ${quiz.number} Quiz: ${quiz.title}</h2>
        
        <div class="progress-container">
            <div class="progress-bar" style="width: ${((appState.currentQuestion) / total) * 100}%"></div>
        </div>
        <div class="progress-text">Question ${appState.currentQuestion + 1} of ${total}</div>
        
        <div class="question-card">
            <div class="question-number">Question ${appState.currentQuestion + 1}</div>
            <div class="question-text">${question.q}</div>
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
                ${appState.currentQuestion === total - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
        </div>
    `;
}

// Select option
let selectedOption = null;
function selectOption(index) {
    selectedOption = index;
    document.querySelectorAll('.option').forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === index) opt.classList.add('selected');
    });
    document.getElementById('submit-btn').disabled = false;
}

// Submit answer
function submitAnswer() {
    const quiz = appState.currentQuiz;
    const question = quiz.questions[appState.currentQuestion];
    
    appState.answers.push(selectedOption);
    if (selectedOption === question.answer) {
        appState.score++;
    }
    
    appState.currentQuestion++;
    selectedOption = null;
    
    if (appState.currentQuestion >= quiz.questions.length) {
        showQuizResult();
    } else {
        renderQuizQuestion();
    }
}

// Show quiz result
function showQuizResult() {
    // Stop screen sharing and monitoring
    appState.isMonitoring = false;
    stopScreenSharing();
    
    const quiz = appState.currentQuiz;
    const total = quiz.questions.length;
    const percentage = Math.round((appState.score / total) * 100);
    const passed = appState.score >= 35; // Pass if 35+ out of 40 correct
    
    // Save progress
    if (passed) {
        appState.chapterProgress[quiz.id] = 'completed';
        appState.chapterScores[quiz.id] = percentage;
        saveState();
    }
    
    const modal = document.getElementById('result-modal');
    document.getElementById('result-icon').innerHTML = passed ? '🎉' : '📚';
    document.getElementById('result-icon').className = `result-icon ${passed ? 'pass' : 'fail'}`;
    document.getElementById('result-score').textContent = `${appState.score}/${total} (${percentage}%)`;
    
    if (passed) {
        document.getElementById('result-message').innerHTML = `
            <strong>Congratulations!</strong><br>
            You passed the Chapter ${quiz.number} Quiz!<br><br>
            ${quiz.id === 10 ? 
                '<span style="color: #4CAF50; font-size: 1.2em;">Be ready for Science Curiosity - Thanks!</span><br><br>' +
                'You have completed all chapters! Take the Final Exam now.' : 
                'You can now proceed to the next chapter.'}
        `;
        
        // Generate chapter certificate
        generateChapterCertificate(quiz, percentage);
    } else {
        document.getElementById('result-message').innerHTML = `
            <strong>Keep Trying!</strong><br>
            You need 35 out of 40 to pass.<br>
            Review the chapter and try again.
        `;
    }
    
    modal.classList.add('active');
}

// Generate chapter certificate (Case 1)
function generateChapterCertificate(chapter, score) {
    const cert = {
        type: 'chapter',
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        score: score,
        date: new Date().toLocaleDateString(),
        studentName: appState.studentName
    };
    
    // Check if certificate already exists
    const exists = appState.certificates.find(c => c.type === 'chapter' && c.chapterId === chapter.id);
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
    const completedChapters = Object.keys(appState.chapterProgress).filter(k => appState.chapterProgress[k] === 'completed').length;
    const totalChapters = chapters.length;
    const overallProgress = Math.round((completedChapters / totalChapters) * 100);
    
    document.getElementById('progress-content').innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="color: #E94560;">Overall Progress</h3>
            <div class="progress-container" style="max-width: 500px; margin: 20px auto;">
                <div class="progress-bar" style="width: ${overallProgress}%"></div>
            </div>
            <p style="font-size: 1.5em; color: #E94560;">${completedChapters}/${totalChapters} Chapters Completed (${overallProgress}%)</p>
        </div>
        
        <h3 style="color: #E94560; margin-bottom: 20px;">Chapter-wise Progress</h3>
        <div class="chapters-grid">
            ${chapters.map(chapter => {
                const isCompleted = appState.chapterProgress[chapter.id] === 'completed';
                const score = appState.chapterScores[chapter.id] || 0;
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
function renderFinalExam() {
    const allChaptersCompleted = chapters.every(c => appState.chapterProgress[c.id] === 'completed');
    
    if (!allChaptersCompleted) {
        document.getElementById('final-exam-content').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <div style="font-size: 5em; margin-bottom: 20px;">🔒</div>
                <h3 style="color: #E94560;">Final Exam Locked</h3>
                <p style="margin-top: 20px; color: #aaa;">
                    Complete all 10 chapters to unlock the Final Examination.
                </p>
                <p style="margin-top: 10px; color: #E94560;">
                    Chapters Completed: ${Object.keys(appState.chapterProgress).filter(k => appState.chapterProgress[k] === 'completed').length}/10
                </p>
            </div>
        `;
        return;
    }
    
    if (appState.finalExamCompleted) {
        document.getElementById('final-exam-content').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <div style="font-size: 5em; margin-bottom: 20px;">🏆</div>
                <h3 style="color: #4CAF50;">Final Exam Completed!</h3>
                <p style="font-size: 2em; color: #E94560; margin: 20px 0;">
                    Your Score: ${appState.finalExamScore}/100
                </p>
                <p style="color: ${appState.finalExamScore >= 80 ? '#4CAF50' : '#f44336'};">
                    ${appState.finalExamScore >= 80 ? 'PASSED' : 'Need 80 to pass'}
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
            <h3 style="color: #E94560;">Final Examination</h3>
            <p style="margin: 20px 0; color: #aaa;">
                This exam covers all 10 chapters of NCERT Class 6 Mathematics.
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
    // Show screen and camera permission request first
    var confirmed = confirm(
        'SCREEN & CAMERA PERMISSION REQUIRED\n\n' +
        'GANITA PRAKASH needs to monitor your screen and camera during the Final Exam to ensure fair assessment.\n\n' +
        'IMPORTANT RULES FOR FINAL EXAM:\n\n' +
        '1. Your screen and camera will be monitored\n' +
        '2. If you leave the app, your exam will be auto-submitted\n' +
        '3. Any cheating will result in automatic submission and failure\n' +
        '4. This exam has MCQ and Written sections\n' +
        '5. You need 80% to pass\n' +
        '6. Make sure you are in a quiet, well-lit place\n\n' +
        'By clicking OK, you agree to screen and camera monitoring.\n\n' +
        'Click OK to Allow & Start Final Exam or Cancel to go back.'
    );
    
    if (!confirmed) return;
    
    // Start screen sharing
    var screenShareStarted = await startScreenSharing();
    if (!screenShareStarted) {
        alert('Screen sharing is required for the Final Exam. Please allow screen sharing to continue.');
    }
    
    // Show monitoring active notification
    alert('MONITORING ACTIVE\n\nYour screen and camera are now being monitored. Do not switch apps or minimize during the exam.');
    
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
    appState.finalExamCompleted = false;
    appState.finalExamScore = 0;
    saveState();
    startFinalExam();
}

// Render final exam MCQ
function renderFinalExamMCQ() {
    const question = finalExamQuestions.mcq[finalExamState.currentQuestion];
    const total = finalExamQuestions.mcq.length;
    
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
    const question = finalExamQuestions.mcq[finalExamState.currentQuestion];
    
    finalExamState.mcqAnswers.push(finalSelectedOption);
    if (finalSelectedOption === question.answer) {
        finalExamState.mcqScore += 2;
    }
    
    finalExamState.currentQuestion++;
    finalSelectedOption = null;
    
    if (finalExamState.currentQuestion >= finalExamQuestions.mcq.length) {
        renderFinalExamPenPaper();
    } else {
        renderFinalExamMCQ();
    }
}

// Render pen and paper questions
function renderFinalExamPenPaper() {
    document.getElementById('final-exam-content').innerHTML = `
        <h3 style="color: #E94560; margin-bottom: 20px;">Part B: Pen & Paper Questions (50 marks)</h3>
        <p style="color: #aaa; margin-bottom: 20px;">
            Write your answers on paper. Self-evaluate your answers and enter marks for each question.
        </p>
        
        <div class="pen-paper-section">
            ${finalExamQuestions.penPaper.map((q, i) => `
                <div class="pen-paper-question">
                    <div class="question-number">Question ${i + 1} (${q.marks} marks) - Chapter ${q.chapter}</div>
                    <div class="question-text">${q.q}</div>
                    <div style="margin-top: 15px;">
                        <label style="color: #E94560;">Self-evaluated marks (0-${q.marks}):</label>
                        <input type="number" min="0" max="${q.marks}" value="0" 
                               id="pen-paper-${i}" 
                               style="width: 80px; padding: 8px; margin-left: 10px; background: rgba(255,255,255,0.1); border: 1px solid #E94560; border-radius: 5px; color: #fff;">
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="btn-group">
            <button class="btn btn-primary" onclick="submitFinalExam()">
                Submit Final Exam
            </button>
        </div>
    `;
}

// Submit final exam
function submitFinalExam() {
    // Stop screen sharing and monitoring
    appState.isMonitoring = false;
    stopScreenSharing();
    
    let penPaperScore = 0;
    finalExamQuestions.penPaper.forEach((q, i) => {
        const marks = parseInt(document.getElementById(`pen-paper-${i}`).value) || 0;
        penPaperScore += Math.min(marks, q.marks);
    });
    
    const totalScore = finalExamState.mcqScore + penPaperScore;
    appState.finalExamScore = totalScore;
    appState.finalExamCompleted = true;
    
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
        studentName: appState.studentName
    };
    
    const exists = appState.certificates.find(c => c.type === 'final-exam');
    if (!exists) {
        appState.certificates.push(cert);
    } else {
        // Update existing
        const index = appState.certificates.findIndex(c => c.type === 'final-exam');
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
        chaptersCompleted: 10
    };
    
    const exists = appState.certificates.find(c => c.type === 'master');
    if (!exists) {
        appState.certificates.push(cert);
    } else {
        const index = appState.certificates.findIndex(c => c.type === 'master');
        appState.certificates[index] = cert;
    }
    saveState();
}

// Render certificates
function renderCertificates() {
    if (appState.certificates.length === 0) {
        document.getElementById('certificate-content').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <div style="font-size: 5em; margin-bottom: 20px;">📜</div>
                <h3 style="color: #E94560;">No Certificates Yet</h3>
                <p style="margin-top: 20px; color: #aaa;">
                    Complete chapter quizzes and the final exam to earn certificates!
                </p>
            </div>
        `;
        return;
    }
    
    // Sort certificates: master first, then final-exam, then chapters
    const sortedCerts = [...appState.certificates].sort((a, b) => {
        const order = { 'master': 0, 'final-exam': 1, 'chapter': 2 };
        return order[a.type] - order[b.type];
    });
    
    document.getElementById('certificate-content').innerHTML = `
        <div style="margin-bottom: 30px;">
            <p style="color: #aaa; text-align: center;">You have earned ${appState.certificates.length} certificate(s)</p>
        </div>
        
        ${sortedCerts.map(cert => renderCertificate(cert)).join('<hr style="border-color: #E94560; margin: 40px 0;">')}
    `;
}

// Render individual certificate
function renderCertificate(cert) {
    if (cert.type === 'master') {
        return `
            <div class="certificate" style="border-color: #FFD700;">
                <img src="logo.png" class="cert-logo" alt="GANITA PRAKASH">
                <h1 style="color: #FFD700;">MASTER CERTIFICATE</h1>
                <p>This is to certify that</p>
                <div class="student-name">${cert.studentName || 'Student'}</div>
                <p>has successfully completed</p>
                <p style="font-size: 1.5em; color: #C73E54; font-weight: bold;">
                    GANITA PRAKASH<br>
                    Class VI Mathematics (NCERT Syllabus)
                </p>
                <p>with a Final Exam Score of <strong>${cert.score}/100</strong></p>
                <p>Completing all 10 chapters and the Final Examination</p>
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
                <p>This is to certify that</p>
                <div class="student-name">${cert.studentName || 'Student'}</div>
                <p>has successfully passed the</p>
                <p style="font-size: 1.3em; color: #C73E54; font-weight: bold;">
                    Final Examination
                </p>
                <p>with a score of <strong>${cert.score}/100</strong></p>
                <p class="date">Date: ${cert.date}</p>
            </div>
        `;
    } else {
        return `
            <div class="certificate" style="max-width: 500px;">
                <img src="logo.png" class="cert-logo" alt="GANITA PRAKASH" style="width: 80px;">
                <h1 style="font-size: 1.8em;">CHAPTER COMPLETION</h1>
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

const API_URL = "https://app-lqmnnlxp.fly.dev";
// ADMIN_EMAIL is defined in index.html

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

// Show login screen
function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

// Show main app
function showMainApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('display-name').textContent = appState.studentName || 'Student';
    document.getElementById('display-role').textContent = appState.isAdmin ? 'Master Admin' : 'Student';
    
    const adminTab = document.getElementById('admin-tab');
    if (appState.isAdmin) {
        adminTab.classList.remove('hidden');
    } else {
        adminTab.classList.add('hidden');
    }
    updateCallButtons();
    renderChapters();
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
    const username = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!username || !password) { alert('Please enter email and password'); return; }
    const btn = document.querySelector('#login-form .login-btn');
    btn.disabled = true; btn.textContent = 'Logging in...';
    
    try {
        // Always use the backend API for login (including admin)
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
            saveState(); showMainApp();
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
        
        // Handle specific errors
        if (error.code === 'auth/popup-closed-by-user') {
            // User closed the popup, no need to show error
            return;
        } else if (error.code === 'auth/popup-blocked') {
            // Popup was blocked, try redirect method
            alert('Popup was blocked. Redirecting to Google Sign-In...');
            await firebaseAuth.signInWithRedirect(googleProvider);
            return;
        } else if (error.code === 'auth/unauthorized-domain') {
            // Domain not authorized in Firebase Console
            alert('This domain is not authorized for Google Sign-In.\n\nPlease add this domain to Firebase Console:\nAuthentication > Settings > Authorized domains\n\nOr use Email/Password login instead.');
            return;
        } else if (error.code === 'auth/operation-not-allowed') {
            // Google Sign-In not enabled in Firebase Console
            alert('Google Sign-In is not enabled.\n\nPlease enable it in Firebase Console:\nAuthentication > Sign-in method > Google\n\nOr use Email/Password login instead.');
            return;
        }
        
        // Show error with fallback option
        const useEmailFallback = confirm('Google Sign-In failed: ' + (error.message || 'Unknown error') + '\n\nWould you like to enter your Google email manually instead?');
        if (useEmailFallback) {
            showGoogleEmailModal();
        }
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
                    saveState();
                    showMainApp();
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
                saveState();
                showMainApp();
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
    const name = document.getElementById('register-name').value.trim();
    const username = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    if (!name || !username || !password) { alert('Please fill all fields'); return; }
    const btn = document.querySelector('#register-form .login-btn');
    btn.disabled = true; btn.textContent = 'Registering...';
    try {
        const response = await fetch(API_URL + '/api/auth/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, name, platform: 'web' })
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
            saveState(); showMainApp();
        } else { alert(data.detail || 'Registration failed'); }
    } catch (e) { console.error('Register error:', e); alert('Network error. Please try again.'); }
    btn.disabled = false; btn.textContent = 'CREATE ACCOUNT';
}

function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    appState.authToken = null;
    appState.isLoggedIn = false;
    appState.isAdmin = false;
    appState.studentName = '';
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
        // Get local media stream
        var constraints = callType === 'video' 
            ? { video: true, audio: true } 
            : { video: false, audio: true };
        
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Create peer connection
        peerConnection = new RTCPeerConnection(webrtcConfig);
        
        // Add local tracks to peer connection
        localStream.getTracks().forEach(function(track) {
            peerConnection.addTrack(track, localStream);
        });
        
        // Handle incoming tracks
        peerConnection.ontrack = function(event) {
            remoteStream = event.streams[0];
            var remoteVideo = document.getElementById('remote-video');
            if (remoteVideo) remoteVideo.srcObject = remoteStream;
        };
        
        // Handle ICE candidates
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                sendICECandidate(1, event.candidate); // Send to admin
            }
        };
        
        // Create and send offer
        var offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        // Send offer to backend
        var response = await fetch(API_URL + '/api/webrtc/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({
                target_user_id: 1, // Admin user ID
                sdp: offer.sdp,
                call_type: callType
            })
        });
        
        if (response.ok) {
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
        // Get local media stream
        var constraints = callType === 'video' 
            ? { video: true, audio: true } 
            : { video: false, audio: true };
        
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Create peer connection
        peerConnection = new RTCPeerConnection(webrtcConfig);
        
        // Add local tracks to peer connection
        localStream.getTracks().forEach(function(track) {
            peerConnection.addTrack(track, localStream);
        });
        
        // Handle incoming tracks
        peerConnection.ontrack = function(event) {
            remoteStream = event.streams[0];
            var remoteVideo = document.getElementById('remote-video');
            if (remoteVideo) remoteVideo.srcObject = remoteStream;
        };
        
        // Handle ICE candidates
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                sendICECandidate(targetUserId, event.candidate);
            }
        };
        
        // Create and send offer with real SDP
        var offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        // Send real SDP offer to backend (replacing the mobile_call_request placeholder)
        var response = await fetch(API_URL + '/api/webrtc/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({
                target_user_id: targetUserId,
                sdp: offer.sdp,
                call_type: callType
            })
        });
        
        if (response.ok) {
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

// Poll for incoming calls (for users to receive calls from admin)
var incomingCallPollInterval = null;
function startIncomingCallPolling() {
    if (incomingCallPollInterval) clearInterval(incomingCallPollInterval);
    incomingCallPollInterval = setInterval(checkForIncomingCalls, 3000);
}

function stopIncomingCallPolling() {
    if (incomingCallPollInterval) {
        clearInterval(incomingCallPollInterval);
        incomingCallPollInterval = null;
    }
}

async function checkForIncomingCalls() {
    if (!appState.authToken || appState.inCall) return;
    
    try {
        var response = await fetch(API_URL + '/api/webrtc/pending-calls', {
            headers: { 'Authorization': 'Bearer ' + appState.authToken }
        });
        if (response.ok) {
            var data = await response.json();
            if (data.pending_calls && data.pending_calls.length > 0) {
                var call = data.pending_calls[0];
                showIncomingCallUI(call);
            }
        }
    } catch (e) {
        console.log('Incoming call check error:', e);
    }
}

// Show incoming call UI
function showIncomingCallUI(call) {
    // Don't show if already in a call or if modal already exists
    if (appState.inCall || document.getElementById('incoming-call-modal')) return;
    
    var modal = document.createElement('div');
    modal.id = 'incoming-call-modal';
    modal.innerHTML = 
        '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
        '<div style="font-size: 80px; margin-bottom: 20px;">' + (call.call_type === 'video' ? '📹' : '📞') + '</div>' +
        '<h2 style="color: #E94560; margin-bottom: 10px;">Incoming ' + (call.call_type === 'video' ? 'Video' : 'Voice') + ' Call</h2>' +
        '<p style="color: #fff; margin-bottom: 30px;">From: Master Admin</p>' +
        '<div style="display: flex; gap: 20px;">' +
        '<button onclick="answerIncomingCall(\'' + call.call_id + '\', \'' + call.sdp + '\', \'' + call.call_type + '\')" style="padding: 15px 40px; background: #22C55E; color: white; border: none; border-radius: 10px; font-size: 18px; cursor: pointer;">Accept</button>' +
        '<button onclick="rejectIncomingCall(\'' + call.call_id + '\')" style="padding: 15px 40px; background: #EF4444; color: white; border: none; border-radius: 10px; font-size: 18px; cursor: pointer;">Decline</button>' +
        '</div>' +
        '</div>';
    document.body.appendChild(modal);
}

// Answer incoming call
async function answerIncomingCall(callId, offerSdp, callType) {
    // Remove incoming call modal
    var modal = document.getElementById('incoming-call-modal');
    if (modal) modal.remove();
    
    currentCallUserId = 1; // Admin
    currentCallType = callType;
    
    try {
        // Get local media stream
        var constraints = callType === 'video' 
            ? { video: true, audio: true } 
            : { video: false, audio: true };
        
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Create peer connection
        peerConnection = new RTCPeerConnection(webrtcConfig);
        
        // Add local tracks
        localStream.getTracks().forEach(function(track) {
            peerConnection.addTrack(track, localStream);
        });
        
        // Handle incoming tracks
        peerConnection.ontrack = function(event) {
            remoteStream = event.streams[0];
            var remoteVideo = document.getElementById('remote-video');
            if (remoteVideo) remoteVideo.srcObject = remoteStream;
        };
        
        // Handle ICE candidates
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                sendICECandidate(1, event.candidate);
            }
        };
        
        // Set remote description (the offer)
        await peerConnection.setRemoteDescription(new RTCSessionDescription({
            type: 'offer',
            sdp: offerSdp
        }));
        
        // Create answer
        var answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        // Send answer to backend
        var response = await fetch(API_URL + '/api/webrtc/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({
                call_id: callId,
                sdp: answer.sdp
            })
        });
        
        if (response.ok) {
            appState.inCall = true;
            showCallUI(callType);
            startPollingForCallUpdates();
        } else {
            throw new Error('Failed to send answer');
        }
    } catch (e) {
        console.error('Answer call error:', e);
        alert('Failed to answer call: ' + e.message);
        cleanupCall();
    }
}

// Reject incoming call
async function rejectIncomingCall(callId) {
    var modal = document.getElementById('incoming-call-modal');
    if (modal) modal.remove();
    
    try {
        await fetch(API_URL + '/api/webrtc/end-call?target_user_id=1', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + appState.authToken }
        });
    } catch (e) {}
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
        container.innerHTML = '<div class="ai-message assistant"><div class="ai-role">Llama 3 AI Assistant</div><div class="chat-text">Hello! I am your AI assistant. Ask me any questions about NCERT Class 6 Mathematics!</div><button class="speaker-btn" id="speaker-welcome" onclick="speakText(\'Hello! I am your AI assistant. Ask me any questions about NCERT Class 6 Mathematics!\', \'speaker-welcome\')" title="Listen">🔊</button></div>';
        return;
    }
    container.innerHTML = appState.aiMessages.map(function(msg, index) {
        var speakerBtn = '';
        if (msg.role === 'assistant' && msg.content !== 'Thinking...') {
            speakerBtn = '<button class="speaker-btn" id="speaker-' + index + '" onclick="speakText(\'' + msg.content.replace(/'/g, "\\'").replace(/\n/g, ' ') + '\', \'speaker-' + index + '\')" title="Listen">🔊</button>';
        }
        return '<div class="ai-message ' + msg.role + '"><div class="ai-role">' + (msg.role === 'user' ? 'You' : 'Llama 3 AI Assistant') + '</div><div class="chat-text">' + msg.content + '</div>' + speakerBtn + '</div>';
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
        // Use backend API for AI chat
        const response = await fetch(API_URL + '/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (appState.authToken || 'guest')
            },
            body: JSON.stringify({
                message: content,
                chapter_id: appState.currentChapter ? appState.currentChapter.id : null
            })
        });
        
        // Remove loading message
        appState.aiMessages.pop();
        
        if (response.ok) {
            const data = await response.json();
            appState.aiMessages.push({ role: 'assistant', content: data.response });
        } else {
            console.error('AI API error:', response.status);
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

// Auto-connect to screen shares when admin views monitoring section
var screenShareAutoConnectInterval = null;
function startScreenShareAutoConnect() {
    if (screenShareAutoConnectInterval) clearInterval(screenShareAutoConnectInterval);
    screenShareAutoConnectInterval = setInterval(function() {
        if (appState.isAdmin) {
            fetchScreenShareOffers();
        }
    }, 3000);
}

function stopScreenShareAutoConnect() {
    if (screenShareAutoConnectInterval) {
        clearInterval(screenShareAutoConnectInterval);
        screenShareAutoConnectInterval = null;
    }
}

// Render active screen shares in the monitor section with screenshots
function renderScreenShares(screenShares) {
    var monitorDiv = document.getElementById('screen-share-monitor');
    if (!monitorDiv) return;
    
    if (screenShares.length === 0) {
        monitorDiv.innerHTML = '<div style="text-align: center; color: #888; padding: 30px;">No students currently taking exams. When students start exams with screen sharing enabled, they will appear here.</div>';
        return;
    }
    
    monitorDiv.innerHTML = screenShares.map(function(share) {
        var startTime = share.started_at ? new Date(share.started_at).toLocaleTimeString() : 'Unknown';
        var examType = share.exam_type === 'chapter_quiz' ? 'Chapter Quiz' : 'Final Exam';
        var progress = share.current_question + '/' + share.total_questions;
        
        return '<div style="background: linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,255,255,0.1)); border: 2px solid #00ff88; border-radius: 15px; padding: 20px; margin-bottom: 15px;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center;">' +
            '<div>' +
            '<div style="color: #00ff88; font-family: \'Orbitron\', monospace; font-size: 1.2em; margin-bottom: 5px;">' + (share.user_name || 'Unknown User') + '</div>' +
            '<div style="color: #888; font-size: 0.9em;">' + examType + (share.chapter_id ? ' - Chapter ' + share.chapter_id : '') + '</div>' +
            '</div>' +
            '<div style="text-align: right;">' +
            '<div style="color: #00ffff; font-size: 1.5em; font-family: \'Orbitron\', monospace;">' + progress + '</div>' +
            '<div style="color: #888; font-size: 0.8em;">Questions</div>' +
            '</div>' +
            '</div>' +
            '<div style="margin-top: 15px;">' +
            '<div id="screenshot-container-' + share.user_id + '" style="width: 100%; min-height: 200px; background: #111; border-radius: 10px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden;">' +
            '<div style="color: #888; text-align: center; padding: 20px;">Loading screenshot...<br><small>Screenshots update every 3 seconds</small></div>' +
            '</div>' +
            '<button onclick="fetchStudentScreenshot(' + share.user_id + ')" style="padding: 8px 20px; background: linear-gradient(135deg, #00ff88, #00ffff); border: none; border-radius: 20px; color: #000; font-family: Orbitron, monospace; font-weight: bold; cursor: pointer; margin-right: 10px;">Refresh Screenshot</button>' +
            '</div>' +
            '<div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">' +
            '<div style="color: #888; font-size: 0.85em;">Started: ' + startTime + '</div>' +
            '<div style="display: flex; gap: 10px;">' +
            '<span style="background: ' + (share.is_active ? '#00ff88' : '#ff4444') + '; color: #000; padding: 5px 15px; border-radius: 20px; font-size: 0.8em; font-weight: bold;">' + (share.is_active ? 'ACTIVE' : 'PAUSED') + '</span>' +
            '<button onclick="adminForceSubmit(' + share.user_id + ', \'' + (share.user_name || 'Student') + '\')" style="padding: 8px 20px; background: linear-gradient(135deg, #ff4444, #ff6666); border: none; border-radius: 20px; color: #fff; font-family: Orbitron, monospace; font-weight: bold; cursor: pointer;">AUTO SUBMIT</button>' +
            '</div>' +
            '</div>' +
            '</div>';
    }).join('');
    
    // Fetch screenshots for all active screen shares
    screenShares.forEach(function(share) {
        fetchStudentScreenshot(share.user_id);
    });
    
    // Start auto-refresh of screenshots every 5 seconds
    if (window.screenshotRefreshInterval) {
        clearInterval(window.screenshotRefreshInterval);
    }
    window.screenshotRefreshInterval = setInterval(function() {
        screenShares.forEach(function(share) {
            fetchStudentScreenshot(share.user_id);
        });
    }, 5000);
}

// Fetch and display screenshot for a specific student
async function fetchStudentScreenshot(userId) {
    var token = appState.authToken || localStorage.getItem('authToken');
    if (!token) return;
    
    try {
        var response = await fetch(API_URL + '/api/admin/screen-share/screenshot/' + userId, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
            var data = await response.json();
            var container = document.getElementById('screenshot-container-' + userId);
            if (container && data.screenshot) {
                container.innerHTML = '<img src="data:image/jpeg;base64,' + data.screenshot + '" style="width: 100%; height: auto; border-radius: 10px;" alt="Student Screen" />' +
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
        var pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' }
            ]
        });
        
        adminScreenShareConnections[offer.user_id] = pc;
        
        // Add transceiver to receive video
        pc.addTransceiver('video', { direction: 'recvonly' });
        
        pc.ontrack = function(event) {
            console.log('Received track from student:', offer.user_id, event.streams);
            var videoElement = document.getElementById('screen-video-' + offer.user_id);
            if (videoElement && event.streams[0]) {
                videoElement.srcObject = event.streams[0];
                videoElement.play().catch(function(e) { console.log('Video play error:', e); });
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
        var answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
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

// Admin chat refresh interval
var adminChatRefreshInterval = null;

// Start auto-refresh for admin chat
function startAdminChatRefresh() {
    if (adminChatRefreshInterval) clearInterval(adminChatRefreshInterval);
    // Refresh admin chat every 3 seconds if a user is selected
    adminChatRefreshInterval = setInterval(function() {
        if (selectedChatUserId) {
            loadChatHistory(selectedChatUserId);
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

// WebRTC Configuration
var webrtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
};
var peerConnection = null;
var localStream = null;
var remoteStream = null;
var currentCallUserId = null;
var currentCallType = null;

// Initialize WebRTC call
async function initWebRTCCall(userId, callType) {
    if (!appState.isAdmin) { alert('Only admin can initiate calls'); return; }
    
    currentCallUserId = userId;
    currentCallType = callType;
    
    try {
        // Get local media stream
        var constraints = callType === 'video' 
            ? { video: true, audio: true } 
            : { video: false, audio: true };
        
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Create peer connection
        peerConnection = new RTCPeerConnection(webrtcConfig);
        
        // Add local tracks to peer connection
        localStream.getTracks().forEach(function(track) {
            peerConnection.addTrack(track, localStream);
        });
        
        // Handle incoming tracks
        peerConnection.ontrack = function(event) {
            remoteStream = event.streams[0];
            var remoteVideo = document.getElementById('remote-video');
            if (remoteVideo) remoteVideo.srcObject = remoteStream;
        };
        
        // Handle ICE candidates
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                sendICECandidate(userId, event.candidate);
            }
        };
        
        // Create and send offer
        var offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        // Send offer to backend
        var response = await fetch(API_URL + '/api/webrtc/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({
                target_user_id: userId,
                sdp: offer.sdp,
                call_type: callType
            })
        });
        
        if (response.ok) {
            appState.inCall = true;
            showCallUI(callType);
            startPollingForCallUpdates();
        } else {
            throw new Error('Failed to send call offer');
        }
    } catch (e) {
        console.error('WebRTC error:', e);
        alert('Failed to start call: ' + e.message);
        cleanupCall();
    }
}

// Send ICE candidate to peer
async function sendICECandidate(userId, candidate) {
    try {
        await fetch(API_URL + '/api/webrtc/candidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + appState.authToken },
            body: JSON.stringify({
                target_user_id: userId,
                candidate: candidate.candidate,
                sdp_mid: candidate.sdpMid,
                sdp_m_line_index: candidate.sdpMLineIndex
            })
        });
    } catch (e) {
        console.error('Failed to send ICE candidate:', e);
    }
}

// Handle incoming call answer
async function handleCallAnswer(answerSdp) {
    if (peerConnection) {
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: answerSdp
            }));
        } catch (e) {
            console.error('Failed to set remote description:', e);
        }
    }
}

// Handle incoming ICE candidate
async function handleICECandidate(candidateData) {
    if (peerConnection) {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate({
                candidate: candidateData.candidate,
                sdpMid: candidateData.sdp_mid,
                sdpMLineIndex: candidateData.sdp_m_line_index
            }));
        } catch (e) {
            console.error('Failed to add ICE candidate:', e);
        }
    }
}

// Poll for call updates (answer, ICE candidates, call ended)
var callPollInterval = null;
function startPollingForCallUpdates() {
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
                        alert('Call ended by the other party');
                        markNotificationRead(notif.id);
                    }
                }
            }
        } catch (e) {
            console.error('Poll error:', e);
        }
    }, 2000);
}

async function markNotificationRead(notifId) {
    try {
        await fetch(API_URL + '/api/notifications/' + notifId + '/read', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + appState.authToken }
        });
    } catch (e) {}
}

// Show call UI
function showCallUI(callType) {
    var callModal = document.createElement('div');
    callModal.id = 'call-modal';
    callModal.innerHTML = 
        '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
        '<h2 style="color: #E94560; margin-bottom: 20px;">' + (callType === 'video' ? 'Video' : 'Voice') + ' Call in Progress</h2>' +
        (callType === 'video' ? 
            '<div style="display: flex; gap: 20px; margin-bottom: 20px;">' +
            '<div style="text-align: center;"><p style="color: #fff; margin-bottom: 10px;">You</p><video id="local-video" autoplay muted playsinline style="width: 300px; height: 225px; background: #333; border-radius: 10px;"></video></div>' +
            '<div style="text-align: center;"><p style="color: #fff; margin-bottom: 10px;">Remote</p><video id="remote-video" autoplay playsinline style="width: 300px; height: 225px; background: #333; border-radius: 10px;"></video></div>' +
            '</div>' : 
            '<div style="font-size: 100px; margin-bottom: 20px;">📞</div><p style="color: #fff; margin-bottom: 20px;">Voice call connected...</p>') +
        '<button onclick="endWebRTCCall()" style="padding: 15px 40px; background: #EF4444; color: white; border: none; border-radius: 10px; font-size: 18px; cursor: pointer;">End Call</button>' +
        '</div>';
    document.body.appendChild(callModal);
    
    // Set local video stream
    if (callType === 'video' && localStream) {
        var localVideo = document.getElementById('local-video');
        if (localVideo) localVideo.srcObject = localStream;
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

// 3D Models functions
function show3DModels(chapterId) {
    // If no chapterId provided, show all chapters' models
    if (!chapterId) {
        document.getElementById('models-content').innerHTML = `
            <h3 style="color: #00ffff; font-family: 'Orbitron', monospace; margin-bottom: 20px;">SELECT A CHAPTER TO VIEW 3D MODELS</h3>
            <div class="chapters-grid">
                ${chapters.map(chapter => `
                    <div class="chapter-card" onclick="show3DModels(${chapter.id})" style="cursor: pointer;">
                        <div class="chapter-number">${chapter.number}</div>
                        <div class="chapter-title">${chapter.title}</div>
                        <p style="color: #888; font-size: 0.9em;">${(chapter3DModels[chapter.id] || []).length} 3D Models Available</p>
                    </div>
                `).join('')}
            </div>
        `;
        return;
    }
    
    var models = chapter3DModels[chapterId] || [];
    var chapter = chapters.find(c => c.id === chapterId);
    
    document.getElementById('models-content').innerHTML = 
        '<button class="btn btn-secondary" onclick="show3DModels()" style="margin-bottom: 20px;">← Back to All Chapters</button>' +
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
    
    // Create real interactive 3D model using Three.js
    var modelContainer = document.getElementById('model-icon-display');
    modelContainer.innerHTML = '';
    modelContainer.style.cssText = 'width: 300px; height: 300px; margin: 20px auto; display: flex; align-items: center; justify-content: center;';
    
    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
        // Create Three.js scene
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(280, 280);
        renderer.setClearColor(0x000000, 0);
        modelContainer.appendChild(renderer.domElement);
        
        current3DScene = scene;
        current3DRenderer = renderer;
        
        // Add lighting
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        var pointLight = new THREE.PointLight(0xE94560, 0.5);
        pointLight.position.set(-5, -5, 5);
        scene.add(pointLight);
        
        var mesh;
        
        if (type === 'cube' || type === 'blocks' || type === 'tiles') {
            // Create a real 3D cube with colored faces
            var geometry = new THREE.BoxGeometry(2, 2, 2);
            var materials = [
                new THREE.MeshPhongMaterial({ color: 0xE94560, shininess: 100 }),
                new THREE.MeshPhongMaterial({ color: 0x0F3460, shininess: 100 }),
                new THREE.MeshPhongMaterial({ color: 0x533483, shininess: 100 }),
                new THREE.MeshPhongMaterial({ color: 0x16213E, shininess: 100 }),
                new THREE.MeshPhongMaterial({ color: 0xE94560, shininess: 100 }),
                new THREE.MeshPhongMaterial({ color: 0x0F3460, shininess: 100 })
            ];
            mesh = new THREE.Mesh(geometry, materials);
            // Add edges for better visibility
            var edges = new THREE.EdgesGeometry(geometry);
            var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            mesh.add(line);
        } else if (type === 'pyramid' || type === 'factortree') {
            // Create a real 3D pyramid (tetrahedron)
            var geometry = new THREE.ConeGeometry(1.5, 2.5, 4);
            var material = new THREE.MeshPhongMaterial({ 
                color: 0xE94560, 
                shininess: 100,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            // Add edges
            var edges = new THREE.EdgesGeometry(geometry);
            var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            mesh.add(line);
        } else if (type === 'sphere' || type === 'circles') {
            // Create a real 3D sphere
            var geometry = new THREE.SphereGeometry(1.5, 32, 32);
            var material = new THREE.MeshPhongMaterial({ 
                color: 0xE94560, 
                shininess: 100,
                specular: 0x444444
            });
            mesh = new THREE.Mesh(geometry, material);
        } else if (type === 'cylinder' || type === 'prism') {
            // Create a 3D cylinder
            var geometry = new THREE.CylinderGeometry(1, 1, 2.5, 32);
            var material = new THREE.MeshPhongMaterial({ 
                color: 0x533483, 
                shininess: 100
            });
            mesh = new THREE.Mesh(geometry, material);
            var edges = new THREE.EdgesGeometry(geometry);
            var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            mesh.add(line);
        } else if (type === 'torus' || type === 'ring') {
            // Create a 3D torus (donut)
            var geometry = new THREE.TorusGeometry(1.2, 0.5, 16, 100);
            var material = new THREE.MeshPhongMaterial({ 
                color: 0x0F3460, 
                shininess: 100
            });
            mesh = new THREE.Mesh(geometry, material);
        } else if (type === 'octahedron') {
            // Create a 3D octahedron
            var geometry = new THREE.OctahedronGeometry(1.5);
            var material = new THREE.MeshPhongMaterial({ 
                color: 0x16213E, 
                shininess: 100,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            var edges = new THREE.EdgesGeometry(geometry);
            var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            mesh.add(line);
        } else if (type === 'dodecahedron') {
            // Create a 3D dodecahedron
            var geometry = new THREE.DodecahedronGeometry(1.5);
            var material = new THREE.MeshPhongMaterial({ 
                color: 0xE94560, 
                shininess: 100,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            var edges = new THREE.EdgesGeometry(geometry);
            var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            mesh.add(line);
        } else if (type === 'icosahedron') {
            // Create a 3D icosahedron
            var geometry = new THREE.IcosahedronGeometry(1.5);
            var material = new THREE.MeshPhongMaterial({ 
                color: 0x533483, 
                shininess: 100,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            var edges = new THREE.EdgesGeometry(geometry);
            var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            mesh.add(line);
        } else {
            // Default: Create a combined shape (cube + sphere)
            var group = new THREE.Group();
            
            var cubeGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            var cubeMat = new THREE.MeshPhongMaterial({ color: 0xE94560, shininess: 100, transparent: true, opacity: 0.8 });
            var cube = new THREE.Mesh(cubeGeom, cubeMat);
            var cubeEdges = new THREE.EdgesGeometry(cubeGeom);
            var cubeLine = new THREE.LineSegments(cubeEdges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            cube.add(cubeLine);
            group.add(cube);
            
            var sphereGeom = new THREE.SphereGeometry(1.1, 32, 32);
            var sphereMat = new THREE.MeshPhongMaterial({ color: 0x0F3460, shininess: 100, transparent: true, opacity: 0.6 });
            var sphere = new THREE.Mesh(sphereGeom, sphereMat);
            group.add(sphere);
            
            mesh = group;
        }
        
        scene.add(mesh);
        camera.position.z = 5;
        
        // Mouse interaction for rotation
        var isDragging = false;
        var previousMousePosition = { x: 0, y: 0 };
        var rotationSpeed = { x: 0.005, y: 0.01 };
        
        renderer.domElement.addEventListener('mousedown', function(e) {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        renderer.domElement.addEventListener('mousemove', function(e) {
            if (isDragging) {
                var deltaMove = {
                    x: e.clientX - previousMousePosition.x,
                    y: e.clientY - previousMousePosition.y
                };
                mesh.rotation.y += deltaMove.x * 0.01;
                mesh.rotation.x += deltaMove.y * 0.01;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });
        
        renderer.domElement.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        renderer.domElement.addEventListener('mouseleave', function() {
            isDragging = false;
        });
        
        // Touch support for mobile
        renderer.domElement.addEventListener('touchstart', function(e) {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        });
        
        renderer.domElement.addEventListener('touchmove', function(e) {
            if (isDragging) {
                var deltaMove = {
                    x: e.touches[0].clientX - previousMousePosition.x,
                    y: e.touches[0].clientY - previousMousePosition.y
                };
                mesh.rotation.y += deltaMove.x * 0.01;
                mesh.rotation.x += deltaMove.y * 0.01;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });
        
        renderer.domElement.addEventListener('touchend', function() {
            isDragging = false;
        });
        
        // Animation loop
        function animate() {
            current3DAnimationId = requestAnimationFrame(animate);
            if (!isDragging) {
                mesh.rotation.x += rotationSpeed.x;
                mesh.rotation.y += rotationSpeed.y;
            }
            renderer.render(scene, camera);
        }
        animate();
        
    } else {
        // Fallback if Three.js is not available - use CSS 3D
        var shape3D = document.createElement('div');
        shape3D.className = 'shape-3d';
        shape3D.id = 'rotating-shape';
        shape3D.style.cssText = 'width: 150px; height: 150px; background: linear-gradient(135deg, #E94560, #0F3460); border-radius: 10px; animation: rotateCube 4s infinite linear; margin: 50px auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; font-weight: bold; transform-style: preserve-3d; box-shadow: 0 0 30px rgba(233,69,96,0.5);';
        shape3D.innerHTML = '<span style="font-size: 60px;">&#9632;</span>';
        modelContainer.appendChild(shape3D);
        
        if (!document.getElementById('model-animations')) {
            var style = document.createElement('style');
            style.id = 'model-animations';
            style.textContent = '@keyframes rotateCube { from { transform: rotateX(0deg) rotateY(0deg); } to { transform: rotateX(360deg) rotateY(360deg); } }';
            document.head.appendChild(style);
        }
    }
    
    document.getElementById('model-text').textContent = 'Drag to rotate (Interactive 3D Model)';
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

function showTopicDetail(name, content) {
    alert(name + '\n\n' + content);
}

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

// Override showSection
var originalShowSection = showSection;
showSection = function(section) {
    document.querySelectorAll('.content-section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    var sectionMap = { 
        'chapters': 'chapters-section', 
        'progress': 'progress-section', 
        'final-exam': 'final-exam-section', 
        'certificates': 'certificates-section',
        'certificate': 'certificates-section', 
        '3d-models': '3d-models-section',
        'chat': 'chat-section', 
        'ai-assistant': 'ai-assistant-section', 
        'admin': 'admin-section' 
    };
    var sectionId = sectionMap[section];
    if (sectionId) { document.getElementById(sectionId).classList.add('active'); }
    if (section === 'chapters') renderChapters();
    if (section === 'progress') renderProgress();
    if (section === 'final-exam') renderFinalExam();
    if (section === 'certificates' || section === 'certificate') renderCertificates();
    if (section === '3d-models') show3DModels();
    if (section === 'chat') loadChatMessages();
    if (section === 'admin') loadAdminDashboard();
    if (section === 'ai-assistant') renderAIMessages();
};

// Override renderChapterContent to add resources
var originalRenderChapterContent = renderChapterContent;
renderChapterContent = function() {
    var chapter = appState.currentChapter;
    document.querySelectorAll('.content-section').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('chapter-content-section').classList.add('active');
    
    var topicsHtml = chapter.topics.map(function(topic) {
        return '<div class="topic" onclick="showTopicDetail(\'' + topic.name.replace(/'/g, "\\'") + '\', \'' + topic.content.replace(/'/g, "\\'") + '\')"><h3>' + topic.name + '</h3><p>' + topic.content + '</p></div>';
    }).join('');
    
    document.getElementById('chapter-content').innerHTML = 
        '<button class="btn btn-secondary" onclick="backToChapters()" style="margin-bottom: 20px;">Back to Chapters</button>' +
        '<h2 class="section-title">Chapter ' + chapter.number + ': ' + chapter.title + '</h2>' +
        '<div class="chapter-content">' + topicsHtml + '</div>' +
        '<div class="resources-section"><h3 class="resources-title">Resources</h3><div class="resources-grid">' +
        '<div class="resource-btn" onclick="show3DModels(' + chapter.id + ')"><div class="resource-icon">3D</div><div class="resource-text">3D Models</div></div>' +
        '<div class="resource-btn" onclick="downloadPDF(' + chapter.id + ')"><div class="resource-icon">PDF</div><div class="resource-text">Chapter PDF</div></div>' +
        '<div class="resource-btn" onclick="openAIAssistant(' + chapter.id + ')"><div class="resource-icon">AI</div><div class="resource-text">Ask Doubt</div></div>' +
        '</div></div>' +
        '<div class="btn-group" style="margin-top: 30px;"><button class="btn btn-primary" onclick="startQuiz(' + chapter.id + ')">Take Chapter Quiz (40 Questions)</button></div>';
};

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
        
        if (isAdmin) {
            // Admin message - right side (green bubble like WhatsApp)
            return '<div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">' +
                '<div style="max-width: 70%; background: linear-gradient(135deg, #00a884, #008f72); padding: 10px 15px; border-radius: 15px 15px 0 15px; color: #fff;">' +
                '<div style="word-wrap: break-word;">' + sanitizeHTML(msg.content) + '</div>' +
                '<div style="text-align: right; font-size: 0.7em; color: rgba(255,255,255,0.7); margin-top: 5px;">' + time + '</div>' +
                '</div></div>';
        } else {
            // User message - left side (white/gray bubble)
            return '<div style="display: flex; justify-content: flex-start; margin-bottom: 10px;">' +
                '<div style="max-width: 70%; background: rgba(255,255,255,0.1); padding: 10px 15px; border-radius: 15px 15px 15px 0; color: #fff;">' +
                '<div style="word-wrap: break-word;">' + sanitizeHTML(msg.content) + '</div>' +
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
    screenMonitorDiv.innerHTML = '<h3 style="color:#E94560;margin-bottom:15px;display:flex;align-items:center;gap:10px;"><span style="width:12px;height:12px;background:#E94560;border-radius:50%;animation:pulse 1.5s infinite;"></span> Screen Sharing Monitor</h3>' +
        (examUsers.length > 0 ? 
            '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:15px;">' +
            examUsers.map(function(user) {
                return '<div style="background:rgba(0,0,0,0.3);border-radius:10px;padding:15px;border:1px solid rgba(233,69,96,0.5);">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                    '<span style="color:#fff;font-weight:bold;">' + user.name + '</span>' +
                    '<span style="background:#E94560;color:#fff;padding:3px 8px;border-radius:10px;font-size:0.75em;">LIVE</span></div>' +
                    '<div style="color:#aaa;font-size:0.85em;">Taking: ' + (user.current_exam || 'Final Exam') + '</div>' +
                    '<div style="color:#888;font-size:0.8em;margin-top:5px;">Started: ' + (user.exam_start_time ? new Date(user.exam_start_time).toLocaleTimeString() : 'Just now') + '</div>' +
                    '<button onclick="viewUserScreen(' + user.id + ')" style="margin-top:10px;width:100%;padding:8px;background:linear-gradient(135deg,#8B5CF6,#EC4899);border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:0.85em;">View Screen</button></div>';
            }).join('') + '</div>' :
            '<p style="color:#888;text-align:center;padding:20px;">No students currently taking exams. When students start exams with screen sharing enabled, they will appear here.</p>');
    
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

// View user screen during exam (screen sharing monitoring)
function viewUserScreen(userId) {
    var user = adminUsers ? adminUsers.find(function(u) { return u.id === userId; }) : null;
    var userName = user ? user.name : 'Student';
    
    var modal = document.createElement('div');
    modal.id = 'screen-view-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    
    modal.innerHTML = '<div style="width:90%;max-width:1000px;background:linear-gradient(135deg,#1A1A2E,#16213E);border-radius:15px;overflow:hidden;box-shadow:0 20px 60px rgba(233,69,96,0.3);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:linear-gradient(90deg,#E94560,#FF6B6B);">' +
            '<h3 style="margin:0;color:#fff;font-size:18px;display:flex;align-items:center;gap:10px;"><span style="width:10px;height:10px;background:#fff;border-radius:50%;animation:pulse 1.5s infinite;"></span> ' + userName + ' - Screen Share</h3>' +
            '<button onclick="closeScreenView()" style="background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:24px;cursor:pointer;padding:5px 15px;border-radius:5px;">X</button>' +
        '</div>' +
        '<div style="padding:40px;text-align:center;">' +
            '<div style="background:rgba(0,0,0,0.5);border-radius:10px;padding:60px;border:2px dashed rgba(233,69,96,0.5);">' +
                '<div style="font-size:48px;margin-bottom:20px;">🖥️</div>' +
                '<p style="color:#aaa;font-size:1.1em;margin-bottom:15px;">Screen sharing preview will appear here when the student shares their screen during the exam.</p>' +
                '<p style="color:#888;font-size:0.9em;">The student is currently taking the exam. Their screen will be visible once they enable screen sharing.</p>' +
            '</div>' +
            '<div style="margin-top:20px;display:flex;justify-content:center;gap:15px;flex-wrap:wrap;">' +
                '<button onclick="requestScreenShare(' + userId + ')" style="padding:12px 25px;background:linear-gradient(135deg,#8B5CF6,#EC4899);border:none;border-radius:25px;color:#fff;cursor:pointer;font-size:14px;">Request Screen Share</button>' +
                '<button onclick="sendExamWarning(' + userId + ')" style="padding:12px 25px;background:linear-gradient(135deg,#FF9800,#F44336);border:none;border-radius:25px;color:#fff;cursor:pointer;font-size:14px;">Send Warning</button>' +
            '</div>' +
        '</div>' +
    '</div>';
    
    document.body.appendChild(modal);
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

function sendExamWarning(userId) {
    alert('Warning sent to student: "Please ensure your screen is visible to the examiner."');
}

// Admin unlock all chapters and generate certificates for admin
function setupAdminFeatures() {
    if (appState.isAdmin) {
        // Initialize progress object if not exists
        if (!appState.progress) appState.progress = {};
        
        // Unlock all chapters for admin
        for (var i = 1; i <= 10; i++) {
            if (!appState.progress[i]) {
                appState.progress[i] = { score: 40, completed: true, unlocked: true };
            } else {
                appState.progress[i].unlocked = true;
                appState.progress[i].completed = true;
                appState.progress[i].score = 40;
            }
            // Also update chapterProgress for compatibility
            appState.chapterProgress[i] = 'completed';
            appState.chapterScores[i] = 100;
        }
        
        // Generate certificates for admin if not already present
        if (!appState.certificates) appState.certificates = [];
        
        var hasMasterCert = appState.certificates.some(function(c) { return c.type === 'master'; });
        if (!hasMasterCert) {
            // Generate all certificates for admin
            for (var j = 1; j <= 10; j++) {
                var hasChapterCert = appState.certificates.some(function(c) { return c.type === 'chapter' && c.chapterId === j; });
                if (!hasChapterCert) {
                    appState.certificates.push({
                        type: 'chapter',
                        chapterId: j,
                        score: 40,
                        date: new Date().toISOString(),
                        studentName: appState.studentName
                    });
                }
            }
            
            // Add final exam certificate
            var hasFinalCert = appState.certificates.some(function(c) { return c.type === 'final'; });
            if (!hasFinalCert) {
                appState.certificates.push({
                    type: 'final',
                    score: 100,
                    date: new Date().toISOString(),
                    studentName: appState.studentName
                });
            }
            
            // Add master certificate
            appState.certificates.push({
                type: 'master',
                date: new Date().toISOString(),
                studentName: appState.studentName
            });
        }
        
        saveState();
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

// Separate Videos and PPTs in chapter content
var originalRenderChapterContent2 = renderChapterContent;
var expandedTopics = {};
function toggleTopic(index) {
    expandedTopics[index] = !expandedTopics[index];
    renderChapterContent();
}
renderChapterContent = function() {
    var chapter = appState.currentChapter;
    document.querySelectorAll('.content-section').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('chapter-content-section').classList.add('active');
    
    var topicsHtml = chapter.topics.map(function(topic, index) {
        var isExpanded = expandedTopics[index];
        var displayContent = isExpanded ? topic.content : (topic.content.substring(0, 100) + '...');
        var expandClass = isExpanded ? 'topic-expanded' : '';
        var arrowIcon = isExpanded ? '▼' : '›';
        var tapText = isExpanded ? '<span class="tap-to-collapse">Click to collapse</span>' : '';
        return '<div class="topic ' + expandClass + '" onclick="toggleTopic(' + index + ')">' +
            '<div class="topic-header"><h3>' + topic.name + '</h3><span class="topic-arrow">' + arrowIcon + '</span></div>' +
            '<p class="topic-content">' + displayContent + '</p>' + tapText + '</div>';
    }).join('');
    
    var media = chapterMedia[chapter.id] || {};
    var mediaHtml = '<div class="media-section">';
    
    // Video Card
    if (media.videoUrl) {
        mediaHtml += '<div class="media-card" onclick="openVideo(' + chapter.id + ')">' +
            '<div class="media-card-icon">🎬</div>' +
            '<div class="media-card-title">Watch Video</div>' +
            '<div class="media-card-desc">' + (media.videoSummary || 'Video lesson for this chapter') + '</div></div>';
    } else {
        mediaHtml += '<div class="media-card" style="opacity: 0.5; cursor: not-allowed;">' +
            '<div class="media-card-icon">🎬</div>' +
            '<div class="media-card-title">Video (Coming Soon)</div>' +
            '<div class="media-card-desc">Video lesson will be available soon</div></div>';
    }
    
    // PPT Card
    if (media.pptUrl) {
        mediaHtml += '<div class="media-card" onclick="openPPT(' + chapter.id + ')">' +
            '<div class="media-card-icon">📊</div>' +
            '<div class="media-card-title">View PPT</div>' +
            '<div class="media-card-desc">' + (media.pptTitle || 'Presentation for this chapter') + '</div></div>';
    } else {
        mediaHtml += '<div class="media-card" style="opacity: 0.5; cursor: not-allowed;">' +
            '<div class="media-card-icon">📊</div>' +
            '<div class="media-card-title">PPT (Coming Soon)</div>' +
            '<div class="media-card-desc">Presentation will be available soon</div></div>';
    }
    
    // PDF Card (NCERT Textbook)
    if (media.pdfUrl) {
        mediaHtml += '<div class="media-card" onclick="openPDF(' + chapter.id + ')">' +
            '<div class="media-card-icon">📕</div>' +
            '<div class="media-card-title">View PDF</div>' +
            '<div class="media-card-desc">' + (media.pdfTitle || 'NCERT Textbook Chapter') + '</div></div>';
    } else {
        mediaHtml += '<div class="media-card" style="opacity: 0.5; cursor: not-allowed;">' +
            '<div class="media-card-icon">📕</div>' +
            '<div class="media-card-title">PDF (Coming Soon)</div>' +
            '<div class="media-card-desc">Textbook chapter will be available soon</div></div>';
    }
    
    mediaHtml += '</div>';
    
    document.getElementById('chapter-content').innerHTML = 
        '<button class="btn btn-secondary" onclick="backToChapters()" style="margin-bottom: 20px;">Back to Chapters</button>' +
        '<h2 class="section-title">Chapter ' + chapter.number + ': ' + chapter.title + '</h2>' +
        '<div class="chapter-content">' + topicsHtml + '</div>' +
        mediaHtml +
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

// Load theme on startup
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
});

console.log('GANITA PRAKASH Desktop App - All features loaded with Premium 2026 UI!');

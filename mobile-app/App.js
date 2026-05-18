import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Platform,
  Linking,
  BackHandler,
  Vibration,
  AppState,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { WebView } from 'react-native-webview';
import * as Speech from 'expo-speech';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { captureRef } from 'react-native-view-shot';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import * as ImagePicker from 'expo-image-picker';
const WHITEBOARD_HTML = require('./whiteboardHtml');
const { buildFundamentalsHtml } = require('./fundamentalsHtml');
const { buildFormulaVideosHtml } = require('./formulaVideosHtml');
const { buildCallHtml } = require('./callHtml');

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configure Google Sign-In with Firebase
// IMPORTANT: Replace this webClientId with your own from Firebase Console
// Go to: Firebase Console > Project Settings > Your Android App > Web client ID
GoogleSignin.configure({
  webClientId: '624055621679-3rf426rrdrm0cdn5dpjftjg0it11pfsk.apps.googleusercontent.com',
  offlineAccess: true,
});

// Claude API Key for AI Assistant - Set via environment variable or backend
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'YOUR_API_KEY_HERE';

// Real 3D Model HTML generator using Three.js
const generate3DModelHTML = (modelType, modelName) => {
  const shapes = {
    'spiral': `
      const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
      const material = new THREE.MeshPhongMaterial({ color: 0x8B5CF6, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'fibonacci': `
      const points = [];
      for (let i = 0; i < 100; i++) {
        const angle = i * 0.1;
        const radius = 0.1 * Math.sqrt(i);
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, i * 0.02));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
      const material = new THREE.MeshPhongMaterial({ color: 0xF59E0B, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'cube': `
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const material = new THREE.MeshPhongMaterial({ color: 0x14B8A6, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
      scene.add(line);
    `,
    'pyramid': `
      const geometry = new THREE.ConeGeometry(1, 1.5, 4);
      const material = new THREE.MeshPhongMaterial({ color: 0xEF4444, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'grid': `
      for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
          const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
          const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff, shininess: 100 });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x * 0.5, y * 0.5, 0);
          scene.add(mesh);
        }
      }
    `,
    'sphere': `
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshPhongMaterial({ color: 0x8B5CF6, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'cylinder': `
      const geometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
      const material = new THREE.MeshPhongMaterial({ color: 0x14B8A6, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'torus': `
      const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
      const material = new THREE.MeshPhongMaterial({ color: 0xF59E0B, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'dodecahedron': `
      const geometry = new THREE.DodecahedronGeometry(1);
      const material = new THREE.MeshPhongMaterial({ color: 0xEF4444, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'icosahedron': `
      const geometry = new THREE.IcosahedronGeometry(1);
      const material = new THREE.MeshPhongMaterial({ color: 0x8B5CF6, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'octahedron': `
      const geometry = new THREE.OctahedronGeometry(1);
      const material = new THREE.MeshPhongMaterial({ color: 0x14B8A6, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'tetrahedron': `
      const geometry = new THREE.TetrahedronGeometry(1);
      const material = new THREE.MeshPhongMaterial({ color: 0xF59E0B, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    `,
    'pie': `
      const slices = 8;
      for (let i = 0; i < slices; i++) {
        const geometry = new THREE.CylinderGeometry(1, 1, 0.3, 32, 1, false, i * Math.PI * 2 / slices, Math.PI * 2 / slices - 0.05);
        const material = new THREE.MeshPhongMaterial({ color: i % 2 === 0 ? 0x8B5CF6 : 0x14B8A6, shininess: 100 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI / 2;
        scene.add(mesh);
      }
    `,
    'protractor': `
      const geometry = new THREE.CircleGeometry(1.5, 32, 0, Math.PI);
      const material = new THREE.MeshPhongMaterial({ color: 0xF59E0B, side: THREE.DoubleSide, shininess: 100 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      for (let i = 0; i <= 180; i += 10) {
        const angle = i * Math.PI / 180;
        const lineGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0.01),
          new THREE.Vector3(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0.01)
        ]);
        const line = new THREE.Line(lineGeom, new THREE.LineBasicMaterial({ color: 0x000000 }));
        scene.add(line);
      }
    `,
    'symmetry': `
      const geometry = new THREE.BoxGeometry(0.8, 1.5, 0.3);
      const material = new THREE.MeshPhongMaterial({ color: 0x8B5CF6, shininess: 100 });
      const mesh1 = new THREE.Mesh(geometry, material);
      mesh1.position.x = -0.5;
      scene.add(mesh1);
      const mesh2 = new THREE.Mesh(geometry, material.clone());
      mesh2.material.color.setHex(0x14B8A6);
      mesh2.position.x = 0.5;
      scene.add(mesh2);
      const planeGeom = new THREE.PlaneGeometry(0.02, 2);
      const planeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(planeGeom, planeMat);
      scene.add(plane);
    `,
  };

  const shapeCode = shapes[modelType] || shapes['cube'];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <style>
        body { margin: 0; overflow: hidden; background: #1A1A2E; }
        canvas { display: block; }
        #info { position: absolute; bottom: 10px; left: 0; right: 0; text-align: center; color: #888; font-family: Arial; font-size: 12px; }
      </style>
    </head>
    <body>
      <div id="info">Drag to rotate | Pinch to zoom</div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      <script>
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1A1A2E);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 4;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-5, -5, 5);
        scene.add(pointLight);
        
        // Add 3D model
        ${shapeCode}
        
        // Mouse/touch controls
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let rotationSpeed = { x: 0.005, y: 0.005 };
        
        document.addEventListener('mousedown', () => isDragging = true);
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('mousemove', (e) => {
          if (isDragging) {
            scene.rotation.y += (e.clientX - previousMousePosition.x) * rotationSpeed.x;
            scene.rotation.x += (e.clientY - previousMousePosition.y) * rotationSpeed.y;
          }
          previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        document.addEventListener('touchstart', (e) => {
          isDragging = true;
          previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        });
        document.addEventListener('touchend', () => isDragging = false);
        document.addEventListener('touchmove', (e) => {
          if (isDragging && e.touches.length === 1) {
            scene.rotation.y += (e.touches[0].clientX - previousMousePosition.x) * rotationSpeed.x;
            scene.rotation.x += (e.touches[0].clientY - previousMousePosition.y) * rotationSpeed.y;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        });
        
        // Auto-rotate
        function animate() {
          requestAnimationFrame(animate);
          if (!isDragging) {
            scene.rotation.y += 0.005;
          }
          renderer.render(scene, camera);
        }
        animate();
        
        window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
      </script>
    </body>
    </html>
  `;
};

const API_URL = "https://app-lmanxcts.fly.dev";
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Admin email for Google OAuth
const ADMIN_EMAIL = "admin@ganitaprakash.com";

// Indian Festival Calendar 2026 - Complete Festival List
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
    { date: "04-18", name: "Akshaya Tritiya", wish: "Happy Akshaya Tritiya! May endless prosperity and knowledge be yours!", emoji: "🪙", color: "#FFD700" },
    { date: "04-19", name: "Akshaya Tritiya", wish: "Happy Akshaya Tritiya! May endless prosperity and knowledge be yours!", emoji: "🪙", color: "#FFD700" },
    { date: "04-20", name: "Akshaya Tritiya", wish: "Happy Akshaya Tritiya! May endless prosperity and knowledge be yours!", emoji: "🪙", color: "#FFD700" },
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

const checkHolidayWish = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = month + '-' + day;
    const festival = indianFestivals2026.find(f => f.date === dateStr);
    if (festival) {
        return { isHoliday: true, name: festival.name, wish: festival.wish, emoji: festival.emoji, color: festival.color };
    }
    return { isHoliday: false, name: '', wish: '', emoji: '', color: '' };
};

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

// Chapter Media (Videos and PPTs from NotebookLM)
const chapterMedia = {
    1: { title: "Patterns in numbers", videoUrl: "https://drive.google.com/file/d/1G-gWjUd8hrmxyV-meLn6igquy5zTqx-i/preview", videoSummary: "Learn about number patterns and sequences.", pptUrl: "https://drive.google.com/file/d/1WbHMprNLt5JMQo0vVaC7_P7sTrR9Sxcd/preview", pptTitle: "The Hidden Architecture of Patterns", tbUrl: "https://drive.google.com/file/d/1MdSzsXsFNUjYw8cxTiBFd7-T6qvH40Sp/preview", tbTitle: "Chapter 1 - Maths T.B." },
    2: { title: "Lines and Angles", videoUrl: "https://drive.google.com/file/d/10NfjD3znlbJbcKo50R9AD5vLNuLCOB5H/preview", videoSummary: "Understanding lines, rays, and angles.", pptUrl: "https://drive.google.com/file/d/1fCIki-yVVW33e5_yQabafq8Sn7-Ue5Eu/preview", pptTitle: "From Point to Degree", tbUrl: "https://drive.google.com/file/d/1P7GyBa-N0d5fXL0iMaWZriEVxsHf4ISG/preview", tbTitle: "Chapter 2 - Maths T.B." },
    3: { title: "Number Play", videoUrl: "https://drive.google.com/file/d/1voVejm6eO6BtXm9AMIfLCPikVwGnHU8i/preview", videoSummary: "Explore number puzzles and patterns.", pptUrl: "https://drive.google.com/file/d/1KgJx2nQdc9t-xHsBjYzt11JgFzyeGQmm/preview", pptTitle: "The Secret Life of Numbers", tbUrl: "https://drive.google.com/file/d/145VeF9E3B3XbiAS5XGwNoGRNiCY1Kkxn/preview", tbTitle: "Chapter 3 - Maths T.B." },
    4: { title: "Data Handling", videoUrl: "https://drive.google.com/file/d/1uWy_U2NrHjx1Riv0Z2NIANPj5XkMxmYD/preview", videoSummary: "Learn to collect and present data.", pptUrl: "https://drive.google.com/file/d/1vAHyCGcFtcdjTIzvasaCvOGYMblfujGg/preview", pptTitle: "Data Structure Visualize Integrity", tbUrl: "https://drive.google.com/file/d/1h9k3rGFz8sXidIitfspCmQ6g0pCzZKCY/preview", tbTitle: "Chapter 4 - Maths T.B." },
    5: { title: "Prime Time", videoUrl: "https://drive.google.com/file/d/1CJTbvE5vTVPJiFvt-_l1cv5mHr5g7JD2/preview", videoSummary: "Discover prime numbers and factors.", pptUrl: "https://drive.google.com/file/d/1-94wWynj-KJN4uU-1DzjSGtLPKO3Y32m/preview", pptTitle: "Prime Time A Game of Numbers", tbUrl: "https://drive.google.com/file/d/1OHpaiu9dF71fK4bRp0BO7ok8_QKIq2MJ/preview", tbTitle: "Chapter 5 - Maths T.B." },
    6: { title: "Perimeter and Area", videoUrl: "https://drive.google.com/file/d/1rAjBngeOMaEiZ_tE4OM8Okviyqhbxkpo/preview", videoSummary: "Calculate perimeter and area.", pptUrl: "https://drive.google.com/file/d/11z7anMHhrCoG2309wuKuYhMXADdKlxbj/preview", pptTitle: "The Architect", tbUrl: "https://drive.google.com/file/d/1-XCGMLfG-e05qa2Pfvd8q-WxRUxtgIRG/preview", tbTitle: "Chapter 6 - Maths T.B." },
    7: { title: "Fractions", videoUrl: "https://drive.google.com/file/d/1HLz1i1ZzddZdnpsoyv7Zhoot_P80oaYm/preview", videoSummary: "Understanding fractions.", pptUrl: "https://drive.google.com/file/d/1ll8jPIypxn1Z_ISDHHSNxoMFQ0BqBodA/preview", pptTitle: "The Language of Parts", tbUrl: "https://drive.google.com/file/d/13kc5mx6p3jWThUIHKEoRYoYRkNkvnHCV/preview", tbTitle: "Chapter 7 - Maths T.B." },
    8: { title: "Playing with Constructions", videoUrl: "https://drive.google.com/file/d/1YuU0Cmx4CoeL2IgM6dsjS1zBCXoNG8cQ/preview", videoSummary: "Geometric constructions.", pptUrl: "https://drive.google.com/file/d/18oH6_9fkoIS2yCZ28qBTyGSW4-TkJlL_/preview", pptTitle: "The Geometer", tbUrl: "https://drive.google.com/file/d/1agsSZgajY4NPMyaWcFnYZ9slQpvfhb5Z/preview", tbTitle: "Chapter 8 - Maths T.B." },
    9: { title: "Symmetry", videoUrl: "https://drive.google.com/file/d/14X50UAcCKYxgTmTxFxXtwUI74lK1YLOh/preview", videoSummary: "Line and rotational symmetry.", pptUrl: "https://drive.google.com/file/d/1YDvhdUNJ3nmUJilCex2uqIcsQ3-I0cnT/preview", pptTitle: "The Universal Blueprint of Symmetry", tbUrl: "https://drive.google.com/file/d/1-PWg2U1ZOkU-jXUIQ3W5f0ClNtYGWWTU/preview", tbTitle: "Chapter 9 - Maths T.B." },
    10: { title: "The Other Side of Zero", videoUrl: "https://drive.google.com/file/d/1FN9nkTnWCOTYF6El54AEtWtd-NKsUiBD/preview", videoSummary: "Introduction to integers.", pptUrl: "https://drive.google.com/file/d/18dQvLG_a1EOM5uz3JZKehQ-yOgtkzsJD/preview", pptTitle: "The Other Side of Zero", tbUrl: "https://drive.google.com/file/d/1pJf73SW7rhNGsCSMKGy6gnypRGI41L65/preview", tbTitle: "Chapter 10 - Maths T.B." },
};

// Chapter Media for Class 7 (NCERT Class 7 Mathematics)
const chapterMedia7 = {
    1: { title: "Large Numbers Around Us", pptUrl: "https://drive.google.com/file/d/1PnUzI9fqvDRy8FKpOmAA9EDaUfhuf4Z-/preview", pptTitle: "Large Numbers Around Us PPT", videoUrl: "https://drive.google.com/file/d/1X7QzHm27NN-6nBobfxXZa1Nm4G6CQcZd/preview", videoSummary: "Learn about large numbers and place value.", tbUrl: "https://drive.google.com/file/d/1x-pA5k71rU-2r8b2Jt3ItcKY3h4KJjKe/preview", tbTitle: "Chapter 1 - Maths T.B. (Class 7)" },
    2: { title: "Arithmetic Expressions", pptUrl: "https://drive.google.com/file/d/1xvTFAdLyOyDoAo01nbWieKU0R2qdM7_8/preview", pptTitle: "Arithmetic Expressions PPT", videoUrl: "https://drive.google.com/file/d/1sK1GMp-_N6Go9Q1vZgQ9V3yOxBY6cpsz/preview", videoSummary: "Understanding arithmetic expressions and operations.", tbUrl: "https://drive.google.com/file/d/1AhOQJqrQbqhC2UTbxV7vQWhWWeBR-OvN/preview", tbTitle: "Chapter 2 - Maths T.B. (Class 7)" },
    3: { title: "A Peek Beyond the Point", pptUrl: "https://drive.google.com/file/d/1-P9rU0YORr6i8TMbMZ-EP5Z8DSjitDsA/preview", pptTitle: "A Peek Beyond the Point PPT", videoUrl: "https://drive.google.com/file/d/1ZAMjdzhld2m1at4RBIF2fxEVAoiQS4Yg/preview", videoSummary: "Explore decimals and their applications.", tbUrl: "https://drive.google.com/file/d/1IC1e1lS2m_VEZymRFPidj976pqywcK5f/preview", tbTitle: "Chapter 3 - Maths T.B. (Class 7)" },
    4: { title: "Expressions Using Letter-Numbers", pptUrl: "https://drive.google.com/file/d/15h1y4eUr9rAcxmik2GCvohoEsdZkJQ7m/preview", pptTitle: "Expressions Using Letter-Numbers PPT", videoUrl: "https://drive.google.com/file/d/1JpHN1xoAfCTAxCFZFsw8G1xnTgbo_IAd/preview", videoSummary: "Learn algebraic expressions with variables.", tbUrl: "https://drive.google.com/file/d/1gRtW2dURYE06R0hCLWsLR7jUCLo2CxC6/preview", tbTitle: "Chapter 4 - Maths T.B. (Class 7)" },
    5: { title: "Parallel and Intersecting Lines", pptUrl: "https://drive.google.com/file/d/1gCrQ0eCdReQJBkO_4th0bHMF06pThPNM/preview", pptTitle: "Parallel and Intersecting Lines PPT", videoUrl: "https://drive.google.com/file/d/1QoMI50p2Up32KlQE2_Um4EiAZeurIGXf/preview", videoSummary: "Understanding parallel and intersecting lines.", tbUrl: "https://drive.google.com/file/d/1Ea6oZ7Datt3f7dRJHlCRTGjhsUFcD6bs/preview", tbTitle: "Chapter 5 - Maths T.B. (Class 7)" },
    6: { title: "Number Play", pptUrl: "https://drive.google.com/file/d/1zHAnSrervSBRu30HrHIzhJYi39U1xB6p/preview", pptTitle: "Number Play PPT", videoUrl: "https://drive.google.com/file/d/1-LBpIVFxvAju1VnaSG4jzQpilKc4ZgVr/preview", videoSummary: "Explore number patterns and games.", tbUrl: "https://drive.google.com/file/d/1_YAfGFbiGsn5ySmMwd30DfVDToAriMdC/preview", tbTitle: "Chapter 6 - Maths T.B. (Class 7)" },
    7: { title: "A Tale of Three Intersecting Lines", pptUrl: "https://drive.google.com/file/d/1DDn0YB9PftrWhIKOndfyCl81uEalfeLy/preview", pptTitle: "A Tale of Three Intersecting Lines PPT", videoUrl: "https://drive.google.com/file/d/1g7okGSNzyKScQ_DU9-4HnqV28GTUejhp/preview", videoSummary: "Learn about triangles and their properties.", tbUrl: "https://drive.google.com/file/d/1-ZA9wYIyeMCNaNDuTgcdwOH0dPnPoomL/preview", tbTitle: "Chapter 7 - Maths T.B. (Class 7)" },
    8: { title: "Working with Fractions", pptUrl: "https://drive.google.com/file/d/16SRmBSTFrVCPTs2F-PDr7L2CbuIXIULa/preview", pptTitle: "Working with Fractions PPT", videoUrl: "https://drive.google.com/file/d/1155B64YX5fCyWXUS-9tacPeRu8h_YY_h/preview", videoSummary: "Master fraction operations and applications.", tbUrl: "https://drive.google.com/file/d/137oZEzZXej7N1WE9_i9_vK22annvRmVB/preview", tbTitle: "Chapter 8 - Maths T.B. (Class 7)" },
    9: { title: "Geometric Twins", pptUrl: "https://drive.google.com/file/d/1Kyc1Za_FUjh7r88TH_iXRBSWM6y3fQGo/preview", pptTitle: "Geometric Twins PPT", videoUrl: "https://drive.google.com/file/d/1ecFget9f37Byi6ClXJDO7gcpC-IRZ_xp/preview", videoSummary: "Explore congruence and similarity.", tbUrl: "https://drive.google.com/file/d/1JFUx8oZejHebk124wAaRJJFVpVilCgGk/preview", tbTitle: "Chapter 9 - Maths T.B. (Class 7)" },
    10: { title: "Operations with Integers", pptUrl: "https://drive.google.com/file/d/1BEiyNA3iMZ-b_AAq_ZyRO6lBbFxU8YP3/preview", pptTitle: "Operations with Integers PPT", videoUrl: "https://drive.google.com/file/d/1Nk5SQv57L0a2zyKKsxLWkwzXDuCa5gwq/preview", videoSummary: "Learn integer operations and number line.", tbUrl: "https://drive.google.com/file/d/1T6QtIeIDmA1hsucVwUgQ5lksSwHqOVtJ/preview", tbTitle: "Chapter 10 - Maths T.B. (Class 7)" },
    11: { title: "Finding Common Ground", pptUrl: "https://drive.google.com/file/d/1TFSgekqFpsW8VqrHNkfnr6-gVukk2ZkG/preview", pptTitle: "Finding Common Ground PPT", videoUrl: "https://drive.google.com/file/d/1yaWE9V03HIbXuthX0vd63mpiXSnv8k-j/preview", videoSummary: "Discover LCM and HCF concepts.", tbUrl: "https://drive.google.com/file/d/1F3PMDh-BmYJfM3ztVr0BNrraIgzooJiP/preview", tbTitle: "Chapter 11 - Maths T.B. (Class 7)" },
    12: { title: "Another Peek Beyond the Point", pptUrl: "https://drive.google.com/file/d/1T-9lSIMekwNm0j0XJdIr_dnxwolf8hXB/preview", pptTitle: "Another Peek Beyond the Point PPT", videoUrl: "https://drive.google.com/file/d/1jzYmHtHZMdp4de_nV1c8Xe9u960fi7ZD/preview", videoSummary: "Advanced decimal operations and conversions.", tbUrl: "https://drive.google.com/file/d/17lA6-oyJBKqFoZ0DKlsrwHVYepGMNYRi/preview", tbTitle: "Chapter 12 - Maths T.B. (Class 7)" },
    13: { title: "Connecting the Dots", pptUrl: "https://drive.google.com/file/d/1h4s3Zs3czMcGU7oWWJaBJYY7cxKeO2VX/preview", pptTitle: "Connecting the Dots PPT", videoUrl: "https://drive.google.com/file/d/1ASQposMDvgLpnZrImpfOHdX4SHJ18JOs/preview", videoSummary: "Learn about coordinates and graphs.", tbUrl: "https://drive.google.com/file/d/1KBclaRaGhQBMdMWnuGftVrk8LyeZ0wF8/preview", tbTitle: "Chapter 13 - Maths T.B. (Class 7)" },
    14: { title: "Constructions and Tilings", pptUrl: "https://drive.google.com/file/d/1abaNUbx15SRQB57eDu9wm-L_G8gV9Vzm/preview", pptTitle: "Constructions and Tilings PPT", videoUrl: "https://drive.google.com/file/d/17bAwK8jjRvDLZ5IJAOgWuz2v-C6jdAJS/preview", videoSummary: "Master geometric constructions and tessellations.", tbUrl: "https://drive.google.com/file/d/1NQNn6WqdIWekahpNJ5nCTs3RR30eaOZU/preview", tbTitle: "Chapter 14 - Maths T.B. (Class 7)" },
    15: { title: "Finding the Unknown", pptUrl: "https://drive.google.com/file/d/1Z71FNDGqoCe9RokyCkR31N8BS26cp6zm/preview", pptTitle: "Finding the Unknown PPT", videoUrl: "https://drive.google.com/file/d/1XhwisqNFJriBAo40l0tJ7kkdEDd91V1i/preview", videoSummary: "Solve equations and find unknown values.", tbUrl: "https://drive.google.com/file/d/17myOn9QW3-AmvJR6MGmB8TmjL7XVObdW/preview", tbTitle: "Chapter 15 - Maths T.B. (Class 7)" },
};

// Module-level current class ref; updated by component useEffect on selectedClass change
let _currentClass = '6';
const setCurrentClassRef = (c) => { _currentClass = String(c); };
const getCurrentMedia = (chapterId) => (_currentClass === '7' ? chapterMedia7 : chapterMedia)[chapterId];

// PDF Viewer HTML generator using PDF.js for inbuilt viewing
const generatePDFViewerHTML = (base64Data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #1A1A2E; font-family: Arial, sans-serif; }
        #viewer { width: 100%; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 10px; }
        .page { background: white; margin: 10px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.3); max-width: 100%; }
        #loading { color: #fff; text-align: center; padding: 50px; font-size: 18px; }
        #controls { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(139,92,246,0.9); padding: 10px 20px; border-radius: 25px; display: flex; gap: 15px; z-index: 100; }
        .ctrl-btn { background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 5px 10px; }
        #pageInfo { color: white; font-size: 14px; display: flex; align-items: center; }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    </head>
    <body>
      <div id="viewer">
        <div id="loading">Loading PDF...</div>
      </div>
      <div id="controls">
        <button class="ctrl-btn" onclick="prevPage()">◀</button>
        <span id="pageInfo">1 / 1</span>
        <button class="ctrl-btn" onclick="nextPage()">▶</button>
        <button class="ctrl-btn" onclick="zoomOut()">−</button>
        <button class="ctrl-btn" onclick="zoomIn()">+</button>
      </div>
      <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        let pdfDoc = null;
        let currentPage = 1;
        let scale = 1.0;
        const viewer = document.getElementById('viewer');
        
        async function loadPDF() {
          try {
            const base64 = '${base64Data}';
            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            pdfDoc = await pdfjsLib.getDocument({ data: bytes }).promise;
            document.getElementById('loading').style.display = 'none';
            renderAllPages();
          } catch (error) {
            document.getElementById('loading').innerHTML = 'Error loading PDF: ' + error.message;
          }
        }
        
        async function renderAllPages() {
          viewer.innerHTML = '';
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: scale * 1.5 });
            const canvas = document.createElement('canvas');
            canvas.className = 'page';
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            viewer.appendChild(canvas);
            
            await page.render({
              canvasContext: canvas.getContext('2d'),
              viewport: viewport
            }).promise;
          }
          document.getElementById('pageInfo').textContent = pdfDoc.numPages + ' pages';
        }
        
        function zoomIn() { scale = Math.min(scale + 0.25, 3); renderAllPages(); }
        function zoomOut() { scale = Math.max(scale - 0.25, 0.5); renderAllPages(); }
        function prevPage() { window.scrollBy(0, -window.innerHeight); }
        function nextPage() { window.scrollBy(0, window.innerHeight); }
        
        loadPDF();
      </script>
    </body>
    </html>
  `;
};

// Video Player HTML generator for inbuilt video viewing
// YouTube-style video player exactly like the screenshot
const generateVideoPlayerHTML = (base64Data, title) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { 
          width: 100%; 
          height: 100%; 
          background: #000; 
          overflow: hidden;
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .video-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #000;
          position: relative;
        }
        .video-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          position: relative;
        }
        video {
          width: 100%;
          height: 100%;
          max-height: 100%;
          object-fit: contain;
          background: #000;
        }
        /* Hide default controls - we use custom */
        video::-webkit-media-controls { display: none !important; }
        video::-webkit-media-controls-enclosure { display: none !important; }
        
        #loading {
          color: #fff;
          text-align: center;
          font-size: 18px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* YouTube-style centered play button */
        .play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70px;
          height: 70px;
          background: rgba(0,0,0,0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 15;
          border: 3px solid rgba(255,255,255,0.8);
        }
        .play-btn svg {
          width: 30px;
          height: 30px;
          fill: #fff;
          margin-left: 4px;
        }
        .play-btn.hidden { display: none; }
        
        /* YouTube-style bottom controls */
        .controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
          padding: 10px 0 0 0;
          z-index: 10;
        }
        
        /* Red progress bar like YouTube */
        .progress-container {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          position: relative;
        }
        .progress-bar {
          height: 100%;
          background: #ff0000;
          width: 0%;
          position: relative;
        }
        .progress-dot {
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .progress-container:hover .progress-dot { opacity: 1; }
        
        /* Control buttons row */
        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
        }
        .left-controls, .right-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .ctrl-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ctrl-btn svg {
          width: 24px;
          height: 24px;
          fill: #fff;
        }
        .time-display {
          color: #fff;
          font-size: 14px;
          font-weight: 400;
        }
      </style>
    </head>
    <body>
      <div class="video-wrapper" onclick="togglePlay(event)">
        <div class="video-container">
          <div id="loading">
            <div class="loading-spinner"></div>
            Loading video...
          </div>
          <video id="video" playsinline webkit-playsinline style="display:none;"></video>
          <div id="playBtn" class="play-btn hidden">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        
        <!-- YouTube-style controls -->
        <div class="controls" id="controls" style="display:none;" onclick="event.stopPropagation()">
          <div class="progress-container" id="progressContainer">
            <div class="progress-bar" id="progressBar">
              <div class="progress-dot"></div>
            </div>
          </div>
          <div class="controls-row">
            <div class="left-controls">
              <button class="ctrl-btn" id="playPauseBtn" onclick="togglePlayBtn()">
                <svg id="playIcon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <svg id="pauseIcon" viewBox="0 0 24 24" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <span class="time-display"><span id="currentTime">0:00</span> / <span id="duration">0:00</span></span>
            </div>
            <div class="right-controls">
              <button class="ctrl-btn" id="muteBtn" onclick="toggleMute()">
                <svg id="volumeIcon" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                <svg id="muteIcon" viewBox="0 0 24 24" style="display:none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
              </button>
              <button class="ctrl-btn" onclick="toggleFullscreen()">
                <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              </button>
              <button class="ctrl-btn">
                <svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        const video = document.getElementById('video');
        const loading = document.getElementById('loading');
        const playBtn = document.getElementById('playBtn');
        const controls = document.getElementById('controls');
        const progressBar = document.getElementById('progressBar');
        const progressContainer = document.getElementById('progressContainer');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        const volumeIcon = document.getElementById('volumeIcon');
        const muteIcon = document.getElementById('muteIcon');
        
        function formatTime(seconds) {
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }
        
        function togglePlay(e) {
          if (e.target.closest('.controls')) return;
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
        
        function togglePlayBtn() {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
        
        function toggleMute() {
          video.muted = !video.muted;
          volumeIcon.style.display = video.muted ? 'none' : 'block';
          muteIcon.style.display = video.muted ? 'block' : 'none';
        }
        
        function toggleFullscreen() {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
        }
        
        video.addEventListener('play', function() {
          playBtn.classList.add('hidden');
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
        });
        
        video.addEventListener('pause', function() {
          playBtn.classList.remove('hidden');
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        });
        
        video.addEventListener('timeupdate', function() {
          const percent = (video.currentTime / video.duration) * 100;
          progressBar.style.width = percent + '%';
          currentTimeEl.textContent = formatTime(video.currentTime);
        });
        
        video.addEventListener('loadedmetadata', function() {
          durationEl.textContent = formatTime(video.duration);
        });
        
        progressContainer.addEventListener('click', function(e) {
          const rect = progressContainer.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          video.currentTime = percent * video.duration;
        });
        
        try {
          video.src = 'data:video/mp4;base64,${base64Data}';
          
          video.onloadeddata = function() {
            loading.style.display = 'none';
            video.style.display = 'block';
            controls.style.display = 'block';
            playBtn.classList.remove('hidden');
          };
          
          video.onerror = function() {
            loading.innerHTML = '<div style="color: #ff6b6b;">Error loading video</div>';
          };
        } catch (error) {
          loading.innerHTML = '<div style="color: #ff6b6b;">Error: ' + error.message + '</div>';
        }
      </script>
    </body>
    </html>
  `;
};

// Global state for PDF viewer (will be set by App component)
let globalSetShowPdfViewer = null;
let globalSetPdfBase64 = null;
let globalSetPdfTitle = null;
let globalSetPdfUrl = null;

// Helper function to open PDF files - INBUILT VIEWER
const openPDF = async (chapterId, title, setShowPdfViewer, setPdfBase64, setPdfTitle, setPdfUrl) => {
  try {
    // For Class 6: chapters 1-10; for Class 7: chapters 1-15
    const maxChapter = _currentClass === '7' ? 15 : 10;
    if (chapterId < 1 || chapterId > maxChapter) {
      Alert.alert('Coming Soon', 'PPT for this chapter will be available soon!');
      return;
    }
    
    // Check if using Google Drive URL
    const media = getCurrentMedia(chapterId);
    if (media && media.pptUrl && media.pptUrl.includes('drive.google.com')) {
      // Use Google Drive URL directly in WebView
      if (setShowPdfViewer && setPdfTitle && setPdfUrl) {
        setPdfUrl(media.pptUrl);
        setPdfTitle(title || `Chapter ${chapterId} PPT`);
        setShowPdfViewer(true);
      } else if (globalSetShowPdfViewer && globalSetPdfTitle && globalSetPdfUrl) {
        globalSetPdfUrl(media.pptUrl);
        globalSetPdfTitle(title || `Chapter ${chapterId} PPT`);
        globalSetShowPdfViewer(true);
      }
      return;
    }
    
    // Fallback to local PDF files
    // Show loading indicator
    Alert.alert('Loading', 'Opening PDF...', [], { cancelable: false });
    
    // Try to load the PDF asset
    const pdfAssets = {
      1: require('./assets/ppts/chapter1_ppt.pdf'),
      2: require('./assets/ppts/chapter2_ppt.pdf'),
      3: require('./assets/ppts/chapter3_ppt.pdf'),
      4: require('./assets/ppts/chapter4_ppt.pdf'),
      5: require('./assets/ppts/chapter5_ppt.pdf'),
      6: require('./assets/ppts/chapter6_ppt.pdf'),
      7: require('./assets/ppts/chapter7_ppt.pdf'),
      8: require('./assets/ppts/chapter8_ppt.pdf'),
      9: require('./assets/ppts/chapter9_ppt.pdf'),
      10: require('./assets/ppts/chapter10_ppt.pdf'),
    };
    
    const asset = Asset.fromModule(pdfAssets[chapterId]);
    await asset.downloadAsync();
    
    const sourceUri = asset.localUri || asset.uri;
    const destUri = FileSystem.documentDirectory + `chapter${chapterId}.pdf`;
    
    // Always copy fresh to avoid corruption
    try {
      await FileSystem.deleteAsync(destUri, { idempotent: true });
    } catch (e) {}
    await FileSystem.copyAsync({ from: sourceUri, to: destUri });
    
    // Read PDF as base64 for inbuilt viewer
    const base64 = await FileSystem.readAsStringAsync(destUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Show inbuilt PDF viewer
    if (setShowPdfViewer && setPdfBase64 && setPdfTitle) {
      setPdfBase64(base64);
      setPdfTitle(title || `Chapter ${chapterId} PPT`);
      setShowPdfViewer(true);
    } else if (globalSetShowPdfViewer && globalSetPdfBase64 && globalSetPdfTitle) {
      globalSetPdfBase64(base64);
      globalSetPdfTitle(title || `Chapter ${chapterId} PPT`);
      globalSetShowPdfViewer(true);
    }
  } catch (error) {
    console.log('PDF open error:', error);
    Alert.alert(
      'PDF Error', 
      `Could not open ${title || 'Chapter ' + chapterId + ' PPT'}. Error: ${error.message}`,
      [{ text: 'OK' }]
    );
  }
};

// Video assets for each chapter
const videoAssets = {
  1: require('./assets/videos/chapter1_video.mp4'),
  2: require('./assets/videos/chapter2_video.mp4'),
  3: require('./assets/videos/chapter3_video.mp4'),
  4: require('./assets/videos/chapter4_video.mp4'),
  5: require('./assets/videos/chapter5_video.mp4'),
  6: require('./assets/videos/chapter6_video.mp4'),
  7: require('./assets/videos/chapter7_video.mp4'),
  8: require('./assets/videos/chapter8_video.mp4'),
  9: require('./assets/videos/chapter9_video.mp4'),
  10: require('./assets/videos/chapter10_video.mp4'),
};

// Global state for Video viewer (will be set by App component)
let globalSetShowVideoPlayer = null;
let globalSetVideoBase64 = null;
let globalSetVideoTitle = null;
let globalSetVideoUrl = null;

// Helper function to open Video files - INBUILT VIEWER
const openVideo = async (chapterId, title, setShowVideoPlayer, setVideoBase64, setVideoTitle, setVideoUrl) => {
  try {
    const maxChapter = _currentClass === '7' ? 15 : 10;
    if (chapterId < 1 || chapterId > maxChapter) {
      Alert.alert('Coming Soon', 'Video for this chapter will be available soon!');
      return;
    }
    
    // Check if using Google Drive URL
    const media = getCurrentMedia(chapterId);
    if (media && media.videoUrl && media.videoUrl.includes('drive.google.com')) {
      // Use Google Drive URL directly in WebView
      if (setShowVideoPlayer && setVideoTitle && setVideoUrl) {
        setVideoUrl(media.videoUrl);
        setVideoTitle(title || `Chapter ${chapterId} Video`);
        setShowVideoPlayer(true);
      } else if (globalSetShowVideoPlayer && globalSetVideoTitle && globalSetVideoUrl) {
        globalSetVideoUrl(media.videoUrl);
        globalSetVideoTitle(title || `Chapter ${chapterId} Video`);
        globalSetShowVideoPlayer(true);
      }
      return;
    }
    
    // Fallback to local video files
    Alert.alert('Loading', 'Opening Video...', [], { cancelable: false });
    
    const asset = Asset.fromModule(videoAssets[chapterId]);
    await asset.downloadAsync();
    
    const sourceUri = asset.localUri || asset.uri;
    const destUri = FileSystem.documentDirectory + `chapter${chapterId}_video.mp4`;
    
    try {
      await FileSystem.deleteAsync(destUri, { idempotent: true });
    } catch (e) {}
    await FileSystem.copyAsync({ from: sourceUri, to: destUri });
    
    const base64 = await FileSystem.readAsStringAsync(destUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    if (setShowVideoPlayer && setVideoBase64 && setVideoTitle) {
      setVideoBase64(base64);
      setVideoTitle(title || `Chapter ${chapterId} Video`);
      setShowVideoPlayer(true);
    } else if (globalSetShowVideoPlayer && globalSetVideoBase64 && globalSetVideoTitle) {
      globalSetVideoBase64(base64);
      globalSetVideoTitle(title || `Chapter ${chapterId} Video`);
      globalSetShowVideoPlayer(true);
    }
  } catch (error) {
    console.log('Video open error:', error);
    Alert.alert(
      'Video Error', 
      `Could not open ${title || 'Chapter ' + chapterId + ' Video'}. Error: ${error.message}`,
      [{ text: 'OK' }]
    );
  }
};

// 3D Models data for each chapter (5 per chapter)
const chapter3DModels = {
  1: [
    { id: 1, name: "Number Sequence Spiral", type: "spiral", description: "Visualize number patterns" },
    { id: 2, name: "Fibonacci Spiral", type: "fibonacci", description: "Golden ratio spiral" },
    { id: 3, name: "Magic Square 3D", type: "cube", description: "Interactive 3x3 magic square" },
    { id: 4, name: "Triangular Numbers", type: "pyramid", description: "Stack of dots forming triangular numbers" },
    { id: 5, name: "Square Numbers Grid", type: "grid", description: "Visual representation of square numbers" },
  ],
  2: [
    { id: 1, name: "Parallel Lines", type: "lines", description: "Two lines that never meet" },
    { id: 2, name: "Perpendicular Lines", type: "lines", description: "Lines meeting at 90 degrees" },
    { id: 3, name: "Angle Types", type: "angles", description: "Acute, right, obtuse angles" },
    { id: 4, name: "Protractor 3D", type: "protractor", description: "Interactive angle measurement" },
    { id: 5, name: "Ray and Segment", type: "lines", description: "Difference between ray and segment" },
  ],
  3: [
    { id: 1, name: "Place Value Blocks", type: "blocks", description: "Units, tens, hundreds" },
    { id: 2, name: "Number Line 3D", type: "numberline", description: "Interactive number line" },
    { id: 3, name: "Divisibility Wheel", type: "wheel", description: "Visual divisibility rules" },
    { id: 4, name: "Factor Tree", type: "tree", description: "Prime factorization tree" },
    { id: 5, name: "Number Bonds", type: "bonds", description: "Number relationships" },
  ],
  4: [
    { id: 1, name: "Bar Graph 3D", type: "bargraph", description: "Interactive 3D bar chart" },
    { id: 2, name: "Pie Chart 3D", type: "piechart", description: "3D pie chart visualization" },
    { id: 3, name: "Pictograph", type: "pictograph", description: "Picture-based data" },
    { id: 4, name: "Line Graph", type: "linegraph", description: "Trend visualization" },
    { id: 5, name: "Tally Marks", type: "tally", description: "Counting with tally marks" },
  ],
  5: [
    { id: 1, name: "Prime Sieve", type: "sieve", description: "Sieve of Eratosthenes" },
    { id: 2, name: "Factor Pairs", type: "pairs", description: "Visual factor pairs" },
    { id: 3, name: "LCM Visualization", type: "lcm", description: "Least common multiple" },
    { id: 4, name: "HCF Visualization", type: "hcf", description: "Highest common factor" },
    { id: 5, name: "Prime Spiral", type: "spiral", description: "Ulam spiral of primes" },
  ],
  6: [
    { id: 1, name: "Rectangle Perimeter", type: "rectangle", description: "Interactive perimeter" },
    { id: 2, name: "Square Area", type: "square", description: "Area of square" },
    { id: 3, name: "Triangle Area", type: "triangle", description: "Triangle area formula" },
    { id: 4, name: "Composite Shapes", type: "composite", description: "Breaking down shapes" },
    { id: 5, name: "Grid Area", type: "grid", description: "Counting squares for area" },
  ],
  7: [
    { id: 1, name: "Fraction Circles", type: "circles", description: "Circular fraction representation" },
    { id: 2, name: "Fraction Bars", type: "bars", description: "Bar model for fractions" },
    { id: 3, name: "Equivalent Fractions", type: "equivalent", description: "Visual equivalence" },
    { id: 4, name: "Fraction Addition", type: "addition", description: "Adding fractions visually" },
    { id: 5, name: "Mixed Numbers", type: "mixed", description: "Mixed number visualization" },
  ],
  8: [
    { id: 1, name: "Compass Drawing", type: "compass", description: "Circle construction" },
    { id: 2, name: "Angle Bisector", type: "bisector", description: "Bisecting angles" },
    { id: 3, name: "Perpendicular Bisector", type: "perpbisector", description: "Perpendicular line" },
    { id: 4, name: "Triangle Construction", type: "triangle", description: "Building triangles" },
    { id: 5, name: "Parallel Line Construction", type: "parallel", description: "Drawing parallel lines" },
  ],
  9: [
    { id: 1, name: "Line Symmetry", type: "linesym", description: "Reflection symmetry" },
    { id: 2, name: "Rotational Symmetry", type: "rotsym", description: "Rotation symmetry" },
    { id: 3, name: "Mirror Image", type: "mirror", description: "Mirror reflection" },
    { id: 4, name: "Symmetry in Nature", type: "nature", description: "Natural symmetry" },
    { id: 5, name: "Symmetry Patterns", type: "patterns", description: "Creating symmetric patterns" },
  ],
  10: [
    { id: 1, name: "Number Line Integers", type: "numberline", description: "Integers on number line" },
    { id: 2, name: "Integer Addition", type: "addition", description: "Adding positive and negative" },
    { id: 3, name: "Integer Subtraction", type: "subtraction", description: "Subtracting integers" },
    { id: 4, name: "Temperature Scale", type: "temperature", description: "Negative temperatures" },
    { id: 5, name: "Elevation Model", type: "elevation", description: "Above and below sea level" },
  ],
};

const topLevelChaptersClass6 = [
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
        "content": "Shape patterns involve geometric figures arranged in a repeating or growing sequence. These patterns can be found in tiles, wallpapers, fabrics, and architectural designs. A simple shape pattern might alternate between circles and squares, while more complex patterns involve rotations, reflections, or size changes. Triangular numbers (1, 3, 6, 10, 15...) represent dots arranged in triangular shapes, where each new triangle adds one more row. Square numbers (1, 4, 9, 16, 25...) represent dots arranged in perfect squares. Understanding shape patterns helps develop spatial reasoning and is essential for geometry. When analyzing shape patterns, look for the core unit that repeats, the transformation applied (rotation, reflection, translation), and how the pattern grows. These concepts are used in art, design, and computer graphics."
      },
      {
        "name": "Patterns in Nature",
        "content": "Mathematics is beautifully displayed in nature through various patterns. The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21...) appears in the arrangement of leaves on stems, the spiral of seeds in sunflowers, and the chambers of nautilus shells. Each number in this sequence is the sum of the two preceding numbers. The Golden Ratio (approximately 1.618) derived from Fibonacci numbers appears in the proportions of flowers, pinecones, and even hurricanes. Fractals are patterns that repeat at different scales, seen in snowflakes, fern leaves, and coastlines. Symmetry is another natural pattern - butterflies have bilateral symmetry, while starfish show radial symmetry. Honeybees build hexagonal cells because hexagons are the most efficient shape for storing honey. Understanding these patterns helps us appreciate the mathematical order underlying the natural world."
      },
      {
        "name": "Magic Squares",
        "content": "A magic square is a square grid filled with distinct numbers such that the sum of numbers in each row, column, and diagonal equals the same value, called the magic constant. The simplest magic square is 3x3, using numbers 1-9, with a magic constant of 15. To construct a 3x3 magic square, place 5 in the center, then arrange other numbers so opposite pairs sum to 10. The magic constant for an n×n magic square using numbers 1 to n² is calculated as n(n²+1)/2. Magic squares have fascinated mathematicians for over 4,000 years, appearing in ancient Chinese, Indian, and Islamic cultures. They were believed to have mystical properties and were used as talismans. Today, magic squares are studied in recreational mathematics and have applications in error-correcting codes and experimental design. Creating magic squares develops logical thinking and arithmetic skills."
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
        "content": "Lines can have special relationships with each other based on how they interact in space. Parallel lines are two or more lines in the same plane that never intersect, no matter how far they are extended - like railway tracks or the opposite edges of a ruler. We use the symbol || to denote parallel lines (AB || CD). Perpendicular lines are two lines that intersect at exactly 90 degrees (a right angle), forming an L-shape. The symbol ⊥ represents perpendicular lines. Intersecting lines are any two lines that cross at exactly one point, called the point of intersection. Concurrent lines are three or more lines that pass through the same point. In real life, parallel lines appear in ladder rungs, lined paper, and building structures. Perpendicular lines are seen in corners of rooms, the letter T, and crossroads. Understanding these relationships helps in construction, navigation, and design."
      },
      {
        "name": "Types of Angles",
        "content": "An angle is formed when two rays share a common endpoint called the vertex. Angles are measured in degrees (°) using a protractor. An acute angle measures less than 90° - examples include the hands of a clock at 2 o'clock or the tip of a pizza slice. A right angle measures exactly 90° and forms a perfect L-shape, seen in corners of books, doors, and windows. An obtuse angle measures more than 90° but less than 180° - like the angle of an open book or a reclining chair. A straight angle measures exactly 180° and forms a straight line. A reflex angle measures more than 180° but less than 360°. A complete angle measures exactly 360°, representing a full rotation. Complementary angles are two angles that add up to 90°, while supplementary angles add up to 180°. Understanding angles is crucial for architecture, engineering, sports, and everyday activities like parking a car or cutting fabric."
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
        "content": "Comparing numbers means determining which number is greater, smaller, or if they are equal. We use three symbols: > (greater than), < (less than), and = (equal to). To compare two numbers, first check if they have the same number of digits - the number with more digits is usually greater. If they have the same number of digits, compare from left to right, starting with the highest place value. The first digit that differs determines which number is greater. For example, comparing 4,567 and 4,589: both have 4 digits, both start with 4, both have 5 in hundreds place, but 8 > 6 in tens place, so 4,589 > 4,567. We can also arrange numbers in ascending order (smallest to largest) or descending order (largest to smallest). Comparing numbers is used in everyday life - comparing prices while shopping, temperatures, scores in games, and heights of people. Understanding comparison helps with estimation and making informed decisions."
      },
      {
        "name": "Rounding Numbers",
        "content": "Rounding is the process of replacing a number with an approximate value that is simpler and easier to work with. We round numbers to make calculations easier and to give estimates. To round to the nearest 10, look at the ones digit: if it's 5 or more, round up; if it's 4 or less, round down. For example, 47 rounds to 50 (7 ≥ 5), while 43 rounds to 40 (3 < 5). Similarly, to round to the nearest 100, look at the tens digit; to round to the nearest 1000, look at the hundreds digit. Rounding is useful in real life - when estimating costs (₹487 is about ₹500), measuring distances (the school is about 2 km away), or reporting populations (a city has about 5 million people). When doing mental math, rounding helps get quick approximate answers. For example, 48 + 53 is approximately 50 + 50 = 100. The actual answer is 101, which is very close to our estimate. Rounding is also important in science and statistics for reporting measurements with appropriate precision."
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
        "content": "Tally marks are a simple and efficient way to count and record data during collection. Each item counted is represented by a vertical line (|), and every fifth mark is drawn diagonally across the previous four (||||), creating groups of five that are easy to count. This system has been used for thousands of years because it's quick and reduces counting errors. For example, if you're counting the number of red cars passing by, you make a mark for each red car. After counting, you can quickly add up the groups of five plus any remaining marks. Tally marks are especially useful when data comes in quickly and you don't have time to write numbers. They're commonly used in voting, inventory counting, scientific observations, and classroom activities. To convert tally marks to numbers, count the number of complete groups (multiply by 5) and add any extra marks. Tally marks help organize raw data before creating frequency tables or graphs."
      },
      {
        "name": "Bar Graphs",
        "content": "A bar graph (or bar chart) is a visual representation of data using rectangular bars of different heights or lengths. Each bar represents a category, and the length of the bar shows the value or frequency for that category. Bar graphs make it easy to compare different categories at a glance. To create a bar graph: (1) Draw two perpendicular axes - the horizontal axis (x-axis) shows categories, and the vertical axis (y-axis) shows values. (2) Choose an appropriate scale for the y-axis based on your data range. (3) Draw bars of equal width for each category, with heights corresponding to their values. (4) Leave equal gaps between bars. (5) Add a title and label both axes. Bar graphs can be vertical or horizontal. They're used to show favorite foods, population of cities, monthly rainfall, sales figures, and much more. When reading a bar graph, compare bar heights to understand which categories have higher or lower values. Bar graphs are one of the most common and useful ways to present data visually."
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
        "content": "A prime number is a natural number greater than 1 that has exactly two factors: 1 and itself. The first few prime numbers are 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47... Note that 2 is the only even prime number - all other even numbers are divisible by 2, so they have more than two factors. The number 1 is not prime because it has only one factor (itself). Numbers with more than two factors are called composite numbers (like 4, 6, 8, 9, 10, 12...). To check if a number is prime, test if it's divisible by any prime number up to its square root. The Sieve of Eratosthenes is an ancient algorithm to find all primes up to a given number by repeatedly marking multiples of each prime. Prime numbers are fundamental in mathematics and have important applications in cryptography and computer security. There are infinitely many prime numbers, and mathematicians continue to search for larger primes."
      },
      {
        "name": "Prime Factorization",
        "content": "Prime factorization is the process of expressing a composite number as a product of its prime factors. Every composite number can be written as a unique product of primes (this is called the Fundamental Theorem of Arithmetic). For example, 60 = 2 × 2 × 3 × 5 = 2² × 3 × 5. There are two common methods: (1) Factor Tree Method - repeatedly divide the number into factors until all factors are prime. Start with any two factors, then factor each non-prime factor until only primes remain. (2) Division Method - repeatedly divide by the smallest prime that divides evenly, continuing until the quotient is 1. Prime factorization is used to find GCF (take common prime factors with lowest powers) and LCM (take all prime factors with highest powers). For example, for 12 = 2² × 3 and 18 = 2 × 3², GCF = 2 × 3 = 6 and LCM = 2² × 3² = 36. Prime factorization is also used in simplifying fractions and solving problems involving divisibility."
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
        "name": "Perimeter of Rectangle",
        "content": "A rectangle is a four-sided shape with four right angles (90°) where opposite sides are equal and parallel. The longer side is usually called the length (l) and the shorter side is called the breadth or width (b). The perimeter of a rectangle is the sum of all four sides: P = l + b + l + b = 2l + 2b = 2(l + b). For example, if a rectangle has length 8 cm and breadth 5 cm, its perimeter = 2(8 + 5) = 2 × 13 = 26 cm. This means if you walk around the rectangle, you would cover 26 cm. If you know the perimeter and one side, you can find the other side. For example, if P = 30 cm and l = 10 cm, then 30 = 2(10 + b), so 15 = 10 + b, giving b = 5 cm. Rectangles with the same perimeter can have different areas, and rectangles with the same area can have different perimeters. A square is a special rectangle where length equals breadth, so its perimeter = 4 × side."
      },
      {
        "name": "Area of Rectangle",
        "content": "Area is the amount of space inside a two-dimensional shape, measured in square units (cm², m², km²). For a rectangle, area = length × breadth (A = l × b). This formula works because we can think of the rectangle as being filled with unit squares - the number of squares in each row equals the length, and the number of rows equals the breadth. For example, a rectangle with length 6 cm and breadth 4 cm has area = 6 × 4 = 24 cm², meaning 24 unit squares fit inside it. For a square with side s, area = s × s = s². Area is used to determine how much paint is needed to cover a wall, how much carpet to buy for a room, the size of a farm field, or the space available in a room. If you know the area and one dimension, you can find the other: if A = 48 cm² and l = 8 cm, then b = 48 ÷ 8 = 6 cm. Understanding area helps in interior design, agriculture, construction, and many practical applications."
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
        "content": "Fractions are classified into several types based on the relationship between numerator and denominator. A proper fraction has a numerator smaller than the denominator (like 2/5, 3/7, 1/4) - its value is always less than 1. An improper fraction has a numerator greater than or equal to the denominator (like 5/3, 7/4, 9/9) - its value is 1 or greater. A mixed number combines a whole number with a proper fraction (like 2½, 3¾, 1⅓). To convert an improper fraction to a mixed number, divide the numerator by the denominator - the quotient is the whole number, and the remainder over the divisor is the fraction part. For example, 11/4 = 2¾ because 11 ÷ 4 = 2 remainder 3. To convert a mixed number to an improper fraction, multiply the whole number by the denominator, add the numerator, and put over the same denominator. For example, 3¼ = (3×4+1)/4 = 13/4. A unit fraction has 1 as its numerator (like 1/2, 1/3, 1/5). Like fractions have the same denominator, while unlike fractions have different denominators."
      },
      {
        "name": "Equivalent Fractions",
        "content": "Equivalent fractions are different fractions that represent the same value or the same part of a whole. For example, 1/2, 2/4, 3/6, 4/8, and 5/10 are all equivalent - they all represent half of something. To create equivalent fractions, multiply or divide both the numerator and denominator by the same non-zero number. This works because multiplying by n/n (like 2/2 or 3/3) is the same as multiplying by 1, which doesn't change the value. For example, 2/3 = (2×4)/(3×4) = 8/12. To check if two fractions are equivalent, cross-multiply: if a/b = c/d, then a×d = b×c. For example, 3/4 and 9/12 are equivalent because 3×12 = 36 = 4×9. Simplifying a fraction means finding an equivalent fraction with the smallest possible numerator and denominator by dividing both by their GCF. For example, 12/18 simplified is 2/3 (dividing both by 6). Understanding equivalent fractions is crucial for comparing fractions, adding and subtracting fractions with different denominators, and working with ratios and proportions."
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
        "content": "A circle is a set of all points that are at a fixed distance (radius) from a central point (center). To construct a circle using a compass: (1) Mark the center point. (2) Open the compass to the required radius by placing one leg on a ruler. (3) Place the pointed leg on the center. (4) Rotate the compass 360° while keeping the pointed leg fixed, drawing a smooth curve. Important circle terms include: radius (distance from center to any point on circle), diameter (distance across the circle through center = 2 × radius), chord (line segment joining any two points on circle), arc (part of the circle's boundary), and circumference (the perimeter of the circle). Concentric circles share the same center but have different radii. Circles are used everywhere - wheels, coins, plates, clocks, and planetary orbits. Understanding circles is essential for studying area, circumference, and later topics like trigonometry."
      },
      {
        "name": "Constructing Angles",
        "content": "Angles can be constructed using a compass and straightedge without a protractor. The most fundamental construction is a 60° angle: draw a line segment, open compass to any radius, draw an arc from one endpoint, without changing the compass width draw an arc from where the first arc crosses the line, connect the endpoint to where the arcs intersect - this creates a 60° angle. To construct 120°, extend the 60° construction or construct two 60° angles. To construct 90° (right angle), first construct a perpendicular bisector of a line segment. To construct 30°, bisect a 60° angle. To construct 45°, bisect a 90° angle. Angle bisection involves drawing an arc from the vertex, then arcs from where it crosses both rays, and connecting the vertex to where these arcs meet. These constructions are based on properties of equilateral triangles and isosceles triangles. Mastering angle constructions develops precision and understanding of angle relationships."
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
        "content": "Different shapes have different numbers of lines of symmetry. A circle has infinite lines of symmetry - any diameter divides it into two equal halves. A square has 4 lines of symmetry: 2 through opposite corners (diagonals) and 2 through midpoints of opposite sides. A rectangle has 2 lines of symmetry (through midpoints of opposite sides, but not diagonals). An equilateral triangle has 3 lines of symmetry (from each vertex to the midpoint of the opposite side). An isosceles triangle has 1 line of symmetry (from the vertex angle to the midpoint of the base). A scalene triangle has no lines of symmetry. Regular polygons have as many lines of symmetry as they have sides - a regular pentagon has 5, a regular hexagon has 6. Letters like A, H, M, O, T, U, V, W, X, Y have at least one line of symmetry. Recognizing lines of symmetry helps in understanding shapes, creating designs, and solving geometric problems."
      },
      {
        "name": "Reflection",
        "content": "Reflection is a transformation that creates a mirror image of a figure across a line (called the line of reflection or mirror line). Every point in the original figure has a corresponding point in the reflected image that is the same distance from the mirror line but on the opposite side. The original figure and its reflection are congruent (same size and shape) but have opposite orientations - like your left and right hands. To reflect a point across a line: draw a perpendicular from the point to the line, then extend it the same distance on the other side. Reflection is used in real life in mirrors, water reflections, and kaleidoscopes. In coordinate geometry, reflecting across the y-axis changes (x, y) to (-x, y), and reflecting across the x-axis changes (x, y) to (x, -y). Understanding reflection is essential for studying transformations, which include translation (sliding), rotation (turning), and dilation (scaling)."
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

// Class 7 chapters - 15 NCERT chapters with topics (PDF/Video/TB come from chapterMedia7)
const chaptersClass7 = [
  {
    "id": 1,
    "number": "1",
    "title": "Large Numbers Around Us",
    "description": "Exploring large numbers like lakhs and crores, place value system, patterns in products, and real-world applications of big numbers",
    "topics": [
      {
        "name": "1.1 A Lakh Varieties!",
        "content": "This topic introduces large numbers through the fascinating story of rice varieties in India. Did you know there are more than 1,00,000 (one lakh) varieties of rice in the world? This helps students understand just how big one lakh really is.\n\n**Understanding One Lakh (1,00,000):**\nOne lakh = 100 thousands = 10 ten-thousands. If you count 1 number per second, it would take you about 28 hours to count to one lakh!\n\n**Real-World Examples of Large Numbers:**\n• India has approximately 140 crore people\n• The Earth is about 15 crore km from the Sun\n• A pinch of sand contains about 10,000 grains\n• The Indian Railways carries about 2.3 crore passengers daily\n\n**Place Value Connections:**\nIn the Indian system: 1,00,000 = 1 lakh. Each comma groups digits differently than the international system.\n• Indian: 1,00,00,000 (1 crore)\n• International: 10,000,000 (10 million)\n\n**Practice Tip:** When dealing with large numbers, always try to relate them to something you can visualize. For example, your school might have 1,000 students — so 1 lakh would be 100 schools like yours!"
      },
      {
        "name": "1.2 Land of Tens",
        "content": "Our number system is built entirely on powers of ten. This topic explores why we use base-10 and how place values work.\n\n**Powers of Ten:**\n• 10⁰ = 1 (ones place)\n• 10¹ = 10 (tens place)\n• 10² = 100 (hundreds place)\n• 10³ = 1,000 (thousands place)\n• 10⁴ = 10,000 (ten-thousands place)\n• 10⁵ = 1,00,000 (lakhs place)\n• 10⁶ = 10,00,000 (ten-lakhs place)\n• 10⁷ = 1,00,00,000 (crores place)\n\n**Why Base 10?**\nHumans have 10 fingers, which is likely why we developed a base-10 system. Other civilizations used base-12 (Babylonians counted finger joints) or base-20 (Mayans counted fingers and toes).\n\n**Expanded Form:**\nEvery number can be written as a sum of place values:\n5,34,267 = 5×1,00,000 + 3×10,000 + 4×1,000 + 2×100 + 6×10 + 7×1\n\n**Reading Large Numbers:**\nIn the Indian system, commas are placed after the hundreds, then every two digits: 1,23,45,678. Read as: one crore twenty-three lakh forty-five thousand six hundred seventy-eight.\n\n**Fun Fact:** Computers use base-2 (binary) because they work with ON/OFF switches!"
      },
      {
        "name": "1.3 Of Crores and Crores!",
        "content": "This section extends the place value system to crores and beyond. Students learn to read, write, and compare very large numbers used in real life.\n\n**Indian Place Value Chart (up to Crores):**\nCrores | Ten Lakhs | Lakhs | Ten Thousands | Thousands | Hundreds | Tens | Ones\n\n**Key Conversions:**\n• 1 lakh = 100 thousand\n• 10 lakhs = 1 million\n• 1 crore = 100 lakhs = 10 million\n• 10 crores = 100 million = 1 arab\n• 100 crores = 1 billion\n\n**Comparing Large Numbers:**\nStep 1: Count the digits — more digits means bigger number\nStep 2: If same digits, compare from the leftmost digit\nExample: 45,23,100 vs 45,32,100 → Compare lakhs place: 23 < 32, so first number is smaller\n\n**Real-World Large Numbers:**\n• India's GDP: approximately 350 lakh crore rupees\n• Distance to nearest star (Proxima Centauri): about 4 light years = 40,00,00,00,00,000 km\n• Number of cells in human body: about 37 lakh crore\n\n**Practice Tip:** When comparing numbers, first check the number of digits. A 7-digit number is always greater than any 6-digit number, no matter what the digits are!"
      },
      {
        "name": "1.4 Exact and Approximate Values",
        "content": "In real life, we often don't need exact numbers — approximations are more practical and easier to understand.\n\n**When to Use Approximations:**\n• Population of a city: We say 'about 2 crore' not '2,01,34,567'\n• Distance between cities: 'about 300 km' not '297.4 km'\n• Cost of a project: 'approximately 50 lakh' not '49,87,342'\n\n**Rounding Rules:**\n• If the digit to be dropped is 0-4: round down (keep the digit same)\n• If the digit to be dropped is 5-9: round up (increase the digit by 1)\n\n**Examples:**\n• 7,32,461 rounded to nearest lakh = 7,00,000\n• 7,62,461 rounded to nearest lakh = 8,00,000\n• 3,456 rounded to nearest hundred = 3,500\n• 3,432 rounded to nearest hundred = 3,400\n\n**Estimation in Calculations:**\nTo estimate 4,891 + 3,207:\nRound each: 5,000 + 3,000 = 8,000 (actual: 8,098)\nThis is useful for quickly checking if your answer makes sense!\n\n**Real-World Application:** Scientists often work with approximate values. The speed of light is approximately 3,00,000 km/s (exact: 2,99,792.458 km/s). The approximation is much easier to work with!"
      },
      {
        "name": "1.5 Patterns in Products",
        "content": "This topic explores fascinating patterns that emerge when multiplying numbers, helping students discover relationships between products and factors.\n\n**Pattern 1 - Multiplying by Powers of 10:**\n• 37 × 10 = 370 (add one zero)\n• 37 × 100 = 3,700 (add two zeros)\n• 37 × 1,000 = 37,000 (add three zeros)\n\n**Pattern 2 - Interesting Product Patterns:**\n• 1 × 9 + 1 = 10\n• 12 × 9 + 2 = 110\n• 123 × 9 + 3 = 1110\n• 1234 × 9 + 4 = 11110\n\n**Pattern 3 - Products with Repeated Digits:**\n• 7 × 11 × 13 = 1001\n• 1001 × any 3-digit number repeats that number: 1001 × 235 = 235235\n\n**Pattern 4 - Multiplying by 11:**\n• For 2-digit numbers: 34 × 11 = 374 (3, 3+4, 4)\n• 45 × 11 = 495 (4, 4+5, 5)\n\n**Why Patterns Matter:**\nPatterns in multiplication help us:\n• Calculate faster mentally\n• Check if our answers are reasonable\n• Understand deeper relationships in mathematics\n\n**Practice Tip:** Try discovering your own patterns! What happens when you multiply any number by 9 and add its digits?"
      },
      {
        "name": "1.6 Did You Ever Wonder...?",
        "content": "A culminating section that poses fascinating questions about large numbers in nature, science, and everyday life, encouraging curiosity and mathematical thinking.\n\n**Amazing Number Facts:**\n• There are about 1 lakh hairs on a human head\n• A human heart beats about 1,00,000 times per day\n• There are about 10 lakh ants for every human on Earth\n• The Milky Way contains about 100 arab (10,000 crore) stars\n\n**Numbers in the Human Body:**\n• Red blood cells: about 2.5 crore are produced every second\n• Nerve signals travel at about 400 km/h\n• DNA: if stretched out, would be about 2 meters long per cell\n• Total DNA in your body would stretch from Earth to Pluto and back!\n\n**Numbers in Nature:**\n• A sunflower can have up to 2,000 seeds\n• A single tree can have 2,00,000 leaves\n• Bees visit about 50-100 flowers per trip\n• A colony of bees can have 60,000-80,000 members\n\n**Numbers in Technology:**\n• Internet users worldwide: about 500 crore\n• Google processes about 850 crore searches per day\n• A smartphone has about 1,000 crore transistors\n\n**Think About It:** Can you estimate how many words you speak in a day? (Hint: Average person speaks about 16,000 words per day!)"
      }
    ],
    "questions": [
      {
        "q": "How many zeros are there in 1 lakh?",
        "options": [
          "3",
          "4",
          "5",
          "6"
        ],
        "answer": 2
      },
      {
        "q": "1 crore is equal to how many lakhs?",
        "options": [
          "10",
          "100",
          "1000",
          "10000"
        ],
        "answer": 1
      },
      {
        "q": "What is the place value of 5 in 5,34,267?",
        "options": [
          "5 thousands",
          "5 ten-thousands",
          "5 lakhs",
          "5 crores"
        ],
        "answer": 2
      },
      {
        "q": "Which is the largest 6-digit number?",
        "options": [
          "100000",
          "999999",
          "900000",
          "999990"
        ],
        "answer": 1
      },
      {
        "q": "Round 7,62,461 to the nearest lakh:",
        "options": [
          "7,00,000",
          "8,00,000",
          "7,60,000",
          "7,62,000"
        ],
        "answer": 1
      },
      {
        "q": "10 lakhs is equal to:",
        "options": [
          "1 crore",
          "1 million",
          "10 million",
          "100 thousand"
        ],
        "answer": 1
      },
      {
        "q": "In the number 3,45,678, the digit 4 is in which place?",
        "options": [
          "Thousands",
          "Ten thousands",
          "Lakhs",
          "Hundreds"
        ],
        "answer": 1
      },
      {
        "q": "What is 37 x 1000?",
        "options": [
          "370",
          "3700",
          "37000",
          "370000"
        ],
        "answer": 2
      },
      {
        "q": "Which number is greater: 45,23,100 or 45,32,100?",
        "options": [
          "45,23,100",
          "45,32,100",
          "Both are equal",
          "Cannot compare"
        ],
        "answer": 1
      },
      {
        "q": "The successor of 99,999 is:",
        "options": [
          "99,998",
          "1,00,000",
          "10,000",
          "9,99,999"
        ],
        "answer": 1
      },
      {
        "q": "How many 6-digit numbers are there in all?",
        "options": [
          "9,00,000",
          "1,00,000",
          "8,99,999",
          "9,99,999"
        ],
        "answer": 0
      },
      {
        "q": "The smallest 7-digit number is:",
        "options": [
          "9999999",
          "1000000",
          "1000001",
          "7000000"
        ],
        "answer": 1
      },
      {
        "q": "1 billion = how many crores?",
        "options": [
          "10",
          "100",
          "1000",
          "1"
        ],
        "answer": 1
      },
      {
        "q": "Round 3,456 to the nearest hundred:",
        "options": [
          "3,400",
          "3,500",
          "3,000",
          "3,460"
        ],
        "answer": 1
      },
      {
        "q": "What is the expanded form of 6,05,032?",
        "options": [
          "6x100000+5x1000+3x10+2x1",
          "6x100000+5x100+3x10+2x1",
          "6x100000+0x10000+5x1000+0x100+3x10+2x1",
          "6x10000+5x1000+32"
        ],
        "answer": 2
      },
      {
        "q": "If you count 1 number per second, how long to count to 1 lakh?",
        "options": [
          "About 1 hour",
          "About 10 hours",
          "About 28 hours",
          "About 100 hours"
        ],
        "answer": 2
      },
      {
        "q": "1001 x 235 = ?",
        "options": [
          "235000",
          "235235",
          "236235",
          "235035"
        ],
        "answer": 1
      },
      {
        "q": "Which is the predecessor of 10,00,000?",
        "options": [
          "9,99,999",
          "10,00,001",
          "99,999",
          "9,99,990"
        ],
        "answer": 0
      },
      {
        "q": "45 x 11 = ?",
        "options": [
          "455",
          "495",
          "485",
          "505"
        ],
        "answer": 1
      },
      {
        "q": "The number of zeros in 10 crore is:",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ],
        "answer": 2
      },
      {
        "q": "Estimate 4,891 + 3,207 by rounding to thousands:",
        "options": [
          "7,000",
          "8,000",
          "9,000",
          "7,500"
        ],
        "answer": 1
      },
      {
        "q": "Which digit is in the ten-lakhs place of 3,45,67,890?",
        "options": [
          "3",
          "4",
          "5",
          "6"
        ],
        "answer": 1
      },
      {
        "q": "1 lakh = ___ ten thousands",
        "options": [
          "1",
          "10",
          "100",
          "1000"
        ],
        "answer": 1
      },
      {
        "q": "The Indian and International systems differ in:",
        "options": [
          "Digits used",
          "Placement of commas",
          "Value of numbers",
          "Base system"
        ],
        "answer": 1
      },
      {
        "q": "What is 1 crore in the international system?",
        "options": [
          "1 million",
          "10 million",
          "100 million",
          "1 billion"
        ],
        "answer": 1
      },
      {
        "q": "How many thousands make 1 lakh?",
        "options": [
          "10",
          "100",
          "1000",
          "10000"
        ],
        "answer": 1
      },
      {
        "q": "The place value of 0 in 3,05,042 at thousands place is:",
        "options": [
          "0",
          "5000",
          "5",
          "50"
        ],
        "answer": 0
      },
      {
        "q": "34 x 11 = ?",
        "options": [
          "344",
          "374",
          "354",
          "384"
        ],
        "answer": 1
      },
      {
        "q": "Which is the correct Indian representation of 10 million?",
        "options": [
          "10,00,000",
          "1,00,00,000",
          "100,00,000",
          "1,00,000"
        ],
        "answer": 1
      },
      {
        "q": "Round 8,45,600 to nearest lakh:",
        "options": [
          "8,00,000",
          "9,00,000",
          "8,50,000",
          "8,45,000"
        ],
        "answer": 1
      },
      {
        "q": "The face value of 7 in 47,83,291 is:",
        "options": [
          "7",
          "7,00,000",
          "70,000",
          "7000"
        ],
        "answer": 0
      },
      {
        "q": "100 crores = ?",
        "options": [
          "1 million",
          "10 million",
          "100 million",
          "1 billion"
        ],
        "answer": 3
      },
      {
        "q": "What comes just after 9,99,99,999?",
        "options": [
          "10,00,00,000",
          "9,99,99,998",
          "10,00,00,001",
          "1,00,00,00,000"
        ],
        "answer": 0
      },
      {
        "q": "Which is greater: 8 lakhs or 80 thousand?",
        "options": [
          "8 lakhs",
          "80 thousand",
          "Both equal",
          "Cannot compare"
        ],
        "answer": 0
      },
      {
        "q": "12 x 9 + 2 = ?",
        "options": [
          "100",
          "108",
          "110",
          "112"
        ],
        "answer": 2
      },
      {
        "q": "How many digits does the number 1 crore have?",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ],
        "answer": 2
      },
      {
        "q": "Approximate value of 4,97,850 to nearest lakh:",
        "options": [
          "4,00,000",
          "5,00,000",
          "4,98,000",
          "4,97,000"
        ],
        "answer": 1
      },
      {
        "q": "The product of 999 and 5 is closest to:",
        "options": [
          "4000",
          "4500",
          "5000",
          "5500"
        ],
        "answer": 2
      },
      {
        "q": "In 87,65,432, the digit in crores place is:",
        "options": [
          "There is no crores digit",
          "8",
          "7",
          "6"
        ],
        "answer": 0
      },
      {
        "q": "1 arab = ?",
        "options": [
          "10 lakhs",
          "10 crores",
          "100 crores",
          "1000 lakhs"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": 2,
    "number": "2",
    "title": "Arithmetic Expressions",
    "description": "Understanding and evaluating arithmetic expressions, order of operations, comparing expressions, and reading complex mathematical phrases",
    "topics": [
      {
        "name": "2.1 Simple Expressions",
        "content": "An arithmetic expression is a combination of numbers and operations (+, –, ×, ÷) that represents a value. Every expression, no matter how complex, evaluates to a single number.\n\n**What is an Expression?**\nAn expression is a mathematical phrase that combines numbers with operations. Examples:\n• 13 + 2 = 15\n• 20 – 4 = 16\n• 12 × 5 = 60\n• 18 ÷ 3 = 6\n\n**Writing Expressions from Situations:**\n• 'Raju has 15 marbles and gets 8 more' → 15 + 8\n• 'A ribbon 20 cm long is cut into 4 equal pieces' → 20 ÷ 4\n• 'Price of 3 notebooks at Rs. 45 each' → 3 × 45\n\n**Properties of Operations:**\n• **Commutative:** a + b = b + a and a × b = b × a (works for addition and multiplication, NOT for subtraction and division)\n• **Identity:** a + 0 = a (zero is additive identity), a × 1 = a (one is multiplicative identity)\n• **Zero property:** a × 0 = 0\n\n**Real-World Connection:** Every time you calculate the total cost at a shop, figure out how to split a bill, or measure ingredients for cooking, you are evaluating arithmetic expressions!\n\n**Practice Tip:** When solving word problems, first identify the numbers and the operation needed before writing the expression."
      },
      {
        "name": "2.2 Reading and Evaluating Complex Expressions",
        "content": "When an expression has multiple operations, we need rules to decide which operation to do first. This is called the order of operations (BODMAS/PEMDAS).\n\n**BODMAS Rule:**\nB – Brackets (solve what's inside first)\nO – Orders (powers and roots)\nD – Division (left to right)\nM – Multiplication (left to right)\nA – Addition (left to right)\nS – Subtraction (left to right)\n\n**Important:** Division and Multiplication have EQUAL priority — do them left to right. Same for Addition and Subtraction.\n\n**Examples:**\n• 3 + 4 × 5 = 3 + 20 = 23 (NOT 35, because multiplication comes before addition)\n• (3 + 4) × 5 = 7 × 5 = 35 (brackets change the order!)\n• 24 ÷ 6 + 2 × 3 = 4 + 6 = 10\n• 100 – 5 × (8 + 2) = 100 – 5 × 10 = 100 – 50 = 50\n\n**Nested Brackets:**\nWhen expressions have brackets within brackets, solve the innermost bracket first:\n2 × {3 + (4 × 5)} = 2 × {3 + 20} = 2 × 23 = 46\n\n**Common Mistakes:**\n• Doing operations left to right without considering BODMAS\n• Forgetting that multiplication/division come before addition/subtraction\n• Not solving brackets first\n\n**Practice Tip:** Always underline or highlight the part you need to solve first, then rewrite the expression step by step."
      }
    ],
    "questions": [
      {
        "q": "What is the value of 3 + 4 x 5?",
        "options": [
          "35",
          "23",
          "60",
          "17"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: (3 + 4) x 5",
        "options": [
          "23",
          "35",
          "60",
          "17"
        ],
        "answer": 1
      },
      {
        "q": "What is 24 / 6 + 2 x 3?",
        "options": [
          "10",
          "15",
          "18",
          "6"
        ],
        "answer": 0
      },
      {
        "q": "In BODMAS, what does 'B' stand for?",
        "options": [
          "Base",
          "Brackets",
          "Before",
          "Below"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: 100 - 5 x (8 + 2)",
        "options": [
          "950",
          "50",
          "60",
          "45"
        ],
        "answer": 1
      },
      {
        "q": "Which property says a + b = b + a?",
        "options": [
          "Associative",
          "Commutative",
          "Distributive",
          "Identity"
        ],
        "answer": 1
      },
      {
        "q": "What is the value of 15 + 0?",
        "options": [
          "0",
          "15",
          "150",
          "1"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: 2 x {3 + (4 x 5)}",
        "options": [
          "46",
          "70",
          "50",
          "26"
        ],
        "answer": 0
      },
      {
        "q": "Which operation is performed first in 8 + 6 / 2?",
        "options": [
          "Addition",
          "Division",
          "Both together",
          "Neither"
        ],
        "answer": 1
      },
      {
        "q": "What is 48 / 8 x 2?",
        "options": [
          "3",
          "12",
          "6",
          "16"
        ],
        "answer": 1
      },
      {
        "q": "The additive identity is:",
        "options": [
          "1",
          "0",
          "-1",
          "None"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: 5 x 4 - 3 x 2",
        "options": [
          "14",
          "34",
          "26",
          "7"
        ],
        "answer": 0
      },
      {
        "q": "Which is NOT commutative?",
        "options": [
          "Addition",
          "Multiplication",
          "Subtraction",
          "Both A and B"
        ],
        "answer": 2
      },
      {
        "q": "What is the value of 7 x 1?",
        "options": [
          "0",
          "1",
          "7",
          "8"
        ],
        "answer": 2
      },
      {
        "q": "Evaluate: 36 / (6 x 3)",
        "options": [
          "18",
          "2",
          "6",
          "3"
        ],
        "answer": 1
      },
      {
        "q": "In the expression 4 + 3 x 2, which operation is done first?",
        "options": [
          "Addition",
          "Multiplication",
          "Either one",
          "None"
        ],
        "answer": 1
      },
      {
        "q": "'Price of 5 books at Rs. 30 each' is written as:",
        "options": [
          "5 + 30",
          "5 - 30",
          "5 x 30",
          "5 / 30"
        ],
        "answer": 2
      },
      {
        "q": "Evaluate: (10 + 5) x (10 - 5)",
        "options": [
          "75",
          "100",
          "50",
          "25"
        ],
        "answer": 0
      },
      {
        "q": "What is 0 x 999?",
        "options": [
          "999",
          "0",
          "1",
          "9990"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: 8 + 8 / 8 + 8 x 8 - 8",
        "options": [
          "65",
          "1",
          "72",
          "57"
        ],
        "answer": 0
      },
      {
        "q": "Which expression equals 20?",
        "options": [
          "4 x 4 + 4",
          "4 + 4 x 4",
          "4 x (4 + 4)",
          "(4 + 4) + 4"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: 15 - 3 x 4 + 2",
        "options": [
          "50",
          "5",
          "8",
          "10"
        ],
        "answer": 1
      },
      {
        "q": "The multiplicative identity is:",
        "options": [
          "0",
          "1",
          "-1",
          "The number itself"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: 50 - {20 - (10 - 5)}",
        "options": [
          "25",
          "35",
          "40",
          "15"
        ],
        "answer": 1
      },
      {
        "q": "What is 12 / 4 / 3?",
        "options": [
          "1",
          "9",
          "3",
          "4"
        ],
        "answer": 0
      },
      {
        "q": "A ribbon of 20 cm cut into 4 equal pieces gives each piece of:",
        "options": [
          "4 cm",
          "5 cm",
          "16 cm",
          "24 cm"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: 6 + 6 x 6 - 6 / 6",
        "options": [
          "41",
          "42",
          "36",
          "30"
        ],
        "answer": 0
      },
      {
        "q": "In 5 + 3 x (2 + 4), which bracket is solved first?",
        "options": [
          "No brackets needed",
          "(2 + 4)",
          "5 + 3",
          "3 x 2"
        ],
        "answer": 1
      },
      {
        "q": "What does BODMAS stand for?",
        "options": [
          "Brackets Orders Division Multiplication Addition Subtraction",
          "Base Operations Division Multiplication Addition Subtraction",
          "Brackets Of Division Multiplication Addition Subtraction",
          "Both Orders Division Multiplication Addition Signs"
        ],
        "answer": 0
      },
      {
        "q": "Evaluate: 2 + 3 x 4 - 5",
        "options": [
          "15",
          "9",
          "20",
          "0"
        ],
        "answer": 1
      },
      {
        "q": "Is 8 - 3 the same as 3 - 8?",
        "options": [
          "Yes",
          "No",
          "Sometimes",
          "Cannot determine"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: (12 + 8) / (4 + 1)",
        "options": [
          "2",
          "3",
          "4",
          "5"
        ],
        "answer": 2
      },
      {
        "q": "What is 5 x 5 + 5 x 5?",
        "options": [
          "50",
          "100",
          "625",
          "30"
        ],
        "answer": 0
      },
      {
        "q": "Evaluate: 1000 / 10 / 10",
        "options": [
          "1",
          "10",
          "100",
          "1000"
        ],
        "answer": 1
      },
      {
        "q": "Which gives the largest value?",
        "options": [
          "2 + 3 x 4",
          "(2 + 3) x 4",
          "2 x 3 + 4",
          "2 x (3 + 4)"
        ],
        "answer": 1
      },
      {
        "q": "Evaluate: 7 x 8 - 6 x 9",
        "options": [
          "2",
          "3",
          "0",
          "-2"
        ],
        "answer": 0
      },
      {
        "q": "Which is correct: 18 / 3 x 2 = 12 or 18 / 3 x 2 = 3?",
        "options": [
          "12 is correct",
          "3 is correct",
          "Both are correct",
          "Neither"
        ],
        "answer": 0
      },
      {
        "q": "If a = 5, what is a x a + a?",
        "options": [
          "30",
          "15",
          "25",
          "35"
        ],
        "answer": 0
      },
      {
        "q": "Evaluate: 4 x [8 - (3 + 2)]",
        "options": [
          "12",
          "20",
          "8",
          "16"
        ],
        "answer": 0
      },
      {
        "q": "Which expression represents 'subtract 7 from the product of 3 and 8'?",
        "options": [
          "7 - 3 x 8",
          "3 x 8 - 7",
          "(3 - 7) x 8",
          "3 x (8 - 7)"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": 3,
    "number": "3",
    "title": "A Peek Beyond the Point",
    "description": "Introduction to decimals - tenths, hundredths, place value, units of measurement, comparing and locating decimals, and arithmetic with decimals",
    "topics": [
      {
        "name": "3.1 The Need for Smaller Units",
        "content": "When whole numbers aren't enough to express a measurement precisely, we need smaller parts — and that's where decimals come in.\n\n**Why Do We Need Decimals?**\nImagine measuring your height. You're not exactly 1 meter tall and not exactly 2 meters — you're somewhere in between, like 1.35 meters. Whole numbers can't express this!\n\n**Situations Requiring Decimals:**\n• Temperature: 98.6°F (normal body temperature)\n• Money: Rs. 45.50 (forty-five rupees and fifty paise)\n• Weight: 2.5 kg of rice\n• Distance: The school is 1.8 km away\n\n**From Fractions to Decimals:**\nDecimals are really fractions with denominators that are powers of 10:\n• 1/10 = 0.1 (one-tenth)\n• 1/100 = 0.01 (one-hundredth)\n• 3/10 = 0.3\n• 25/100 = 0.25\n\n**The Decimal Point:**\nThe dot between the whole number part and the fractional part is the decimal point. It separates 'wholes' from 'parts'.\nIn 23.45: 23 is the whole part, 45 is the decimal (fractional) part.\n\n**Practice Tip:** Think of decimals as money — Rs. 3.75 means 3 whole rupees and 75 paise (hundredths of a rupee)."
      },
      {
        "name": "3.2 A Tenth Part",
        "content": "When we divide something into 10 equal parts, each part is called one-tenth. In decimal notation, one-tenth is written as 0.1.\n\n**Understanding Tenths:**\n• 1/10 = 0.1 = one-tenth\n• 2/10 = 0.2 = two-tenths\n• 5/10 = 0.5 = five-tenths = one-half\n• 10/10 = 1.0 = one whole\n\n**Visualizing Tenths:**\nImagine a strip of paper divided into 10 equal parts. Each part represents 0.1. If you shade 3 parts, you have shaded 0.3 of the strip.\n\n**Tenths on a Number Line:**\nBetween 0 and 1, there are 9 points at equal distances: 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9\nBetween 3 and 4: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9\n\n**Tenths in Measurement:**\n• 1 cm = 10 mm, so 1 mm = 0.1 cm\n• 1 meter = 10 decimeters, so 1 dm = 0.1 m\n• 1 kg = 10 hectograms\n\n**Real-World Application:** When a shopkeeper weighs vegetables and says '2.3 kg', it means 2 kg and 3 tenths of a kg (which is 300 grams)."
      },
      {
        "name": "3.3 A Hundredth Part",
        "content": "When we divide something into 100 equal parts, each part is called one-hundredth. In decimal notation, one-hundredth is written as 0.01.\n\n**Understanding Hundredths:**\n• 1/100 = 0.01 = one-hundredth\n• 5/100 = 0.05 = five-hundredths\n• 25/100 = 0.25 = twenty-five hundredths\n• 100/100 = 1.00 = one whole\n\n**Relationship Between Tenths and Hundredths:**\n• 1 tenth = 10 hundredths (0.1 = 0.10)\n• 0.30 = 0.3 (3 tenths = 30 hundredths)\n• 0.50 = 0.5 (5 tenths = 50 hundredths)\n\n**Money Connection:**\n• 1 rupee = 100 paise\n• 1 paisa = 0.01 rupee\n• 25 paise = 0.25 rupee = Rs. 0.25\n• Rs. 7.50 = 7 rupees and 50 paise\n\n**Percentage Connection:**\nPercent means 'per hundred'. So 25% = 25/100 = 0.25. This connection between percentages and decimals is very useful!\n\n**Practice Tip:** To convert a fraction with denominator 100 to decimal, simply write the numerator with a decimal point two places from the right: 75/100 = 0.75."
      },
      {
        "name": "3.4 Decimal Place Value",
        "content": "Just like whole numbers have ones, tens, hundreds places going left, decimals have tenths, hundredths, thousandths places going right from the decimal point.\n\n**Decimal Place Value Chart:**\n... Hundreds | Tens | Ones . Tenths | Hundredths | Thousandths ...\n... 100 | 10 | 1 . 1/10 | 1/100 | 1/1000 ...\n\n**Reading Decimal Numbers:**\n• 3.7 = 'three point seven' or 'three and seven-tenths'\n• 15.23 = 'fifteen point two three' or 'fifteen and twenty-three hundredths'\n• 0.456 = 'zero point four five six' or 'four hundred fifty-six thousandths'\n\n**Expanded Form of Decimals:**\n34.56 = 3×10 + 4×1 + 5×(1/10) + 6×(1/100)\n= 30 + 4 + 0.5 + 0.06\n\n**Key Rule:** Adding zeros at the end of a decimal doesn't change its value:\n0.5 = 0.50 = 0.500 (all equal five-tenths)\nBut adding zeros between the decimal point and a digit DOES change it:\n0.5 ≠ 0.05 ≠ 0.005\n\n**Practice Tip:** When comparing or adding decimals, it helps to make them have the same number of decimal places by adding trailing zeros."
      },
      {
        "name": "3.5 Units of Measurement",
        "content": "Decimals are essential for converting between different units of measurement. Understanding these conversions helps in science, cooking, and daily life.\n\n**Length Conversions:**\n• 1 km = 1000 m, so 1 m = 0.001 km\n• 1 m = 100 cm, so 1 cm = 0.01 m\n• 1 cm = 10 mm, so 1 mm = 0.1 cm\n• Example: 3 km 250 m = 3.250 km = 3.25 km\n• Example: 7 m 5 cm = 7.05 m\n\n**Weight Conversions:**\n• 1 kg = 1000 g, so 1 g = 0.001 kg\n• Example: 2 kg 500 g = 2.500 kg = 2.5 kg\n• Example: 750 g = 0.750 kg = 0.75 kg\n\n**Capacity Conversions:**\n• 1 litre = 1000 mL, so 1 mL = 0.001 L\n• Example: 1 L 200 mL = 1.200 L = 1.2 L\n\n**Common Mistakes to Avoid:**\n• 3 m 5 cm is NOT 3.5 m! It is 3.05 m (since 5 cm = 0.05 m)\n• 2 kg 50 g is NOT 2.50 kg! It is 2.050 kg (since 50 g = 0.050 kg)\n\n**Practice Tip:** Always check: how many smaller units make one larger unit? If 100 cm = 1 m, then to convert cm to m, divide by 100 (move decimal point 2 places left)."
      },
      {
        "name": "3.6 Locating and Comparing Decimals",
        "content": "Being able to place decimals on a number line and compare them is a crucial skill. This helps in understanding the size of decimal numbers.\n\n**Locating Decimals on Number Line:**\nTo locate 2.7 on a number line:\n1. Find the interval 2 to 3\n2. Divide this interval into 10 equal parts\n3. Count 7 parts from 2 → that's 2.7\n\n**Comparing Decimals:**\nStep 1: Compare the whole number parts first\nStep 2: If equal, compare tenths\nStep 3: If still equal, compare hundredths, and so on\n\n**Examples:**\n• 3.5 vs 2.9: 3 > 2, so 3.5 > 2.9\n• 4.3 vs 4.7: Same whole part (4), compare tenths: 3 < 7, so 4.3 < 4.7\n• 5.23 vs 5.27: Same whole (5) and tenths (2), compare hundredths: 3 < 7, so 5.23 < 5.27\n\n**Ordering Decimals:**\nTo arrange in ascending order: 0.5, 0.35, 0.53, 0.3\nMake all same length: 0.50, 0.35, 0.53, 0.30\nOrder: 0.30 < 0.35 < 0.50 < 0.53\n\n**Between Any Two Decimals:**\nThere are infinitely many decimals between any two decimals! Between 0.1 and 0.2: 0.11, 0.12, 0.15, 0.19, etc."
      },
      {
        "name": "3.7 Addition and Subtraction of Decimals",
        "content": "Adding and subtracting decimals follows the same rules as whole numbers — just make sure to line up the decimal points!\n\n**Rules for Adding Decimals:**\n1. Write numbers one below the other, aligning decimal points\n2. Add trailing zeros if needed to make decimal places equal\n3. Add as usual, column by column from right to left\n4. Place the decimal point in the answer directly below\n\n**Examples:**\n• 23.45 + 7.3 = 23.45 + 7.30 = 30.75\n• 0.6 + 0.04 = 0.60 + 0.04 = 0.64\n• 134.5 + 28.75 = 134.50 + 28.75 = 163.25\n\n**Rules for Subtracting Decimals:**\nSame alignment rules as addition. Borrow from the left when needed, just like with whole numbers.\n\n**Examples:**\n• 45.8 - 23.5 = 22.3\n• 10 - 3.75 = 10.00 - 3.75 = 6.25\n• 5.2 - 0.86 = 5.20 - 0.86 = 4.34\n\n**Real-World Problems:**\n• You have Rs. 100. You spend Rs. 45.50. Balance = 100.00 - 45.50 = Rs. 54.50\n• Your height last year was 1.32 m. Now it's 1.40 m. You grew 0.08 m = 8 cm\n\n**Practice Tip:** Always align decimal points vertically. If a number has no decimal point (like 10), write it as 10.00."
      },
      {
        "name": "3.8 More on the Decimal System",
        "content": "The decimal system extends infinitely in both directions — larger place values to the left and smaller ones to the right.\n\n**The Pattern of Ten:**\nMoving left: each place is 10 times the previous\n... 1000, 100, 10, 1, 0.1, 0.01, 0.001 ...\nMoving right: each place is 1/10 of the previous\n\n**Thousandths:**\n• 0.001 = one-thousandth = 1/1000\n• 0.025 = twenty-five thousandths\n• 3.142 = 3 ones + 1 tenth + 4 hundredths + 2 thousandths\n\n**Decimal Equivalents of Common Fractions:**\n• 1/2 = 0.5\n• 1/4 = 0.25\n• 3/4 = 0.75\n• 1/5 = 0.2\n• 1/8 = 0.125\n• 1/3 = 0.333... (repeating)\n\n**Interesting Facts:**\n• The number π (pi) = 3.14159... has infinite non-repeating decimals\n• Some fractions give terminating decimals (1/4 = 0.25) while others give repeating decimals (1/3 = 0.333...)\n• A fraction gives a terminating decimal only when its denominator (in lowest form) has no prime factors other than 2 and 5\n\n**Practice Tip:** Memorize common fraction-decimal equivalents. They come up frequently in calculations and make mental math much faster!"
      }
    ],
    "questions": [
      {
        "q": "What is 1/10 in decimal form?",
        "options": [
          "0.01",
          "0.1",
          "1.0",
          "10"
        ],
        "answer": 1
      },
      {
        "q": "How many tenths make one whole?",
        "options": [
          "5",
          "10",
          "100",
          "1000"
        ],
        "answer": 1
      },
      {
        "q": "What is 3/100 in decimal?",
        "options": [
          "0.3",
          "0.03",
          "3.0",
          "0.003"
        ],
        "answer": 1
      },
      {
        "q": "5 cm = ___ m",
        "options": [
          "0.5",
          "0.05",
          "0.005",
          "5.0"
        ],
        "answer": 1
      },
      {
        "q": "Which is greater: 0.5 or 0.35?",
        "options": [
          "0.5",
          "0.35",
          "Both equal",
          "Cannot compare"
        ],
        "answer": 0
      },
      {
        "q": "23.45 + 7.3 = ?",
        "options": [
          "30.75",
          "30.48",
          "96.45",
          "24.18"
        ],
        "answer": 0
      },
      {
        "q": "What is the place value of 6 in 3.46?",
        "options": [
          "6 tenths",
          "6 hundredths",
          "6 ones",
          "6 thousandths"
        ],
        "answer": 1
      },
      {
        "q": "10 - 3.75 = ?",
        "options": [
          "7.25",
          "6.25",
          "6.75",
          "7.75"
        ],
        "answer": 1
      },
      {
        "q": "1 km 250 m = ___ km",
        "options": [
          "1.25",
          "1.250",
          "1.025",
          "Both A and B"
        ],
        "answer": 3
      },
      {
        "q": "0.5 = 0.50 is:",
        "options": [
          "True",
          "False",
          "Sometimes",
          "Undefined"
        ],
        "answer": 0
      },
      {
        "q": "Which decimal is between 0.3 and 0.4?",
        "options": [
          "0.25",
          "0.35",
          "0.45",
          "0.29"
        ],
        "answer": 1
      },
      {
        "q": "750 g = ___ kg",
        "options": [
          "7.50",
          "0.750",
          "75.0",
          "0.075"
        ],
        "answer": 1
      },
      {
        "q": "Arrange in ascending order: 0.5, 0.35, 0.53",
        "options": [
          "0.5, 0.35, 0.53",
          "0.35, 0.5, 0.53",
          "0.53, 0.5, 0.35",
          "0.35, 0.53, 0.5"
        ],
        "answer": 1
      },
      {
        "q": "0.6 + 0.04 = ?",
        "options": [
          "0.10",
          "0.64",
          "1.0",
          "0.604"
        ],
        "answer": 1
      },
      {
        "q": "What is 1/4 as a decimal?",
        "options": [
          "0.4",
          "0.25",
          "0.14",
          "0.75"
        ],
        "answer": 1
      },
      {
        "q": "3 m 5 cm = ___ m",
        "options": [
          "3.5",
          "3.05",
          "3.005",
          "35"
        ],
        "answer": 1
      },
      {
        "q": "45.8 - 23.5 = ?",
        "options": [
          "22.3",
          "23.3",
          "21.3",
          "22.5"
        ],
        "answer": 0
      },
      {
        "q": "How many hundredths are in 0.3?",
        "options": [
          "3",
          "30",
          "300",
          "0.3"
        ],
        "answer": 1
      },
      {
        "q": "5.2 - 0.86 = ?",
        "options": [
          "4.34",
          "4.44",
          "4.66",
          "4.36"
        ],
        "answer": 0
      },
      {
        "q": "The decimal 0.05 means:",
        "options": [
          "5 tenths",
          "5 hundredths",
          "5 thousandths",
          "5 ones"
        ],
        "answer": 1
      },
      {
        "q": "2 kg 50 g = ___ kg",
        "options": [
          "2.50",
          "2.050",
          "2.005",
          "2.5"
        ],
        "answer": 1
      },
      {
        "q": "Which is smallest: 0.5, 0.05, 0.005?",
        "options": [
          "0.5",
          "0.05",
          "0.005",
          "All are equal"
        ],
        "answer": 2
      },
      {
        "q": "0.125 in fraction form is:",
        "options": [
          "1/4",
          "1/8",
          "1/5",
          "1/125"
        ],
        "answer": 1
      },
      {
        "q": "134.5 + 28.75 = ?",
        "options": [
          "163.25",
          "162.25",
          "163.75",
          "422.5"
        ],
        "answer": 0
      },
      {
        "q": "1 paisa = ___ rupees",
        "options": [
          "0.1",
          "0.01",
          "0.001",
          "1"
        ],
        "answer": 1
      },
      {
        "q": "The expanded form of 4.56 is:",
        "options": [
          "4+5+6",
          "4+0.5+0.06",
          "4+56",
          "4+0.56"
        ],
        "answer": 1
      },
      {
        "q": "Which fraction gives a terminating decimal?",
        "options": [
          "1/3",
          "1/7",
          "1/4",
          "1/6"
        ],
        "answer": 2
      },
      {
        "q": "1.8 + 2.75 = ?",
        "options": [
          "4.55",
          "4.45",
          "3.55",
          "4.53"
        ],
        "answer": 0
      },
      {
        "q": "0.333... is the decimal for:",
        "options": [
          "1/2",
          "1/3",
          "1/4",
          "3/10"
        ],
        "answer": 1
      },
      {
        "q": "Rs. 100 - Rs. 45.50 = ?",
        "options": [
          "Rs. 54.50",
          "Rs. 55.50",
          "Rs. 55.00",
          "Rs. 45.50"
        ],
        "answer": 0
      },
      {
        "q": "Between 2.3 and 2.4, there are:",
        "options": [
          "No numbers",
          "1 number",
          "9 numbers",
          "Infinite numbers"
        ],
        "answer": 3
      },
      {
        "q": "7.05 means:",
        "options": [
          "7 and 5 tenths",
          "7 and 5 hundredths",
          "7 and 50 hundredths",
          "7 and 5 thousandths"
        ],
        "answer": 1
      },
      {
        "q": "What is 3/4 as a decimal?",
        "options": [
          "0.34",
          "0.75",
          "0.25",
          "3.4"
        ],
        "answer": 1
      },
      {
        "q": "1 L 200 mL = ___ L",
        "options": [
          "1.200",
          "1.2",
          "12.00",
          "Both A and B"
        ],
        "answer": 3
      },
      {
        "q": "4.3 vs 4.7: which is larger?",
        "options": [
          "4.3",
          "4.7",
          "Same",
          "Cannot tell"
        ],
        "answer": 1
      },
      {
        "q": "What is 1/5 as a decimal?",
        "options": [
          "0.15",
          "0.5",
          "0.2",
          "0.05"
        ],
        "answer": 2
      },
      {
        "q": "The value of pi (3.14159...) is:",
        "options": [
          "Terminating",
          "Repeating",
          "Non-terminating non-repeating",
          "A whole number"
        ],
        "answer": 2
      },
      {
        "q": "25/100 = ?",
        "options": [
          "2.5",
          "0.25",
          "25",
          "0.025"
        ],
        "answer": 1
      },
      {
        "q": "0.50 and 0.5 are:",
        "options": [
          "Equal",
          "0.50 is greater",
          "0.5 is greater",
          "Cannot compare"
        ],
        "answer": 0
      },
      {
        "q": "Height grew from 1.32 m to 1.40 m. Growth = ?",
        "options": [
          "0.8 m",
          "0.08 m",
          "8 m",
          "0.12 m"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": 4,
    "number": "4",
    "title": "Expressions Using Letter-Numbers",
    "description": "Introduction to algebraic thinking - using letters to represent unknowns, forming expressions, simplifying algebraic expressions, and discovering patterns",
    "topics": [
      {
        "name": "4.1 The Notion of Letter-Numbers",
        "content": "In mathematics, we often use letters like x, y, n, a, b to represent numbers we don't know yet. These are called variables or letter-numbers.\n\n**Why Use Letters?**\nLetters help us write general rules that work for ALL numbers, not just specific ones. For example:\n• 'Any number plus zero equals that number' can be written as: a + 0 = a\n• 'The perimeter of a square with side s' can be written as: P = 4s\n\n**Letters as Unknowns:**\nWhen we write x + 3 = 7, the letter x represents an unknown number (which is 4).\n\n**Letters as Variables:**\nWhen we write 2n + 1, n can take different values, and the expression gives different results:\n• n = 1: 2(1) + 1 = 3\n• n = 2: 2(2) + 1 = 5\n• n = 3: 2(3) + 1 = 7\nThis generates the pattern of odd numbers!\n\n**Rules for Writing Letter-Numbers:**\n• We usually write the number before the letter: 3x (not x3)\n• We don't write the multiplication sign: 3x means 3 × x\n• 1×x is written as just x (not 1x)\n\n**Practice Tip:** Think of a letter as a box that can hold any number. When you see 'x', imagine a box — whatever number goes in that box, the expression tells you what to do with it."
      },
      {
        "name": "4.2 Revisiting Arithmetic Expressions",
        "content": "Before jumping into algebraic expressions, let's revisit how arithmetic expressions work and see how they connect to algebraic thinking.\n\n**From Arithmetic to Algebra:**\nArithmetic: 5 + 3 = 8 (specific numbers, specific answer)\nAlgebra: a + b = ? (general expression, answer depends on values of a and b)\n\n**Translating Words to Expressions:**\n• 'A number increased by 5' → x + 5\n• 'Twice a number' → 2x\n• 'Three less than a number' → x – 3\n• 'A number divided by 4' → x/4\n• 'The sum of two numbers' → a + b\n• 'Product of a number and 7' → 7x\n\n**Evaluating Expressions:**\nTo find the value of an expression for a given value of the variable, substitute (replace) the letter with the number:\nIf x = 4, then 3x + 2 = 3(4) + 2 = 12 + 2 = 14\n\n**Forming Expressions from Patterns:**\n• Matchstick squares: 1 square needs 4 sticks, 2 squares need 7, 3 need 10...\n• Pattern: 3n + 1 sticks for n squares\n\n**Practice Tip:** Practice converting word phrases to mathematical expressions daily. This skill is the foundation of equation solving!"
      },
      {
        "name": "4.3 Omission of the Multiplication Symbol",
        "content": "In algebra, we simplify how we write expressions by dropping the multiplication sign (×) between numbers and letters.\n\n**Convention Rules:**\n• 3 × x is written as 3x\n• a × b is written as ab\n• 2 × a × b is written as 2ab\n• 1 × x is written as x (not 1x)\n• x × x is written as x² (x squared)\n\n**Important:** We ONLY omit the multiplication sign when at least one factor is a letter. We NEVER write 35 to mean 3 × 5 (that would be thirty-five!).\n\n**Coefficient:**\nIn 5x, the number 5 is called the coefficient of x. It tells us how many x's we have.\n• In 3ab: coefficient is 3\n• In x (same as 1x): coefficient is 1\n• In -2y: coefficient is -2\n\n**Terms:**\nParts of an expression separated by + or – signs are called terms.\nIn 3x + 5y – 2: the terms are 3x, 5y, and –2\n\n**Like Terms:**\nTerms with the same variables are called like terms:\n• 3x and 5x are like terms (both have x)\n• 3x and 3y are NOT like terms (different variables)\n• 4ab and 7ab are like terms\n\n**Practice Tip:** When reading algebraic expressions, always remember that letters next to each other (or next to numbers) means multiplication."
      },
      {
        "name": "4.4 Simplification of Algebraic Expressions",
        "content": "Simplification means combining like terms to make an expression shorter and easier to work with.\n\n**Combining Like Terms:**\n• 3x + 5x = 8x (combine the x terms: 3 + 5 = 8)\n• 7a – 3a = 4a (7 – 3 = 4)\n• 4x + 3y + 2x + y = 6x + 4y (combine x terms and y terms separately)\n\n**Step-by-Step Method:**\n1. Identify like terms\n2. Group like terms together\n3. Combine the coefficients\n\n**Example:** Simplify 5a + 3b – 2a + 7b\n= (5a – 2a) + (3b + 7b)\n= 3a + 10b\n\n**With Constants:**\n2x + 5 + 3x + 8 = (2x + 3x) + (5 + 8) = 5x + 13\n\n**Cannot Simplify:**\n3x + 4y cannot be simplified further (different variables = unlike terms)\n5x + 3 cannot be simplified (x term and constant are unlike)\n\n**Common Mistakes:**\n• 3x + 4y ≠ 7xy (WRONG! You can't combine unlike terms)\n• x + x = 2x, NOT x² (adding, not multiplying)\n• 2x × 3x = 6x², NOT 6x (multiplying gives higher power)\n\n**Practice Tip:** Underline like terms with the same color or mark, then combine them. This visual approach helps avoid mistakes."
      },
      {
        "name": "4.5 Pick Patterns and Reveal Relationships",
        "content": "One of the most powerful uses of algebraic expressions is describing number patterns and geometric relationships.\n\n**Number Patterns:**\n• Even numbers: 2, 4, 6, 8... → Formula: 2n (where n = 1, 2, 3...)\n• Odd numbers: 1, 3, 5, 7... → Formula: 2n – 1\n• Multiples of 5: 5, 10, 15, 20... → Formula: 5n\n• Square numbers: 1, 4, 9, 16... → Formula: n²\n\n**Matchstick Patterns:**\n• Triangle pattern: 3, 5, 7, 9... sticks → Formula: 2n + 1\n• Square pattern: 4, 7, 10, 13... sticks → Formula: 3n + 1\n• Pentagon pattern: 5, 9, 13, 17... sticks → Formula: 4n + 1\n\n**Geometric Formulas:**\n• Perimeter of square = 4s (s = side)\n• Perimeter of rectangle = 2(l + b) or 2l + 2b\n• Perimeter of equilateral triangle = 3s\n• Area of square = s²\n• Area of rectangle = l × b\n\n**How to Find a Pattern Formula:**\n1. Write out first few terms with their position numbers\n2. Look for the relationship between position (n) and term value\n3. Test your formula with the known terms\n\n**Practice Tip:** When looking for patterns, always calculate the differences between consecutive terms. If the difference is constant, the formula is linear (an + b)."
      }
    ],
    "questions": [
      {
        "q": "If x = 3, what is 2x + 5?",
        "options": [
          "8",
          "11",
          "10",
          "16"
        ],
        "answer": 1
      },
      {
        "q": "3 x y is written in algebra as:",
        "options": [
          "3y",
          "y3",
          "3+y",
          "3-y"
        ],
        "answer": 0
      },
      {
        "q": "In the expression 5x, the coefficient of x is:",
        "options": [
          "x",
          "5",
          "5x",
          "1"
        ],
        "answer": 1
      },
      {
        "q": "Simplify: 3x + 5x",
        "options": [
          "8x",
          "8x2",
          "15x",
          "35x"
        ],
        "answer": 0
      },
      {
        "q": "Which represents 'a number increased by 5'?",
        "options": [
          "x - 5",
          "5x",
          "x + 5",
          "x/5"
        ],
        "answer": 2
      },
      {
        "q": "Simplify: 4a + 3b - 2a + b",
        "options": [
          "2a + 4b",
          "6a + 4b",
          "2a + 2b",
          "6ab"
        ],
        "answer": 0
      },
      {
        "q": "If n = 4, what is n squared?",
        "options": [
          "8",
          "12",
          "16",
          "44"
        ],
        "answer": 2
      },
      {
        "q": "The perimeter of a square with side s is:",
        "options": [
          "s + 4",
          "4s",
          "s x s",
          "2s"
        ],
        "answer": 1
      },
      {
        "q": "'Twice a number' is written as:",
        "options": [
          "x + 2",
          "x - 2",
          "2x",
          "x/2"
        ],
        "answer": 2
      },
      {
        "q": "3x + 4y can be simplified to:",
        "options": [
          "7xy",
          "7x",
          "7y",
          "Cannot be simplified"
        ],
        "answer": 3
      },
      {
        "q": "x + x equals:",
        "options": [
          "x squared",
          "2x",
          "xx",
          "x"
        ],
        "answer": 1
      },
      {
        "q": "If a = 2, b = 3, what is ab?",
        "options": [
          "5",
          "6",
          "23",
          "1"
        ],
        "answer": 1
      },
      {
        "q": "The formula for even numbers is:",
        "options": [
          "n + 2",
          "2n",
          "n/2",
          "2n + 1"
        ],
        "answer": 1
      },
      {
        "q": "Simplify: 2x + 5 + 3x + 8",
        "options": [
          "5x + 13",
          "5x + 58",
          "13x + 5",
          "10x + 13"
        ],
        "answer": 0
      },
      {
        "q": "The formula for odd numbers is:",
        "options": [
          "2n",
          "2n + 1",
          "2n - 1",
          "n + 1"
        ],
        "answer": 2
      },
      {
        "q": "1 x x is written as:",
        "options": [
          "1x",
          "x",
          "x1",
          "11x"
        ],
        "answer": 1
      },
      {
        "q": "Perimeter of rectangle with length l and breadth b:",
        "options": [
          "l + b",
          "lb",
          "2(l+b)",
          "4(l+b)"
        ],
        "answer": 2
      },
      {
        "q": "If y = 5, what is 3y - 7?",
        "options": [
          "8",
          "22",
          "15",
          "1"
        ],
        "answer": 0
      },
      {
        "q": "Which are like terms?",
        "options": [
          "3x and 3y",
          "5a and 7a",
          "2x and 2",
          "ab and a"
        ],
        "answer": 1
      },
      {
        "q": "In 3x + 5y - 2, how many terms are there?",
        "options": [
          "1",
          "2",
          "3",
          "5"
        ],
        "answer": 2
      },
      {
        "q": "2x x 3x = ?",
        "options": [
          "5x",
          "6x",
          "6x squared",
          "5x squared"
        ],
        "answer": 2
      },
      {
        "q": "Matchstick pattern 4, 7, 10, 13... formula is:",
        "options": [
          "4n",
          "3n + 1",
          "n + 3",
          "4n + 3"
        ],
        "answer": 1
      },
      {
        "q": "If x = 0, what is 5x + 3?",
        "options": [
          "0",
          "3",
          "5",
          "8"
        ],
        "answer": 1
      },
      {
        "q": "Area of square with side s:",
        "options": [
          "4s",
          "2s",
          "s squared",
          "s + s"
        ],
        "answer": 2
      },
      {
        "q": "Simplify: 7a - 3a + 2a",
        "options": [
          "6a",
          "2a",
          "12a",
          "7a"
        ],
        "answer": 0
      },
      {
        "q": "'Three less than a number' is:",
        "options": [
          "3 - x",
          "x - 3",
          "3x",
          "x/3"
        ],
        "answer": 1
      },
      {
        "q": "If a = 5, what is a squared + 1?",
        "options": [
          "11",
          "26",
          "36",
          "51"
        ],
        "answer": 1
      },
      {
        "q": "Simplify: 3(x + 2)",
        "options": [
          "3x + 2",
          "3x + 6",
          "x + 6",
          "3x + 5"
        ],
        "answer": 1
      },
      {
        "q": "Which formula gives 1, 4, 9, 16...?",
        "options": [
          "n + 3",
          "4n",
          "n squared",
          "2n"
        ],
        "answer": 2
      },
      {
        "q": "In the expression -2y, the coefficient is:",
        "options": [
          "2",
          "-2",
          "y",
          "-y"
        ],
        "answer": 1
      },
      {
        "q": "Can 5x + 3 be simplified further?",
        "options": [
          "Yes, to 8x",
          "Yes, to 8",
          "Yes, to 15x",
          "No"
        ],
        "answer": 3
      },
      {
        "q": "If x = 2, y = 3, what is x + 2y?",
        "options": [
          "7",
          "8",
          "10",
          "12"
        ],
        "answer": 1
      },
      {
        "q": "Simplify: 4x + 3x + 2y + 5y",
        "options": [
          "7x + 7y",
          "14xy",
          "7x + 5y",
          "4x + 7y"
        ],
        "answer": 0
      },
      {
        "q": "The constant term in 5x + 3 is:",
        "options": [
          "5",
          "x",
          "3",
          "5x"
        ],
        "answer": 2
      },
      {
        "q": "Perimeter of equilateral triangle with side a:",
        "options": [
          "a + 3",
          "3a",
          "a squared",
          "6a"
        ],
        "answer": 1
      },
      {
        "q": "If x = 10, what is x/2 + 3?",
        "options": [
          "8",
          "6.5",
          "13",
          "53"
        ],
        "answer": 0
      },
      {
        "q": "Simplify: 5(2a + 3) - 4a",
        "options": [
          "6a + 15",
          "10a + 15",
          "6a + 3",
          "14a + 3"
        ],
        "answer": 0
      },
      {
        "q": "x x x is written as:",
        "options": [
          "3x",
          "x + x + x",
          "x cubed",
          "xxx"
        ],
        "answer": 2
      },
      {
        "q": "The next term in 2, 5, 8, 11... is:",
        "options": [
          "12",
          "13",
          "14",
          "15"
        ],
        "answer": 2
      },
      {
        "q": "If p = 4, what is 2p squared?",
        "options": [
          "16",
          "32",
          "64",
          "8"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": 5,
    "number": "5",
    "title": "Parallel and Intersecting Lines",
    "description": "Understanding parallel lines, perpendicular lines, transversals, corresponding and alternate angles, and optical illusions with parallel lines",
    "topics": [
      {
        "name": "5.1 Across the Line",
        "content": "A line extends infinitely in both directions. When we draw a line on paper, we are actually drawing a line segment. This section explores what happens when we cross a line and the angles formed.\n\n**Points and Lines:**\nA point has no dimensions - just a position. A line has one dimension - length (infinite). A line segment has two endpoints and a definite length.\n\n**Angles Formed by Intersecting Lines:**\nWhen two lines cross each other, they form 4 angles at the point of intersection. These angles have special properties:\n• **Vertically opposite angles** are equal\n• **Adjacent angles** on a straight line add up to 180° (supplementary)\n\n**Example:** If two lines intersect and one angle is 60°, then:\n• The vertically opposite angle = 60°\n• The adjacent angles = 180° - 60° = 120°\n\n**Linear Pair:**\nTwo adjacent angles that form a straight line are called a linear pair. They always add up to 180°.\n\n**Real-World Examples:**\n• Scissors form intersecting lines when opened\n• Railroad crossings (X-shaped) show intersecting lines\n• Clock hands intersect at the center\n\n**Practice Tip:** When two lines intersect, you only need to find ONE angle - the rest can be calculated using vertically opposite angles and linear pairs!"
      },
      {
        "name": "5.2 Perpendicular Lines",
        "content": "Perpendicular lines are a special case of intersecting lines where the angle between them is exactly 90° (a right angle).\n\n**Definition:**\nTwo lines are perpendicular if they intersect at right angles (90°). We write: line AB ⊥ line CD\n\n**Properties of Perpendicular Lines:**\n• They form four 90° angles at the intersection point\n• They create four equal angles (all 90°)\n• The symbol for a right angle is a small square at the corner\n\n**Drawing Perpendicular Lines:**\nMethod 1: Using a protractor - draw a line, measure 90° at a point, draw another line\nMethod 2: Using a set square - align one edge with the line, draw along the perpendicular edge\nMethod 3: Paper folding - fold a line onto itself to create a perpendicular crease\n\n**Perpendicular from a Point to a Line:**\nThe shortest distance from a point to a line is always along the perpendicular. This is why we measure the height of a triangle perpendicular to its base.\n\n**Real-World Examples:**\n• Walls are perpendicular to the floor\n• The hands of a clock at 3 o'clock or 9 o'clock\n• The corner of a book, a door frame, a window\n• Cross-roads meeting at right angles\n\n**Practice Tip:** The letter 'L' and '+' symbol naturally show perpendicular lines!"
      },
      {
        "name": "5.3 Between Lines",
        "content": "This section explores what happens in the space between two lines - whether they get closer, farther, or stay the same distance apart.\n\n**Three Possibilities for Two Lines:**\n1. **Intersecting lines:** They meet at exactly one point\n2. **Parallel lines:** They never meet (same distance apart everywhere)\n3. **Coincident lines:** They overlap completely (same line)\n\n**Parallel Lines:**\n• Two lines in the same plane that never intersect\n• They maintain a constant distance between them\n• Symbol: AB ∥ CD (AB is parallel to CD)\n• They go in the same direction\n\n**How to Check if Lines are Parallel:**\n• Measure the distance between them at two different points\n• If the distances are equal, the lines are parallel\n• Use a ruler and set square to verify\n\n**Real-World Examples of Parallel Lines:**\n• Railway tracks\n• Opposite edges of a ruler, book, or door\n• Lines on ruled notebook paper\n• Lanes on a highway\n• Opposite sides of a rectangle\n\n**Important Note:** Parallel lines must be in the same plane. In 3D space, lines can be neither parallel nor intersecting (called skew lines) - like two edges of a box that don't share a face."
      },
      {
        "name": "5.4 Parallel and Perpendicular Lines in Paper Folding",
        "content": "Paper folding is a hands-on way to understand geometric concepts. By folding paper, we can create parallel and perpendicular lines without any measuring tools!\n\n**Creating Perpendicular Lines by Folding:**\n1. Take a rectangular sheet of paper\n2. Fold it so one edge falls exactly on itself\n3. The fold line (crease) is perpendicular to the edge!\n4. Open it up - you have two perpendicular lines\n\n**Creating Parallel Lines by Folding:**\n1. Make a fold (crease 1)\n2. Make another fold perpendicular to crease 1 (crease 2)\n3. Make a third fold perpendicular to crease 2 (crease 3)\n4. Crease 1 and crease 3 are parallel!\n\n**Key Insight:**\nIf two lines are both perpendicular to a third line, then they are parallel to each other. This is a fundamental property of Euclidean geometry.\n\n**Paper Folding Properties:**\n• A fold creates a line of symmetry\n• Folding a line onto itself creates a perpendicular bisector\n• Multiple parallel folds create evenly spaced parallel lines\n\n**Activity:** Take a piece of paper and create a set of parallel lines using only folding (no ruler). You should be able to make 4 or more evenly spaced parallel lines!\n\n**Practice Tip:** Paper folding helps verify geometric constructions - if your drawn perpendicular/parallel lines don't match the fold lines, something needs correction."
      },
      {
        "name": "5.5 Transversals",
        "content": "A transversal is a line that crosses two or more lines at distinct points. When a transversal cuts two lines, it creates 8 angles with special relationships.\n\n**Definition:**\nA transversal is a line that intersects two or more lines at different points. It 'cuts across' the lines.\n\n**Angles Formed:**\nWhen a transversal cuts two lines, it creates:\n• 8 angles in total (4 at each intersection point)\n• 4 interior angles (between the two lines)\n• 4 exterior angles (outside the two lines)\n\n**Naming the Angles:**\nAt each intersection, the four angles are typically labeled using numbers (1-8) or letters. The angles are classified as:\n• **Interior angles:** angles 3, 4, 5, 6 (between the lines)\n• **Exterior angles:** angles 1, 2, 7, 8 (outside the lines)\n• **Co-interior angles:** angles on the same side between the lines (3&5, 4&6)\n\n**Special Case - Parallel Lines with Transversal:**\nWhen the two lines are parallel, the transversal creates angle pairs with special properties (discussed in next sections).\n\n**Real-World Examples:**\n• A road crossing two railway tracks\n• A diagonal line cutting through ruled paper\n• A staircase railing crossing the horizontal steps\n\n**Practice Tip:** When working with transversals, always mark which angles are interior and which are exterior first. This helps identify the special angle pairs."
      },
      {
        "name": "5.6 Corresponding Angles",
        "content": "Corresponding angles are in the same position at each intersection when a transversal cuts two lines. If the lines are parallel, corresponding angles are equal.\n\n**What Are Corresponding Angles?**\nAt each intersection, there are 4 angles. Corresponding angles are the ones in matching positions:\n• Angles 1 and 5 (both above-right of intersection)\n• Angles 2 and 6 (both above-left)\n• Angles 3 and 7 (both below-right)\n• Angles 4 and 8 (both below-left)\n\n**The Corresponding Angles Property:**\nIf two parallel lines are cut by a transversal, then each pair of corresponding angles is equal.\n• ∠1 = ∠5\n• ∠2 = ∠6\n• ∠3 = ∠7\n• ∠4 = ∠8\n\n**Converse:** If corresponding angles are equal, then the lines are parallel. This gives us a way to CHECK if lines are parallel!\n\n**Finding Angles:**\nIf line l ∥ line m and a transversal makes 70° with line l, then:\n• Corresponding angle at line m = 70°\n• Adjacent angle at line l = 110°\n• Corresponding adjacent angle at line m = 110°\n\n**Think of it like:** If you're standing at one intersection facing the transversal, the angle you see is the same as what someone standing at the other intersection (in the same position) would see."
      },
      {
        "name": "5.7 Drawing Parallel Lines",
        "content": "There are several methods to draw parallel lines accurately. This section teaches the construction methods used in geometry.\n\n**Method 1: Using Set Squares**\n1. Place one edge of the set square along the given line\n2. Place a ruler along another edge of the set square\n3. Slide the set square along the ruler to the desired position\n4. Draw along the edge - this line is parallel to the first\n\n**Method 2: Using Ruler and Compass**\n1. Draw the given line l and mark a point P not on l\n2. Draw any transversal through P intersecting l at point Q\n3. At P, construct an angle equal to the angle at Q (corresponding angle)\n4. The new line through P is parallel to l\n\n**Method 3: Using Corresponding Angles**\n1. Draw a transversal to the given line\n2. Measure the angle at the first intersection\n3. Replicate this angle at the desired point on the transversal\n4. The new line is parallel to the given line\n\n**Checking Your Construction:**\n• Measure the distance between the lines at multiple points\n• If the distance is constant, the lines are parallel\n• Use the set square method to verify\n\n**Practice Tip:** When drawing parallel lines with a compass, make sure the compass width doesn't change between the two angle constructions!"
      },
      {
        "name": "5.8 Alternate Angles",
        "content": "Alternate angles are on opposite sides of the transversal and between the two lines. When the lines are parallel, alternate angles are equal.\n\n**Types of Alternate Angles:**\n• **Alternate interior angles:** Between the lines, on opposite sides of the transversal\n  - Angles 3 and 6, Angles 4 and 5\n• **Alternate exterior angles:** Outside the lines, on opposite sides of the transversal\n  - Angles 1 and 8, Angles 2 and 7\n\n**The Alternate Angles Property:**\nIf two parallel lines are cut by a transversal:\n• Alternate interior angles are equal: ∠3 = ∠6, ∠4 = ∠5\n• Alternate exterior angles are equal: ∠1 = ∠8, ∠2 = ∠7\n\n**Co-Interior Angles (Same-Side Interior):**\nCo-interior angles are between the lines and on the SAME side of the transversal.\n• For parallel lines: co-interior angles add up to 180°\n• ∠3 + ∠5 = 180° and ∠4 + ∠6 = 180°\n\n**Example:** If parallel lines are cut by a transversal and one alternate interior angle is 55°, then:\n• The other alternate interior angle = 55°\n• Co-interior angle = 180° - 55° = 125°\n\n**Real-World Application:** The Z-shape made by alternate angles appears in zigzag patterns, staircases, and the letter Z itself! That's why alternate angles are sometimes called 'Z-angles'."
      },
      {
        "name": "5.9 Parallel Illusions",
        "content": "Our eyes can be tricked into thinking parallel lines are not parallel! These optical illusions teach us about perception and the importance of precise measurement.\n\n**Famous Parallel Illusions:**\n• **Zollner Illusion:** Parallel lines crossed by short diagonal lines appear to converge or diverge\n• **Hering Illusion:** Parallel horizontal lines appear curved when crossed by radial lines\n• **Cafe Wall Illusion:** Parallel horizontal lines appear slanted due to offset black and white tiles\n• **Ponzo Illusion:** Converging lines make parallel objects appear different sizes\n\n**Why Do These Illusions Work?**\nOur brain interprets visual information based on context. When additional lines or patterns surround parallel lines, our brain is 'tricked' into seeing angles and curves that don't exist.\n\n**Lessons from Illusions:**\n1. Visual estimation of parallelism can be unreliable\n2. We need mathematical tools (rulers, protractors, set squares) to verify parallelism\n3. Corresponding angles and alternate angles are reliable tests - not our eyes\n\n**Creating Your Own Illusion:**\nDraw two parallel horizontal lines. Then add short diagonal lines crossing them at different angles. The parallel lines will appear to tilt!\n\n**Connection to Architecture:**\nAncient Greek architects used optical corrections in buildings like the Parthenon. They made columns slightly thicker in the middle and tilted inward to counteract the illusion that straight columns appear thinner in the middle and to lean outward.\n\n**Practice Tip:** When checking if lines are parallel in geometry problems, NEVER rely on how they look. Always use angle properties or measurements!"
      }
    ],
    "questions": [
      {
        "q": "When two lines intersect, vertically opposite angles are:",
        "options": [
          "Supplementary",
          "Equal",
          "Complementary",
          "None of these"
        ],
        "answer": 1
      },
      {
        "q": "If two parallel lines are cut by a transversal and one angle is 65°, its corresponding angle is:",
        "options": [
          "65°",
          "115°",
          "25°",
          "90°"
        ],
        "answer": 0
      },
      {
        "q": "Two lines that never meet and are always the same distance apart are:",
        "options": [
          "Intersecting",
          "Perpendicular",
          "Parallel",
          "Coincident"
        ],
        "answer": 2
      },
      {
        "q": "A right angle measures:",
        "options": [
          "45°",
          "90°",
          "180°",
          "360°"
        ],
        "answer": 1
      },
      {
        "q": "Alternate interior angles for parallel lines are:",
        "options": [
          "Supplementary",
          "Equal",
          "Complementary",
          "Unrelated"
        ],
        "answer": 1
      },
      {
        "q": "A transversal cutting two lines creates how many angles?",
        "options": [
          "4",
          "6",
          "8",
          "12"
        ],
        "answer": 2
      },
      {
        "q": "Co-interior angles for parallel lines add up to:",
        "options": [
          "90°",
          "180°",
          "270°",
          "360°"
        ],
        "answer": 1
      },
      {
        "q": "The symbol for parallel is:",
        "options": [
          "⊥",
          "∥",
          "∠",
          "∆"
        ],
        "answer": 1
      },
      {
        "q": "If a transversal makes 70° with a line, the adjacent angle is:",
        "options": [
          "70°",
          "110°",
          "20°",
          "90°"
        ],
        "answer": 1
      },
      {
        "q": "Perpendicular lines form angles of:",
        "options": [
          "45°",
          "60°",
          "90°",
          "180°"
        ],
        "answer": 2
      },
      {
        "q": "Which of these shows parallel lines in daily life?",
        "options": [
          "Scissors",
          "Railway tracks",
          "Clock hands",
          "Letter X"
        ],
        "answer": 1
      },
      {
        "q": "If two corresponding angles are equal, the lines are:",
        "options": [
          "Perpendicular",
          "Parallel",
          "Intersecting",
          "Coincident"
        ],
        "answer": 1
      },
      {
        "q": "A linear pair of angles adds up to:",
        "options": [
          "90°",
          "180°",
          "270°",
          "360°"
        ],
        "answer": 1
      },
      {
        "q": "Alternate angles are sometimes called:",
        "options": [
          "F-angles",
          "Z-angles",
          "C-angles",
          "X-angles"
        ],
        "answer": 1
      },
      {
        "q": "If one angle of intersecting lines is 40°, the vertically opposite angle is:",
        "options": [
          "140°",
          "40°",
          "50°",
          "320°"
        ],
        "answer": 1
      },
      {
        "q": "Two lines perpendicular to the same line are:",
        "options": [
          "Perpendicular to each other",
          "Parallel to each other",
          "Intersecting",
          "None of these"
        ],
        "answer": 1
      },
      {
        "q": "If co-interior angles are 75° and x°, find x:",
        "options": [
          "75",
          "105",
          "115",
          "85"
        ],
        "answer": 1
      },
      {
        "q": "The shortest distance from a point to a line is:",
        "options": [
          "Along a parallel",
          "Along the perpendicular",
          "Along a diagonal",
          "Along a transversal"
        ],
        "answer": 1
      },
      {
        "q": "How many pairs of corresponding angles are formed by a transversal?",
        "options": [
          "2",
          "4",
          "6",
          "8"
        ],
        "answer": 1
      },
      {
        "q": "If alternate angles are 3x and 60° (lines parallel), x = ?",
        "options": [
          "10",
          "15",
          "20",
          "30"
        ],
        "answer": 2
      },
      {
        "q": "Which illusion makes parallel lines appear curved?",
        "options": [
          "Zollner",
          "Hering",
          "Ponzo",
          "Cafe Wall"
        ],
        "answer": 1
      },
      {
        "q": "Interior angles are between:",
        "options": [
          "The two lines",
          "Outside the lines",
          "On the transversal",
          "At one intersection"
        ],
        "answer": 0
      },
      {
        "q": "If angle 1 = 120° and angle 5 are corresponding, angle 5 = ?",
        "options": [
          "60°",
          "120°",
          "180°",
          "30°"
        ],
        "answer": 1
      },
      {
        "q": "The letter that represents corresponding angles pattern is:",
        "options": [
          "Z",
          "F",
          "C",
          "X"
        ],
        "answer": 1
      },
      {
        "q": "Two angles adding to 90° are:",
        "options": [
          "Supplementary",
          "Complementary",
          "Vertically opposite",
          "Linear pair"
        ],
        "answer": 1
      },
      {
        "q": "If a transversal is perpendicular to one of two parallel lines, it is:",
        "options": [
          "Parallel to the other",
          "Perpendicular to the other too",
          "At 45° to the other",
          "Not related to the other"
        ],
        "answer": 1
      },
      {
        "q": "Angle at 3 o'clock position of a clock is:",
        "options": [
          "60°",
          "90°",
          "120°",
          "180°"
        ],
        "answer": 1
      },
      {
        "q": "If two lines intersect at 90°, all four angles are:",
        "options": [
          "Different",
          "All 90°",
          "Two 90° and two 0°",
          "Unknown"
        ],
        "answer": 1
      },
      {
        "q": "Exterior angles are:",
        "options": [
          "Between the two lines",
          "Outside the two lines",
          "On the transversal",
          "Equal to 90°"
        ],
        "answer": 1
      },
      {
        "q": "Co-interior angles are also called:",
        "options": [
          "Z-angles",
          "F-angles",
          "C-angles or U-angles",
          "X-angles"
        ],
        "answer": 2
      },
      {
        "q": "If lines are NOT parallel, corresponding angles are:",
        "options": [
          "Always equal",
          "Never equal",
          "Not necessarily equal",
          "Always 90°"
        ],
        "answer": 2
      },
      {
        "q": "Paper folding creates a:",
        "options": [
          "Parallel line",
          "Perpendicular bisector",
          "Curve",
          "Circle"
        ],
        "answer": 1
      },
      {
        "q": "How many pairs of alternate interior angles does a transversal create?",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "answer": 1
      },
      {
        "q": "If angle 3 = 55°, its co-interior angle = ?",
        "options": [
          "55°",
          "125°",
          "145°",
          "35°"
        ],
        "answer": 1
      },
      {
        "q": "The Cafe Wall illusion involves:",
        "options": [
          "Circles",
          "Offset tiles making lines look slanted",
          "Curved lines",
          "Missing lines"
        ],
        "answer": 1
      },
      {
        "q": "Perpendicular from point to line gives the ___ distance:",
        "options": [
          "Longest",
          "Shortest",
          "Average",
          "Random"
        ],
        "answer": 1
      },
      {
        "q": "If two angles form a linear pair and one is x°, the other is:",
        "options": [
          "x°",
          "(90-x)°",
          "(180-x)°",
          "(360-x)°"
        ],
        "answer": 2
      },
      {
        "q": "Opposite sides of a rectangle are:",
        "options": [
          "Perpendicular",
          "Parallel",
          "Intersecting",
          "Curved"
        ],
        "answer": 1
      },
      {
        "q": "Adjacent sides of a rectangle are:",
        "options": [
          "Parallel",
          "Perpendicular",
          "Skew",
          "Equal"
        ],
        "answer": 1
      },
      {
        "q": "If vertically opposite angles are 2x and 80°, x = ?",
        "options": [
          "40",
          "80",
          "160",
          "20"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": 6,
    "number": "6",
    "title": "Number Play",
    "description": "Exploring numbers through patterns, parity, grid explorations, the Virahanka-Fibonacci sequence, and cryptarithmetic puzzles",
    "topics": [
      {
        "name": "6.1 Numbers Tell Us Things",
        "content": "Numbers carry information about themselves in their digits. By examining a number's digits, we can discover many properties without doing complex calculations.\n\n**Divisibility Rules:**\n• **By 2:** Last digit is 0, 2, 4, 6, or 8 (even number)\n• **By 3:** Sum of digits is divisible by 3\n• **By 4:** Last two digits form a number divisible by 4\n• **By 5:** Last digit is 0 or 5\n• **By 9:** Sum of digits is divisible by 9\n• **By 10:** Last digit is 0\n• **By 11:** Difference between sum of alternate digits is 0 or divisible by 11\n\n**Digit Sum Properties:**\n• The digit sum of any multiple of 9 is always 9 (or a multiple of 9): 18→1+8=9, 81→8+1=9, 108→1+0+8=9\n• Any number and its digit sum give the same remainder when divided by 9\n\n**Palindromic Numbers:**\nNumbers that read the same forwards and backwards: 121, 1331, 12321\n• All single-digit numbers are palindromes\n• There are 9 two-digit palindromes: 11, 22, 33, ..., 99\n\n**Real-World Use:** Phone numbers, PIN codes, postal codes - numbers tell us location, identity, and much more!\n\n**Practice Tip:** Memorize divisibility rules - they save enormous time in mental math and simplifying fractions."
      },
      {
        "name": "6.2 Picking Parity",
        "content": "Parity refers to whether a number is even or odd. Understanding parity helps solve many mathematical problems without actual computation.\n\n**Even and Odd Numbers:**\n• Even: Divisible by 2 (0, 2, 4, 6, 8, 10, 12...)\n• Odd: Not divisible by 2 (1, 3, 5, 7, 9, 11...)\n• Zero is even!\n\n**Parity Rules for Operations:**\n• Even + Even = Even (4 + 6 = 10)\n• Odd + Odd = Even (3 + 5 = 8)\n• Even + Odd = Odd (4 + 5 = 9)\n• Even × Even = Even\n• Odd × Odd = Odd\n• Even × Odd = Even\n\n**Powerful Parity Arguments:**\n• Can the sum of 5 odd numbers be 100? No! (odd+odd=even, +odd=odd, +odd=even, +odd=odd) - 5 odds always give odd sum\n• Can 15 people shake hands so each person shakes exactly 3 hands? No! (15×3=45 is odd, but handshake count must be even since each handshake involves 2 people)\n\n**Consecutive Number Properties:**\n• Two consecutive numbers: one is even, one is odd\n• Their sum is always odd\n• Their product is always even\n\n**Practice Tip:** Before solving complex problems, check parity first. It can sometimes tell you the answer (or that no answer exists) immediately!"
      },
      {
        "name": "6.3 Some Explorations in Grids",
        "content": "Number grids reveal fascinating patterns when we look at rows, columns, diagonals, and special arrangements of numbers.\n\n**Magic Squares:**\nA magic square is a grid where every row, column, and diagonal adds to the same sum (the magic constant).\n• 3×3 magic square with 1-9: magic constant = 15\n• 4×4 magic square with 1-16: magic constant = 34\n• Formula for n×n magic square using 1 to n²: magic constant = n(n²+1)/2\n\n**Example 3×3 Magic Square:**\n2 7 6\n9 5 1\n4 3 8\nEvery row, column, diagonal = 15\n\n**Number Patterns in Grids:**\n• Multiplication tables form a grid with interesting diagonal patterns\n• Pascal's Triangle can be arranged as a grid with binomial coefficients\n• Sudoku is a 9×9 grid puzzle based on number placement\n\n**Grid Coloring and Paths:**\n• How many paths exist from one corner of a grid to the opposite corner?\n• Chess problems: How many squares can a knight reach in n moves?\n\n**Practice Tip:** When working with magic squares, remember that the center number in a 3×3 magic square using 1-9 is always 5, and the magic constant is always 15."
      },
      {
        "name": "6.4 Nature's Favourite Sequence: The Virahanka-Fibonacci",
        "content": "The Fibonacci sequence (known in India as the Virahanka sequence, named after the ancient Indian mathematician) appears throughout nature and mathematics.\n\n**The Sequence:**\n1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233...\nRule: Each number = sum of the two before it\n\n**Indian Origins:**\nVirahanka (around 700 CE) and later Hemachandra (around 1150 CE) discovered this sequence while studying poetic meters in Sanskrit. It was later studied by Fibonacci in Italy (1202 CE).\n\n**In Nature:**\n• **Sunflower seeds:** Spiral in Fibonacci numbers (21, 34, or 55 spirals)\n• **Pine cones:** Spirals in 8 and 13 rows\n• **Flower petals:** Lilies have 3, buttercups have 5, daisies have 34 or 55\n• **Branching:** Trees often branch in Fibonacci patterns\n• **Shell spirals:** Nautilus shells follow the golden spiral\n\n**The Golden Ratio:**\nWhen you divide consecutive Fibonacci numbers, the ratio approaches 1.618... (called the Golden Ratio, φ):\n8/5 = 1.6, 13/8 = 1.625, 21/13 = 1.615, 34/21 = 1.619...\n\n**Properties:**\n• Sum of first n Fibonacci numbers = F(n+2) – 1\n• Every 3rd number is even, every 4th is divisible by 3, every 5th by 5\n\n**Practice Tip:** Generate the first 20 Fibonacci numbers and check which are even, which are divisible by 3, and verify the patterns!"
      },
      {
        "name": "6.5 Digits in Disguise",
        "content": "Cryptarithmetic puzzles replace digits with letters. Each letter represents a unique digit. Solving these puzzles develops logical reasoning and number sense.\n\n**What is Cryptarithmetic?**\nIn puzzles like SEND + MORE = MONEY, each letter stands for a different digit (0-9). Your job is to figure out which digit each letter represents.\n\n**Solving Strategy:**\n1. Look at the leftmost column first (it often reveals carries)\n2. Note that the leading digit of a number can't be 0\n3. Each letter represents a unique digit\n4. Use logical deduction, not just trial and error\n\n**Example: AB + BA = CDC**\n• A and B are single digits, CDC is a 3-digit number\n• Maximum: 98 + 89 = 187, Minimum: 12 + 21 = 33, so C = 1\n• AB + BA = (10A+B) + (10B+A) = 11(A+B) = 100+10D+1\n• So 11(A+B) must give a number like 1D1\n• If A+B = 10: 11×10 = 110, so D=1, but C=D=1 conflict\n• If A+B = 11: 11×11 = 121, D=2. Works! A=2,B=9 or A=9,B=2 etc.\n\n**Classic Puzzles to Try:**\n• EAT + THAT = APPLE\n• CROSS + ROADS = DANGER\n• BASE + BALL = GAMES\n\n**Practice Tip:** Start with simpler puzzles (2-digit + 2-digit) and work up to harder ones. Always list what you know and use elimination."
      }
    ],
    "questions": [
      {
        "q": "A number divisible by 2 is called:",
        "options": [
          "Odd",
          "Even",
          "Prime",
          "Composite"
        ],
        "answer": 1
      },
      {
        "q": "The digit sum of 108 is:",
        "options": [
          "8",
          "9",
          "10",
          "18"
        ],
        "answer": 1
      },
      {
        "q": "Which number is a palindrome?",
        "options": [
          "123",
          "121",
          "132",
          "312"
        ],
        "answer": 1
      },
      {
        "q": "Even + Odd = ?",
        "options": [
          "Even",
          "Odd",
          "Zero",
          "Cannot determine"
        ],
        "answer": 1
      },
      {
        "q": "The Fibonacci sequence starts with:",
        "options": [
          "0, 1, 1, 2",
          "1, 1, 2, 3",
          "1, 2, 3, 4",
          "Both A and B are accepted"
        ],
        "answer": 3
      },
      {
        "q": "The magic constant of a 3x3 magic square using 1-9 is:",
        "options": [
          "10",
          "12",
          "15",
          "20"
        ],
        "answer": 2
      },
      {
        "q": "Is 0 even or odd?",
        "options": [
          "Even",
          "Odd",
          "Neither",
          "Both"
        ],
        "answer": 0
      },
      {
        "q": "Odd x Odd = ?",
        "options": [
          "Even",
          "Odd",
          "Cannot tell",
          "Zero"
        ],
        "answer": 1
      },
      {
        "q": "Which is divisible by 9?",
        "options": [
          "123",
          "234",
          "432",
          "531"
        ],
        "answer": 3
      },
      {
        "q": "The 7th Fibonacci number is:",
        "options": [
          "8",
          "13",
          "21",
          "34"
        ],
        "answer": 1
      },
      {
        "q": "Can 3 odd numbers add up to 20?",
        "options": [
          "Yes",
          "No",
          "Sometimes",
          "Need more info"
        ],
        "answer": 1
      },
      {
        "q": "What is the divisibility rule for 3?",
        "options": [
          "Last digit divisible by 3",
          "Sum of digits divisible by 3",
          "Last two digits divisible by 3",
          "Number is odd"
        ],
        "answer": 1
      },
      {
        "q": "The Golden Ratio is approximately:",
        "options": [
          "1.414",
          "1.618",
          "2.718",
          "3.14"
        ],
        "answer": 1
      },
      {
        "q": "In a magic square, which sums are equal?",
        "options": [
          "Only rows",
          "Only diagonals",
          "Rows, columns, and diagonals",
          "Only columns"
        ],
        "answer": 2
      },
      {
        "q": "Divisibility rule for 11: check the ___ of alternate digits.",
        "options": [
          "Sum",
          "Product",
          "Difference",
          "Average"
        ],
        "answer": 2
      },
      {
        "q": "Even x Even = ?",
        "options": [
          "Even",
          "Odd",
          "Cannot tell",
          "Prime"
        ],
        "answer": 0
      },
      {
        "q": "The next Fibonacci number after 8, 13 is:",
        "options": [
          "18",
          "20",
          "21",
          "26"
        ],
        "answer": 2
      },
      {
        "q": "Which is divisible by 4?",
        "options": [
          "322",
          "514",
          "732",
          "918"
        ],
        "answer": 2
      },
      {
        "q": "A 2-digit palindrome example is:",
        "options": [
          "12",
          "21",
          "33",
          "45"
        ],
        "answer": 2
      },
      {
        "q": "Sum of two consecutive numbers is always:",
        "options": [
          "Even",
          "Odd",
          "Prime",
          "Composite"
        ],
        "answer": 1
      },
      {
        "q": "In cryptarithmetic, the leading digit of a number cannot be:",
        "options": [
          "1",
          "0",
          "9",
          "5"
        ],
        "answer": 1
      },
      {
        "q": "The center of a 3x3 magic square (1-9) is always:",
        "options": [
          "1",
          "5",
          "9",
          "Any number"
        ],
        "answer": 1
      },
      {
        "q": "How many 2-digit palindromes exist?",
        "options": [
          "5",
          "9",
          "10",
          "18"
        ],
        "answer": 1
      },
      {
        "q": "Sunflower seeds spiral in ___ numbers:",
        "options": [
          "Prime",
          "Even",
          "Fibonacci",
          "Square"
        ],
        "answer": 2
      },
      {
        "q": "Is 1001 divisible by 11?",
        "options": [
          "Yes (1-0+0-1=0)",
          "No",
          "Cannot determine",
          "Only by 7"
        ],
        "answer": 0
      },
      {
        "q": "Product of two consecutive numbers is always:",
        "options": [
          "Odd",
          "Even",
          "Prime",
          "Square"
        ],
        "answer": 1
      },
      {
        "q": "The Virahanka sequence was discovered in:",
        "options": [
          "Greece",
          "India",
          "Italy",
          "China"
        ],
        "answer": 1
      },
      {
        "q": "Which number is divisible by both 2 and 3?",
        "options": [
          "8",
          "9",
          "12",
          "15"
        ],
        "answer": 2
      },
      {
        "q": "In a 4x4 magic square using 1-16, the magic constant is:",
        "options": [
          "20",
          "30",
          "34",
          "40"
        ],
        "answer": 2
      },
      {
        "q": "What digit does each letter represent in cryptarithmetic?",
        "options": [
          "Any digit, repeated allowed",
          "A unique digit 0-9",
          "Only prime digits",
          "Only even digits"
        ],
        "answer": 1
      },
      {
        "q": "Sum of first 6 Fibonacci numbers (1,1,2,3,5,8) is:",
        "options": [
          "18",
          "20",
          "21",
          "23"
        ],
        "answer": 1
      },
      {
        "q": "Is 2024 divisible by 4?",
        "options": [
          "Yes (24 is divisible by 4)",
          "No",
          "Cannot determine",
          "Only by 2"
        ],
        "answer": 0
      },
      {
        "q": "Odd + Odd + Odd = ?",
        "options": [
          "Even",
          "Odd",
          "Cannot tell",
          "Zero"
        ],
        "answer": 1
      },
      {
        "q": "The digit sum of any multiple of 9 is:",
        "options": [
          "Always 9",
          "A multiple of 9",
          "Always odd",
          "Always even"
        ],
        "answer": 1
      },
      {
        "q": "11 x 11 = 121. Is 121 a palindrome?",
        "options": [
          "Yes",
          "No",
          "Cannot determine",
          "Sometimes"
        ],
        "answer": 0
      },
      {
        "q": "Which Fibonacci number is even: 1, 1, 2, 3, 5, 8?",
        "options": [
          "1st and 2nd",
          "3rd and 6th",
          "4th and 5th",
          "All of them"
        ],
        "answer": 1
      },
      {
        "q": "A number divisible by both 3 and 5 is also divisible by:",
        "options": [
          "8",
          "10",
          "15",
          "20"
        ],
        "answer": 2
      },
      {
        "q": "Is the sum of all digits 1 through 9 divisible by 9?",
        "options": [
          "Yes (sum=45, 45/9=5)",
          "No",
          "Cannot determine",
          "Only by 3"
        ],
        "answer": 0
      },
      {
        "q": "The 10th Fibonacci number is:",
        "options": [
          "34",
          "55",
          "89",
          "144"
        ],
        "answer": 1
      },
      {
        "q": "AB + BA = 11(A+B). If the result is 132, then A+B = ?",
        "options": [
          "10",
          "11",
          "12",
          "13"
        ],
        "answer": 2
      }
    ]
  },
  {
    "id": 7,
    "number": "7",
    "title": "A Tale of Three Intersecting Lines",
    "description": "Exploring triangles through construction, types of triangles, properties of sides and angles, and altitude constructions",
    "topics": [
      {
        "name": "7.1 Equilateral Triangles",
        "content": "An equilateral triangle is the most symmetric of all triangles - all three sides are equal and all three angles are 60°.\n\n**Properties of Equilateral Triangles:**\n• All 3 sides are equal in length\n• All 3 angles are equal = 60° each\n• All 3 medians, altitudes, angle bisectors, and perpendicular bisectors are equal\n• It has 3 lines of symmetry\n• Rotational symmetry of order 3 (looks the same after 120°, 240°, 360° rotation)\n\n**Constructing an Equilateral Triangle:**\nGiven side length = 5 cm:\n1. Draw a line segment AB = 5 cm\n2. With compass at A, radius 5 cm, draw an arc above AB\n3. With compass at B, radius 5 cm, draw another arc cutting the first at point C\n4. Join AC and BC\n\n**Area of Equilateral Triangle:**\nArea = (√3/4) × side²\nFor side = 6 cm: Area = (√3/4) × 36 = 9√3 ≈ 15.59 cm²\n\n**Perimeter:** P = 3 × side\n\n**In Nature and Design:**\n• Honeycomb cells are made of equilateral triangles\n• The yield sign is an equilateral triangle\n• Many logos use equilateral triangles for balance and symmetry\n\n**Practice Tip:** When constructing equilateral triangles with compass, make sure the compass opening stays the SAME as the side length throughout."
      },
      {
        "name": "7.2 Constructing a Triangle When its Sides are Known",
        "content": "When all three sides of a triangle are given (SSS - Side-Side-Side), we can construct it uniquely using ruler and compass.\n\n**SSS Construction Method:**\nGiven sides a = 5 cm, b = 4 cm, c = 6 cm:\n1. Draw the longest side as base: AB = 6 cm (side c)\n2. With compass at A, radius = 4 cm (side b), draw an arc\n3. With compass at B, radius = 5 cm (side a), draw an arc\n4. Mark the intersection point as C\n5. Join AC and BC to complete the triangle\n\n**Triangle Inequality Rule:**\nNot any three lengths can form a triangle! The sum of any two sides must be greater than the third side:\n• a + b > c\n• b + c > a\n• a + c > b\n\n**Examples:**\n• 3, 4, 5 - Valid! (3+4>5, 4+5>3, 3+5>4)\n• 1, 2, 5 - Invalid! (1+2=3 < 5)\n• 5, 5, 5 - Valid! (equilateral)\n• 3, 3, 6 - Invalid! (3+3=6, not greater than 6)\n\n**Why SSS Gives a Unique Triangle:**\nWhen all three sides are fixed, there's only ONE possible triangle (up to position and orientation). This is because the arcs in step 2 and 3 can only intersect at one point above the base.\n\n**Practice Tip:** Always check the triangle inequality before attempting construction. If it fails, tell your teacher the triangle is impossible!"
      },
      {
        "name": "7.3 Construction When Some Sides and Angles are Known",
        "content": "We can construct triangles when given combinations of sides and angles: SAS (Side-Angle-Side) or ASA (Angle-Side-Angle).\n\n**SAS Construction:**\nGiven: Two sides and the included angle (the angle between them)\nExample: a = 5 cm, b = 4 cm, included angle C = 60°\n1. Draw one side: AB = 5 cm\n2. At point A, measure angle of 60° using protractor\n3. Along the angle ray, mark AC = 4 cm\n4. Join B to C\n\n**ASA Construction:**\nGiven: Two angles and the included side (the side between them)\nExample: Angle A = 50°, Angle B = 70°, side AB = 6 cm\n1. Draw AB = 6 cm\n2. At A, construct angle of 50°\n3. At B, construct angle of 70°\n4. The rays from A and B meet at C\n\n**Important Note:**\nThe third angle = 180° - 50° - 70° = 60° (angle sum property)\n\n**Why These Give Unique Triangles:**\nSAS and ASA each fix a triangle completely. Given the same measurements, everyone will construct the exact same triangle.\n\n**Angle Sum Property:**\nThe three angles of any triangle always add up to 180°. This is a fundamental property used in many geometry problems.\n\n**Practice Tip:** When using a protractor, make sure the center is exactly on the vertex and the base line aligns with one side of the angle."
      },
      {
        "name": "7.4 Constructions Related to Altitudes of Triangles",
        "content": "An altitude of a triangle is a perpendicular line from a vertex to the opposite side (or its extension). Every triangle has three altitudes.\n\n**What is an Altitude?**\n• A line segment from a vertex perpendicular to the opposite side\n• It represents the 'height' of the triangle from that vertex\n• Every triangle has exactly 3 altitudes\n\n**Constructing an Altitude:**\n1. From vertex A, you need a perpendicular to side BC\n2. With compass at A, draw arcs cutting BC at two points P and Q\n3. With compass at P, draw an arc below BC\n4. With compass at Q (same radius), draw an arc crossing the previous one at point D\n5. Join AD - this line is perpendicular to BC through A\n6. Mark the foot of the altitude where AD meets BC as H\n7. AH is the altitude from vertex A\n\n**Orthocentre:**\nThe three altitudes of a triangle always meet at a single point called the orthocentre (H).\n• For acute triangle: H is inside the triangle\n• For right triangle: H is at the vertex of the right angle\n• For obtuse triangle: H is outside the triangle\n\n**Area Connection:**\nArea = ½ × base × height (altitude)\nSince any side can be the base, each altitude gives the same area!\n\n**Practice Tip:** When drawing altitudes of obtuse triangles, extend the base line beyond the triangle so the perpendicular from the vertex can reach it."
      },
      {
        "name": "7.5 Types of Triangles",
        "content": "Triangles are classified based on their sides and angles. Understanding these classifications helps identify properties and solve problems quickly.\n\n**Classification by Sides:**\n• **Equilateral:** All 3 sides equal (also all angles = 60°)\n• **Isosceles:** Exactly 2 sides equal (the angles opposite equal sides are also equal)\n• **Scalene:** All 3 sides different (all angles different too)\n\n**Classification by Angles:**\n• **Acute:** All 3 angles less than 90°\n• **Right:** One angle exactly 90° (the side opposite the right angle is the hypotenuse)\n• **Obtuse:** One angle greater than 90°\n\n**Special Combinations:**\n• Right isosceles: 90°, 45°, 45° triangle (two equal sides)\n• Equilateral is always acute (60°, 60°, 60°)\n• A triangle CANNOT be both right and obtuse\n• A triangle CANNOT have more than one right angle or more than one obtuse angle\n\n**Angle Sum Property:**\nSum of all angles = 180°. This limits possible angle combinations:\n• Maximum one angle can be ≥ 90°\n• Two angles of a triangle must always be acute\n\n**Exterior Angle Theorem:**\nAn exterior angle of a triangle equals the sum of the two non-adjacent interior angles.\n\n**Practice Tip:** To quickly classify a triangle, check: are any sides equal? Then check: are any angles 90° or more?"
      }
    ],
    "questions": [
      {
        "q": "An equilateral triangle has all angles equal to:",
        "options": [
          "45°",
          "60°",
          "90°",
          "120°"
        ],
        "answer": 1
      },
      {
        "q": "The sum of angles in a triangle is:",
        "options": [
          "90°",
          "180°",
          "270°",
          "360°"
        ],
        "answer": 1
      },
      {
        "q": "Can sides 2, 3, and 6 form a triangle?",
        "options": [
          "Yes",
          "No (2+3 < 6)",
          "Sometimes",
          "Only right triangle"
        ],
        "answer": 1
      },
      {
        "q": "A triangle with all different sides is:",
        "options": [
          "Equilateral",
          "Isosceles",
          "Scalene",
          "Right"
        ],
        "answer": 2
      },
      {
        "q": "How many altitudes does a triangle have?",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "answer": 2
      },
      {
        "q": "In a right triangle, the longest side is called:",
        "options": [
          "Base",
          "Height",
          "Hypotenuse",
          "Median"
        ],
        "answer": 2
      },
      {
        "q": "An isosceles triangle has:",
        "options": [
          "All sides equal",
          "Two sides equal",
          "No sides equal",
          "All angles 60°"
        ],
        "answer": 1
      },
      {
        "q": "If two angles of a triangle are 50° and 60°, the third is:",
        "options": [
          "50°",
          "60°",
          "70°",
          "80°"
        ],
        "answer": 2
      },
      {
        "q": "SSS stands for:",
        "options": [
          "Side-Side-Side",
          "Sum-Side-Sum",
          "Side-Sum-Side",
          "Same-Same-Same"
        ],
        "answer": 0
      },
      {
        "q": "The point where all 3 altitudes meet is the:",
        "options": [
          "Centroid",
          "Circumcentre",
          "Orthocentre",
          "Incentre"
        ],
        "answer": 2
      },
      {
        "q": "An equilateral triangle has how many lines of symmetry?",
        "options": [
          "1",
          "2",
          "3",
          "6"
        ],
        "answer": 2
      },
      {
        "q": "Can a triangle have two right angles?",
        "options": [
          "Yes",
          "No",
          "Sometimes",
          "Only isosceles"
        ],
        "answer": 1
      },
      {
        "q": "Perimeter of equilateral triangle with side 8 cm:",
        "options": [
          "16 cm",
          "24 cm",
          "32 cm",
          "64 cm"
        ],
        "answer": 1
      },
      {
        "q": "A triangle with angles 90°, 45°, 45° is:",
        "options": [
          "Right isosceles",
          "Right scalene",
          "Equilateral",
          "Obtuse"
        ],
        "answer": 0
      },
      {
        "q": "Can sides 3, 4, 5 form a triangle?",
        "options": [
          "Yes",
          "No",
          "Only right triangle",
          "Both A and C"
        ],
        "answer": 3
      },
      {
        "q": "In an obtuse triangle, the orthocentre lies:",
        "options": [
          "Inside",
          "On a vertex",
          "Outside",
          "On a side"
        ],
        "answer": 2
      },
      {
        "q": "SAS construction needs:",
        "options": [
          "3 sides",
          "2 sides and included angle",
          "2 angles and included side",
          "3 angles"
        ],
        "answer": 1
      },
      {
        "q": "An exterior angle of a triangle equals:",
        "options": [
          "Sum of all interior angles",
          "Sum of two non-adjacent interior angles",
          "The adjacent interior angle",
          "180°"
        ],
        "answer": 1
      },
      {
        "q": "Area of triangle = ?",
        "options": [
          "base x height",
          "1/2 x base x height",
          "2 x base x height",
          "base + height"
        ],
        "answer": 1
      },
      {
        "q": "If exterior angle is 110°, the adjacent interior angle is:",
        "options": [
          "110°",
          "70°",
          "90°",
          "180°"
        ],
        "answer": 1
      },
      {
        "q": "Triangle inequality states that sum of any two sides must be:",
        "options": [
          "Equal to third side",
          "Less than third side",
          "Greater than third side",
          "Double the third side"
        ],
        "answer": 2
      },
      {
        "q": "A triangle with one angle > 90° is:",
        "options": [
          "Acute",
          "Right",
          "Obtuse",
          "Equilateral"
        ],
        "answer": 2
      },
      {
        "q": "How many unique triangles can SSS give?",
        "options": [
          "0",
          "1",
          "2",
          "Infinite"
        ],
        "answer": 1
      },
      {
        "q": "In a right triangle, orthocentre is at:",
        "options": [
          "Centre",
          "The right angle vertex",
          "Outside",
          "On hypotenuse"
        ],
        "answer": 1
      },
      {
        "q": "An equilateral triangle is also:",
        "options": [
          "Always acute",
          "Always right",
          "Always obtuse",
          "Sometimes right"
        ],
        "answer": 0
      },
      {
        "q": "If isosceles triangle has equal sides of 5 cm and base 6 cm, perimeter = ?",
        "options": [
          "11 cm",
          "16 cm",
          "15 cm",
          "17 cm"
        ],
        "answer": 1
      },
      {
        "q": "To construct a triangle, minimum information needed:",
        "options": [
          "1 side",
          "2 sides",
          "3 elements (sides/angles)",
          "All 6 elements"
        ],
        "answer": 2
      },
      {
        "q": "Two angles in a triangle MUST be:",
        "options": [
          "Obtuse",
          "Right",
          "Acute",
          "Equal"
        ],
        "answer": 2
      },
      {
        "q": "ASA gives ___ triangle(s):",
        "options": [
          "No",
          "Exactly 1",
          "2",
          "Infinite"
        ],
        "answer": 1
      },
      {
        "q": "Altitude is ___ to the base:",
        "options": [
          "Parallel",
          "Perpendicular",
          "Equal",
          "Adjacent"
        ],
        "answer": 1
      },
      {
        "q": "If all angles of a triangle are less than 90°, it is:",
        "options": [
          "Right",
          "Obtuse",
          "Acute",
          "Equilateral"
        ],
        "answer": 2
      },
      {
        "q": "Can sides 5, 5, 10 form a triangle?",
        "options": [
          "Yes, isosceles",
          "No (5+5 = 10, not greater)",
          "Yes, equilateral",
          "Cannot determine"
        ],
        "answer": 1
      },
      {
        "q": "The angle sum property works for:",
        "options": [
          "Only equilateral triangles",
          "Only right triangles",
          "All triangles",
          "Only isosceles triangles"
        ],
        "answer": 2
      },
      {
        "q": "In an equilateral triangle, each altitude also bisects:",
        "options": [
          "Only the base",
          "Only the angle",
          "Both the base and angle",
          "Neither"
        ],
        "answer": 2
      },
      {
        "q": "A scalene triangle has ___ lines of symmetry:",
        "options": [
          "0",
          "1",
          "2",
          "3"
        ],
        "answer": 0
      },
      {
        "q": "If two sides are 7 cm and 3 cm, the third side must be:",
        "options": [
          "Greater than 10",
          "Between 4 and 10",
          "Exactly 10",
          "Less than 3"
        ],
        "answer": 1
      },
      {
        "q": "3-4-5 triangle is a:",
        "options": [
          "Equilateral",
          "Isosceles",
          "Right triangle",
          "Obtuse triangle"
        ],
        "answer": 2
      },
      {
        "q": "Construction using protractor is needed for:",
        "options": [
          "SSS",
          "SAS or ASA",
          "Only equilateral",
          "None"
        ],
        "answer": 1
      },
      {
        "q": "An isosceles right triangle has angles:",
        "options": [
          "60-60-60",
          "90-45-45",
          "90-30-60",
          "90-50-40"
        ],
        "answer": 1
      },
      {
        "q": "The hypotenuse is opposite the:",
        "options": [
          "Smallest angle",
          "Right angle",
          "Equal angles",
          "Base"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": 8,
    "number": "8",
    "title": "Working with Fractions",
    "description": "Multiplication and division of fractions, word problems involving fractions, and real-world applications",
    "topics": [
      {
        "name": "8.1 Multiplication of Fractions",
        "content": "Multiplying fractions is straightforward: multiply numerators together and denominators together. Understanding why this works helps with word problems.\n\n**Rule: a/b × c/d = (a×c)/(b×d)**\n\n**Examples:**\n• 2/3 × 4/5 = 8/15\n• 3/4 × 2/7 = 6/28 = 3/14\n• 5 × 3/4 = 15/4 = 3¾\n\n**Meaning of Fraction Multiplication:**\n'1/2 of 1/3' means 1/2 × 1/3 = 1/6. If you take a third of something and then half of that, you get one-sixth.\n\n**Multiplying Mixed Numbers:**\nFirst convert to improper fractions:\n2½ × 1⅓ = 5/2 × 4/3 = 20/6 = 10/3 = 3⅓\n\n**Simplification Before Multiplying (Cross-Cancellation):**\n2/3 × 9/4: Cancel 2 and 4 (both ÷2), cancel 3 and 9 (both ÷3)\n= 1/1 × 3/2 = 3/2 = 1½\n\n**Properties:**\n• Multiplying by a fraction less than 1 makes the number smaller\n• Multiplying by a fraction greater than 1 makes the number larger\n• Multiplying by 1 (or any form of 1 like 3/3) keeps the number same\n• a/b × b/a = 1 (multiplicative inverse)\n\n**Real-World Applications:**\n• 'Half price' means multiplying by 1/2\n• 'Two-thirds of the class passed' means 2/3 × total students\n• Recipe scaling: 3/4 of a recipe that needs 2/3 cup sugar = 3/4 × 2/3 = 1/2 cup\n\n**Practice Tip:** Always simplify before multiplying when possible - it keeps numbers small and reduces errors."
      },
      {
        "name": "8.2 Division of Fractions",
        "content": "Dividing by a fraction is the same as multiplying by its reciprocal. This seemingly odd rule makes perfect sense when you understand what division really means.\n\n**Rule: a/b ÷ c/d = a/b × d/c**\n(Flip the second fraction and multiply)\n\n**Why Does This Work?**\n'How many 1/4's are in 3?' means 3 ÷ 1/4 = 3 × 4/1 = 12. Yes! There are 12 quarter-pieces in 3 wholes.\n\n**Examples:**\n• 3/4 ÷ 2/3 = 3/4 × 3/2 = 9/8 = 1⅛\n• 5 ÷ 1/3 = 5 × 3 = 15\n• 1/2 ÷ 3 = 1/2 × 1/3 = 1/6\n• 2½ ÷ 1¼ = 5/2 ÷ 5/4 = 5/2 × 4/5 = 20/10 = 2\n\n**Reciprocal (Multiplicative Inverse):**\n• Reciprocal of 3/4 is 4/3\n• Reciprocal of 5 is 1/5\n• Reciprocal of 1/7 is 7\n• A number × its reciprocal = 1\n• Zero has NO reciprocal (cannot divide by zero!)\n\n**Properties:**\n• Dividing by a fraction  1 makes the number SMALLER\n• Dividing any number by itself = 1\n\n**Practice Tip:** Remember KFC - Keep the first fraction, Flip the second, Change division to multiplication!"
      },
      {
        "name": "8.3 Some Problems Involving Fractions",
        "content": "Word problems with fractions require careful reading to identify whether you need to add, subtract, multiply, or divide.\n\n**Type 1: Finding a Fraction of a Quantity**\n'3/5 of 40 students like cricket' → 3/5 × 40 = 24 students\n'Raju spent 2/7 of Rs. 350' → 2/7 × 350 = Rs. 100\n\n**Type 2: Finding the Whole from a Part**\n'If 3/4 of a number is 27, find the number' → 27 ÷ 3/4 = 27 × 4/3 = 36\n'2/5 of the students = 16. Total students?' → 16 ÷ 2/5 = 16 × 5/2 = 40\n\n**Type 3: Successive Fractions**\n'Meera had Rs. 600. She spent 1/3 on books and 1/4 of the remainder on food.'\nBooks: 1/3 × 600 = Rs. 200. Remainder = Rs. 400.\nFood: 1/4 × 400 = Rs. 100. Final remainder = Rs. 300.\n\n**Type 4: Fraction of Area/Length**\n'A rope 8½ meters long is cut into pieces of 1¼ m each. How many pieces?'\n8½ ÷ 1¼ = 17/2 ÷ 5/4 = 17/2 × 4/5 = 68/10 = 6.8 → 6 complete pieces\n\n**Type 5: Comparing Fractions**\n'Who ate more: Ram (3/8 of pizza) or Shyam (2/5 of pizza)?'\n3/8 = 15/40, 2/5 = 16/40. Shyam ate more!\n\n**Practice Tip:** In word problems, 'of' usually means multiplication, 'shared equally' means division, and 'how much more/less' means subtraction."
      }
    ],
    "questions": [
      {
        "q": "2/3 x 4/5 = ?",
        "options": [
          "6/8",
          "8/15",
          "6/15",
          "8/8"
        ],
        "answer": 1
      },
      {
        "q": "The reciprocal of 3/7 is:",
        "options": [
          "3/7",
          "7/3",
          "-3/7",
          "1"
        ],
        "answer": 1
      },
      {
        "q": "3/4 / 2/3 = ?",
        "options": [
          "6/12",
          "9/8",
          "1/2",
          "6/7"
        ],
        "answer": 1
      },
      {
        "q": "Half of 2/5 is:",
        "options": [
          "1/5",
          "4/5",
          "2/10",
          "1/10"
        ],
        "answer": 0
      },
      {
        "q": "5 / (1/3) = ?",
        "options": [
          "5/3",
          "15",
          "3/5",
          "1/15"
        ],
        "answer": 1
      },
      {
        "q": "2 1/2 x 1 1/3 = ?",
        "options": [
          "2 2/5",
          "3 1/3",
          "3 1/6",
          "2 1/6"
        ],
        "answer": 1
      },
      {
        "q": "3/5 of 40 = ?",
        "options": [
          "8",
          "24",
          "30",
          "15"
        ],
        "answer": 1
      },
      {
        "q": "Reciprocal of 5 is:",
        "options": [
          "5",
          "-5",
          "1/5",
          "0"
        ],
        "answer": 2
      },
      {
        "q": "1/2 / 3 = ?",
        "options": [
          "3/2",
          "1/6",
          "6",
          "2/3"
        ],
        "answer": 1
      },
      {
        "q": "If 3/4 of a number is 27, the number is:",
        "options": [
          "20",
          "36",
          "81",
          "9"
        ],
        "answer": 1
      },
      {
        "q": "Multiplying by 1/2 is the same as:",
        "options": [
          "Doubling",
          "Halving",
          "Adding 1/2",
          "Subtracting 1/2"
        ],
        "answer": 1
      },
      {
        "q": "4/7 x 7/4 = ?",
        "options": [
          "0",
          "1",
          "16/49",
          "49/16"
        ],
        "answer": 1
      },
      {
        "q": "A rope 8 1/2 m cut into 1 1/4 m pieces gives:",
        "options": [
          "6 pieces",
          "7 pieces",
          "8 pieces",
          "6 complete pieces"
        ],
        "answer": 3
      },
      {
        "q": "Which is greater: 3/8 or 2/5?",
        "options": [
          "3/8",
          "2/5",
          "Equal",
          "Cannot compare"
        ],
        "answer": 1
      },
      {
        "q": "2/3 x 9/4 simplified first gives:",
        "options": [
          "18/12",
          "3/2",
          "6/4",
          "9/6"
        ],
        "answer": 1
      },
      {
        "q": "Dividing by 1/4 is the same as:",
        "options": [
          "Multiplying by 4",
          "Dividing by 4",
          "Multiplying by 1/4",
          "Subtracting 4"
        ],
        "answer": 0
      },
      {
        "q": "3/8 x 0 = ?",
        "options": [
          "3/8",
          "0",
          "8/3",
          "Undefined"
        ],
        "answer": 1
      },
      {
        "q": "If 2/5 of students = 16, total students = ?",
        "options": [
          "32",
          "8",
          "40",
          "80"
        ],
        "answer": 2
      },
      {
        "q": "Mixed number 3 2/5 as improper fraction:",
        "options": [
          "32/5",
          "17/5",
          "15/2",
          "6/5"
        ],
        "answer": 1
      },
      {
        "q": "1/3 x 1/3 = ?",
        "options": [
          "2/3",
          "1/6",
          "1/9",
          "2/9"
        ],
        "answer": 2
      },
      {
        "q": "Zero has a reciprocal:",
        "options": [
          "Yes, it's 0",
          "Yes, it's infinity",
          "No",
          "Yes, it's 1"
        ],
        "answer": 2
      },
      {
        "q": "2/3 / 2/3 = ?",
        "options": [
          "0",
          "1",
          "4/9",
          "2/3"
        ],
        "answer": 1
      },
      {
        "q": "Raju spent 2/7 of Rs. 350. He spent:",
        "options": [
          "Rs. 50",
          "Rs. 100",
          "Rs. 150",
          "Rs. 200"
        ],
        "answer": 1
      },
      {
        "q": "5/6 x 12 = ?",
        "options": [
          "10",
          "60/6",
          "17/6",
          "Both A and B"
        ],
        "answer": 3
      },
      {
        "q": "Multiplying a number by a fraction > 1:",
        "options": [
          "Decreases it",
          "Increases it",
          "Keeps it same",
          "Makes it zero"
        ],
        "answer": 1
      },
      {
        "q": "3 1/4 / 1/2 = ?",
        "options": [
          "1 5/8",
          "6 1/2",
          "3/8",
          "13/8"
        ],
        "answer": 1
      },
      {
        "q": "What fraction of 1 hour is 20 minutes?",
        "options": [
          "1/2",
          "1/3",
          "1/4",
          "2/5"
        ],
        "answer": 1
      },
      {
        "q": "7/8 x 8/7 = ?",
        "options": [
          "56/56",
          "1",
          "15/15",
          "All of these"
        ],
        "answer": 3
      },
      {
        "q": "If she spent 1/3 of Rs. 600 on books, remainder = ?",
        "options": [
          "Rs. 200",
          "Rs. 300",
          "Rs. 400",
          "Rs. 500"
        ],
        "answer": 2
      },
      {
        "q": "1/5 / 1/5 = ?",
        "options": [
          "1/25",
          "25",
          "1",
          "0"
        ],
        "answer": 2
      },
      {
        "q": "3/4 of a pizza shared by 3 people. Each gets:",
        "options": [
          "1/4",
          "3/12",
          "9/4",
          "Both A and B"
        ],
        "answer": 3
      },
      {
        "q": "Which is larger: 5/6 or 7/8?",
        "options": [
          "5/6",
          "7/8",
          "Equal",
          "Cannot tell"
        ],
        "answer": 1
      },
      {
        "q": "2 / (2/3) = ?",
        "options": [
          "4/3",
          "3",
          "1/3",
          "6"
        ],
        "answer": 1
      },
      {
        "q": "Product of a number and its reciprocal is always:",
        "options": [
          "0",
          "1",
          "The number itself",
          "2"
        ],
        "answer": 1
      },
      {
        "q": "3/5 x 5/3 x 7 = ?",
        "options": [
          "7",
          "105/15",
          "1",
          "Both A and B"
        ],
        "answer": 3
      },
      {
        "q": "Half of three-quarters is:",
        "options": [
          "3/8",
          "3/2",
          "1/4",
          "6/4"
        ],
        "answer": 0
      },
      {
        "q": "If 1/4 of a class failed and 30 passed, class size = ?",
        "options": [
          "35",
          "40",
          "120",
          "34"
        ],
        "answer": 1
      },
      {
        "q": "2 1/2 / 1 1/4 = ?",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "answer": 1
      },
      {
        "q": "4/5 x 25 = ?",
        "options": [
          "20",
          "100/5",
          "5",
          "Both A and B"
        ],
        "answer": 3
      },
      {
        "q": "In word problems, 'of' usually means:",
        "options": [
          "Addition",
          "Subtraction",
          "Multiplication",
          "Division"
        ],
        "answer": 2
      }
    ]
  },
  {
    "id": 9,
    "number": "9",
    "title": "Geometric Twins",
    "description": "Understanding symmetry, congruence, reflection, and rotation - how geometric shapes can be identical twins",
    "topics": [
      {
        "name": "9.1 Line Symmetry",
        "content": "A figure has line symmetry if it can be folded along a line so that one half matches exactly with the other half. This fold line is called the line of symmetry or axis of symmetry.\n\n**Definition:**\nA figure is symmetric about a line if, when folded along that line, the two halves overlap perfectly. The fold line is the line of symmetry.\n\n**Examples of Line Symmetry:**\n• A square has 4 lines of symmetry (2 diagonals + 2 midpoint lines)\n• A rectangle has 2 lines of symmetry (through midpoints of opposite sides)\n• An equilateral triangle has 3 lines of symmetry\n• A circle has infinite lines of symmetry (every diameter)\n• A regular pentagon has 5 lines of symmetry\n\n**Symmetry in English Alphabets:**\n• Vertical line symmetry: A, H, I, M, O, T, U, V, W, X, Y\n• Horizontal line symmetry: B, C, D, E, H, I, K, O, X\n• Both: H, I, O, X\n• No symmetry: F, G, J, L, N, P, Q, R, S, Z\n\n**Symmetry in Nature:**\n• Butterflies (bilateral symmetry)\n• Leaves (midrib is the line of symmetry)\n• Human face (approximately symmetric)\n• Snowflakes (6 lines of symmetry)\n\n**Mirror Test:** Place a mirror along the supposed line of symmetry. If the reflection plus the visible half recreates the full figure, it's a line of symmetry!\n\n**Practice Tip:** To check symmetry, trace the figure on paper, fold along the suspected line, and see if both halves match."
      },
      {
        "name": "9.2 Congruent Figures",
        "content": "Two figures are congruent if they have the same shape AND the same size. One can be placed on top of the other to match perfectly.\n\n**Definition:**\nCongruent figures are identical in shape and size. They can be superimposed (placed on top of each other) to match exactly. The symbol for congruence is ≅.\n\n**Congruence vs Similarity:**\n• **Congruent:** Same shape AND same size (exact copies)\n• **Similar:** Same shape but possibly different sizes (scaled copies)\nAll congruent figures are similar, but not all similar figures are congruent!\n\n**Congruence of Line Segments:**\nTwo line segments are congruent if they have the same length.\nAB ≅ CD means AB = CD (same length)\n\n**Congruence of Angles:**\nTwo angles are congruent if they have the same measure.\n∠A ≅ ∠B means ∠A = ∠B (same degrees)\n\n**Congruence of Triangles:**\nTwo triangles are congruent if all corresponding sides and angles match. Tests:\n• SSS: All 3 sides equal\n• SAS: 2 sides and included angle equal\n• ASA: 2 angles and included side equal\n• RHS: Right angle, Hypotenuse, one Side equal\n\n**Real-World Examples:**\n• Two coins of the same denomination are congruent\n• Tiles of the same type are congruent\n• Mass-produced objects (same mold) are congruent\n\n**Practice Tip:** To check if two figures are congruent, trace one on paper and try to place it on the other. You may need to flip or rotate it."
      },
      {
        "name": "9.3 Flips and Turns",
        "content": "Geometric transformations like reflections (flips), rotations (turns), and translations (slides) move figures while preserving their shape and size.\n\n**Reflection (Flip):**\n• A mirror image of the figure across a line (mirror line)\n• Every point moves to the other side, same distance from the mirror line\n• The figure appears 'flipped' or reversed\n• Left and right are swapped, but shape and size stay the same\n\n**Rotation (Turn):**\n• Turning a figure around a fixed point (center of rotation)\n• Measured by the angle of rotation (90°, 180°, 270°, etc.)\n• Clockwise or counter-clockwise direction\n• Shape and size remain unchanged\n\n**Translation (Slide):**\n• Moving a figure in a straight line without rotating or flipping\n• Every point moves the same distance in the same direction\n• Like sliding a chess piece straight across the board\n\n**Rotational Symmetry:**\nA figure has rotational symmetry if it looks the same after rotation by less than 360°:\n• Square: Order 4 (looks same at 90°, 180°, 270°, 360°)\n• Equilateral triangle: Order 3 (120°, 240°, 360°)\n• Rectangle: Order 2 (180°, 360°)\n• Circle: Infinite order\n\n**Key Insight:** Reflections, rotations, and translations all produce congruent figures. The original and the transformed figure are always congruent!\n\n**Practice Tip:** Use tracing paper to test transformations - trace the figure and physically flip, turn, or slide it to see the result."
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
        "q": "Two figures with same shape and size are:",
        "options": [
          "Similar",
          "Congruent",
          "Symmetric",
          "Equal"
        ],
        "answer": 1
      },
      {
        "q": "A circle has ___ lines of symmetry:",
        "options": [
          "1",
          "4",
          "8",
          "Infinite"
        ],
        "answer": 3
      },
      {
        "q": "The letter 'A' has:",
        "options": [
          "Vertical line symmetry",
          "Horizontal line symmetry",
          "Both",
          "No symmetry"
        ],
        "answer": 0
      },
      {
        "q": "A reflection is also called a:",
        "options": [
          "Slide",
          "Turn",
          "Flip",
          "Stretch"
        ],
        "answer": 2
      },
      {
        "q": "An equilateral triangle has ___ lines of symmetry:",
        "options": [
          "1",
          "2",
          "3",
          "6"
        ],
        "answer": 2
      },
      {
        "q": "The symbol for congruence is:",
        "options": [
          "=",
          "~",
          "≅",
          "≈"
        ],
        "answer": 2
      },
      {
        "q": "A rotation is also called a:",
        "options": [
          "Flip",
          "Turn",
          "Slide",
          "Scale"
        ],
        "answer": 1
      },
      {
        "q": "Rotational symmetry order of a square is:",
        "options": [
          "2",
          "3",
          "4",
          "8"
        ],
        "answer": 2
      },
      {
        "q": "Which letter has both horizontal and vertical symmetry?",
        "options": [
          "A",
          "B",
          "H",
          "T"
        ],
        "answer": 2
      },
      {
        "q": "Two congruent triangles have:",
        "options": [
          "Same shape only",
          "Same size only",
          "Same shape and size",
          "Different shapes"
        ],
        "answer": 2
      },
      {
        "q": "A rectangle has ___ lines of symmetry:",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "answer": 1
      },
      {
        "q": "A translation is also called a:",
        "options": [
          "Flip",
          "Turn",
          "Slide",
          "Rotation"
        ],
        "answer": 2
      },
      {
        "q": "Which has NO line of symmetry?",
        "options": [
          "Circle",
          "Square",
          "Scalene triangle",
          "Rectangle"
        ],
        "answer": 2
      },
      {
        "q": "A butterfly shows ___ symmetry:",
        "options": [
          "No",
          "Bilateral (line)",
          "Rotational",
          "Point"
        ],
        "answer": 1
      },
      {
        "q": "SSS test for congruence means:",
        "options": [
          "Side-Side-Side",
          "Same-Same-Same",
          "Similar-Similar-Similar",
          "Sum-Sum-Sum"
        ],
        "answer": 0
      },
      {
        "q": "After a reflection, the figure is:",
        "options": [
          "Bigger",
          "Smaller",
          "Congruent to original",
          "Similar only"
        ],
        "answer": 2
      },
      {
        "q": "A regular hexagon has ___ lines of symmetry:",
        "options": [
          "3",
          "4",
          "6",
          "12"
        ],
        "answer": 2
      },
      {
        "q": "Which transformation changes left-right orientation?",
        "options": [
          "Translation",
          "Rotation",
          "Reflection",
          "None"
        ],
        "answer": 2
      },
      {
        "q": "The letter 'O' has ___ lines of symmetry:",
        "options": [
          "1",
          "2",
          "4",
          "Infinite"
        ],
        "answer": 3
      },
      {
        "q": "All congruent figures are similar:",
        "options": [
          "True",
          "False",
          "Sometimes",
          "Never"
        ],
        "answer": 0
      },
      {
        "q": "A snowflake typically has ___ lines of symmetry:",
        "options": [
          "2",
          "4",
          "6",
          "8"
        ],
        "answer": 2
      },
      {
        "q": "Rotational symmetry order of an equilateral triangle:",
        "options": [
          "1",
          "2",
          "3",
          "6"
        ],
        "answer": 2
      },
      {
        "q": "Which test is NOT for triangle congruence?",
        "options": [
          "SSS",
          "SAS",
          "AAA",
          "ASA"
        ],
        "answer": 2
      },
      {
        "q": "A parallelogram has ___ lines of symmetry:",
        "options": [
          "0",
          "1",
          "2",
          "4"
        ],
        "answer": 0
      },
      {
        "q": "After 180° rotation, a rectangle looks:",
        "options": [
          "Different",
          "The same",
          "Bigger",
          "Flipped"
        ],
        "answer": 1
      },
      {
        "q": "Two line segments are congruent if they have:",
        "options": [
          "Same direction",
          "Same length",
          "Same position",
          "Same color"
        ],
        "answer": 1
      },
      {
        "q": "A regular pentagon has rotational symmetry of order:",
        "options": [
          "3",
          "4",
          "5",
          "10"
        ],
        "answer": 2
      },
      {
        "q": "Which shape has the most lines of symmetry?",
        "options": [
          "Square",
          "Rectangle",
          "Circle",
          "Triangle"
        ],
        "answer": 2
      },
      {
        "q": "In a reflection, the distance from mirror line is:",
        "options": [
          "Doubled",
          "Halved",
          "Same on both sides",
          "Zero"
        ],
        "answer": 2
      },
      {
        "q": "An isosceles triangle has ___ line(s) of symmetry:",
        "options": [
          "0",
          "1",
          "2",
          "3"
        ],
        "answer": 1
      },
      {
        "q": "Which transformation doesn't change orientation?",
        "options": [
          "Reflection",
          "Translation",
          "Glide reflection",
          "None"
        ],
        "answer": 1
      },
      {
        "q": "A rhombus has ___ lines of symmetry:",
        "options": [
          "0",
          "1",
          "2",
          "4"
        ],
        "answer": 2
      },
      {
        "q": "Two circles with the same radius are:",
        "options": [
          "Similar only",
          "Congruent",
          "Neither",
          "Cannot determine"
        ],
        "answer": 1
      },
      {
        "q": "The letter 'S' has:",
        "options": [
          "Line symmetry",
          "Rotational symmetry",
          "Both",
          "Neither"
        ],
        "answer": 1
      },
      {
        "q": "After a 360° rotation, the figure:",
        "options": [
          "Disappears",
          "Doubles",
          "Returns to original position",
          "Flips"
        ],
        "answer": 2
      },
      {
        "q": "RHS congruence test applies to:",
        "options": [
          "All triangles",
          "Only right triangles",
          "Only equilateral",
          "Only isosceles"
        ],
        "answer": 1
      },
      {
        "q": "A scalene triangle has ___ lines of symmetry:",
        "options": [
          "0",
          "1",
          "2",
          "3"
        ],
        "answer": 0
      },
      {
        "q": "Which has rotational symmetry but NO line symmetry?",
        "options": [
          "Square",
          "Circle",
          "Parallelogram (non-rectangle)",
          "Equilateral triangle"
        ],
        "answer": 2
      },
      {
        "q": "Two angles are congruent if they have:",
        "options": [
          "Same arms",
          "Same measure",
          "Same vertex",
          "Same position"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": 10,
    "number": "10",
    "title": "Operations with Integers",
    "description": "Understanding positive and negative numbers, number line operations, addition, subtraction, and multiplication of integers",
    "topics": [
      {
        "name": "10.1 Integers and the Number Line",
        "content": "Integers extend our number system to include negative numbers. The number line stretches infinitely in both directions, with zero in the middle.\n\n**What are Integers?**\nIntegers = {..., -3, -2, -1, 0, 1, 2, 3, ...}\n• Positive integers: 1, 2, 3, 4, ... (right of zero)\n• Negative integers: -1, -2, -3, -4, ... (left of zero)\n• Zero is neither positive nor negative\n\n**The Number Line:**\n\n• Numbers increase from left to right\n• Numbers decrease from right to left\n• Every positive number has a negative counterpart\n\n**Comparing Integers:**\n• Any positive integer > 0 > any negative integer\n• Among negatives: -1 > -2 > -3 (closer to zero = larger)\n• -100 < -1 (further from zero = smaller for negatives)\n\n**Absolute Value:**\nThe distance of a number from zero (always positive):\n• |5| = 5, |-5| = 5\n• |0| = 0\n• |-100| = 100\n\n**Real-World Integers:**\n• Temperature: -5°C (5 degrees below zero)\n• Altitude: -200 m (200 meters below sea level, like the Dead Sea)\n• Bank balance: -Rs. 500 (overdrawn/debt of Rs. 500)\n• Floors: -2 (second basement level)\n• Timeline: -500 BCE (500 years before common era)\n\n**Practice Tip:** Think of the number line as a thermometer - above zero is positive (warm), below zero is negative (cold). The further below zero, the colder (smaller) it is."
      },
      {
        "name": "10.2 Operations on Integers",
        "content": "Adding, subtracting, and multiplying integers follows specific rules. Understanding these rules through the number line makes them intuitive.\n\n**Addition of Integers:**\n• Same signs: Add the absolute values, keep the sign\n  (+3) + (+5) = +8, (-3) + (-5) = -8\n• Different signs: Subtract smaller absolute value from larger, keep sign of larger\n  (+7) + (-3) = +4, (-7) + (+3) = -4\n  (+3) + (-7) = -4, (-3) + (+7) = +4\n\n**Subtraction of Integers:**\nSubtracting is the same as adding the opposite (additive inverse):\na - b = a + (-b)\n• 5 - 8 = 5 + (-8) = -3\n• -3 - 4 = -3 + (-4) = -7\n• -3 - (-4) = -3 + 4 = 1\n\n**Multiplication of Integers:**\n• Positive × Positive = Positive: 3 × 4 = 12\n• Negative × Negative = Positive: (-3) × (-4) = 12\n• Positive × Negative = Negative: 3 × (-4) = -12\n• Negative × Positive = Negative: (-3) × 4 = -12\n\n**Memory Aid:** Same signs → Positive product, Different signs → Negative product\n\n**Properties:**\n• a + 0 = a (zero is additive identity)\n• a + (-a) = 0 (additive inverse)\n• a × 1 = a (one is multiplicative identity)\n• a × 0 = 0\n• Addition and multiplication are commutative and associative\n• Subtraction and division are NOT commutative\n\n**Practice Tip:** For subtraction, always convert to addition first: a - b = a + (-b). This reduces mistakes with negative numbers."
      }
    ],
    "questions": [
      {
        "q": "(-3) + (-5) = ?",
        "options": [
          "-8",
          "8",
          "-2",
          "2"
        ],
        "answer": 0
      },
      {
        "q": "Which is greater: -3 or -7?",
        "options": [
          "-3",
          "-7",
          "Both equal",
          "Cannot compare"
        ],
        "answer": 0
      },
      {
        "q": "The additive inverse of 5 is:",
        "options": [
          "5",
          "-5",
          "1/5",
          "0"
        ],
        "answer": 1
      },
      {
        "q": "(-4) x (-3) = ?",
        "options": [
          "-12",
          "12",
          "-7",
          "7"
        ],
        "answer": 1
      },
      {
        "q": "7 + (-10) = ?",
        "options": [
          "17",
          "-17",
          "-3",
          "3"
        ],
        "answer": 2
      },
      {
        "q": "|−8| = ?",
        "options": [
          "-8",
          "8",
          "0",
          "-1"
        ],
        "answer": 1
      },
      {
        "q": "(-5) - (-3) = ?",
        "options": [
          "-8",
          "-2",
          "2",
          "8"
        ],
        "answer": 1
      },
      {
        "q": "Zero is:",
        "options": [
          "Positive",
          "Negative",
          "Neither positive nor negative",
          "Both"
        ],
        "answer": 2
      },
      {
        "q": "3 x (-7) = ?",
        "options": [
          "21",
          "-21",
          "10",
          "-10"
        ],
        "answer": 1
      },
      {
        "q": "(-15) + 15 = ?",
        "options": [
          "30",
          "-30",
          "0",
          "15"
        ],
        "answer": 2
      },
      {
        "q": "Which is smallest: -1, -100, 0, 1?",
        "options": [
          "-1",
          "-100",
          "0",
          "1"
        ],
        "answer": 1
      },
      {
        "q": "(-6) - 4 = ?",
        "options": [
          "-10",
          "-2",
          "2",
          "10"
        ],
        "answer": 0
      },
      {
        "q": "(-2) x (-2) x (-2) = ?",
        "options": [
          "8",
          "-8",
          "6",
          "-6"
        ],
        "answer": 1
      },
      {
        "q": "The integer between -3 and -1 is:",
        "options": [
          "-4",
          "-2",
          "0",
          "2"
        ],
        "answer": 1
      },
      {
        "q": "8 - (-3) = ?",
        "options": [
          "5",
          "11",
          "-5",
          "-11"
        ],
        "answer": 1
      },
      {
        "q": "Negative x Negative = ?",
        "options": [
          "Negative",
          "Positive",
          "Zero",
          "Cannot determine"
        ],
        "answer": 1
      },
      {
        "q": "(-20) / 4 = ?",
        "options": [
          "5",
          "-5",
          "24",
          "-24"
        ],
        "answer": 1
      },
      {
        "q": "Temperature drops from 5°C by 8°C. New temp:",
        "options": [
          "13°C",
          "-3°C",
          "3°C",
          "-13°C"
        ],
        "answer": 1
      },
      {
        "q": "(-1) x (-1) x (-1) x (-1) = ?",
        "options": [
          "-1",
          "1",
          "-4",
          "4"
        ],
        "answer": 1
      },
      {
        "q": "Arrange in ascending order: -5, 3, -1, 0",
        "options": [
          "-5,-1,0,3",
          "3,0,-1,-5",
          "-1,-5,0,3",
          "0,-1,-5,3"
        ],
        "answer": 0
      },
      {
        "q": "Is subtraction of integers commutative?",
        "options": [
          "Yes",
          "No",
          "Sometimes",
          "Only for positives"
        ],
        "answer": 1
      },
      {
        "q": "(-9) + 4 = ?",
        "options": [
          "-13",
          "13",
          "-5",
          "5"
        ],
        "answer": 2
      },
      {
        "q": "The absolute value of 0 is:",
        "options": [
          "0",
          "1",
          "Undefined",
          "-1"
        ],
        "answer": 0
      },
      {
        "q": "(-6) x 5 = ?",
        "options": [
          "30",
          "-30",
          "11",
          "-11"
        ],
        "answer": 1
      },
      {
        "q": "A submarine at -200m rises 50m. New depth:",
        "options": [
          "-250m",
          "-150m",
          "150m",
          "250m"
        ],
        "answer": 1
      },
      {
        "q": "(-3) + (-3) + (-3) = ?",
        "options": [
          "-9",
          "9",
          "-6",
          "6"
        ],
        "answer": 0
      },
      {
        "q": "Which operation gives positive: (-5) ? (-5)?",
        "options": [
          "Addition",
          "Subtraction",
          "Multiplication",
          "None"
        ],
        "answer": 2
      },
      {
        "q": "0 - (-7) = ?",
        "options": [
          "-7",
          "7",
          "0",
          "14"
        ],
        "answer": 1
      },
      {
        "q": "(-4)² = ?",
        "options": [
          "-16",
          "16",
          "-8",
          "8"
        ],
        "answer": 1
      },
      {
        "q": "Sum of all integers from -5 to 5 is:",
        "options": [
          "-5",
          "5",
          "0",
          "10"
        ],
        "answer": 2
      },
      {
        "q": "(-12) / (-3) = ?",
        "options": [
          "-4",
          "4",
          "-36",
          "36"
        ],
        "answer": 1
      },
      {
        "q": "a + (-a) always equals:",
        "options": [
          "2a",
          "-2a",
          "0",
          "a²"
        ],
        "answer": 2
      },
      {
        "q": "Which is true: -3 > -2 or -3 < -2?",
        "options": [
          "-3 > -2",
          "-3 < -2",
          "They are equal",
          "Cannot compare"
        ],
        "answer": 1
      },
      {
        "q": "(-7) x 0 = ?",
        "options": [
          "-7",
          "7",
          "0",
          "Undefined"
        ],
        "answer": 2
      },
      {
        "q": "15 + (-20) + 5 = ?",
        "options": [
          "40",
          "-40",
          "0",
          "10"
        ],
        "answer": 2
      },
      {
        "q": "The successor of -1 is:",
        "options": [
          "-2",
          "0",
          "1",
          "-1"
        ],
        "answer": 1
      },
      {
        "q": "(-8) - (-8) = ?",
        "options": [
          "-16",
          "16",
          "0",
          "1"
        ],
        "answer": 2
      },
      {
        "q": "Product of 5 negative numbers is:",
        "options": [
          "Positive",
          "Negative",
          "Zero",
          "Cannot determine"
        ],
        "answer": 1
      },
      {
        "q": "The predecessor of 0 is:",
        "options": [
          "1",
          "-1",
          "0",
          "None"
        ],
        "answer": 1
      },
      {
        "q": "(-2) x 3 x (-4) = ?",
        "options": [
          "-24",
          "24",
          "-9",
          "9"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": 11,
    "number": "11",
    "title": "Finding Common Ground",
    "description": "Understanding factors, multiples, HCF (GCD), LCM, prime factorization, and their real-world applications",
    "topics": [
      {
        "name": "11.1 Prime Numbers and Factorisation",
        "content": "Every number greater than 1 is either prime or can be expressed as a product of prime numbers. This fundamental idea is the basis of all number theory.\n\n**Prime Numbers:**\nA number greater than 1 that has exactly two factors (1 and itself):\n2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47...\n\n**Important Facts about Primes:**\n• 2 is the only even prime number\n• 1 is NOT a prime (it has only one factor)\n• There are infinitely many primes\n• Every even number > 2 can be written as a sum of two primes (Goldbach's conjecture, unproven but verified up to very large numbers)\n\n**Composite Numbers:**\nNumbers with more than 2 factors: 4, 6, 8, 9, 10, 12, 14, 15...\n\n**Prime Factorisation:**\nWriting a number as a product of its prime factors:\n• 12 = 2 × 2 × 3 = 2² × 3\n• 60 = 2² × 3 × 5\n• 100 = 2² × 5²\n\n**Factor Tree Method:**\n60 → 2 × 30 → 2 × 2 × 15 → 2 × 2 × 3 × 5\n\n**Division Method:**\nDivide by smallest prime repeatedly: 60 ÷ 2 = 30, 30 ÷ 2 = 15, 15 ÷ 3 = 5, 5 ÷ 5 = 1\nSo 60 = 2 × 2 × 3 × 5\n\n**Fundamental Theorem of Arithmetic:**\nEvery number > 1 has a UNIQUE prime factorisation (up to order). This is one of the most important theorems in mathematics!\n\n**Practice Tip:** Always start dividing by the smallest prime (2), then try 3, 5, 7, etc. This systematic approach ensures you don't miss any factors."
      },
      {
        "name": "11.2 HCF (Highest Common Factor)",
        "content": "The HCF (also called GCD - Greatest Common Divisor) of two or more numbers is the largest number that divides all of them exactly.\n\n**Finding HCF - Method 1: Listing Factors**\nFactors of 12: 1, 2, 3, 4, 6, 12\nFactors of 18: 1, 2, 3, 6, 9, 18\nCommon factors: 1, 2, 3, 6\nHCF = 6 (the highest common factor)\n\n**Finding HCF - Method 2: Prime Factorisation**\n12 = 2² × 3\n18 = 2 × 3²\nHCF = Product of common prime factors with LOWEST powers\n= 2¹ × 3¹ = 6\n\n**Finding HCF - Method 3: Division Method (Euclid's Algorithm)**\nHCF(48, 18): 48 = 2 × 18 + 12, then 18 = 1 × 12 + 6, then 12 = 2 × 6 + 0\nHCF = 6 (the last non-zero remainder)\n\n**Properties of HCF:**\n• HCF(a, b) ≤ min(a, b)\n• If HCF(a, b) = 1, then a and b are coprime (no common factor except 1)\n• HCF(a, a) = a\n• HCF(a, 0) = a\n\n**Real-World Applications:**\n• Cutting rope into equal pieces: HCF tells the longest possible piece length\n• Arranging items in equal rows: HCF gives the maximum row size\n• Simplifying fractions: Divide both numerator and denominator by their HCF\n\n**Practice Tip:** The prime factorisation method is most reliable for HCF. Write out the factorisation, circle common primes, and multiply with lowest powers."
      },
      {
        "name": "11.3 LCM (Least Common Multiple)",
        "content": "The LCM of two or more numbers is the smallest number that is a multiple of all of them.\n\n**Finding LCM - Method 1: Listing Multiples**\nMultiples of 4: 4, 8, 12, 16, 20, 24, 28, 32, 36...\nMultiples of 6: 6, 12, 18, 24, 30, 36...\nCommon multiples: 12, 24, 36...\nLCM = 12 (the least common multiple)\n\n**Finding LCM - Method 2: Prime Factorisation**\n4 = 2²\n6 = 2 × 3\nLCM = Product of ALL prime factors with HIGHEST powers\n= 2² × 3 = 12\n\n**Finding LCM - Method 3: Division Method**\nWrite both numbers, divide by common primes:\n2 | 4, 6\n2 | 2, 3\n3 | 1, 3\n  | 1, 1\nLCM = 2 × 2 × 3 = 12\n\n**HCF-LCM Relationship:**\nFor any two numbers a and b:\nHCF(a,b) × LCM(a,b) = a × b\nExample: HCF(4,6)=2, LCM(4,6)=12, and 2×12 = 4×6 = 24 ✓\n\n**Real-World Applications:**\n• When will two events coincide? (LCM of their intervals)\n• Two lights blink every 4 and 6 seconds - when do they blink together? LCM(4,6) = 12 seconds\n• Buying items to get equal quantities: LCM of pack sizes\n\n**Practice Tip:** For LCM, use ALL prime factors with HIGHEST powers. For HCF, use only COMMON prime factors with LOWEST powers. Don't mix them up!"
      }
    ],
    "questions": [
      {
        "q": "Is 1 a prime number?",
        "options": [
          "Yes",
          "No",
          "Sometimes",
          "It's special"
        ],
        "answer": 1
      },
      {
        "q": "The only even prime number is:",
        "options": [
          "1",
          "2",
          "4",
          "0"
        ],
        "answer": 1
      },
      {
        "q": "Prime factorisation of 60 is:",
        "options": [
          "2x30",
          "4x15",
          "2²x3x5",
          "6x10"
        ],
        "answer": 2
      },
      {
        "q": "HCF of 12 and 18 is:",
        "options": [
          "2",
          "3",
          "6",
          "36"
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
        "q": "Two numbers with HCF = 1 are called:",
        "options": [
          "Prime",
          "Composite",
          "Coprime",
          "Twin primes"
        ],
        "answer": 2
      },
      {
        "q": "HCF(a,b) x LCM(a,b) = ?",
        "options": [
          "a + b",
          "a - b",
          "a x b",
          "a / b"
        ],
        "answer": 2
      },
      {
        "q": "Prime factorisation of 100:",
        "options": [
          "2x50",
          "4x25",
          "10x10",
          "2²x5²"
        ],
        "answer": 3
      },
      {
        "q": "LCM of 3 and 7 is:",
        "options": [
          "3",
          "7",
          "10",
          "21"
        ],
        "answer": 3
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
        "q": "Which is prime: 51, 53, 55, 57?",
        "options": [
          "51",
          "53",
          "55",
          "57"
        ],
        "answer": 1
      },
      {
        "q": "LCM of 5 and 10 is:",
        "options": [
          "5",
          "10",
          "50",
          "15"
        ],
        "answer": 1
      },
      {
        "q": "How many prime numbers between 1 and 10?",
        "options": [
          "3",
          "4",
          "5",
          "6"
        ],
        "answer": 1
      },
      {
        "q": "HCF of 48 and 36 is:",
        "options": [
          "6",
          "12",
          "24",
          "144"
        ],
        "answer": 1
      },
      {
        "q": "If HCF(a,b) = a, then:",
        "options": [
          "a = b",
          "a divides b",
          "b divides a",
          "a and b are prime"
        ],
        "answer": 1
      },
      {
        "q": "LCM of 12 and 15 is:",
        "options": [
          "3",
          "60",
          "180",
          "30"
        ],
        "answer": 1
      },
      {
        "q": "36 = 2² x 3². Number of factors of 36:",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ],
        "answer": 3
      },
      {
        "q": "To simplify 24/36, divide by HCF:",
        "options": [
          "2",
          "6",
          "12",
          "4"
        ],
        "answer": 2
      },
      {
        "q": "LCM(6,8,12) = ?",
        "options": [
          "24",
          "48",
          "96",
          "12"
        ],
        "answer": 0
      },
      {
        "q": "Two lights blink every 4s and 6s. They blink together every:",
        "options": [
          "10s",
          "12s",
          "24s",
          "2s"
        ],
        "answer": 1
      },
      {
        "q": "Is 91 prime?",
        "options": [
          "Yes",
          "No (7x13)",
          "No (9x11)",
          "Cannot determine"
        ],
        "answer": 1
      },
      {
        "q": "HCF of two prime numbers is always:",
        "options": [
          "0",
          "1",
          "Their product",
          "Their sum"
        ],
        "answer": 1
      },
      {
        "q": "LCM of two prime numbers is:",
        "options": [
          "1",
          "Their sum",
          "Their product",
          "Their HCF"
        ],
        "answer": 2
      },
      {
        "q": "Prime factorisation of 72:",
        "options": [
          "8x9",
          "2³x3²",
          "2²x18",
          "4x18"
        ],
        "answer": 1
      },
      {
        "q": "HCF(100, 75) = ?",
        "options": [
          "5",
          "25",
          "50",
          "75"
        ],
        "answer": 1
      },
      {
        "q": "If LCM = 60 and HCF = 5 for two numbers, their product is:",
        "options": [
          "65",
          "300",
          "12",
          "55"
        ],
        "answer": 1
      },
      {
        "q": "Which pair is coprime?",
        "options": [
          "4 and 6",
          "8 and 15",
          "12 and 18",
          "9 and 21"
        ],
        "answer": 1
      },
      {
        "q": "LCM is always:",
        "options": [
          "Less than both numbers",
          "Equal to smaller number",
          ">= the larger number",
          "Equal to HCF"
        ],
        "answer": 2
      },
      {
        "q": "Goldbach's conjecture states every even number > 2 is:",
        "options": [
          "Prime",
          "Sum of two primes",
          "Product of two primes",
          "Power of 2"
        ],
        "answer": 1
      },
      {
        "q": "HCF(0, 5) = ?",
        "options": [
          "0",
          "1",
          "5",
          "Undefined"
        ],
        "answer": 2
      },
      {
        "q": "Number of primes between 10 and 20:",
        "options": [
          "2",
          "3",
          "4",
          "5"
        ],
        "answer": 2
      },
      {
        "q": "LCM(1, any number n) = ?",
        "options": [
          "1",
          "n",
          "n+1",
          "0"
        ],
        "answer": 1
      },
      {
        "q": "24/36 simplified = ?",
        "options": [
          "4/6",
          "2/3",
          "12/18",
          "All of these simplify to 2/3"
        ],
        "answer": 3
      },
      {
        "q": "Prime factorisation of 180:",
        "options": [
          "2²x3²x5",
          "2x3x30",
          "4x45",
          "18x10"
        ],
        "answer": 0
      },
      {
        "q": "HCF(a, a) = ?",
        "options": [
          "0",
          "1",
          "a",
          "2a"
        ],
        "answer": 2
      },
      {
        "q": "If HCF of two numbers is 12, both numbers are divisible by:",
        "options": [
          "6 only",
          "12",
          "24",
          "Cannot determine"
        ],
        "answer": 1
      },
      {
        "q": "Rope of 24m and 36m cut into longest equal pieces. Piece length:",
        "options": [
          "6m",
          "12m",
          "24m",
          "4m"
        ],
        "answer": 1
      },
      {
        "q": "LCM of 15 and 20:",
        "options": [
          "5",
          "30",
          "60",
          "300"
        ],
        "answer": 2
      },
      {
        "q": "A composite number has:",
        "options": [
          "Exactly 2 factors",
          "More than 2 factors",
          "Exactly 1 factor",
          "No factors"
        ],
        "answer": 1
      },
      {
        "q": "The smallest composite number is:",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "answer": 3
      }
    ]
  },
  {
    "id": 12,
    "number": "12",
    "title": "Another Peek Beyond the Point",
    "description": "Advanced decimal operations - multiplication and division of decimals, decimal patterns, and real-world problem solving",
    "topics": [
      {
        "name": "12.1 Multiplying Decimals",
        "content": "Multiplying decimals extends the multiplication rules we know for whole numbers. The key is keeping track of decimal places in the answer.\n\n**Rule for Multiplying Decimals:**\n1. Ignore the decimal points and multiply as whole numbers\n2. Count the total decimal places in both numbers\n3. Place the decimal point in the answer with that many decimal places\n\n**Examples:**\n• 0.3 × 0.4 = 0.12 (1 + 1 = 2 decimal places)\n• 2.5 × 0.3 = 0.75 (1 + 1 = 2 decimal places: 25 × 3 = 75 → 0.75)\n• 1.2 × 3.5 = 4.20 = 4.2 (1 + 1 = 2 decimal places: 12 × 35 = 420 → 4.20)\n• 0.06 × 0.7 = 0.042 (2 + 1 = 3 decimal places: 6 × 7 = 42 → 0.042)\n\n**Multiplying by Powers of 10:**\n• 3.456 × 10 = 34.56 (move decimal 1 place right)\n• 3.456 × 100 = 345.6 (move decimal 2 places right)\n• 3.456 × 1000 = 3456 (move decimal 3 places right)\n\n**Multiplying Decimals by Whole Numbers:**\n• 2.5 × 4 = 10.0 = 10\n• 0.75 × 8 = 6.00 = 6\n\n**Real-World Applications:**\n• Cost: 2.5 kg of apples at Rs. 80 per kg = 2.5 × 80 = Rs. 200\n• Area: Room 4.5 m × 3.2 m = 14.4 m²\n• Speed-Time: Walking 4.5 km/hr for 2.5 hours = 11.25 km\n\n**Practice Tip:** When unsure about decimal placement, estimate first. 2.5 × 3.5 should be close to 3 × 4 = 12, so 8.75 makes sense, but 87.5 or 0.875 wouldn't!"
      },
      {
        "name": "12.2 Dividing Decimals",
        "content": "Dividing decimals requires converting the division into a simpler form by removing the decimal from the divisor.\n\n**Dividing a Decimal by a Whole Number:**\nJust divide normally and place the decimal point in the quotient directly above where it is in the dividend:\n• 4.8 ÷ 2 = 2.4\n• 15.6 ÷ 3 = 5.2\n• 0.45 ÷ 5 = 0.09\n\n**Dividing by a Decimal:**\nMake the divisor a whole number by multiplying both numbers by 10, 100, etc.:\n• 4.8 ÷ 0.2 = 48 ÷ 2 = 24 (multiply both by 10)\n• 3.6 ÷ 0.04 = 360 ÷ 4 = 90 (multiply both by 100)\n• 7.5 ÷ 2.5 = 75 ÷ 25 = 3 (multiply both by 10)\n\n**Dividing by Powers of 10:**\n• 345.6 ÷ 10 = 34.56 (move decimal 1 place left)\n• 345.6 ÷ 100 = 3.456 (move decimal 2 places left)\n• 345.6 ÷ 1000 = 0.3456 (move decimal 3 places left)\n\n**Converting Fractions to Decimals:**\nDivide the numerator by the denominator:\n• 3/8 = 3 ÷ 8 = 0.375\n• 5/6 = 5 ÷ 6 = 0.8333...\n\n**Real-World Applications:**\n• Sharing a bill: Rs. 457.50 among 3 people = 457.50 ÷ 3 = Rs. 152.50 each\n• Unit price: Rs. 67.50 for 2.5 kg = 67.50 ÷ 2.5 = Rs. 27 per kg\n\n**Practice Tip:** Always make the divisor a whole number first - it makes the division much easier and less error-prone."
      },
      {
        "name": "12.3 Decimal Patterns and Problem Solving",
        "content": "Decimals reveal beautiful patterns when we explore multiplication tables, recurring decimals, and systematic calculations.\n\n**Patterns in Decimal Products:**\n• 0.1 × 0.1 = 0.01\n• 0.1 × 0.01 = 0.001\n• 0.01 × 0.01 = 0.0001\nPattern: The number of decimal places ADDS up!\n\n**Repeating Decimal Patterns:**\n• 1/9 = 0.111...\n• 2/9 = 0.222...\n• 1/7 = 0.142857142857... (period of 6 digits!)\n• 1/11 = 0.090909...\n• 1/99 = 0.010101...\n\n**Interesting Pattern:**\n• 1/9 = 0.111..., so 9 × 0.111... = 0.999... = 1 (yes, 0.999... = 1!)\n\n**Problem-Solving with Decimals:**\nType 1: Multi-step problems\nA shopkeeper buys 12.5 kg of rice at Rs. 42.40/kg and sells at Rs. 48.60/kg.\nCost = 12.5 × 42.40 = Rs. 530\nSelling = 12.5 × 48.60 = Rs. 607.50\nProfit = 607.50 - 530 = Rs. 77.50\n\nType 2: Estimation and checking\nIs 3.7 × 2.8 closer to 10 or 11? Estimate: 4 × 3 = 12, so answer ≈ 10.36\n\n**Decimal Representations of Common Values:**\n• π ≈ 3.14159\n• √2 ≈ 1.414\n• √3 ≈ 1.732\n• e ≈ 2.718\n\n**Practice Tip:** Always estimate your answer before calculating with decimals. This helps catch errors in decimal point placement."
      }
    ],
    "questions": [
      {
        "q": "0.3 x 0.4 = ?",
        "options": [
          "0.12",
          "1.2",
          "12",
          "0.012"
        ],
        "answer": 0
      },
      {
        "q": "4.8 / 0.2 = ?",
        "options": [
          "2.4",
          "24",
          "0.24",
          "240"
        ],
        "answer": 1
      },
      {
        "q": "3.456 x 100 = ?",
        "options": [
          "34.56",
          "345.6",
          "3456",
          "0.03456"
        ],
        "answer": 1
      },
      {
        "q": "15.6 / 3 = ?",
        "options": [
          "5.2",
          "52",
          "0.52",
          "5.02"
        ],
        "answer": 0
      },
      {
        "q": "0.06 x 0.7 = ?",
        "options": [
          "0.42",
          "0.042",
          "4.2",
          "0.0042"
        ],
        "answer": 1
      },
      {
        "q": "345.6 / 100 = ?",
        "options": [
          "34.56",
          "3.456",
          "0.3456",
          "3456"
        ],
        "answer": 1
      },
      {
        "q": "2.5 x 4 = ?",
        "options": [
          "10",
          "1.0",
          "100",
          "6.5"
        ],
        "answer": 0
      },
      {
        "q": "7.5 / 2.5 = ?",
        "options": [
          "3",
          "30",
          "0.3",
          "5"
        ],
        "answer": 0
      },
      {
        "q": "How many decimal places in 0.3 x 0.04?",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "answer": 2
      },
      {
        "q": "1.2 x 3.5 = ?",
        "options": [
          "42",
          "4.2",
          "0.42",
          "4.20"
        ],
        "answer": 1
      },
      {
        "q": "0.45 / 5 = ?",
        "options": [
          "0.9",
          "0.09",
          "9",
          "0.009"
        ],
        "answer": 1
      },
      {
        "q": "Area of room 4.5m x 3.2m = ?",
        "options": [
          "7.7 m²",
          "14.4 m²",
          "144 m²",
          "1.44 m²"
        ],
        "answer": 1
      },
      {
        "q": "3.6 / 0.04 = ?",
        "options": [
          "9",
          "90",
          "0.9",
          "900"
        ],
        "answer": 1
      },
      {
        "q": "0.1 x 0.01 = ?",
        "options": [
          "0.01",
          "0.001",
          "0.1",
          "0.0001"
        ],
        "answer": 1
      },
      {
        "q": "1/9 as a decimal is:",
        "options": [
          "0.1",
          "0.111...",
          "0.9",
          "0.19"
        ],
        "answer": 1
      },
      {
        "q": "67.50 / 2.5 = ?",
        "options": [
          "2.7",
          "27",
          "270",
          "0.27"
        ],
        "answer": 1
      },
      {
        "q": "0.75 x 8 = ?",
        "options": [
          "6",
          "60",
          "0.6",
          "6.0"
        ],
        "answer": 0
      },
      {
        "q": "2.5 kg at Rs. 80/kg costs:",
        "options": [
          "Rs. 200",
          "Rs. 82.50",
          "Rs. 77.50",
          "Rs. 32"
        ],
        "answer": 0
      },
      {
        "q": "0.999... (repeating) equals:",
        "options": [
          "Less than 1",
          "Exactly 1",
          "More than 1",
          "Undefined"
        ],
        "answer": 1
      },
      {
        "q": "3/8 as decimal:",
        "options": [
          "0.38",
          "0.375",
          "0.3",
          "0.83"
        ],
        "answer": 1
      },
      {
        "q": "Estimate 3.7 x 2.8:",
        "options": [
          "About 6",
          "About 10",
          "About 12",
          "About 8"
        ],
        "answer": 2
      },
      {
        "q": "12.5 x 0.8 = ?",
        "options": [
          "100",
          "10",
          "1.0",
          "10.0"
        ],
        "answer": 1
      },
      {
        "q": "0.01 x 0.01 = ?",
        "options": [
          "0.01",
          "0.001",
          "0.0001",
          "0.1"
        ],
        "answer": 2
      },
      {
        "q": "Rs. 457.50 / 3 = ?",
        "options": [
          "Rs. 150",
          "Rs. 152.50",
          "Rs. 155",
          "Rs. 145.50"
        ],
        "answer": 1
      },
      {
        "q": "1/7 has a repeating period of:",
        "options": [
          "1 digit",
          "3 digits",
          "6 digits",
          "7 digits"
        ],
        "answer": 2
      },
      {
        "q": "5.6 x 10 = ?",
        "options": [
          "0.56",
          "56",
          "560",
          "5.60"
        ],
        "answer": 1
      },
      {
        "q": "8.4 / 0.7 = ?",
        "options": [
          "1.2",
          "12",
          "120",
          "0.12"
        ],
        "answer": 1
      },
      {
        "q": "0.5 x 0.5 = ?",
        "options": [
          "0.25",
          "2.5",
          "0.025",
          "1.0"
        ],
        "answer": 0
      },
      {
        "q": "1/11 as decimal:",
        "options": [
          "0.11",
          "0.0909...",
          "0.111...",
          "0.99"
        ],
        "answer": 1
      },
      {
        "q": "Profit = selling - cost. If cost = Rs. 530 and selling = Rs. 607.50:",
        "options": [
          "Rs. 77.50",
          "Rs. 137.50",
          "Rs. 1137.50",
          "Rs. 77"
        ],
        "answer": 0
      },
      {
        "q": "6.3 / 0.9 = ?",
        "options": [
          "7",
          "70",
          "0.7",
          "63"
        ],
        "answer": 0
      },
      {
        "q": "0.2 x 0.2 x 0.2 = ?",
        "options": [
          "0.6",
          "0.06",
          "0.008",
          "0.8"
        ],
        "answer": 2
      },
      {
        "q": "4.56 x 1000 = ?",
        "options": [
          "45.6",
          "456",
          "4560",
          "45600"
        ],
        "answer": 2
      },
      {
        "q": "Which is larger: 0.5 x 0.5 or 0.5 + 0.5?",
        "options": [
          "0.5 x 0.5",
          "0.5 + 0.5",
          "They are equal",
          "Cannot compare"
        ],
        "answer": 1
      },
      {
        "q": "9.9 / 0.3 = ?",
        "options": [
          "3.3",
          "33",
          "330",
          "0.33"
        ],
        "answer": 1
      },
      {
        "q": "√2 as decimal (approx):",
        "options": [
          "1.414",
          "1.732",
          "2.236",
          "1.000"
        ],
        "answer": 0
      },
      {
        "q": "0.125 x 8 = ?",
        "options": [
          "1",
          "10",
          "0.1",
          "100"
        ],
        "answer": 0
      },
      {
        "q": "The decimal places in a product = sum of decimal places in:",
        "options": [
          "Only first number",
          "Only second number",
          "Both numbers",
          "Neither"
        ],
        "answer": 2
      },
      {
        "q": "4.5 km/hr for 2.5 hours = ? km",
        "options": [
          "7.0",
          "11.25",
          "2.0",
          "18"
        ],
        "answer": 1
      },
      {
        "q": "0.04 x 25 = ?",
        "options": [
          "1",
          "10",
          "100",
          "0.1"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": 13,
    "number": "13",
    "title": "Connecting the Dots",
    "description": "Understanding data handling through pictographs, bar graphs, tally marks, and interpreting real-world data",
    "topics": [
      {
        "name": "13.1 Collecting and Organising Data",
        "content": "Data is raw information collected from observations, surveys, or experiments. Organising data makes it easier to understand and draw conclusions.\n\n**What is Data?**\nData is a collection of facts, numbers, or information gathered for a purpose. Examples:\n• Heights of students in a class\n• Marks scored in a test\n• Favourite fruits of 30 children\n• Temperature recorded over a week\n\n**Types of Data:**\n• **Qualitative (Categorical):** Describes qualities - colours, names, types (e.g., favourite sport)\n• **Quantitative (Numerical):** Describes quantities using numbers (e.g., height, weight, marks)\n\n**Collecting Data:**\n• **Survey:** Asking people questions (How many siblings do you have?)\n• **Observation:** Recording what you see (counting vehicles on a road)\n• **Experiment:** Performing tests and recording results (tossing a coin 50 times)\n\n**Organising Data - Tally Marks:**\nTally marks help count data efficiently:\n• | = 1, || = 2, ||| = 3, |||| = 4, ⃠ = 5 (cross the four with a diagonal)\n\n**Frequency Table:**\nA table showing how often each value appears:\nFruit | Tally | Frequency\nApple | |||| ||| | 8\nBanana | |||| | 5\nOrange | |||| || | 7\n\n**Practice Tip:** When collecting data, always be clear about what you're measuring and keep your records organized from the start."
      },
      {
        "name": "13.2 Pictographs and Bar Graphs",
        "content": "Visual representations of data make patterns and comparisons much easier to understand than raw numbers. Pictographs and bar graphs are two fundamental types.\n\n**Pictographs:**\nUse pictures or symbols to represent data. Each picture represents a fixed number of items.\n• Key: 🍎 = 10 apples\n• Monday: 🍎🍎🍎 = 30 apples sold\n• Half symbol means half the value: 🍎🍎½ = 25 apples\n\n**Creating a Pictograph:**\n1. Choose an appropriate symbol\n2. Decide the scale (each symbol = how many?)\n3. Draw the correct number of symbols for each category\n4. Include a key/legend\n\n**Bar Graphs:**\nUse rectangular bars to represent data. The height (or length) of each bar shows the frequency/value.\n\n**Rules for Bar Graphs:**\n• All bars should have equal width\n• Equal gaps between bars\n• The scale on the y-axis should be uniform\n• Label both axes clearly\n• Give the graph a title\n\n**Reading Bar Graphs:**\n• Compare bar heights to compare values\n• The tallest bar shows the maximum value\n• The shortest bar shows the minimum value\n• The difference in heights shows the difference in values\n\n**Pictograph vs Bar Graph:**\n• Pictographs are visually appealing but less precise\n• Bar graphs are more precise and can handle larger data ranges\n• Both are good for comparing categories\n\n**Practice Tip:** When drawing bar graphs, always start the y-axis from 0 to avoid misleading representations. A break symbol (//) can be used if values are very large."
      },
      {
        "name": "13.3 Drawing Conclusions from Data",
        "content": "The real power of data handling lies in interpreting graphs and drawing meaningful conclusions that help in decision-making.\n\n**Types of Questions to Ask:**\n• What is the most common/popular item? (Mode)\n• What is the total? (Sum of all values)\n• What is the average? (Sum ÷ number of items)\n• What is the range? (Maximum - Minimum)\n• Are there any trends or patterns?\n\n**Mean (Average):**\nSum of all values ÷ Number of values\nExample: Marks 45, 67, 89, 56, 78\nMean = (45+67+89+56+78) ÷ 5 = 335 ÷ 5 = 67\n\n**Mode:**\nThe value that appears most frequently\nData: 3, 5, 7, 5, 8, 5, 9 → Mode = 5 (appears 3 times)\n\n**Range:**\nMaximum value - Minimum value\nData: 12, 45, 23, 67, 34 → Range = 67 - 12 = 55\n\n**Making Predictions:**\nIf ice cream sales increase every summer, we can predict high sales next summer too.\nIf a student's marks show an upward trend, they are likely improving.\n\n**Misleading Graphs:**\nWatch out for:\n• Y-axis not starting from 0 (makes differences look bigger)\n• Unequal bar widths\n• Inappropriate scale\n• Missing labels\n\n**Real-World Applications:**\n• Election results displayed as bar graphs\n• Weather forecasts use data analysis\n• Sports statistics help teams strategize\n• Business decisions based on sales data\n\n**Practice Tip:** Always check the scale and labels before interpreting any graph. A graph without proper labels can be misleading!"
      }
    ],
    "questions": [
      {
        "q": "In a pictograph, if one symbol = 5, three symbols mean:",
        "options": [
          "3",
          "5",
          "15",
          "8"
        ],
        "answer": 2
      },
      {
        "q": "In a bar graph, the height of a bar represents:",
        "options": [
          "The category",
          "The frequency/value",
          "The width",
          "The colour"
        ],
        "answer": 1
      },
      {
        "q": "Tally marks for 7: |||| ||",
        "options": [
          "True",
          "False",
          "Incomplete",
          "Wrong format"
        ],
        "answer": 0
      },
      {
        "q": "Mean of 10, 20, 30 is:",
        "options": [
          "10",
          "20",
          "30",
          "60"
        ],
        "answer": 1
      },
      {
        "q": "Mode of 3, 5, 5, 7, 5, 8 is:",
        "options": [
          "3",
          "5",
          "7",
          "8"
        ],
        "answer": 1
      },
      {
        "q": "Range of 12, 45, 23, 67, 34 is:",
        "options": [
          "33",
          "45",
          "55",
          "67"
        ],
        "answer": 2
      },
      {
        "q": "In a bar graph, bars should have:",
        "options": [
          "Different widths",
          "Equal widths",
          "No gaps",
          "Random widths"
        ],
        "answer": 1
      },
      {
        "q": "Qualitative data is:",
        "options": [
          "Numbers",
          "Categories/qualities",
          "Always large",
          "Always small"
        ],
        "answer": 1
      },
      {
        "q": "If pictograph shows 2.5 symbols and 1 symbol = 10, the value is:",
        "options": [
          "2.5",
          "10",
          "25",
          "12.5"
        ],
        "answer": 2
      },
      {
        "q": "A frequency table shows:",
        "options": [
          "How often each value appears",
          "The total of data",
          "Only the average",
          "Only the maximum"
        ],
        "answer": 0
      },
      {
        "q": "The y-axis in a bar graph should start from:",
        "options": [
          "1",
          "10",
          "0",
          "Any number"
        ],
        "answer": 2
      },
      {
        "q": "Mean of 5 numbers that sum to 100:",
        "options": [
          "5",
          "10",
          "20",
          "50"
        ],
        "answer": 2
      },
      {
        "q": "Which is NOT a way to collect data?",
        "options": [
          "Survey",
          "Observation",
          "Guessing",
          "Experiment"
        ],
        "answer": 2
      },
      {
        "q": "In a pictograph, the key tells us:",
        "options": [
          "The title",
          "What each symbol represents",
          "The total",
          "The date"
        ],
        "answer": 1
      },
      {
        "q": "Tally marks for 13:",
        "options": [
          "|||| |||| |||",
          "|||| |||| ||",
          "13 lines",
          "|||| ||||||| |"
        ],
        "answer": 0
      },
      {
        "q": "A misleading graph might have:",
        "options": [
          "Y-axis not from 0",
          "Equal bars",
          "Proper labels",
          "Correct scale"
        ],
        "answer": 0
      },
      {
        "q": "Data: 4, 7, 4, 8, 4, 9. Mode = ?",
        "options": [
          "4",
          "7",
          "8",
          "9"
        ],
        "answer": 0
      },
      {
        "q": "Pictographs are best for:",
        "options": [
          "Exact values",
          "Visual comparison of categories",
          "Showing trends",
          "Complex data"
        ],
        "answer": 1
      },
      {
        "q": "Mean = ?",
        "options": [
          "Most frequent",
          "Middle value",
          "Sum/Count",
          "Max - Min"
        ],
        "answer": 2
      },
      {
        "q": "Which graph uses rectangular bars?",
        "options": [
          "Pie chart",
          "Pictograph",
          "Bar graph",
          "Line graph"
        ],
        "answer": 2
      },
      {
        "q": "Range tells us:",
        "options": [
          "The average",
          "The spread of data",
          "The most common value",
          "The total"
        ],
        "answer": 1
      },
      {
        "q": "If tallies show |||| |||| |||| |, the count is:",
        "options": [
          "14",
          "15",
          "16",
          "17"
        ],
        "answer": 2
      },
      {
        "q": "Bar graphs are more precise than pictographs because:",
        "options": [
          "They use colours",
          "Exact values can be read from scale",
          "They are bigger",
          "They use pictures"
        ],
        "answer": 1
      },
      {
        "q": "Average marks of 3 students: 80, 90, 70 = ?",
        "options": [
          "70",
          "80",
          "90",
          "240"
        ],
        "answer": 1
      },
      {
        "q": "A survey is:",
        "options": [
          "Asking people questions",
          "A type of graph",
          "A mathematical formula",
          "A tally mark"
        ],
        "answer": 0
      },
      {
        "q": "Temperature data over a week is best shown using:",
        "options": [
          "Pictograph",
          "Bar graph",
          "Both work",
          "Neither"
        ],
        "answer": 2
      },
      {
        "q": "If mode = 5 and data is 3, 5, 5, 7, x, the value of x could be:",
        "options": [
          "Only 5",
          "Any number except 3 or 7",
          "3 or 7 or any other number",
          "Both A and C work"
        ],
        "answer": 3
      },
      {
        "q": "Total students if mean = 25 and count = 4:",
        "options": [
          "25",
          "50",
          "100",
          "6.25"
        ],
        "answer": 2
      },
      {
        "q": "What does a half-symbol in a pictograph represent?",
        "options": [
          "Nothing",
          "Half the key value",
          "Double the key value",
          "Error"
        ],
        "answer": 1
      },
      {
        "q": "Mean of 0, 10, 0, 10, 0 is:",
        "options": [
          "0",
          "4",
          "5",
          "10"
        ],
        "answer": 1
      },
      {
        "q": "Which is categorical data?",
        "options": [
          "Heights of students",
          "Favourite colours",
          "Test scores",
          "Weight of bags"
        ],
        "answer": 1
      },
      {
        "q": "Bars in a bar graph must have:",
        "options": [
          "Equal gaps between them",
          "No gaps",
          "Overlapping bars",
          "Random gaps"
        ],
        "answer": 0
      },
      {
        "q": "If 50 coins are tossed and 23 show heads, frequency of heads:",
        "options": [
          "23",
          "27",
          "50",
          "0.46"
        ],
        "answer": 0
      },
      {
        "q": "Data: 10, 20, 30, 40, 50. Range = ?",
        "options": [
          "10",
          "30",
          "40",
          "50"
        ],
        "answer": 2
      },
      {
        "q": "A graph title should describe:",
        "options": [
          "The colours used",
          "What the graph is about",
          "Who made it",
          "When it was made"
        ],
        "answer": 1
      },
      {
        "q": "Mean of 6, 6, 6, 6 is:",
        "options": [
          "4",
          "6",
          "24",
          "12"
        ],
        "answer": 1
      },
      {
        "q": "Which can show exact values: pictograph or bar graph?",
        "options": [
          "Pictograph",
          "Bar graph",
          "Both equally",
          "Neither"
        ],
        "answer": 1
      },
      {
        "q": "Data: 1, 2, 3, 4, 5. Mean = Median = ?",
        "options": [
          "1",
          "2",
          "3",
          "5"
        ],
        "answer": 2
      },
      {
        "q": "An upward trend in marks means:",
        "options": [
          "Marks are decreasing",
          "Marks are improving",
          "Marks are constant",
          "Data is wrong"
        ],
        "answer": 1
      },
      {
        "q": "How many tally groups in 23? (groups of 5)",
        "options": [
          "4 groups + 3",
          "5 groups",
          "3 groups + 8",
          "23 groups"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": 14,
    "number": "14",
    "title": "Constructions and Tilings",
    "description": "Geometric constructions with ruler and compass, tessellations, tiling patterns, and understanding which shapes can tile a plane",
    "topics": [
      {
        "name": "14.1 Geometric Constructions",
        "content": "Geometric constructions use only a ruler (straightedge) and compass - no measuring of lengths or angles. These ancient techniques reveal deep mathematical truths.\n\n**Why Ruler and Compass Only?**\nAncient Greek mathematicians believed that the purest geometric constructions should use only these two tools. This limitation actually leads to deeper understanding of geometry!\n\n**Basic Constructions:**\n\n**1. Perpendicular Bisector of a Line Segment:**\nGiven AB:\na) Open compass more than half of AB\nb) With centre A, draw arcs above and below AB\nc) With centre B, same radius, draw arcs intersecting the first ones\nd) Connect the two intersection points - this line is the perpendicular bisector\nProperties: Every point on it is equidistant from A and B\n\n**2. Angle Bisector:**\nGiven angle PQR:\na) With centre Q, draw an arc cutting both rays at points A and B\nb) With centres A and B (equal radius), draw arcs intersecting at point C\nc) QC is the angle bisector\n\n**3. Constructing 60° Angle:**\nDraw a ray, open compass to any radius, draw arc from endpoint, then from where arc meets ray draw another arc with same radius. Connect = 60°\n\n**4. Constructing 90° Angle:**\nFirst construct 60°, then bisect 60° to get 30°, and construct 60° + 30° = 90°.\nOr: Use the perpendicular bisector method at the endpoint of a ray.\n\n**Practice Tip:** Never change the compass width in the middle of a construction unless the step specifically requires it. Many construction errors come from accidental compass width changes."
      },
      {
        "name": "14.2 Tessellations and Tiling Patterns",
        "content": "A tessellation (or tiling) is a pattern of shapes that covers a flat surface completely with no gaps and no overlaps. Understanding which shapes tessellate reveals important geometric properties.\n\n**What is a Tessellation?**\nA tessellation covers a plane completely using one or more shapes, with:\n• No gaps between shapes\n• No overlapping of shapes\n• The pattern can continue infinitely\n\n**Regular Tessellations:**\nUsing only ONE type of regular polygon:\n• **Equilateral triangles:** Yes! (6 meet at each vertex, 6×60° = 360°)\n• **Squares:** Yes! (4 meet at each vertex, 4×90° = 360°)\n• **Regular hexagons:** Yes! (3 meet at each vertex, 3×120° = 360°)\n• Regular pentagons, heptagons, etc.: NO! (their angles don't add to 360°)\n\n**The Key Rule:**\nShapes tessellate if the angles meeting at each vertex add up to exactly 360°.\n\n**Semi-Regular Tessellations:**\nUsing TWO or more types of regular polygons:\n• Squares + equilateral triangles\n• Hexagons + equilateral triangles\n• There are exactly 8 semi-regular tessellations\n\n**Tessellations in Real Life:**\n• Floor tiles (squares, hexagons)\n• Honeycomb (hexagons)\n• Brick walls (rectangles offset)\n• Islamic art patterns\n• M.C. Escher's famous artwork\n\n**Non-Regular Tessellations:**\n• Any triangle can tessellate! (rotate and flip to fill gaps)\n• Any quadrilateral can tessellate!\n• Most pentagons CANNOT tessellate (only 15 known types can)\n\n**Practice Tip:** To test if a shape tessellates, check if copies of it can surround a single point with angles adding to 360°."
      }
    ],
    "questions": [
      {
        "q": "A perpendicular bisector of AB passes through:",
        "options": [
          "Point A",
          "Point B",
          "Midpoint of AB",
          "None of these"
        ],
        "answer": 2
      },
      {
        "q": "Geometric constructions use only:",
        "options": [
          "Ruler and protractor",
          "Ruler and compass",
          "Protractor and compass",
          "Set square and ruler"
        ],
        "answer": 1
      },
      {
        "q": "Which regular polygon can tessellate?",
        "options": [
          "Pentagon",
          "Hexagon",
          "Octagon",
          "Heptagon"
        ],
        "answer": 1
      },
      {
        "q": "Angles at a vertex in a tessellation must add to:",
        "options": [
          "180°",
          "270°",
          "360°",
          "90°"
        ],
        "answer": 2
      },
      {
        "q": "To construct 60°, we use:",
        "options": [
          "Protractor",
          "Equilateral triangle construction",
          "Set square",
          "Ruler only"
        ],
        "answer": 1
      },
      {
        "q": "How many regular tessellations exist?",
        "options": [
          "1",
          "2",
          "3",
          "Infinite"
        ],
        "answer": 2
      },
      {
        "q": "An angle bisector divides an angle into:",
        "options": [
          "Unequal parts",
          "Two equal parts",
          "Three equal parts",
          "Random parts"
        ],
        "answer": 1
      },
      {
        "q": "Can any triangle tessellate?",
        "options": [
          "Yes",
          "Only equilateral",
          "Only right triangles",
          "No"
        ],
        "answer": 0
      },
      {
        "q": "Every point on perpendicular bisector of AB is:",
        "options": [
          "Closer to A",
          "Closer to B",
          "Equidistant from A and B",
          "On segment AB"
        ],
        "answer": 2
      },
      {
        "q": "4 squares meet at a vertex: 4 x 90° = ?",
        "options": [
          "270°",
          "360°",
          "450°",
          "180°"
        ],
        "answer": 1
      },
      {
        "q": "Regular pentagons cannot tessellate because:",
        "options": [
          "They are too small",
          "Interior angle (108°) doesn't divide 360° evenly",
          "They have 5 sides",
          "They are curved"
        ],
        "answer": 1
      },
      {
        "q": "A tessellation has:",
        "options": [
          "Gaps between shapes",
          "Overlapping shapes",
          "No gaps and no overlaps",
          "Only triangles"
        ],
        "answer": 2
      },
      {
        "q": "To bisect an angle, we need:",
        "options": [
          "Only a ruler",
          "Only a compass",
          "Ruler and compass",
          "A protractor"
        ],
        "answer": 2
      },
      {
        "q": "Honeycomb cells are shaped like:",
        "options": [
          "Squares",
          "Triangles",
          "Hexagons",
          "Pentagons"
        ],
        "answer": 2
      },
      {
        "q": "How many equilateral triangles meet at a vertex in tessellation?",
        "options": [
          "3",
          "4",
          "5",
          "6"
        ],
        "answer": 3
      },
      {
        "q": "Can any quadrilateral tessellate?",
        "options": [
          "Yes",
          "Only rectangles",
          "Only squares",
          "No"
        ],
        "answer": 0
      },
      {
        "q": "The interior angle of a regular hexagon is:",
        "options": [
          "90°",
          "100°",
          "108°",
          "120°"
        ],
        "answer": 3
      },
      {
        "q": "Semi-regular tessellations use:",
        "options": [
          "One type of polygon",
          "Two or more types",
          "Only triangles",
          "Only curved shapes"
        ],
        "answer": 1
      },
      {
        "q": "Constructing a perpendicular bisector: compass opening should be:",
        "options": [
          "Equal to AB",
          "Less than half AB",
          "More than half AB",
          "Exactly half AB"
        ],
        "answer": 2
      },
      {
        "q": "M.C. Escher is famous for:",
        "options": [
          "Algebra",
          "Tessellation art",
          "Statistics",
          "Calculus"
        ],
        "answer": 1
      },
      {
        "q": "How many semi-regular tessellations exist?",
        "options": [
          "3",
          "5",
          "8",
          "Infinite"
        ],
        "answer": 2
      },
      {
        "q": "Which shapes tile a bathroom floor?",
        "options": [
          "Squares",
          "Regular pentagons",
          "Regular heptagons",
          "Regular octagons alone"
        ],
        "answer": 0
      },
      {
        "q": "To construct 30°, first construct:",
        "options": [
          "90° and bisect",
          "60° and bisect",
          "45° and bisect",
          "120° and bisect"
        ],
        "answer": 1
      },
      {
        "q": "3 regular hexagons at a vertex: 3 x 120° = ?",
        "options": [
          "240°",
          "300°",
          "360°",
          "480°"
        ],
        "answer": 2
      },
      {
        "q": "A straightedge differs from ruler because it has:",
        "options": [
          "Markings",
          "No markings",
          "A compass",
          "A protractor"
        ],
        "answer": 1
      },
      {
        "q": "Brick walls are an example of:",
        "options": [
          "Regular tessellation",
          "Semi-regular tessellation",
          "Non-regular tessellation",
          "Not a tessellation"
        ],
        "answer": 2
      },
      {
        "q": "Interior angle of equilateral triangle:",
        "options": [
          "45°",
          "60°",
          "90°",
          "120°"
        ],
        "answer": 1
      },
      {
        "q": "Can regular octagons alone tessellate?",
        "options": [
          "Yes",
          "No (135° doesn't divide 360°)",
          "Only with squares",
          "Sometimes"
        ],
        "answer": 1
      },
      {
        "q": "The 3 regular tessellating shapes are:",
        "options": [
          "Triangle, square, pentagon",
          "Triangle, square, hexagon",
          "Square, pentagon, hexagon",
          "Triangle, pentagon, hexagon"
        ],
        "answer": 1
      },
      {
        "q": "Constructing 90° can be done by:",
        "options": [
          "Constructing perpendicular",
          "Bisecting 180°",
          "Both A and B",
          "Neither"
        ],
        "answer": 2
      },
      {
        "q": "Islamic art commonly features:",
        "options": [
          "Random patterns",
          "Geometric tessellations",
          "Only circles",
          "No patterns"
        ],
        "answer": 1
      },
      {
        "q": "To construct 45°:",
        "options": [
          "Construct 90° and bisect",
          "Construct 60° and subtract 15°",
          "Draw a diagonal",
          "Use protractor only"
        ],
        "answer": 0
      },
      {
        "q": "A tessellation can extend:",
        "options": [
          "Only to the edge of paper",
          "Infinitely",
          "Only 10 times",
          "Only in one direction"
        ],
        "answer": 1
      },
      {
        "q": "Interior angle of a square:",
        "options": [
          "60°",
          "90°",
          "120°",
          "150°"
        ],
        "answer": 1
      },
      {
        "q": "In a construction, compass is used to:",
        "options": [
          "Measure angles",
          "Draw straight lines",
          "Draw arcs and circles",
          "Erase lines"
        ],
        "answer": 2
      },
      {
        "q": "How many known pentagon types can tessellate?",
        "options": [
          "0",
          "5",
          "15",
          "All of them"
        ],
        "answer": 2
      },
      {
        "q": "Perpendicular bisector is also the ___ of symmetry:",
        "options": [
          "Line",
          "Point",
          "Angle",
          "Curve"
        ],
        "answer": 0
      },
      {
        "q": "Octagons + squares can tessellate together:",
        "options": [
          "True",
          "False",
          "Only if equal sizes",
          "Only special octagons"
        ],
        "answer": 0
      },
      {
        "q": "The angle bisector of 120° creates two angles of:",
        "options": [
          "30° each",
          "45° each",
          "60° each",
          "90° each"
        ],
        "answer": 2
      },
      {
        "q": "Floor tiles are a real-world example of:",
        "options": [
          "Fractals",
          "Tessellations",
          "Symmetry only",
          "Congruence only"
        ],
        "answer": 1
      }
    ]
  },
  {
    "id": 15,
    "number": "15",
    "title": "Finding the Unknown",
    "description": "Introduction to equations - forming equations, solving simple equations, balancing method, and word problems using equations",
    "topics": [
      {
        "name": "15.1 What is an Equation?",
        "content": "An equation is a mathematical statement that says two things are equal. It always has an equals sign (=) and often has an unknown value we need to find.\n\n**Expression vs Equation:**\n• Expression: 3x + 5 (no equals sign, represents a value)\n• Equation: 3x + 5 = 20 (has equals sign, can be solved)\n\n**Parts of an Equation:**\n• Left Hand Side (LHS): The expression on the left of =\n• Right Hand Side (RHS): The expression on the right of =\n• In 3x + 5 = 20: LHS = 3x + 5, RHS = 20\n\n**Solution of an Equation:**\nThe value of the variable that makes LHS = RHS\n• In x + 3 = 7: x = 4 (because 4 + 3 = 7 ✓)\n• In 2y = 10: y = 5 (because 2 × 5 = 10 ✓)\n\n**Forming Equations from Word Problems:**\n• 'A number plus 5 equals 12' → x + 5 = 12\n• 'Twice a number is 18' → 2x = 18\n• 'Three more than double a number is 17' → 2x + 3 = 17\n• 'Ravi's age after 5 years will be 20' → x + 5 = 20\n\n**The Balance Model:**\nThink of an equation as a balance scale. Both sides must be equal (balanced). Whatever you do to one side, you must do to the other to keep it balanced.\n\n**Practice Tip:** To verify your solution, always substitute it back into the original equation and check if LHS = RHS."
      },
      {
        "name": "15.2 Solving Simple Equations",
        "content": "Solving an equation means finding the value of the unknown variable that makes the equation true. We use inverse operations to isolate the variable.\n\n**The Balancing Method:**\nWhatever operation you perform on one side, you must perform on the other:\n• Add the same number to both sides\n• Subtract the same number from both sides\n• Multiply both sides by the same number\n• Divide both sides by the same number\n\n**Solving One-Step Equations:**\n• x + 5 = 12 → x + 5 - 5 = 12 - 5 → x = 7\n• x - 3 = 8 → x - 3 + 3 = 8 + 3 → x = 11\n• 3x = 15 → 3x/3 = 15/3 → x = 5\n• x/4 = 6 → x/4 × 4 = 6 × 4 → x = 24\n\n**Solving Two-Step Equations:**\n• 2x + 3 = 11\n  Step 1: Subtract 3: 2x = 8\n  Step 2: Divide by 2: x = 4\n  Check: 2(4) + 3 = 8 + 3 = 11 ✓\n\n• 3x - 7 = 14\n  Step 1: Add 7: 3x = 21\n  Step 2: Divide by 3: x = 7\n  Check: 3(7) - 7 = 21 - 7 = 14 ✓\n\n**Inverse Operations:**\n• Addition ↔ Subtraction (they undo each other)\n• Multiplication ↔ Division (they undo each other)\n\n**Common Mistakes:**\n• Performing operation on only one side\n• Using the wrong inverse operation\n• Not checking the answer\n\n**Practice Tip:** Always work systematically - first remove any constant added/subtracted, then handle the multiplication/division."
      },
      {
        "name": "15.3 Applications of Equations",
        "content": "Equations are one of the most powerful tools in mathematics. They let us solve real-world problems by converting words into mathematical statements.\n\n**Age Problems:**\n• Ravi is 5 years older than Sita. Their ages add to 25. Find their ages.\n  Let Sita's age = x. Then Ravi's age = x + 5.\n  x + (x + 5) = 25 → 2x + 5 = 25 → 2x = 20 → x = 10\n  Sita = 10, Ravi = 15\n\n**Number Problems:**\n• Three consecutive numbers add to 36. Find them.\n  Let numbers be n, n+1, n+2\n  n + (n+1) + (n+2) = 36 → 3n + 3 = 36 → 3n = 33 → n = 11\n  Numbers: 11, 12, 13\n\n**Geometry Problems:**\n• Perimeter of rectangle is 40 cm. Length is 3 times the breadth. Find dimensions.\n  Let breadth = x. Length = 3x.\n  2(x + 3x) = 40 → 2(4x) = 40 → 8x = 40 → x = 5\n  Breadth = 5 cm, Length = 15 cm\n\n**Money Problems:**\n• A pen costs Rs. 5 more than a pencil. 3 pens and 2 pencils cost Rs. 55. Find the cost of each.\n  Let pencil cost = x. Pen cost = x + 5.\n  3(x+5) + 2x = 55 → 3x + 15 + 2x = 55 → 5x = 40 → x = 8\n  Pencil = Rs. 8, Pen = Rs. 13\n\n**Steps for Word Problems:**\n1. Read carefully. What is unknown?\n2. Let the unknown = x\n3. Write other quantities in terms of x\n4. Form the equation from the given condition\n5. Solve the equation\n6. Check: Does the answer make sense?\n\n**Practice Tip:** The hardest part is forming the equation, not solving it. Practice translating English sentences into mathematical equations every day!"
      }
    ],
    "questions": [
      {
        "q": "In x + 5 = 12, x = ?",
        "options": [
          "5",
          "7",
          "12",
          "17"
        ],
        "answer": 1
      },
      {
        "q": "An equation has:",
        "options": [
          "No equals sign",
          "An equals sign",
          "Only numbers",
          "Only letters"
        ],
        "answer": 1
      },
      {
        "q": "If 2x = 18, then x = ?",
        "options": [
          "9",
          "16",
          "20",
          "36"
        ],
        "answer": 0
      },
      {
        "q": "The LHS of 3x + 5 = 20 is:",
        "options": [
          "3x",
          "5",
          "3x + 5",
          "20"
        ],
        "answer": 2
      },
      {
        "q": "'A number plus 5 equals 12' as equation:",
        "options": [
          "x - 5 = 12",
          "x + 5 = 12",
          "5x = 12",
          "x/5 = 12"
        ],
        "answer": 1
      },
      {
        "q": "If x - 3 = 8, then x = ?",
        "options": [
          "5",
          "8",
          "11",
          "24"
        ],
        "answer": 2
      },
      {
        "q": "Solve: 2x + 3 = 11",
        "options": [
          "x = 3",
          "x = 4",
          "x = 7",
          "x = 14"
        ],
        "answer": 1
      },
      {
        "q": "The inverse of addition is:",
        "options": [
          "Multiplication",
          "Division",
          "Subtraction",
          "Addition"
        ],
        "answer": 2
      },
      {
        "q": "If x/4 = 6, then x = ?",
        "options": [
          "2",
          "10",
          "24",
          "1.5"
        ],
        "answer": 2
      },
      {
        "q": "Solve: 3x - 7 = 14",
        "options": [
          "x = 3",
          "x = 7",
          "x = 21",
          "x = 63"
        ],
        "answer": 1
      },
      {
        "q": "'Twice a number is 18' means:",
        "options": [
          "x + 2 = 18",
          "x - 2 = 18",
          "2x = 18",
          "x/2 = 18"
        ],
        "answer": 2
      },
      {
        "q": "If 5x = 0, then x = ?",
        "options": [
          "5",
          "-5",
          "0",
          "Undefined"
        ],
        "answer": 2
      },
      {
        "q": "3 consecutive numbers add to 36. Smallest is:",
        "options": [
          "10",
          "11",
          "12",
          "13"
        ],
        "answer": 1
      },
      {
        "q": "In the balance model, to keep balance we must:",
        "options": [
          "Do same thing to both sides",
          "Only change LHS",
          "Only change RHS",
          "Do nothing"
        ],
        "answer": 0
      },
      {
        "q": "Solve: x/3 + 2 = 7",
        "options": [
          "x = 3",
          "x = 15",
          "x = 27",
          "x = 5"
        ],
        "answer": 1
      },
      {
        "q": "Perimeter of square = 4x. If perimeter = 24, side = ?",
        "options": [
          "4",
          "6",
          "8",
          "24"
        ],
        "answer": 1
      },
      {
        "q": "If 4x + 5 = 25, then x = ?",
        "options": [
          "5",
          "7.5",
          "20",
          "30"
        ],
        "answer": 0
      },
      {
        "q": "Ravi is x years old. In 5 years he'll be:",
        "options": [
          "x - 5",
          "x + 5",
          "5x",
          "x/5"
        ],
        "answer": 1
      },
      {
        "q": "Solve: 7x = 49",
        "options": [
          "x = 6",
          "x = 7",
          "x = 42",
          "x = 56"
        ],
        "answer": 1
      },
      {
        "q": "If x + x + x = 27, then x = ?",
        "options": [
          "3",
          "9",
          "27",
          "81"
        ],
        "answer": 1
      },
      {
        "q": "Pen costs Rs. 5 more than pencil (x). Pen cost:",
        "options": [
          "5x",
          "x - 5",
          "x + 5",
          "x/5"
        ],
        "answer": 2
      },
      {
        "q": "Solve: 2(x + 3) = 16",
        "options": [
          "x = 5",
          "x = 6.5",
          "x = 8",
          "x = 10"
        ],
        "answer": 0
      },
      {
        "q": "If the sum of two numbers is 20 and one is 8, the other is:",
        "options": [
          "8",
          "12",
          "20",
          "28"
        ],
        "answer": 1
      },
      {
        "q": "Solve: 5x - 10 = 30",
        "options": [
          "x = 4",
          "x = 6",
          "x = 8",
          "x = 40"
        ],
        "answer": 2
      },
      {
        "q": "Length = 3 x breadth. If breadth = x, perimeter = ?",
        "options": [
          "4x",
          "6x",
          "8x",
          "12x"
        ],
        "answer": 2
      },
      {
        "q": "If 3(x + 5) = 24, then x = ?",
        "options": [
          "3",
          "8",
          "13",
          "19"
        ],
        "answer": 0
      },
      {
        "q": "Check: Is x = 3 a solution of 2x + 1 = 7?",
        "options": [
          "Yes (7 = 7)",
          "No (5 ≠ 7)",
          "No (6 ≠ 7)",
          "Cannot determine"
        ],
        "answer": 0
      },
      {
        "q": "A number doubled and increased by 3 gives 15. The number:",
        "options": [
          "6",
          "7.5",
          "9",
          "12"
        ],
        "answer": 0
      },
      {
        "q": "Solve: x/2 - 3 = 7",
        "options": [
          "x = 8",
          "x = 14",
          "x = 20",
          "x = 2"
        ],
        "answer": 2
      },
      {
        "q": "Ages: Sister is x, brother is x+4. Sum = 24. x = ?",
        "options": [
          "8",
          "10",
          "12",
          "14"
        ],
        "answer": 1
      },
      {
        "q": "If 6x + 12 = 6, then x = ?",
        "options": [
          "0",
          "-1",
          "1",
          "3"
        ],
        "answer": 1
      },
      {
        "q": "Which is an equation?",
        "options": [
          "3x + 5",
          "3x + 5 = 20",
          "3 + 5 + x",
          "3x"
        ],
        "answer": 1
      },
      {
        "q": "Solve: 4(x - 2) = 20",
        "options": [
          "x = 3",
          "x = 5",
          "x = 7",
          "x = 22"
        ],
        "answer": 2
      },
      {
        "q": "Cost of 5 pens = Rs. 75. Cost of 1 pen:",
        "options": [
          "Rs. 10",
          "Rs. 15",
          "Rs. 70",
          "Rs. 375"
        ],
        "answer": 1
      },
      {
        "q": "If x = 2 satisfies 3x + a = 10, then a = ?",
        "options": [
          "2",
          "3",
          "4",
          "5"
        ],
        "answer": 2
      },
      {
        "q": "Solve: 10 - 2x = 4",
        "options": [
          "x = 2",
          "x = 3",
          "x = 7",
          "x = 14"
        ],
        "answer": 1
      },
      {
        "q": "Sum of two consecutive even numbers is 34. They are:",
        "options": [
          "15, 19",
          "16, 18",
          "14, 20",
          "12, 22"
        ],
        "answer": 1
      },
      {
        "q": "If 3x + 2x = 25, then x = ?",
        "options": [
          "3",
          "4",
          "5",
          "25"
        ],
        "answer": 2
      },
      {
        "q": "Rectangle: length = 2x+1, breadth = x. Perimeter = 32. x = ?",
        "options": [
          "3",
          "4",
          "5",
          "6"
        ],
        "answer": 2
      },
      {
        "q": "The first step to solve 2x + 6 = 20 is to:",
        "options": [
          "Divide by 2",
          "Subtract 6 from both sides",
          "Add 6 to both sides",
          "Multiply by 2"
        ],
        "answer": 1
      }
    ]
  }
];

// 5-section exam format per Ganita Prakash spec:
//   Section A — MCQ (single best answer, 1 mark each)
//   Section B — Case-Based (read a small scenario, then pick the best answer, 1 mark each)
//   Section C — Very Short Answer (write on paper, photograph and upload, 2 marks each)
//   Section D — Short Answer (write on paper, photograph and upload, 3 marks each)
//   Section E — Long Answer (write on paper, photograph and upload, 5 marks each)
// Each MCQ object also carries `section` ('A' or 'B') and `case` (case-based scenario,
// shown above the question for Section B). The pen-paper objects carry `section`
// ('C', 'D', or 'E') so the screen can label them correctly.

const finalExamMCQ = [
  // ---------- SECTION A — straight MCQ (15 × 1 = 15 marks) ----------
  { section: 'A', q: "What is the next number: 3, 6, 9, 12, ?", options: ["14", "15", "16", "18"], answer: 1 },
  { section: 'A', q: "An angle of 45 degrees is:", options: ["Acute", "Right", "Obtuse", "Reflex"], answer: 0 },
  { section: 'A', q: "The place value of 7 in 47,832 is:", options: ["7", "70", "700", "7000"], answer: 3 },
  { section: 'A', q: "The smallest prime number is:", options: ["0", "1", "2", "3"], answer: 2 },
  { section: 'A', q: "Perimeter of square with side 9 cm:", options: ["18 cm", "27 cm", "36 cm", "81 cm"], answer: 2 },
  { section: 'A', q: "3/4 is a _____ fraction:", options: ["Proper", "Improper", "Mixed", "Unit"], answer: 0 },
  { section: 'A', q: "Tool used to draw circles:", options: ["Ruler", "Compass", "Protractor", "Divider"], answer: 1 },
  { section: 'A', q: "Lines of symmetry in a rectangle:", options: ["1", "2", "3", "4"], answer: 1 },
  { section: 'A', q: "The opposite of -8 is:", options: ["-8", "0", "8", "1/8"], answer: 2 },
  { section: 'A', q: "1, 4, 9, 16, 25 are called:", options: ["Prime numbers", "Square numbers", "Odd numbers", "Even numbers"], answer: 1 },
  { section: 'A', q: "Two perpendicular lines form an angle of:", options: ["45", "60", "90", "180"], answer: 2 },
  { section: 'A', q: "Round 6,789 to nearest thousand:", options: ["6,000", "6,800", "7,000", "6,790"], answer: 2 },
  { section: 'A', q: "Factors of 15 are:", options: ["1, 3, 5, 15", "1, 5, 15", "3, 5, 15", "1, 3, 15"], answer: 0 },
  { section: 'A', q: "1/2 + 1/2 = ?", options: ["2/4", "1/4", "1", "2"], answer: 2 },
  { section: 'A', q: "How many vertices does a triangle have?", options: ["2", "3", "4", "5"], answer: 1 },

  // ---------- SECTION B — case-based MCQ (10 × 1 = 10 marks) ----------
  { section: 'B',
    case: "Riya is fencing a rectangular vegetable garden. The garden is 12 metres long and 8 metres wide. Use this for the next 3 questions.",
    q: "What is the perimeter of the garden?",
    options: ["20 m", "40 m", "48 m", "96 m"], answer: 1 },
  { section: 'B',
    case: "Riya is fencing a rectangular vegetable garden. The garden is 12 metres long and 8 metres wide. Use this for the next 3 questions.",
    q: "What is the area of the garden?",
    options: ["20 sq m", "40 sq m", "96 sq m", "120 sq m"], answer: 2 },
  { section: 'B',
    case: "Riya is fencing a rectangular vegetable garden. The garden is 12 metres long and 8 metres wide. Use this for the next 3 questions.",
    q: "If fencing wire costs Rs.50 per metre, what is the total cost of fencing once around?",
    options: ["Rs.1000", "Rs.1500", "Rs.2000", "Rs.4800"], answer: 2 },
  { section: 'B',
    case: "A school class has 30 students. 12 students play cricket, 8 play football, and the remaining play kabaddi. Use this for the next 2 questions.",
    q: "How many students play kabaddi?",
    options: ["6", "8", "10", "12"], answer: 2 },
  { section: 'B',
    case: "A school class has 30 students. 12 students play cricket, 8 play football, and the remaining play kabaddi. Use this for the next 2 questions.",
    q: "What fraction of the class plays cricket?",
    options: ["2/5", "1/3", "1/2", "12/15"], answer: 0 },
  { section: 'B',
    case: "On a number line, point P is at -4 and point Q is at +7. Use this for the next 2 questions.",
    q: "What is the distance between P and Q on the number line?",
    options: ["3", "7", "11", "28"], answer: 2 },
  { section: 'B',
    case: "On a number line, point P is at -4 and point Q is at +7. Use this for the next 2 questions.",
    q: "Which integer is the midpoint of P and Q?",
    options: ["-1", "0", "1.5", "3"], answer: 2 },
  { section: 'B',
    case: "Aman buys 6 books at Rs.45 each. He gives the shopkeeper Rs.500 and asks for change. Use this for the next 2 questions.",
    q: "What is the total cost of the 6 books?",
    options: ["Rs.225", "Rs.250", "Rs.270", "Rs.300"], answer: 2 },
  { section: 'B',
    case: "Aman buys 6 books at Rs.45 each. He gives the shopkeeper Rs.500 and asks for change. Use this for the next 2 questions.",
    q: "How much change should the shopkeeper return?",
    options: ["Rs.200", "Rs.230", "Rs.250", "Rs.275"], answer: 1 },
  { section: 'B',
    case: "A bus journey starts at 9:45 AM and ends at 1:20 PM the same day.",
    q: "How long does the journey take?",
    options: ["2 h 35 min", "3 h 25 min", "3 h 35 min", "4 h 25 min"], answer: 2 }
];

const finalExamPenPaper = [
  // ---------- SECTION C — Very Short Answer (2 × 2 = 4 marks) ----------
  { section: 'C', q: "Write the prime factorisation of 84 using a factor tree. Show every step on paper and upload a photo of your work.", marks: 2 },
  { section: 'C', q: "Find the HCF and LCM of 18 and 24. Show your working on paper and upload a photo.", marks: 2 },
  // ---------- SECTION D — Short Answer (2 × 3 = 6 marks) ----------
  { section: 'D', q: "A rectangular field is 120 m long and 80 m wide. Find its perimeter and area. Show all steps on paper, then upload a photo.", marks: 3 },
  { section: 'D', q: "Add the fractions 2/3 + 3/4 + 5/6 and reduce to lowest terms. Write the full solution on paper and upload a photo.", marks: 3 },
  // ---------- SECTION E — Long Answer (1 × 5 = 5 marks) ----------
  { section: 'E', q: "Construct triangle ABC with AB = 6 cm, BC = 5 cm and angle B = 60 degrees. Measure AC and draw all lines of symmetry (if any). Upload a clear photo of your construction.", marks: 5 }
];

export default function App() {
  // Basic state
  const [screen, setScreen] = useState('login');
  const [previousScreen, setPreviousScreen] = useState('home'); // Track previous screen for back navigation
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [chapterProgress, setChapterProgress] = useState({});
  const [chapterScores, setChapterScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({});
  const [studentName, setStudentName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [finalExamCompleted, setFinalExamCompleted] = useState(false);
  const [finalExamScore, setFinalExamScore] = useState(0);
  const [isFinalExam, setIsFinalExam] = useState(false);
  const [examPhase, setExamPhase] = useState('mcq');
  const [penPaperAnswers, setPenPaperAnswers] = useState({});
  const [penPaperPhotos, setPenPaperPhotos] = useState({}); // {index: imageUri} — photo of handwritten answer for Sections C/D/E
  const [mcqScore, setMcqScore] = useState(0);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Show/hide password toggle
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatListRef = useRef(null);

  // Voice message recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimer = useRef(null);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const soundRef = useRef(null);

  // AI Assistant state
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState([]); // Recent chats history
  const [showAiSidebar, setShowAiSidebar] = useState(false); // Sidebar toggle
  const [isSpeaking, setIsSpeaking] = useState(false); // Voice speaking state

  // Admin dashboard state
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminStats, setAdminStats] = useState({});
  const [adminMessages, setAdminMessages] = useState([]);

  // Profile modal state (change name / class selection / change password)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // base64 data URI
  const [profilePicUploading, setProfilePicUploading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('6'); // '6' or '7'
  // Sync the module-level currentClass ref so top-level helpers (openPDF/openVideo) resolve the correct media map
  useEffect(() => { setCurrentClassRef(selectedClass); }, [selectedClass]);
  // Per-class chapter list (shadows the top-level `chapters` array below)
  const chapters = selectedClass === '7' ? chaptersClass7 : topLevelChaptersClass6;
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChanging, setPasswordChanging] = useState(false);

  // 3D Models state
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModelViewer, setShowModelViewer] = useState(false);
  const [showResources, setShowResources] = useState(false);
  
  // PDF Viewer state (inbuilt)
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfBase64, setPdfBase64] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  
  // Google Sign-In modal state (for Android compatibility)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  
  // New user registration state - ALWAYS ask for name on first login
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserSurname, setNewUserSurname] = useState('');
  const [newUserDOB, setNewUserDOB] = useState('');
  const [dobError, setDobError] = useState('');
  
  // Push notification state
  const [expoPushToken, setExpoPushToken] = useState('');
  const [incomingCall, setIncomingCall] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  
  // Language selection for AI
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Video Player state (inbuilt)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideoChapter, setCurrentVideoChapter] = useState(null);
  const [videoBase64, setVideoBase64] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  // In-app WebRTC calling state (using WebView)
  const [showCallWebView, setShowCallWebView] = useState(false);
  const [callWebViewUrl, setCallWebViewUrl] = useState('');
  const [callWebViewHtml, setCallWebViewHtml] = useState('');
  const [callWebViewTitle, setCallWebViewTitle] = useState('');
  // Local-content WebView modal for in-app whiteboard / fundamentals (no network).
  const [showLocalWebView, setShowLocalWebView] = useState(false);
  const [localWebViewHtml, setLocalWebViewHtml] = useState('');
  const [localWebViewTitle, setLocalWebViewTitle] = useState('');
  
  // Screen sharing during exam state
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareInterval, setScreenShareInterval] = useState(null);
  const screenViewRef = useRef(null); // Ref for capturing screen screenshots

  useEffect(() => {
    checkAuth();
    registerForPushNotifications();
    checkBirthdayWish();
    checkFestivalWish();
  }, []);

  // Poll for incoming calls and messages when logged in
  useEffect(() => {
    let pollInterval = null;
    
    const pollForNotifications = async () => {
      if (!authToken || !isLoggedIn) return;
      
      try {
        // Poll for incoming calls
        const callResponse = await fetch(`${API_URL}/api/notifications`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        
        if (callResponse.ok) {
          const notifications = await callResponse.json();
          for (const notif of notifications) {
            if (notif.notification_type === 'incoming_call' && !notif.is_read) {
              const data = JSON.parse(notif.message);
              setIncomingCall({
                callerId: data.caller_id,
                callerName: data.caller_name,
                callType: data.call_type,
                callId: data.call_id,
                sdp: data.sdp
              });
              Vibration.vibrate([0, 500, 200, 500, 200, 500], true);
              
              // Mark notification as read
              try {
                await fetch(`${API_URL}/api/notifications/${notif.id}/read`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${authToken}` },
                });
              } catch (e) {}
            }
          }
        }
      } catch (e) {
        console.log('Poll error:', e);
      }
    };
    
    if (isLoggedIn && authToken) {
      // Poll immediately and then every 3 seconds
      pollForNotifications();
      pollInterval = setInterval(pollForNotifications, 3000);
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isLoggedIn, authToken]);

  // State for colorful festival wish modal
  const [showFestivalModal, setShowFestivalModal] = useState(false);
  const [currentFestival, setCurrentFestival] = useState(null);

  // Check if today is a festival and show colorful wish modal automatically
  const checkFestivalWish = () => {
    const holiday = checkHolidayWish();
    if (holiday.isHoliday) {
      setTimeout(() => {
        setCurrentFestival(holiday);
        setShowFestivalModal(true);
      }, 3000); // Show after 3 seconds (after birthday wish if any)
    }
  };

  // Setup push notification listeners
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      if (data.type === 'incoming_call') {
        setIncomingCall({
          callerId: data.caller_id,
          callerName: data.caller_name,
          callType: data.call_type,
          callId: data.call_id
        });
        Vibration.vibrate([0, 500, 200, 500, 200, 500], true);
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data.type === 'incoming_call') {
        setIncomingCall({
          callerId: data.caller_id,
          callerName: data.caller_name,
          callType: data.call_type,
          callId: data.call_id
        });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Register for push notifications
  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
      
      // Configure Android notification channel for calls
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('calls', {
          name: 'Incoming Calls',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 500, 200, 500],
          sound: 'default',
          enableVibrate: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });
        await Notifications.setNotificationChannelAsync('birthday', {
          name: 'Birthday Wishes',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
        });
      }
    } catch (error) {
      console.log('Push notification setup error:', error);
    }
  };

  // Check if today is user's birthday and show wish
  const checkBirthdayWish = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.dob) {
          const today = new Date();
          const [day, month] = user.dob.split('/');
          if (parseInt(day) === today.getDate() && parseInt(month) === (today.getMonth() + 1)) {
            setTimeout(() => {
              Alert.alert(
                'Happy Birthday! 🎂',
                `Dear ${user.name},\n\nWishing you a very Happy Birthday!\n\nMay this special day bring you lots of happiness and success in your studies!\n\n- GANITA PRAKASH Team`,
                [{ text: 'Thank You!', style: 'default' }]
              );
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.log('Birthday check error:', error);
    }
  };

  // Format DOB input with auto-slashes (DD/MM/YYYY)
  const formatDOBInput = (text) => {
    // Remove all non-numeric characters
    let cleaned = text.replace(/\D/g, '');
    
    // Limit to 8 digits (DDMMYYYY)
    cleaned = cleaned.substring(0, 8);
    
    // Format with slashes
    let formatted = '';
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += '/' + cleaned.substring(2, 4);
    }
    if (cleaned.length > 4) {
      formatted += '/' + cleaned.substring(4, 8);
    }
    
    // Validate the date
    setDobError('');
    if (cleaned.length === 8) {
      const day = parseInt(cleaned.substring(0, 2));
      const month = parseInt(cleaned.substring(2, 4));
      const year = parseInt(cleaned.substring(4, 8));
      
      if (day < 1 || day > 31) {
        setDobError('Invalid day (01-31)');
      } else if (month < 1 || month > 12) {
        setDobError('Invalid month (01-12)');
      } else if (year < 1900 || year > new Date().getFullYear()) {
        setDobError('Invalid year');
      } else {
        // Check if date is valid (e.g., Feb 30 is invalid)
        const testDate = new Date(year, month - 1, day);
        if (testDate.getDate() !== day || testDate.getMonth() !== month - 1) {
          setDobError('Invalid date');
        }
      }
    }
    
    setNewUserDOB(formatted);
  };

  // State for native in-app call UI
  const [showNativeCall, setShowNativeCall] = useState(false);
  const [nativeCallData, setNativeCallData] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);

  // Answer incoming call - opens the in-app WebRTC WebView so real audio/video
  // actually flows (the previous fake-timer UI never created a peer connection,
  // which is why calls would ring but never connect).
  const answerCall = async () => {
    if (!incomingCall) return;
    Vibration.cancel();

    const callerId = incomingCall.callerId;
    const callerName = incomingCall.callerName || 'Admin';
    const callType = incomingCall.callType || 'audio';
    const callId = incomingCall.callId || '';

    // Pre-request OS-level mic / camera permissions so the in-WebView WebRTC
    // getUserMedia() call can actually succeed. Without this, Android denies
    // the WebView access to mic/camera and no media flows.
    try {
      const micPerm = await Audio.requestPermissionsAsync();
      if (!micPerm || micPerm.status !== 'granted') {
        Alert.alert('Microphone permission required', 'Grant microphone access so the caller can hear you.');
        return;
      }
      if (callType === 'video') {
        const camPerm = await ImagePicker.requestCameraPermissionsAsync();
        if (!camPerm || camPerm.status !== 'granted') {
          Alert.alert('Camera permission required', 'Grant camera access so the caller can see you.');
          return;
        }
      }
    } catch (_) { /* old Android perm APIs may fail; WebView will prompt */ }

    // Use the bundled, self-contained call HTML (no website redirect, no app
    // shell). It runs real getUserMedia + RTCPeerConnection inside the WebView,
    // pulls the offer SDP from /api/webrtc/pending-calls, and POSTs a real
    // answer SDP back so the caller's peer can connect.
    const html = buildCallHtml({
      apiUrl: API_URL,
      token: authToken,
      myUserId: myUserId,
      mode: 'answer',
      peerUserId: callerId,
      callType: callType,
      callerName: callerName,
      callId: callId,
    });
    setCallWebViewHtml(html);
    setCallWebViewUrl('');
    setCallWebViewTitle(callType === 'video' ? 'Video Call with ' + callerName : 'Voice Call with ' + callerName);
    setShowCallWebView(true);
    setIncomingCall(null);
  };

  // End native call (legacy fake-UI path; kept so any stale state can still be cleared)
  const endNativeCall = async () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (nativeCallData && nativeCallData.callerId) {
      try {
        await fetch(`${API_URL}/api/webrtc/end-call?target_user_id=${nativeCallData.callerId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      } catch (e) {
        console.log('Error ending call:', e);
      }
    }
    setShowNativeCall(false);
    setNativeCallData(null);
    setCallDuration(0);
  };

  // Format call duration
  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Decline incoming call
  const declineCall = async () => {
    if (incomingCall) {
      Vibration.cancel();
      try {
        await fetch(`${API_URL}/api/webrtc/end-call?target_user_id=${incomingCall.callerId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
      } catch (error) {
        console.log('Error declining call:', error);
      }
      setIncomingCall(null);
    }
  };

  // Function to auto-submit exam and log AI violation
  const autoSubmitExamWithViolation = async (reason) => {
    try {
      // Log violation to backend
      await fetch(`${API_URL}/api/exam/violation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ 
          exam_type: isFinalExam ? 'final' : 'chapter',
          chapter_id: currentChapter?.id || null,
          violation_type: reason,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.log('Error logging violation:', error);
    }
    
    // Auto-submit exam
    setIsMonitoring(false);
    if (isFinalExam) {
      // Approximate partial credit for paper sections answered before time-out.
      var ppScore = 0;
      finalExamPenPaper.forEach(function(q, idx) {
        var t = (penPaperAnswers[idx] || '').trim();
        var hasPhoto = !!penPaperPhotos[idx];
        var m = q.marks || 2;
        if (hasPhoto && t.length > 0) ppScore += m;
        else if (hasPhoto || t.length > 0) ppScore += Math.floor(m / 2);
      });
      const totalScore = mcqScore + ppScore;
      showResults(totalScore, 40);
    } else {
      showResults(score, currentChapter?.questions?.length || 10);
    }
  };

  // Handle Android hardware back button with exam confirmation
  useEffect(() => {
    const backAction = () => {
      if (screen === 'login') {
        // On login screen, let the default behavior happen (exit app)
        return false;
      }
      if (screen === 'home') {
        // On home screen, show exit confirmation
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
          { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      }
      // During exam - show confirmation dialog
      if (screen === 'quiz' && isMonitoring) {
        Alert.alert(
          'Cancel Exam?',
          'Are you sure you want to cancel the exam?\n\nIf you proceed, the AI will automatically exit and submit your exam.',
          [
            { text: 'Continue Exam', style: 'cancel', onPress: () => {} },
            { 
              text: 'Exit Exam', 
              style: 'destructive', 
              onPress: () => autoSubmitExamWithViolation('user_exit')
            }
          ]
        );
        return true;
      }
      // On other screens, go back to previous screen
      goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [screen, previousScreen, isMonitoring, isFinalExam, mcqScore, penPaperAnswers, score, currentChapter]);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      if (token && userData) {
        const user = JSON.parse(userData);
        setAuthToken(token);
        setMyUserId(user.id);
        setStudentName(user.name);
        setIsAdmin(user.is_admin);
        setIsLoggedIn(true);
        setScreen('home');
        loadData();
        fetchProfileFromServer(token);
      }
    } catch (e) {
      console.log('Auth check error:', e);
    }
  };

  // Pull the latest profile (including profile_picture) from the backend.
  // Safe to call after any login or app resume.
  const fetchProfileFromServer = async (tokenOverride) => {
    try {
      const token = tokenOverride || authToken;
      if (!token) return;
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) return;
      const me = await res.json();
      if (me) {
        if (me.profile_picture) setProfilePicture(me.profile_picture);
        if (me.name) setStudentName(me.name);
      }
    } catch (e) {
      console.log('fetchProfileFromServer error:', e);
    }
  };

  // Open gallery/camera, downscale, and POST as a base64 data URI to
  // /api/user/profile-picture. Updates UI optimistically.
  const pickProfilePicture = async (source) => {
    try {
      if (source === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm || perm.status !== 'granted') {
          Alert.alert('Camera permission required', 'Grant camera access to take a profile photo.');
          return;
        }
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm || perm.status !== 'granted') {
          Alert.alert('Photos permission required', 'Grant access to photos to pick a profile picture.');
          return;
        }
      }
      const opts = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.6,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
      };
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(opts)
        : await ImagePicker.launchImageLibraryAsync(opts);
      if (result.canceled || !result.assets || !result.assets[0]) return;
      const asset = result.assets[0];
      if (!asset.base64) {
        Alert.alert('Error', 'Could not read image data.');
        return;
      }
      const ext = (asset.uri || '').toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
      const dataUri = `data:image/${ext};base64,${asset.base64}`;
      setProfilePicUploading(true);
      setProfilePicture(dataUri); // optimistic
      const res = await fetch(`${API_URL}/api/user/profile-picture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ profile_picture: dataUri }),
      });
      if (!res.ok) {
        let detail = '';
        try { detail = (await res.text()).slice(0, 200); } catch(_) {}
        Alert.alert('Upload failed', 'Could not save profile picture.' + (detail ? ('\n' + detail) : ''));
      }
    } catch (e) {
      console.log('pickProfilePicture error:', e);
      Alert.alert('Error', 'Failed to update profile picture.');
    } finally {
      setProfilePicUploading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    
    // Always use backend API for login (including admin)
    // This ensures proper JWT token and admin dashboard access
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim(), platform: 'apk' }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.access_token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        setAuthToken(data.access_token);
        setMyUserId(data.user.id);
        setStudentName(data.user.name);
        setIsAdmin(data.user.is_admin);
        setIsLoggedIn(true);
        setScreen('home');
        loadData();
        fetchProfileFromServer(data.access_token);
      } else {
        Alert.alert('Error', data.detail || 'Login failed');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !studentName.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim(), name: studentName.trim(), platform: 'apk' }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.access_token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        setAuthToken(data.access_token);
        setMyUserId(data.user.id);
        setIsAdmin(data.user.is_admin);
        setIsLoggedIn(true);
        setScreen('home');
        fetchProfileFromServer(data.access_token);
      } else {
        Alert.alert('Error', data.detail || 'Registration failed');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    setAuthToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsername('');
    setPassword('');
    setStudentName('');
    setScreen('login');
  };

  // Chat functions
  const loadChatMessages = async () => {
    try {
      // Admin sees all messages; users see only their own + admin replies.
      // Backend's two endpoints return opposite orderings (admin = DESC,
      // user = ASC), so we always normalize to oldest-first (chat reads
      // top → bottom, newest at the bottom).
      const endpoint = isAdmin ? `${API_URL}/api/messages` : `${API_URL}/api/user/messages`;
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        const messages = isAdmin ? data : (data.messages || data);
        const arr = Array.isArray(messages) ? messages.slice() : [];
        arr.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        const prevCount = chatMessages.length;
        setChatMessages(arr);
        if (arr.length > prevCount && chatListRef.current) {
          // New messages arrived — scroll to the latest one.
          setTimeout(() => { try { chatListRef.current.scrollToEnd({ animated: true }); } catch (_) {} }, 80);
        }
      }
    } catch (e) {
      console.log('Chat load error:', e);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ content: chatInput.trim(), message_type: 'text' }),
      });
      if (response.ok) {
        setChatInput('');
        loadChatMessages();
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to send message');
    }
    setChatLoading(false);
  };

  // Voice message recording functions
  const startVoiceRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record voice messages');
        return;
      }
      
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      Vibration.vibrate(50);
    } catch (error) {
      console.log('Recording error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };
  
  const stopVoiceRecording = async () => {
    if (!recording) return;
    
    try {
      clearInterval(recordingTimer.current);
      setIsRecording(false);
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      Vibration.vibrate(50);
      
      if (uri && recordingDuration >= 1) {
        // Send voice message
        await sendVoiceMessage(uri);
      } else {
        Alert.alert('Too Short', 'Voice message must be at least 1 second');
      }
      
      setRecordingDuration(0);
    } catch (error) {
      console.log('Stop recording error:', error);
      setIsRecording(false);
      setRecording(null);
      setRecordingDuration(0);
    }
  };
  
  const cancelVoiceRecording = async () => {
    if (!recording) return;
    
    try {
      clearInterval(recordingTimer.current);
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      setRecording(null);
      setRecordingDuration(0);
      Vibration.vibrate([0, 50, 50, 50]);
    } catch (error) {
      console.log('Cancel recording error:', error);
      setIsRecording(false);
      setRecording(null);
      setRecordingDuration(0);
    }
  };
  
  const pickAndSendChatImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm || perm.status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library access is required to send an image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: true,
      });
      if (result.canceled || !result.assets || !result.assets.length) return;
      const asset = result.assets[0];
      let dataUri = '';
      if (asset.base64) {
        const ext = (asset.uri || '').toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
        dataUri = `data:image/${ext};base64,${asset.base64}`;
      }
      setChatLoading(true);
      // Send a SHORT placeholder as `content` (backend caps content size) and put
      // the base64 data URI in `media_url`. Older builds sent the data URI as
      // content and hit the 4000-char cap, which is why images silently failed.
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          content: '[Image]',
          message_type: 'image',
          media_url: dataUri || asset.uri || null,
        }),
      });
      if (response.ok) {
        loadChatMessages();
      } else {
        let detail = '';
        try { detail = (await response.text()).slice(0, 200); } catch(_) {}
        Alert.alert('Error', 'Failed to send image' + (detail ? ('\n' + detail) : ''));
      }
    } catch (e) {
      console.log('pickAndSendChatImage error:', e);
      Alert.alert('Error', 'Failed to send image');
    } finally {
      setChatLoading(false);
    }
  };

  const sendVoiceMessage = async (uri) => {
    setChatLoading(true);
    try {
      // Read the audio file as base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Carry the base64 audio in media_url as a data URI so the admin web
      // chat can play it inline with a single <audio src=...>. The legacy
      // voice_data field is also sent for backwards compatibility.
      const audioDataUri = `data:audio/m4a;base64,${base64Audio}`;
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          content: `[Voice Message - ${recordingDuration}s]`,
          message_type: 'audio',
          media_url: audioDataUri,
          voice_data: base64Audio,
          duration: recordingDuration,
        }),
      });

      if (response.ok) {
        loadChatMessages();
      } else {
        let detail = '';
        try { detail = (await response.text()).slice(0, 200); } catch(_) {}
        Alert.alert('Error', 'Failed to send voice message' + (detail ? ('\n' + detail) : ''));
      }
    } catch (error) {
      console.log('Send voice error:', error);
      Alert.alert('Error', 'Failed to send voice message');
    }
    setChatLoading(false);
  };
  
  const playVoiceMessage = async (voiceSrc, messageId) => {
    try {
      // Stop any currently playing audio
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      
      if (playingVoiceId === messageId) {
        setPlayingVoiceId(null);
        return;
      }
      
      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      // voiceSrc may be either a full data URI / http URL (preferred) or a raw
      // base64 string from the legacy voice_data field. Normalize to a URI.
      const uri = (typeof voiceSrc === 'string' && (voiceSrc.startsWith('data:') || voiceSrc.startsWith('http')))
        ? voiceSrc
        : `data:audio/m4a;base64,${voiceSrc}`;
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      
      soundRef.current = sound;
      setPlayingVoiceId(messageId);
      
      // Handle playback completion
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingVoiceId(null);
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch (error) {
      console.log('Play voice error:', error);
      Alert.alert('Error', 'Failed to play voice message');
      setPlayingVoiceId(null);
    }
  };
  
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // AI Assistant functions - Using backend API
  // AI is BLOCKED during exams - automatic exit and submission if accessed
  const askAI = async () => {
    // Check if user is in exam mode - if so, auto-exit and submit
    if (isMonitoring && screen === 'quiz') {
      // AI access during exam - automatic violation
      autoSubmitExamWithViolation('ai_access_attempt');
      setScreen('home');
      return;
    }
    
    if (!aiInput.trim()) return;
    const userMessage = aiInput.trim();
    setAiMessages([...aiMessages, { role: 'user', content: userMessage }]);
    setAiInput('');
    setAiLoading(true);
    
    // Add loading message
    setAiMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);
    
    try {
      // Use backend API for AI chat. We pass the student's selected class
      // (6 or 7) so the assistant restricts itself to the right syllabus, and
      // we prepend a Class label to the message as a belt-and-braces hint.
      const classNum = selectedClass === '7' ? 7 : 6;
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          message: `[Class ${classNum} student] ` + userMessage +
            (currentChapter ? ` (Context: Chapter ${currentChapter.id} - ${currentChapter.title})` : ''),
          chapter_id: currentChapter?.id || null,
          class_num: classNum,
        }),
      });
      
      // Remove loading message
      setAiMessages(prev => prev.filter(msg => msg.content !== 'Thinking...'));
      
      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.response;
        setAiMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not process your request. Please try again.' }]);
      }
    } catch (e) {
      // Remove loading message
      setAiMessages(prev => prev.filter(msg => msg.content !== 'Thinking...'));
      console.log('AI error:', e);
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please check your internet connection and try again.' }]);
    }
    setAiLoading(false);
  };
  
  // Function to open AI Assistant - blocks during exam
  const openAIAssistant = () => {
    if (isMonitoring && screen === 'quiz') {
      // AI access during exam - automatic violation and exit
      autoSubmitExamWithViolation('ai_access_attempt');
      return;
    }
    setAiMessages([]);
    setShowLanguageSelector(true);
    setScreen('aiAssistant');
  };

  // Admin functions
  const loadAdminDashboard = async () => {
    try {
      // Get fresh token from AsyncStorage to ensure we have the latest
      let token = authToken;
      if (!token) {
        token = await AsyncStorage.getItem('authToken');
        if (token) {
          setAuthToken(token);
        }
      }
      
      console.log('Loading admin dashboard with token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again to access admin dashboard.');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Admin dashboard response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Admin dashboard data:', JSON.stringify(data).substring(0, 200));
        setAdminUsers(data.users || []);
        setAdminStats(data || {});
        setAdminMessages(data.recent_messages || []);
      } else {
        const errorData = await response.json();
        console.log('Admin dashboard error:', errorData);
        if (response.status === 401) {
          Alert.alert('Session Expired', 'Your session has expired. Please login again.');
          handleLogout();
        } else {
          Alert.alert('Admin Dashboard Error', errorData.detail || 'Failed to load dashboard.');
        }
      }
    } catch (e) {
      console.log('Admin load error:', e);
      Alert.alert('Network Error', 'Could not connect to server. Please check your internet connection.');
    }
  };

  const adminAction = async (userId, action, chapterId = null) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ user_id: userId, action, chapter_id: chapterId }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Action completed');
        loadAdminDashboard();
      }
    } catch (e) {
      Alert.alert('Error', 'Action failed');
    }
  };

  const loadData = async () => {
    try {
      const name = await AsyncStorage.getItem('studentName');
      const progress = await AsyncStorage.getItem('chapterProgress');
      const scores = await AsyncStorage.getItem('chapterScores');
      const certs = await AsyncStorage.getItem('certificates');
      const finalCompleted = await AsyncStorage.getItem('finalExamCompleted');
      const finalScore = await AsyncStorage.getItem('finalExamScore');

      if (name) setStudentName(name);
      else setShowNameModal(true);
      
      if (progress) setChapterProgress(JSON.parse(progress));
      if (scores) setChapterScores(JSON.parse(scores));
      if (certs) setCertificates(JSON.parse(certs));
      if (finalCompleted) setFinalExamCompleted(JSON.parse(finalCompleted));
      if (finalScore) setFinalExamScore(JSON.parse(finalScore));
    } catch (e) {
      console.log('Error loading data:', e);
    }
  };

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log('Error saving data:', e);
    }
  };

  // Name is captured only once from OAuth - no manual editing allowed
  // This function is only used for first-time setup if OAuth name is not available
  const saveName = async () => {
    if (studentName.trim()) {
      try {
        // Save to local storage only for first-time users
        await AsyncStorage.setItem('studentName', studentName.trim());
        setShowNameModal(false);
        // No success alert - seamless experience
      } catch (e) {
        console.log('Error saving name:', e);
      }
    }
  };

  // Navigation helper - tracks previous screen for back button
  const navigateTo = (newScreen) => {
    setPreviousScreen(screen);
    setScreen(newScreen);
  };

  // Go back to previous screen
  const goBack = () => {
    if (screen === 'chapter' || screen === 'quiz' || screen === 'progress' || screen === 'certificates' || screen === 'chat' || screen === 'aiAssistant' || screen === 'admin') {
      setScreen('home');
    } else {
      setScreen(previousScreen || 'home');
    }
  };

  const openChapter = (chapter) => {
    const index = chapters.findIndex(c => c.id === chapter.id);
    // Admin can access all chapters without restrictions
    if (!isAdmin && index > 0 && chapterProgress[chapters[index - 1].id] !== 'completed') {
      Alert.alert('Locked', 'Complete the previous chapter first!');
      return;
    }
    setCurrentChapter(chapter);
    setScreen('chapter');
  };

  const [showExamInstructions, setShowExamInstructions] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  // Monitor app state during exams - auto-submit if user leaves the app
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (isMonitoring && screen === 'quiz') {
        // If app goes to background or inactive during exam, auto-submit
        if (appStateRef.current === 'active' && (nextAppState === 'background' || nextAppState === 'inactive')) {
          Alert.alert(
            'Exam Auto-Submitted',
            'You left the app during the exam. Your exam has been automatically submitted with your current progress.',
            [{ text: 'OK', onPress: () => {
              setIsMonitoring(false);
              if (isFinalExam) {
                // Auto-submit final exam with current scores
                // Approximate partial credit for paper sections answered before bail.
                var ppScore = 0;
                finalExamPenPaper.forEach(function(q, idx) {
                  var t = (penPaperAnswers[idx] || '').trim();
                  var hasPhoto = !!penPaperPhotos[idx];
                  var m = q.marks || 2;
                  if (hasPhoto && t.length > 0) ppScore += m;
                  else if (hasPhoto || t.length > 0) ppScore += Math.floor(m / 2);
                });
                const totalScore = mcqScore + ppScore;
                showResults(totalScore, 40);
              } else {
                // Auto-submit chapter quiz with current score
                showResults(score, currentChapter?.questions?.length || 10);
              }
            }}]
          );
        }
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isMonitoring, screen, isFinalExam, mcqScore, penPaperAnswers, score, currentChapter]);

  const showExamWarning = () => {
    setShowExamInstructions(true);
  };

  const startQuizAfterWarning = () => {
    setShowExamInstructions(false);
    setIsMonitoring(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinalExam(false);
    setScreen('quiz');
  };

  // Function to capture and send screenshot to backend
  const captureAndSendScreenshot = async () => {
    try {
      if (screenViewRef.current) {
        const uri = await captureRef(screenViewRef.current, {
          format: 'jpg',
          quality: 0.5, // Lower quality for faster upload
          result: 'base64'
        });
        
        // Send screenshot to backend
        await fetch(`${API_URL}/api/exam/screen-share/screenshot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          body: JSON.stringify({ 
            screenshot: uri,
            current_question: currentQuestion + 1,
            total_questions: isFinalExam ? finalExamMCQ.length : (currentChapter?.questions?.length || 10),
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (e) {
      console.log('Screenshot capture error:', e);
    }
  };

  // Function to start screen sharing and notify backend
  const startScreenSharing = async () => {
    try {
      setIsScreenSharing(true);
      // Notify backend that screen sharing has started
      await fetch(`${API_URL}/api/exam/screen-share/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ 
          exam_type: isFinalExam ? 'final' : 'chapter',
          chapter_id: currentChapter?.id || null
        })
      });
      
      // Start periodic screenshot capture and status updates
      const interval = setInterval(async () => {
        if (screen === 'quiz' && isMonitoring) {
          try {
            // Capture and send screenshot to admin
            await captureAndSendScreenshot();
            
            // Update screen share status
            await fetch(`${API_URL}/api/exam/screen-share/update`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
              body: JSON.stringify({ 
                current_question: currentQuestion + 1,
                total_questions: isFinalExam ? finalExamMCQ.length : (currentChapter?.questions?.length || 10),
                is_active: true
              })
            });
            
            // Check if admin has force-submitted this exam
            const forceCheckResponse = await fetch(`${API_URL}/api/exam/check-force-submit`, {
              headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (forceCheckResponse.ok) {
              const forceData = await forceCheckResponse.json();
              if (forceData.force_submitted) {
                // Admin has force-submitted - show cheating message
                clearInterval(interval);
                setScreenShareInterval(null);
                setIsMonitoring(false);
                setIsScreenSharing(false);
                
                Alert.alert(
                  'EXAM AUTO-SUBMITTED',
                  forceData.message || 'Admin has auto-submitted your exam because you were caught cheating!',
                  [{ text: 'OK', onPress: () => {
                    setScreen('chapters');
                    setCurrentQuestion(0);
                    setScore(0);
                    setSelectedOption(null);
                  }}],
                  { cancelable: false }
                );
              }
            }
          } catch (e) {
            console.log('Screen share update error:', e);
          }
        }
      }, 3000); // Capture screenshot every 3 seconds
      setScreenShareInterval(interval);
    } catch (e) {
      console.log('Screen share start error:', e);
    }
  };
  
  // Function to stop screen sharing
  const stopScreenSharing = async () => {
    try {
      setIsScreenSharing(false);
      if (screenShareInterval) {
        clearInterval(screenShareInterval);
        setScreenShareInterval(null);
      }
      // Notify backend that screen sharing has stopped
      await fetch(`${API_URL}/api/exam/screen-share/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ reason: 'exam_completed' })
      });
    } catch (e) {
      console.log('Screen share stop error:', e);
    }
  };

  // Open Whiteboard / Fundamentals fully in-app (local HTML, no network, no
  // website redirect). Other sections still fall back to the in-app browser tab.
  const openInAppWeb = async (section, title) => {
    try {
      if (section === 'whiteboard') {
        setLocalWebViewHtml(WHITEBOARD_HTML);
        setLocalWebViewTitle(title || 'Whiteboard');
        setShowLocalWebView(true);
        return;
      }
      if (section === 'fundamentals') {
        setLocalWebViewHtml(buildFundamentalsHtml(selectedClass));
        setLocalWebViewTitle(title || 'Fundamentals');
        setShowLocalWebView(true);
        return;
      }
      if (section === 'formula-videos') {
        setLocalWebViewHtml(buildFormulaVideosHtml(selectedClass));
        setLocalWebViewTitle(title || 'Formula Videos');
        setShowLocalWebView(true);
        return;
      }
      var base = 'https://ganitaprakash-math.web.app';
      var url = base + '?mode=section&section=' + encodeURIComponent(section || '');
      if (authToken) url += '&token=' + encodeURIComponent(authToken);
      await WebBrowser.openBrowserAsync(url, {
        toolbarColor: '#0a0e27',
        controlsColor: '#00d4ff',
        dismissButtonStyle: 'close',
        showTitle: true,
      });
    } catch (e) {
      try { Linking.openURL('https://ganitaprakash-math.web.app?section=' + encodeURIComponent(section || '')); } catch (_) {}
    }
  };

  // Request camera + microphone permissions explicitly (Android runtime prompt).
  // Returns true only if both granted. Caller should block the exam if false.
  const requestExamPermissions = async () => {
    try {
      if (Platform.OS !== 'android') return true;
      const perms = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ];
      const res = await PermissionsAndroid.requestMultiple(perms);
      const camOk = res[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
      const micOk = res[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;
      return camOk && micOk;
    } catch (e) {
      console.log('Permission request error:', e);
      return false;
    }
  };

  const startQuiz = () => {
    // Show exam proctoring instructions first with screen sharing permission request
    Alert.alert(
      'Screen Sharing Permission Required',
      'GANITA PRAKASH needs to monitor your screen during the exam to ensure fair assessment.\n\nIMPORTANT RULES:\n\n1. Your screen will be monitored during the exam\n2. If you leave the app, your exam will be auto-submitted\n3. Any cheating will result in automatic submission\n4. You have limited time to complete\n5. Make sure you are in a quiet place\n\nBy clicking "Allow & Start", you agree to screen monitoring.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Allow & Start Exam', 
          onPress: async () => {
            const ok = await requestExamPermissions();
            if (!ok) {
              Alert.alert('Permissions Required', 'Camera and microphone access are required to start the exam. Please allow them in Settings and try again.');
              return;
            }
            // Start screen sharing and monitoring
            startScreenSharing();
            Alert.alert(
              'Screen Monitoring Active',
              'Your screen is now being monitored and visible to admin. Do not switch apps or minimize during the exam.',
              [{ text: 'OK', onPress: () => {
                setIsMonitoring(true);
                setCurrentQuestion(0);
                setScore(0);
                setSelectedOption(null);
                setIsFinalExam(false);
                setScreen('quiz');
              }}]
            );
          }
        }
      ]
    );
  };

  const startFinalExam = () => {
    const allCompleted = chapters.every(c => chapterProgress[c.id] === 'completed');
    if (!allCompleted && !isAdmin) {
      Alert.alert('Locked', `Complete all ${chapters.length} chapters first!`);
      return;
    }
    // Show screen sharing permission request first
    Alert.alert(
      'Screen & Camera Permission Required',
      'GANITA PRAKASH needs to monitor your screen and camera during the Final Exam to ensure fair assessment.\n\nIMPORTANT RULES:\n\n1. Your screen and camera will be monitored\n2. If you leave the app, your exam will be auto-submitted\n3. Any cheating will result in automatic submission and failure\n4. This exam has MCQ and Written sections (A, B, C, D, E)\n5. You need 80% to pass\n6. Make sure you are in a quiet, well-lit place\n\nBy clicking "Allow & Start", you agree to screen and camera monitoring.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Allow & Start Final Exam', 
          onPress: async () => {
            const ok = await requestExamPermissions();
            if (!ok) {
              Alert.alert('Permissions Required', 'Camera and microphone access are required for the Final Exam. Please grant them and try again.');
              return;
            }
            // Start screen sharing and monitoring
            startScreenSharing();
            Alert.alert(
              'Monitoring Active',
              'Your screen and camera are now being monitored and visible to admin. Do not switch apps or minimize during the exam.',
              [{ text: 'OK', onPress: () => {
                setIsMonitoring(true);
                setCurrentQuestion(0);
                setScore(0);
                setMcqScore(0);
                setSelectedOption(null);
                setIsFinalExam(true);
                setExamPhase('mcq');
                setPenPaperAnswers({});
                setPenPaperPhotos({});
                setScreen('quiz');
              }}]
            );
          }
        }
      ]
    );
  };

  const selectOption = (index) => {
    setSelectedOption(index);
  };

  const submitAnswer = () => {
    const questions = isFinalExam ? finalExamMCQ : currentChapter.questions;
    const question = questions[currentQuestion];

    // Final-exam scoring: Sections A + B award 1 mark each.
    // Chapter quiz: 1 mark each.
    let newScore = score;
    if (selectedOption === question.answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (currentQuestion + 1 >= questions.length) {
      if (isFinalExam) {
        setMcqScore(newScore);
        setExamPhase('penPaper');
        setCurrentQuestion(0);
        setSelectedOption(null);
      } else {
        showResults(newScore, questions.length);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  // Capture a photo of the handwritten answer (Sections C/D/E require photo verification).
  // Uses expo-image-picker; falls back to gallery if camera denied.
  const capturePhotoForAnswer = async (index) => {
    try {
      const camPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (camPerm.status !== 'granted') {
        Alert.alert('Camera permission required', 'Grant camera access to photograph your handwritten answer, or use Gallery instead.');
        const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libPerm.status !== 'granted') return;
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6, allowsEditing: false });
        if (!result.canceled && result.assets && result.assets[0]) {
          setPenPaperPhotos(prev => ({ ...prev, [index]: result.assets[0].uri }));
        }
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6, allowsEditing: false });
      if (!result.canceled && result.assets && result.assets[0]) {
        setPenPaperPhotos(prev => ({ ...prev, [index]: result.assets[0].uri }));
      }
    } catch (e) {
      console.log('capturePhotoForAnswer error:', e);
      Alert.alert('Camera error', 'Could not open camera. Try again.');
    }
  };

  const clearPhotoForAnswer = (index) => {
    setPenPaperPhotos(prev => { const n = { ...prev }; delete n[index]; return n; });
  };

  const submitPenPaperAnswer = (index, answer) => {
    setPenPaperAnswers({ ...penPaperAnswers, [index]: answer });
  };

  const submitFinalExam = async () => {
    // Paper sections (C/D/E) are scored by admin after photo upload review.
    // We award partial provisional marks here: full marks if photo + answer text
    // exist, half marks if only text. Admin can override later.
    let penPaperScore = 0;
    finalExamPenPaper.forEach((q, idx) => {
      const text = (penPaperAnswers[idx] || '').trim();
      const hasPhoto = !!penPaperPhotos[idx];
      const maxMarks = q.marks || 2;
      if (hasPhoto && text.length > 0) penPaperScore += maxMarks;
      else if (hasPhoto || text.length > 0) penPaperScore += Math.floor(maxMarks / 2);
    });

    const totalScore = mcqScore + penPaperScore;
    // Total possible: 25 (A+B) + 15 (C+D+E) = 40 marks
    const totalPossible = 40;
    const percentage = Math.round((totalScore / totalPossible) * 100);
    const passed = percentage >= 80;
    stopScreenSharing();
    setIsMonitoring(false);

    setFinalExamScore(totalScore);
    setFinalExamCompleted(true);
    await saveData('finalExamScore', totalScore);
    await saveData('finalExamCompleted', true);

    if (passed) {
      const newCerts = [
        ...certificates,
        { type: 'final', score: totalScore, date: new Date().toLocaleDateString() },
        { type: 'master', score: totalScore, date: new Date().toLocaleDateString() }
      ];
      setCertificates(newCerts);
      await saveData('certificates', newCerts);
    }

    setResultData({ score: totalScore, total: totalPossible, percentage, passed, isFinal: true, mcqScore, penPaperScore });
    setShowResult(true);
  };

  const showResults = async (finalScore, totalQuestions) => {
    // Stop screen sharing when exam ends
    stopScreenSharing();
    setIsMonitoring(false);
    
    const maxScore = totalQuestions;
    const percentage = Math.round((finalScore / maxScore) * 100);
    const passed = percentage >= 80; // Pass if 80%+ correct (consistent with final exam)

    if (passed) {
      const newProgress = { ...chapterProgress, [currentChapter.id]: 'completed' };
      const newScores = { ...chapterScores, [currentChapter.id]: percentage };
      setChapterProgress(newProgress);
      setChapterScores(newScores);
      await saveData('chapterProgress', newProgress);
      await saveData('chapterScores', newScores);

      const newCerts = [
        ...certificates,
        { type: 'chapter', chapterId: currentChapter.id, chapterTitle: currentChapter.title, score: percentage, date: new Date().toLocaleDateString() }
      ];
      setCertificates(newCerts);
      await saveData('certificates', newCerts);
    }

    setResultData({ score: finalScore, total: maxScore, percentage, passed, isFinal: false });
    setShowResult(true);
  };

  const closeResult = () => {
    setShowResult(false);
    setExamPhase('mcq');
    setScreen('home');
  };

  // Calculate progress stats
  const completedChapters = Object.values(chapterProgress).filter(p => p === 'completed').length;
  const totalXP = Object.values(chapterScores).reduce((sum, score) => sum + (score || 0), 0);
  const avgProgress = completedChapters > 0 ? Math.round((completedChapters / 10) * 100) : 0;

    const renderHome = () => (
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
        {/* Header - Command Bridge Style */}
        <View style={styles.homeHeader}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => { setProfileNameInput(studentName || ''); setShowProfileModal(true); }}>
            <View style={styles.userAvatarCircle}>
              <Text style={styles.userAvatarText}>
                {studentName ? studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'GP'}
              </Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>WELCOME</Text>
              <Text style={styles.userName}>{studentName || 'Student'}</Text>
              <Text style={styles.userClass}>NCERT Class {selectedClass}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => setScreen('progress')}>
              <Text style={styles.headerIconText}>◉</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleLogout}>
              <Text style={styles.headerIconText}>⏻</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row - Holographic Data Panels */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIconText}>◈</Text>
            </View>
            <Text style={styles.statValue}>{completedChapters}</Text>
            <Text style={styles.statLabel}>SECTORS</Text>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIconText}>⬡</Text>
            </View>
            <Text style={styles.statValue}>{totalXP}</Text>
            <Text style={styles.statLabel}>ENERGY</Text>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statIconBox}>
              <Text style={styles.statIconText}>◎</Text>
            </View>
            <Text style={styles.statValue}>{completedChapters}/10</Text>
            <Text style={styles.statLabel}>MISSIONS</Text>
          </View>
        </View>

      {/* Mission Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>MISSION PROGRESS</Text>
          <Text style={styles.progressPercent}>{avgProgress}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, {width: avgProgress + '%'}]} />
        </View>
        <Text style={styles.progressSubtext}>{completedChapters} of 10 cosmic sectors explored</Text>
      </View>

      {/* Continue Mission */}
      <Text style={styles.sectionTitle}>CONTINUE MISSION</Text>
      {chapters.slice(0, 1).map((chapter) => (
        <TouchableOpacity 
          key={chapter.id} 
          style={styles.continueCard}
          onPress={() => openChapter(chapter)}
        >
          <View>
            <Text style={styles.continueChapter}>SECTOR {chapter.number}</Text>
            <Text style={styles.continueTitle}>{chapter.title}</Text>
            <Text style={styles.continueInfo}>◈ 45 cycles  ◉ 3 laws</Text>
          </View>
          <Text style={styles.playIcon}>▶</Text>
        </TouchableOpacity>
      ))}

      {/* Command Nodes */}
      <Text style={styles.sectionTitle}>COMMAND NODES</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => { setAiMessages([]); setShowLanguageSelector(true); setScreen('aiAssistant'); }}>
          <View style={styles.quickActionIconBox}>
            <Text style={styles.quickActionIconText}>◈</Text>
          </View>
          <Text style={styles.quickActionTitle}>Neural AI</Text>
          <Text style={styles.quickActionSubtitle}>Query system</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => openInAppWeb('fundamentals', 'Fundamentals')}>
          <View style={styles.quickActionIconBox}>
            <Text style={styles.quickActionIconText}>📐</Text>
          </View>
          <Text style={styles.quickActionTitle}>Fundamentals</Text>
          <Text style={styles.quickActionSubtitle}>Basics — unlocked</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => openInAppWeb('whiteboard', 'Whiteboard')}>
          <View style={styles.quickActionIconBox}>
            <Text style={styles.quickActionIconText}>✏️</Text>
          </View>
          <Text style={styles.quickActionTitle}>Whiteboard</Text>
          <Text style={styles.quickActionSubtitle}>Draw & solve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => setShowResources(true)}>
          <View style={styles.quickActionIconBox}>
            <Text style={styles.quickActionIconText}>⬡</Text>
          </View>
          <Text style={styles.quickActionTitle}>Holograms</Text>
          <Text style={styles.quickActionSubtitle}>3D models</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => { loadChatMessages(); setScreen('chat'); }}>
          <View style={styles.quickActionIconBox}>
            <Text style={styles.quickActionIconText}>◎</Text>
          </View>
          <Text style={styles.quickActionTitle}>Command Link</Text>
          <Text style={styles.quickActionSubtitle}>Contact base</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => openInAppWeb('formula-videos', 'Formula Videos')}>
          <View style={styles.quickActionIconBox}>
            <Text style={styles.quickActionIconText}>◉</Text>
          </View>
          <Text style={styles.quickActionTitle}>Transmissions</Text>
          <Text style={styles.quickActionSubtitle}>Formula videos</Text>
        </TouchableOpacity>
      </View>

      {/* Mission Controls */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={startFinalExam}>
          <Text style={styles.bottomActionText}>◈ Final Assessment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setScreen('certificates')}>
          <Text style={styles.bottomActionText}>◉ Achievements</Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity style={styles.bottomActionBtn} onPress={() => { loadAdminDashboard(); setScreen('admin'); }}>
            <Text style={styles.bottomActionText}>⬡ Command Center</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cosmic Sectors - Locked until previous chapter passed */}
      <Text style={styles.sectionTitle}>COSMIC SECTORS</Text>
      {chapters.map((chapter, index) => {
        const isCompleted = chapterProgress[chapter.id] === 'completed';
        // Chapter is locked if previous chapter is not completed (Chapter 1 always unlocked, Admin sees all unlocked)
        const previousChapterId = index > 0 ? chapters[index - 1].id : null;
        const isPreviousCompleted = previousChapterId ? chapterProgress[previousChapterId] === 'completed' : true;
        const isLocked = !isAdmin && index > 0 && !isPreviousCompleted;
        
        return (
          <TouchableOpacity
            key={chapter.id}
            style={[styles.chapterCard, isLocked && styles.chapterLocked]}
            onPress={() => {
              if (isLocked) {
                Alert.alert('Chapter Locked', `Complete Chapter ${index} to unlock this chapter.`);
              } else {
                openChapter(chapter);
              }
            }}
          >
            <View style={[styles.chapterNumberBox, isCompleted && styles.chapterNumberCompleted, isLocked && styles.chapterNumberLocked]}>
              {isLocked ? (
                <Text style={styles.lockIcon}>🔒</Text>
              ) : (
                <Text style={styles.chapterNumber}>{chapter.number}</Text>
              )}
            </View>
            <View style={styles.chapterInfo}>
              <Text style={[styles.chapterTitle, isLocked && styles.chapterTitleLocked]}>{chapter.title}</Text>
              <Text style={[styles.chapterMeta, isLocked && styles.chapterMetaLocked]}>
                {isLocked ? `Pass Chapter ${index} to unlock` : '3 universal laws  45 cycles'}
              </Text>
            </View>
            <View style={styles.chapterRight}>
              {isLocked ? (
                <Text style={styles.lockIconSmall}>🔒</Text>
              ) : isCompleted ? (
                <Text style={styles.checkIcon}>◉</Text>
              ) : (
                <Text style={styles.arrowIcon}>›</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  // State for active tab in chapter detail
  const [activeTab, setActiveTab] = React.useState('topics');
  const [expandedTopic, setExpandedTopic] = React.useState(null);

  const renderChapter = () => (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.chapterHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.chapterHeaderInfo}>
          <Text style={styles.chapterLabel}>Chapter {currentChapter.number}</Text>
          <Text style={styles.chapterHeaderTitle}>{currentChapter.title}</Text>
        </View>
      </View>

      <Text style={styles.chapterMetaInfo}>📖 3 Topics  ⏱ 45 min</Text>

      {/* Topics / Resources Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'topics' && styles.tabActive]} 
          onPress={() => setActiveTab('topics')}
        >
          <Text style={[styles.tabText, activeTab === 'topics' && styles.tabTextActive]}>Topics</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'resources' && styles.tabActive]} 
          onPress={() => setActiveTab('resources')}
        >
          <Text style={[styles.tabText, activeTab === 'resources' && styles.tabTextActive]}>Resources</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'topics' ? (
        /* Topics List */
        <>
          {currentChapter.topics.map((topic, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.topicCard, expandedTopic === index && styles.topicCardExpanded]}
              onPress={() => setExpandedTopic(expandedTopic === index ? null : index)}
            >
              <View style={styles.topicNumberBox}>
                <Text style={styles.topicNumber}>{index + 1}</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>{topic.name}</Text>
                <Text style={[styles.topicDesc, expandedTopic === index && styles.topicDescExpanded]}>
                  {expandedTopic === index ? topic.content : topic.content.substring(0, 100) + '...'}
                </Text>
                {expandedTopic === index && (
                  <Text style={styles.tapToCollapse}>Tap to collapse</Text>
                )}
                <Text style={styles.topicMeta}>⏱ 15 min  ▶ Video</Text>
              </View>
              <Text style={styles.topicArrow}>{expandedTopic === index ? '▼' : '›'}</Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        /* Resources - Colorful Cards matching old app */
        <View style={styles.resourcesGrid}>
                    {/* Maths T.B. (Textbook) - Pink - Opens from Google Drive */}
                    <TouchableOpacity 
                      style={[styles.resourceCard, {backgroundColor: '#EC4899'}]}
                      onPress={() => {
                        const media = getCurrentMedia(currentChapter.id);
                        if (media && media.tbUrl) {
                          setPdfTitle(media.tbTitle || 'Maths T.B.');
                          setPdfUrl(media.tbUrl);
                          setShowPdfViewer(true);
                        } else {
                          Alert.alert('Coming Soon', 'Maths Textbook will be available soon!');
                        }
                      }}
                    >
                      <Text style={styles.resourceCardIcon}>📚</Text>
                      <Text style={styles.resourceCardTitle}>Maths T.B.</Text>
                      <Text style={styles.resourceCardSubtitle}>Google Drive</Text>
                      <Text style={styles.resourceCardAction}>👁️</Text>
                    </TouchableOpacity>

                    {/* Chapter PPT - Orange */}
                    <TouchableOpacity 
                      style={[styles.resourceCard, {backgroundColor: '#F97316'}]}
                      onPress={() => {
                        const media = getCurrentMedia(currentChapter.id);
                        if (media && media.pptUrl) {
                          openPDF(currentChapter.id, media.pptTitle, setShowPdfViewer, setPdfBase64, setPdfTitle, setPdfUrl);
                        } else {
                          Alert.alert('Coming Soon', 'PPT for this chapter will be available soon!\n\nPPTs are available for chapters 1-6.');
                        }
                      }}
                    >
                      <Text style={styles.resourceCardIcon}>📊</Text>
                      <Text style={styles.resourceCardTitle}>Chapter PPT</Text>
                      <Text style={styles.resourceCardSubtitle}>View inside app</Text>
                      <Text style={styles.resourceCardAction}>👁️</Text>
                    </TouchableOpacity>

          {/* Chapter Video - Teal */}
          <TouchableOpacity 
            style={[styles.resourceCard, {backgroundColor: '#14B8A6'}]}
            onPress={() => {
              const media = getCurrentMedia(currentChapter.id);
              if (media && media.videoUrl) {
                openVideo(currentChapter.id, media.title + ' Video', setShowVideoPlayer, setVideoBase64, setVideoTitle, setVideoUrl);
              } else {
                Alert.alert('Coming Soon', 'Video for this chapter will be available soon!');
              }
            }}
          >
            <Text style={styles.resourceCardIcon}>▶️</Text>
            <Text style={styles.resourceCardTitle}>Chapter Video</Text>
            <Text style={styles.resourceCardSubtitle}>Watch inside app</Text>
            <Text style={styles.resourceCardAction}>▶</Text>
          </TouchableOpacity>

          {/* 3D Model Exercise - Yellow */}
          <TouchableOpacity 
            style={[styles.resourceCard, {backgroundColor: '#F59E0B'}]}
            onPress={() => setShowResources(true)}
          >
            <Text style={styles.resourceCardIcon}>📦</Text>
            <Text style={styles.resourceCardTitle}>3D Model Exercise</Text>
            <Text style={styles.resourceCardSubtitle}>Interactive visualization</Text>
            <Text style={styles.resourceCardAction}>›</Text>
          </TouchableOpacity>

          {/* AI Assistant - Purple */}
          <TouchableOpacity 
            style={[styles.resourceCard, {backgroundColor: '#8B5CF6'}]}
            onPress={() => { setAiMessages([]); setShowLanguageSelector(true); setScreen('aiAssistant'); }}
          >
            <Text style={styles.resourceCardIcon}>💬</Text>
            <Text style={styles.resourceCardTitle}>AI Assistant</Text>
            <Text style={styles.resourceCardSubtitle}>Ask doubts about this chapter</Text>
            <Text style={styles.resourceCardAction}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chapter Exam Bar - Fixed at bottom */}
      <View style={styles.examBar}>
        <View>
          <Text style={styles.examBarTitle}>Chapter Exam</Text>
          <Text style={styles.examBarSubtitle}>40 Questions | Pass: 35/40</Text>
        </View>
        <TouchableOpacity style={styles.startExamBtn} onPress={startQuiz}>
          <Text style={styles.startExamBtnText}>Start Exam →</Text>
        </TouchableOpacity>
      </View>

      {/* 3D Models Modal */}
      <Modal visible={showResources} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.resourcesModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>3D Models - Chapter {currentChapter.number}</Text>
              <TouchableOpacity onPress={() => setShowResources(false)}>
                <Text style={styles.closeBtn}>X</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {(chapter3DModels[currentChapter.id] || []).map((model) => (
                <TouchableOpacity
                  key={model.id}
                  style={styles.modelCard}
                  onPress={() => {
                    setSelectedModel(model);
                    setShowModelViewer(true);
                  }}
                >
                  <View style={styles.modelIcon}>
                    <Text style={styles.modelIconText}>3D</Text>
                  </View>
                  <View style={styles.modelInfo}>
                    <Text style={styles.modelName}>{model.name}</Text>
                    <Text style={styles.modelDesc}>{model.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Model Viewer Modal - REAL 3D with Three.js */}
      <Modal visible={showModelViewer} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modelViewerModal, { width: '95%', height: '70%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedModel?.name}</Text>
              <TouchableOpacity onPress={() => setShowModelViewer(false)}>
                <Text style={styles.closeBtn}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
              {selectedModel && (
                <WebView
                  source={{ html: generate3DModelHTML(selectedModel.type, selectedModel.name) }}
                  style={{ flex: 1, backgroundColor: '#1A1A2E' }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  originWhitelist={['*']}
                  mixedContentMode="always"
                />
              )}
            </View>
            <Text style={[styles.modelDescription, { marginTop: 10 }]}>{selectedModel?.description}</Text>
            <Text style={styles.modelNote}>Drag to rotate | Pinch to zoom</Text>
          </View>
        </View>
      </Modal>

      {/* PDF Viewer Modal - INBUILT with PDF.js or Google Drive */}
      <Modal visible={showPdfViewer} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modelViewerModal, { width: '100%', height: '100%', borderRadius: 0 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{pdfTitle}</Text>
              <TouchableOpacity onPress={() => { setShowPdfViewer(false); setPdfBase64(''); setPdfUrl(''); }}>
                <Text style={styles.closeBtn}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              {pdfUrl ? (
                <WebView
                  source={{ uri: pdfUrl }}
                  style={{ flex: 1, backgroundColor: '#1A1A2E' }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  originWhitelist={['*']}
                  mixedContentMode="always"
                />
              ) : pdfBase64 ? (
                <WebView
                  source={{ html: generatePDFViewerHTML(pdfBase64) }}
                  style={{ flex: 1, backgroundColor: '#1A1A2E' }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  originWhitelist={['*']}
                  mixedContentMode="always"
                />
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#8B5CF6" />
                  <Text style={{ color: '#fff', marginTop: 10 }}>Loading PDF...</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Video Player Modal - INBUILT with HTML5 Video or Google Drive */}
      <Modal visible={showVideoPlayer} transparent animationType="slide" onShow={() => ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modelViewerModal, { width: '100%', height: '100%', borderRadius: 0 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{videoTitle}</Text>
              <TouchableOpacity onPress={() => { ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP); setShowVideoPlayer(false); setVideoBase64(''); setVideoUrl(''); }}>
                <Text style={styles.closeBtn}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              {videoUrl ? (
                <WebView
                  source={{ uri: videoUrl }}
                  style={{ flex: 1, backgroundColor: '#1A1A2E' }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  originWhitelist={['*']}
                  mixedContentMode="always"
                />
              ) : videoBase64 ? (
                <WebView
                  source={{ html: generateVideoPlayerHTML(videoBase64, videoTitle) }}
                  style={{ flex: 1, backgroundColor: '#1A1A2E' }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  originWhitelist={['*']}
                  mixedContentMode="always"
                />
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#8B5CF6" />
                  <Text style={{ color: '#fff', marginTop: 10 }}>Loading Video...</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  const renderQuiz = () => {
    if (isFinalExam && examPhase === 'penPaper') {
      return (
        <View ref={screenViewRef} collapsable={false} style={{flex: 1}}>
        <ScrollView style={styles.container}>
          {isScreenSharing ? (
            <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#7a1f2b', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginBottom: 10}}>
              <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#fbbf24', marginRight: 8}} />
              <Text style={{color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.5}}>SCREEN SHARING — ADMIN IS MONITORING</Text>
            </View>
          ) : null}
          <Text style={styles.sectionTitle}>Final Exam — Sections C / D / E (Write on Paper + Photo)</Text>
          <Text style={styles.examInfo}>
            MCQ + Case-Based Score: {mcqScore}/25  |  Paper Sections: 15 marks (C: 2×2, D: 2×3, E: 1×5)
          </Text>
          <Text style={{color: '#94a3b8', fontSize: 12, marginBottom: 10}}>
            For each question: write the answer in your notebook, photograph it, and tap "Attach Photo of Written Answer".
          </Text>

          {finalExamPenPaper.map((question, index) => {
            const section = question.section || (index <= 1 ? 'C' : index <= 3 ? 'D' : 'E');
            const sectionTitleByLetter = {
              C: 'Section C — Very Short Answer (write on paper + photo)',
              D: 'Section D — Short Answer (write on paper + photo)',
              E: 'Section E — Long Answer (write on paper + photo)'
            };
            const sectionLabel = sectionTitleByLetter[section] || ('Section ' + section);
            const photoUri = penPaperPhotos[index];
            return (
              <View key={index} style={styles.questionCard}>
                <Text style={{fontSize: 11, color: '#00d4ff', fontWeight: '600', letterSpacing: 1, marginBottom: 4}}>{sectionLabel.toUpperCase()}</Text>
                <Text style={styles.questionNumber}>Question {index + 1} ({question.marks} marks)</Text>
                <Text style={styles.questionText}>{question.q}</Text>
                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={4}
                  placeholder="Write your answer here..."
                  placeholderTextColor="#888"
                  value={penPaperAnswers[index] || ''}
                  onChangeText={(text) => submitPenPaperAnswer(index, text)}
                />
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8}}>
                  <TouchableOpacity
                    onPress={() => capturePhotoForAnswer(index)}
                    style={{flex: 1, backgroundColor: '#0a4d68', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}
                  >
                    <Text style={{color: '#00d4ff', fontSize: 18, marginRight: 6}}>📷</Text>
                    <Text style={{color: '#fff', fontWeight: '600'}}>{photoUri ? 'Retake Photo' : 'Attach Photo of Written Answer'}</Text>
                  </TouchableOpacity>
                  {photoUri ? (
                    <TouchableOpacity onPress={() => clearPhotoForAnswer(index)} style={{backgroundColor: '#7a1f2b', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8}}>
                      <Text style={{color: '#fff', fontWeight: '600'}}>Remove</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                {photoUri ? (
                  <Image source={{uri: photoUri}} style={{width: '100%', height: 180, marginTop: 10, borderRadius: 8, resizeMode: 'cover', borderWidth: 1, borderColor: '#00d4ff'}} />
                ) : null}
              </View>
            );
          })}

          <TouchableOpacity style={styles.primaryBtn} onPress={submitFinalExam}>
            <Text style={styles.primaryBtnText}>Submit Final Exam</Text>
          </TouchableOpacity>
        </ScrollView>
        </View>
      );
    }

    const questions = isFinalExam ? finalExamMCQ : currentChapter.questions;
    const question = questions[currentQuestion];
    const total = questions.length;
    // Every quiz (chapter or final) uses the same 5-section schema. Chapter
    // quizzes are pure MCQ → always Section A. The Final Exam mixes A/B/C/D/E.
    const section = question.section || 'A';
    const sectionTitleByLetter = {
      A: 'Section A — MCQ (1 mark each)',
      B: 'Section B — Case-Based MCQ (1 mark each)'
    };
    // Only show the case scenario above the FIRST question of a contiguous
    // run of Section B questions sharing the same case text. Subsequent
    // questions in the same case display a smaller reminder.
    const prevQuestion = currentQuestion > 0 ? questions[currentQuestion - 1] : null;
    const isFirstOfCase = section === 'B' && question.case && (!prevQuestion || prevQuestion.case !== question.case);
    const isContinuationOfCase = section === 'B' && question.case && prevQuestion && prevQuestion.case === question.case;

    return (
      <View ref={screenViewRef} collapsable={false} style={{flex: 1}}>
      <ScrollView style={styles.container}>
        {isScreenSharing ? (
          <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#7a1f2b', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginBottom: 10}}>
            <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#fbbf24', marginRight: 8}} />
            <Text style={{color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.5}}>SCREEN SHARING — ADMIN IS MONITORING</Text>
          </View>
        ) : null}
        <Text style={styles.sectionTitle}>
          {isFinalExam
            ? 'Final Exam — ' + sectionTitleByLetter[section]
            : 'Chapter ' + currentChapter.number + ' Quiz — ' + (sectionTitleByLetter[section] || 'Section A')}
        </Text>
        <Text style={{color: '#94a3b8', fontSize: 12, marginBottom: 10, textAlign: 'center'}}>
          {isFinalExam
            ? 'Sections: A (MCQ) · B (Case-Based) · C/D/E follow with paper + photo upload'
            : 'Section A — Multiple Choice. Final Exam adds B (Case-Based) + C/D/E (paper).'}
        </Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: ((currentQuestion / total) * 100) + '%' }]} />
        </View>
        <Text style={styles.progressText}>Question {currentQuestion + 1} of {total}</Text>

        {isFirstOfCase ? (
          <View style={{backgroundColor: '#0a2540', borderLeftWidth: 4, borderLeftColor: '#00d4ff', padding: 12, borderRadius: 8, marginBottom: 12}}>
            <Text style={{color: '#00d4ff', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6}}>CASE STUDY</Text>
            <Text style={{color: '#e2e8f0', fontSize: 14, lineHeight: 20}}>{question.case}</Text>
          </View>
        ) : null}
        {isContinuationOfCase ? (
          <Text style={{color: '#64748b', fontSize: 11, fontStyle: 'italic', marginBottom: 8}}>(Continued — same case study as previous question)</Text>
        ) : null}

        <View style={styles.questionCard}>
          <Text style={{fontSize: 11, color: '#00d4ff', fontWeight: '700', letterSpacing: 1, marginBottom: 4}}>
            SECTION {section} {section === 'A' ? '— MCQ' : section === 'B' ? '— CASE-BASED' : ''}
          </Text>
          <Text style={styles.questionNumber}>
            Question {currentQuestion + 1} (1 mark)
          </Text>
          <Text style={styles.questionText}>{question.q}</Text>

          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.option, selectedOption === index && styles.optionSelected]}
              onPress={() => selectOption(index)}
            >
              <Text style={styles.optionText}>{String.fromCharCode(65 + index)}. {option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, selectedOption === null && styles.btnDisabled]}
          onPress={submitAnswer}
          disabled={selectedOption === null}
        >
          <Text style={styles.primaryBtnText}>
            {currentQuestion === total - 1
              ? (isFinalExam ? 'Continue to Sections C / D / E (Paper)' : 'Finish')
              : (section === 'A' && questions[currentQuestion + 1] && questions[currentQuestion + 1].section === 'B'
                  ? 'Continue to Section B'
                  : 'Next Question')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    );
  };

  const renderProgress = () => {
    const completedCount = Object.keys(chapterProgress).filter(k => chapterProgress[k] === 'completed').length;
    const overallProgress = Math.round((completedCount / chapters.length) * 100);

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>My Learning Progress</Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: overallProgress + '%' }]} />
        </View>
        <Text style={styles.progressText}>{completedCount}/{chapters.length} Chapters Completed ({overallProgress}%)</Text>

        {chapters.map(chapter => (
          <View key={chapter.id} style={styles.progressCard}>
            <Text style={styles.progressChapterNum}>{chapter.number}</Text>
            <View style={styles.progressChapterInfo}>
              <Text style={styles.progressChapterTitle}>{chapter.title}</Text>
              <Text style={chapterProgress[chapter.id] === 'completed' ? styles.statusCompletedText : styles.statusLockedText}>
                {chapterProgress[chapter.id] === 'completed' ? 'Score: ' + chapterScores[chapter.id] + '%' : 'Not Completed'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderCertificates = () => (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}>
        <Text style={styles.backBtnText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Certificates</Text>

      {certificates.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📜</Text>
          <Text style={styles.emptyText}>No certificates yet. Complete quizzes to earn certificates!</Text>
        </View>
      ) : (
        certificates.map((cert, index) => (
          <View key={index} style={styles.certificate}>
            <Text style={styles.certTitle}>
              {cert.type === 'master' ? 'MASTER CERTIFICATE' : 
               cert.type === 'final' ? 'FINAL EXAM CERTIFICATE' : 
               'CHAPTER COMPLETION'}
            </Text>
            <Text style={styles.certText}>This is to certify that</Text>
            <Text style={styles.certName}>{studentName}</Text>
            <Text style={styles.certText}>
              {cert.type === 'master' ? 'has completed GANITA PRAKASH Class VI Mathematics' :
               cert.type === 'final' ? 'passed the Final Exam with ' + cert.score + '/100' :
               'completed Chapter ' + cert.chapterId + ': ' + cert.chapterTitle + ' with ' + cert.score + '%'}
            </Text>
            <Text style={styles.certDate}>Date: {cert.date}</Text>
            {cert.type === 'master' && (
              <View style={styles.finalMessage}>
                <Text style={styles.finalMessageText}>Be ready for Science Curiosity - Thanks!</Text>
                <Text style={styles.goodbyeText}>We will update when our new app is available. We will inform you. OK Bye!</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );

    // Google Sign-In - Firebase ONLY
    const handleGoogleSignIn = async () => {
      try {
        setLoading(true);
        
        // Check Google Play Services
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        
        // Sign in with Google using Firebase
        const signInResult = await GoogleSignin.signIn();
        const idToken = signInResult.data?.idToken || signInResult.idToken;
        
        if (!idToken) {
          throw new Error('No ID token received');
        }
        
        // Firebase authentication
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const firebaseUserCredential = await auth().signInWithCredential(googleCredential);
        const firebaseUser = firebaseUserCredential.user;
        
        const userEmail = firebaseUser.email;
        const displayName = firebaseUser.displayName || '';
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || '';
        const surname = nameParts.slice(1).join(' ') || '';
        
        if (!userEmail) {
          Alert.alert('Error', 'Could not get email from Google account');
          setLoading(false);
          return;
        }
        
        // Check if user exists locally
        const existingUserData = await AsyncStorage.getItem('userData');
        if (existingUserData) {
          const existingUser = JSON.parse(existingUserData);
          if (existingUser.email === userEmail && existingUser.name) {
            await processGoogleSignInWithData(userEmail, existingUser.name);
            setLoading(false);
            return;
          }
        }
        
        // Check if user exists on backend
        let userExistsOnBackend = false;
        let backendUserData = null;
        
        try {
          const checkResponse = await fetch(`${API_URL}/api/auth/check-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
          });
          
          if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            if (checkData.exists && checkData.user) {
              userExistsOnBackend = true;
              backendUserData = checkData.user;
            }
          }
        } catch (e) {
          console.log('Backend check error:', e);
        }
        
        // Login existing user
        if (userExistsOnBackend && backendUserData) {
          try {
            const loginResponse = await fetch(`${API_URL}/api/auth/google-login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: userEmail }),
            });
            
            if (loginResponse.ok) {
              const loginData = await loginResponse.json();
              const userData = {
                name: loginData.user.name,
                is_admin: loginData.user.is_admin,
                id: loginData.user.id,
                email: userEmail
              };
              await AsyncStorage.setItem('authToken', loginData.access_token);
              await AsyncStorage.setItem('userData', JSON.stringify(userData));
              await AsyncStorage.setItem('studentName', loginData.user.name);
              setAuthToken(loginData.access_token);
              setMyUserId(loginData.user.id);
              setStudentName(loginData.user.name);
              setIsAdmin(loginData.user.is_admin);
              setIsLoggedIn(true);
              setScreen('home');
              loadData();
              setLoading(false);
              return;
            }
          } catch (e) {
            console.log('Login error:', e);
          }
        }
        
        // New user - show registration
        setNewUserEmail(userEmail);
        setNewUserFirstName(firstName);
        setNewUserSurname(surname);
        setNewUserDOB('');
        setDobError('');
        setShowRegistrationModal(true);
        setLoading(false);
        
      } catch (error) {
        console.log('Google Sign-In error:', error);
        setLoading(false);
        
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // User cancelled - do nothing
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert('Error', 'Google Play Services not available');
        } else {
          Alert.alert('Google Sign-In Error', error.message || 'Please try again');
        }
      }
    };
    
    // Complete registration with First Name, Surname, and DOB
    const completeRegistration = async () => {
      if (!newUserFirstName.trim()) {
        Alert.alert('Error', 'Please enter your First Name');
        return;
      }
      if (!newUserSurname.trim()) {
        Alert.alert('Error', 'Please enter your Surname');
        return;
      }
      if (!newUserDOB || newUserDOB.length !== 10) {
        Alert.alert('Error', 'Please enter your Date of Birth (DD/MM/YYYY)');
        return;
      }
      if (dobError) {
        Alert.alert('Error', dobError);
        return;
      }
      
      setLoading(true);
      setShowRegistrationModal(false);
      
      const fullName = `${newUserFirstName.trim()} ${newUserSurname.trim()}`;
      const email = newUserEmail;
      
      try {
        const isAdminUser = email === ADMIN_EMAIL;
        
        // Register user on backend
        let backendToken = null;
        let backendUserId = Date.now();
        try {
          const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              username: email, 
              password: 'google-oauth-' + Date.now(), 
              name: fullName,
              platform: 'apk',
              dob: newUserDOB
            }),
          });
          if (registerResponse.ok) {
            const registerData = await registerResponse.json();
            backendToken = registerData.access_token;
            backendUserId = registerData.user?.id || backendUserId;
          } else {
            // User might already exist, try to login
            const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: email, password: 'google-auth', platform: 'apk' }),
            });
            if (loginResponse.ok) {
              const loginData = await loginResponse.json();
              backendToken = loginData.access_token;
              backendUserId = loginData.user?.id || backendUserId;
            }
          }
        } catch (backendError) {
          console.log('Backend registration error:', backendError);
        }
        
        const finalToken = backendToken || ('google-oauth-' + Date.now());
        const userData = { 
          name: fullName, 
          firstName: newUserFirstName.trim(),
          surname: newUserSurname.trim(),
          dob: newUserDOB,
          is_admin: isAdminUser, 
          id: backendUserId, 
          email: email 
        };
        await AsyncStorage.setItem('authToken', finalToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        await AsyncStorage.setItem('studentName', fullName);
        setAuthToken(finalToken);
        setMyUserId(backendUserId);
        setStudentName(fullName);
        setIsAdmin(isAdminUser);
        setIsLoggedIn(true);
        setScreen('home');
        loadData();
        
        // Check if today is birthday
        checkBirthdayWish();
      } catch (e) {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
      setLoading(false);
    };
    
    // Process Google Sign-In with real user data from OAuth
    const processGoogleSignInWithData = async (email, displayName) => {
      try {
        const isAdminUser = email === ADMIN_EMAIL;
        
        // Register user on backend for admin dashboard visibility
        let backendToken = null;
        let backendUserId = Date.now();
        try {
          const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              username: email, 
              password: 'google-oauth-' + Date.now(), 
              name: displayName,
              platform: 'apk'
            }),
          });
          if (registerResponse.ok) {
            const registerData = await registerResponse.json();
            backendToken = registerData.access_token;
            backendUserId = registerData.user?.id || backendUserId;
          } else {
            // User might already exist, try to login
            const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: email, password: 'google-auth', platform: 'apk' }),
            });
            if (loginResponse.ok) {
              const loginData = await loginResponse.json();
              backendToken = loginData.access_token;
              backendUserId = loginData.user?.id || backendUserId;
            }
          }
        } catch (backendError) {
          console.log('Backend registration error:', backendError);
        }
        
        const finalToken = backendToken || ('google-oauth-' + Date.now());
        const userData = { 
          name: displayName, 
          is_admin: isAdminUser, 
          id: backendUserId, 
          email: email 
        };
        await AsyncStorage.setItem('authToken', finalToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        await AsyncStorage.setItem('studentName', displayName);
        setAuthToken(finalToken);
        setMyUserId(backendUserId);
        setStudentName(displayName);
        setIsAdmin(isAdminUser);
        setIsLoggedIn(true);
        setScreen('home');
        loadData();
      } catch (e) {
        Alert.alert('Error', 'Google Sign-In failed. Please try again.');
      }
    };

    // Fallback: Process Google Sign-In with entered email (if OAuth fails)
    const processGoogleSignIn = async () => {
      if (!googleEmail.trim()) {
        Alert.alert('Error', 'Please enter your Google email address');
        return;
      }
      if (!googleEmail.includes('@')) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
      setLoading(true);
      setShowGoogleModal(false);
      try {
        const email = googleEmail.trim();
        const isAdminUser = email === ADMIN_EMAIL;
        
        // Check if user already has a saved name
        const existingUserData = await AsyncStorage.getItem('userData');
        let savedName = null;
        let savedEmail = null;
        if (existingUserData) {
          const parsed = JSON.parse(existingUserData);
          savedEmail = parsed.email;
          if (parsed.email === email && parsed.name && !parsed.name.includes('@')) {
            savedName = parsed.name;
          }
        }
        
        // Clear previous user data if different email
        if (savedEmail && savedEmail !== email) {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('userData');
          await AsyncStorage.removeItem('studentName');
          await AsyncStorage.removeItem('chapterProgress');
          await AsyncStorage.removeItem('chapterScores');
          await AsyncStorage.removeItem('certificates');
        }
        
        // Use saved name or show registration modal for new users
        // Never use "Student" as fallback - always use actual user name
        const displayName = savedName || (isAdminUser ? 'Master Admin' : '');
        
        // Check if user exists on backend using check-user endpoint
        let backendToken = null;
        let backendUserId = Date.now();
        let existingUserName = displayName;
        try {
          const checkResponse = await fetch(`${API_URL}/api/auth/check-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email }),
          });
          if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            if (checkData.exists) {
              // User exists - use google-login endpoint (no password needed)
              const loginResponse = await fetch(`${API_URL}/api/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }),
              });
              if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                backendToken = loginData.access_token;
                backendUserId = loginData.user?.id || backendUserId;
                existingUserName = loginData.user?.name || displayName;
              }
            } else {
              // New user - register
              const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  username: email, 
                  password: 'google-' + Date.now(), 
                  name: displayName,
                  platform: 'apk'
                }),
              });
              if (registerResponse.ok) {
                const registerData = await registerResponse.json();
                backendToken = registerData.access_token;
                backendUserId = registerData.user?.id || backendUserId;
              }
            }
          }
        } catch (backendError) {
          console.log('Backend registration error:', backendError);
        }
        
        const finalToken = backendToken || ('google-' + Date.now());
        const finalName = existingUserName || displayName;
        const userData = { 
          name: finalName, 
          is_admin: isAdminUser, 
          id: backendUserId, 
          email: email 
        };
        await AsyncStorage.setItem('authToken', finalToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setAuthToken(finalToken);
        setMyUserId(backendUserId);
        setStudentName(finalName);
        setIsAdmin(isAdminUser);
        setIsLoggedIn(true);
        setScreen('home');
        loadData();
      
        // Only show registration modal for new users who don't have a name yet
        if (!finalName && !isAdminUser) {
          setShowRegistrationModal(true);
          setNewUserEmail(email);
        }
      } catch (e) {
        Alert.alert('Error', 'Google Sign-In failed. Please try again.');
      }
      setLoading(false);
    };

  // Login Screen - Matching old app UI exactly
  const renderLogin = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.loginContainer}>
      <View style={styles.loginLogoContainer}>
        <Image source={require('./assets/icon.png')} style={styles.loginLogo} />
      </View>
      <Text style={styles.loginTitle}>GANITA PRAKASH</Text>
      <Text style={styles.loginSubtitle}>NCERT Mathematics — Class 6 and Class 7</Text>

      <View style={styles.loginCard}>
        <Text style={styles.welcomeTitle}>{isRegistering ? 'Create Account' : 'Welcome Back!'}</Text>
        <Text style={styles.welcomeSubtitle}>{isRegistering ? 'Register to start learning' : 'Sign in to continue learning'}</Text>
        
        {isRegistering && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.loginInput}
              placeholder="Your Name"
              placeholderTextColor="#666"
              value={studentName}
              onChangeText={setStudentName}
            />
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={styles.loginInput}
            placeholder="Email Address"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={[styles.loginInput, { flex: 1 }]}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordBtn}>
            <Text style={styles.showPasswordIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.signInBtn, loading && styles.btnDisabled]}
          onPress={isRegistering ? handleRegister : handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInBtnText}>{isRegistering ? 'Register' : 'Sign In'}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.switchAuthText}>
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <Text style={styles.switchAuthLink}>{isRegistering ? 'Sign In' : 'Sign Up'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Chat Screen - Connect with Master (matching old app)
  // Auto-refresh chat messages when on chat screen
  useEffect(() => {
    let chatRefreshInterval = null;
    if (screen === 'chat' && isLoggedIn && authToken) {
      loadChatMessages();
      chatRefreshInterval = setInterval(() => {
        loadChatMessages();
      }, 2000);
    }
    return () => {
      if (chatRefreshInterval) clearInterval(chatRefreshInterval);
    };
  }, [screen, isLoggedIn, authToken]);

  const renderChat = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.chatHeaderIcon}>
          <Text style={styles.chatHeaderIconText}>🛡️</Text>
        </View>
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderTitle}>Connect with Master</Text>
          <Text style={styles.chatHeaderSubtitle}>Ask questions, get help</Text>
        </View>
      </View>

      {/* Info Banner */}
      <View style={styles.chatInfoBanner}>
        <Text style={styles.chatInfoIcon}>ℹ️</Text>
        <Text style={styles.chatInfoText}>Send messages, voice notes, or photos. We will call you as soon as possible.</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={chatListRef}
        data={chatMessages}
        keyExtractor={(item, index) => String(item.id || index)}
        style={styles.chatList}
        onContentSizeChange={() => { try { chatListRef.current && chatListRef.current.scrollToEnd({ animated: false }); } catch (_) {} }}
        renderItem={({ item, index }) => {
          const isAdminMsg = !!(item.is_admin_reply || item.is_admin ||
            (item.sender_username && item.sender_username.toLowerCase().indexOf('admin') !== -1) ||
            item.sender_name === 'Master' || item.sender_name === 'Master Admin');
          const isPDF = item.message_type === 'pdf' || (item.content && item.content.toLowerCase().endsWith('.pdf'));
          const isImage = item.message_type === 'image' || (item.content && (item.content.toLowerCase().endsWith('.jpg') || item.content.toLowerCase().endsWith('.png')));
          const isVoice = item.message_type === 'voice' || item.message_type === 'audio' || (item.content && item.content.startsWith('[Voice Message'));
          
          return (
            <View style={[styles.chatBubble, isAdminMsg ? styles.adminBubble : styles.userBubble]}>
              {isAdminMsg && <Text style={styles.adminLabel}>Master Admin</Text>}
              {isPDF ? (
                <TouchableOpacity 
                  onPress={async () => {
                    try {
                      // Open PDF using system viewer via Linking
                      const pdfUrl = item.file_url || item.content;
                      if (pdfUrl.startsWith('http')) {
                        await Linking.openURL(pdfUrl);
                      } else {
                        Alert.alert('PDF', 'Opening PDF: ' + pdfUrl);
                      }
                    } catch (e) {
                      Alert.alert('Error', 'Could not open PDF file');
                    }
                  }}
                  style={{flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8}}
                >
                  <Text style={{fontSize: 24, marginRight: 10}}>📄</Text>
                  <View>
                    <Text style={[styles.chatBubbleText, isAdminMsg ? styles.adminBubbleText : styles.userBubbleText]}>PDF Document</Text>
                    <Text style={{color: '#888', fontSize: 12}}>Tap to open</Text>
                  </View>
                </TouchableOpacity>
              ) : isImage ? (
                (() => {
                  const imgSrc = item.media_url || item.file_url || (item.content && (item.content.startsWith('data:image') || item.content.startsWith('http')) ? item.content : null);
                  return imgSrc ? (
                    <TouchableOpacity onPress={() => imgSrc.startsWith('http') ? Linking.openURL(imgSrc) : null} activeOpacity={0.8}>
                      <Image source={{ uri: imgSrc }} style={{ width: 200, height: 200, borderRadius: 10, backgroundColor: '#222' }} resizeMode="cover" />
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.chatBubbleText, isAdminMsg ? styles.adminBubbleText : styles.userBubbleText]}>🖼️ Image</Text>
                  );
                })()
              ) : isVoice ? (
                <TouchableOpacity 
                  onPress={() => {
                    // Prefer media_url (data URI) if present, otherwise fall back
                    // to the legacy voice_data field.
                    const audioSrc = item.media_url || (item.voice_data ? `data:audio/m4a;base64,${item.voice_data}` : null);
                    if (audioSrc) playVoiceMessage(audioSrc, index);
                  }}
                  style={{flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, minWidth: 150}}
                >
                  <View style={{width: 36, height: 36, borderRadius: 18, backgroundColor: playingVoiceId === index ? '#FF5252' : '#00E5FF', justifyContent: 'center', alignItems: 'center', marginRight: 10}}>
                    <Text style={{fontSize: 16, color: '#fff'}}>{playingVoiceId === index ? '⏸' : '▶'}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <View style={{height: 20, flexDirection: 'row', alignItems: 'center'}}>
                      {[...Array(12)].map((_, i) => (
                        <View key={i} style={{width: 3, height: 4 + Math.random() * 12, backgroundColor: playingVoiceId === index ? '#FF5252' : 'rgba(0,229,255,0.6)', marginHorizontal: 1, borderRadius: 2}} />
                      ))}
                    </View>
                    <Text style={{color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2}}>{item.duration ? `${item.duration}s` : 'Voice'}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.chatBubbleText, isAdminMsg ? styles.adminBubbleText : styles.userBubbleText]}>{item.content}</Text>
              )}
              <Text style={styles.chatBubbleTime}>{new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>}
      />

      {/* Input Bar - WhatsApp style with voice recording */}
      {isRecording ? (
        <View style={[styles.chatInputBar, {backgroundColor: 'rgba(255,82,82,0.15)', borderColor: '#FF5252'}]}>
          <TouchableOpacity 
            style={{width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,82,82,0.2)', justifyContent: 'center', alignItems: 'center'}}
            onPress={cancelVoiceRecording}
          >
            <Text style={{fontSize: 18, color: '#FF5252'}}>✕</Text>
          </TouchableOpacity>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF5252', marginRight: 8, opacity: recordingDuration % 2 === 0 ? 1 : 0.5}} />
            <Text style={{color: '#FF5252', fontSize: 16, fontWeight: 'bold'}}>{formatRecordingTime(recordingDuration)}</Text>
            <Text style={{color: 'rgba(255,82,82,0.7)', fontSize: 12, marginLeft: 10}}>Recording...</Text>
          </View>
          <TouchableOpacity 
            style={{width: 50, height: 50, borderRadius: 25, backgroundColor: '#00E5FF', justifyContent: 'center', alignItems: 'center'}}
            onPress={stopVoiceRecording}
          >
            <Text style={{fontSize: 20, color: '#fff'}}>➤</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.chatInputBar}>
          <TouchableOpacity style={styles.chatMediaBtn} onPress={pickAndSendChatImage} disabled={chatLoading}>
            <Text style={styles.chatMediaIcon}>📷</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.chatInputField}
            placeholder="Type your message..."
            placeholderTextColor="#666"
            value={chatInput}
            onChangeText={setChatInput}
          />
          {chatInput.trim() ? (
            <TouchableOpacity
              style={[styles.chatSendBtn, chatLoading && styles.btnDisabled]}
              onPress={sendChatMessage}
              disabled={chatLoading}
            >
              {chatLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.chatSendIcon}>➤</Text>}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.chatMicBtn, {backgroundColor: '#075E54'}]}
              onPress={startVoiceRecording}
              disabled={chatLoading}
            >
              <Text style={[styles.chatMicIcon, {color: '#fff'}]}>🎤</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  // AI Assistant Screen with Language Selection
  const selectAILanguage = (langCode) => {
    setSelectedLanguage(langCode);
    setShowLanguageSelector(false);
    const langName = SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.name || 'English';
    setAiMessages([{ role: 'assistant', content: `Great! I'll help you in ${langName}. Ask me any doubt about this chapter!` }]);
  };

  const renderAIAssistant = () => (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { setScreen('chapter'); setShowLanguageSelector(true); setAiMessages([]); }}>
          <Text style={styles.backBtnText}>Back to Chapter</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8}}
          onPress={() => setShowAiSidebar(!showAiSidebar)}
        >
          <Text style={{color: '#fff', fontSize: 14}}>📋 Recent Chats</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Chats Sidebar */}
      {showAiSidebar && (
        <View style={{backgroundColor: '#2A2A4E', borderRadius: 12, padding: 16, marginVertical: 10}}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>Recent Chats</Text>
          {aiChatHistory.length === 0 ? (
            <Text style={{color: '#888', fontSize: 14}}>No recent chats yet. Start asking questions!</Text>
          ) : (
            aiChatHistory.slice(0, 5).map((chat, index) => (
              <TouchableOpacity 
                key={index} 
                style={{backgroundColor: '#1A1A2E', padding: 10, borderRadius: 8, marginBottom: 8}}
                onPress={() => {
                  setAiMessages(chat.messages);
                  setShowAiSidebar(false);
                }}
              >
                <Text style={{color: '#8B5CF6', fontSize: 12}}>{chat.chapter}</Text>
                <Text style={{color: '#fff', fontSize: 14}} numberOfLines={1}>{chat.preview}</Text>
                <Text style={{color: '#666', fontSize: 10}}>{chat.date}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      <Text style={styles.sectionTitle}>AI Assistant - Ask Doubt</Text>
      <Text style={styles.aiSubtitle}>Chapter {currentChapter?.number}: {currentChapter?.title}</Text>

      {showLanguageSelector ? (
        <View style={styles.languageSelector}>
          <Text style={styles.languageTitle}>Which language are you comfortable with?</Text>
          <Text style={styles.languageSubtitle}>Select your preferred language for AI assistance</Text>
          <View style={styles.languageGrid}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.languageBtn, selectedLanguage === lang.code && styles.languageBtnSelected]}
                onPress={() => selectAILanguage(lang.code)}
              >
                <Text style={[styles.languageBtnText, selectedLanguage === lang.code && styles.languageBtnTextSelected]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <>
          <View style={styles.selectedLangBadge}>
            <Text style={styles.selectedLangText}>
              Language: {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English'}
            </Text>
            <TouchableOpacity onPress={() => setShowLanguageSelector(true)}>
              <Text style={styles.changeLangText}>Change</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={aiMessages}
            keyExtractor={(item, index) => index.toString()}
            style={styles.chatList}
            renderItem={({ item }) => (
              <View style={[styles.aiMessage, item.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
                <Text style={[styles.aiMessageText, item.role === 'user' && styles.userMessageText]}>{item.content}</Text>
                {item.role === 'assistant' && item.content !== 'Thinking...' && (
                  <View style={{flexDirection: 'row', gap: 8, marginTop: 8}}>
                    <TouchableOpacity 
                      style={styles.speakerBtn}
                      onPress={() => {
                        setIsSpeaking(true);
                        Speech.speak(item.content, { 
                          language: selectedLanguage || 'en', 
                          rate: 0.9,
                          onDone: () => setIsSpeaking(false),
                          onStopped: () => setIsSpeaking(false),
                          onError: () => setIsSpeaking(false)
                        });
                      }}
                    >
                      <Text style={styles.speakerBtnText}>🔊 Listen</Text>
                    </TouchableOpacity>
                    {isSpeaking && (
                      <TouchableOpacity 
                        style={[styles.speakerBtn, {backgroundColor: '#EF4444'}]}
                        onPress={() => {
                          Speech.stop();
                          setIsSpeaking(false);
                        }}
                      >
                        <Text style={styles.speakerBtnText}>⏹ Stop</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Ask any doubt about this chapter!</Text>}
          />

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask your doubt..."
              placeholderTextColor="#888"
              value={aiInput}
              onChangeText={setAiInput}
            />
            <TouchableOpacity
              style={[styles.sendBtn, aiLoading && styles.btnDisabled]}
              onPress={askAI}
              disabled={aiLoading}
            >
              {aiLoading ? <ActivityIndicator color="#1A1A2E" size="small" /> : <Text style={styles.sendBtnText}>Ask</Text>}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  // State for Gemini AI calling and WebRTC
  const [callingUser, setCallingUser] = useState(null);
  const [callStatus, setCallStatus] = useState('');
  const [activeCall, setActiveCall] = useState(null);
  const [callType, setCallType] = useState(null);

  // Function to initiate WebRTC voice/video call - opens in-app WebView
  const initiateWebRTCCall = async (user, type) => {
    setCallingUser(user);
    setCallType(type);
    setCallStatus('Initiating ' + type + ' call...');
    // Pre-request OS-level mic / camera permissions so the in-WebView WebRTC
    // `getUserMedia()` call can actually succeed. Without this, Android denies
    // the WebView access to mic/camera and media never flows.
    try {
      const micPerm = await Audio.requestPermissionsAsync();
      if (!micPerm || micPerm.status !== 'granted') {
        Alert.alert('Microphone permission required', 'Grant microphone access so the other person can hear you.');
        return;
      }
      if (type === 'video') {
        const camPerm = await ImagePicker.requestCameraPermissionsAsync();
        if (!camPerm || camPerm.status !== 'granted') {
          Alert.alert('Camera permission required', 'Grant camera access so the other person can see you.');
          return;
        }
      }
    } catch (_) { /* permission APIs may fail on very old Android; ignore and let WebView ask */ }
    try {
      // Open the bundled, native-looking call HTML which itself runs the real
      // getUserMedia + createOffer + POST /api/webrtc/offer pipeline. The
      // backend still tracks the call_id; we don't need to pre-create it here.
      setActiveCall('outgoing');
      setCallStatus('Calling ' + user.name + '...');
      const html = buildCallHtml({
        apiUrl: API_URL,
        token: authToken,
        myUserId: myUserId,
        mode: 'call',
        peerUserId: user.id,
        callType: type,
        callerName: user.name || 'User',
        callId: '',
      });
      setCallWebViewHtml(html);
      setCallWebViewUrl('');
      setCallWebViewTitle(type === 'video' ? 'Video Call with ' + user.name : 'Voice Call with ' + user.name);
      setShowCallWebView(true);
    } catch (error) {
      setCallStatus('Call failed');
      Alert.alert('Error', 'Network error. Please check your connection.');
    }
  };

  // Function to end WebRTC call
  const endWebRTCCall = async () => {
    if (callingUser && callingUser.id) {
      try {
        await fetch(`${API_URL}/api/webrtc/end-call?target_user_id=${callingUser.id}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
      } catch (error) {
        console.log('Error ending call:', error);
      }
    }
    setCallingUser(null);
    setCallStatus('');
    setActiveCall(null);
    setCallType(null);
  };

  // Function to initiate Gemini AI voice call
  const initiateGeminiCall = async (user) => {
    setCallingUser(user);
    setCallStatus('Initiating call...');
    try {
      const response = await fetch(`${API_URL}/admin/gemini-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ user_id: user.id, action: 'initiate_call' })
      });
      if (response.ok) {
        setCallStatus('Gemini AI is calling user...');
        Alert.alert('Call Initiated', `Gemini AI is now calling ${user.name}.\n\nThe user will see "Customer care is calling" notification.\n\nGemini will ask their preferred language and respond in that language.`);
      } else {
        setCallStatus('Call failed');
        Alert.alert('Error', 'Failed to initiate call');
      }
    } catch (error) {
      setCallStatus('Call failed');
      Alert.alert('Error', 'Network error');
    }
    setTimeout(() => { setCallingUser(null); setCallStatus(''); }, 3000);
  };

  // Admin Dashboard Screen - matching old app with user cards and call buttons
  const renderAdmin = () => (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.adminHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.adminHeaderTitle}>Admin Dashboard</Text>
      </View>

      {/* Quick Navigation for Admin - Access to Chapters and Progress */}
      <View style={styles.adminQuickNav}>
        <TouchableOpacity 
          style={[styles.adminNavBtn, {backgroundColor: '#8B5CF6'}]} 
          onPress={() => setScreen('home')}
        >
          <Text style={styles.adminNavIcon}>📚</Text>
          <Text style={styles.adminNavText}>View Chapters</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.adminNavBtn, {backgroundColor: '#14B8A6'}]} 
          onPress={() => setScreen('progress')}
        >
          <Text style={styles.adminNavIcon}>📊</Text>
          <Text style={styles.adminNavText}>View Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.adminNavBtn, {backgroundColor: '#F59E0B'}]} 
          onPress={() => setScreen('certificates')}
        >
          <Text style={styles.adminNavIcon}>🏅</Text>
          <Text style={styles.adminNavText}>Certificates</Text>
        </TouchableOpacity>
      </View>

      {/* Remove All Accounts Button */}
      <TouchableOpacity 
        style={{backgroundColor: '#DC2626', borderRadius: 12, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          Alert.alert(
            'Remove All Accounts',
            'Are you sure you want to DELETE ALL USER ACCOUNTS? This will remove all students and their data. Only the admin account will remain. This action CANNOT be undone!',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'DELETE ALL', style: 'destructive', onPress: async () => {
                try {
                  const response = await fetch(`${API_URL}/api/admin/reset-system`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${authToken}` }
                  });
                  if (response.ok) {
                    const data = await response.json();
                    Alert.alert('Success', `Deleted ${data.deleted_count} accounts. Only admin account remains.`);
                    loadAdminDashboard();
                  } else {
                    Alert.alert('Error', 'Failed to delete accounts');
                  }
                } catch (error) {
                  Alert.alert('Error', 'Network error');
                }
              }}
            ]
          );
        }}
      >
        <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 8}}>🗑️ Remove All Accounts</Text>
        <Text style={{color: '#FCA5A5', fontSize: 12}}>(Except Admin)</Text>
      </TouchableOpacity>

      {/* Stats Cards */}
      <View style={styles.adminStatsRow}>
        <View style={[styles.adminStatCard, {backgroundColor: '#8B5CF6'}]}>
          <Text style={styles.adminStatIcon}>👥</Text>
          <Text style={styles.adminStatValue}>{adminStats.total_users || 0}</Text>
          <Text style={styles.adminStatLabel}>Total Users</Text>
        </View>
        <View style={[styles.adminStatCard, {backgroundColor: '#14B8A6'}]}>
          <Text style={styles.adminStatIcon}>🟢</Text>
          <Text style={styles.adminStatValue}>{adminStats.active_users || 0}</Text>
          <Text style={styles.adminStatLabel}>Active (24h)</Text>
        </View>
        <View style={[styles.adminStatCard, {backgroundColor: '#F59E0B'}]}>
          <Text style={styles.adminStatIcon}>💬</Text>
          <Text style={styles.adminStatValue}>{adminStats.message_count || 0}</Text>
          <Text style={styles.adminStatLabel}>Messages</Text>
        </View>
      </View>

      {/* Exam Monitoring Section - See all student screens during exams */}
      <Text style={styles.adminSectionTitle}>Exam Monitoring</Text>
      <View style={{backgroundColor: '#2A2A4E', borderRadius: 12, padding: 16, marginBottom: 16}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Users Taking Exam</Text>
          <View style={{backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12}}>
            <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>LIVE</Text>
          </View>
        </View>
        {(!adminUsers || adminUsers.length === 0) ? (
          <View style={{alignItems: 'center', padding: 20}}>
            <Text style={{fontSize: 40, marginBottom: 10}}>📝</Text>
            <Text style={{color: '#888', fontSize: 14, textAlign: 'center'}}>No students are currently taking exams.</Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {(adminUsers || []).slice(0, 6).map((user, index) => (
              <View key={index} style={{width: '48%', backgroundColor: '#1A1A2E', borderRadius: 8, padding: 10, marginBottom: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                  <View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', marginRight: 8}}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>{(user.name || 'U')[0].toUpperCase()}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}} numberOfLines={1}>{user.name || 'User'}</Text>
                    <Text style={{color: '#14B8A6', fontSize: 10}}>Taking Exam</Text>
                  </View>
                </View>
                <View style={{backgroundColor: '#2A2A4E', height: 60, borderRadius: 6, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: '#666', fontSize: 10}}>Screen Preview</Text>
                  <Text style={{color: '#8B5CF6', fontSize: 14}}>Q{Math.floor(Math.random() * 10) + 1}/10</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {(adminUsers || []).length > 6 && (
          <TouchableOpacity style={{backgroundColor: '#8B5CF6', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8}}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>View All {adminUsers.length} Students</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* User Chats Section - Each user separately with call options */}
      <Text style={styles.adminSectionTitle}>User Chats</Text>
      {(!adminUsers || adminUsers.length === 0) ? (
        <View style={[styles.adminUserCard, {alignItems: 'center', padding: 30}]}>
          <Text style={{fontSize: 40, marginBottom: 10}}>👥</Text>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>No Users Yet</Text>
          <Text style={{color: '#888', fontSize: 14, textAlign: 'center'}}>When students register and use the app, they will appear here.</Text>
        </View>
      ) : null}
      {(adminUsers || []).map((user, index) => (
        <View key={index} style={styles.adminUserCard}>
          {/* User Info Row */}
          <View style={styles.adminUserHeader}>
            <View style={styles.adminUserAvatar}>
              <Text style={styles.adminUserAvatarText}>{(user.name || 'U')[0].toUpperCase()}</Text>
            </View>
            <View style={styles.adminUserInfo}>
              <Text style={styles.adminUserName}>{user.name || 'Unknown User'}</Text>
              <Text style={styles.adminUserEmail}>{user.username}</Text>
              <Text style={styles.adminUserPlatform}>{user.platform?.toUpperCase()} | Last active: {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'N/A'}</Text>
            </View>
            {user.unread_count > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{user.unread_count}</Text>
              </View>
            )}
          </View>

          {/* Last Message Preview */}
          {user.last_message && (
            <View style={styles.lastMessagePreview}>
              <Text style={styles.lastMessageText} numberOfLines={2}>{user.last_message}</Text>
            </View>
          )}

          {/* Call Action Buttons */}
          <View style={styles.adminCallButtons}>
            <TouchableOpacity 
              style={[styles.adminCallBtn, {backgroundColor: '#14B8A6'}]}
              onPress={() => initiateWebRTCCall(user, 'audio')}
            >
              <Text style={styles.adminCallBtnIcon}>📞</Text>
              <Text style={styles.adminCallBtnText}>Voice Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.adminCallBtn, {backgroundColor: '#8B5CF6'}]}
              onPress={() => initiateWebRTCCall(user, 'video')}
            >
              <Text style={styles.adminCallBtnIcon}>📹</Text>
              <Text style={styles.adminCallBtnText}>Video Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.adminCallBtn, {backgroundColor: '#EC4899'}]}
              onPress={() => initiateGeminiCall(user)}
            >
              <Text style={styles.adminCallBtnIcon}>🤖</Text>
              <Text style={styles.adminCallBtnText}>Gemini AI</Text>
            </TouchableOpacity>
          </View>

          {/* Exam Control Actions with Active/Inactive Status */}
          <View style={{marginTop: 10, marginBottom: 5}}>
            <Text style={{color: '#888', fontSize: 12, marginBottom: 8}}>Exam Controls:</Text>
          </View>
          <View style={styles.adminUserActions}>
            <TouchableOpacity 
              style={[styles.adminSmallBtn, {backgroundColor: user.chapters_unlocked ? '#14B8A6' : '#4B5563'}]} 
              onPress={() => {
                adminAction(user.id, 'unlock_all');
                Alert.alert('Unlock', user.chapters_unlocked ? 'All chapters already unlocked' : 'Unlocking all chapters for ' + user.name);
              }}
            >
              <Text style={styles.adminSmallBtnText}>🔓 Unlock</Text>
              <Text style={{color: user.chapters_unlocked ? '#10B981' : '#9CA3AF', fontSize: 10, marginTop: 2}}>
                {user.chapters_unlocked ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.adminSmallBtn, {backgroundColor: '#EF4444'}]} 
              onPress={() => {
                Alert.alert(
                  'Reset Progress',
                  `Are you sure you want to reset all progress for ${user.name}? This cannot be undone.`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Reset', style: 'destructive', onPress: () => adminAction(user.id, 'reset_progress') }
                  ]
                );
              }}
            >
              <Text style={styles.adminSmallBtnText}>🔄 Reset</Text>
              <Text style={{color: '#FCA5A5', fontSize: 10, marginTop: 2}}>ACTIVE</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.adminSmallBtn, {backgroundColor: user.can_retake ? '#8B5CF6' : '#4B5563'}]} 
              onPress={() => {
                adminAction(user.id, 'allow_retake');
                Alert.alert('Retake', 'Allowing ' + user.name + ' to retake exams');
              }}
            >
              <Text style={styles.adminSmallBtnText}>🔁 Retake</Text>
              <Text style={{color: user.can_retake ? '#A78BFA' : '#9CA3AF', fontSize: 10, marginTop: 2}}>
                {user.can_retake ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Additional Actions */}
          <View style={[styles.adminUserActions, {marginTop: 8}]}>
            <TouchableOpacity 
              style={styles.adminSmallBtn} 
              onPress={() => Alert.alert('View Chat', `Opening chat with ${user.name}...`)}
            >
              <Text style={styles.adminSmallBtnText}>💬 View Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.adminSmallBtn, {backgroundColor: '#F59E0B'}]} 
              onPress={() => {
                Alert.alert('Screen Share', user.is_screen_sharing ? 
                  `${user.name} is currently sharing their screen during exam` : 
                  `${user.name} is not currently sharing screen`);
              }}
            >
              <Text style={styles.adminSmallBtnText}>🖥️ Screen</Text>
              <Text style={{color: user.is_screen_sharing ? '#FCD34D' : '#9CA3AF', fontSize: 10, marginTop: 2}}>
                {user.is_screen_sharing ? 'SHARING' : 'OFF'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.adminSmallBtn, {backgroundColor: '#DC2626'}]} 
              onPress={() => {
                Alert.alert(
                  'Remove Account',
                  `Are you sure you want to permanently delete ${user.name}'s account? This will remove all their data and cannot be undone.`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: async () => {
                      await adminAction(user.id, 'delete_account');
                      Alert.alert('Deleted', `${user.name}'s account has been removed`);
                      loadAdminDashboard();
                    }}
                  ]
                );
              }}
            >
              <Text style={styles.adminSmallBtnText}>🗑️ Remove</Text>
              <Text style={{color: '#FCA5A5', fontSize: 10, marginTop: 2}}>ACCOUNT</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Recent Messages Section */}
      <Text style={styles.adminSectionTitle}>Recent Messages</Text>
      {(!adminMessages || adminMessages.length === 0) ? (
        <View style={[styles.adminMessageCard, {alignItems: 'center', padding: 30}]}>
          <Text style={{fontSize: 40, marginBottom: 10}}>💬</Text>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>No Messages Yet</Text>
          <Text style={{color: '#888', fontSize: 14, textAlign: 'center'}}>When students send messages, they will appear here.</Text>
        </View>
      ) : (adminMessages || []).slice(0, 10).map((msg, index) => (
        <View key={index} style={styles.adminMessageCard}>
          <View style={styles.adminMsgHeader}>
            <Text style={styles.adminMsgSender}>{msg.sender_name || 'User'}</Text>
            <Text style={styles.adminMsgTime}>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</Text>
          </View>
          <Text style={styles.adminMsgContent}>{msg.content}</Text>
        </View>
      ))}

      {/* Calling Status Modal */}
      {callingUser && (
        <View style={styles.callingOverlay}>
          <View style={styles.callingCard}>
            <Text style={styles.callingIcon}>🤖</Text>
            <Text style={styles.callingTitle}>Gemini AI Calling</Text>
            <Text style={styles.callingUser}>{callingUser.name}</Text>
            <Text style={styles.callingStatus}>{callStatus}</Text>
            <ActivityIndicator color="#8B5CF6" size="large" style={{marginTop: 16}} />
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      {screen === 'login' && renderLogin()}
      {screen === 'home' && renderHome()}
      {screen === 'chapter' && renderChapter()}
      {screen === 'quiz' && renderQuiz()}
      {screen === 'progress' && renderProgress()}
      {screen === 'certificates' && renderCertificates()}
      {screen === 'chat' && renderChat()}
      {screen === 'aiAssistant' && renderAIAssistant()}
      {screen === 'admin' && renderAdmin()}

      <Modal visible={showNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome to GANITA PRAKASH!</Text>
            <Text style={styles.modalText}>Please enter your name:</Text>
            <TextInput
              style={styles.input}
              value={studentName}
              onChangeText={setStudentName}
              placeholder="Your name"
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={saveName}>
              <Text style={styles.primaryBtnText}>Start Learning</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showProfileModal} transparent animationType="fade" onRequestClose={() => setShowProfileModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 420 }]}>
            <Text style={styles.modalTitle}>Profile</Text>

            {/* Profile picture: avatar with Gallery/Camera buttons. Tapping
                avatar opens gallery. */}
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <TouchableOpacity onPress={() => pickProfilePicture('gallery')} activeOpacity={0.8}>
                {profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: '#00E5FF', backgroundColor: '#222' }}
                  />
                ) : (
                  <View style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: '#00E5FF', backgroundColor: 'rgba(0,229,255,0.12)', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 36, color: '#00E5FF' }}>{(profileNameInput || studentName || '?').trim().charAt(0).toUpperCase() || '?'}</Text>
                  </View>
                )}
                {profilePicUploading && (
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 48 }}>
                    <ActivityIndicator color="#00E5FF" />
                  </View>
                )}
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <TouchableOpacity
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: 'rgba(0,229,255,0.12)', borderWidth: 1, borderColor: '#00E5FF' }}
                  onPress={() => pickProfilePicture('gallery')}
                  disabled={profilePicUploading}
                >
                  <Text style={{ color: '#00E5FF', fontWeight: '600' }}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: 'rgba(0,229,255,0.12)', borderWidth: 1, borderColor: '#00E5FF' }}
                  onPress={() => pickProfilePicture('camera')}
                  disabled={profilePicUploading}
                >
                  <Text style={{ color: '#00E5FF', fontWeight: '600' }}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.modalText, { marginTop: 16 }]}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={profileNameInput}
              onChangeText={setProfileNameInput}
              placeholder="Your name"
              placeholderTextColor="#888"
            />

            <Text style={[styles.modalText, { marginTop: 12 }]}>Class</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {['6', '7'].map((cls) => (
                <TouchableOpacity
                  key={cls}
                  style={[
                    styles.primaryBtn,
                    { flex: 1, backgroundColor: selectedClass === cls ? '#00E5FF' : 'rgba(0,229,255,0.12)', borderWidth: 1, borderColor: '#00E5FF' },
                  ]}
                  onPress={() => {
                    setSelectedClass(cls);
                  }}
                >
                  <Text style={[styles.primaryBtnText, { color: selectedClass === cls ? '#0a0a2e' : '#00E5FF' }]}>Class {cls}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 16, opacity: profileSaving ? 0.6 : 1 }]}
              disabled={profileSaving}
              onPress={async () => {
                const name = (profileNameInput || '').trim();
                if (!name) { Alert.alert('Name required', 'Please enter a display name.'); return; }
                try {
                  setProfileSaving(true);
                  const res = await fetch(API_URL + '/api/user/update-name', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                    body: JSON.stringify({ name }),
                  });
                  if (!res.ok) throw new Error('HTTP ' + res.status);
                  setStudentName(name);
                  try { await AsyncStorage.setItem('studentName', name); } catch (e) {}
                  setShowProfileModal(false);
                } catch (e) {
                  Alert.alert('Error', 'Could not update name. Check your connection.');
                } finally {
                  setProfileSaving(false);
                }
              }}
            >
              <Text style={styles.primaryBtnText}>{profileSaving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 10, backgroundColor: 'rgba(41,121,255,0.15)', borderWidth: 1, borderColor: 'rgba(41,121,255,0.4)' }]}
              onPress={() => setShowPasswordSection(!showPasswordSection)}
            >
              <Text style={[styles.primaryBtnText, { color: '#2979FF' }]}>{showPasswordSection ? 'Hide' : 'Change'} Password</Text>
            </TouchableOpacity>

            {showPasswordSection && (
              <View style={{ marginTop: 10 }}>
                <TextInput
                  style={styles.input}
                  value={currentPasswordInput}
                  onChangeText={setCurrentPasswordInput}
                  placeholder="Current password"
                  placeholderTextColor="#888"
                  secureTextEntry
                />
                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  value={newPasswordInput}
                  onChangeText={setNewPasswordInput}
                  placeholder="New password (min 6 chars)"
                  placeholderTextColor="#888"
                  secureTextEntry
                />
                <TouchableOpacity
                  style={[styles.primaryBtn, { marginTop: 8, opacity: passwordChanging ? 0.6 : 1 }]}
                  disabled={passwordChanging}
                  onPress={async () => {
                    if (!currentPasswordInput || !newPasswordInput) { Alert.alert('Required', 'Enter both passwords.'); return; }
                    if (newPasswordInput.length < 6) { Alert.alert('Too short', 'New password must be at least 6 characters.'); return; }
                    try {
                      setPasswordChanging(true);
                      const res = await fetch(API_URL + '/api/user/change-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                        body: JSON.stringify({ current_password: currentPasswordInput, new_password: newPasswordInput }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) { Alert.alert('Error', data.detail || 'Could not change password'); return; }
                      Alert.alert('Success', 'Password changed successfully.');
                      setCurrentPasswordInput(''); setNewPasswordInput(''); setShowPasswordSection(false);
                    } catch (e) {
                      Alert.alert('Error', 'Network error. Try again.');
                    } finally {
                      setPasswordChanging(false);
                    }
                  }}
                >
                  <Text style={styles.primaryBtnText}>{passwordChanging ? 'Changing...' : 'Update Password'}</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 8, backgroundColor: 'rgba(255,82,82,0.15)', borderWidth: 1, borderColor: 'rgba(255,82,82,0.4)' }]}
              onPress={() => { setShowProfileModal(false); handleLogout(); }}
            >
              <Text style={[styles.primaryBtnText, { color: '#FF5252' }]}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 10, alignItems: 'center' }} onPress={() => setShowProfileModal(false)}>
              <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.resultIcon}>{resultData.passed ? '🎉' : '📚'}</Text>
            <Text style={styles.resultScore}>{resultData.score}/{resultData.total}</Text>
            <Text style={styles.resultPercentage}>{resultData.percentage}%</Text>
            {resultData.isFinal && (
              <Text style={styles.scoreBreakdown}>MCQ: {resultData.mcqScore}/50 | Pen-Paper: {resultData.penPaperScore}/50</Text>
            )}
            <Text style={styles.resultMessage}>
              {resultData.passed ? 
                (resultData.isFinal ? 
                  'Congratulations! You passed the Final Exam!\n\nBe ready for Science Curiosity - Thanks!\n\nWe will update when our new app is available. We will inform you. OK Bye!' :
                  'Congratulations! You passed!\nYou can now proceed to the next chapter.') :
                'Keep trying! You need 80% to pass.\nReview the chapter and try again.'}
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={closeResult}>
              <Text style={styles.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

          {/* Google Sign-In Modal - Works on Android */}
          <Modal visible={showGoogleModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.googleModalContent}>
                <View style={styles.googleModalHeader}>
                  <Text style={styles.googleModalIcon}>G</Text>
                  <Text style={styles.googleModalTitle}>Sign in with Google</Text>
                </View>
                <Text style={styles.googleModalSubtitle}>Enter your Google email address</Text>
                <View style={styles.googleInputContainer}>
                  <Text style={styles.googleInputIcon}>✉️</Text>
                  <TextInput
                    style={styles.googleInput}
                    placeholder="your.email@gmail.com"
                    placeholderTextColor="#666"
                    value={googleEmail}
                    onChangeText={setGoogleEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoFocus={true}
                  />
                </View>
                <View style={styles.googleModalButtons}>
                  <TouchableOpacity 
                    style={styles.googleCancelBtn} 
                    onPress={() => setShowGoogleModal(false)}
                  >
                    <Text style={styles.googleCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.googleContinueBtn} 
                    onPress={processGoogleSignIn}
                  >
                    <Text style={styles.googleContinueBtnText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* New User Registration Modal with DOB */}
          <Modal visible={showRegistrationModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.registrationModalContent}>
                <Text style={styles.registrationTitle}>Complete Your Profile</Text>
                <Text style={styles.registrationSubtitle}>Please provide your details to continue</Text>
            
                <View style={styles.registrationInputContainer}>
                  <Text style={styles.registrationInputLabel}>First Name *</Text>
                  <TextInput
                    style={styles.registrationInput}
                    placeholder="Enter your first name"
                    placeholderTextColor="#666"
                    value={newUserFirstName}
                    onChangeText={setNewUserFirstName}
                  />
                </View>
            
                <View style={styles.registrationInputContainer}>
                  <Text style={styles.registrationInputLabel}>Surname *</Text>
                  <TextInput
                    style={styles.registrationInput}
                    placeholder="Enter your surname"
                    placeholderTextColor="#666"
                    value={newUserSurname}
                    onChangeText={setNewUserSurname}
                  />
                </View>
            
                <View style={styles.registrationInputContainer}>
                  <Text style={styles.registrationInputLabel}>Date of Birth *</Text>
                  <TextInput
                    style={[styles.registrationInput, dobError ? {borderColor: '#EF4444'} : {}]}
                    placeholder="DD / MM / YYYY"
                    placeholderTextColor="#666"
                    value={newUserDOB}
                    onChangeText={formatDOBInput}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  {dobError ? <Text style={{color: '#EF4444', fontSize: 12, marginTop: 4}}>{dobError}</Text> : null}
                  <Text style={{color: '#888', fontSize: 11, marginTop: 4}}>We'll wish you on your birthday!</Text>
                </View>
            
                <TouchableOpacity 
                  style={styles.registrationSubmitBtn}
                  onPress={completeRegistration}
                >
                  <Text style={styles.registrationSubmitBtnText}>Save & Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* In-App WebRTC Call WebView Modal */}
          <Modal visible={showCallWebView} transparent={false} animationType="slide" onRequestClose={() => { setShowCallWebView(false); setCallWebViewHtml(''); setCallWebViewUrl(''); }}>
            <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
              {(callWebViewHtml || callWebViewUrl) ? (
                <WebView
                  source={callWebViewHtml ? { html: callWebViewHtml, baseUrl: API_URL } : { uri: callWebViewUrl }}
                  onMessage={(e) => {
                    try {
                      const msg = JSON.parse(e.nativeEvent.data || '{}');
                      if (msg && msg.type === 'call_ended') {
                        setShowCallWebView(false);
                        setCallWebViewHtml('');
                        setCallWebViewUrl('');
                      }
                    } catch (_) {}
                  }}
                  style={{flex: 1}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  mediaPlaybackRequiresUserAction={false}
                  allowsInlineMediaPlayback={true}
                  allowsProtectedMedia={true}
                  mediaCapturePermissionGrantType={'grant'}
                  originWhitelist={['*']}
                  mixedContentMode={'always'}
                  javaScriptCanOpenWindowsAutomatically={true}
                  thirdPartyCookiesEnabled={true}
                  allowFileAccess={true}
                  allowUniversalAccessFromFileURLs={true}
                  setSupportMultipleWindows={false}
                  onPermissionRequest={(event) => {
                    try { event && event.nativeEvent && event.nativeEvent.grant && event.nativeEvent.grant(event.nativeEvent.resources); } catch(_) {}
                  }}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A2E'}}>
                      <ActivityIndicator size="large" color="#E94560" />
                      <Text style={{color: '#fff', marginTop: 10}}>Connecting call...</Text>
                    </View>
                  )}
                  onError={(e) => {
                    console.log('WebView error:', e);
                    Alert.alert('Connection Error', 'Failed to connect. Please check your internet connection.');
                  }}
                />
              ) : null}
            </SafeAreaView>
          </Modal>

          {/* In-App Local Content WebView Modal (Whiteboard / Fundamentals) */}
          <Modal visible={showLocalWebView} transparent={false} animationType="slide" onRequestClose={() => setShowLocalWebView(false)}>
            <SafeAreaView style={{flex: 1, backgroundColor: '#0a0e27'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#1A1A2E', borderBottomWidth: 1, borderBottomColor: '#16213E'}}>
                <TouchableOpacity onPress={() => { setShowLocalWebView(false); setLocalWebViewHtml(''); }} style={{padding: 8}}>
                  <Text style={{color: '#00d4ff', fontSize: 22}}>‹</Text>
                </TouchableOpacity>
                <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10, flex: 1}}>{localWebViewTitle || 'In-App'}</Text>
                <TouchableOpacity onPress={() => { setShowLocalWebView(false); setLocalWebViewHtml(''); }} style={{padding: 8}}>
                  <Text style={{color: '#fff', fontSize: 18}}>✕</Text>
                </TouchableOpacity>
              </View>
              {localWebViewHtml ? (
                <WebView
                  originWhitelist={['*']}
                  source={{ html: localWebViewHtml, baseUrl: 'about:blank' }}
                  style={{flex: 1, backgroundColor: '#0a0e27'}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowFileAccess={true}
                  allowsInlineMediaPlayback={true}
                  setSupportMultipleWindows={false}
                  onMessage={(event) => {
                    try {
                      var data = JSON.parse(event.nativeEvent.data || '{}');
                      if (data && data.type === 'save_png' && data.data) {
                        // Save base64 PNG to device gallery via expo-file-system + share.
                        (async () => {
                          try {
                            var b64 = String(data.data).split(',')[1] || '';
                            var fileUri = (FileSystem.cacheDirectory || FileSystem.documentDirectory) + 'whiteboard-' + Date.now() + '.png';
                            await FileSystem.writeAsStringAsync(fileUri, b64, { encoding: FileSystem.EncodingType.Base64 });
                            try { await Sharing.shareAsync(fileUri); } catch (_) { Alert.alert('Saved', 'Whiteboard saved to: ' + fileUri); }
                          } catch (e) { Alert.alert('Save failed', String(e && e.message || e)); }
                        })();
                      }
                    } catch (_) {}
                  }}
                />
              ) : (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <ActivityIndicator size="large" color="#00d4ff" />
                </View>
              )}
            </SafeAreaView>
          </Modal>

          {/* Colorful Festival Wish Modal */}
          {showFestivalModal && currentFestival && (
            <Modal visible={true} transparent animationType="fade" onRequestClose={() => setShowFestivalModal(false)}>
              <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{
                  backgroundColor: currentFestival.color || '#FFD700',
                  borderRadius: 24,
                  padding: 32,
                  width: '85%',
                  maxWidth: 340,
                  alignItems: 'center',
                  shadowColor: currentFestival.color || '#FFD700',
                  shadowOffset: {width: 0, height: 0},
                  shadowOpacity: 0.8,
                  shadowRadius: 20,
                  elevation: 20,
                }}>
                  <Text style={{fontSize: 80, marginBottom: 16}}>{currentFestival.emoji}</Text>
                  <Text style={{fontSize: 28, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 12, textShadowColor: 'rgba(255,255,255,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2}}>
                    {currentFestival.name}
                  </Text>
                  <View style={{backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 16, marginBottom: 20}}>
                    <Text style={{fontSize: 18, color: '#000', textAlign: 'center', lineHeight: 26, fontWeight: '500'}}>
                      {currentFestival.wish}
                    </Text>
                  </View>
                  <Text style={{fontSize: 14, color: 'rgba(0,0,0,0.7)', textAlign: 'center', marginBottom: 20}}>
                    - GANITA PRAKASH Team
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setShowFestivalModal(false)}
                    style={{
                      backgroundColor: '#000',
                      paddingHorizontal: 40,
                      paddingVertical: 14,
                      borderRadius: 25,
                    }}
                  >
                    <Text style={{color: currentFestival.color || '#FFD700', fontSize: 18, fontWeight: 'bold'}}>Thank You!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* Native In-App Call UI Modal */}
          {showNativeCall && nativeCallData && (
            <Modal visible={true} transparent={false} animationType="slide" onRequestClose={endNativeCall}>
              <View style={{flex: 1, backgroundColor: '#1A1A2E'}}>
                {/* Call Header */}
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60}}>
                  <View style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: nativeCallData.callType === 'video' ? '#8B5CF6' : '#10B981',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 24,
                    shadowColor: nativeCallData.callType === 'video' ? '#8B5CF6' : '#10B981',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.6,
                    shadowRadius: 20,
                    elevation: 10,
                  }}>
                    <Text style={{fontSize: 50}}>{nativeCallData.callType === 'video' ? '📹' : '📞'}</Text>
                  </View>
                  <Text style={{fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8}}>
                    {nativeCallData.callerName}
                  </Text>
                  <Text style={{fontSize: 16, color: '#8B5CF6', marginBottom: 16}}>
                    GANITA PRAKASH Admin
                  </Text>
                  <View style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#10B981',
                  }}>
                    <Text style={{fontSize: 24, color: '#10B981', fontWeight: 'bold'}}>
                      {formatCallDuration(callDuration)}
                    </Text>
                  </View>
                  <Text style={{fontSize: 14, color: '#888', marginTop: 16}}>
                    {nativeCallData.callType === 'video' ? 'Video Call Connected' : 'Voice Call Connected'}
                  </Text>
                </View>
                
                {/* Call Controls */}
                <View style={{paddingBottom: 60, paddingHorizontal: 40}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30}}>
                    <TouchableOpacity style={{alignItems: 'center'}}>
                      <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 24}}>🔇</Text>
                      </View>
                      <Text style={{color: '#888', marginTop: 8, fontSize: 12}}>Mute</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: 'center'}}>
                      <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 24}}>🔊</Text>
                      </View>
                      <Text style={{color: '#888', marginTop: 8, fontSize: 12}}>Speaker</Text>
                    </TouchableOpacity>
                    {nativeCallData.callType === 'video' && (
                      <TouchableOpacity style={{alignItems: 'center'}}>
                        <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontSize: 24}}>🔄</Text>
                        </View>
                        <Text style={{color: '#888', marginTop: 8, fontSize: 12}}>Flip</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {/* End Call Button */}
                  <TouchableOpacity 
                    onPress={endNativeCall}
                    style={{
                      backgroundColor: '#EF4444',
                      paddingVertical: 18,
                      borderRadius: 30,
                      alignItems: 'center',
                      shadowColor: '#EF4444',
                      shadowOffset: {width: 0, height: 4},
                      shadowOpacity: 0.4,
                      shadowRadius: 10,
                      elevation: 8,
                    }}
                  >
                    <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>End Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* Incoming Call Modal */}
          {incomingCall && (
            <Modal visible={true} transparent animationType="fade">
              <View style={styles.incomingCallOverlay}>
                <View style={styles.incomingCallCard}>
                  <Text style={styles.incomingCallIcon}>{incomingCall.callType === 'video' ? '📹' : '📞'}</Text>
                  <Text style={styles.incomingCallTitle}>Incoming {incomingCall.callType === 'video' ? 'Video' : 'Voice'} Call</Text>
                  <Text style={styles.incomingCallName}>{incomingCall.callerName}</Text>
                  <Text style={styles.incomingCallSubtitle}>GANITA PRAKASH Admin</Text>
                  
                  <View style={styles.incomingCallButtons}>
                    <TouchableOpacity style={styles.declineCallBtn} onPress={declineCall}>
                      <Text style={styles.declineCallIcon}>✕</Text>
                      <Text style={styles.declineCallText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.answerCallBtn} onPress={answerCall}>
                      <Text style={styles.answerCallIcon}>✓</Text>
                      <Text style={styles.answerCallText}>Answer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </SafeAreaView>
  );
}

// SCI-FI DEEP SPACE THEME - 2040 UI
// Colors: Deep Space Black (#05070D), Cyan Energy (#00E5FF), Electric Blue (#2979FF), Violet Plasma (#8E24AA)
const styles = StyleSheet.create({
  // Base - Deep Space Theme
  safeArea: { flex: 1, backgroundColor: '#05070D' },
  container: { flex: 1, backgroundColor: '#05070D', padding: 16, paddingTop: 40 },
  
  // Home Header - Sci-Fi Command Bridge Style
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingHorizontal: 4 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  userAvatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 2, borderColor: '#00E5FF', justifyContent: 'center', alignItems: 'center', marginRight: 14, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 },
  userAvatarText: { fontSize: 20, fontWeight: 'bold', color: '#00E5FF', textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  welcomeText: { fontSize: 11, color: '#00E5FF', fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  userClass: { fontSize: 10, color: 'rgba(0,229,255,0.7)', letterSpacing: 1, marginTop: 2 },
  headerIcons: { flexDirection: 'row', gap: 14 },
  headerIconBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(41,121,255,0.15)', borderWidth: 1, borderColor: 'rgba(41,121,255,0.5)', justifyContent: 'center', alignItems: 'center', shadowColor: '#2979FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  headerIcon: { fontSize: 20 },
  headerIconText: { fontSize: 18, fontWeight: 'bold', color: '#2979FF' },

  // Stats Row - Holographic Glass Panels
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  statBox: { flex: 1, borderRadius: 16, padding: 18, alignItems: 'center', backgroundColor: 'rgba(0,229,255,0.08)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
  statIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10, backgroundColor: 'rgba(0,229,255,0.2)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.4)' },
  statIconText: { fontSize: 16, fontWeight: 'bold', color: '#00E5FF' },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#fff', textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  statLabel: { fontSize: 11, color: 'rgba(0,229,255,0.7)', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' },
  
  // Progress Card - Glassmorphism Panel
  progressCard: { backgroundColor: 'rgba(142,36,170,0.12)', borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(142,36,170,0.3)', shadowColor: '#8E24AA', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  progressTitle: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)', letterSpacing: 1, textTransform: 'uppercase' },
  progressPercent: { fontSize: 20, fontWeight: 'bold', color: '#00E5FF', textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(0,229,255,0.15)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#00E5FF', borderRadius: 3, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6 },
  progressSubtext: { fontSize: 11, color: 'rgba(0,229,255,0.6)', marginTop: 10, letterSpacing: 0.5 },
  
  // Section Title - Holographic Text
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#00E5FF', marginBottom: 18, marginTop: 12, letterSpacing: 2, textTransform: 'uppercase', textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  
  // Continue Learning Card - Cosmic Sector Card
  continueCard: { backgroundColor: 'rgba(41,121,255,0.15)', borderRadius: 20, padding: 22, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(41,121,255,0.4)', shadowColor: '#2979FF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  continueChapter: { fontSize: 11, color: '#00E5FF', letterSpacing: 1, textTransform: 'uppercase' },
  continueTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginVertical: 6, letterSpacing: 0.5 },
  continueInfo: { fontSize: 11, color: 'rgba(0,229,255,0.7)', letterSpacing: 0.5 },
  playIcon: { fontSize: 28, color: '#00E5FF', backgroundColor: 'rgba(0,229,255,0.2)', width: 56, height: 56, borderRadius: 28, textAlign: 'center', lineHeight: 56, borderWidth: 2, borderColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 12 },
  
  // Quick Actions Grid - Command Nodes
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  quickActionCard: { width: '48%', borderRadius: 18, padding: 18, marginBottom: 14, backgroundColor: 'rgba(0,229,255,0.08)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.25)', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 4 },
  quickActionIcon: { fontSize: 28, marginBottom: 8 },
  quickActionIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.4)', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  quickActionIconText: { fontSize: 18, fontWeight: 'bold', color: '#00E5FF' },
  quickActionTitle: { fontSize: 13, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  quickActionSubtitle: { fontSize: 11, color: 'rgba(0,229,255,0.6)', marginTop: 4 },
  
  // Bottom Actions - Holographic Buttons
  bottomActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  bottomActionBtn: { backgroundColor: 'rgba(142,36,170,0.15)', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(142,36,170,0.4)' },
  bottomActionText: { color: '#8E24AA', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  
  // Chapter Card - Cosmic Sector (Planet-like)
  chapterCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(41,121,255,0.1)', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(41,121,255,0.25)', shadowColor: '#2979FF', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  chapterLocked: { opacity: 0.5, backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' },
  chapterNumberBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 2, borderColor: '#00E5FF', justifyContent: 'center', alignItems: 'center', marginRight: 16, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8 },
  chapterNumberCompleted: { backgroundColor: 'rgba(0,230,118,0.2)', borderColor: '#00E676' },
  chapterNumber: { fontSize: 18, fontWeight: 'bold', color: '#00E5FF', textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  chapterInfo: { flex: 1 },
  chapterTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 4, letterSpacing: 0.3 },
  chapterMeta: { fontSize: 11, color: 'rgba(0,229,255,0.6)', letterSpacing: 0.5 },
  chapterRight: { alignItems: 'flex-end' },
  lockIcon: { fontSize: 22, color: '#FF5252' },
  lockIconSmall: { fontSize: 18, color: '#FF5252' },
  chapterNumberLocked: { backgroundColor: 'rgba(255,82,82,0.15)', borderColor: '#FF5252' },
  chapterTitleLocked: { color: 'rgba(255,255,255,0.4)' },
  chapterMetaLocked: { color: 'rgba(255,82,82,0.6)' },
  checkIcon: { fontSize: 20, color: '#00E676', fontWeight: 'bold', textShadowColor: '#00E676', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  arrowIcon: { fontSize: 24, color: '#00E5FF' },
  scoreText: { fontSize: 10, color: 'rgba(0,229,255,0.5)', marginTop: 4, letterSpacing: 0.5 },
  
  // Back Button - Holographic Navigation
  backBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0,229,255,0.12)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.4)', justifyContent: 'center', alignItems: 'center', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 8 },
  backArrow: { fontSize: 22, color: '#00E5FF' },
  backBtnText: { color: '#00E5FF', fontSize: 14, marginLeft: 10, letterSpacing: 1 },
  
  // Chapter Detail Header - Cosmic Sector Info
  chapterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  chapterHeaderInfo: { marginLeft: 18 },
  chapterLabel: { fontSize: 10, color: '#00E5FF', letterSpacing: 2, textTransform: 'uppercase' },
  chapterHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5, marginTop: 4 },
  chapterMetaInfo: { fontSize: 12, color: 'rgba(0,229,255,0.6)', marginBottom: 24, letterSpacing: 0.5 },
  
  // Tabs - Holographic Segment Control
  tabsContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,229,255,0.08)', borderRadius: 16, padding: 5, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: 'rgba(0,229,255,0.2)', borderWidth: 1, borderColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8 },
  tabText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: 1 },
  tabTextActive: { color: '#00E5FF', fontWeight: 'bold', textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  
  // Topic Card - Universal Law Node
  topicCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(142,36,170,0.1)', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(142,36,170,0.25)' },
  topicCardExpanded: { backgroundColor: 'rgba(0,229,255,0.12)', borderColor: '#00E5FF', borderWidth: 1, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
  topicNumberBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(142,36,170,0.2)', borderWidth: 1, borderColor: 'rgba(142,36,170,0.5)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  topicNumber: { fontSize: 16, fontWeight: 'bold', color: '#8E24AA' },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 6, letterSpacing: 0.3 },
  topicDesc: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4, lineHeight: 20 },
  topicDescExpanded: { color: 'rgba(0,229,255,0.9)', lineHeight: 24 },
  tapToCollapse: { fontSize: 10, color: '#00E5FF', marginTop: 10, letterSpacing: 1, textTransform: 'uppercase' },
  topicMeta: { fontSize: 10, color: '#00E676', letterSpacing: 0.5 },
  topicArrow: { fontSize: 24, color: '#8E24AA' },
  topicContent: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 22 },
  
  // Resources Grid - Data Module Cards
  resourcesGrid: { gap: 14 },
  resourceCard: { borderRadius: 18, padding: 22, marginBottom: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(41,121,255,0.12)', borderWidth: 1, borderColor: 'rgba(41,121,255,0.3)', shadowColor: '#2979FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 },
  resourceCardIcon: { fontSize: 32, marginRight: 18 },
  resourceCardTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff', flex: 1, letterSpacing: 0.3 },
  resourceCardSubtitle: { fontSize: 11, color: 'rgba(0,229,255,0.6)', position: 'absolute', bottom: 22, left: 72, letterSpacing: 0.5 },
  resourceCardAction: { fontSize: 22, color: '#00E5FF' },
  
  // Exam Bar - Mission Control Panel
  examBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,82,82,0.12)', borderRadius: 18, padding: 18, marginTop: 24, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,82,82,0.3)' },
  examBarTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  examBarSubtitle: { fontSize: 11, color: 'rgba(255,82,82,0.7)', letterSpacing: 0.5 },
  startExamBtn: { backgroundColor: 'rgba(255,82,82,0.2)', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 30, borderWidth: 1, borderColor: '#FF5252' },
  startExamBtnText: { color: '#FF5252', fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },
  primaryBtn: { backgroundColor: 'rgba(0,229,255,0.2)', padding: 16, borderRadius: 30, alignItems: 'center', marginVertical: 24, borderWidth: 1, borderColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10 },
  primaryBtnText: { color: '#00E5FF', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  btnDisabled: { opacity: 0.4 },
  progressContainer: { backgroundColor: 'rgba(0,229,255,0.1)', borderRadius: 8, height: 8, marginVertical: 12, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#00E5FF', borderRadius: 8, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6 },
  progressText: { textAlign: 'center', color: '#00E5FF', marginBottom: 16, fontSize: 12, letterSpacing: 1 },
  questionCard: { backgroundColor: 'rgba(41,121,255,0.1)', borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(41,121,255,0.25)' },
  questionNumber: { color: '#00E5FF', fontSize: 10, marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' },
  questionText: { fontSize: 16, color: '#fff', marginBottom: 20, lineHeight: 26 },
  option: { padding: 16, backgroundColor: 'rgba(0,229,255,0.08)', borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  optionSelected: { backgroundColor: 'rgba(0,229,255,0.2)', borderColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 8 },
  optionText: { color: '#fff', fontSize: 14 },
  progressCard: { flexDirection: 'row', backgroundColor: 'rgba(41,121,255,0.08)', padding: 16, borderRadius: 14, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(41,121,255,0.2)' },
  progressChapterNum: { fontSize: 22, fontWeight: 'bold', color: '#00E5FF', marginRight: 16, width: 40, textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  progressChapterInfo: { flex: 1 },
  progressChapterTitle: { fontSize: 13, color: '#fff', marginBottom: 6, letterSpacing: 0.3 },
  emptyState: { alignItems: 'center', padding: 60 },
  emptyIcon: { fontSize: 50, marginBottom: 24 },
  emptyText: { color: 'rgba(0,229,255,0.6)', textAlign: 'center', fontSize: 14, letterSpacing: 0.5 },
  certificate: { backgroundColor: 'rgba(0,230,118,0.1)', padding: 26, borderRadius: 20, marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,230,118,0.3)' },
  certTitle: { fontSize: 18, fontWeight: 'bold', color: '#00E676', marginBottom: 14, textAlign: 'center', letterSpacing: 1, textShadowColor: '#00E676', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  certText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginVertical: 5 },
  certName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginVertical: 10, borderBottomWidth: 2, borderBottomColor: '#00E676', paddingBottom: 6 },
  certDate: { fontSize: 11, color: 'rgba(0,230,118,0.7)', marginTop: 10, letterSpacing: 0.5 },
  finalMessage: { marginTop: 14, padding: 14, backgroundColor: 'rgba(0,230,118,0.15)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,230,118,0.3)' },
  finalMessageText: { color: '#00E676', fontWeight: 'bold', fontSize: 14, textAlign: 'center', letterSpacing: 0.5 },
  goodbyeText: { color: 'rgba(0,230,118,0.7)', textAlign: 'center', marginTop: 10, fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(5,7,13,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'rgba(41,121,255,0.1)', padding: 28, borderRadius: 24, width: '88%', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(41,121,255,0.3)', shadowColor: '#2979FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#00E5FF', marginBottom: 14, textAlign: 'center', letterSpacing: 1, textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  modalText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 14 },
  input: { backgroundColor: 'rgba(0,229,255,0.1)', borderRadius: 14, padding: 14, width: '100%', color: '#fff', fontSize: 14, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(0,229,255,0.3)' },
  resultIcon: { fontSize: 56, marginBottom: 14 },
  resultScore: { fontSize: 36, fontWeight: 'bold', color: '#00E5FF', textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  resultPercentage: { fontSize: 24, color: '#00E5FF', marginBottom: 14 },
  resultMessage: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  scoreBreakdown: { fontSize: 13, color: 'rgba(0,229,255,0.7)', marginBottom: 12 },
  examInfo: { fontSize: 13, color: 'rgba(255,82,82,0.8)', marginBottom: 16, textAlign: 'center' },
  textArea: { backgroundColor: 'rgba(0,229,255,0.08)', borderRadius: 14, padding: 14, color: '#fff', fontSize: 14, minHeight: 110, textAlignVertical: 'top', marginTop: 12, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  // Login styles - Deep Space Authentication Portal
  loginContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 30, paddingHorizontal: 24 },
  loginLogoContainer: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden', marginBottom: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A2E', borderWidth: 2, borderColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 16 },
  loginLogo: { width: 96, height: 96, borderRadius: 48, resizeMode: 'cover' },
  loginTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4, letterSpacing: 2.5, textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  loginSubtitle: { fontSize: 11, color: '#00E5FF', marginBottom: 22, letterSpacing: 1.8, textTransform: 'uppercase' },
  loginCard: { width: '100%', maxWidth: 400, backgroundColor: 'rgba(41,121,255,0.08)', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: 'rgba(41,121,255,0.25)', shadowColor: '#2979FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20 },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10, letterSpacing: 1 },
  welcomeSubtitle: { fontSize: 13, color: 'rgba(0,229,255,0.7)', marginBottom: 28, letterSpacing: 0.5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,229,255,0.08)', borderRadius: 16, paddingHorizontal: 18, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  inputIcon: { fontSize: 18, marginRight: 14, color: '#00E5FF' },
  loginInput: { flex: 1, paddingVertical: 18, color: '#fff', fontSize: 15 },
  showPasswordBtn: { padding: 10 },
  showPasswordIcon: { fontSize: 18, color: '#00E5FF' },
  signInBtn: { backgroundColor: 'rgba(0,229,255,0.2)', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12 },
  signInBtnText: { color: '#00E5FF', fontSize: 15, fontWeight: 'bold', letterSpacing: 2 },
  switchAuthText: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 24, fontSize: 13 },
  switchAuthLink: { color: '#00E5FF', fontWeight: 'bold' },
  // Google Sign-In styles - Holographic Button
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,229,255,0.2)' },
  dividerText: { paddingHorizontal: 18, color: 'rgba(0,229,255,0.6)', fontSize: 12, letterSpacing: 1 },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,82,82,0.15)', paddingVertical: 18, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,82,82,0.5)' },
  googleIcon: { fontSize: 16, fontWeight: 'bold', backgroundColor: '#FF5252', color: '#fff', width: 30, height: 30, borderRadius: 15, textAlign: 'center', lineHeight: 30, marginRight: 12 },
  googleBtnText: { color: '#FF5252', fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  logoutBtn: { padding: 10 },
  logoutText: { color: '#FF5252', fontSize: 13, letterSpacing: 0.5 },
  // Action row styles - Holographic Controls
  actionRow: { flexDirection: 'row', marginBottom: 18 },
  actionBtn: { flex: 1, backgroundColor: 'rgba(0,229,255,0.1)', padding: 14, borderRadius: 12, marginHorizontal: 5, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,229,255,0.25)' },
  actionBtnText: { color: '#00E5FF', fontWeight: 'bold', letterSpacing: 0.5 },
  // Resources styles - Data Module Section
  resourcesSection: { backgroundColor: 'rgba(142,36,170,0.1)', borderRadius: 16, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(142,36,170,0.25)' },
  resourcesTitle: { fontSize: 14, fontWeight: 'bold', color: '#8E24AA', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' },
  resourcesRow: { flexDirection: 'row', justifyContent: 'space-around' },
  resourceBtn: { alignItems: 'center', padding: 14 },
  resourceBtnIcon: { fontSize: 26, color: '#00E5FF', marginBottom: 6, fontWeight: 'bold' },
  resourceBtnText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5 },
  resourcesModal: { backgroundColor: 'rgba(5,7,13,0.98)', borderRadius: 20, padding: 20, width: '92%', maxHeight: '85%', borderWidth: 1, borderColor: 'rgba(0,229,255,0.3)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  closeBtn: { fontSize: 22, color: '#00E5FF', padding: 10 },
  // 3D Model styles - Holographic Viewer
  modelCard: { flexDirection: 'row', backgroundColor: 'rgba(41,121,255,0.1)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(41,121,255,0.25)' },
  modelIcon: { width: 54, height: 54, backgroundColor: 'rgba(0,229,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00E5FF' },
  modelIconText: { color: '#00E5FF', fontWeight: 'bold' },
  modelInfo: { flex: 1, marginLeft: 14 },
  modelName: { fontSize: 14, fontWeight: 'bold', color: '#fff', letterSpacing: 0.3 },
  modelDesc: { fontSize: 11, color: 'rgba(0,229,255,0.6)', marginTop: 4 },
  modelViewerModal: { backgroundColor: 'rgba(5,7,13,0.98)', borderRadius: 20, padding: 20, width: '92%', borderWidth: 1, borderColor: 'rgba(0,229,255,0.3)' },
  modelViewer: { alignItems: 'center', padding: 24 },
  model3DPlaceholder: { width: 220, height: 220, backgroundColor: 'rgba(0,229,255,0.1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 16 },
  model3DText: { fontSize: 52, color: '#00E5FF', fontWeight: 'bold', textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  model3DType: { fontSize: 12, color: 'rgba(0,229,255,0.6)', letterSpacing: 1 },
  modelDescription: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 10 },
  modelNote: { fontSize: 11, color: 'rgba(0,229,255,0.5)', textAlign: 'center' },
  // Chat styles - Dark Glass Communication Panel
  chatList: { flex: 1, marginBottom: 18 },
  chatMessage: { backgroundColor: 'rgba(41,121,255,0.1)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(41,121,255,0.2)' },
  chatSender: { fontSize: 11, color: '#00E5FF', fontWeight: 'bold', letterSpacing: 0.5 },
  chatContent: { fontSize: 14, color: '#fff', marginVertical: 6 },
  chatTime: { fontSize: 9, color: 'rgba(0,229,255,0.5)', letterSpacing: 0.5 },
  chatInputContainer: { flexDirection: 'row', alignItems: 'center' },
  chatInput: { flex: 1, backgroundColor: 'rgba(0,229,255,0.08)', borderRadius: 14, padding: 14, color: '#fff', marginRight: 10, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  sendBtn: { backgroundColor: 'rgba(0,229,255,0.2)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#00E5FF' },
  sendBtnText: { color: '#00E5FF', fontWeight: 'bold' },
  // AI Assistant styles - Neural Interface
  aiSubtitle: { fontSize: 12, color: 'rgba(0,229,255,0.6)', marginBottom: 18, letterSpacing: 0.5 },
  aiMessage: { borderRadius: 16, padding: 14, marginBottom: 10, maxWidth: '82%' },
  userMessage: { backgroundColor: 'rgba(142,36,170,0.2)', alignSelf: 'flex-end', borderWidth: 1, borderColor: 'rgba(142,36,170,0.4)' },
  assistantMessage: { backgroundColor: 'rgba(0,229,255,0.1)', alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(0,229,255,0.25)' },
  aiMessageText: { fontSize: 14, color: '#fff' },
  userMessageText: { color: '#fff' },
  // Language Selector styles - Neural Language Matrix
  languageSelector: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  languageTitle: { fontSize: 18, fontWeight: 'bold', color: '#00E5FF', textAlign: 'center', marginBottom: 12, letterSpacing: 1, textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  languageSubtitle: { fontSize: 12, color: 'rgba(0,229,255,0.6)', textAlign: 'center', marginBottom: 36, letterSpacing: 0.5 },
  languageGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  languageBtn: { backgroundColor: 'rgba(0,229,255,0.08)', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 30, margin: 6, minWidth: 110, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  languageBtnSelected: { backgroundColor: 'rgba(0,229,255,0.2)', borderColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10 },
  languageBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  languageBtnTextSelected: { color: '#00E5FF', fontWeight: 'bold' },
  selectedLangBadge: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,229,255,0.1)', padding: 12, borderRadius: 12, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(0,229,255,0.25)' },
  selectedLangText: { color: '#00E5FF', fontSize: 13, letterSpacing: 0.5 },
  changeLangText: { color: '#00E5FF', fontSize: 13, fontWeight: 'bold', textDecorationLine: 'underline' },
  // Chat styles - Connect with Master (Space Communication)
  chatHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  chatHeaderIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 2, borderColor: '#00E5FF', justifyContent: 'center', alignItems: 'center', marginLeft: 14, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10 },
  chatHeaderIconText: { fontSize: 24 },
  chatHeaderInfo: { marginLeft: 14, flex: 1 },
  chatHeaderTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  chatHeaderSubtitle: { fontSize: 11, color: 'rgba(0,229,255,0.6)', letterSpacing: 0.5 },
  chatInfoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(41,121,255,0.12)', borderRadius: 14, padding: 14, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(41,121,255,0.25)' },
  chatInfoIcon: { fontSize: 16, marginRight: 10 },
  chatInfoText: { flex: 1, fontSize: 11, color: 'rgba(0,229,255,0.7)', letterSpacing: 0.3 },
  chatBubble: { borderRadius: 18, padding: 14, marginBottom: 12, maxWidth: '82%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  userBubble: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end', borderBottomRightRadius: 4, borderTopRightRadius: 18, borderTopLeftRadius: 18, borderBottomLeftRadius: 18, marginLeft: 40 },
  adminBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderTopRightRadius: 18, borderTopLeftRadius: 18, borderBottomRightRadius: 18, marginRight: 40 },
  adminLabel: { fontSize: 11, color: '#075E54', fontWeight: 'bold', marginBottom: 6, letterSpacing: 0.5 },
  chatBubbleText: { fontSize: 15, color: '#303030', lineHeight: 20 },
  adminBubbleText: { color: '#303030' },
  userBubbleText: { color: '#303030' },
  chatBubbleTime: { fontSize: 10, color: 'rgba(0,0,0,0.45)', marginTop: 6, textAlign: 'right', letterSpacing: 0.3 },
  chatInputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,229,255,0.08)', borderRadius: 30, padding: 5, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  chatMediaBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,229,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  chatMediaIcon: { fontSize: 18, color: '#00E5FF' },
  chatInputField: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', fontSize: 14 },
  chatMicBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,229,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  chatMicIcon: { fontSize: 16, color: '#00E5FF' },
  chatSendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,229,255,0.2)', borderWidth: 1, borderColor: '#00E5FF', justifyContent: 'center', alignItems: 'center' },
  chatSendIcon: { fontSize: 18, color: '#00E5FF' },
  emptyText:{ color: 'rgba(0,229,255,0.5)', textAlign: 'center', fontSize: 13, marginTop: 50, letterSpacing: 0.5 },
  
  // Admin Dashboard styles - Command Center
  adminHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  adminHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginLeft: 18, letterSpacing: 1 },
  adminStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  adminStatCard: { flex: 1, borderRadius: 18, padding: 18, alignItems: 'center', backgroundColor: 'rgba(0,229,255,0.08)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  adminStatIcon: { fontSize: 26, marginBottom: 6 },
  adminStatValue: { fontSize: 26, fontWeight: 'bold', color: '#fff', textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  adminStatLabel: { fontSize: 10, color: 'rgba(0,229,255,0.7)', letterSpacing: 1, textTransform: 'uppercase' },
  adminSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#00E5FF', marginTop: 20, marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' },
  adminUserCard: { backgroundColor: 'rgba(41,121,255,0.1)', borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(41,121,255,0.25)' },
  adminUserHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  adminUserAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(0,229,255,0.15)', borderWidth: 2, borderColor: '#00E5FF', justifyContent: 'center', alignItems: 'center' },
  adminUserAvatarText: { fontSize: 20, fontWeight: 'bold', color: '#00E5FF' },
  adminUserInfo: { flex: 1, marginLeft: 14 },
  adminUserName: { fontSize: 15, fontWeight: 'bold', color: '#fff', letterSpacing: 0.3 },
  adminUserEmail: { fontSize: 11, color: 'rgba(0,229,255,0.6)', letterSpacing: 0.3 },
  adminUserPlatform: { fontSize: 10, color: 'rgba(0,229,255,0.4)', letterSpacing: 0.5 },
  unreadBadge: { backgroundColor: 'rgba(255,82,82,0.2)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#FF5252' },
  unreadBadgeText: { color: '#FF5252', fontSize: 11, fontWeight: 'bold' },
  lastMessagePreview: { backgroundColor: 'rgba(0,229,255,0.06)', borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(0,229,255,0.15)' },
  lastMessageText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  adminCallButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, gap: 10 },
  adminCallBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingVertical: 14, backgroundColor: 'rgba(0,229,255,0.1)', borderWidth: 1, borderColor: 'rgba(0,229,255,0.3)' },
  adminCallBtnIcon: { fontSize: 16, marginRight: 8, color: '#00E5FF' },
  adminCallBtnText: { color: '#00E5FF', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  adminUserActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  adminSmallBtn: { backgroundColor: 'rgba(142,36,170,0.15)', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(142,36,170,0.3)' },
  adminSmallBtnText: { color: '#8E24AA', fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  adminMessageCard: { backgroundColor: 'rgba(0,229,255,0.08)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  adminMsgHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  adminMsgSender: { fontSize: 11, color: '#00E5FF', fontWeight: 'bold', letterSpacing: 0.5 },
  adminMsgContent: { fontSize: 13, color: '#fff' },
  adminMsgTime: { fontSize: 9, color: 'rgba(0,229,255,0.5)', letterSpacing: 0.5 },
  callingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5,7,13,0.95)', justifyContent: 'center', alignItems: 'center' },
  callingCard: { backgroundColor: 'rgba(41,121,255,0.1)', borderRadius: 24, padding: 36, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(41,121,255,0.3)', shadowColor: '#2979FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20 },
  callingIcon: { fontSize: 52, marginBottom: 20 },
  callingTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10, letterSpacing: 1 },
  callingUser: { fontSize: 16, color: '#00E5FF', marginBottom: 10, textShadowColor: '#00E5FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  callingStatus: { fontSize: 13, color: 'rgba(0,229,255,0.6)', letterSpacing: 0.5 },
  
  // Admin Quick Navigation styles - Command Nodes
  adminQuickNav: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 6 },
  adminNavBtn: { flex: 1, borderRadius: 16, padding: 18, marginHorizontal: 5, alignItems: 'center', backgroundColor: 'rgba(142,36,170,0.1)', borderWidth: 1, borderColor: 'rgba(142,36,170,0.25)' },
  adminNavIcon: { fontSize: 26, marginBottom: 10 },
  adminNavText: { color: '#8E24AA', fontSize: 11, fontWeight: '600', textAlign: 'center', letterSpacing: 0.5 },
  
  // Legacy admin styles - Updated
  statsRow: { flexDirection: 'row', marginBottom: 18 },
  statCard: { flex: 1, backgroundColor: 'rgba(0,229,255,0.08)', borderRadius: 14, padding: 18, marginHorizontal: 5, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#E94560' },
  platformStat: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, marginBottom: 8 },
  platformName: { color: '#fff', fontWeight: 'bold' },
  platformCount: { color: '#888' },
  adminMessage: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, marginBottom: 8 },
  userCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, marginBottom: 8 },
  userInfo: { marginBottom: 8 },
  userUsername: { fontSize: 12, color: '#888' },
  userPlatform: { fontSize: 12, color: '#666' },
  userActions: { flexDirection: 'row' },
  adminActionBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, padding: 8, marginRight: 8 },
  adminActionText: { color: '#fff', fontSize: 12 },
  
  // Google Sign-In Modal styles (NO BORDERS)
  googleModalContent: { backgroundColor: '#1A1A2E', borderRadius: 20, padding: 24, width: '85%', maxWidth: 340, alignItems: 'center' },
  googleModalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  googleModalIcon: { fontSize: 24, fontWeight: 'bold', backgroundColor: '#EF4444', color: '#fff', width: 40, height: 40, borderRadius: 20, textAlign: 'center', lineHeight: 40, marginRight: 12 },
  googleModalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  googleModalSubtitle: { fontSize: 14, color: '#888', marginBottom: 20, textAlign: 'center' },
  googleInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 16, width: '100%', marginBottom: 20 },
  googleInputIcon: { fontSize: 18, marginRight: 12 },
  googleInput: { flex: 1, paddingVertical: 14, color: '#fff', fontSize: 15 },
  googleModalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12 },
  googleCancelBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  googleCancelBtnText: { color: '#888', fontSize: 15, fontWeight: '600' },
  googleContinueBtn: { flex: 1, backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  googleContinueBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  
  // New User Registration Modal styles (NO BORDERS)
  registrationModalContent: { backgroundColor: '#1A1A2E', borderRadius: 20, padding: 24, width: '90%', maxWidth: 380 },
  registrationTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  registrationSubtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },
  registrationInputContainer: { marginBottom: 16 },
  registrationInputLabel: { fontSize: 14, color: '#888', marginBottom: 8 },
  registrationInput: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#fff', fontSize: 15 },
  registrationSubmitBtn: { backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  registrationSubmitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  registrationSkipBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  registrationSkipBtnText: { color: '#666', fontSize: 14 },
  
  // Speaker button for AI messages
  speakerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(139, 92, 246, 0.3)', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, marginTop: 10, alignSelf: 'flex-start' },
  speakerBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  
  // Incoming Call Modal styles
  incomingCallOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  incomingCallCard: { backgroundColor: '#1A1A2E', borderRadius: 24, padding: 32, width: '85%', maxWidth: 340, alignItems: 'center' },
  incomingCallIcon: { fontSize: 64, marginBottom: 16 },
  incomingCallTitle: { fontSize: 18, color: '#888', marginBottom: 8 },
  incomingCallName: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  incomingCallSubtitle: { fontSize: 14, color: '#8B5CF6', marginBottom: 32 },
  incomingCallButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  declineCallBtn: { backgroundColor: '#EF4444', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  declineCallIcon: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  declineCallText: { fontSize: 12, color: '#fff', marginTop: 4 },
  answerCallBtn: { backgroundColor: '#22C55E', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  answerCallIcon: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  answerCallText: { fontSize: 12, color: '#fff', marginTop: 4 },
});

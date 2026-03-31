# Testing Ganita Prakash App

## Overview
Ganita Prakash is a math learning app with both a web app (Firebase-hosted) and a React Native APK. The web app and APK share the same core JS codebase.

## Web App Testing

### URLs
- **Main web app**: https://ganita-prakash-math-learning.web.app
- **Showcase site**: https://ganita-prakash-ncert-showcase.web.app
- **Backend API**: https://app-wjhbjpii.fly.dev (FastAPI on Fly.io)

### Login
- The app uses Firebase Authentication (Google Sign-In + email/password)
- Admin account: logged in as "Master Admin" - auto-completes all progress
- For testing features like whiteboard, class switching, chapters - admin account works fine

### Key Features to Test
1. **Whiteboard**: Click "WHITEBOARD" nav tab. Canvas-based drawing with tools (Pen, Eraser, Highlighter, Text), color picker, size slider. Save/load notes to localStorage. Use JavaScript to simulate drawing on canvas since browser mouse drag may not work reliably:
   ```js
   const canvas = document.getElementById('whiteboard-canvas');
   const rect = canvas.getBoundingClientRect();
   function simEvent(type, x, y) {
     canvas.dispatchEvent(new MouseEvent(type, { clientX: rect.left + x, clientY: rect.top + y, bubbles: true }));
   }
   simEvent('mousedown', 100, 100);
   simEvent('mousemove', 200, 100);
   simEvent('mouseup', 200, 100);
   ```

2. **Class Switching**: Click "SWITCH CLASS" button in nav bar. Shows selection screen with Class 6 (10 chapters) and Class 7 (15 chapters).

3. **Chapters**: Click "CHAPTERS" tab. Shows chapter grid with titles and completion status.

4. **Formula Videos**: Click "FORMULA VIDEOS" tab. Shows video cards per chapter.

5. **Certificates**: Click "CERTIFICATES" tab. Shows earned certificates including Master Certificate.

### Save/Load Testing
- Whiteboard save uses `prompt()` for note name. Override with:
  ```js
  window.prompt = function() { return 'Test Note'; };
  saveWhiteboardNote();
  ```
- Notes persist in localStorage under key `whiteboard_notes`

## APK Testing

### Building the APK
- Source: `/home/ubuntu/ganita-rn/App.js`
- Bundle with Metro: `npx react-native bundle --platform android --dev false --entry-file App.js --bundle-output /tmp/index.android.bundle --assets-dest /tmp/assets/`
- Compile to Hermes bytecode: `hermesc -emit-binary -out /tmp/index.android.bundle.hbc /tmp/index.android.bundle`
- Replace bundle in original APK, re-sign with keystore

### Emulator Limitations
- Software-rendered Android emulators on this VM produce persistent "System UI isn't responding" ANR dialogs
- This blocks interactive UI testing in the emulator
- The APK installs and launches successfully (confirmed via screenshots)
- **Workaround**: Test the web app via browser instead - it shares the same JS codebase
- For full APK testing, the user should test on a real Android device

### APK Signing
- Keystore: `/home/ubuntu/apk-rebuild-final/release.keystore`
- Password: stored as secret (do not hardcode)
- Use `zipalign` then `apksigner` for proper signing

### AndroidManifest.xml Patching
- Original APK may have `extractNativeLibs="false"` which causes INSTALL_FAILED_INVALID_APK on some emulators
- Fix: Patch binary manifest to set `extractNativeLibs="true"` at the correct offset

## Devin Secrets Needed
- Firebase project credentials (for deployment)
- APK signing keystore password

## Common Issues
- Emulator System UI ANR: Known issue with software rendering, not an app bug
- `prompt()` in WebView: May not work on all Android versions - test on real device
- localStorage in WebView: May be cleared on app restart on some devices

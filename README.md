# Ganita Prakash - CBSE Class 6 Maths Learning App

A comprehensive learning application for CBSE Class 6 Mathematics with Firebase Google Authentication.

## Project Structure

- **mobile-app/** - React Native/Expo mobile application
- **web-app/** - Web application (HTML/JS)
- **backend/** - FastAPI Python backend

## Features

- Firebase Google Sign-In Authentication
- Interactive chapter-based learning
- AI-powered tutoring assistant
- Video calling and screen sharing
- Progress tracking and certificates
- Admin dashboard

## Mobile App Setup

```bash
cd mobile-app
npm install
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

## Web App

Deploy the web-app folder to any static hosting service.

## Backend

```bash
cd backend
poetry install
uvicorn app.main:app --reload
```

## Environment Variables

Set these environment variables for the backend:
- `GEMINI_API_KEY` - Google Gemini API key
- `GROQ_API_KEY` - Groq API key

## Live URLs

- Web App: https://cbse-ai-learning-app-o4rl0um1.devinapps.com
- Backend API: https://app-zmatwbmr.fly.dev

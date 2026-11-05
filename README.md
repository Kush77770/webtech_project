# ChatVibe - Modern Real-Time Chat Application

A premium, fully functional **frontend-only** chat application built with **React.js**, featuring an AI-style simulated assistant, WhatsApp-inspired UI, and comprehensive messaging features.

> **B.Tech ICT Academic Project** | Built with React + Vite + Vanilla CSS

---

## Quick Start

npm install
npm run dev

Open your browser at: http://localhost:5173

---

## Features

- 10 Demo Contacts with realistic names, statuses, and sample conversations
- AI-style bot replies - pattern-matched contextual responses (no API needed)
- Typing indicator with animated 3-dot animation and 1-3s realistic delay
- Image attachments (JPG, PNG, WEBP, max 10MB) with lightbox viewer
- Emoji picker with 64 curated emojis
- In-chat message search with keyword highlighting and navigation
- Dark / Light mode with localStorage persistence
- Delete individual messages or clear entire conversations
- Notification sounds with mute toggle
- Fully responsive - mobile sidebar collapse + back navigation
- localStorage persistence - messages survive page refresh

---

## Project Structure

src/
  components/   - React components (Sidebar, ChatWindow, MessageList, etc.)
  data/         - initialContacts.js, botResponses.js
  hooks/        - useLocalStorage.js
  utils/        - timeUtils.js
  styles/       - global.css, sidebar.css, chat.css, components.css
  App.jsx       - Main component
  main.jsx      - Entry point

---

## Technology Stack

- React 18 (functional components + hooks)
- Vite (build tool)
- Vanilla CSS (no Tailwind)
- JavaScript ES6+
- localStorage (data persistence)
- Web Audio API (notification sounds)
- Lucide React (icons)

---

## Notes

- No backend, no API keys, runs entirely in the browser
- Data stored in browser localStorage only
- To reset all data: run localStorage.clear() in browser console

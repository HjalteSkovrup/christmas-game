# Christmas Game Development Guide

## Project Overview
A 24-day Christmas puzzle game platform with:
- Public main page (no login)
- ID + Passkey authentication for submissions
- Puzzle descriptions shared via Teams (not in app)
- Real-time leaderboard showing answers-only submissions
- Danish timezone (CET/CEST) daily unlocks
- Case-insensitive answer validation

## Technology Stack
- Frontend: React + Vite
- Backend: Node.js + Express.js
- Database: PostgreSQL (Neon) - stores 24 answers, no puzzle descriptions
- Hosting: Vercel + Railway + Neon (all free tier)

## Development Progress

- [x] Project structure created
- [x] Frontend package.json and dependencies
- [x] Backend package.json and dependencies
- [x] Database schema and migrations (answers-only schema)
- [x] Backend API endpoints
- [x] Frontend UI pages (day selector, answer form, leaderboard)
- [x] Security and validation layer (ID+passkey auth)
- [ ] Seed database with 24 answers
- [ ] Deployment configuration
- [x] Testing and documentation (12 Vitest tests)

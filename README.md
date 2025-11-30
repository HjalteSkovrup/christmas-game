# 🎄 Christmas Game - 24 Days of Puzzles

A secure, real-time puzzle game platform where participants solve 24 logical puzzles from December 1-24. Each participant submits answers using an ID and passkey without a login system.

## 🏗️ Architecture

- **Frontend**: React with Vite
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Neon)
- **Hosting**: Vercel (frontend) + Railway (backend) + Neon (database)

## 🔐 Security Features

- ✅ ID + Passkey authentication (no login required)
- ✅ Case-insensitive answer validation (server-side)
- ✅ Rate limiting on submissions
- ✅ Audit logging
- ✅ Real-time leaderboard
- ✅ Danish timezone (CET/CEST) for daily unlocks

## 📋 Setup

### Installation

```bash
npm run install-all
```

### Database Setup (Neon PostgreSQL - FREE)

1. **Interactive setup** (easiest):
```bash
npm run setup-db
```

2. **Manual setup**:
   - Sign up at https://console.neon.tech (free tier)
   - Create project `christmas-game`
   - Copy connection string
   - Create `backend/.env`:
   ```
   DATABASE_URL=your_neon_connection_string
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Run migrations**:
```bash
npm run migrate
```

4. **Seed the 24 puzzle answers**:
```bash
npm run seed-answers
```

This populates the database with the 24 correct answers. Puzzle descriptions are shared via Teams, not stored in the app.

### Environment Variables

**backend/.env**
```
DATABASE_URL=postgresql://user:password@host/dbname
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000
```

### Development

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

### Build

```bash
npm run build
```

## 📚 Project Structure

```
christmas-game/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── pages/     # Puzzle display, leaderboard
│   │   ├── components/
│   │   ├── services/  # API calls
│   │   └── App.jsx
│   └── package.json
├── backend/           # Express.js
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── db/        # Database setup & migrations
│   │   ├── middleware/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── setup-db.mjs       # Interactive database setup
├── DATABASE_SETUP.md  # Detailed database guide
├── QUICK_START_DB.md  # Quick reference
├── README.md
└── package.json
```

## 🚀 Deployment

See deployment guides in `frontend/` and `backend/` directories.

## 📖 Next Steps

1. ✅ Project structure created
2. ✅ Database schema setup
3. ⏳ Backend API implementation
4. ⏳ Frontend UI implementation
5. ⏳ Deployment configuration

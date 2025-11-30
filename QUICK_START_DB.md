# 🚀 Quick Start - Database Setup

## What you need to do RIGHT NOW:

### 1️⃣ Sign up on Neon
- Go to: https://console.neon.tech
- Click "Sign Up" and create account
- Create a new project called `christmas-game`

### 2️⃣ Get your connection string
- In Neon dashboard, click your database
- Find "Connection string" section
- Copy the full URL (looks like: `postgresql://user:password@ep-xxx.us-east-1.neon.tech/neondb?sslmode=require`)

### 3️⃣ Update `.env` file
Edit `backend/.env`:
```
DATABASE_URL=<your-neon-connection-string>
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 4️⃣ Run migrations
```bash
cd backend
npm run migrate
```

### 5️⃣ Seed sample data (optional)
```bash
npm run seed
```

### 6️⃣ Test connection
```bash
npm run dev
```

Visit: http://localhost:5000/api/health

---

That's it! Your database is ready! 🎉

See `DATABASE_SETUP.md` for detailed instructions.

# 🎄 Database Setup Guide - Neon PostgreSQL

## Prerequisites
- Node.js installed (already done ✅)
- npm packages installed (already done ✅)

## Step 1: Create Neon Account & Database

1. **Sign up**: Go to https://console.neon.tech
2. **Create project**: Click "New Project" and name it `christmas-game`
3. **Copy connection string**:
   - Navigate to your project dashboard
   - Click on your database (usually named "neondb")
   - Find the "Connection string" in the "Connection details" section
   - Copy the full connection string (it includes password)

The URL will look like:
```
postgresql://user:password@ep-xxxxxxxxxxxxx.us-east-1.neon.tech/neondb?sslmode=require
```

## Step 2: Configure Backend Environment

1. **Update `.env` file** in the `backend/` folder:
   ```
   DATABASE_URL=<paste-your-connection-string-here>
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

2. **Replace** `<paste-your-connection-string-here>` with your actual Neon connection string

**Example:**
```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/neondb?sslmode=require
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Step 3: Run Database Migrations

From the project root, run:

```bash
cd backend
npm run migrate
```

This will:
- ✅ Create `participants` table
- ✅ Create `puzzles` table
- ✅ Create `submissions` table
- ✅ Create `audit_log` table
- ✅ Create indexes for performance
- ✅ Create `leaderboard` view

You should see output like:
```
🔄 Running database migrations...
✅ Created participants table
✅ Created puzzles table
✅ Created submissions table
✅ Created audit_log table
✅ Created indexes
✅ Created leaderboard view

✅ All database migrations completed successfully!
```

## Step 4: Seed Sample Puzzles (Optional)

To add 5 sample puzzles for testing:

```bash
cd backend
npm run seed
```

Output:
```
🌱 Seeding sample puzzles...

✅ Added puzzle Day 1: New Year's Math
✅ Added puzzle Day 2: Logic Puzzle
✅ Added puzzle Day 3: Pattern Recognition
✅ Added puzzle Day 4: Word Play
✅ Added puzzle Day 5: Christmas Trivia

✅ Seeding completed!
```

## Step 5: Verify Database Connection

Start the backend server:

```bash
npm run dev
```

You should see:
```
🎄 Christmas Game Backend running on port 5000
```

Try the health check:
```bash
curl http://localhost:5000/api/health
```

Should respond:
```json
{"status":"ok"}
```

## Step 6: Add Your Own Puzzles

You can add puzzles directly to the database using SQL or through the admin panel (to be created later).

To add a puzzle manually, use Neon's SQL editor:

```sql
INSERT INTO puzzles (day, title, description, answer, unlock_time)
VALUES (
  6,
  'Your puzzle title',
  'Your puzzle description here',
  'correct_answer',
  '2024-12-06 00:00:00 UTC'
);
```

**Important**: The `unlock_time` should be in UTC. Neon will automatically convert based on the timezone.

## Troubleshooting

### Connection refused
- Verify your DATABASE_URL is correct in `.env`
- Check that Neon database is running (green status in dashboard)
- Ensure your IP is not blocked by Neon firewall

### Authentication failed
- Copy the connection string again from Neon dashboard
- Make sure there are no extra spaces or characters
- Password might contain special characters - the URL should be properly encoded

### Migration fails
- Check that Node.js version is 18+: `node --version`
- Reinstall dependencies: `npm install` in backend folder
- Check database permissions in Neon dashboard

## Next Steps

Once database is set up:
1. ✅ Run `npm run dev` to start the backend
2. ⏳ Test API endpoints
3. ⏳ Add remaining 19 puzzles for days 7-24
4. ⏳ Start frontend development

---

📖 **Neon Docs**: https://neon.tech/docs/

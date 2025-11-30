# 🗄️ Database Schema Documentation

## Entity Relationship Diagram

```
┌─────────────────────┐
│   participants      │
├─────────────────────┤
│ id (PK)             │
│ participant_id (U)  │◄─────┐
│ passkey_hash        │      │
│ created_at          │      │
│ updated_at          │      │
└─────────────────────┘      │
                             │
                    ┌────────┴──────────┐
                    │                   │
                    │ (One-to-Many)     │
                    │                   │
        ┌───────────▼────────┐  ┌──────▼──────────┐
        │   submissions      │  │  audit_log      │
        ├────────────────────┤  ├─────────────────┤
        │ id (PK)            │  │ id (PK)         │
        │ participant_id(FK) │  │ participant_id  │
        │ puzzle_id (FK)     │  │ (FK, nullable)  │
        │ answer_submitted   │  │ action          │
        │ is_correct         │  │ details (JSONB) │
        │ submitted_at       │  │ created_at      │
        └───────────┬────────┘  └─────────────────┘
                    │
                    │ (Many-to-One)
                    │
        ┌───────────▼────────┐
        │     puzzles        │
        ├────────────────────┤
        │ id (PK)            │
        │ day (U)            │
        │ title              │
        │ description        │
        │ answer             │
        │ unlock_time        │
        │ created_at         │
        └────────────────────┘

VIEW: leaderboard
├─ participant_id
├─ correct_answers (COUNT)
└─ last_submission (MAX)
```

## Tables Details

### `participants`
Stores participant information for ID+passkey authentication.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | SERIAL | PRIMARY KEY | Unique participant ID |
| `participant_id` | VARCHAR(50) | UNIQUE NOT NULL | User's display name |
| `passkey_hash` | VARCHAR(255) | NOT NULL | Hashed passkey |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Registration time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Example**:
```sql
INSERT INTO participants (participant_id, passkey_hash)
VALUES ('john_doe', 'hashed_passkey_here');
```

---

### `puzzles`
Stores the 24 daily puzzles and their unlock times.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | SERIAL | PRIMARY KEY | Unique puzzle ID |
| `day` | INTEGER | UNIQUE, CHECK(1-24) | Day number (1-24) |
| `title` | VARCHAR(255) | NOT NULL | Puzzle title |
| `description` | TEXT | NOT NULL | Puzzle question/riddle |
| `answer` | VARCHAR(255) | NOT NULL | Correct answer |
| `unlock_time` | TIMESTAMP | NOT NULL | When puzzle becomes available (CET/CEST) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |

**Example**:
```sql
INSERT INTO puzzles (day, title, description, answer, unlock_time)
VALUES (
  1,
  'New Year Math',
  'What is 7 + 5?',
  '12',
  '2024-12-01 00:00:00+00:00'
);
```

---

### `submissions`
Records each participant's answer submission for each puzzle.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | SERIAL | PRIMARY KEY | Unique submission ID |
| `participant_id` | INTEGER | NOT NULL, FK → participants | Who submitted |
| `puzzle_id` | INTEGER | NOT NULL, FK → puzzles | Which puzzle |
| `answer_submitted` | VARCHAR(255) | NOT NULL | The answer they provided |
| `is_correct` | BOOLEAN | NOT NULL | Whether answer is correct |
| `submitted_at` | TIMESTAMP | DEFAULT NOW() | When submitted |
| `UNIQUE(participant_id, puzzle_id)` | - | CONSTRAINT | One submission per participant per puzzle |

**Example**:
```sql
INSERT INTO submissions (participant_id, puzzle_id, answer_submitted, is_correct)
VALUES (1, 1, '12', true);
```

---

### `audit_log`
Tracks important actions for security and debugging.

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | SERIAL | PRIMARY KEY | Unique log ID |
| `participant_id` | INTEGER | FK → participants (nullable) | Who performed action |
| `action` | VARCHAR(100) | NOT NULL | Action type (SUBMISSION, FAILED_PASSKEY, etc.) |
| `details` | JSONB | - | Additional details as JSON |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When logged |

**Example**:
```sql
INSERT INTO audit_log (participant_id, action, details)
VALUES (1, 'SUBMISSION', '{"puzzle_id": 1, "is_correct": true}');
```

---

## Views

### `leaderboard`
Real-time view showing rankings based on correct answers.

**Query**:
```sql
SELECT participant_id, correct_answers, last_submission FROM leaderboard;
```

**Returns**:
```
participant_id | correct_answers | last_submission
─────────────────────────────────────────────────────
john_doe       | 5               | 2024-12-05 14:32:15
jane_smith     | 4               | 2024-12-04 09:21:08
bob_wilson     | 3               | 2024-12-03 18:45:22
```

---

## Indexes

For performance optimization:

| Index Name | Column | Purpose |
|------------|--------|---------|
| `idx_submissions_participant` | submissions(participant_id) | Fast lookups by participant |
| `idx_submissions_puzzle` | submissions(puzzle_id) | Fast lookups by puzzle |
| `idx_puzzles_day` | puzzles(day) | Fast puzzle lookup by day |
| `idx_participants_id` | participants(participant_id) | Fast participant lookup by ID |

---

## Relationships

1. **participants ← → submissions** (One-to-Many)
   - One participant has many submissions
   - Each submission belongs to one participant

2. **puzzles ← → submissions** (One-to-Many)
   - One puzzle receives many submissions
   - Each submission is for one puzzle

3. **participants ← → audit_log** (One-to-Many, nullable)
   - Participant actions are logged
   - Can have NULL participant_id for system actions

---

## Database Constraints & Validation

- **Puzzle days**: Must be 1-24 (CHECK constraint)
- **Unique puzzle days**: Only one puzzle per day
- **One submission per participant per puzzle**: Prevents duplicate submissions
- **Cascading deletes**: Deleting a participant deletes their submissions and logs
- **Password hashing**: Always hash before storing (bcrypt recommended for production)

---

## Security Considerations

1. **Passkey Storage**: Use bcrypt in production (currently using base64 for demo)
2. **Answer Validation**: Case-insensitive server-side validation
3. **Audit Logging**: All failed passkey attempts are logged
4. **Timezone Handling**: All unlock times use UTC, converted to Danish timezone (CET/CEST)
5. **SQL Injection Prevention**: Parameterized queries (using `$1, $2, etc.`)

---

## Sample Queries

### Get participant's score
```sql
SELECT participant_id, correct_answers
FROM leaderboard
WHERE participant_id = 'john_doe';
```

### Get today's submissions
```sql
SELECT 
  p.participant_id,
  pz.day,
  s.answer_submitted,
  s.is_correct,
  s.submitted_at
FROM submissions s
JOIN participants p ON s.participant_id = p.id
JOIN puzzles pz ON s.puzzle_id = pz.id
WHERE DATE(s.submitted_at) = CURRENT_DATE
ORDER BY s.submitted_at DESC;
```

### Get failed attempts
```sql
SELECT 
  al.participant_id,
  al.action,
  al.details,
  al.created_at
FROM audit_log al
WHERE al.action = 'FAILED_PASSKEY'
ORDER BY al.created_at DESC
LIMIT 10;
```

### Check which puzzles are unlocked now
```sql
SELECT day, title
FROM puzzles
WHERE unlock_time <= NOW()
ORDER BY day ASC;
```

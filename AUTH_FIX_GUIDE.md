# Authentication Fix Guide

## Changes Made

### 1. **auth.routes.js** - Enhanced Login & Signup
- ✅ Added case-insensitive email matching using `LOWER(email)`
- ✅ Added better error handling in bcrypt comparison
- ✅ Improved debugging logs for troubleshooting
- ✅ Extended JWT expiration from 1h to 7d
- ✅ Added validation for password hash integrity

### 2. **db-init.js** - Database Initialization Script
- ✅ Creates all required tables automatically
- ✅ Creates indexes for performance
- ✅ Safe to run multiple times (uses `CREATE TABLE IF NOT EXISTS`)

### 3. **index.js** - Auto Initialization
- ✅ Imports and runs `initializeDatabase()` on server startup
- ✅ Better error handling for initialization failures
- ✅ Improved logging messages

## How to Test

### Step 1: Start the Backend Server
```bash
npm start
# Or
npm run server
```

**Expected Output:**
```
[INFO] Starting Backend Server...
[INFO] Database Configuration
[INFO] ✅ PostgreSQL connection successful
[INFO] Initializing database schema...
[INFO] ✅ Database schema initialized successfully
🚀 Server running at http://localhost:8000
Frontend available at http://localhost:5173
API base URL: http://localhost:8000
```

### Step 2: Start the Frontend (in another terminal)
```bash
npm run dev
```

### Step 3: Create a New Account
1. Go to http://localhost:5173/signup
2. Fill in details:
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Create Account"

**Expected Console Logs (Backend):**
```
[INFO] POST /auth/signup
📝 Signup attempt - Email: test@example.com Password length: 11
✅ Users table created/verified
🔐 Password hashed successfully
✅ User created successfully - ID: 1
```

### Step 4: Login with Created Account
1. Go to http://localhost:5173/login
2. Enter:
   - Email: test@example.com
   - Password: password123
3. Click "Sign In"

**Expected Console Logs (Backend):**
```
[INFO] POST /auth/login
🔐 Login attempt for email: test@example.com
✅ User found: test@example.com
🔍 Stored password hash length: 60
🔑 Password match result: true
✅ Login successful for user: test@example.com
🎫 Token generated successfully
```

**Expected Frontend Response:**
- Toast message: "Login successful!"
- Redirect to: http://localhost:5173/dashboard
- Token saved in localStorage

## Troubleshooting

### Problem: "Invalid email or password" on Login

**Check 1: User exists in database**
```bash
# Connect to PostgreSQL
psql -U n8n_user -d n8n_db -h localhost

# Run this query:
SELECT email, password FROM users WHERE LOWER(email) = 'test@example.com';
```

If no results, user wasn't created. Try signup again.

**Check 2: Password hash format**
The password should start with `$2b$10$` (bcrypt format). If not, the password isn't hashed correctly.

**Check 3: Server logs**
Look for these patterns:
- `❌ User not found` = User doesn't exist in DB
- `❌ Password does not match` = Wrong password
- `❌ Bcrypt comparison error` = Hash corruption

### Problem: Database Connection Fails

**Check .env file:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=n8n_db
DB_USER=n8n_user
DB_PASSWORD=root
```

**Verify PostgreSQL is running:**
```bash
# Windows
Get-Process postgres

# Or try connecting directly
psql -U n8n_user -d n8n_db -h localhost
```

### Problem: "Table doesn't exist" error

The `db-init.js` script should auto-run on server startup. If it doesn't:

```bash
# Run manually
node db-init.js
```

## Email Case Sensitivity

The code now handles email case-insensitively:
- `Test@Example.com` ✅ Will match `test@example.com`
- Signup stores: `test@example.com` (lowercase)
- Login queries: `LOWER(email) = LOWER($1)`

## Password Requirements

- Minimum 6 characters
- Hashed with bcrypt (rounds: 10)
- Never stored in plain text

## Token Details

- **Type:** JWT (JSON Web Token)
- **Duration:** 7 days
- **Payload:** `{ userId, email }`
- **Secret:** `process.env.JWT_SECRET` or `dev_secret` (for development)

## Files Modified

1. `routes/auth.routes.js` - Enhanced authentication logic
2. `db-init.js` - New database initialization script
3. `index.js` - Added auto-initialization on startup

## Next Steps

1. ✅ Verify backend is running correctly
2. ✅ Test signup with new credentials
3. ✅ Test login with same credentials
4. ✅ Check browser console for any errors
5. ✅ Check backend console for debug logs

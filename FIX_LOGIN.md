# Fix Login Failed Issue

## Problem
The login is failing because:
1. **Backend server is not running**
2. **Database is not set up** (PostgreSQL not running)
3. **Database is not seeded** with user accounts

## Solution - Step by Step

### Step 1: Start Docker Desktop
**IMPORTANT**: Open Docker Desktop application and wait for it to fully start.

### Step 2: Start PostgreSQL Database

```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations"
docker-compose up -d postgres
```

Wait 5-10 seconds for PostgreSQL to be ready.

### Step 3: Set Up Database

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate deploy

# Seed database with users (admin@example.com / admin123)
npm run seed
```

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

You should see: `Server running on port 5000`

### Step 5: Verify Backend is Running

Open browser and go to: http://localhost:5000/health

You should see: `{"status":"ok","timestamp":"..."}`

### Step 6: Try Login Again

Go to http://localhost:3000 and login with:
- Email: `admin@example.com`
- Password: `admin123`

## Quick Fix Script

Run this to set everything up:

```bash
# Start database
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations"
docker-compose up -d postgres
sleep 5

# Setup backend
cd backend
npx prisma generate
npx prisma migrate deploy
npm run seed

# Start backend (in this terminal)
npm run dev
```

Then in a NEW terminal, start frontend:
```bash
cd frontend
npm start
```

## Troubleshooting

### "Cannot connect to Docker daemon"
→ Start Docker Desktop first!

### "Database connection failed"
→ Make sure PostgreSQL container is running:
```bash
docker-compose ps
```

### "User not found" or "Invalid email or password"
→ Run the seed script:
```bash
cd backend
npm run seed
```

### Backend not responding
→ Check if backend is running on port 5000:
```bash
curl http://localhost:5000/health
```

If not, start it:
```bash
cd backend
npm run dev
```

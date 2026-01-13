# 🚀 Quick Start Guide

## IMPORTANT: Start Docker Desktop First!

1. **Open Docker Desktop** application on your Mac
2. Wait until Docker is fully running (you'll see the whale icon in your menu bar)
3. Then follow the steps below

## Automated Setup (Recommended)

Once Docker is running, execute these commands in order:

### Terminal 1: Database Setup

```bash
# Navigate to project directory
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations"

# Start PostgreSQL database
docker-compose up -d postgres

# Wait 5 seconds for database to start, then setup backend
cd backend
npx prisma generate
npx prisma migrate deploy
npm run seed

# Start backend server
npm run dev
```

### Terminal 2: Frontend

```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations/frontend"
npm start
```

## Manual Step-by-Step

### Step 1: Start Docker Desktop
- Open Docker Desktop app
- Wait for it to fully start

### Step 2: Start Database
```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations"
docker-compose up -d postgres
```

### Step 3: Setup Backend Database
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npm run seed
```

### Step 4: Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 5: Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
✅ Frontend running on http://localhost:3000

## Access Points

- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:5000/api  
- 📚 **API Docs**: http://localhost:5000/api-docs

## Login

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**User:**
- Email: `user@example.com`  
- Password: `user123`

## Troubleshooting

**"Cannot connect to Docker daemon"**
→ Start Docker Desktop first!

**"Port already in use"**
→ Stop other services using ports 3000 or 5000

**"Database connection failed"**
→ Make sure PostgreSQL container is running: `docker-compose ps`

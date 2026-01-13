# ✅ Backend Server - Quick Start Guide

## ⚠️ IMPORTANT: Backend Must Stay Running!

**YES, you need to keep the backend server running** for login to work!

## Simple Setup (2 Terminals):

### Terminal 1: Backend (Keep This Running!)

```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations/backend"
npm run dev
```

**You should see:**
```
Server running on port 5001
API Documentation: http://localhost:5001/api-docs
```

**⚠️ Keep this terminal open! Don't close it!**

### Terminal 2: Frontend

```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations/frontend"
npm start
```

## Quick Check:

Test if backend is running:
```bash
curl http://localhost:5001/health
```

Should show: `{"status":"ok","timestamp":"..."}`

## If Backend Stops:

1. **Go back to Terminal 1**
2. **Restart it:**
   ```bash
   cd backend
   npm run dev
   ```

## Why This Happens:

- Frontend (React) runs in your browser
- Backend (Node.js) runs in terminal
- Frontend **needs** backend to be running to make API calls
- If backend stops → Login fails → All API calls fail

## Pro Tip:

Use **two terminal windows**:
- **Left terminal**: Backend (npm run dev)
- **Right terminal**: Frontend (npm start)

Keep both running while developing!

## Alternative: Use Docker (Runs in Background)

```bash
docker-compose up -d
```

This runs everything in background, no need to keep terminals open.

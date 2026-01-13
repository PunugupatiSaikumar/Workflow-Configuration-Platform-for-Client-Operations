# 🔄 Restart Instructions

## Quick Restart Guide

### Backend Server (Terminal 1)

```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations/backend"
npm run dev
```

**Keep this terminal open!**

You should see:
```
Server running on port 5001
API Documentation: http://localhost:5001/api-docs
```

### Frontend Server (Terminal 2)

```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations/frontend"
npm start
```

**Keep this terminal open too!**

The browser should automatically open to http://localhost:3000

## Verify Everything is Running:

### Check Backend:
```bash
curl http://localhost:5001/health
```
Should show: `{"status":"ok","timestamp":"..."}`

### Check Frontend:
Open browser: http://localhost:3000

## What You Should See:

✅ **New Interactive Login Page** with:
- Animated background
- Social media icons (GitHub, LinkedIn, Facebook)
- Interactive form fields
- Smooth animations
- Role badges for credentials

## If Something Doesn't Work:

1. **Backend not responding?**
   - Make sure Terminal 1 is running `npm run dev`
   - Check port 5001 is not blocked

2. **Frontend not loading?**
   - Make sure Terminal 2 is running `npm start`
   - Check browser console for errors

3. **Login fails?**
   - Verify backend is running (check Terminal 1)
   - Check backend health endpoint

## Quick Commands:

**Stop all servers:**
```bash
# Stop frontend (Ctrl+C in Terminal 2)
# Stop backend (Ctrl+C in Terminal 1)
```

**Restart everything:**
1. Start backend in Terminal 1
2. Start frontend in Terminal 2
3. Wait for both to fully load
4. Open http://localhost:3000

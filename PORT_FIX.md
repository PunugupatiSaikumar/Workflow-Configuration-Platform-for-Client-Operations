# ✅ Port 5000 Conflict Fixed!

## Problem:
Port 5000 is being used by **macOS AirPlay Receiver** (AirTunes), not your backend server. This is why you're getting 403 errors.

## Solution:
Changed backend port from **5000** to **5001**.

## What Was Changed:

1. ✅ Backend port: `5000` → `5001`
2. ✅ Frontend API URL: Updated to use port `5001`
3. ✅ Backend .env: Updated PORT to `5001`
4. ✅ Docker-compose: Updated port mapping

## Next Steps:

### 1. Restart Backend Server

The backend should automatically restart (nodemon), but if not:

```bash
cd backend
# Stop current process (Ctrl+C if running)
npm run dev
```

You should now see:
```
Server running on port 5001
API Documentation: http://localhost:5001/api-docs
```

### 2. Update Frontend (if needed)

The frontend code is already updated, but if you need to restart it:

```bash
cd frontend
npm start
```

### 3. Test Login

Go to: **http://localhost:3000**

Login with:
- Email: `admin@example.com`
- Password: `admin123`

## Verify Backend is Running:

```bash
curl http://localhost:5001/health
```

Should show: `{"status":"ok","timestamp":"..."}`

## Alternative: Disable AirPlay Receiver

If you prefer to use port 5000, you can disable AirPlay Receiver:
1. System Settings → General → AirDrop & Handoff
2. Turn off "AirPlay Receiver"

But using port 5001 is easier! ✅

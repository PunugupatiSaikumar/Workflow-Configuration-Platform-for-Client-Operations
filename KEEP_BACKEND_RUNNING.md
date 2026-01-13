# ⚠️ Backend Server Must Stay Running!

## Important: Yes, You Need to Keep Backend Running!

The backend server **must be running** for login and all API calls to work. If you close the terminal or stop the server, login will fail.

## How to Keep Backend Running:

### Option 1: Keep Terminal Open (Current Method)

1. **Open a terminal window**
2. **Navigate to backend directory:**
   ```bash
   cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations/backend"
   ```

3. **Start the backend:**
   ```bash
   npm run dev
   ```

4. **Keep this terminal window open!** 
   - Don't close it
   - Don't press Ctrl+C (this stops the server)
   - Minimize it if needed, but keep it running

5. **You should see:**
   ```
   Server running on port 5001
   API Documentation: http://localhost:5001/api-docs
   ```

### Option 2: Run Backend in Background (Advanced)

Run backend in background so you can close terminal:

```bash
cd backend
nohup npm run dev > backend.log 2>&1 &
```

To stop it later:
```bash
pkill -f "npm run dev"
```

### Option 3: Use Docker Compose (Recommended for Production)

Run everything in Docker so it stays running:

```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations"
docker-compose up -d
```

This runs backend, frontend, and database in background.

## Quick Check: Is Backend Running?

Test if backend is running:
```bash
curl http://localhost:5001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

If you get connection error, backend is not running!

## Typical Setup:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Keep this running!
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
# Keep this running too!
```

## Troubleshooting:

**"Login failed" or "Connection refused"**
→ Backend is not running. Start it!

**"Cannot connect to backend"**
→ Check if backend is running on port 5001

**Backend stopped unexpectedly**
→ Check terminal for errors
→ Restart with `npm run dev`

## Summary:

✅ **Backend MUST be running** for login to work
✅ **Keep the terminal open** where backend is running
✅ **Don't close or stop** the backend process
✅ **Use two terminals**: one for backend, one for frontend

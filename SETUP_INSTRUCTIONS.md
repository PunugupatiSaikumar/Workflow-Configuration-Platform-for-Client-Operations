# Local Setup Instructions

Follow these steps to run the application on localhost.

## Prerequisites

1. **Start Docker Desktop** (required for PostgreSQL database)
   - Open Docker Desktop application
   - Wait until it's fully started (whale icon in menu bar)

## Step-by-Step Setup

### Step 1: Start PostgreSQL Database

Open a terminal and run:

```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations"
docker-compose up -d postgres
```

Wait a few seconds for PostgreSQL to start.

### Step 2: Set Up Backend Database

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database with sample data
npm run seed
```

### Step 3: Start Backend Server

In the same terminal or a new one:

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Step 4: Start Frontend Server

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api-docs

## Login Credentials

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

## Troubleshooting

### Docker Not Running
If you see "Cannot connect to Docker daemon":
1. Open Docker Desktop application
2. Wait for it to fully start
3. Try the docker-compose command again

### Port Already in Use
If port 5000 or 3000 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: React will prompt to use a different port

### Database Connection Error
Make sure PostgreSQL container is running:
```bash
docker-compose ps
```

If not running, start it:
```bash
docker-compose up -d postgres
```

### Prisma Migration Issues
If migrations fail, reset the database:
```bash
cd backend
npx prisma migrate reset
npx prisma migrate deploy
npm run seed
```

## Quick Start Script

Alternatively, you can use the setup script:

```bash
./start-local.sh
```

Then start the servers manually:
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm start`

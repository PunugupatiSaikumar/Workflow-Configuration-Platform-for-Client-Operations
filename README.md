# Workflow Configuration Platform for Client Operations

A comprehensive workflow management platform built with React, Node.js, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone Reponame.git
   cd Workflow-Configuration-Platform-for-Client-Operations
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database URL
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your API URL: REACT_APP_API_URL=http://localhost:5001/api
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - API Docs: http://localhost:5001/api-docs

## 📦 Deployment

### Railway + Vercel (Recommended)

**Backend (Railway):**
1. Sign up at https://railway.app
2. Deploy from GitHub repo
3. Set root directory: `backend`
4. Add PostgreSQL database
5. Set environment variables (see `DEPLOY_STEPS.md`)

**Frontend (Vercel):**
1. Sign up at https://vercel.com
2. Import GitHub repo
3. Set root directory: `frontend`
4. Set `REACT_APP_API_URL`

See `DEPLOY_STEPS.md` for detailed instructions.

### Docker

```bash
docker-compose up -d
```

## 🔐 Default Credentials

- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

**⚠️ Change these passwords in production!**

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Quick Deploy](DEPLOY_STEPS.md)
- [Production Checklist](PRODUCTION_CHECKLIST.md)

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, React Router
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: JWT

## 📝 License

MIT License

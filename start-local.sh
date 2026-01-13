#!/bin/bash

echo "🚀 Starting Workflow Configuration Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Start PostgreSQL
echo "📦 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
cd backend
npx prisma generate

# Run migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy

# Seed database
echo "🌱 Seeding database..."
npm run seed

# Install frontend dependencies if needed
if [ ! -d "../frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd ../frontend
    npm install
    cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the servers:"
echo "  Terminal 1 (Backend): cd backend && npm run dev"
echo "  Terminal 2 (Frontend): cd frontend && npm start"
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000/api"
echo "  API Docs: http://localhost:5000/api-docs"
echo ""
echo "Default login credentials:"
echo "  Admin: admin@example.com / admin123"
echo "  User: user@example.com / user123"

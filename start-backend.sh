#!/bin/bash

echo "🚀 Starting Backend Server..."
echo ""
echo "⚠️  IMPORTANT: Keep this terminal window open!"
echo "   Closing it will stop the backend server."
echo ""

cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations/backend"

# Check if backend is already running
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Backend is already running on port 5001"
    echo "   Stop it first with: pkill -f 'npm run dev'"
    exit 1
fi

# Start backend
echo "Starting backend server on port 5001..."
npm run dev

#!/bin/bash

# Khisha Health Application Startup Script

echo "🏥 Starting Khisha Health Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
cd ..
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🚀 Starting the application..."

# Start backend server
echo "🔧 Starting backend server on port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend development server
echo "🎨 Starting frontend development server on port 5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Khisha Health Application is starting up!"
echo ""
echo "📊 Backend API: http://localhost:5000"
echo "🎨 Frontend App: http://localhost:5173"
echo "🏥 Health Check: http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop the script
wait

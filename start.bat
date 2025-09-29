@echo off
echo 🏥 Starting Khisha Health Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if not exist "node_modules" (
    npm install
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
if not exist "node_modules" (
    npm install
)

REM Install root dependencies
echo 📦 Installing root dependencies...
cd ..
if not exist "node_modules" (
    npm install
)

echo 🚀 Starting the application...

REM Start backend server
echo 🔧 Starting backend server on port 5000...
cd backend
start "Khisha Backend" cmd /k "npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend development server
echo 🎨 Starting frontend development server on port 5173...
cd ..\frontend
start "Khisha Frontend" cmd /k "npm run dev"

echo.
echo 🎉 Khisha Health Application is starting up!
echo.
echo 📊 Backend API: http://localhost:5000
echo 🎨 Frontend App: http://localhost:5173
echo 🏥 Health Check: http://localhost:5000/health
echo.
echo Both servers are running in separate windows.
echo Close the windows to stop the servers.
echo.
pause

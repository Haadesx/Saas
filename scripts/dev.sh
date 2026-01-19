#!/bin/bash

# Development script for Quant-SaaS

echo "Starting Quant-SaaS development environment..."

# Start backend in background
cd backend
cargo run &
BACKEND_PID=$!

# Give backend time to start
sleep 3

# Start frontend (placeholder for now)
echo "Backend running on http://localhost:3000"
echo "Frontend: Run 'cd frontend && npm run dev' in another terminal"

# Keep script running
wait $BACKEND_PID

#!/bin/bash

# Start Backend in background
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start Frontend in foreground
cd frontend && npm start

FROM python:3.11-slim

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Backend Dependencies
COPY backend/requirements.txt backend/requirements.txt
RUN cd backend && pip install -r requirements.txt

# Install Frontend Dependencies
COPY frontend/package.json frontend/package.json
COPY frontend/package-lock.json frontend/package-lock.json
RUN cd frontend && npm ci

# Copy Source Code
COPY . .

# Build Frontend
RUN cd frontend && npm run build

# Setup Start Script
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]

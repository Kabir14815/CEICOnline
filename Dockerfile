FROM python:3.11-slim

WORKDIR /app

# Install Backend Dependencies
COPY backend/requirements.txt backend/requirements.txt
RUN cd backend && pip install -r requirements.txt

# Copy Source Code
COPY . .

# Run Backend
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

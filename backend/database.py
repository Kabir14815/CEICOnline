from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend directory
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "education_news")

print(f"Connecting to MongoDB: {MONGO_URL[:40]}...")  # Debug log

# For MongoDB Atlas - allow invalid certificates for development
# In production, use proper SSL configuration
client = AsyncIOMotorClient(MONGO_URL, tls=True, tlsAllowInvalidCertificates=True)
db = client[DB_NAME]

async def get_database():
    return db

async def init_db():
    try:
        # Create TTL index on created_at field to expire after 30 days (2592000 seconds)
        await db.news.create_index("created_at", expireAfterSeconds=2592000)
        print("TTL index created on news collection")
    except Exception as e:
        print(f"Failed to create TTL index: {e}")

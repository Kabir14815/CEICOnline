import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")

# Test connection directly
MONGO_URL = os.getenv("MONGO_URL")

async def test_connection():
    try:
        print(f"Connecting to: {MONGO_URL[:50]}...")
        client = AsyncIOMotorClient(MONGO_URL, tls=True, tlsAllowInvalidCertificates=True)
        db = client["education_news"]
        
        # Try to ping the database
        result = await db.command("ping")
        print(f"Ping result: {result}")
        
        # List collections
        collections = await db.list_collection_names()
        print(f"Collections: {collections}")
        
        print("Connection successful!")
        
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())

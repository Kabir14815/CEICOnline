import asyncio
from backend.database import db
from backend.auth import get_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

async def seed_admin():
    email = "admin@example.com"
    password = "adminpassword"
    
    existing_admin = await db.admins.find_one({"email": email})
    if existing_admin:
        print("Admin already exists")
        return

    hashed_password = get_password_hash(password)
    new_admin = {"email": email, "password": hashed_password}
    await db.admins.insert_one(new_admin)
    print("Admin created successfully")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed_admin())

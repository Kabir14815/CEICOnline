
import asyncio
import os
from dotenv import load_dotenv
import sys

# Load env from backend/.env manually
from pathlib import Path
env_path = Path("backend/.env")
load_dotenv(env_path)

# Add backend to path to import database
sys.path.append(os.getcwd())

try:
    from backend.database import db
    from backend.auth import get_password_hash
    
    async def reset_password():
        email = "admin@example.com"
        new_password = "123456"
        hashed_password = get_password_hash(new_password)
        
        result = await db.admins.update_one(
            {"email": email},
            {"$set": {"password": hashed_password}}
        )
        
        if result.modified_count > 0:
            print(f"Successfully reset password for {email} to '{new_password}'")
        else:
            print(f"No changes made. Admin {email} might not exist or password was already '{new_password}'.")

    if __name__ == "__main__":
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(reset_password())
except Exception as e:
    print(f"Error: {e}")

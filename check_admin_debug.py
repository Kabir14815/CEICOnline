
import asyncio
import os
from dotenv import load_dotenv
import sys

# Load env from backend/.env manually
from pathlib import Path
env_path = Path("backend/.env")
load_dotenv(env_path)

# Redirect stdout to file
with open("debug_output.txt", "w") as f:
    sys.stdout = f
    
    print("--- Environment Variables Check ---")
    print(f"ADMIN_EMAIL: {os.getenv('ADMIN_EMAIL')}")
    print(f"ADMIN_PASSWORD: {os.getenv('ADMIN_PASSWORD')}")
    
    # Add backend to path to import database
    sys.path.append(os.getcwd())

    try:
        from backend.database import db
        
        async def check():
            print("\n--- Database Check ---")
            admins = await db.admins.find().to_list(length=10)
            if not admins:
                print("No admin users found in database.")
            for admin in admins:
                print(f"Found Admin: {admin.get('email')}")

        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(check())
    except Exception as e:
        print(f"Error: {e}")

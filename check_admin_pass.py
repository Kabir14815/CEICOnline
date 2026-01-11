
import asyncio
import os
from dotenv import load_dotenv
import sys

# Load env from backend/.env manually
from pathlib import Path
env_path = Path("backend/.env")
load_dotenv(env_path)

# Redirect stdout to file
with open("debug_pass_check.txt", "w") as f:
    sys.stdout = f
    
    # Add backend to path to import database
    sys.path.append(os.getcwd())

    try:
        from backend.database import db
        from backend.auth import verify_password
        
        async def check():
            print("\n--- Password Check ---")
            admin = await db.admins.find_one({"email": "admin@example.com"})
            if not admin:
                print("Admin user not found.")
                return

            print(f"Checking password for {admin['email']}...")
            hashed_pw = admin['password']
            
            common_passwords = ["password", "admin", "123456", "12345", "secret", "admin123"]
            found = False
            for pwd in common_passwords:
                if verify_password(pwd, hashed_pw):
                    print(f"MATCH FOUND! Password is: {pwd}")
                    found = True
                    break
            
            if not found:
                print("Password did not match common defaults.")

        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(check())
    except Exception as e:
        print(f"Error: {e}")

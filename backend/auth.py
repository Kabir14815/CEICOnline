from passlib.context import CryptContext
from fastapi import Header, HTTPException, status
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    try:
        # Truncate password to 72 bytes (bcrypt limit)
        truncated_password = plain_password[:72]
        return pwd_context.verify(truncated_password, hashed_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def get_password_hash(password):
    # Truncate password to 72 bytes (bcrypt limit)
    truncated_password = password[:72]
    return pwd_context.hash(truncated_password)

async def get_current_user(username: Optional[str] = Header(None, alias="X-Username")):
    """Simple username-based authentication - checks if username header is present"""
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return username

"""
Admin routes for authentication and admin management.
Login is for frontend tracking only - no route protection.
"""
from fastapi import APIRouter, HTTPException, status
from ..database import db
from ..models import AdminModel
from ..auth import verify_password, get_password_hash

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)


@router.post("/login")
async def login(admin: AdminModel):
    """
    Verify admin credentials and return username.
    This is for frontend tracking only - routes are not protected.
    
    Args:
        admin: Admin credentials (email and password)
        
    Returns:
        Username (email) if credentials are valid
    """
    user = await db.admins.find_one({"email": admin.email})
    if not user or not verify_password(admin.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return {"username": user["email"]}


@router.post("/create_seed_admin")
async def create_seed_admin(admin: AdminModel):
    """
    Create a new admin user (seed/admin creation endpoint).
    
    Args:
        admin: Admin credentials (email and password)
        
    Returns:
        Success message
    """
    existing_admin = await db.admins.find_one({"email": admin.email})
    if existing_admin:
        return {"message": "Admin already exists"}
    
    hashed_password = get_password_hash(admin.password)
    new_admin = {"email": admin.email, "password": hashed_password}
    await db.admins.insert_one(new_admin)
    return {"message": "Admin created successfully"}


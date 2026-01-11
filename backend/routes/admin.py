from fastapi import APIRouter, Depends, HTTPException, status
from ..database import db
from ..models import AdminModel
from ..auth import verify_password, get_password_hash, get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

@router.post("/login")
async def login(admin: AdminModel):
    user = await db.admins.find_one({"email": admin.email})
    if not user or not verify_password(admin.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    # Return username (email) instead of token
    return {"username": user["email"]}

@router.post("/create_seed_admin")
async def create_seed_admin(admin: AdminModel):
    # Check if admin already exists
    existing_admin = await db.admins.find_one({"email": admin.email})
    if existing_admin:
        return {"message": "Admin already exists"}
    
    hashed_password = get_password_hash(admin.password)
    new_admin = {"email": admin.email, "password": hashed_password}
    await db.admins.insert_one(new_admin)
    return {"message": "Admin created successfully"}

@router.get("/verify")
async def verify_user(current_user: str = Depends(get_current_user)):
    """Verify that user is authenticated"""
    return {"status": "ok", "username": current_user}


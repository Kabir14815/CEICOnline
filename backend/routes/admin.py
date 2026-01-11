from fastapi import APIRouter, Depends, HTTPException, status
from ..database import db
from ..models import AdminModel, Token
from ..auth import verify_password, create_access_token, get_password_hash, get_current_user, SECRET_KEY
from datetime import timedelta

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

@router.post("/login", response_model=Token)
async def login_for_access_token(admin: AdminModel):
    user = await db.admins.find_one({"email": admin.email})
    if not user or not verify_password(admin.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=1440)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

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
async def verify_token(current_user: str = Depends(get_current_user)):
    """Debug endpoint to verify token is working"""
    return {"status": "ok", "user": current_user, "secret_key_prefix": SECRET_KEY[:5] + "..."}


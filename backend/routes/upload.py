from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from datetime import datetime
from pathlib import Path

router = APIRouter(
    prefix="/upload",
    tags=["upload"],
)

UPLOAD_DIR = Path("backend/static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/", response_model=dict)
async def upload_image(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = UPLOAD_DIR / filename
        
        # Save file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return URL (assuming localhost:8000 for now, can be configured)
        url = f"http://localhost:8000/static/uploads/{filename}"
        
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

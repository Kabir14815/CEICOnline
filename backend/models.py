from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Any
from datetime import datetime

class NewsModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
    
    id: Optional[str] = Field(default=None, alias="_id")
    title: str
    slug: str
    content: str
    category: str
    language: str = "en"
    cover_image_url: Optional[str] = None
    status: str = "draft"
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class AdminModel(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UpdateModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
    
    id: Optional[str] = Field(default=None, alias="_id")
    title: str  # e.g., "Admit Card", "Results"
    content: str # The short description
    category: str = "General" # Optional, for filtering
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

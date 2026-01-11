"""
News routes for managing news articles.
All routes are publicly accessible - no authentication required.
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..database import db
from ..models import NewsModel
from bson import ObjectId
from datetime import datetime

router = APIRouter(
    prefix="/news",
    tags=["news"],
)


def serialize_doc(doc):
    """Convert MongoDB document to serializable format"""
    if doc is None:
        return None
    doc["_id"] = str(doc["_id"])
    return doc


def serialize_docs(docs):
    """Convert list of MongoDB documents to serializable format"""
    return [serialize_doc(doc) for doc in docs]


@router.get("/", response_model=List[NewsModel])
async def get_news(
    category: Optional[str] = None,
    status: Optional[str] = "published",
    limit: int = 10,
    skip: int = 0
):
    """
    Get list of news articles with optional filtering.
    
    Args:
        category: Filter by category (Exams, Results, Admissions, Jobs, Scholarships)
        status: Filter by status (published, draft, all)
        limit: Maximum number of results
        skip: Number of results to skip
        
    Returns:
        List of news articles
    """
    query = {}
    if status != "all":
        query["status"] = status
    if category:
        query["category"] = category
    
    news = await db.news.find(query).skip(skip).limit(limit).sort("created_at", -1).to_list(100)
    return serialize_docs(news)


@router.get("/{slug}", response_model=NewsModel)
async def get_news_by_slug(slug: str):
    """
    Get a single news article by slug.
    
    Args:
        slug: The URL-friendly slug of the news article
        
    Returns:
        News article details
    """
    news = await db.news.find_one({"slug": slug, "status": "published"})
    if news is None:
        raise HTTPException(status_code=404, detail="News not found")
    return serialize_doc(news)


@router.get("/id/{id}", response_model=NewsModel)
async def get_news_by_id(id: str):
    """
    Get a single news article by ID.
    
    Args:
        id: The MongoDB ObjectId of the news article
        
    Returns:
        News article details
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    news = await db.news.find_one({"_id": ObjectId(id)})
    if news is None:
        raise HTTPException(status_code=404, detail="News not found")
    return serialize_doc(news)


@router.post("/", response_model=NewsModel)
async def create_news(news: NewsModel):
    """
    Create a new news article.
    
    Args:
        news: News article data
        
    Returns:
        Created news article
    """
    news_dict = news.model_dump(by_alias=True, exclude={"id"})
    news_dict["created_at"] = datetime.utcnow()
    news_dict["updated_at"] = datetime.utcnow()
    
    new_news = await db.news.insert_one(news_dict)
    created_news = await db.news.find_one({"_id": new_news.inserted_id})
    return serialize_doc(created_news)


@router.put("/{id}", response_model=NewsModel)
async def update_news(id: str, news: NewsModel):
    """
    Update an existing news article.
    
    Args:
        id: The MongoDB ObjectId of the news article
        news: Updated news article data
        
    Returns:
        Updated news article
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    news_dict = news.model_dump(exclude_unset=True, exclude={"id", "created_at"})
    news_dict["updated_at"] = datetime.utcnow()
    
    result = await db.news.update_one({"_id": ObjectId(id)}, {"$set": news_dict})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
        
    updated_news = await db.news.find_one({"_id": ObjectId(id)})
    return serialize_doc(updated_news)


@router.delete("/{id}")
async def delete_news(id: str):
    """
    Delete a news article.
    
    Args:
        id: The MongoDB ObjectId of the news article to delete
        
    Returns:
        Success message
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    result = await db.news.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
        
    return {"message": "News deleted successfully"}

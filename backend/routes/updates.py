from fastapi import APIRouter, HTTPException, Body, Request
from fastapi.responses import JSONResponse
from typing import List
from ..models import UpdateModel
from ..database import get_database
from datetime import datetime
from bson import ObjectId

router = APIRouter()

def serialize_doc(doc):
    """Convert MongoDB document to serializable format"""
    if doc is None:
        return None
    doc["_id"] = str(doc["_id"])
    return doc

def serialize_docs(docs):
    """Convert list of MongoDB documents to serializable format"""
    return [serialize_doc(doc) for doc in docs]

@router.get("/updates", response_description="List all updates", response_model=List[UpdateModel])
async def list_updates():
    db = await get_database()
    updates = await db["updates"].find().sort("created_at", -1).to_list(100)
    return serialize_docs(updates)

@router.post("/updates", response_description="Add new update", response_model=UpdateModel)
async def create_update(update: UpdateModel = Body(...)):
    db = await get_database()
    update_dict = update.model_dump(by_alias=True, exclude=["id"])
    update_dict["created_at"] = datetime.utcnow()
    update_dict["updated_at"] = datetime.utcnow()
    
    new_update = await db["updates"].insert_one(update_dict)
    created_update = await db["updates"].find_one({"_id": new_update.inserted_id})
    return serialize_doc(created_update)

@router.put("/updates/{id}", response_description="Update an existing update", response_model=UpdateModel)
async def update_update_data(id: str, update: UpdateModel = Body(...)):
    db = await get_database()
    update_dict = update.model_dump(by_alias=True, exclude=["id", "created_at"])
    update_dict["updated_at"] = datetime.utcnow()
    
    if len(update_dict) >= 1:
        update_result = await db["updates"].update_one(
            {"_id": ObjectId(id)}, {"$set": update_dict}
        )
        if update_result.modified_count == 1:
            if (updated_update := await db["updates"].find_one({"_id": ObjectId(id)})) is not None:
                return serialize_doc(updated_update)
    
    if (existing_update := await db["updates"].find_one({"_id": ObjectId(id)})) is not None:
        return serialize_doc(existing_update)
        
    raise HTTPException(status_code=404, detail=f"Update {id} not found")

@router.delete("/updates/{id}", response_description="Delete an update")
async def delete_update(id: str):
    db = await get_database()
    delete_result = await db["updates"].delete_one({"_id": ObjectId(id)})
    
    if delete_result.deleted_count == 1:
        return JSONResponse(status_code=200, content={"message": "Update deleted"})
    
    raise HTTPException(status_code=404, detail=f"Update {id} not found")

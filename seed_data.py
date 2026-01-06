import asyncio
from backend.database import db
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

async def seed_data():
    print("Seeding data...")

    # Clear existing data
    await db.news.delete_many({})
    await db.updates.delete_many({})

    # Seed News
    news_items = [
        {
            "title": "JEE Main 2024 Session 2 Results Declared",
            "slug": "jee-main-2024-session-2-results",
            "content": "<p>The National Testing Agency (NTA) has declared the results for JEE Main 2024 Session 2. Candidates can check their scorecards on the official website.</p>",
            "category": "Results",
            "status": "published",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "title": "NEET UG 2024 Registration Extended",
            "slug": "neet-ug-2024-registration-extended",
            "content": "<p>The registration deadline for NEET UG 2024 has been extended by one week. Students can now apply until the new deadline.</p>",
            "category": "Admissions",
            "status": "published",
            "created_at": datetime.utcnow() - timedelta(days=1),
            "updated_at": datetime.utcnow() - timedelta(days=1)
        },
        {
            "title": "CBSE Class 10 Date Sheet Released",
            "slug": "cbse-class-10-date-sheet-2024",
            "content": "<p>CBSE has released the official date sheet for Class 10 board exams. Exams will commence from February 15th.</p>",
            "category": "Exams",
            "status": "draft",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "updated_at": datetime.utcnow() - timedelta(days=2)
        },
        {
            "title": "Top 10 Engineering Colleges in India",
            "slug": "top-10-engineering-colleges-india",
            "content": "<p>A comprehensive list of the top engineering colleges in India based on the latest NIRF rankings.</p>",
            "category": "Career",
            "status": "published",
            "created_at": datetime.utcnow() - timedelta(days=5),
            "updated_at": datetime.utcnow() - timedelta(days=5)
        }
    ]
    
    if news_items:
        await db.news.insert_many(news_items)
        print(f"Inserted {len(news_items)} news articles")

    # Seed Updates
    updates_items = [
        {
            "title": "Admit Card",
            "content": "JEE Main 2024 admit card available for download.",
            "category": "General",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "title": "Results",
            "content": "CUET PG 2024 results to be announced tomorrow.",
            "category": "General",
            "created_at": datetime.utcnow() - timedelta(hours=5),
            "updated_at": datetime.utcnow() - timedelta(hours=5)
        },
        {
            "title": "Syllabus",
            "content": "Updated syllabus for UPSC CSE 2024 released.",
            "category": "General",
            "created_at": datetime.utcnow() - timedelta(days=1),
            "updated_at": datetime.utcnow() - timedelta(days=1)
        }
    ]

    if updates_items:
        await db.updates.insert_many(updates_items)
        print(f"Inserted {len(updates_items)} updates")

    print("Seeding complete!")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed_data())

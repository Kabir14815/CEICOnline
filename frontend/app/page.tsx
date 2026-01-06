'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import Navbar from '@/components/Navbar';

interface News {
  _id: string;
  title: string;
  slug: string;
  category: string;
  cover_image_url?: string;
  created_at: string;
}

export default function Home() {
  const [newsList, setNewsList] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news');
        setNewsList(response.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Latest Education News</h1>
          <p className="text-[#6B7280] text-lg">Stay updated with the latest in education</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <NewsCard
              key={news._id}
              title={news.title}
              slug={news.slug}
              category={news.category}
              cover_image_url={news.cover_image_url}
              created_at={news.created_at}
            />
          ))}
        </div>
        {newsList.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-lg">No news articles yet. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}

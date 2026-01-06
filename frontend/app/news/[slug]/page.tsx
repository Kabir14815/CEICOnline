'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

interface News {
  title: string;
  content: string;
  category: string;
  cover_image_url?: string;
  created_at: string;
}

export default function NewsDetail() {
  const { slug } = useParams();
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/${slug}`);
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };
    if (slug) fetchNews();
  }, [slug]);

  if (!news) return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
      <div className="text-purple-600 animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          <span className="text-purple-600 font-bold uppercase text-sm tracking-wider">{news.category}</span>
          <h1 className="text-4xl font-bold mt-3 mb-4 text-[#111827]">{news.title}</h1>
          <p className="text-[#6B7280] mb-8">{new Date(news.created_at).toLocaleDateString()}</p>
          {news.cover_image_url && (
            <img src={news.cover_image_url} alt={news.title} className="w-full h-72 object-cover mb-8 rounded-xl border border-[#E5E7EB]" />
          )}
          <div className="prose prose-gray max-w-none text-[#374151] leading-relaxed" dangerouslySetInnerHTML={{ __html: news.content }} />
        </article>
      </main>
    </div>
  );
}

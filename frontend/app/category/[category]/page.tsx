'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface News {
  _id: string;
  title: string;
  slug: string;
  category: string;
  cover_image_url?: string;
  created_at: string;
  content: string;
}

export default function CategoryPage() {
  const { category } = useParams();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [updatesList, setUpdatesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!category) return;
        const cat = Array.isArray(category) ? category[0] : category;
        const formattedCategory = cat.charAt(0).toUpperCase() + cat.slice(1);

        const [newsRes, updatesRes] = await Promise.all([
          api.get(`/news?category=${formattedCategory}`),
          api.get('/updates')
        ]);

        setNewsList(newsRes.data);
        setUpdatesList(updatesRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const catName = Array.isArray(category) ? category[0] : category;
  const featuredNews = newsList.length > 0 ? newsList[0] : null;
  const otherNews = newsList.length > 0 ? newsList.slice(1) : [];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Breaking News Ticker */}
      <div className="bg-[#A855F7] text-white py-2 overflow-hidden relative z-20">
        <div className="container mx-auto px-4 flex items-center">
          <span className="font-black uppercase text-sm tracking-wider mr-4 whitespace-nowrap bg-[#7E22CE] px-2 py-1">
            Exam Breaking
          </span>
          <div className="overflow-hidden relative w-full">
            <div className="animate-marquee whitespace-nowrap">
              {updatesList.length > 0 ? (
                updatesList.map((update, index) => (
                  <span key={update._id} className="inline-flex items-center">
                    <span className="mx-4 font-medium">{update.title}</span>
                    {index < updatesList.length - 1 && (
                      <span className="mx-4 font-medium">•</span>
                    )}
                  </span>
                ))
              ) : (
                <span className="mx-4 font-medium">No breaking news at the moment.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="container mx-auto px-4 py-8">
          <div className="h-96 bg-gray-100 animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">

          {/* Hero Section - Side by Side */}
          {featuredNews && (
            <div className="bg-[#111827] text-white mb-12 overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-2 min-h-[400px]">
                {/* Text Content - Left */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative z-10">
                  <span className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-2">
                    Big Update
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                    <Link href={`/news/${featuredNews.slug}`} className="hover:text-gray-200 transition-colors">
                      {featuredNews.title}
                    </Link>
                  </h1>
                  <div className="text-gray-300 text-lg mb-8 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: featuredNews.content.substring(0, 150) + '...' }} />

                  <Link
                    href={`/news/${featuredNews.slug}`}
                    className="inline-block bg-[#A855F7] text-white font-bold uppercase tracking-wider px-8 py-3 hover:bg-purple-700 transition-colors self-start"
                  >
                    Read Full Story
                  </Link>
                </div>

                {/* Image - Right */}
                <div className="relative h-64 md:h-auto">
                  {featuredNews.cover_image_url ? (
                    <img
                      src={featuredNews.cover_image_url}
                      alt={featuredNews.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-600 text-4xl font-black">Featured</span>
                    </div>
                  )}
                  {/* Gradient Overlay for blending */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-transparent to-transparent md:via-[#111827]/50"></div>
                </div>
              </div>
            </div>
          )}

          {/* Main Grid & Updates Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* News Grid (Left 2 Columns) */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherNews.map((news) => (
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
            </div>

          </div>

          {/* Updates Bar (Bottom) */}
          <div className="mt-16">
            <div className="bg-[#A855F7] text-white px-6 py-3 font-black uppercase tracking-wider text-xl mb-0">
              Updates
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-200 bg-white">
              {updatesList.length > 0 ? (
                updatesList.map((update) => (
                  <div key={update._id} className="p-6 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                    <h3 className="font-black text-xl mb-2 uppercase">{update.title}</h3>
                    <p className="text-gray-600 text-sm">{update.content}</p>
                  </div>
                ))
              ) : (
                <div className="p-6 col-span-3 text-center text-gray-500">No updates available</div>
              )}
            </div>
          </div>

          {/* Today's Bulletin */}
          <div className="mt-8 bg-[#9333EA] text-white p-4 text-center font-bold uppercase tracking-widest">
            Today's Education Bulletin
          </div>

          {/* Empty State */}
          {newsList.length === 0 && !loading && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-400">No articles found</h3>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

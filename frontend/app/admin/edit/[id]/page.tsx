'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import NewsForm from '@/components/NewsForm';

export default function EditNews() {
  const { id } = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/id/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };
    if (id && isAuthenticated) fetchNews();
  }, [id, isAuthenticated]);

  if (!isAuthenticated || !news) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NewsForm initialData={news} isEditing={true} />
    </div>
  );
}

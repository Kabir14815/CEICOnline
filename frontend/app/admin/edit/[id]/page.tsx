'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import NewsForm from '@/components/NewsForm';

export default function EditNews() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/id/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };
    if (id) fetchNews();
  }, [id]);

  if (!news) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <NewsForm initialData={news} isEditing={true} />
    </div>
  );
}

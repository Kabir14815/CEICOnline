'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NewsForm from '@/components/NewsForm';

export default function CreateNews() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NewsForm />
    </div>
  );
}

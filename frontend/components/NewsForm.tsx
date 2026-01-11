'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface NewsFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function NewsForm({ initialData, isEditing = false }: NewsFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || 'Exams');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || '');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      // Use the api instance but we need to override headers for multipart
      // Actually, axios handles multipart automatically if we pass FormData, 
      // but our interceptor sets Content-Type to application/json usually? 
      // No, interceptor only sets Authorization. Axios sets Content-Type automatically for FormData.
      const response = await api.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCoverImageUrl(response.data.url);
    } catch (error) {
      console.error('Failed to upload image', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, slug, content, category, status, cover_image_url: coverImageUrl };

    try {
      const username = localStorage.getItem('username');
      if (!username) {
        alert('You are not logged in. Please log in again.');
        router.push('/admin/login');
        return;
      }

      if (isEditing) {
        await api.put(`/news/${initialData._id}`, data);
      } else {
        await api.post('/news', data);
      }
      router.push('/admin');
    } catch (error: any) {
      console.error('Failed to save news', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/admin/login');
      } else {
        alert('Failed to save news. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-black">{isEditing ? 'Edit News' : 'Create News'}</h2>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="text-gray-500 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-black text-sm font-bold mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors text-black"
          required
          placeholder="Enter article title"
        />
      </div>

      <div className="mb-6">
        <label className="block text-black text-sm font-bold mb-2">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors text-black"
          required
          placeholder="url-friendly-slug"
        />
      </div>

      <div className="mb-6">
        <label className="block text-black text-sm font-bold mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors text-black bg-white"
        >
          <option value="Exams">Exams</option>
          <option value="Results">Results</option>
          <option value="Admissions">Admissions</option>
          <option value="Jobs">Jobs</option>
          <option value="Scholarships">Scholarships</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-black text-sm font-bold mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-black focus:border-black transition-colors text-black resize-y"
          required
          placeholder="Write your article content here..."
        />
      </div>

      <div className="mb-6">
        <label className="block text-black text-sm font-bold mb-2">Cover Image</label>

        {/* Image Upload */}
        <div className="mb-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
              </div>
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>
          {uploading && <p className="text-sm text-blue-600 mt-2 font-medium animate-pulse">Uploading image...</p>}
        </div>

        {/* URL Input Fallback */}
        <div className="relative">
          <input
            type="text"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors text-black"
            placeholder="Or enter image URL directly"
          />
        </div>

        {/* Preview */}
        {coverImageUrl && (
          <div className="mt-4 relative h-48 w-full rounded-lg overflow-hidden border border-gray-200">
            <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="mb-8">
        <label className="block text-black text-sm font-bold mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors text-black bg-white"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isEditing ? 'Update News' : 'Create News'}
      </button>
    </form>
  );
}

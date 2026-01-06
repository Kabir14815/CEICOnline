'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      router.push('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Login failed. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white border border-gray-200 p-10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4 ring-1 ring-purple-500/50">
            <svg className="w-8 h-8 text-[#A855F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your content</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-black text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:border-[#A855F7] focus:ring-2 focus:ring-purple-100 transition-all font-medium placeholder-gray-400"
              required
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-black text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:border-[#A855F7] focus:ring-2 focus:ring-purple-100 transition-all font-medium placeholder-gray-400"
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

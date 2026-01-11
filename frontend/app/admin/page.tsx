'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Search, Filter, LayoutDashboard, FileText, CheckCircle, Clock } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

interface News {
  _id: string;
  title: string;
  category: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: any;
  color: 'purple' | 'green' | 'orange';
  trend?: string;
}

const StatsCard = ({ title, value, icon: Icon, color, trend }: StatsCardProps) => {
  const colorClasses = {
    purple: 'bg-[#4051a4]/5 text-[#4051a4]',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-3xl font-black text-black">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  // Tab State
  const [activeTab, setActiveTab] = useState<'news' | 'updates'>('news');

  // News State
  const [newsList, setNewsList] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Updates State
  const [updatesList, setUpdatesList] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState({ title: '', content: '', category: 'General' });
  const [editingUpdateId, setEditingUpdateId] = useState<string | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'news' | 'update' } | null>(null);

  const router = useRouter();

  // Authentication check - redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  // ... (existing useEffects)

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/news?status=all');
      setNewsList(response.data);
      setFilteredNews(response.data);
    } catch (error) {
      console.error('Failed to fetch news', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const response = await api.get('/updates');
      setUpdatesList(response.data);
    } catch (error) {
      console.error('Failed to fetch updates', error);
      toast.error('Failed to load updates');
    }
  };

  useEffect(() => {
    fetchNews();
    fetchUpdates();
  }, []);

  useEffect(() => {
    let result = newsList;
    if (searchQuery) {
      result = result.filter(news =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(news => news.status === statusFilter);
    }
    setFilteredNews(result);
  }, [newsList, searchQuery, statusFilter]);

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'news') {
        await api.delete(`/news/${itemToDelete.id}`);
        setNewsList(newsList.filter((news) => news._id !== itemToDelete.id));
        toast.success('Article deleted successfully');
      } else {
        await api.delete(`/updates/${itemToDelete.id}`);
        fetchUpdates();
        toast.success('Update deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete', error);
      toast.error('Failed to delete item');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDelete = (id: string) => {
    setItemToDelete({ id, type: 'news' });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUpdate = (id: string) => {
    setItemToDelete({ id, type: 'update' });
    setIsDeleteModalOpen(true);
  };

  const handleSaveUpdate = async () => {
    try {
      if (editingUpdateId) {
        await api.put(`/updates/${editingUpdateId}`, currentUpdate);
        toast.success('Update modified successfully');
      } else {
        await api.post('/updates', currentUpdate);
        toast.success('New update added successfully');
      }
      setIsUpdateModalOpen(false);
      fetchUpdates();
      setCurrentUpdate({ title: '', content: '', category: 'General' });
      setEditingUpdateId(null);
    } catch (error) {
      console.error('Failed to save update', error);
      toast.error('Failed to save update');
    }
  };

  const openUpdateModal = (update?: any) => {
    if (update) {
      setEditingUpdateId(update._id);
      setCurrentUpdate({ title: update.title, content: update.content, category: update.category });
    } else {
      setEditingUpdateId(null);
      setCurrentUpdate({ title: '', content: '', category: 'General' });
    }
    setIsUpdateModalOpen(true);
  };

  // Stats Calculation
  const stats = {
    total: newsList.length,
    published: newsList.filter(n => n.status === 'published').length,
    drafts: newsList.filter(n => n.status === 'draft').length,
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: '#fff', color: '#333' } }} />

      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-[#4051a4] p-2 rounded-lg shadow-md">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-black">CMS <span className="text-[#4051a4]">Dashboard</span></span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('news')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'news' ? 'bg-white text-[#4051a4] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                News
              </button>
              <button
                onClick={() => setActiveTab('updates')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'updates' ? 'bg-white text-[#4051a4] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Updates
              </button>
            </div>
            <Link href="/" className="hidden md:block text-sm font-bold text-gray-600 hover:text-[#4051a4] transition-colors uppercase tracking-wider">
              View Site
            </Link>
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-black">Admin User</p>
                <p className="text-xs text-gray-500">Editor</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#4051a4] to-[#2d3a7a] flex items-center justify-center font-black text-sm text-white shadow-lg ring-2 ring-[#4051a4]/20">
                AD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {activeTab === 'news' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatsCard
                title="Total Articles"
                value={stats.total}
                icon={FileText}
                color="purple"
              />
              <StatsCard
                title="Published"
                value={stats.published}
                icon={CheckCircle}
                color="green"
                trend="+12% this week"
              />
              <StatsCard
                title="Drafts"
                value={stats.drafts}
                icon={Clock}
                color="orange"
              />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:border-[#4051a4] focus:ring-2 focus:ring-[#4051a4]/20 transition-all shadow-sm placeholder-gray-400"
                  />
                </div>
                <div className="relative w-full md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm text-black focus:outline-none focus:border-[#4051a4] focus:ring-2 focus:ring-[#4051a4]/20 appearance-none cursor-pointer shadow-sm font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
              </div>

              <Link
                href="/admin/create"
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-[#4051a4] hover:bg-[#2d3a7a] text-white px-6 py-3 rounded-xl transition-all duration-200 font-bold text-sm shadow-lg hover:shadow-[#4051a4]/20 transform hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span>Create New Article</span>
              </Link>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-6 py-5 text-xs font-black text-black uppercase tracking-wider">Article Details</th>
                      <th className="px-6 py-5 text-xs font-black text-black uppercase tracking-wider">Status</th>
                      <th className="px-6 py-5 text-xs font-black text-black uppercase tracking-wider">Category</th>
                      <th className="px-6 py-5 text-xs font-black text-black uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-5 text-xs font-black text-black uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-50 rounded w-1/2"></div></td>
                          <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-20"></div></td>
                          <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded w-24"></div></td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                          <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded w-8 ml-auto"></div></td>
                        </tr>
                      ))
                    ) : filteredNews.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                              <Search size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No articles found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredNews.map((news) => (
                        <tr key={news._id} className="group hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="font-bold text-black mb-1 text-base">{news.title}</div>
                            <div className="text-xs text-gray-500 font-mono">ID: {news._id.substring(0, 8)}...</div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${news.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${news.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                                }`}></span>
                              {news.status}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 uppercase tracking-wide">
                              {news.category}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                            {new Date(news.updated_at || news.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                href={`/admin/edit/${news._id}`}
                                className="p-2 text-gray-400 hover:text-[#4051a4] hover:bg-[#4051a4]/5 rounded-lg transition-all"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </Link>
                              <button
                                onClick={() => handleDelete(news._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Updates Management Section */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-black">Manage Updates</h2>
              <button
                onClick={() => openUpdateModal()}
                className="flex items-center space-x-2 bg-[#4051a4] hover:bg-[#2d3a7a] text-white px-6 py-3 rounded-xl transition-all font-bold text-sm shadow-lg"
              >
                <Plus size={18} />
                <span>Add New Update</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {updatesList.map((update) => (
                <div key={update._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openUpdateModal(update)} className="p-1 text-gray-400 hover:text-[#4051a4]"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteUpdate(update._id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                  <h3 className="font-black text-lg mb-2 uppercase text-[#4051a4]">{update.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{update.content}</p>
                  <span className="text-xs text-gray-400 font-mono">{new Date(update.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>

            {/* Update Modal */}
            {isUpdateModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-black mb-6">{editingUpdateId ? 'Edit Update' : 'New Update'}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Title (e.g., Admit Card)</label>
                      <input
                        type="text"
                        value={currentUpdate.title}
                        onChange={(e) => setCurrentUpdate({ ...currentUpdate, title: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#4051a4]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Content</label>
                      <textarea
                        value={currentUpdate.content}
                        onChange={(e) => setCurrentUpdate({ ...currentUpdate, content: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#4051a4] h-24"
                      />
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        onClick={() => setIsUpdateModalOpen(false)}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveUpdate}
                        className="bg-[#4051a4] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2d3a7a]"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl transform scale-100 transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Delete Item?</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Are you sure you want to delete this? This action cannot be undone and will remove the item permanently.
                </p>
                <div className="flex space-x-3 w-full">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

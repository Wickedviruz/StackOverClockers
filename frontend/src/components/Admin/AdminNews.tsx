// src/pages/AdminNews.tsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface NewsItem {
  id: number;
  title: string;
  author: string;
  created_at: string;
}

const AdminNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news');
        setNews(response.data.news);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/news/${id}`);
      setNews((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold mb-6">Admin: Nyheter</h1>
        <button
          onClick={() => navigate('/admin/news/create')}
          className="mb-6 px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded"
        >
          Skapa ny nyhet
        </button>
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white dark:bg-[#1C1C1C] rounded shadow flex justify-between items-center"
            >
              <h2 className="text-xl font-bold">{item.title}</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/admin/news/edit/${item.id}`)}
                  className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
                >
                  Redigera
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNews;

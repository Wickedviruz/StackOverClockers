import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

interface NewsDetailData {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
  };
  created_at: string;
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        setNews(response.data);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError('Failed to fetch news. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!news) {
    return <p>News not found.</p>;
  }

  return (
    <div className="min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
        <p className="text-sm text-gray-700 dark:text-gray-400">
          {new Date(news.created_at).toLocaleDateString()} av {news.author.username}
        </p>
        <div
          className="mt-6 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </div>
    </div>
  );
};

export default NewsDetail;

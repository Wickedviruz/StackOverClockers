// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  created_at: string;
}

interface ForumThread {
  id: number;
  title: string;
  created_at: string;
}

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Hämta nyheter
    const fetchNews = async () => {
      try {
        const response = await api.get('/news/?page=1');
        console.log('Fetched news:', response.data);
    
        const formattedNews = response.data.news.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content,
          author: item.author.username, // Hantera förväntat format
          created_at: item.created_at,
        }));
    
        setNews(formattedNews);
        setTotalPages(response.data.pages);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };
    

    // Hämta senaste forumtrådarna
    const fetchForumThreads = async () => {
      try {
        const response = await api.get('/forum/latest');
        setForumThreads(response.data);
      } catch (error) {
        console.error('Failed to fetch forum threads:', error);
      }
    };

    fetchNews();
    fetchForumThreads();
  }, [page]);

  return (
    <div className="min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Nyheter */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold mb-6">Nyheter</h1>
            <div className="space-y-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white dark:bg-[#1C1C1C] rounded shadow hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(item.created_at).toLocaleDateString()} av {item.author}
                  </p>
                  <p className="mt-2">{item.excerpt}</p>
                  <Link
                    to={`/news/${item.id}`}
                    className="text-blue-500 hover:underline dark:text-blue-400"
                  >
                    Läs mer
                  </Link>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-4 py-2 ${
                    page === i
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  } rounded`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Nytt i Forumet */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Nytt i Forumet</h2>
            <div className="space-y-4">
              {forumThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="p-4 bg-white dark:bg-[#1C1C1C] rounded shadow"
                >
                  <h3 className="text-lg font-bold">
                    <Link
                      to={`/forum/thread/${thread.id}`}
                      className="text-blue-500 hover:underline dark:text-blue-400"
                    >
                      {thread.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(thread.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

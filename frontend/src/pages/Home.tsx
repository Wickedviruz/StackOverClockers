// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Simulerar admin-behörighet
  const navigate = useNavigate();

  useEffect(() => {
    // Hämta nyheter från backend
    const fetchNews = async () => {
      try {
        const response = await api.get('/news');
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    // Kolla admin-status (simulerat)
    const checkAdmin = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Här kan en mer avancerad kontroll läggas in för att verifiera adminstatus
        setIsAdmin(true); // Temporärt satt till true
      }
    };

    fetchNews();
    checkAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold mb-6">Nyheter</h1>

        {/* Visa nyheter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white dark:bg-[#1C1C1C] rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-800 dark:text-gray-200">{item.content}</p>
              {isAdmin && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/news/edit/${item.id}`)}
                    className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                  >
                    Redigera
                  </button>
                  <button
                    onClick={() => console.log('Ta bort:', item.id)}
                    className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                  >
                    Ta bort
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lägg till ny nyhet (endast admin) */}
        {isAdmin && (
          <div className="mt-8">
            <button
              onClick={() => navigate('/news/create')}
              className="px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded"
            >
              Lägg till ny nyhet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

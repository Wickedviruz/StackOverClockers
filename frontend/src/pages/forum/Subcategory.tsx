import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Thread {
  id: number;
  title: string;
  created_at: string;
  author: { id: number; username: string };
}

const SubcategoryThreads: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await api.get(`/forum/subcategories/${id}/threads`);
        setThreads(response.data);
      } catch (err) {
        console.error('Failed to fetch threads:', err);
        setError('Failed to load threads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [id]);

  if (loading) {
    return(
      <div className="min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <p>Loading threads...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-4">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Threads</h1>

        <div className="mb-6">
          <button
            onClick={() => navigate(`/forum/subcategory/${id}/create-thread`)}
            className="px-4 py-2 bg-[#D26000] text-white rounded hover:bg-[#FF7505] focus:outline-none focus:ring-2 focus:ring-[#FF7505]"
          >
            Create Thread
          </button>
        </div>

        {threads.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No threads available in this subcategory.</p>
        ) : (
          <div className="border border-[#3B3B3B] rounded">
            {threads.map((thread, index) => (
              <div
                key={thread.id}
                className="px-4 py-3 flex justify-between items-center border-b border-[#3B3B3B]"
                style={{
                  backgroundColor: isDarkMode
                    ? index % 2 === 0
                      ? '#202020'
                      : '#1D1D1D'
                    : index % 2 === 0
                    ? '#F1EFEC'
                    : '#E6E4E0',
                  color: isDarkMode ? '#FFFFFF' : '#000000',
                }}
              >
                <Link
                  to={`/forum/thread/${thread.id}`}
                  className="text-lg font-semibold text-blue-500 hover:underline dark:text-blue-400"
                >
                  {thread.title}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created by {thread.author.username} on {new Date(thread.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryThreads;

// src/pages/ThreadList.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

interface Thread {
  id: number;
  title: string;
  author: string;
  reply_count: number;
  view_count: number;
  last_reply: string;
}

const ThreadList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await api.get(`/categories/${id}/threads`);
        setThreads(response.data);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      }
    };

    fetchThreads();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold mb-6">Trådar</h1>

        {/* Trådlista */}
        <div className="space-y-6">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className="p-4 bg-white dark:bg-[#1C1C1C] rounded shadow hover:shadow-lg transition"
            >
              <Link to={`/forum/thread/${thread.id}`} className="block">
                <h2 className="text-xl font-bold mb-2">{thread.title}</h2>
              </Link>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Skapad av {thread.author} | {thread.reply_count} svar |{' '}
                {thread.view_count} visningar | Senaste inlägg: {new Date(thread.last_reply).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadList;

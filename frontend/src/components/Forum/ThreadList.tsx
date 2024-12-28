import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link, useParams } from 'react-router-dom';

interface Thread {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

const ThreadList: React.FC = () => {
  const { sectionId, subsectionId } = useParams<{ sectionId: string, subsectionId: string }>();
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await api.get(`/forum/sections/${sectionId}/subsections/${subsectionId}/threads`);
        setThreads(response.data);
      } catch (error) {
        console.error(error);
        alert('Kunde inte hämta trådar');
      }
    };

    fetchThreads();
  }, [sectionId, subsectionId]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">Forum Trådar</h2>
      <Link to={`/forum/sections/${sectionId}/subsections/${subsectionId}/threads/create`} className="bg-green-500 text-white p-2 mb-4 inline-block">
        Skapa Ny Tråd
      </Link>
      {threads.map((thread) => (
        <div key={thread.id} className="border p-4 mb-4">
          <Link to={`/forum/sections/${sectionId}/subsections/${subsectionId}/threads/${thread.id}`} className="text-xl font-bold">
            {thread.title}
          </Link>
          <p className="text-gray-600">Av {thread.author} | {new Date(thread.created_at).toLocaleString()}</p>
          <p>{thread.content.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;

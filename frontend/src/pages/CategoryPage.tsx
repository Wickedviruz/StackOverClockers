import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

interface Thread {
  id: number;
  title: string;
  category_id: number;
  user_id: number;
  author: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get('/forum/categories');
        const cat = response.data.find((c: Category) => c.id === parseInt(categoryId || '0'));
        setCategory(cat || null);
      } catch (error) {
        console.error(error);
        alert('Could not fetch category');
      }
    };

    const fetchThreads = async () => {
      try {
        const response = await api.get(`/forum/categories/${categoryId}/threads`);
        setThreads(response.data);
      } catch (error) {
        console.error(error);
        alert('Could not fetch threads');
      }
    };

    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    };

    fetchCategory();
    fetchThreads();
    checkAuth();
  }, [categoryId]);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/forum/categories/${categoryId}/threads`, { title: newThreadTitle });
      setNewThreadTitle('');
      // Uppdatera listan
      const response = await api.get(`/forum/categories/${categoryId}/threads`);
      setThreads(response.data);
    } catch (error) {
      console.error(error);
      alert('Could not create thread');
    }
  };

  if (!category) {
    return <div className="max-w-4xl mx-auto mt-10">Category not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-4">{category.name}</h2>
      <p className="mb-6">{category.description}</p>
      {isAuthenticated && (
        <div className="mb-6">
          <h3 className="text-2xl mb-4">Create New Thread</h3>
          <form onSubmit={handleCreateThread}>
            <div className="mb-4">
              <label className="block">Thread Title</label>
              <input
                type="text"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                required
                className="w-full border p-2"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2">
              Create Thread
            </button>
          </form>
        </div>
      )}
      <div>
        {threads.length === 0 ? (
          <p>No threads in this category yet.</p>
        ) : (
          <ul>
            {threads.map(thread => (
              <li key={thread.id} className="border-b py-2">
                <Link to={`/forum/threads/${thread.id}`} className="text-xl text-blue-600 hover:underline">
                  {thread.title}
                </Link>
                <p className="text-sm">By {thread.author} on {new Date(thread.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

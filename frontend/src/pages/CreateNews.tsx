// src/pages/CreateNews.tsx
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateNews: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/news', { title, content });
      alert('Nyheten har lagts till!');
      navigate('/');
    } catch (error) {
      console.error('Failed to create news:', error);
      alert('Misslyckades med att lägga till nyhet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-lg bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Lägg till ny nyhet</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Titel
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Innehåll
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-medium rounded bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Lägger till...' : 'Lägg till'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;

import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../services/api';

const CreateNews: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/news', { title, content });
      alert('News created successfully!');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Failed to create news:', error);
      alert('Failed to create news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-[#1C1C1C] rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Create News</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content:
          </label>
          <ReactQuill
            value={content}
            onChange={setContent}
            className="bg-white dark:bg-[#1C1C1C] dark:text-white dark:border-[#3B3B3B]"
            style={{ height: '300px' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-medium rounded bg-[#D26000] dark:bg-[#D26000] hover:bg-[#ff7505] focus:outline-none focus:ring-2 focus:ring-[#ff7505] dark:focus:ring-[#ff7505] ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating News...' : 'Create News'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateNews;

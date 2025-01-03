import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateThread: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateThread = async () => {
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/forum/threads', {
        title,
        content,
        subcategory_id: id,
      });
      alert('Thread created successfully!');
      navigate(`/forum/subcategory/${id}`);
    } catch (error) {
      console.error('Failed to create thread:', error);
      alert('Failed to create thread.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Create New Thread</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Thread Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 dark:bg-[#1C1C1C] dark:border-[#3B3B3B]"
          />
          <textarea
            placeholder="Thread Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 dark:bg-[#1C1C1C] dark:border-[#3B3B3B]"
          />
          <button
            onClick={handleCreateThread}
            disabled={loading}
            className="px-4 py-2 bg-[#D26000] text-white rounded hover:bg-[#FF7505] focus:outline-none focus:ring-2 focus:ring-[#FF7505]"
          >
            {loading ? 'Creating...' : 'Create Thread'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateThread;

import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import api from '../../services/api';

const CreateThread: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, checkAuth } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleCreateThread = async () => {
    if (!user) {
      // Om användaren inte är inloggad
      alert('You need to be logged in to create a thread.');
      return;
    }

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
    <div className="min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Create New Thread</h1>
        {!user && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            <p>You must be logged in to create a thread.</p>
          </div>
        )}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Thread Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 dark:bg-[#1C1C1C] dark:border-[#3B3B3B]"
            disabled={!user} // Inaktivera om användaren inte är inloggad
          />
          <textarea
            placeholder="Thread Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 dark:bg-[#1C1C1C] dark:border-[#3B3B3B]"
            disabled={!user} // Inaktivera om användaren inte är inloggad
          />
          <button
            onClick={handleCreateThread}
            disabled={loading || !user} // Inaktivera om användaren inte är inloggad
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

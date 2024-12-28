import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const CreateThread: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [title, setTitle] = useState<string>('');
  const navigate = useNavigate();

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/forum/categories/${categoryId}/threads`, { title });
      setTitle('');
      navigate(`/forum/categories/${categoryId}`);
    } catch (error) {
      console.error(error);
      alert('Could not create thread');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">Create New Thread</h2>
      <form onSubmit={handleCreateThread}>
        <div className="mb-4">
          <label className="block">Thread Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Create Thread
        </button>
      </form>
    </div>
  );
};

export default CreateThread;

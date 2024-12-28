import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateSnippet: React.FC = () => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/snippets', { title, language, code, description });
      navigate('/snippets');
    } catch (error) {
      console.error(error);
      alert('Could not create codesnippet');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">Create new code snippet</h2>
      <form onSubmit={handleCreate}>
        <div className="mb-4">
          <label className="block">Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} required className="w-full border p-2">
            <option value="">Choose language</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            {/* Lägg till fler språk efter behov */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full border p-2"
            rows={10}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2"
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="bg-green-500 text-white p-2">
          Create code snippet
        </button>
      </form>
    </div>
  );
};

export default CreateSnippet;

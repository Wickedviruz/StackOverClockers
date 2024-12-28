import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface Snippet {
  id: number;
  title: string;
  language: string;
  code: string;
  description: string;
  author: string;
  created_at: string;
}

const AdminSnippets: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await api.get('/snippets');
        setSnippets(response.data);
      } catch (error) {
        console.error(error);
        alert('Could not fetch snippets');
      }
    };

    fetchSnippets();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/snippets/${id}`);
      setSnippets(snippets.filter(snippet => snippet.id !== id));
    } catch (error) {
      console.error(error);
      alert('Could not delete snippet');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">Admin - All Snippets</h2>
      {snippets.map(snippet => (
        <div key={snippet.id} className="border p-4 mb-4">
          <h3 className="text-xl font-bold">{snippet.title}</h3>
          <p><strong>Language:</strong> {snippet.language}</p>
          <pre className="bg-gray-100 p-2 overflow-auto">{snippet.code}</pre>
          <p>{snippet.description}</p>
          <p><strong>Author:</strong> {snippet.author}</p>
          <p><strong>Created at:</strong> {new Date(snippet.created_at).toLocaleString()}</p>
          <div className="mt-2">
            <Link to={`/snippets/${snippet.id}/edit`} className="bg-blue-500 text-white px-3 py-1 mr-2 rounded">Edit</Link>
            <button onClick={() => handleDelete(snippet.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSnippets;

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

const SnippetList: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [language, setLanguage] = useState('');

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await api.get('/snippets/', { params: { language } });
        setSnippets(response.data);
      } catch (error) {
        console.error(error);
        alert('Could not fetch codesnippets');
      }
    };

    fetchSnippets();
  }, [language]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">Code snippets</h2>
      <div className="mb-4">
        <label className="block">Filter by language::</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border p-2">
          <option value="">All</option>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
          {/* Lägg till fler språk efter behov */}
        </select>
      </div>
      <Link to="/snippets/create" className="bg-green-500 text-white p-2 mb-4 inline-block">
        Create new codesnippet
      </Link>
      {snippets.map((snippet) => (
        <div key={snippet.id} className="border p-4 mb-4">
          <Link to={`/snippets/${snippet.id}`} className="text-xl font-bold">
            {snippet.title}
          </Link>
          <p className="text-gray-600">Language: {snippet.language} | By {snippet.author} | {new Date(snippet.created_at).toLocaleString()}</p>
          <pre className="bg-gray-100 p-2 mt-2 overflow-auto">
            <code>{snippet.code.substring(0, 200)}...</code>
          </pre>
        </div>
      ))}
    </div>
  );
};

export default SnippetList;

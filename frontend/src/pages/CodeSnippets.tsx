// src/pages/CodeSnippets.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Snippet {
  id: number;
  title: string;
  content: string;
  language: string;
  created_at: string;
}

const CodeSnippets: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [languages, setLanguages] = useState<string[]>([]); // Lista av språk för filtret

  useEffect(() => {
    // Hämta alla kodsnuttar
    const fetchSnippets = async () => {
      try {
        const response = await api.get('/snippets');
        setSnippets(response.data);
      } catch (error) {
        console.error('Failed to fetch snippets:', error);
      }
    };

    // Hämta alla språk
    const fetchLanguages = async () => {
      try {
        const response = await api.get('/snippets/languages');
        setLanguages(response.data);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      }
    };

    fetchSnippets();
    fetchLanguages();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await api.get(`/snippets`, {
        params: { search, language },
      });
      setSnippets(response.data);
    } catch (error) {
      console.error('Failed to search snippets:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold mb-6">Kodsnuttar</h1>

        {/* Filter och Sök */}
        <div className="mb-6 flex space-x-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-3 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">Alla språk</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök kodsnuttar..."
            className="flex-grow p-3 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded"
          >
            Sök
          </button>
        </div>

        {/* Kodsnuttslista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="p-4 bg-white dark:bg-[#1C1C1C] rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold mb-2">{snippet.title}</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {snippet.language}
              </p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-900 dark:text-gray-200 overflow-auto">
                {snippet.content.slice(0, 100)}...
              </pre>
              <div className="mt-4">
                <button className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded">
                  Läs mer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeSnippets;

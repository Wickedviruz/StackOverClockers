import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

interface Snippet {
  id: number;
  title: string;
  language: string;
  code: string;
  description: string;
  author: string;
  created_at: string;
}

const SnippetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [snippet, setSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await api.get(`/snippets/${id}`);
        setSnippet(response.data);
        Prism.highlightAll();
      } catch (error) {
        console.error(error);
        alert('Kunde inte hämta kodsnutt');
      }
    };

    fetchSnippet();
  }, [id]);

  if (!snippet) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl mb-4">{snippet.title}</h2>
      <p className="text-gray-600">Språk: {snippet.language} | Av {snippet.author} | {new Date(snippet.created_at).toLocaleString()}</p>
      <p className="mb-6">{snippet.description}</p>
      <pre className="bg-gray-100 p-4 overflow-auto">
        <code className={`language-${snippet.language.toLowerCase()}`}>{snippet.code}</code>
      </pre>
    </div>
  );
};

export default SnippetDetail;

import React, { useState } from 'react';
import api from '../../services/api';

const Chat: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/chatgpt/ask', { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
      alert('Kunde inte få svar från ChatGPT');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">ChatGPT Assistent</h2>
      <form onSubmit={handleAsk}>
        <div className="mb-4">
          <label className="block">Ställ en fråga om kod:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full border p-2"
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Fråga
        </button>
      </form>
      {answer && (
        <div className="mt-6 p-4 bg-gray-100 border">
          <h3 className="text-2xl mb-2">Svar:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Chat;

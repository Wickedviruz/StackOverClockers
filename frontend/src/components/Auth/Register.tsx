import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, email, password });
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Registrering misslyckades');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4">Registrera</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block">Användarnamn</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block">E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block">Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Registrera
        </button>
      </form>
    </div>
  );
};

export default Register;

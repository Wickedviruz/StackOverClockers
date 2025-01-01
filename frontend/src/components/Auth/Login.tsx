// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  sub: number;
  username: string;
  exp: number;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const token = response.data.access_token;
      const usernameRegistered = response.data.username;
      localStorage.setItem('access_token', token);
      localStorage.setItem('username', usernameRegistered);

      // Dekoda token för att få användarnamn
      const decoded: DecodedToken = jwtDecode(token);
      console.log('Logged in as:', decoded.username);

      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Inloggning misslyckades. Kontrollera dina uppgifter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Logga In</h2>
        <form onSubmit={handleLogin}>
          {/* Användarnamn */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Användarnamn
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-400"
            />
          </div>

          {/* Lösenord */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-400"
            />
          </div>

          {/* Logga in-knapp */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-medium rounded bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Loggar in...' : 'Logga In'}
          </button>
        </form>

        {/* OAuth eller Registrering */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Har du inget konto?{' '}
            <a
              href="/register"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              Registrera dig
            </a>
          </p>
          <p className="text-sm mt-4">
            Eller logga in med{' '}
            <a
              href="/oauth"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              OAuth
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import OAuthLogin from './OAuthLogin';

interface DecodedToken {
  sub: number;
  username: string;
  exp: number;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      alert('Inloggning misslyckades');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4">Logga In</h2>
      <form onSubmit={handleLogin}>
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
          <label className="block">Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Logga In
        </button>
      </form>
      <OAuthLogin />
    </div>
  );
};

export default Login;

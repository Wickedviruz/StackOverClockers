// frontend/src/components/Layout/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username') || '';
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('is_admin');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        <Link to="/" className="mr-4 hover:underline">Hem</Link>
        <Link to="/forum" className="mr-4 hover:underline">Forum</Link>
        <Link to="/snippets" className="mr-4 hover:underline">Kodsnuttar</Link>
        <Link to="/chat" className="mr-4 hover:underline">ChatGPT</Link>
        {isAdmin && <Link to="/admin" className="mr-4 hover:underline">Admin</Link>}
      </div>
      <div className="flex items-center">
        <ThemeToggle />
        {token ? (
          <>
            <span className="ml-4 mr-4">Hej, {username}!</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
              Logga Ut
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">Logga In</Link>
            <Link to="/register" className="bg-green-500 px-3 py-1 rounded">Registrera</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

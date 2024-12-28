import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username') || '';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="max-w-6xl mx-auto flex justify-between">
        <div>
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/forum" className="mr-4">Forum</Link>
          <Link to="/snippets" className="mr-4">CodeSnippets</Link>
          <Link to="/chat" className="mr-4">ChatGPT</Link>
        </div>
        <div>
          {token ? (
            <>
              <span className="mr-4">Welcome, {username}!</span>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Log In</Link>
              <Link to="/register" className="bg-green-500 px-3 py-1 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

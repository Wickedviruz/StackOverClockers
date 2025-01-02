// src/components/Layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import api from '../../services/api';

const Navbar: React.FC = () => {
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null); // Lagra användarens roll

  useEffect(() => {
    // Hantera tema
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Hämta användarens roll från backend
    const fetchUserRole = async () => {
      try {
        const response = await api.get('/user/role'); // Backend endpoint för roll
        setRole(response.data.role);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setRole(null); // Om begäran misslyckas
      }
    };

    fetchUserRole();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="shadow-md">
      {/* Översta raden */}
      <div className="bg-[#EDECEB] dark:bg-[#101010] text-gray-700 dark:text-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold dark:text-white">
            StackOverClockers
          </Link>

          {/* Tema-växlare och Användarlänkar */}
          <div className="flex items-center space-x-4">
            {/* Tema-växlare */}
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Registrera och Logga in */}
            <Link
              to="/register"
              className="text-sm font-medium hover:text-gray-800 dark:hover:text-white"
            >
              Registrera
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium hover:text-gray-800 dark:hover:text-white"
            >
              Logga in
            </Link>
          </div>
        </div>
      </div>

      {/* Understa raden */}
      <div className="bg-white dark:bg-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-12">
            {/* Navigeringslänkar */}
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Home
              </Link>
              <Link
                to="/forum"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Forum
              </Link>
              <Link
                to="/snippets"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Code snippets
              </Link>
              <Link
                to="/news"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                News
              </Link>
              {/* Admin-meny */}
              {role && (
                <>
                  {(role === 'forum_admin' || role === 'super_admin') && (
                    <Link
                      to="/admin/forum"
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    >
                      Forum Admin
                    </Link>
                  )}
                  {(role === 'news_admin' || role === 'super_admin') && (
                    <Link
                      to="/admin/news"
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    >
                      News Admin
                    </Link>
                  )}
                  {role === 'super_admin' && (
                    <Link
                      to="/admin/users"
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    >
                      User Admin
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Hamburgerikon för mobil */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobilmeny */}
      {isMobileMenuOpen && (
        <div className="bg-[#EDECEB] dark:bg-[#1C1C1C] md:hidden">
          <nav className="space-y-2 px-4 py-4">
            <Link
              to="/forum"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Forum
            </Link>
            <Link
              to="/snippets"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Code snippets
            </Link>
            <Link
              to="/news"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Nyheter
            </Link>
            {/* Admin-meny för mobil */}
            {role && (
              <>
                {(role === 'forum_admin' || role === 'super_admin') && (
                  <Link
                    to="/admin/forum"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Forum Admin
                  </Link>
                )}
                {(role === 'news_admin' || role === 'super_admin') && (
                  <Link
                    to="/admin/news"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    News Admin
                  </Link>
                )}
                {role === 'super_admin' && (
                  <Link
                    to="/admin/users"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    User Admin
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { AuthContext } from '../../AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext)!; 
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout(); // Anropa AuthContext logout
    navigate('/login');
  };
  return (
    <header className="shadow-md">
      {/* Översta raden */}
      <div className="bg-[#EDECEB] dark:bg-[#101010] text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-[#3B3B3B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold dark:text-white">
          TechTalkers
          </Link>

          {/* Tema-växlare och Användarlänkar */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {user ? (
              <>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Welcome, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-white hover:text-white dark:hover:text-white bg-[#D26000] dark:bg-[#D26000] border border-gray-400 dark:border-[#3B3B3B] hover:border-gray-800 dark:hover:border-white px-2 py-1 rounded"
                >
                  Logga ut
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="text-sm font-medium hover:text-gray-800 dark:hover:text-white border border-gray-400 dark:border-[#3B3B3B] hover:border-gray-800 dark:hover:border-white px-2 py-1 rounded"
                >
                  Registrera
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-white hover:text-white dark:hover:text-white bg-[#D26000] dark:bg-[#D26000] border border-gray-400 dark:border-[#3B3B3B] hover:border-gray-800 dark:hover:border-white px-2 py-1 rounded"
                >
                  Logga in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Understa raden */}
      <div className="bg-[#FFFFFF] dark:bg-[#1C1C1C] border-b border-gray-300 dark:border-[#3B3B3B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-12">
            <div className="hidden md:flex">
              <Link
                to="/"
                className="flex items-center justify-center h-12 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-[#EDECEB] dark:hover:bg-[#282828] px-4"
              >
                Home
              </Link>
              <Link
                to="/forum"
                className="flex items-center justify-center h-12 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-[#EDECEB] dark:hover:bg-[#282828] px-4"
              >
                Forum
              </Link>
              <Link
                to="/snippets"
                className="flex items-center justify-center h-12 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-[#EDECEB] dark:hover:bg-[#282828] px-4"
              >
                Code snippets
              </Link>
              <Link
                to="/news"
                className="flex items-center justify-center h-12 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-[#EDECEB] dark:hover:bg-[#282828] px-4"
              >
                News
              </Link>
              {user?.role && (
                <>
                  {(user.role === 'forum_admin' || user.role === 'super_admin') && (
                    <Link
                      to="/admin/forum"
                      className="flex items-center justify-center h-12 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-[#EDECEB] dark:hover:bg-[#282828] px-4"
                    >
                      Forum Admin
                    </Link>
                  )}
                  {(user.role === 'news_admin' || user.role === 'super_admin') && (
                    <Link
                      to="/admin/news"
                      className="flex items-center justify-center h-12 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-[#EDECEB] dark:hover:bg-[#282828] px-4"
                    >
                      News Admin
                    </Link>
                  )}
                  {user.role === 'super_admin' && (
                    <Link
                      to="/admin/users"
                      className="flex items-center justify-center h-12 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-[#EDECEB] dark:hover:bg-[#282828] px-4"
                    >
                      User Admin
                    </Link>
                  )}
                </>
              )}
            </div>
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
              News
            </Link>
            {user?.role && (
              <>
                {(user.role === 'forum_admin' || user.role === 'super_admin') && (
                  <Link
                    to="/admin/forum"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Forum Admin
                  </Link>
                )}
                {(user.role === 'news_admin' || user.role === 'super_admin') && (
                  <Link
                    to="/admin/news"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    News Admin
                  </Link>
                )}
                {user.role === 'super_admin' && (
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

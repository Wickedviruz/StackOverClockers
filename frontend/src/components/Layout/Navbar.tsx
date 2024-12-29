// frontend/src/components/Layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (selected: string) => {
    setTheme(selected);
  };

  return (
    <header className="bg-navbar text-defaultText">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-highlight">
            StackOverClockers
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/forum" className="hover:text-highlight">Forum</Link>
            <Link to="/snippets" className="hover:text-highlight">Kodsnuttar</Link>
            <Link to="/chat" className="hover:text-highlight">ChatGPT</Link>
            <Link to="/about" className="hover:text-highlight">Om Oss</Link>
            <Link to="/login" className="hover:text-highlight">Logga In</Link>
            <Link to="/register" className="hover:text-highlight">Registrera</Link>
            <div className="flex items-center">
              <SliderToggle selected={theme} setSelected={toggleTheme} />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-defaultText hover:text-highlight focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-navbar">
          <nav className="space-y-4 px-6 pb-4">
            <Link to="/forum" className="block hover:text-highlight">Forum</Link>
            <Link to="/snippets" className="block hover:text-highlight">Kodsnuttar</Link>
            <Link to="/chat" className="block hover:text-highlight">ChatGPT</Link>
            <Link to="/about" className="block hover:text-highlight">Om Oss</Link>
            <Link to="/login" className="block hover:text-highlight">Logga In</Link>
            <Link to="/register" className="block hover:text-highlight">Registrera</Link>
            <div className="flex justify-center">
              <SliderToggle selected={theme} setSelected={toggleTheme} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const SliderToggle = ({ selected, setSelected }: { selected: string; setSelected: (value: string) => void }) => {
  return (
    <div className="relative flex w-fit items-center rounded-full">
      <button
        className={`${TOGGLE_CLASSES} ${
          selected === 'light' ? 'text-white' : 'text-slate-300'
        }`}
        onClick={() => setSelected('light')}
      >
        <FiSun className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Light</span>
      </button>
      <button
        className={`${TOGGLE_CLASSES} ${
          selected === 'dark' ? 'text-white' : 'text-slate-800'
        }`}
        onClick={() => setSelected('dark')}
      >
        <FiMoon className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Dark</span>
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${
          selected === 'dark' ? 'justify-end' : 'justify-start'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
        />
      </div>
    </div>
  );
};

export default Navbar;

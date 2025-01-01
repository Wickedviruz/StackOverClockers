// frontend/src/index.tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

const Root: React.FC = () => {
  const [themeMode, setThemeMode] = useState<string>(
    localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  return (
    <React.StrictMode>
      <Router>
        <AuthProvider>
            <App />
        </AuthProvider>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

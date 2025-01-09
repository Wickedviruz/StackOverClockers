import React, { useState, useContext } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

const Login: React.FC = () => {
  const { login } = useContext(AuthContext)!; // Hämta login från AuthContext
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Attempting login with:', { username, password });
      await login(username, password);
      console.log('Login successful');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>
        <form onSubmit={handleLogin}>
          {/* Användarnamn */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white !important"
            />
          </div>

          {/* Lösenord */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password:
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Logga in-knapp */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-medium rounded bg-[#D26000] dark:bg-[#D26000] hover:bg[#ff7505] focus:outline-none focus:ring-2 focus:ring-[#ff7505] dark:focus:ring-[#ff7505] dark:hover:bg-[#ff7505] ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* OAuth eller Registrering */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-[#D26000] hover:underline dark:text-[#D26000]"
            >
              Sign up
            </a>
          </p>
          <p className="text-sm mt-4">
            Or sign in with{' '}
            <a
              href="/oauth"
              className="text-[#D26000] hover:underline dark:text-[#D26000]"
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

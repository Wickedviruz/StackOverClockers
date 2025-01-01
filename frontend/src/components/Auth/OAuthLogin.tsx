// src/pages/OAuthLogin.tsx
import React from 'react';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';

const OAuthLogin: React.FC = () => {
  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/auth/${provider}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Logga in med OAuth</h2>

        <div className="space-y-4">
          {/* Google Login */}
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center py-3 text-white font-medium rounded bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
          >
            <FaGoogle className="mr-2" />
            Logga in med Google
          </button>

          {/* Facebook Login */}
          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="w-full flex items-center justify-center py-3 text-white font-medium rounded bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
          >
            <FaFacebook className="mr-2" />
            Logga in med Facebook
          </button>

          {/* GitHub Login */}
          <button
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center py-3 text-white font-medium rounded bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-700"
          >
            <FaGithub className="mr-2" />
            Logga in med GitHub
          </button>
        </div>

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
              href="/login"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              användarnamn och lösenord
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthLogin;

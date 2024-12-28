import React from 'react';

const OAuthLogin: React.FC = () => {
  const handleOAuthLogin = (provider: string) => {
    window.location.href = `http://localhost:5000/oauth/login/${provider}`;
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4">Logga In med</h2>
      <button
        onClick={() => handleOAuthLogin('github')}
        className="bg-black text-white p-2 mb-2 w-full"
      >
        GitHub
      </button>
      <button
        onClick={() => handleOAuthLogin('google')}
        className="bg-red-500 text-white p-2 w-full"
      >
        Google
      </button>
    </div>
  );
};

export default OAuthLogin;

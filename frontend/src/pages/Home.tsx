// frontend/src/pages/Home.tsx
import React from 'react';
import HomeBackground from '../components/HomeBackground';

const Home: React.FC = () => {
  return (
    <div className="relative bg-black min-h-screen flex items-center justify-center">
      <HomeBackground />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
          Build Smarter. Code Faster.
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Join our platform to connect with developers, share code, and explore new ideas. Your community awaits.
        </p>
        <div className="space-x-4">
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700">
            Explore Forum
          </button>
          <button className="bg-gray-700 px-6 py-3 rounded-lg hover:bg-gray-600">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

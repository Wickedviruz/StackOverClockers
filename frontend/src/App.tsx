// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OAuthLogin from './components/Auth/OAuthLogin';

import Home from './pages/Home';
import CreateNews from './pages/CreateNews';

import ForumOverview from './pages/ForumOverview';
import ThreadList from './pages/ThreadList';
import ThreadView from './pages/ThreadView';

import CodeSnippets from './pages/CodeSnippets';
import CreateSnippet from './pages/CreateSnippet';
// Lägg till fler sidor som behövs

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news/create" element={<CreateNews />} />

          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth" element={<OAuthLogin />} />


          <Route path="/forum" element={<ForumOverview />} />
          <Route path="/forum/category/:id" element={<ThreadList />} />
          <Route path="/forum/thread/:id" element={<ThreadView />} />

          <Route path="/snippets" element={<CodeSnippets />} />
          <Route path="/snippets/create" element={<CreateSnippet />} />

          {/* Andra routes */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

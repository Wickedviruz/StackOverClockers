// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

/* Admin */
import AdminNews from './components/Admin/AdminNews';
import CreateNews from './pages/CreateNews';
import EditNews from './pages/EditNews';

/* Auth */
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OAuthLogin from './components/Auth/OAuthLogin';

/* Home */
import Home from './pages/Home';

/* Forum */
import ForumOverview from './pages/ForumOverview';
import ThreadList from './pages/ThreadList';
import ThreadView from './pages/ThreadView';

/* CodeSnippets */
import CodeSnippets from './pages/CodeSnippets';
import CreateSnippet from './pages/CreateSnippet';

/* Navbar & Footer */
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
// Lägg till fler sidor som behövs

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/news/create" element={<CreateNews />} />
          <Route path="/admin/news/edit/:id" element={<EditNews />} />

          
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

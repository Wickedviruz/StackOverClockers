// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

/* Admin */
import ProtectedRoute from './components/ProtectedRoute';
import AdminCategories from './components/Admin/AdminForum';
import AdminNews from './components/Admin/AdminNews';
import CreateNews from './pages/CreateNews';
import EditNews from './pages/EditNews';

/* Auth */
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OAuthLogin from './components/Auth/OAuthLogin';

/* Home */
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';

/* Forum */
import Forum from './pages/Forum';
import Subcategory from './pages/Subcategory';
import CreateThread from './pages/CreateThread';
import ThreadPage from './pages/ThreadPage';

/* CodeSnippets */
import CodeSnippets from './pages/CodeSnippets';
import CreateSnippet from './pages/CreateSnippet';

/* Policy */
import PrivacyPolicy from './pages/PrivacyPolicy';

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
          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<NewsDetail />} />

          {/* Admin routes */}
          <Route path="/admin/forum" element={<ProtectedRoute allowedRoles={['forum_admin', 'super_admin']} />}>
            <Route index element={<AdminCategories />} />
          </Route>
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/news/create" element={<CreateNews />} />
          <Route path="/admin/news/edit/:id" element={<EditNews />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth" element={<OAuthLogin />} />

          {/* Forum routes */}
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/subcategory/:id" element={<Subcategory />} />
          <Route path="/forum/subcategory/:id/create-thread" element={<CreateThread />} />
          <Route path="/forum/thread/:threadId" element={<ThreadPage />} />

          {/* CodeSnippet routes */}
          <Route path="/snippets" element={<CodeSnippets />} />
          <Route path="/snippets/create" element={<CreateSnippet />} />

          {/* Policy */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

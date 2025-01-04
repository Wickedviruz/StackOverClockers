// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

/* Admin */
import ProtectedRoute from './components/ProtectedRoute';
import AdminCategories from './components/Admin/AdminForum';
import AdminNews from './components/Admin/AdminNews';
import CreateNews from './pages/news/CreateNews';
import EditNews from './pages/news/EditNews';

/* Auth / profile */
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OAuthLogin from './components/Auth/OAuthLogin';
import Profile from './pages/Profile';

/* Home */
import Home from './pages/Home';
import NewsDetail from './pages/news/NewsDetail';

/* Forum */
import Forum from './pages/forum/Forum';
import Subcategory from './pages/forum/Subcategory';
import CreateThread from './pages/forum/CreateThread';
import ThreadPage from './pages/forum/ThreadPage';

/* CodeSnippets */
import CodeSnippets from './pages/snippet/CodeSnippets';
import CreateSnippet from './pages/snippet/CreateSnippet';

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

          {/* Auth / profile routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth" element={<OAuthLogin />} />
          <Route path='/profile' element={<Profile />} />

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

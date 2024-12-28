import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ForumHome from './pages/ForumHome';
import CategoryPage from './pages/CategoryPage';
import ThreadPage from './pages/ThreadPage';
import Snippets from './components/Snippets/SnippetList';
import SnippetDetail from './components/Snippets/SnippetDetail';
import CreateSnippet from './components/Snippets/CreateSnippet';
import Chat from './components/ChatGPT/Chat';
import AdminCategoryManagement from './components/Admin/AdminCategoryManagement';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Allmänna Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Forum Routing */}
        <Route path="/forum" element={<ForumHome />} />
        <Route path="/forum/categories/:categoryId" element={<CategoryPage />} />
        <Route path="/forum/threads/:threadId" element={<ThreadPage />} />

        {/* Admin Routing - Skyddade Routes */}
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminCategoryManagement />
            </PrivateRoute>
          }
        />

        {/* Kodsnuttar Routing */}
        <Route path="/snippets" element={<Snippets />} />
        <Route path="/snippets/create" element={<CreateSnippet />} />
        <Route path="/snippets/:id" element={<SnippetDetail />} />

        {/* ChatGPT Routing */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;

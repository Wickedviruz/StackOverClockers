import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface Post {
  id: number;
  content: string;
  thread_id: number;
  user_id: number;
  author: string;
  created_at: string;
}

interface Thread {
  id: number;
  title: string;
  category_id: number;
  user_id: number;
  author: string;
  created_at: string;
  posts: Post[];
}

const ThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [canEditThread, setCanEditThread] = useState<boolean>(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await api.get(`/forum/threads/${threadId}`);
        setThread(response.data);
      } catch (error) {
        console.error(error);
        alert('Could not fetch thread');
      }
    };

    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    };

    const checkEditPermission = () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setCanEditThread(false);
        return;
      }
      const currentUsername = localStorage.getItem('username') || '';
      const isAdmin = localStorage.getItem('is_admin') === 'true';
      if (thread) {
        setCanEditThread(thread.author.toLowerCase() === currentUsername.toLowerCase() || isAdmin);
      }
    };

    fetchThread();
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  useEffect(() => {
    checkEditPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/forum/threads/${threadId}/posts`, { content: newPostContent });
      setNewPostContent('');
      // Uppdatera tråden med nya inlägg
      const response = await api.get(`/forum/threads/${threadId}`);
      setThread(response.data);
    } catch (error) {
      console.error(error);
      alert('Could not create post');
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await api.delete(`/forum/posts/${postId}`);
      // Uppdatera tråden
      const response = await api.get(`/forum/threads/${threadId}`);
      setThread(response.data);
    } catch (error) {
      console.error(error);
      alert('Could not delete post');
    }
  };

  if (!thread) {
    return <div className="max-w-4xl mx-auto mt-10">Thread not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-4">{thread.title}</h2>
      <p className="mb-6">By {thread.author} on {new Date(thread.created_at).toLocaleString()}</p>
      <div className="mb-6">
        {thread.posts.length === 0 ? (
          <p>No posts in this thread yet.</p>
        ) : (
          thread.posts.map(post => (
            <div key={post.id} className="border p-4 mb-4">
              <p>{post.content}</p>
              <p className="text-sm">By {post.author} on {new Date(post.created_at).toLocaleString()}</p>
              {(localStorage.getItem('username')?.toLowerCase() === post.author.toLowerCase() || localStorage.getItem('is_admin') === 'true') && (
                <button onClick={() => handleDeletePost(post.id)} className="bg-red-500 text-white px-3 py-1 rounded mt-2">
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
      {isAuthenticated ? (
        <div className="mb-6">
          <h3 className="text-2xl mb-4">Create New Post</h3>
          <form onSubmit={handleCreatePost}>
            <div className="mb-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                required
                className="w-full border p-2"
                rows={5}
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2">
              Create Post
            </button>
          </form>
        </div>
      ) : (
        <p className="mb-6">Please <Link to="/login" className="text-blue-500">log in</Link> to create a post.</p>
      )}
    </div>
  );
};

export default ThreadPage;

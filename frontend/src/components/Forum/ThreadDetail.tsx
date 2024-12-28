import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

interface Post {
  id: number;
  content: string;
  author: string;
  created_at: string;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

const ThreadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await api.get(`/forum/threads/${id}`);
        setThread(response.data);
      } catch (error) {
        console.error(error);
        alert('Kunde inte hämta tråd');
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await api.get(`/forum/threads/${id}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error(error);
        alert('Kunde inte hämta inlägg');
      }
    };

    fetchThread();
    fetchPosts();
  }, [id]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/forum/threads/${id}/posts`, { content: newPost });
      setNewPost('');
      const response = await api.get(`/forum/threads/${id}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
      alert('Kunde inte skapa inlägg');
    }
  };

  if (!thread) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-4">{thread.title}</h2>
      <p className="text-gray-600">Av {thread.author} | {new Date(thread.created_at).toLocaleString()}</p>
      <p className="mb-6">{thread.content}</p>

      <div className="mb-6">
        <h3 className="text-2xl mb-4">Inlägg</h3>
        {posts.map((post) => (
          <div key={post.id} className="border p-4 mb-4">
            <p className="text-gray-600">Av {post.author} | {new Date(post.created_at).toLocaleString()}</p>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handlePost} className="mb-10">
        <h3 className="text-2xl mb-4">Lägg till ett inlägg</h3>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          required
          className="w-full border p-2 mb-4"
          rows={4}
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Skicka Inlägg
        </button>
      </form>
    </div>
  );
};

export default ThreadDetail;

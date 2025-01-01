// src/pages/ThreadView.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface Post {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

const ThreadView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/threads/${id}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold mb-6">Inlägg</h1>

        {/* Inlägg */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white dark:bg-[#1C1C1C] rounded shadow"
            >
              <h2 className="text-sm font-semibold">{post.author}</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(post.created_at).toLocaleString()}
              </p>
              <p className="mt-2">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadView;

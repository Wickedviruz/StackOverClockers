// src/pages/ForumOverview.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface Category {
  id: number;
  name: string;
  description: string;
  thread_count: number;
  post_count: number;
}

const ForumOverview: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold mb-6">Forum</h1>

        {/* Kategorilista */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-4 bg-white dark:bg-[#1C1C1C] rounded shadow hover:shadow-lg transition"
            >
              <Link to={`/forum/category/${category.id}`} className="block">
                <h2 className="text-xl font-bold mb-2">{category.name}</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {category.description}
                </p>
              </Link>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {category.thread_count} trådar, {category.post_count} inlägg
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumOverview;

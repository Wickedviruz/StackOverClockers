import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Subcategory {
  id: number;
  name: string;
  threadCount: number;
  postCount: number;
  latestPost: {
    id: number;
    title: string;
    createdAt: string;
    author: { id: number; username: string };
  } | null;
}

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

const Forum: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({}); // Hantera expandering

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/forum/categories');
        setCategories(response.data);
        const initialExpandedState = response.data.reduce((acc: any, category: Category) => {
          acc[category.id] = true; // Alla kategorier öppna vid start
          return acc;
        }, {});
        setExpandedCategories(initialExpandedState);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EDECEB]dark:bg-[#101010] text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Forum</h1>
        <div className="border border-[#3B3B3B] rounded">
          {categories.map((category) => (
            <div key={category.id}>
              {/* Category Row */}
              <div
                className="px-4 py-3 font-semibold text-lg bg-[#343330] dark:bg-[#414141] text-white flex justify-between items-center"
                onClick={() => toggleCategory(category.id)}
              >
                <span>{category.name}</span>
                <span>{expandedCategories[category.id] ? '−' : '+'}</span>
              </div>

              {/* Subcategory Rows */}
              {expandedCategories[category.id] &&
                category.subcategories.map((subcategory, index) => (
                  <div
                    key={subcategory.id}
                    className={`px-4 py-3 flex justify-between items-center ${
                      index % 2 === 0
                        ? 'bg-[#F1EFEC] dark:bg-[#202020]'
                        : 'bg-[#E6E4E0] dark:bg-[#1D1D1D]'
                    }`}
                  >
                    <div className="w-1/4">
                      <Link
                        to={`/forum/subcategory/${subcategory.id}`}
                        className="text-grey900 dark:text-[#C3BFC0] hover:text-[#F19A57] hover:underline"
                      >
                        {subcategory.name}
                      </Link>
                    </div>
                    <div className="w-1/4 text-center">{subcategory.threadCount}</div>
                    <div className="w-1/4 text-center">{subcategory.postCount}</div>
                    <div className="w-1/4 text-right">
                      {subcategory.latestPost ? (
                        <Link
                          to={`/forum/thread/${subcategory.latestPost.id}`}
                          className="text-[#C3BFC0] hover:text-[#F19A57] hover:underline"
                        >
                          {subcategory.latestPost.title} by {subcategory.latestPost.author.username}
                        </Link>
                      ) : (
                        'No posts yet'
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;

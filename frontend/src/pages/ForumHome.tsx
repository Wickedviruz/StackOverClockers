import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const ForumHome: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<{ name: string; description: string }>({ name: '', description: '' });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/forum/categories');
        setCategories(response.data);
      } catch (error) {
        console.error(error);
        alert('Could not fetch categories');
      }
    };

    const checkAdmin = () => {
      const admin = localStorage.getItem('is_admin');
      setIsAdmin(admin === 'true');
    };

    fetchCategories();
    checkAdmin();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/forum/categories', newCategory);
      setNewCategory({ name: '', description: '' });
      // Uppdatera listan
      const response = await api.get('/forum/categories');
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      alert('Could not create category');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">Forum Categories</h2>
      {isAdmin && (
        <div className="mb-6">
          <h3 className="text-2xl mb-4">Create New Category</h3>
          <form onSubmit={handleCreateCategory}>
            <div className="mb-4">
              <label className="block">Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
                className="w-full border p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block">Description</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full border p-2"
                rows={3}
              ></textarea>
            </div>
            <button type="submit" className="bg-green-500 text-white p-2">
              Create Category
            </button>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(category => (
          <Link to={`/forum/categories/${category.id}`} key={category.id} className="border p-4 rounded hover:bg-gray-100">
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p>{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ForumHome;

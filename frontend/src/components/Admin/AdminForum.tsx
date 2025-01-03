import React, { useState, useEffect } from 'react';
import { getForumCategories, createCategory, createSubcategory } from '../../services/api';

const AdminCategories: React.FC = () => {
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getForumCategories();
      console.log('Fetched categories:', fetchedCategories);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryName) {
      alert('Category name is required');
      return;
    }
    setLoading(true);
    try {
      await createCategory(categoryName);
      alert('Category created successfully!');
      setCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubcategory = async () => {
    if (!selectedCategory || !subcategoryName) {
      alert('Subcategory name and category are required');
      return;
    }
    setLoading(true);
    try {
      await createSubcategory(selectedCategory, subcategoryName);
      alert('Subcategory created successfully!');
      setSubcategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to create subcategory:', error);
      alert('Failed to create subcategory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Admin - Manage Categories</h1>

        {/* Create Category */}
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-sm font-medium">
            Create Category:
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white !important"
          />
          <button
            onClick={handleCreateCategory}
            disabled={loading}
            className="mt-2 px-4 py-2 text-white rounded bg-[#D26000] dark:bg-[#D26000] hover:bg[#ff7505] focus:outline-none focus:ring-2 focus:ring-[#ff7505] dark:focus:ring-[#ff7505] dark:hover:bg-[#ff7505]"
          >
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </div>

        {/* Create Subcategory */}
        <div className="mb-4">
          <label htmlFor="subcategoryName" className="block text-sm font-medium">
            Create Subcategory:
          </label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white !important"
        >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.name}
                </option>
            ))}
        </select>
          <input
            type="text"
            id="subcategoryName"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white !important"
          />
          <button
            onClick={handleCreateSubcategory}
            disabled={loading}
            className="mt-2 px-4 py-2 text-white rounded bg-[#D26000] dark:bg-[#D26000] hover:bg[#ff7505] focus:outline-none focus:ring-2 focus:ring-[#ff7505] dark:focus:ring-[#ff7505] dark:hover:bg-[#ff7505]"
          >
            {loading ? 'Creating...' : 'Create Subcategory'}
          </button>
        </div>

        {/* Categories List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Existing Categories</h2>
          {categories.length === 0 ? (
            <p>No categories available</p>
          ) : (
            <ul>
              {categories.map((cat) => (
                <li key={cat.id}>
                    <strong>{cat.name}</strong>
                    <ul>
                    {cat.subcategories.map((sub: { id: number; name: string }) => (
                        <li key={sub.id}>{sub.name}</li>
                    ))}
                    </ul>
                </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Flask backend URL

const api = axios.create({
  baseURL: API_URL,
});

// Lägg till en interceptor för att inkludera JWT-token i varje begäran
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// API för forum -- admin
export const createCategory = async (name: string) => {
  try {
    const response = await api.post('/forum/categories', { name });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const createSubcategory = async (categoryId: number, name: string) => {
  try {
    const response = await api.post(`/forum/categories/${categoryId}/subcategories`, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating subcategory:', error);
    throw error;
  }
};

// API för forum
export const getForumCategories = async () => {
  try {
    const response = await api.get('/forum/categories');
    console.log('Backend response in frontend:', response.data); // Logga backend-svaret
    return response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getThreadsInSubcategory = async (subcategoryId: number) => {
  try {
    const response = await api.get(`/forum/subcategories/${subcategoryId}/threads`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw error;
  }
};

export const createThread = async (subcategoryId: number, title: string, content: string) => {
  try {
    const response = await api.post('/forum/threads', { subcategory_id: subcategoryId, title, content });
    return response.data;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

export const getThreadDetails = async (threadId: number) => {
  try {
    const response = await api.get(`/forum/threads/${threadId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching thread details:', error);
    throw error;
  }
};

export const createComment = async (threadId: number, content: string) => {
  try {
    const response = await api.post(`/forum/threads/${threadId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};


// API för användarprofiler
export const getUserProfile = async (username: string) => {
  try {
    const response = await api.get(`/profile/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (
  username: string,
  data: {
    displayName?: string;
    title?: string;
    location?: string;
    aboutMe?: string;
    websiteLink?: string;
    twitterLink?: string;
    githubLink?: string;
  }
) => {
  try {
    const response = await api.put(`/profile/users/${username}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};


export default api;

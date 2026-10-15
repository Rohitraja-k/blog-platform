import axios from 'axios';

// Base API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / unauth
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid on protected request
      const isAuthRequest = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Posts endpoints
export const postsAPI = {
  getAll: (params) => API.get('/posts', { params }),
  getById: (id) => API.get(`/posts/${id}`),
  create: (data) => API.post('/posts', data),
  update: (id, data) => API.put(`/posts/${id}`, data),
  delete: (id) => API.delete(`/posts/${id}`),
};

// Comments endpoints
export const commentsAPI = {
  getByPost: (postId) => API.get(`/posts/${postId}/comments`),
  create: (postId, data) => API.post(`/posts/${postId}/comments`, data),
  update: (id, data) => API.put(`/comments/${id}`, data),
  delete: (id) => API.delete(`/comments/${id}`),
};

export default API;

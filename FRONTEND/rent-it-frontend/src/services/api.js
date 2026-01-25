import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response;
  },
  
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response;
  },
};

export const userService = {
  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
};

export const ownerService = {
  addItem: async (itemData) => {
    const user = userService.getCurrentUser();
    const payload = {
      ...itemData,
      userId: user.user_id,
      status: 'AVAILABLE',
    };
    const response = await api.post('/owner/items', payload);
    return response;
  },
  
  getMyItems: async () => {
    const user = userService.getCurrentUser();
    const response = await api.get(`/owner/items/${user.user_id}`);
    return response;
  },
};

export default api;
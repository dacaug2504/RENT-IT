import { adminServiceAPI } from './api';

// ==================== DASHBOARD ====================
export const getAdminStats = async () => {
  const res = await adminServiceAPI.get('/api/admin/stats');
  return res.data;
};

// ==================== USERS ====================
export const getAllUsers = async () => {
  const res = await adminServiceAPI.get('/api/admin/users');
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await adminServiceAPI.get(`/api/admin/users/${userId}`);
  return res.data;
};

export const getUsersByRole = async (roleId) => {
  const res = await adminServiceAPI.get(`/api/admin/users/role/${roleId}`);
  return res.data;
};

export const updateUserStatus = async (userId, status) => {
  const res = await adminServiceAPI.patch(
    `/api/admin/users/${userId}/status`,
    { status }
  );
  return res.data;
};

// ==================== STATISTICS ====================
export const getUserStatistics = async () => {
  const res = await adminServiceAPI.get('/api/admin/statistics');
  return res.data;
};

export const getTotalUsersCount = async () => {
  const res = await adminServiceAPI.get('/api/admin/statistics/total-users');
  return res.data;
};

export const getActiveUsersCount = async () => {
  const res = await adminServiceAPI.get('/api/admin/statistics/active-users');
  return res.data;
};

// ==================== CATEGORIES ====================
export const getAllCategories = async () => {
  const res = await adminServiceAPI.get('/api/admin/categories');
  return res.data;
};

export const getCategoryById = async (categoryId) => {
  const res = await adminServiceAPI.get(`/api/admin/categories/${categoryId}`);
  return res.data;
};

export const createCategory = async (data) => {
  const res = await adminServiceAPI.post('/api/admin/categories', data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await adminServiceAPI.put(`/api/admin/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await adminServiceAPI.delete(`/api/admin/categories/${id}`);
  return res.data;
};

// ==================== ITEMS ====================
export const getAllItems = async () => {
  const res = await adminServiceAPI.get('/api/admin/items');
  return res.data;
};

export const getItemsByCategory = async (categoryId) => {
  const res = await adminServiceAPI.get(`/api/admin/items/category/${categoryId}`);
  return res.data;
};

export const getItemById = async (itemId) => {
  const res = await adminServiceAPI.get(`/api/admin/items/${itemId}`);
  return res.data;
};

export const createItem = async (data) => {
  const res = await adminServiceAPI.post('/api/admin/items', data);
  return res.data;
};

export const updateItem = async (id, data) => {
  const res = await adminServiceAPI.put(`/api/admin/items/${id}`, data);
  return res.data;
};

export const deleteItem = async (id) => {
  const res = await adminServiceAPI.delete(`/api/admin/items/${id}`);
  return res.data;
};

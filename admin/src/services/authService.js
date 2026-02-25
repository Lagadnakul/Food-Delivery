import api from './api';

/**
 * Admin auth service.
 * POST /user/admin/login → { success, token, admin: { name, email } }
 */
export const adminLogin = async (email, password) => {
  const response = await api.post('/user/admin/login', { email, password });
  return response.data;
};

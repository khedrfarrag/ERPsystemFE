import axios from 'axios';
import toast from 'react-hot-toast';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5030/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً');
        window.location.href = '/login';
      }
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      toast.error('تعذر الاتصال بالسيرفر السحابي، يرجى التحقق من اتصال الإنترنت');
    }
    return Promise.reject(error);
  }
);

export const changePasswordApi = async (payload: { currentPassword: string; newPassword: string }) => {
  const response = await api.post('/auth/change-password', payload);
  return response.data;
};

export default api;

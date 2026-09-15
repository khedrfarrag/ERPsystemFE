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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept auth endpoints themselves (login, register, refresh)
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const currentRefreshToken = localStorage.getItem('refreshToken');

      if (!currentRefreshToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If a refresh is already in progress, enqueue this request until the new token arrives
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = 'Bearer ' + newToken;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        // Use raw axios to avoid interceptor recursion
        axios
          .post(`${API_BASE_URL}/auth/refresh`, { refreshToken: currentRefreshToken })
          .then((res) => {
            if (res.data?.success && res.data?.data) {
              const { accessToken, refreshToken: newRefreshToken } = res.data.data;
              localStorage.setItem('token', accessToken);
              if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
              }

              // Notify AuthContext of new token state
              window.dispatchEvent(
                new CustomEvent('retailos:token-refreshed', {
                  detail: { accessToken, refreshToken: newRefreshToken || currentRefreshToken },
                })
              );

              api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
              originalRequest.headers.Authorization = 'Bearer ' + accessToken;

              processQueue(null, accessToken);
              resolve(api(originalRequest));
            } else {
              throw new Error('Refresh response invalid');
            }
          })
          .catch((refreshError) => {
            processQueue(refreshError, null);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
              toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً');
              window.location.href = '/login';
            }
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    if (error.code === 'ERR_NETWORK' || (!error.response && !isAuthEndpoint)) {
      toast.error('تعذر الاتصال بالسيرفر السحابي، يرجى التحقق من اتصال الإنترنت');
    }

    return Promise.reject(error);
  }
);

export const changePasswordApi = async (payload: { currentPassword: string; newPassword: string }) => {
  const response = await api.post('/auth/change-password', payload);
  return response.data;
};

export const registerStoreApi = async (payload: {
  storeName: string;
  businessType: string;
  ownerFirstName: string;
  ownerLastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export default api;

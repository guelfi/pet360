import axios from 'axios';

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor: em um 401, tenta renovar a sessao uma vez via
// cookie httpOnly (refresh_token e enviado automaticamente, sem precisar
// ler nada do localStorage) antes de desistir e mandar pro login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
          window.location.href = `${basePath}/login`;
        }
      }
    }

    return Promise.reject(error);
  }
);

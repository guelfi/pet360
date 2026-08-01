import axios from 'axios';

// Instancia separada da API de tenant (lib/api.ts) - mesma baseURL, mas
// sem o interceptor de refresh de tenant (que chama /auth/refresh, rota
// errada para uma sessao de admin de plataforma). Cookies de admin
// (admin_access_token/admin_refresh_token) tem nomes distintos dos
// cookies de tenant, entao as duas sessoes convivem sem colisao.
export const adminApi = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

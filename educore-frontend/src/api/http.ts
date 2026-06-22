// src/api/http.ts
// Cliente Axios único. withCredentials=true es obligatorio: el refresh token
// viaja en una cookie httpOnly que pone el backend (sección 3.2 del informe),
// el frontend nunca la lee ni la maneja directamente.

import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
});

// Interceptor: si el access token expira (401) en cualquier request,
// intenta refrescar una sola vez usando la cookie y reintenta la petición original.
let refreshing: Promise<string> | null = null;

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const esLlamadaDeRefresh = originalRequest?.url?.includes('/api/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !esLlamadaDeRefresh) {
      originalRequest._retry = true;
      try {
        if (!refreshing) {
          refreshing = http
            .post('/api/auth/refresh')
            .then((res) => res.data.accessToken)
            .finally(() => {
              refreshing = null;
            });
        }
        const accessToken = await refreshing;
        setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return http(originalRequest);
      } catch {
        setAccessToken(null);
      }
    }
    return Promise.reject(error);
  },
);

let currentAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  currentAccessToken = token;
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}

export function getAccessToken() {
  return currentAccessToken;
}

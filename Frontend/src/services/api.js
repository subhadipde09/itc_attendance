import axios from 'axios';
import { store } from '../redux/store';
import { logout, setCredentials } from '../redux/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const refreshToken = store.getState().auth.refreshToken;
    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, { refreshToken });
        store.dispatch(setCredentials({ accessToken: data.accessToken, refreshToken, user: data.user }));
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (_refreshError) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * API client configuration
 * Simple axios instance - no authentication headers needed
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (though routes are not protected, keep for consistency)
    if (error.response?.status === 401) {
      localStorage.removeItem('username');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

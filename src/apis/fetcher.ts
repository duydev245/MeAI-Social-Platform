import envConfig from '@/config'
import axios from 'axios'

export const fetcher = axios.create({
  baseURL: envConfig.BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

fetcher.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Handle unauthorized error (e.g., token expired)
      // You can dispatch a logout action or redirect to the login page here
      console.warn('Unauthorized! Redirecting to login...')
      // Example: window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
)
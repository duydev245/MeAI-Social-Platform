import envConfig from '@/config'
import axios from 'axios'

export const fetcher = axios.create({
  baseURL: envConfig.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

fetcher.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    }
  }
)
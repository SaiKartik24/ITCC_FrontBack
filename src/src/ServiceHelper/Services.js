import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.restful-api.dev', // replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://172.17.15.253:3002', // replace with your API base URL
  headers: {
    'Content-Type': 'application/json',  
  },
});

export default axiosInstance;
import axios from 'axios';
import { useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext'; 

const useAxiosInstance = () => {
  const { token } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: 'http://172.17.15.253:3002',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  return axiosInstance;
};

export default useAxiosInstance;
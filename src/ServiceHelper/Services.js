// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://172.17.15.253:3002', // replace with your API base URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default axiosInstance;




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
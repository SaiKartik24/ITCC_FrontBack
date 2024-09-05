import { useState, useEffect } from 'react';
import useAxiosInstance from '../Services';

const useGet = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (url !== '') {
          const response = await axiosInstance.get(url);
          setData(response.data);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useGet;




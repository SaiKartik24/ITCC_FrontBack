import { useState } from 'react';
import axiosInstance from '../Services';

const usePut = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const putData = async (data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(url, data);
      setResponse(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { putData, response, loading, error };
};

export default usePut;

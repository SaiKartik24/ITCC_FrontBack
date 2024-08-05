import { useState } from 'react';
import axiosInstance from '../Services';

const useDelete = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const deleteData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(url);
      setResponse(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, response, loading, error };
};

export default useDelete;

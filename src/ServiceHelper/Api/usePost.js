// import { useState,useEffect } from 'react';
// import axiosInstance from '../Services';

// const usePost = (url, postData, trigger) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [response, setResponse] = useState(null);

//   useEffect(() => {
//     if (trigger && postData) {
//       const postRequest = async () => {
//         setLoading(true);
//         console.log(postData,"13");
//         try {
//           const response = await axiosInstance.post(url, postData);
//           setResponse(response.data);
//         } catch (err) {
//           setError(err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       postRequest();
//     }
//   }, [url, postData, trigger]);

//   return { response, loading, error };
// };

// export default usePost;


import { useState,useEffect } from 'react';
import useAxiosInstance from '../../ServiceHelper/Services';

const usePost = (url, postData, trigger) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const axiosInstance = useAxiosInstance();
  
  useEffect(() => {
    if (trigger && postData) {
      const postRequest = async () => {
        setLoading(true);
        try {
          console.log(postData,"13",url);
          if(url !==''){
            const response = await axiosInstance.post(url, postData);
            setResponse(response.data);
          }
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      postRequest();
    }
  }, [url, postData, trigger]);
  return { response, loading, error };
};

export default usePost;

// axiosConfig.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const setupInterceptors = (navigate) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403 && error.response.data.message === 'Account is disabled') {
        navigate('/disabled-account');
      }
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;

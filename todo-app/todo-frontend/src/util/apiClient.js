import axios from 'axios';
console.log('ENV', process.env);
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default apiClient;

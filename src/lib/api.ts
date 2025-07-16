    import axios from 'axios';

    const api = axios.create({
  baseURL: 'https://onecrate-backend.onrender.com/api',
  withCredentials: false, 
});


    export default api;

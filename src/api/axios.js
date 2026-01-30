import axios from 'axios';

const getBaseURL = () => {
    const envURL = import.meta.env.VITE_API_URL;
    if (envURL && envURL.trim() !== "" && envURL !== "undefined") {
        return envURL;
    }
    return 'https://eventify-backend-ne49.onrender.com';
};

const API = axios.create({
    baseURL: getBaseURL(),
});

console.log('API Base URL:', API.defaults.baseURL);

// Add a request interceptor to include the token in all requests
API.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;

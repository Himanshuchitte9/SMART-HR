import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const instance = axios.create({
    baseURL: API_URL
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => instance.post('/auth/register', data),
    login: (data) => instance.post('/auth/login', data)
};

export const instituteAPI = {
    create: (data) => instance.post('/institutes', data),
    getMyInstitutes: () => instance.get('/institutes')
};

export const roleAPI = {
    create: (data) => instance.post('/roles', data),
    getTree: (instituteId) => instance.get(`/roles/${instituteId}`)
};

export default instance;

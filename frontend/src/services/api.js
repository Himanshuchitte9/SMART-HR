import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// Users API
export const usersAPI = {
    getProfile: () => api.get('/users/profile'),
    getById: (id) => api.get(`/users/${id}`),
};

// Institutes API
export const institutesAPI = {
    create: (data) => api.post('/institutes', data),
    getAll: () => api.get('/institutes'),
    getPending: () => api.get('/institutes/pending'),
    getMyInstitutes: () => api.get('/institutes/my-institutes'),
    getById: (id) => api.get(`/institutes/${id}`),
    approve: (id, data) => api.put(`/institutes/${id}/approve`, data),
};

// Roles API
export const rolesAPI = {
    create: (data) => api.post('/roles', data),
    getByInstitute: (instituteId) => api.get(`/roles/institute/${instituteId}`),
    getOrgChart: (instituteId) => api.get(`/roles/institute/${instituteId}/org-chart`),
    getById: (id) => api.get(`/roles/${id}`),
    getPermissions: (id) => api.get(`/roles/${id}/permissions`),
    getInheritedPermissions: (id) => api.get(`/roles/${id}/permissions/inherited`),
    assignPermissions: (id, data) => api.put(`/roles/${id}/permissions`, data),
    delete: (id) => api.delete(`/roles/${id}`),
};

// Permissions API
export const permissionsAPI = {
    getAll: () => api.get('/roles/permissions'),
    getGrouped: () => api.get('/roles/permissions/grouped'),
};

export default api;

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

axios.defaults.baseURL = API_URL;

export const authAPI = {
    register: (data) => axios.post('/auth/register', data),
    login: (data) => axios.post('/auth/login', data)
};

export const instituteAPI = {
    create: (data) => axios.post('/institutes', data),
    getMyInstitutes: () => axios.get('/institutes')
};

export const roleAPI = {
    create: (data) => axios.post('/roles', data),
    getTree: (instituteId) => axios.get(`/roles/${instituteId}`)
};

export default axios;

import axios from 'axios';

const API_TOKEN = process.env.REACT_APP_API_TOKEN;

axios.interceptors.request.use(config => {
    if (config.url?.startsWith('/api/')) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${API_TOKEN}`;
    }
    return config;
});

export default axios;
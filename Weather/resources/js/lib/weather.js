import axios from 'axios';

const weatherClient = axios.create({
    baseURL: import.meta.env.VITE_WEATHER_API_URL,
});

weatherClient.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params['key'] = import.meta.env.VITE_WEATHER_API_KEY;
    return config;
});

export default weatherClient;
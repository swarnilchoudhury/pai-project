import axios from 'axios';
import { auth } from '../Configs/FirebaseConfig';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const somethingWrong = () => {
    alert("Something went wrong.Please try again.");
}

const unauthorized = async () => {
    await auth.signOut();
}

// Request interceptor
axios.interceptors.request.use(
    async (config) => {
        try {
            let token = await auth.currentUser.getIdToken();
            console.log('from axios.js', token);
            config.headers.Authorization = `Bearer ${token}`;
        } catch {
            throw new Error();
        }
        return config;
    },
    (error) => {
        somethingWrong();
        return Promise.reject(error);
    }
);

// Response interceptor
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            await unauthorized();
        }
        else {
            somethingWrong();
        }
        return Promise.reject(error);
    }
);

export default axios;

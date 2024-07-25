import axios from 'axios';
import { useNavigationInterceptor } from './Navigate';

const SetupInterceptors = () => {
    const navigate = useNavigationInterceptor();

    axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

    const sessionExpired = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
        sessionStorage.setItem("session_expired", "session_expired");
    }

    const refreshToken = async (currentToken) => {
        try {
            let response = await fetch(process.env.REACT_APP_BASE_URL + process.env.REACT_APP_REFRESH_TOKEN_API_URL, { //To stop infinite axios call
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                }
            });

            let responseJSON = await response.json();

            if (responseJSON) {
                localStorage.setItem("authToken", responseJSON.authToken);
                localStorage.setItem("authTokenTime", responseJSON.authTokenTime);
                return responseJSON.authToken;
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            throw new Error('Token refresh failed');
        }
    };

    // Request interceptor
    axios.interceptors.request.use(
        async (config) => {
            if (!config.url.includes("login")) {
                try {
                    let token = localStorage.getItem('authToken');
                    let authTokenTime = localStorage.getItem("authTokenTime");

                    if (authTokenTime && token) {

                        let currentDate = new Date();

                        // Calculate time difference in milliseconds
                        let time_difference = new Date(authTokenTime).getTime() - currentDate.getTime();

                        // Calculate days difference by dividing total milliseconds in a day
                        let days_difference = time_difference / (1000 * 60 * 60 * 24);

                        if (days_difference >= 0 && days_difference <= 0.5) {
                            token = await refreshToken(token);
                        }
                        else if (days_difference < 0) {
                            throw new Error('sessionExpired');
                        }

                        config.headers.Authorization = `Bearer ${token}`;
                    } else {
                        throw new Error('No token found');
                    }
                } catch (error) {
                    return sessionExpired();
                }
            }

            return config;
        },
        (error) => {
            let message = "Something_Error";
            navigate("/login", { state: message });
            return Promise.reject(error);
        }
    );

    // Response interceptor
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 400) {
                alert("Something went wrong.Please try again.");
            }
            else {
                sessionExpired();
            }
            return Promise.reject(error);
        }
    );
}

export default SetupInterceptors;

import axios from 'axios';
import { auth } from '../Configs/FirebaseConfig';
import { useNavigationInterceptor } from './Navigate';
import { signInWithCustomToken } from 'firebase/auth';

const SetupInterceptors = () => {

    const navigate = useNavigationInterceptor();

    axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

    const sessionExpired = () =>{
        localStorage.clear();
        navigate("/login");  
        sessionStorage.setItem("session_expired","session_expired");
        return Promise.reject(new Error('Session expired'));
    }

    //Send Requests
    axios.interceptors.request.use(
        async (config) => {
            if (!config.url.includes("login")) {
                try {
                    // Get the current date and time
                    const currentDate = new Date();

                    // Get the token from localStorage
                    let token = localStorage.getItem('authToken');

                    let authTokenTime = localStorage.getItem("expiresAt");

                    if (authTokenTime && token) {
                        // Calculate the difference in milliseconds between futureDate and currentDate
                        const differenceInMilliseconds = authTokenTime ? (authTokenTime - currentDate.getTime()) : 0;

                        // Calculate the equivalent of 5 minutes in milliseconds
                        const minutesInMilliseconds = 5 * 60 * 1000;

                        //Check if the difference is within 5 minutes
                        if (differenceInMilliseconds <= minutesInMilliseconds) {

                            let response = await axios.get(process.env.REACT_APP_REFRESH_TOKEN_API_URL, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });

                            if(response.data.customToken != undefined && response.data.customToken != null){
                                let customToken = await signInWithCustomToken(auth,response.customToken);
                                let newToken = customToken.user.getIdToken(true);
                                localStorage.setItem("authToken", newToken);
                            }
                        }
                        
                        // Add Authorization header with Bearer token
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    else {
                        throw new Error();
                    }
                }
                catch {
                    sessionExpired();
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

    //Receive Response
    axios.interceptors.response.use(
        (response) => response,
        (e) => {
            sessionExpired();
        }
    )
}

export default SetupInterceptors;

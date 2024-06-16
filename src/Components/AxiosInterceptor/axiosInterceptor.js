import axios from 'axios';
import { auth } from '../Configs/FirebaseConfig';
import Cookies from 'js-cookie';
import { useNavigationInterceptor } from './Navigate';


const SetupInterceptors = () => {

    const navigate = useNavigationInterceptor();
    //Send Requests
    axios.interceptors.request.use(
        async (config) => {
            if (!config.url.includes("login")) {
                try {
                    // Get the current date and time
                    const currentDate = new Date();

                    let cookieTime = Cookies.get("expiresAt");

                    if (cookieTime != undefined) {
                        // Calculate the difference in milliseconds between futureDate and currentDate
                        const differenceInMilliseconds = cookieTime ? (Cookies.get("expiresAt") - currentDate.getTime()) : 0;

                        // Calculate the equivalent of 5 minutes in milliseconds
                        const minutesInMilliseconds = 5 * 60 * 1000;

                        //Check if the difference is within 5 minutes
                        if (differenceInMilliseconds <= minutesInMilliseconds) {

                            await axios.get(process.env.REACT_APP_REFRESH_TOKEN_API_URL, {
                                withCredentials: true
                            });
                        }

                    }
                    else{
                        throw new Error();
                    }

                }
                catch (error) {
                    localStorage.clear();
                    let message = "Session_expire";
                    navigate("/", { state: message });
                    return Promise.reject(new Error('Session expired'));
                }
            }

            config.withCredentials = true;
            return config;
        },
        (error) => {
            let message = "Something_Error";
            navigate("/", { state: message });
            return Promise.reject(error);
        }
    );

    //Receive Response
    axios.interceptors.response.use(
        (response) => response,
        (e) => {
            localStorage.clear();
            let message = "Session_expire";
            navigate("/", { state: message });
            return Promise.reject(new Error('Session expired'));
        }
    )
}

export default SetupInterceptors;

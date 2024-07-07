import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoginForm from "./Components/LoginForm/LoginForm.js";
import SetupInterceptors from "./Components/AxiosInterceptor/axiosInterceptor.js";
import PageNotFound from "./Components/PageNotFound/PageNotFound.jsx";
import HomePage from "./Components/HomePage/HomePage.js";
import RecordsPage from "./Components/RecordsPage/RecordsPage.js";
import Spinner from "./Components/Spinner/Spinner.js";
import NavBar from "./Components/NavBar/NavBar.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoadingSpin, setShowLoadingSpin] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const authFromLocalStorage = localStorage.getItem('authToken');

    setIsAuthenticated(false);
    setShowLoadingSpin(true);

    if (!authFromLocalStorage) {
      navigate("/Login");
      setShowLoadingSpin(false);
    }
    else {
      const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setShowLoadingSpin(false);
        if (location.pathname.includes("/Login") || location.pathname.endsWith('/')) {
          navigate("/Home");
        } else {
          navigate(location.pathname);
        }
      };

      const handleAuthFailure = () => {
        setIsAuthenticated(false);
        setShowLoadingSpin(false);
        navigate("/Login", { state: { session_expired: "session_expired" } });
      };

      const verifyToken = () => {
        try {
          axios.post(process.env.REACT_APP_VERIFY_TOKEN_API_URL)
            .then(() => {
              handleAuthSuccess();
            }).catch(() => {
              handleAuthFailure();
            });

        } catch {
          handleAuthFailure();
        }
      };

      const authenticateUser = () => {
        if (authFromLocalStorage) {
          if (location.pathname.includes("/Login")) {
            verifyToken();
          } else {
            handleAuthSuccess();
          }
        } else {
          setIsAuthenticated(false);
          setShowLoadingSpin(false);

          if (!location.pathname.includes("/Login")) {
            navigate("/Login", { state: { loginIn: "loginIn" } });
          }
          else {
            navigate("/Login");
          }
        }
      };

      authenticateUser();
    }

  }, [navigate]);

  return (
    <>
      <SetupInterceptors />
      {isAuthenticated ? <NavBar UserName={localStorage.getItem("UserName")}/> : <></>}
      {showLoadingSpin ? (
        <Spinner Text="Please Wait..." />
      ) : (
        <Routes>
          {!isAuthenticated ? (
            <Route path="/Login" element={<LoginForm />} />
          ) : (
            <>
              <Route path="/Home" element={<HomePage />} />
              <Route path="/Records" element={<RecordsPage />} />
              <Route path="*" element={<PageNotFound />} />
            </>
          )}
        </Routes>
      )}
    </>
  );
}

export default App;

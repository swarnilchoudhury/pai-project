import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from "./Configs/FirebaseConfig";
import LoginForm from "./Components/LoginForm/LoginForm";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import HomePage from "./Components/HomePage/HomePage";
import Spinner from "./Components/Spinner/Spinner";
import NavBar from "./Components/NavBar/NavBar";
import axios from './Components/AxiosInterceptor/AxiosInterceptor';
import { usePermissions } from "./Context/PermissionContext";
import PaymentsPage from "./Components/PaymentsPage/PaymentsPage";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoadingSpin, setShowLoadingSpin] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const { userName, setEditPermissions } = usePermissions();

  // Set onAuthStateChanged observer when App mounts
  useEffect(() => {

    //  Set persistence to local storage explicitly
    setPersistence(auth, browserLocalPersistence).then(() => {
      //  Set up an auth state observer
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setShowLoadingSpin(true);
        if (user) {
          //  User is signed in
          try {
            if (location.pathname.includes("/Login") || location.pathname.endsWith('/login') || location.pathname.endsWith('/')) {
              navigate("/Home");
            } else {
              navigate(location.pathname);
            }
            const response = await axios.get(process.env.REACT_APP_PERMISSIONS_API_URL);

            if (response.data.isEditPermissions) {
              setEditPermissions(true);
            }
            else {
              setEditPermissions(false);
            }
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error getting ID token:", error);
            navigate("/Login");
            setIsAuthenticated(false);
          }
        } else {
          //  No user is signed in
          navigate("/Login");
          console.log("No user is signed in");
          setIsAuthenticated(false);
        }
        setShowLoadingSpin(false);
      });

      //  Clean up the listener on component unmount
      return () => unsubscribe();
    });
  }, []); //  eslint-disable-line

  return (
    <>
      {isAuthenticated ? <NavBar UserName={userName || localStorage.getItem('UserName')} /> : null}
      {showLoadingSpin ? (
        <Spinner Text="Please Wait..." />
      ) : (
        <Routes>
          {!isAuthenticated ? (
            <Route path="/Login" element={<LoginForm />} />
          ) : (
            <>
              <Route path="/Home" element={<HomePage />} />
              <Route path="/Payments" element={<PaymentsPage />} />
              <Route path="*" element={<PageNotFound />} />
            </>
          )}
        </Routes>
      )}
    </>
  );
}

export default App;

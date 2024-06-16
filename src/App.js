import {
  Routes,
  Route
} from "react-router-dom";

import LoginForm from "./Components/LoginForm/LoginForm.js";
import SetupInterceptors from "./Components/AxiosInterceptor/axiosInterceptor.js";
import HOC from "./Components/HOC/HOC.js";

function App() {

  return (
    <>
    <SetupInterceptors/>
    <Routes>
       <Route exact path='/' element={<LoginForm/>}/>
       <Route exact path='/Home' element={<HOC pageName='HomePage'/>}/>
       <Route exact path='/Records' element={<HOC pageName='Records'/>}/>
       <Route path="*" element={<HOC/>} />
       </Routes>
    </>
  );
}

export default App;

import {
  Routes,
  Route
} from "react-router-dom";

import LoginForm from "./Components/LoginForm/LoginForm.js";
import Authentication from "./Components/Authentication.js";

function App() {

  return (
    <>
    <Routes>
       <Route exact path='/' element={<LoginForm/>}/>
       <Route exact path='/Home' element={<Authentication pageName='HomePage'/>}/>
       <Route exact path='/Search' element={<Authentication pageName='Search'/>}/>
       <Route path="*" element={<Authentication/>} />
       </Routes>
    </>
  );
}

export default App;

import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route
} from "react-router-dom";

import LoginForm from "./Components/LoginForm/LoginForm.js";
import HomePage from "./Components/HomePage/HomePage.js";

function App() {

  return (
    <>
    <Routes>
       <Route exact path='/' element={<LoginForm/>}/>
       <Route exact path='/Home' element={<HomePage pageName='Create'/>}/>
       <Route exact path='/Search' element={<HomePage pageName='Search'/>}/>
       </Routes>
    </>
  );
}

export default App;

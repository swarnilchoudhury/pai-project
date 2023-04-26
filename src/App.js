import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route
} from "react-router-dom";

import LoginForm from "./Components/LoginForm/LoginForm.js";

function App() {

  return (
    <>
    <Routes>
       <Route exact path='/' element={<LoginForm/>}/>
       </Routes>
    </>
  );
}

export default App;

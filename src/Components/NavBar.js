import React,{useState} from 'react'
import { auth } from '../Components/FirebaseConfig.js';
import LoginForm from './LoginForm/LoginForm.js';

const NavBar = (props) => {
    const [isLogout, setisLogout] = useState(false);

    const LogoutBtnOnClick = async (e) =>{
      let response = await auth.signOut();
      if(response !== null){
        setisLogout(true)
      }
    }

    return (
        <>
        {!isLogout?<div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Welcome, {props.UserName}</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled">Disabled</a>
                            </li>
                        </ul>
                        <form className="d-flex">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page"></a>                        
                            </li>
                            <li>
                            <button className="btn btn-primary" onClick={(e) => LogoutBtnOnClick(e)}>LOGOUT</button>
                            </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
   
   :<> <LoginForm Message={true}/> </> }
        </>
    )
}

export default NavBar

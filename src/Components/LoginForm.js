import React, { useState } from 'react'
import '../ComponetsStyles/LoginForm.css'

export default function LoginForm(props) {

    const [EmailTxt, setEmailTxt] = useState("");
    const [PasswordTxt, setPasswordTxt] = useState("");

    const LoginBtnOnClick = (e) => {
        e.preventDefault();

        if(EmailTxt == "" || PasswordTxt == ""){
           document.getElementById("ErrorMessage").innerText="Hello";
           document.getElementById("ErrorMessage").className = "alert alert-danger";
           document.getElementById("ErrorMessage").role = "alert";
        }
        else{}
      }

    return (
        <div>
            <section className="vh-100" style={{ "backgroundColor": "#508bfc" }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <h1 id="hText" className="mb-5">Welcome to PAI</h1>
                                    <p className="mb-5 pText">Please Log In to continue</p>

                                    <div className="form-outline mb-4">
                                        <input type="email" id="EmailTxt" placeholder='Email' className="form-control form-control-lg" onChange={(e)=>setEmailTxt(e.target.value)}/>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input type="password" id="PasswordTxt" placeholder='Password' className="form-control form-control-lg" onChange={(e)=>setPasswordTxt(e.target.value)}/>
                                    </div>

                                    <button id="LoginBtn" className="btn btn-primary" type="submit" onClick={(e)=>LoginBtnOnClick(e)}>Login</button>
                                    <br />
                                    <br />
                                    <div id="ErrorMessage" style={props.ErrMessageStyle}>{props.Message}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

LoginForm.defaultProps = {
    Message: ""
  }

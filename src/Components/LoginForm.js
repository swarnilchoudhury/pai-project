import React from 'react'
import '../ComponetsStyles/LoginForm.css'

export default function LoginForm() {
    return (
        <div>
            <section className="vh-100" style={{ "backgroundColor": "#508bfc" }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                <h1 id="hText" className="mb-5">Welcome to PAI</h1>
                                    <p id="pText" className="mb-5 pText">Please Log In to continue</p>

                                    <div className="form-outline mb-4">
                                        <input type="email" id="EmailTxt" placeholder='Email' className="form-control form-control-lg" />
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input type="password" id="PasswordTxt" placeholder='Password' className="form-control form-control-lg" />
                                    </div>

                                    <button id="LoginBtn" className="btn btn-primary" type="submit">Login</button>

                                    

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

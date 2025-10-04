import React from 'react';
import '../../ComponetsStyles/PageNotFound.css';
import { Link } from 'react-router-dom';

const PageNotFound = () => {

    return (
        <div className="page-not-found">
            <section className="vh-200">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <p className="mb-4 pText" style={{ "fontWeight": "bold", "fontSize": "30px" }}>Page Not Found.</p>
                                    <p className="mb-4 pText" style={{ "fontWeight": "bold" }}>Sorry, the page you are looking for does not exist.</p>
                                    <Link to='/Home/Active'>Go to Home</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PageNotFound

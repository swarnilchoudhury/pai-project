import React from 'react';
import './PageNotFound.css';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    
  return (
    <div className="page-not-found">
      <h1>Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to='/Home'>Go to Home</Link>
    </div>
  )
}

export default PageNotFound

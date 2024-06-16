import React from 'react';
import LoadingSpin from "react-loading-spin";
import '../../ComponetsStyles/Spinner.css';

const Spinner = () => {
  return (
    <div>
       <LoadingSpin className='spinner'/>
       <p className='spinner' style={{'fontfamily': "'Open Sans', 'sans-serif'" ,'fontsize': '18px'}}>Loading...</p>
    </div>
  )
}

export default Spinner

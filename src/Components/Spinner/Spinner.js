import React from 'react';
import LoadingSpin from 'react-loading-spin';
import '../../ComponetsStyles/Spinner.css';

const Spinner = ({ Text }) => {
  return (
    <div className='spinner-container'>
      <LoadingSpin className='spinner' />
      <p className='spinner-text'>{Text}</p>
    </div>
  );
}

export default Spinner;


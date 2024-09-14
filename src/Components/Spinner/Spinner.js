import React from 'react';
import LoadingSpin from 'react-loading-spin';
import '../../ComponetsStyles/Spinner.css';
import PropTypes from 'prop-types';

const Spinner = ({ Text }) => {

  //Props validations
  Spinner.propTypes = {
    Text: PropTypes.string.isRequired
  };

  return (
    <div className='spinner-container'>
      <LoadingSpin className='spinner' />
      <p className='spinner-text'>{Text}</p>
    </div>
  );
}

export default Spinner;


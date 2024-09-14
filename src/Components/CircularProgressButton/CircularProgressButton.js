import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import "../../ComponetsStyles/CircularProgressButton.css";

const CircularProgressButton = ({ Text, id }) => {

    //Props validations
    CircularProgressButton.propTypes = {
        Text: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    };

    return (
        <div>
            <Button variant="contained" id={id} disabled={true}><CircularProgress disableShrink style={{ color: "grey", marginRight: "1rem" }} />{Text}</Button>
        </div>
    )
}

export default CircularProgressButton

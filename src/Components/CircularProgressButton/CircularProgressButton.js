import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import "../../ComponetsStyles/CircularProgressButton.css";

const CircularProgressButton = ({ Text,id }) => {

    return (
        <div>
            <Button variant="contained" id={id} disabled={true}><CircularProgress disableShrink style={{ color: "grey", marginRight: "1rem" }} />{Text}</Button>
        </div>
    )
}

export default CircularProgressButton

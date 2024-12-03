import React from 'react';
import { Autocomplete, MenuItem, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import CheckIcon from '@mui/icons-material/Check';

const MultipleAutocomplete = ({ values, selectedValues, setSelectedValues }) => {

    MultipleAutocomplete.propTypes = {
        values: PropTypes.arrayOf(PropTypes.string).isRequired,
        selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
        setSelectedValues: PropTypes.func.isRequired
    };

    // Function to handle selection changes
    const handleSelectionChange = (event, newValue) => {
        setSelectedValues(newValue); // Update the state with new selected values
    };

    return (
        <Autocomplete
            sx={{ m: 1, width: 500 }}
            multiple
            id="tags-standard"
            options={values}
            getOptionLabel={(option) => option}
            disableCloseOnSelect
            value={selectedValues} // Bind state to Autocomplete value
            onChange={handleSelectionChange} // Handle selection changes
            renderOption={(props, option, { selected }) => (
                <MenuItem
                    key={option}
                    value={option}
                    sx={{ justifyContent: "space-between" }}
                    {...props}
                >
                    {option}
                    {selected ? <CheckIcon color="info" /> : null}
                </MenuItem>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Select Students"
                />
            )}
        />
    );
};

export default MultipleAutocomplete;

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';

export default function EditForm({
  onSubmit,
  formConfig,
  initialValues,
  isDisabled
}) {

  // Props validations
  EditForm.propTypes = {
    isDisabled: PropTypes.bool,
    formConfig: PropTypes.object,
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object
  };

  const [formValues, setFormValues] = useState(initialValues);

  const [isBtnEnabled, setIsBtnEnabled] = useState(false);

  const [open, setOpen] = useState(true);

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  useEffect(() => {
    const isDataChanged = JSON.stringify(formValues) !== JSON.stringify(initialValues);
    setIsBtnEnabled(isDataChanged);
  }, [formValues]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues);
    onClose();
  };

  const onClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      PaperProps={{
        component: 'form',
        onSubmit: handleFormSubmit,
      }}
    >
      <DialogTitle>{initialValues.title || 'Form'}</DialogTitle>
      <DialogContent>
        {formConfig.fields.map((field) => (
          <div className="form-group row" key={field.name}>
            <label
              htmlFor={field.name}
              className="col-sm-6 col-form-label"
            >
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            {
              field.type === "Dropdown"
                ?
                <Box>
                  <FormControl fullWidth>
                    <Select
                      value={formValues[field.name]}
                      onChange={(e) =>
                        handleInputChange(field.name, field.transform ? field.transform(e.target.value) : e.target.value)
                      }
                    >
                      {field.data.map((data) => (
                        <MenuItem key={data.value} value={data.value}>{data.name}</MenuItem>
                      ))
                      }
                    </Select>
                  </FormControl>
                </Box>
                : <input
                  type={field.type || 'text'}
                  className="form-control"
                  id={field.name}
                  value={formValues[field.name] || ''}
                  disabled={isDisabled}
                  onChange={(e) =>
                    handleInputChange(field.name, field.transform ? field.transform(e.target.value) : e.target.value)
                  }
                  required={field.required} />
            }
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!isBtnEnabled} type="submit">{initialValues.btnName}</Button>
      </DialogActions>
    </Dialog>
  );
}

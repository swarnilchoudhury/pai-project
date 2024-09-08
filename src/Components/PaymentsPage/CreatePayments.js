import React, { useEffect, useState } from 'react'
import MultipleDropdown from '../MultipleDropdown/MultipleDropdown'
import { usePermissions } from '../Context/PermissionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from '../AxiosInterceptor/axiosInterceptor';

const CreatePayments = () => {

    const { editPermissions } = usePermissions();
    const navigate = useNavigate();

    const [selectedValues, setSelectedValues] = useState([]);
    const [values, setValues] = useState(['Loading...']);

    useEffect(() => {
        if (!editPermissions) {
            navigate('/Home');
        }
        else {
            fetchPaymentsStudentViews();
        }
    }, [editPermissions, navigate])

    const fetchPaymentsStudentViews = async () => {
        let response = await axios.get(process.env.REACT_APP_PAYMENTS_VIEWS_API_URL);
        setValues(response.data);
    }

    return (
        <div>
            <section className="vh-50">
                <div className="container py-5 h-50">
                    <div className="row d-flex justify-content-center align-items-center h-50">
                        <div className="formDiv">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <br />
                                    <form className="form" id="create-form" >
                                        <div className="form-group row">
                                            <MultipleDropdown values={values} selectedValues={selectedValues} setSelectedValues={setSelectedValues} />
                                        </div>
                                        <div className="form-group row">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker label={'Payments Date'} views={['month', 'year']}/>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='LevelTxt' className="col-sm-2 col-form-label">Amount <span className='required'>*</span></label>
                                            <input type="number" className="form-control" id="LevelTxt" required />
                                        </div>
                                        <br />
                                    </form>
                                    <hr className="custom-line" />
                                    <Button variant="contained" id="createtHomeBtn" form="create-form" type="submit">SAVE</Button>
                                </div>
                            </div >
                        </div >
                    </div >
                </div >
            </section >
        </div>

    )
}

export default CreatePayments

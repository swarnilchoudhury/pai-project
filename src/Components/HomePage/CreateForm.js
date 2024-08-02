import React, { useState, useEffect } from 'react';
import DialogBoxes from '../DialogBoxes/DialogBoxes';
import { MdOutlineReplay } from "react-icons/md";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import '../../ComponetsStyles/CreateForm.css';
import axios from '../AxiosInterceptor/axiosInterceptor';

const CreateForm = () => {

    const [dates, setDates] = useState({
        selectedDOBDate: "",
        selectedAdmissionDate: ""
    });

    let defaultformsTxts = {

        studentName: "",
        guardianName: "",
        studentCode: "",
        phoneNumber: "",
        DOB: "",
        AdmissionDate: ""
    }


    const [formsTxts, setformsTxts] = useState(defaultformsTxts);

    const [showDialogBox, setshowDialogBox] = useState(false);
    const [showFullForm, setshowFullForm] = useState(false);

    const [showMessage, setshowMessage] = useState({});

    const [count, setCount] = useState(0);


    const dateFormater = (datePrm) => {

        const date = dayjs(datePrm);
        const formattedDate = date.format('DD/MM/YYYY');
        return formattedDate;

    }

    useEffect(() => {
        setformsTxts(prevFormsTxts => ({
            ...prevFormsTxts,
            DOB: dates.selectedDOBDate ? dateFormater(dates.selectedDOBDate) : "",
            AdmissionDate: dates.selectedAdmissionDate ? dateFormater(dates.selectedAdmissionDate) : ""
        }));
    }, [dates]);

    const handleStudentCodeInputChange = (e) => {
        const { value } = e.target;
        const maxLength = 4;

        if (value.length <= maxLength) {
            setformsTxts({ ...formsTxts, studentCode: value.toUpperCase() });
        }
    };

    const handlePhoneNumberInputChange = (e) => {
        const { value } = e.target;
        const maxLength = 10;

        if (value.length <= maxLength) {
            setformsTxts({ ...formsTxts, phoneNumber: e.target.value.toUpperCase() });
        }
    };

    const SearchButtonOnClick = async (e) => {

        e.preventDefault();
        let response = await axios.post(process.env.REACT_APP_SEARCH_CODE_API_URL,
            { "studentCode": formsTxts.studentCode });

        if (response.data) {
            if (response.data.returnCode === 1) {
                setshowDialogBox(true);
                setCount(count => count + 1)
                setshowMessage({
                    TextDialogContent: formsTxts.studentCode + " already exists.",
                    TextDialogTitle: "",
                    TextDialogButton: "OK"
                });
                setshowFullForm(false);
            }
            else {
                setshowDialogBox(false);
                setshowFullForm(true);
            }
        }
    }

    const ResetButtonOnClick = (e) => {

        e.preventDefault();
        setshowFullForm(false);
        setformsTxts(defaultformsTxts);
    }

    const CreateBtnOnClick = async (e) => {

        e.preventDefault();

        let response = await axios.post(process.env.REACT_APP_CREATE_API_URL,
            JSON.stringify(formsTxts), {
                headers: {
                  'Content-Type': 'application/json'
                }});

        setshowDialogBox(true);
        setCount(count => count + 1)
        setshowMessage({
            TextDialogContent: response.data.message,
            TextDialogTitle: "",
            TextDialogButton: "OK"
        });

        ResetButtonOnClick(e);
    }


    const ClearHomeBtnOnClick = (e) => {

        e.preventDefault();

        setCount(count => count + 1);
        setformsTxts({ ...defaultformsTxts, studentCode: formsTxts.studentCode });
        setshowDialogBox(false);

    }

    return (
        <>

            <div>
                <section className="vh-200">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="formDiv">
                                <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                    <div className="card-body p-5 text-center">
                                        <div className="form-group row">
                                            {showDialogBox && <DialogBoxes key={count} {...showMessage} />}
                                            {
                                                !showFullForm
                                                    ?
                                                    <>
                                                        <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code <span className='required'>*</span></label>
                                                        <div className="col-sm-10">
                                                            <input type="number" className="form-control" id="StudentCodeTxt" disabled={false} value={formsTxts.studentCode}
                                                                onChange={handleStudentCodeInputChange} />
                                                            <br />
                                                            <Button variant="contained" disabled={!formsTxts.studentCode} onClick={(e) => SearchButtonOnClick(e)}><SearchIcon />Search</Button>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code <span className='required'>*</span></label>
                                                        <div className="col-sm-10">
                                                            <input type="number" className="form-control" id="StudentCodeTxt" disabled={true} value={formsTxts.studentCode} onChange={(e) => setformsTxts({ ...formsTxts, studentCode: e.target.value.toUpperCase() })} />
                                                            <br />
                                                        </div>
                                                        <div className='buttons'>
                                                            <Button variant="contained" id="ClearHomeBtn" type="reset" onClick={(e) => ClearHomeBtnOnClick(e)}><MdOutlineReplay /> Clear</Button>
                                                            <Button variant="contained" id="ClearHomeBtn" type="reset" onClick={(e) => ResetButtonOnClick(e)}><CloseIcon /> Reset</Button>
                                                        </div>
                                                        <div className='dash'>
                                                            -----------------------------------------------------
                                                        </div>
                                                        <br />
                                                        <form className="form" id="create-form" onSubmit={CreateBtnOnClick}>
                                                            {
                                                                showFullForm &&
                                                                <>
                                                                    <div className="form-group row">
                                                                        <label htmlFor='studentNameTxt' className="col-sm-2 col-form-label">Student Name <span className='required'>*</span></label>
                                                                        <div className="col-sm-10">
                                                                            <input type="text" className="form-control" id="studentNameTxt" value={formsTxts.studentName} onChange={(e) => setformsTxts({ ...formsTxts, studentName: e.target.value.toUpperCase() })} required />
                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                    <div className="form-group row">
                                                                        <label htmlFor='guardianNameTxt' className="col-sm-2 col-form-label">Guardian Name <span className='required'>*</span></label>
                                                                        <div className="col-sm-10">
                                                                            <input type="text" className="form-control" id="guardianNameTxt" value={formsTxts.guardianName} onChange={(e) => setformsTxts({ ...formsTxts, guardianName: e.target.value.toUpperCase() })} required />
                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                    <div className="form-group row">
                                                                        <label htmlFor='LevelTxt' className="col-sm-2 col-form-label">Phone Number</label>
                                                                        <div className="col-sm-10">
                                                                            <input type="number" className="form-control" id="LevelTxt" value={formsTxts.phoneNumber} onChange={handlePhoneNumberInputChange} />
                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                    <div className="form-group row">
                                                                        <label htmlFor='DateOfBirth' className="col-sm-2 col-form-label">Date of Birth</label>
                                                                        <div className="col-sm-10">
                                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                <DemoContainer components={['DatePicker']}>
                                                                                    <DatePicker label="Date of Birth"
                                                                                        onChange={(e) => setDates({ ...dates, selectedDOBDate: e })}
                                                                                        format="DD/MM/YYYY"
                                                                                        slotProps={{
                                                                                            textField: {
                                                                                                helperText: 'DD/MM/YYYY',
                                                                                            },
                                                                                        }} />
                                                                                </DemoContainer>
                                                                            </LocalizationProvider>
                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                    <div className="form-group row">
                                                                        <label htmlFor='AdmissionDate' className="col-sm-2 col-form-label">Admission Date</label>
                                                                        <div className="col-sm-10">
                                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                <DemoContainer components={['DatePicker']}>
                                                                                    <DatePicker label="Admission Date"
                                                                                        onChange={(e) => setDates({ ...dates, selectedAdmissionDate: e })}
                                                                                        format="DD/MM/YYYY"
                                                                                        slotProps={{
                                                                                            textField: {
                                                                                                helperText: 'DD/MM/YYYY',
                                                                                            },
                                                                                        }} />
                                                                                </DemoContainer>
                                                                            </LocalizationProvider>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            }

                                                        </form>
                                                        <div className='dash'>
                                                            -----------------------------------------------------
                                                        </div>
                                                        <Button variant="contained" id="submitHomeBtn" form="create-form" type="submit">Create</Button>
                                                    </>
                                            }
                                        </div>
                                    </div >
                                </div >
                            </div >
                        </div >
                    </div >
                </section >
            </div >
        </>
    )
}

export default CreateForm

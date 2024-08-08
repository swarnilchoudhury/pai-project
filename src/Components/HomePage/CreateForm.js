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
import DialogSomethingWrong from '../DialogBoxes/DialogSomethingWrong';

const CreateForm = () => {

    let defaultformsTxts = {

        StudentName: "",
        GuardianName: "",
        StudentCode: "",
        PhoneNumber: "-"
    }

    const [isBtnLoading, setisBtnLoading] = useState(false);
    const [formsTxts, setformsTxts] = useState(defaultformsTxts);

    const [showDialogBox, setshowDialogBox] = useState(false);
    const [showFullForm, setshowFullForm] = useState(false);
    const [showSomethingWrongDialogBox, setShowSomethingWrongDialogBox] = useState(false);
    const [showMessage, setshowMessage] = useState({});

    const [count, setCount] = useState(0);

    const [dates, setDates] = useState({
        selectedDOBDate: "",
        selectedAdmissionDate: ""
    });


    const dateFormater = (datePrm) => {

        const date = dayjs(datePrm);
        const formattedDate = date.format('DD/MM/YYYY');
        return formattedDate;

    }

    useEffect(() => {
        setformsTxts(prevFormsTxts => ({
            ...prevFormsTxts,
            DOB: dates.selectedDOBDate ? dateFormater(dates.selectedDOBDate) : "-",
            AdmissionDate: dates.selectedAdmissionDate ? dateFormater(dates.selectedAdmissionDate) : "-"
        }));
    }, [dates]);

    const handleStudentCodeInputChange = (e) => {
        const { value } = e.target;
        const maxLength = 4;

        if (value.length <= maxLength) {
            setformsTxts({ ...formsTxts, StudentCode: value.toUpperCase() });
        }
    };

    const handlePhoneNumberInputChange = (e) => {
        const { value } = e.target;
        const maxLength = 10;

        if (value.length <= maxLength) {
            setformsTxts({ ...formsTxts, PhoneNumber: e.target.value.toUpperCase() });
        }
    };

    const SearchButtonOnClick = async (e) => {

        e.preventDefault();
        setisBtnLoading(true);

        try {
            let response = await axios.post(process.env.REACT_APP_SEARCH_CODE_API_URL,
                { "StudentCode": formsTxts.StudentCode });

            if (response.data) {
                if (response.data.returnCode === 1) {
                    setshowDialogBox(true);
                    setshowMessage({
                        TextDialogContent: formsTxts.StudentCode + " already exists.",
                        TextDialogTitle: "",
                        TextDialogButton: "OK",
                        showCancelBtn: false
                    });
                    setshowFullForm(false);
                }
                else {
                    setshowDialogBox(false);
                    setshowFullForm(true);
                }
            }
        }
        catch {
            setShowSomethingWrongDialogBox(true);
        }

        setCount(count => count + 1);
        setisBtnLoading(false);
    }

    const ResetButtonOnClick = (e) => {

        e.preventDefault();
        setshowFullForm(false);
        setformsTxts(defaultformsTxts);
    }

    const CreateBtnOnClick = async (e) => {

        e.preventDefault();
        setisBtnLoading(true);

        try {
            let response = await axios.post(process.env.REACT_APP_CREATE_API_URL,
                JSON.stringify(formsTxts), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setshowDialogBox(true);
            setshowMessage({
                TextDialogContent: response.data.message,
                TextDialogTitle: "",
                TextDialogButton: "OK",
                showCancelBtn: false
            });
            setisBtnLoading(false);
            ResetButtonOnClick(e);
        }
        catch {
            setShowSomethingWrongDialogBox(true);
        }

        setCount(count => count + 1);
        setisBtnLoading(false);

    }


    const ClearHomeBtnOnClick = (e) => {

        e.preventDefault();

        setCount(count => count + 1);
        setformsTxts({ ...defaultformsTxts, StudentCode: formsTxts.StudentCode });
        setshowDialogBox(false);

    }

    return (
        <div>
            <section className="vh-200">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="formDiv">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <div className="form-group row">
                                        {showSomethingWrongDialogBox && <DialogSomethingWrong key={count} />}
                                        {showDialogBox && <DialogBoxes key={count} {...showMessage} />}
                                        {
                                            !showFullForm
                                                ?
                                                <>
                                                    <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code <span className='required'>*</span></label>
                                                    <div className="col-sm-10">
                                                        <input type="number" className="form-control" id="StudentCodeTxt" disabled={false} value={formsTxts.StudentCode}
                                                            onChange={handleStudentCodeInputChange} />
                                                    </div>
                                                    <br />
                                                    {
                                                        !isBtnLoading ?
                                                            <Button variant="contained" id="searchtHomeBtn" disabled={!formsTxts.StudentCode} onClick={(e) => SearchButtonOnClick(e)}><SearchIcon />Search</Button>
                                                            : <Button variant="contained" id="searchtHomeBtn" disabled={true} ><SearchIcon />Searching...</Button>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code <span className='required'>*</span></label>
                                                    <div className="col-sm-10">
                                                        <input type="number" className="form-control" id="StudentCodeTxt" disabled={true} value={formsTxts.StudentCode} onChange={(e) => setformsTxts({ ...formsTxts, StudentCode: e.target.value.toUpperCase() })} />
                                                        <br />
                                                    </div>
                                                    <div className='buttons'>
                                                        <Button variant="contained" type="reset" onClick={(e) => ClearHomeBtnOnClick(e)}><MdOutlineReplay /> Clear</Button>
                                                        <Button variant="contained" type="reset" color="error" onClick={(e) => ResetButtonOnClick(e)}><CloseIcon /> Reset</Button>
                                                    </div>
                                                    <hr className="custom-line" />
                                                    <br />
                                                    <form className="form" id="create-form" onSubmit={CreateBtnOnClick}>
                                                        {
                                                            showFullForm &&
                                                            <>
                                                                <div className="form-group row">
                                                                    <label htmlFor='studentNameTxt' className="col-sm-2 col-form-label">Student Name <span className='required'>*</span></label>
                                                                    <input type="text" className="form-control" id="studentNameTxt" value={formsTxts.StudentName} onChange={(e) => setformsTxts({ ...formsTxts, StudentName: e.target.value.toUpperCase() })} required />
                                                                </div>
                                                                <br />
                                                                <div className="form-group row">
                                                                    <label htmlFor='guardianNameTxt' className="col-sm-2 col-form-label">Guardian Name <span className='required'>*</span></label>
                                                                    <input type="text" className="form-control" id="guardianNameTxt" value={formsTxts.GuardianName} onChange={(e) => setformsTxts({ ...formsTxts, GuardianName: e.target.value.toUpperCase() })} required />
                                                                </div>
                                                                <br />
                                                                <div className="form-group row">
                                                                    <label htmlFor='LevelTxt' className="col-sm-2 col-form-label">Phone Number</label>
                                                                    <input type="number" className="form-control" id="LevelTxt" value={formsTxts.PhoneNumber} onChange={handlePhoneNumberInputChange} />
                                                                </div>
                                                                <br />
                                                                <div className="datePicker">
                                                                    <label htmlFor='DateOfBirth' className="col-sm-2 col-form-label">Date of Birth</label>
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
                                                                <br />
                                                                <div className="datePicker">
                                                                    <label htmlFor='AdmissionDate' className="col-sm-2 col-form-label">Admission Date</label>
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
                                                            </>
                                                        }

                                                    </form>
                                                    <hr className="custom-line" />
                                                    {
                                                        !isBtnLoading ?
                                                            <Button variant="contained" id="createtHomeBtn" form="create-form" type="submit">Create</Button>
                                                            : <Button variant="contained" id="createtHomeBtn" disabled={true} form="create-form">Creating...</Button>

                                                    }

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
    )
}

export default CreateForm

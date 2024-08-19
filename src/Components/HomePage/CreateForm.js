import React, { useState, useEffect } from 'react';
import DialogBoxes from '../DialogBoxes/DialogBoxes';
import { MdOutlineReplay } from "react-icons/md";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import '../../ComponetsStyles/CreateForm.css';
import axios from '../AxiosInterceptor/axiosInterceptor';
import DialogSomethingWrong from '../DialogBoxes/DialogSomethingWrong';

const CreateForm = () => {

    let defaultformsTxts = {

        studentName: "",
        guardianName: "",
        studentCode: "",
        phoneNumber: "-"
    }

    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [formsTxts, setFormsTxts] = useState(defaultformsTxts);
    const [showFullForm, setShowFullForm] = useState(false);
    const [showSomethingWrongDialogBox, setShowSomethingWrongDialogBox] = useState(false);
    const [showDialogBoxContent, setShowDialogBoxContent] = useState({
        ShowDialogBox: false,
        TextDialogContent: "",
        TextDialogButton: "",
        ShowCancelBtn: false
    });

    const [count, setCount] = useState(0);

    const [dates, setDates] = useState({ //Set the dates
        selectedDOBDate: "",
        selectedAdmissionDate: ""
    });


    const dateFormater = (datePrm) => { //Format the date to store in Databases

        const date = dayjs(datePrm);
        const formattedDate = date.format('DD/MM/YYYY');
        return formattedDate;

    }

    //When changing any dates
    useEffect(() => {
        setFormsTxts(prevFormsTxts => ({
            ...prevFormsTxts,
            dob: dates.selectedDOBDate ? dateFormater(dates.selectedDOBDate) : "-",
            admissionDate: dates.selectedAdmissionDate ? dateFormater(dates.selectedAdmissionDate) : "-"
        }));
    }, [dates]);

    //Max 4 length for input paramater for StudentCode
    const handleStudentCodeInputChange = (e) => {
        const { value } = e.target;
        const maxLength = 4;

        if (value.length <= maxLength) {
            setFormsTxts({ ...formsTxts, studentCode: value.toUpperCase() });
        }
    };

    //Max 10 length for input paramater for PhoneNumber
    const handlePhoneNumberInputChange = (e) => {
        const { value } = e.target;
        const maxLength = 10;

        if (value.length <= maxLength) {
            setFormsTxts({ ...formsTxts, phoneNumber: e.target.value.toUpperCase() });
        }
    };

    //When clicking on Search Button
    const SearchButtonOnClick = async (e) => {

        e.preventDefault();
        setIsBtnLoading(true);
        setShowSomethingWrongDialogBox(false);
        setCount(count => count + 1);

        try {
            let response = await axios.post(process.env.REACT_APP_SEARCH_CODE_API_URL,
                { "studentCode": formsTxts.studentCode });

            if (response.data) { //When response with data received
                if (response.data.returnCode === 1) {
                    setShowDialogBoxContent({
                        ShowDialogBox: true,
                        TextDialogContent: "PAI-" + formsTxts.studentCode + " already exists.",
                        TextDialogButton: "OK",
                        ShowCancelBtn: false
                    });
                    setShowFullForm(false);
                }
                else {
                    setShowDialogBoxContent({ ShowDialogBox: false });
                    setShowFullForm(true);
                }
            }
        }
        catch {
            setShowSomethingWrongDialogBox(true);
        }

        setIsBtnLoading(false);
    }

    //When clicking on Reset Button
    const ResetButtonOnClick = (e) => {

        e.preventDefault();
        setShowFullForm(false);
        setShowSomethingWrongDialogBox(false);
        setFormsTxts(defaultformsTxts);
    }

    //When clicking on Create Button
    const CreateBtnOnClick = async (e) => {

        e.preventDefault();
        setIsBtnLoading(true);
        setShowSomethingWrongDialogBox(false);
        setCount(count => count + 1);

        try {
            let response = await axios.post(process.env.REACT_APP_CREATE_API_URL,
                JSON.stringify(formsTxts), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setShowDialogBoxContent({
                ShowDialogBox: true,
                TextDialogContent: response.data.message,
                TextDialogButton: "OK",
                ShowCancelBtn: false
            });

            setIsBtnLoading(false);
            ResetButtonOnClick(e);
        }
        catch {
            setShowSomethingWrongDialogBox(true);
        }
        setIsBtnLoading(false);

    }

    //When clicking on ClearHome Button
    const ClearHomeBtnOnClick = (e) => {

        e.preventDefault();
        setFormsTxts({ ...defaultformsTxts, studentCode: formsTxts.studentCode });
        setShowDialogBoxContent({ ShowDialogBox: false });
        setShowSomethingWrongDialogBox(false);

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
                                        {showDialogBoxContent.ShowDialogBox
                                            && <DialogBoxes key={count}
                                                TextDialogContent={showDialogBoxContent.TextDialogContent}
                                                TextDialogButton={showDialogBoxContent.TextDialogButton}
                                                ShowCancelBtn={showDialogBoxContent.ShowCancelBtn} />}
                                        {
                                            !showFullForm
                                                ?
                                                <>
                                                    <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code <span className='required'>*</span></label>
                                                    <div className="col-sm-10">
                                                        <input type="number" className="form-control" id="StudentCodeTxt" disabled={false} value={formsTxts.studentCode}
                                                            onChange={handleStudentCodeInputChange} />
                                                    </div>
                                                    <br />
                                                    {
                                                        !isBtnLoading ?
                                                            <Button variant="contained" id="searchtHomeBtn" disabled={!formsTxts.studentCode} onClick={SearchButtonOnClick}><SearchIcon />Search</Button>
                                                            : <Button variant="contained" id="searchtHomeBtn" disabled={true} ><SearchIcon />Searching...</Button>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code <span className='required'>*</span></label>
                                                    <div className="col-sm-10">
                                                        <input type="number" className="form-control" id="StudentCodeTxt" disabled={true} value={formsTxts.studentCode} onChange={(e) => setFormsTxts({ ...formsTxts, studentCode: e.target.value.toUpperCase() })} />
                                                        <br />
                                                    </div>
                                                    <div className='buttons'>
                                                        <Button variant="contained" type="reset" onClick={ClearHomeBtnOnClick}><MdOutlineReplay /> Clear</Button>
                                                        <Button variant="contained" type="reset" color="error" onClick={ResetButtonOnClick}><CloseIcon /> Reset</Button>
                                                    </div>
                                                    <hr className="custom-line" />
                                                    <br />
                                                    <form className="form" id="create-form" onSubmit={CreateBtnOnClick}>
                                                        {
                                                            showFullForm &&
                                                            <>
                                                                <div className="form-group row">
                                                                    <label htmlFor='studentNameTxt' className="col-sm-2 col-form-label">Student Name <span className='required'>*</span></label>
                                                                    <input type="text" className="form-control" id="studentNameTxt" value={formsTxts.studentName} onChange={(e) => setFormsTxts({ ...formsTxts, studentName: e.target.value.toUpperCase() })} required />
                                                                </div>
                                                                <br />
                                                                <div className="form-group row">
                                                                    <label htmlFor='guardianNameTxt' className="col-sm-2 col-form-label">Guardian Name <span className='required'>*</span></label>
                                                                    <input type="text" className="form-control" id="guardianNameTxt" value={formsTxts.guardianName} onChange={(e) => setFormsTxts({ ...formsTxts, guardianName: e.target.value.toUpperCase() })} required />
                                                                </div>
                                                                <br />
                                                                <div className="form-group row">
                                                                    <label htmlFor='LevelTxt' className="col-sm-2 col-form-label">Phone Number</label>
                                                                    <input type="number" className="form-control" id="LevelTxt" value={formsTxts.phoneNumber} onChange={handlePhoneNumberInputChange} />
                                                                </div>
                                                                <br />
                                                                <div className="datePicker">
                                                                    <label htmlFor='DateOfBirth' className="col-sm-2 col-form-label">Date of Birth</label>
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <DemoContainer components={['DatePicker']}>
                                                                            <DesktopDatePicker label="Date of Birth"
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
                                                                            <DesktopDatePicker label="Admission Date"
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

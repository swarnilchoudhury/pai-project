import React, { useState, useEffect } from 'react';
import { serverTimestamp } from 'firebase/firestore';
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
        AdmissionDate: "",
        Status: "Active",
        CreatedDateTime: serverTimestamp()
    }


    const [formsTxts, setformsTxts] = useState(defaultformsTxts);

    const [showDialogBox, setshowDialogBox] = useState(false);
    const [showFullForm, setshowFullForm] = useState(false);

    const [showMessage, setshowMessage] = useState({});

    const [count, setCount] = useState(0);


    const dateFormater = (datePrm) => {

        const date = dayjs(datePrm);
        const formattedDate = date.format('MM/DD/YYYY');
        return formattedDate;

    }

    useEffect(() => {
        setformsTxts(prevFormsTxts => ({
            ...prevFormsTxts,
            DOB: dates.selectedDOBDate ? dateFormater(dates.selectedDOBDate) : "",
            AdmissionDate: dates.selectedAdmissionDate ? dateFormater(dates.selectedAdmissionDate) : ""
        }));
    }, [dates]);

    const SearchButton = (e) => {
        e.preventDefault();
        setshowFullForm(true);
    }

    const ResetButton = (e) =>{
        e.preventDefault();
        setshowFullForm(false);
        setformsTxts(defaultformsTxts);
    }

    const CreateHomeBtnOnClick = (e) => {

        e.preventDefault();

        console.log(formsTxts)

        // const studentDetailsCollection = collection(db, 'StudentDetails');

        // // asynchronously add a document to the collection
        // addDoc(studentDetailsCollection, {
        //     ...formsTxts
        // })
        //     .then(() => {

        //         setCount(count => count + 1);

        //         setshowMessage({
        //             dialogContent: "Inserted " + formsTxts.studentName + "," + " " + formsTxts.studentCode + " details Successfully",
        //             dialogTitle: "Success",
        //             CloseButtonName: "OK"
        //         });

        //         setformsTxts(defaultformsTxts);
        //         setshowDialogBox(true);

        //         let form = document.getElementById('create-form');
        //         form.scrollTop = 0;

        //     })
        //     .catch(() => {

        //         setCount(count => count + 1);

        //         setshowMessage({
        //             dialogContent: "Failed to Insert " + formsTxts.studentName + "," + " " + formsTxts.studentCode + " details",
        //             dialogTitle: "Error",
        //             CloseButtonName: "OK"
        //         });

        //         setshowDialogBox(true);

        //         let form = document.getElementById('create-form');
        //         form.scrollTop = 0;

        //     });



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
                                                {
                                                    !showFullForm
                                                        ?
                                                        <>
                                                        <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code</label>
                                                        <div className="col-sm-10">
                                                            <input type="text" className="form-control" id="StudentCodeTxt" disabled={false} value={formsTxts.studentCode} onChange={(e) => setformsTxts({ ...formsTxts, studentCode: e.target.value.toUpperCase() })} />
                                                            <br />
                                                        <Button variant="contained" onClick={(e) => SearchButton(e)}><SearchIcon />Search</Button>
                                                        </div>
                                                        </>
                                                        :
                                                        <>
                                                        <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code</label>
                                                        <div className="col-sm-10">
                                                            <input type="text" className="form-control" id="StudentCodeTxt" disabled={true} value={formsTxts.studentCode} onChange={(e) => setformsTxts({ ...formsTxts, studentCode: e.target.value.toUpperCase() })} />
                                                            <br />
                                                        </div>
                                                            <div className='dash'>
                                                                <Button variant="contained" id="ClearHomeBtn" type="reset" onClick={(e) => ClearHomeBtnOnClick(e)}><MdOutlineReplay /> Clear</Button>
                                                                <Button variant="contained" id="ClearHomeBtn" type="reset" onClick={(e) => ResetButton(e)}><CloseIcon /> Reset</Button>
                                                            </div>
                                                            <div className='dash'>
                                                                ---------------------------------------------------------
                                                            </div>
                                                            <br />
                                                            <form className="form" id="create-form" onSubmit={CreateHomeBtnOnClick}>
                                                                {
                                                                    showFullForm &&
                                                                    <>
                                                                        <div className="form-group row">
                                                                            <label htmlFor='studentNameTxt' className="col-sm-2 col-form-label">Student Name</label>
                                                                            <div className="col-sm-10">
                                                                                <input type="text" className="form-control" id="studentNameTxt" value={formsTxts.studentName} onChange={(e) => setformsTxts({ ...formsTxts, studentName: e.target.value.toUpperCase() })} />
                                                                            </div>
                                                                        </div>
                                                                        <br />
                                                                        <div className="form-group row">
                                                                            <label htmlFor='guardianNameTxt' className="col-sm-2 col-form-label">Guardian Name</label>
                                                                            <div className="col-sm-10">
                                                                                <input type="text" className="form-control" id="guardianNameTxt" value={formsTxts.guardianName} onChange={(e) => setformsTxts({ ...formsTxts, guardianName: e.target.value.toUpperCase() })} />
                                                                            </div>
                                                                        </div>
                                                                        <br />

                                                                        <br />
                                                                        <div className="form-group row">
                                                                            <label htmlFor='LevelTxt' className="col-sm-2 col-form-label">Phone Number</label>
                                                                            <div className="col-sm-10">
                                                                                <input type="text" className="form-control" id="LevelTxt" value={formsTxts.phoneNumber} onChange={(e) => setformsTxts({ ...formsTxts, phoneNumber: e.target.value.toUpperCase() })} />
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
                                                                                            slotProps={{
                                                                                                textField: {
                                                                                                    helperText: 'MM/DD/YYYY',
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
                                                                                            slotProps={{
                                                                                                textField: {
                                                                                                    helperText: 'MM/DD/YYYY',
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
                                                                ---------------------------------------------------------
                                                            </div>
                                                            <Button variant="contained" id="submitHomeBtn" form="create-form" type="submit">Create</Button>
                                                            {showDialogBox && <DialogBoxes key={count} props={showMessage} />}
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

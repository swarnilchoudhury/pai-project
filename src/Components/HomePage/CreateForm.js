import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Components/FirebaseConfig.js';
import DialogBoxes from '../DialogBoxes.js';
import { MdOutlineReplay } from "react-icons/md";
import Button from '@mui/material/Button';
import '../../ComponetsStyles/CreateForm.css';

const CreateForm = (props) => {

    const CreatedBy = props.UserName;

    let defaultformsTxts = {

        studentName: "",
        guardianName: "",
        Level: "",
        studentCode: "PAI-",
        Abacus: "",
        Finger: "",
        Mentalviewing: "",
        Mentalhearing: "",
        Total: "",
        Attendence: "100%",
        CW: "Regular",
        HW: "Regular",
        Braingym: "Regular",
        swriting: "Regular",
        Abacus_no_of_sums_min: "",
        Finger_no_of_sums_min: "",
        MHearing_no_of_sums_min: "",
        InstituteName: "Purbasa Activity Instititute",
        CreatedDateTime: serverTimestamp(),
        CreatedBy: CreatedBy
    }

    const [formsTxts, setformsTxts] = useState(defaultformsTxts);

    const [showDialogBox, setshowDialogBox] = useState(false);
    const [showMessage, setshowMessage] = useState({});

    const [count, setCount] = useState(0);

    

    useEffect(() => {

        let AbacusNumber = (!isNaN(Number(formsTxts.Abacus)) ? Number(formsTxts.Abacus) : 0);;
        let FingerNumber = (!isNaN(Number(formsTxts.Finger)) ? Number(formsTxts.Finger) : 0);
        let MentalviewingNumber = (!isNaN(Number(formsTxts.Mentalviewing)) ? Number(formsTxts.Mentalviewing) : 0);
        let MentalhearingNumber = (!isNaN(Number(formsTxts.Mentalhearing)) ? Number(formsTxts.Mentalhearing) : 0);

        let TotalNumber = AbacusNumber + FingerNumber + MentalviewingNumber + MentalhearingNumber;
        setformsTxts({ ...formsTxts, Total: TotalNumber });

    }, [formsTxts.Abacus, formsTxts.Finger, formsTxts.Mentalviewing, formsTxts.Mentalhearing]);



    const CreateHomeBtnOnClick = (e) => {

        e.preventDefault();

        const studentDetailsCollection = collection(db, 'StudentDetails');

        // asynchronously add a document to the collection
        addDoc(studentDetailsCollection, {
            ...formsTxts
        })
            .then(() => {

                setCount(count => count + 1);

                setshowMessage({
                    dialogContent: "Inserted " + formsTxts.studentName + "," + " " + formsTxts.studentCode + " details Successfully",
                    dialogTitle: "Success",
                    CloseButtonName: "OK"
                });

                setformsTxts(defaultformsTxts);
                setshowDialogBox(true);


            })
            .catch(() => {

                setCount(count => count + 1);

                setshowMessage({
                    dialogContent: "Failed to Insert " + formsTxts.studentName + "," + " " + formsTxts.studentCode + " details",
                    dialogTitle: "Error",
                    CloseButtonName: "OK"
                });

                setshowDialogBox(true);
            });



    }


    const ClearHomeBtnOnClick = (e) => {

        e.preventDefault();

        setCount(count => count + 1);
        setformsTxts(defaultformsTxts);
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
                                    <p className="mb-4 pText">Create Form</p>
                                    <div className='dash'>
                                        Create Record
                                        <Button variant="contained" id="ClearHomeBtn" type="reset" onClick={(e) => ClearHomeBtnOnClick(e)}><MdOutlineReplay /> Clear</Button>
                                    </div>
                                    <div className='dash'>
                                        ---------------------------------------------------------
                                    </div>
                                    <br />
                                    <form className="form" id="create-form" onSubmit={CreateHomeBtnOnClick}>
                                        <div className="form-group row">
                                            <label htmlFor='studentNameTxt' className="col-sm-2 col-form-label">Student Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="studentNameTxt" value={formsTxts.studentName} onChange={(e) => setformsTxts({ ...formsTxts, studentName: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='guardianNameTxt' className="col-sm-2 col-form-label">Guardian Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="guardianNameTxt" value={formsTxts.guardianName} onChange={(e) => setformsTxts({ ...formsTxts, guardianName: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='LevelTxt' className="col-sm-2 col-form-label">Level</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="LevelTxt" value={formsTxts.Level} onChange={(e) => setformsTxts({ ...formsTxts, Level: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="StudentCodeTxt" value={formsTxts.studentCode} onChange={(e) => setformsTxts({ ...formsTxts, studentCode: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='AbacusTxt' className="col-sm-2 col-form-label">Abacus</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="AbacusTxt" value={formsTxts.Abacus} onChange={(e) => setformsTxts({ ...formsTxts, Abacus: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='FingerTxt' className="col-sm-2 col-form-label">Finger</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="FingerTxt" value={formsTxts.Finger} onChange={(e) => setformsTxts({ ...formsTxts, Finger: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='MentalviewingTxt' className="col-sm-2 col-form-label">Mental viewing</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="MentalviewingTxt" value={formsTxts.Mentalviewing} onChange={(e) => setformsTxts({ ...formsTxts, Mentalviewing: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='MentalhearingTxt' className="col-sm-2 col-form-label">Mental hearing</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="MentalhearingTxt" value={formsTxts.Mentalhearing} onChange={(e) => setformsTxts({ ...formsTxts, Mentalhearing: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='TotalTxt' className="col-sm-2 col-form-label">Total</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="TotalTxt" value={formsTxts.Total} onChange={(e) => setformsTxts({ ...formsTxts, Total: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='AttendenceTxt' className="col-sm-2 col-form-label">Attendence</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="AttendenceTxt" value={formsTxts.Attendence} onChange={(e) => setformsTxts({ ...formsTxts, Attendence: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='CWTxt' className="col-sm-2 col-form-label">C.W</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="CWTxt" value={formsTxts.CW} onChange={(e) => setformsTxts({ ...formsTxts, CW: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='HWTxt' className="col-sm-2 col-form-label">H.W</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="HWTxt" value={formsTxts.HW} onChange={(e) => setformsTxts({ ...formsTxts, HW: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='BraingymTxt' className="col-sm-2 col-form-label">Braingym</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="BraingymTxt" value={formsTxts.Braingym} onChange={(e) => setformsTxts({ ...formsTxts, Braingym: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='swritingTxt' className="col-sm-2 col-form-label">S.Writing</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="swritingTxt" value={formsTxts.swriting} onChange={(e) => setformsTxts({ ...formsTxts, swriting: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='Abacus_no_of_sums_minTxt' className="col-sm-2 col-form-label">Abacus (no. of sums /min)</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="Abacus_no_of_sums_minTxt" value={formsTxts.Abacus_no_of_sums_min} onChange={(e) => setformsTxts({ ...formsTxts, Abacus_no_of_sums_min: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='Finger_no_of_sums_minTxt' className="col-sm-2 col-form-label"> Finger (no. of sums /min)</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="Finger_no_of_sums_minTxt" value={formsTxts.Finger_no_of_sums_min} onChange={(e) => setformsTxts({ ...formsTxts, Finger_no_of_sums_min: e.target.value })} required/>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='MHearing_no_of_sums_minTxt' className="col-sm-2 col-form-label">M.Hearing (no. of sums /min)</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="MHearing_no_of_sums_minTxt" value={formsTxts.MHearing_no_of_sums_min} onChange={(e) => setformsTxts({ ...formsTxts, MHearing_no_of_sums_min: e.target.value })} required/>
                                            </div>
                                        </div>
                                    </form>
                                    <br />
                                    <div className='dash'>
                                        ---------------------------------------------------------
                                    </div>
                                    <Button variant="contained" id="submitHomeBtn" form="create-form" type="submit">Save</Button>
                                    {showDialogBox && <DialogBoxes key={count} props={showMessage} />}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CreateForm

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Components/FirebaseConfig.js';
import ShowMessagediv from '../ShowMessagediv';

const CreateForm = (props) => {

    const CreatedBy = props.UserName;

    let defaultformsTxts = {

        studentName: "",
        guardianName: "",
        Level: "",
        studentCode: "100",
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
        CreatedBy: props.UserName
    }

    let showMessageDefaultDetails = {

        innerText: "",
        className: "",
        role: ""
    }

    const [formsTxts, setformsTxts] = useState(defaultformsTxts);

    const [showMessage, setshowMessage] = useState(showMessageDefaultDetails);

    const [count, setCount] = useState(0);

    const CreateHomeBtnOnClick = (e) => {

        e.preventDefault();
        setformsTxts({ studentCode: `PAI`, ...formsTxts });
        console.log(formsTxts);
        // const studentDetailsCollection = collection(db, 'StudentDetails');

        // // asynchronously add a document to the collection
        // addDoc(studentDetailsCollection, {
        //     ...formsTxts
        // })
        //     .then(() => {

        //         setCount(count + 1);

        //         setshowMessage({
        //             innerText: "Inserted " + formsTxts.studentName + " details Successfully",
        //             className: "alert alert-success",
        //             role: "alert"
        //         });

        //         setformsTxts(defaultformsTxts);


        //     })
        //     .catch(() => {

        //         setCount(count + 1);

        //         setshowMessage({
        //             innerText: "Insertion of " + formsTxts.studentName + " details Failed",
        //             className: "alert alert-danger",
        //             role: "alert"
        //         });
        //     });


    }


    const ClearHomeBtnOnClick = (e) => {

        e.preventDefault();

        setCount(count + 1);
        setformsTxts(defaultformsTxts);
        setshowMessage(showMessageDefaultDetails);

    }

    return (
        <div>
            <section className="vh-200">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <p className="mb-4 pText">Create Form</p>
                                    <form onSubmit={CreateHomeBtnOnClick}>
                                        <div className="form-group row">
                                            <label htmlFor='studentNameTxt' className="col-sm-2 col-form-label">Student Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="studentNameTxt" value={formsTxts.studentName} onChange={(e) => setformsTxts({ ...formsTxts, studentName: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='guardianNameTxt' className="col-sm-2 col-form-label">Guardian Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="guardianNameTxt" value={formsTxts.guardianName} onChange={(e) => setformsTxts({ ...formsTxts, guardianName: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='LevelTxt' className="col-sm-2 col-form-label">Level</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="sLevelTxt" value={formsTxts.Level} onChange={(e) => setformsTxts({ ...formsTxts, Level: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="StudentCodeTxt" value={formsTxts.studentCode} onChange={(e) => setformsTxts({ ...formsTxts, studentCode: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='AbacusTxt' className="col-sm-2 col-form-label">Abacus</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="AbacusTxt" value={formsTxts.Abacus} onChange={(e) => setformsTxts({ ...formsTxts, Abacus: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='FingerTxt' className="col-sm-2 col-form-label">Finger</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="FingerTxt" value={formsTxts.Finger} onChange={(e) => setformsTxts({ ...formsTxts, Finger: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='MentalviewingTxt' className="col-sm-2 col-form-label">Mental viewing</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="MentalviewingTxt" value={formsTxts.Mentalviewing} onChange={(e) => setformsTxts({ ...formsTxts, Mentalviewing: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='MentalhearingTxt' className="col-sm-2 col-form-label">Mental hearing</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="MentalhearingTxt" value={formsTxts.Mentalhearing} onChange={(e) => setformsTxts({ ...formsTxts, Mentalhearing: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='TotalTxt' className="col-sm-2 col-form-label">Total</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="TotalTxt" value={formsTxts.Total} onChange={(e) => setformsTxts({ ...formsTxts, Total: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='AttendenceTxt' className="col-sm-2 col-form-label">Attendence</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="AttendenceTxt" value={formsTxts.Attendence} onChange={(e) => setformsTxts({ ...formsTxts, Attendence: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='CWTxt' className="col-sm-2 col-form-label">C.W</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="CWTxt" value={formsTxts.CW} onChange={(e) => setformsTxts({ ...formsTxts, CW: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='HWTxt' className="col-sm-2 col-form-label">H.W</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="HWTxt" value={formsTxts.HW} onChange={(e) => setformsTxts({ ...formsTxts, HW: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='BraingymTxt' className="col-sm-2 col-form-label">Braingym</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="BraingymTxt" value={formsTxts.Braingym} onChange={(e) => setformsTxts({ ...formsTxts, Braingym: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='swritingTxt' className="col-sm-2 col-form-label">s.writing</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="swritingTxt" value={formsTxts.swriting} onChange={(e) => setformsTxts({ ...formsTxts, swriting: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='Abacus_no_of_sums_minTxt' className="col-sm-2 col-form-label">Abacus(no. of sums /min)</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="Abacus_no_of_sums_minTxt" value={formsTxts.Abacus_no_of_sums_min} onChange={(e) => setformsTxts({ ...formsTxts, Abacus_no_of_sums_min: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='Finger_no_of_sums_minTxt' className="col-sm-2 col-form-label"> Finger(no. of sums /min)</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="Finger_no_of_sums_minTxt" value={formsTxts.Finger_no_of_sums_min} onChange={(e) => setformsTxts({ ...formsTxts, Finger_no_of_sums_min: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor='MHearing_no_of_sums_minTxt' className="col-sm-2 col-form-label">M.Hearing(no. of sums /min)</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="MHearing_no_of_sums_minTxt" value={formsTxts.MHearing_no_of_sums_min} onChange={(e) => setformsTxts({ ...formsTxts, MHearing_no_of_sums_min: e.target.value })} />
                                            </div>
                                        </div>
                                        <br />
                                        <br />
                                        <button id="submitHomeBtn" className="btn btn-primary" type="submit">Save</button>
                                        <button id="ClearHomeBtn" className="btn btn-primary" type="reset" onClick={(e) => ClearHomeBtnOnClick(e)}>Clear</button>
                                    </form>
                                    <ShowMessagediv key={count} props={showMessage} />
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

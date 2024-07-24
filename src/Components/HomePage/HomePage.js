import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../Configs/FirebaseConfig.js';
import DialogBoxes from '../DialogBoxes/DialogBoxes.js';
import { MdOutlineReplay } from "react-icons/md";
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
// import '../../ComponetsStyles/CreateForm.css';
import axios from 'axios';
import Table from '../Table/Table.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../ComponetsStyles/HomePage.css'

const HomePage = () => {

    const [showDialogBox, setshowDialogBox] = useState(false);
    const [showForm, setshowForm] = useState(false);
    const [approvedData, setapprovedData] = useState({});
    const [isLoading, setisLoading] = useState(true);

    const [count, setCount] = useState(0);

    const homePageHeader =
        [
            {
                accessorKey: 'Name',
                header: 'Name',
            },
            {
                accessorKey: 'Age',
                header: 'Age',
            },
            {
                accessorKey: 'CreatedDateTime',
                header: 'Created Date Time',
            }
        ]



    useEffect(() => {
        document.title = 'Home Page';
        const homeURL = async () => {
            let response = await axios.post(process.env.REACT_APP_HOME_API_URL);
            setTimeout(() => {
                setisLoading(false);
            }, 2000);
            setapprovedData(response.data);
        }

        homeURL();

    }, []);



    const ToggleForm = (e) => {

        e.preventDefault();

        setshowForm(state => !state);

    };



    // }


    // const ClearHomeBtnOnClick = (e) => {

    //     e.preventDefault();

    //     setCount(count => count + 1);
    //     setformsTxts(defaultformsTxts);
    //     setshowDialogBox(false);

    // }

    return (
        <div>
            <br/>
            {
                !showForm ?
                    <>
                    
                        <Button variant="contained" className="HomePageButttons" onClick={(e) => ToggleForm(e)}><AddIcon/>&nbsp;ADD NEW STUDENT</Button>
                        <br/>
                        <br/>
                        <Table columnsProps={homePageHeader} dataProps={approvedData} isLoadingState={isLoading} />
                    </>
                    :
                    <>
                    <Button variant="contained" className="HomePageButttons" onClick={(e) => ToggleForm(e)}><ArrowBackIcon/>&nbsp;BACK TO TABLE</Button>
                    {/* <p className="mb-4 pText">Create Form</p>
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
                                                <input type="text" className="form-control" id="studentNameTxt" value={formsTxts.studentName} onChange={(e) => setformsTxts({ ...formsTxts, studentName: e.target.value.toUpperCase() })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='guardianNameTxt' className="col-sm-2 col-form-label">Guardian Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="guardianNameTxt" value={formsTxts.guardianName} onChange={(e) => setformsTxts({ ...formsTxts, guardianName: e.target.value.toUpperCase() })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='LevelTxt' className="col-sm-2 col-form-label">Level</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="LevelTxt" value={formsTxts.Level} onChange={(e) => setformsTxts({ ...formsTxts, Level: e.target.value.toUpperCase() })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='StudentCodeTxt' className="col-sm-2 col-form-label">Student Code</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="StudentCodeTxt" value={formsTxts.studentCode} onChange={(e) => setformsTxts({ ...formsTxts, studentCode: e.target.value.toUpperCase() })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='AbacusTxt' className="col-sm-2 col-form-label">Abacus</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="AbacusTxt" value={formsTxts.Abacus} onChange={(e) => setformsTxts({ ...formsTxts, Abacus: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='FingerTxt' className="col-sm-2 col-form-label">Finger</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="FingerTxt" value={formsTxts.Finger} onChange={(e) => setformsTxts({ ...formsTxts, Finger: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='MentalviewingTxt' className="col-sm-2 col-form-label">Mental viewing</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="MentalviewingTxt" value={formsTxts.Mentalviewing} onChange={(e) => setformsTxts({ ...formsTxts, Mentalviewing: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='MentalhearingTxt' className="col-sm-2 col-form-label">Mental hearing</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="MentalhearingTxt" value={formsTxts.Mentalhearing} onChange={(e) => setformsTxts({ ...formsTxts, Mentalhearing: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='TotalTxt' className="col-sm-2 col-form-label">Total</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="TotalTxt" value={formsTxts.Total} onChange={(e) => setformsTxts({ ...formsTxts, Total: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='AttendenceTxt' className="col-sm-2 col-form-label">Attendence</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="AttendenceTxt" value={formsTxts.Attendence} onChange={(e) => setformsTxts({ ...formsTxts, Attendence: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='CWTxt' className="col-sm-2 col-form-label">C.W</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="CWTxt" value={formsTxts.CW} onChange={(e) => setformsTxts({ ...formsTxts, CW: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='HWTxt' className="col-sm-2 col-form-label">H.W</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="HWTxt" value={formsTxts.HW} onChange={(e) => setformsTxts({ ...formsTxts, HW: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='BraingymTxt' className="col-sm-2 col-form-label">Braingym</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="BraingymTxt" value={formsTxts.Braingym} onChange={(e) => setformsTxts({ ...formsTxts, Braingym: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='swritingTxt' className="col-sm-2 col-form-label">S.Writing</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="swritingTxt" value={formsTxts.swriting} onChange={(e) => setformsTxts({ ...formsTxts, swriting: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='Abacus_no_of_sums_minTxt' className="col-sm-2 col-form-label">Abacus (no. of sums /min)</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="Abacus_no_of_sums_minTxt" value={formsTxts.Abacus_no_of_sums_min} onChange={(e) => setformsTxts({ ...formsTxts, Abacus_no_of_sums_min: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='Finger_no_of_sums_minTxt' className="col-sm-2 col-form-label"> Finger (no. of sums /min)</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="Finger_no_of_sums_minTxt" value={formsTxts.Finger_no_of_sums_min} onChange={(e) => setformsTxts({ ...formsTxts, Finger_no_of_sums_min: e.target.value })} required />
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label htmlFor='MHearing_no_of_sums_minTxt' className="col-sm-2 col-form-label">M.Hearing (no. of sums /min)</label>
                                            <div className="col-sm-10">
                                                <input type="number" className="form-control" id="MHearing_no_of_sums_minTxt" value={formsTxts.MHearing_no_of_sums_min} onChange={(e) => setformsTxts({ ...formsTxts, MHearing_no_of_sums_min: e.target.value })} required />
                                            </div>
                                        </div>
                                    </form>
                                    <br /> */}
                                    </>

            }

        </div>
    )
}

export default HomePage

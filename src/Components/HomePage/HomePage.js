import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import Table from '../Table/Table.js';
import Switch from '@mui/material/Switch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../ComponetsStyles/HomePage.css'
import CreateForm from './CreateForm.js';
import axios from '../../Components/AxiosInterceptor/axiosInterceptor.js'
import DialogSomethingWrong from '../DialogBoxes/DialogSomethingWrong.js';
import DialogBoxes from '../DialogBoxes/DialogBoxes.js';

const HomePage = () => {

    const [showForm, setShowForm] = useState(false);
    const [showActiveStatus, setShowActiveStatus] = useState(true);
    const [activeStatus, setActiveStatus] = useState(true);
    const [approvedData, setApprovedData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showSomethingWrongDialogBox, setShowSomethingWrongDialogBox] = useState(false);
    const [showDialogBox, setShowDialogBox] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [showDialogBoxContent, setShowDialogBoxContent] = useState({
        TextDialogTitle: "",
        TextDialogContent: "",
        TextDialogButtonOnConfirmId: "",
        TextDialogButtonOnConfirm: "",
        showCancelBtn: true
    });
    const [isShowRowSelectionBtns, setisShowRowSelectionBtns] = useState(false);
    const [showRowSelectionBtns, setshowRowSelectionBtns] = useState({
        DeactiveButton: false,
        ActiveButton: false,
        ApproveButton: false
    });

    const [count, setCount] = useState(0);

    const homePageHeader =
        [
            {
                accessorKey: 'studentName',
                header: 'Student Name',
            },
            {
                accessorKey: 'studentCode',
                header: 'Code',
            },
            {
                accessorKey: 'guardianName',
                header: 'Guardian Name',
            },
            {
                accessorKey: 'dob',
                header: 'Date of Birth',
            },
            {
                accessorKey: 'admissionDate',
                header: 'Admission Date',
            },
            {
                accessorKey: 'phoneNumber',
                header: 'Phone Number',
            },
            {
                accessorKey: 'createdDateTimeFormatted',
                header: 'Created Date Time',
            }
        ]

    const homePageData = async (status) => {

        try {
            let response = await axios.get(process.env.REACT_APP_HOME_API_URL,
                {
                    headers:
                        { 'x-status': status }
                });

            setApprovedData(response.data);
        }
        catch {
            setShowSomethingWrongDialogBox(true);
        }

        setCount(count => count + 1);
        setIsLoading(false);
    }

    const statusToggleOnClick = async (e) => {
        
        setIsLoading(true);
        setShowSomethingWrongDialogBox(false);
        setRowSelection({});
        setisShowRowSelectionBtns(false);
        setShowDialogBox(false);
        setCount(count => count + 1);

        if (e.target.id === 'ActiveToggleBtn') {
            if (e.target.checked) {
                await homePageData('Active');
            }
            else {
                await homePageData('Deactive');
            }
        }
        else if (e.target.id === 'ApprovedToggleBtn') {
            if (e.target.checked) {
                setShowActiveStatus(false);
                await homePageData('Unapproval');
            }
            else {
                setShowActiveStatus(true);
                setActiveStatus(true);
                await homePageData('Active');
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        document.title = 'Home Page';
        homePageData('Active');
    }, []);

    useEffect(() => {
        if (Object.keys(rowSelection).length > 0) {
            let activeToggleBtn = document.getElementById('ActiveToggleBtn');
            setisShowRowSelectionBtns(true);

            if (activeToggleBtn != null) {
                if (activeToggleBtn.checked) {
                    setshowRowSelectionBtns({ DeactiveButton: true });
                }
                else if (!activeToggleBtn.checked) {
                    setshowRowSelectionBtns({ ActiveButton: true });
                }
            }
            else{   
                setshowRowSelectionBtns({ ApproveButton: true });
            }
        }
        else {
            setisShowRowSelectionBtns(false);
        }
    }, [rowSelection])


    const ToggleForm = (e) => {

        e.preventDefault();
        setRowSelection({});
        setShowDialogBox(false);
        setShowForm(state => !state);

    };

    const RefreshBtnOnClick = async (e) => {
        setIsLoading(true);
        setShowDialogBox(false);
        let activeToggleBtn = document.getElementById('ActiveToggleBtn');

        if (activeToggleBtn != null) {
            if (activeToggleBtn.checked) {
                setActiveStatus(true);
                await homePageData('Active');
            }
            else {
                setActiveStatus(false);
                await homePageData('Deactive');
            }
        }
        else {
            await homePageData('Unapproval');
        }

        setIsLoading(false);
        setCount(count => count + 1);
    }

    const clickFunctions = async (e) => {
        setCount(count => count + 1);
        if (e.target.id === 'deactiveBtn') {

            setShowDialogBoxContent({
                TextDialogTitle: "Deactivate",
                TextDialogContent: "Are you Sure to Deactivate?",
                TextDialogButtonOnConfirmId: "deactiveBtn",
                TextDialogButtonOnConfirm: "Deactivate"
            });
        }
        else if (e.target.id === 'activeBtn') {
            setShowDialogBoxContent({
                TextDialogTitle: "Activate",
                TextDialogContent: "Are you Sure to Activate?",
                TextDialogButtonOnConfirmId: "activeBtn",
                TextDialogButtonOnConfirm: "Activate"
            });
        }
        else if (e.target.id === 'approveBtn') {
            setShowDialogBoxContent({
                TextDialogTitle: "Approve",
                TextDialogContent: "Are you Sure to Approve?",
                TextDialogButtonOnConfirmId: "approveBtn",
                TextDialogButtonOnConfirm: "Approve"
            });
        }
        setShowDialogBox(true);
    }

    const clickFunctionsOnConfirm = async (e) => {
        setShowDialogBox(false);
        if (e.target.id === 'OK') {
            return;
        }

        let header = "";
        if (e.target.id === 'deactiveBtn') {
            header = 'deactive'
        }
        else if (e.target.id === 'activeBtn') {
            header = 'active'
        }
        else if (e.target.id === 'approveBtn') {
            header = 'approve'
        }

        try {
            const keysArray = Object.keys(rowSelection);

            let response = await axios.post(process.env.REACT_APP_UPDATE_API_URL, { data: keysArray },
                {
                    headers: { 'Content-Type': 'application/json', 'x-update': header }

                });

            if (response.status === 200) {
                setisShowRowSelectionBtns(false);
                setRowSelection({});
                RefreshBtnOnClick(e);
                setCount(count => count + 1);

                if (header === 'deactive') {
                    setShowDialogBoxContent({
                        TextDialogTitle: "Success",
                        TextDialogContent: "Deactivated Successfully",
                        TextDialogButtonOnConfirmId: "OK",
                        TextDialogButtonOnConfirm: "OK",
                        showCancelBtn: false
                    });
                }
                else if (header === 'active') {
                    setShowDialogBoxContent({
                        TextDialogTitle: "Success",
                        TextDialogContent: "Activated Successfully",
                        TextDialogButtonOnConfirmId: "OK",
                        TextDialogButtonOnConfirm: "OK",
                        showCancelBtn: false
                    });
                }
                else if (header === 'approve') {
                    setShowDialogBoxContent({
                        TextDialogTitle: "Success",
                        TextDialogContent: "Approved Successfully",
                        TextDialogButtonOnConfirmId: "OK",
                        TextDialogButtonOnConfirm: "OK",
                        showCancelBtn: false
                    });
                }

                setShowDialogBox(true);
            }

        }
        catch {
            setCount(count => count + 1);
            setShowSomethingWrongDialogBox(true);
        }
    }

    return (
        <div>
            {showSomethingWrongDialogBox && <DialogSomethingWrong key={count} />}
            {showDialogBox && <DialogBoxes key={count} showDefaultTextDialogButton={false} TextDialogTitle={showDialogBoxContent.TextDialogTitle} TextDialogContent={showDialogBoxContent.TextDialogContent} TextDialogButtonOnConfirm={showDialogBoxContent.TextDialogButtonOnConfirm} TextDialogButtonOnConfirmId={showDialogBoxContent.TextDialogButtonOnConfirmId} showCancelBtn={showDialogBoxContent.showCancelBtn} clickFunctionsOnConfirm={clickFunctionsOnConfirm} />}
            <br />
            {
                !showForm ?
                    <>
                        <Button variant="contained" className="HomePageButttons" onClick={(e) => ToggleForm(e)}><AddIcon />&nbsp;ADD NEW</Button>
                        <Button variant="contained" id="RefreshBtn" onClick={(e) => RefreshBtnOnClick(e)}><RefreshIcon /></Button>
                        <div style={{ marginTop: "2rem" }}>
                            <Switch defaultChecked={false} id='ApprovedToggleBtn' onChange={statusToggleOnClick} /> <span style={{ fontWeight: 'bold' }}>Unapproved</span>
                            {showActiveStatus && <span><Switch defaultChecked={activeStatus} id='ActiveToggleBtn' onChange={statusToggleOnClick} /> <span style={{ fontWeight: 'bold' }}>Active</span></span>}
                        </div>
                        <Table key={count} columnsProps={homePageHeader} dataProps={approvedData} isLoadingState={isLoading} isShowRowSelectionBtns={isShowRowSelectionBtns} showRowSelectionBtns={showRowSelectionBtns} rowSelection={rowSelection} setRowSelection={setRowSelection} clickFunctions={clickFunctions} />
                    </>
                    :
                    <>
                        <Button variant="contained" className="HomePageButttons" onClick={(e) => ToggleForm(e)}><ArrowBackIcon />&nbsp;BACK TO TABLE</Button>
                        <CreateForm />
                    </>
            }

        </div>
    )
}

export default HomePage

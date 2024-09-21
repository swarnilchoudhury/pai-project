import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import Table from '../Table/Table';
import Switch from '@mui/material/Switch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../ComponetsStyles/HomePage.css';
import CreateForm from './CreateForm';
import axios from '../../Components/AxiosInterceptor/AxiosInterceptor';
import DialogSomethingWrong from '../DialogBoxes/DialogSomethingWrong';
import DialogBoxes from '../DialogBoxes/DialogBoxes';
import { usePermissions } from '../../Context/PermissionContext';

const HomePage = () => {

    const [showForm, setShowForm] = useState(false);
    const [showActiveStatus, setShowActiveStatus] = useState(true);
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showSomethingWrongDialogBox, setShowSomethingWrongDialogBox] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [showDialogBoxContent, setShowDialogBoxContent] = useState({
        ShowDialogBox: false,
        TextDialogTitle: "",
        TextDialogContent: "",
        TextDialogButtonOnConfirmId: "",
        TextDialogButtonOnConfirm: "",
        showCancelBtn: true
    });

    const [showRowSelectionBtns, setShowRowSelectionBtns] = useState({
        isShowRowSelectionBtns: false,
        DeactiveButton: false,
        ActiveButton: false,
        ApproveButton: false
    });

    const [showMessageBeforeTable, setShowMessageBeforeTable] = useState("");
    const [count, setCount] = useState(0);
    const [dialogBoxCount, setDialogBoxCount] = useState(0);
    const { editPermissions } = usePermissions();

    // Add state variables to remember toggle button states
    const [approvedToggleState, setApprovedToggleState] = useState(false);
    const [activeToggleState, setActiveToggleState] = useState(true);


    // Home Page Header for Showing in Table
    const homePageHeader = [
        { accessorKey: 'studentName', header: 'Student Name' },
        { accessorKey: 'studentCode', header: 'Code' },
        { accessorKey: 'guardianName', header: 'Guardian Name' },
        { accessorKey: 'dob', header: 'Date of Birth' },
        { accessorKey: 'admissionDate', header: 'Admission Date' },
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
        { accessorKey: 'createdDateTimeFormatted', header: 'Created Date Time' },
        { accessorKey: 'createdBy', header: 'Created By' }
    ];

    // Fetch Home Page Data
    const homePageData = async (status) => {
        try {
            let response = await axios.get(process.env.REACT_APP_HOME_API_URL, {
                headers: { 'x-status': status }
            });

            setData(response.data);

            //Show the messages before the table
            if (status === 'Active') {
                setShowMessageBeforeTable(
                    <span className='DescBeforeTable'>
                        <strong>(Active)</strong> Ekhane jara class e bhorti ache
                    </span>
                );
            }
            else if (status === 'Deactive') {
                setShowMessageBeforeTable(
                    <span className='DescBeforeTable'>
                        <strong>(Deactive)</strong> Ekhane jara class e bhorti nei
                    </span>
                );
            }
            else {
                setShowMessageBeforeTable(
                    <span className='DescBeforeTable'>
                        <strong>(Approve)</strong> Ekhane approve korle active e jai
                    </span>
                );

            }

        } catch {
            setShowSomethingWrongDialogBox(true);
        }

        setCount(count => count + 1);
        setIsLoading(false);
    };

    // When toggles on statusToggle button
    const statusToggleOnClick = async (e) => {
        setIsLoading(true);
        setShowSomethingWrongDialogBox(false);
        setRowSelection({});
        setShowRowSelectionBtns({ isShowRowSelectionBtns: false });
        setShowDialogBoxContent({ ShowDialogBox: false });
        setCount(count => count + 1);

        const { id, checked } = e.target;
        if (id === 'ActiveToggleBtn') {
            setActiveToggleState(checked); // Update state
            if (checked) {
                await homePageData('Active');
            } else {
                await homePageData('Deactive');
            }
        } else if (id === 'ApprovedToggleBtn') {
            setApprovedToggleState(checked); // Update state
            setActiveToggleState(true);
            setShowActiveStatus(!checked);
            if (checked) {
                await homePageData('Unapproval');
            } else {
                await homePageData('Active');
            }
        }
        setIsLoading(false);
    };

    // Render first time when Home Page mounts
    useEffect(() => {
        document.title = 'Home Page';
        homePageData('Active');
    }, []);

    // Select the rows to change the status for data based on edit permissions
    useEffect(() => {
        if (Object.keys(rowSelection).length > 0 && editPermissions) {

            if (activeToggleState === true && showActiveStatus === true) {
                setShowRowSelectionBtns({ isShowRowSelectionBtns: true, DeactiveButton: true });
            }
            else if (approvedToggleState === true && showActiveStatus === false) {
                setShowRowSelectionBtns({ isShowRowSelectionBtns: true, ApproveButton: true });
            }
            else {
                setShowRowSelectionBtns({ isShowRowSelectionBtns: true, ActiveButton: true });
            }
        }
        else {
            setShowRowSelectionBtns({ isShowRowSelectionBtns: false });
        }
    }, [rowSelection, editPermissions, activeToggleState, approvedToggleState, showActiveStatus]);

    // When changing the form from create to home or vice-versa
    const ToggleForm = (e) => {
        e.preventDefault();
        setRowSelection({});
        setShowSomethingWrongDialogBox(false);
        setShowDialogBoxContent({ ShowDialogBox: false });
        setShowForm(state => !state);
    };

    // When RefreshTable button is clicked
    const RefreshTable = async () => {
        setIsLoading(true);

        if (activeToggleState === true && showActiveStatus === true) {
            await homePageData('Active');
        }
        else if (approvedToggleState === true && showActiveStatus === false) {
            await homePageData('Unapproval');
        }
        else {
            await homePageData('Deactive');
        }

        setIsLoading(false);
        setCount(count => count + 1);
    };

    // When RefreshTable button is clicked
    const RefreshBtnOnClick = async () => {
        setShowSomethingWrongDialogBox(false);
        setShowDialogBoxContent({ ShowDialogBox: false });
        RefreshTable();
    };

    // When status button is clicked
    const clickFunctions = async (e) => {
        setDialogBoxCount(count => count + 1);
        setShowSomethingWrongDialogBox(false);
        const { id } = e.target;
        if (id === 'deactiveBtn') {
            setShowDialogBoxContent({
                ShowDialogBox: true,
                TextDialogTitle: "Deactivate",
                TextDialogContent: "Are you Sure to Deactivate?",
                TextDialogButtonOnConfirmId: "deactiveBtn",
                TextDialogButtonOnConfirm: "Deactivate",
                showCancelBtn: true
            });
        } else if (id === 'activeBtn') {
            setShowDialogBoxContent({
                ShowDialogBox: true,
                TextDialogTitle: "Activate",
                TextDialogContent: "Are you Sure to Activate?",
                TextDialogButtonOnConfirmId: "activeBtn",
                TextDialogButtonOnConfirm: "Activate",
                showCancelBtn: true
            });
        } else if (id === 'approveBtn') {
            setShowDialogBoxContent({
                ShowDialogBox: true,
                TextDialogTitle: "Approve",
                TextDialogContent: "Are you Sure to Approve?",
                TextDialogButtonOnConfirmId: "approveBtn",
                TextDialogButtonOnConfirm: "Approve",
                showCancelBtn: true
            });
        }
    };

    // When status button is clicked after confirm
    const clickFunctionsOnConfirm = async (e) => {
        setShowDialogBoxContent({ ShowDialogBox: false });
        setShowSomethingWrongDialogBox(false);
        const { id } = e.target;
        if (id === 'OK') {
            return;
        }

        let header = "";
        if (id === 'deactiveBtn') {
            header = 'deactive';
        } else if (id === 'activeBtn') {
            header = 'active';
        } else if (id === 'approveBtn') {
            header = 'approve';
        }

        try {
            const keysArray = Object.keys(rowSelection);

            let response = await axios.post(process.env.REACT_APP_UPDATE_API_URL, { data: keysArray }, {
                headers: { 'Content-Type': 'application/json', 'x-update': header }
            });

            if (response.status === 200) { // When response is 200
                RefreshTable();
                setShowRowSelectionBtns({ isShowRowSelectionBtns: false });
                setRowSelection({});
                setDialogBoxCount(count => count + 1);
                setShowSomethingWrongDialogBox(false);
                if (response.data.message) {
                    setShowDialogBoxContent({
                        ShowDialogBox: true,
                        TextDialogTitle: "Message",
                        TextDialogContent: response.data.message,
                        TextDialogButtonOnConfirmId: "OK",
                        TextDialogButtonOnConfirm: "OK",
                        showCancelBtn: false
                    });
                } else if (header === 'deactive') {
                    setShowDialogBoxContent({
                        ShowDialogBox: true,
                        TextDialogTitle: "Success",
                        TextDialogContent: "Deactivated Successfully",
                        TextDialogButtonOnConfirmId: "OK",
                        TextDialogButtonOnConfirm: "OK",
                        showCancelBtn: false
                    });
                } else if (header === 'active') {
                    setShowDialogBoxContent({
                        ShowDialogBox: true,
                        TextDialogTitle: "Success",
                        TextDialogContent: "Activated Successfully",
                        TextDialogButtonOnConfirmId: "OK",
                        TextDialogButtonOnConfirm: "OK",
                        showCancelBtn: false
                    });
                } else if (header === 'approve') {
                    setShowDialogBoxContent({
                        ShowDialogBox: true,
                        TextDialogTitle: "Success",
                        TextDialogContent: "Approved Successfully",
                        TextDialogButtonOnConfirmId: "OK",
                        TextDialogButtonOnConfirm: "OK",
                        showCancelBtn: false
                    });
                }
            }

        } catch {
            setDialogBoxCount(count => count + 1);
            setShowSomethingWrongDialogBox(true);
        }
    };

    return (
        <div>
            {showSomethingWrongDialogBox
                && <DialogSomethingWrong key={dialogBoxCount} />}
            {showDialogBoxContent.ShowDialogBox
                && <DialogBoxes key={dialogBoxCount}
                    showDefaultTextDialogButton={false}
                    TextDialogTitle={showDialogBoxContent.TextDialogTitle}
                    TextDialogContent={showDialogBoxContent.TextDialogContent}
                    TextDialogButtonOnConfirm={showDialogBoxContent.TextDialogButtonOnConfirm}
                    TextDialogButtonOnConfirmId={showDialogBoxContent.TextDialogButtonOnConfirmId}
                    showCancelBtn={showDialogBoxContent.showCancelBtn}
                    clickFunctionsOnConfirm={clickFunctionsOnConfirm} />}
            <br />
            {
                !showForm ?
                    <>
                        <Button variant="contained" className="HomePageButttons" onClick={ToggleForm}><AddIcon />&nbsp;ADD NEW</Button>
                        <Button variant="contained" id="RefreshBtn" onClick={RefreshBtnOnClick}><RefreshIcon /></Button>
                        <div style={{ marginTop: "2rem" }}>
                            <Switch
                                checked={approvedToggleState}
                                id='ApprovedToggleBtn'
                                onChange={statusToggleOnClick}
                            /> <span style={{ fontWeight: 'bold' }}>Unapproved</span>
                            {showActiveStatus && <span><Switch
                                checked={activeToggleState}
                                id='ActiveToggleBtn'
                                onChange={statusToggleOnClick}
                            /> <span style={{ fontWeight: 'bold' }}>Active</span></span>}
                        </div>
                        <br />
                        <div style={{ backgroundColor: 'white', fontSize: '20px' }}>
                            <span style={{ marginLeft: '1rem' }}>{showMessageBeforeTable}</span>
                        </div>
                        <Table key={count}
                            columnsProps={homePageHeader}
                            dataProps={data}
                            isLoadingState={isLoading}
                            isShowRowSelectionBtns={editPermissions && showRowSelectionBtns.isShowRowSelectionBtns}
                            showRowSelectionBtns={editPermissions && showRowSelectionBtns}
                            rowSelection={rowSelection}
                            setRowSelection={setRowSelection}
                            clickFunctions={clickFunctions} />
                    </>
                    :
                    <>
                        <Button variant="contained" className="HomePageButttons" onClick={ToggleForm}><ArrowBackIcon />&nbsp;BACK TO TABLE</Button>
                        <CreateForm />
                    </>
            }

        </div>
    );
};

export default HomePage;

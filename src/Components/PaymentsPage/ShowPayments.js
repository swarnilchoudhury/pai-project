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
import { usePermissions } from '../../Context/PermissionContext';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import useDialogBoxHandler from '../../CustomHooks/DialogBoxHandler';

const PaymentPage = () => {

    const [showForm, setShowForm] = useState(false);
    const [showPaidStatus, setShowPaidStatus] = useState(true);
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showMessageBeforeTable, setShowMessageBeforeTable] = useState("");
    const [count, setCount] = useState(0);
    const { editPermissions } = usePermissions();
    const { handleErrorMessage } = useErrorMessageHandler();
    const { showDialogBox } = useDialogBoxHandler();

    //  Add state variables to remember toggle button states
    const [paidToggleState, setPaidToggleState] = useState(false);


    //  Payment Page Header for Showing in Table
    const paymentPageHeader = [
        { accessorKey: 'studentName', header: 'Student Name' },
        { accessorKey: 'studentCode', header: 'Code' }
        // { accessorKey: 'guardianName', header: 'Guardian Name' },
        // { accessorKey: 'dob', header: 'Date of Birth' },
        // { accessorKey: 'admissionDate', header: 'Admission Date' },
        // { accessorKey: 'phoneNumber', header: 'Phone Number' },
        // { accessorKey: 'createdDateTimeFormatted', header: 'Created Date Time' },
        // { accessorKey: 'createdBy', header: 'Created By' }
    ];

    //  Fetch Home Page Data
    const paymentPageData = async (status) => {
        try {
            let response = await axios.get(process.env.REACT_APP_HOME_API_URL, {
                headers: { 'x-status': status }
            });

            setData(response.data);
            

            // Show the messages before the table
            if (status === 'Paid') {
                setShowMessageBeforeTable(
                    <span className='DescBeforeTable'>
                        <strong>(Active)</strong> Ekhane jara payment kore dieche
                    </span>
                );
            }
            else {
                setShowMessageBeforeTable(
                    <span className='DescBeforeTable'>
                        <strong>(Deactive)</strong> Ekhane jara payment koreni
                    </span>
                );
            }          
        } catch {         
            handleErrorMessage();
        }

        setCount(count => count + 1);
        setIsLoading(false);
    };

    //  When toggles on statusToggle button
    const statusToggleOnClick = async (e) => {
        setIsLoading(true);
        setCount(count => count + 1);

        const { id, checked } = e.target;
        if (id === 'PaidToggleBtn') {
            setPaidToggleState(checked); //  Update state
            if (checked) {
                await paymentPageData('Paid');
            } else {
                await paymentPageData('Unpaid');
            }
        }
        // } else if (id === 'ApprovedToggleBtn') {
        //     setApprovedToggleState(checked); //  Update state
        //     setActiveToggleState(true);
        //     setShowActiveStatus(!checked);
        //     if (checked) {
        //         await paymentPageData('Unapproval');
        //     } else {
        //         await paymentPageData('Active');
        //     }
        // }
        setIsLoading(false);
    };

    //  Render first time when Home Page mounts
    useEffect(() => { 
        document.title = 'Payment Page';
        paymentPageData('Paid'); // eslint-disable-next-line
    }, []);

    //  When changing the form from create to home or vice-versa
    const ToggleForm = (e) => {
        e.preventDefault();
        setShowForm(state => !state);
    };

    //  When RefreshTable button is clicked
    const RefreshTable = async () => {
        setIsLoading(true);

        if (activeToggleState === true && showActiveStatus === true) {
            await paymentPageData('Active');
        }
        else if (approvedToggleState === true && showActiveStatus === false) {
            await paymentPageData('Unapproval');
        }
        else {
            await paymentPageData('Deactive');
        }

        setIsLoading(false);
        setCount(count => count + 1);
    };

    //  When RefreshTable button is clicked
    const RefreshBtnOnClick = async () => {
        RefreshTable();
    };

   

    //  When status button is clicked after confirm
    const clickFunctionsOnConfirm = async (e) => {
        
        showDialogBox({ dialogTextTitle: 'Message', dialogTextContent: 'Processing...', showButtons: false });
        
        const { id } = e.target;

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

            if (response.status === 200) {
                // Common actions when the status is 200
                RefreshTable();
                setShowRowSelectionBtns({ isShowRowSelectionBtns: false });
                setRowSelection({});
            
                // Setting up the dialog content based on different cases
                const dialogContent = {
                    showButtons: true,
                    dialogTextTitle: "",
                    dialogTextContent: "",
                    dialogTextButton: "OK",
                    showDefaultButton: true
                };
            
                // Set dialog based on the response message or header type
                if (response.data.message) {
                    dialogContent.dialogTextTitle = "Message";
                    dialogContent.dialogTextContent = response.data.message;
                } else {
                    switch (header) {
                        case 'deactive':
                            dialogContent.dialogTextTitle = "Success";
                            dialogContent.dialogTextContent = "Deactivated Successfully";
                            break;
            
                        case 'active':
                            dialogContent.dialogTextTitle = "Success";
                            dialogContent.dialogTextContent = "Activated Successfully";
                            break;
            
                        case 'approve':
                            dialogContent.dialogTextTitle = "Success";
                            dialogContent.dialogTextContent = "Approved Successfully";
                            break;
            
                        default:
                            return;
                    }
                }
            
                // Call the dialog box function with the constructed content
                showDialogBox(dialogContent);
            }    

        } catch {
            handleErrorMessage();
        }
    };

    const clickFunctions = async (e) => {
        const { id } = e.target;
    
        const dialogContent = {
            showButtons: true,
            dialogTextTitle: "",
            dialogTextContent: "",
            dialogTextButtonOnConfirmId: id,
            clickFunctionsOnConfirmFunction: clickFunctionsOnConfirm,
            showCancelBtn: true,
        };
        
        // Set dialog based on header type
        switch (id) {
            case 'deactiveBtn':
                dialogContent.dialogTextTitle = "Deactivate";
                dialogContent.dialogTextContent = "Are you Sure to Deactivate?";
                dialogContent.dialogTextButtonOnConfirm = "Deactivate";
                break;
            case 'activeBtn':
                dialogContent.dialogTextTitle = "Activate";
                dialogContent.dialogTextContent = "Are you Sure to Activate?";
                dialogContent.dialogTextButtonOnConfirm = "Activate";
                break;
            case 'approveBtn':
                dialogContent.dialogTextTitle = "Approve";
                dialogContent.dialogTextContent = "Are you Sure to Approve?";
                dialogContent.dialogTextButtonOnConfirm = "Approve";
                break;
            default:
                return;
        }
        
        // Call the dialog box function with the constructed content
        showDialogBox(dialogContent);
    };
    

    return (
        <div>
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
                            columnsProps={paymentPageHeader}
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

export default PaymentPage;

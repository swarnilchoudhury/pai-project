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

const HomePage = () => {

    const [showForm, setShowForm] = useState(false);
    const [showActiveStatus, setShowActiveStatus] = useState(true);
    const [activeStatus, setActiveStatus] = useState(true);
    const [approvedData, setApprovedData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showSomethingWrongDialogBox, setShowSomethingWrongDialogBox] = useState(false);
    const [count, setCount] = useState(0);

    const homePageHeader =
        [
            {
                accessorKey: 'StudentName',
                header: 'Student Name',
            },
            {
                accessorKey: 'StudentCode',
                header: 'Code',
            },
            {
                accessorKey: 'GuardianName',
                header: 'Guardian Name',
            },
            {
                accessorKey: 'DOB',
                header: 'Date of Birth',
            },
            {
                accessorKey: 'AdmissionDate',
                header: 'Admission Date',
            },
            {
                accessorKey: 'PhoneNumber',
                header: 'Phone Number',
            },
            {
                accessorKey: 'CreatedDateTimeFormatted',
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


    const ToggleForm = (e) => {

        e.preventDefault();
        setShowForm(state => !state);

    };

    const RefreshBtnOnClick = async (e) => {
        setIsLoading(true);

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

    return (
        <div>
            {showSomethingWrongDialogBox && <DialogSomethingWrong key={count} />}
            <br />
            {
                !showForm ?
                    <>

                        <Button variant="contained" className="HomePageButttons" onClick={(e) => ToggleForm(e)}><AddIcon />&nbsp;ADD NEW</Button>
                        <Button variant="contained" id="RefreshBtn" onClick={(e) => RefreshBtnOnClick(e)}><RefreshIcon /></Button>
                        <div style={{ marginTop: "2rem" }}>
                            <Switch defaultChecked={false} id='ApprovedToggleBtn' onChange={statusToggleOnClick} /> <span style={{ fontWeight: 'bold' }}>Unapproved</span>
                            {showActiveStatus && <span style={{ marginLeft: "1.5rem" }} ><Switch defaultChecked={activeStatus} id='ActiveToggleBtn' onChange={statusToggleOnClick} /> <span style={{ fontWeight: 'bold' }}>Active</span></span>}
                        </div>
                        <Table key={count} columnsProps={homePageHeader} dataProps={approvedData} isLoadingState={isLoading} />
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

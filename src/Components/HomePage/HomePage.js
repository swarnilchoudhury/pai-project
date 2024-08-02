import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import Table from '../Table/Table.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../ComponetsStyles/HomePage.css'
import CreateForm from './CreateForm.js';
import axios from '../../Components/AxiosInterceptor/axiosInterceptor.js'

const HomePage = () => {

    const [showForm, setshowForm] = useState(false);
    const [activeStatus, setActiveStatus] = useState(true);
    const [approvedData, setapprovedData] = useState({});
    const [isLoading, setisLoading] = useState(true);

    const [count, setCount] = useState(0);

    const homePageHeader =
        [
            {
                accessorKey: 'studentName',
                header: 'Sudent Name',
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
                accessorKey: 'DOB',
                header: 'Date of Birth',
            },
            {
                accessorKey: 'AdmissionDate',
                header: 'Admission Date',
            },
            {
                accessorKey: 'phoneNumber',
                header: 'Phone Number',
            },
            {
                accessorKey: 'CreatedDateTime',
                header: 'Created Date Time',
            }
        ]


    const homePageData = async (status) => {

        let response = await axios.get(process.env.REACT_APP_HOME_API_URL,
            {
                headers:
                    { 'x-status': status }
            });

        setisLoading(false);
        setapprovedData(response.data);
    }


    useEffect(() => {
        document.title = 'Home Page';
        homePageData('Active');
    }, []);


    const ToggleForm = (e) => {

        e.preventDefault();
        setshowForm(state => !state);

    };

    const RefreshBtnOnClick = (e) => {
        setisLoading(true);

        let activeToggleBtn = document.getElementById('ActiveToggleBtn');

        if (activeToggleBtn.checked) {
            setActiveStatus(true);
            homePageData('Active');
        }
        else {
            setActiveStatus(false);
            homePageData('Deactive');
        }

        setCount(count => count + 1);
    }

    return (
        <div>
            <br />
            {
                !showForm ?
                    <>
                        <Button variant="contained" className="HomePageButttons" onClick={(e) => ToggleForm(e)}><AddIcon />&nbsp;ADD NEW STUDENT</Button>
                        <Button variant="contained" id="RefreshBtn" onClick={(e) => RefreshBtnOnClick(e)}><RefreshIcon /></Button>
                        <br />
                        <br />
                        <Table key={count} columnsProps={homePageHeader} dataProps={approvedData} isLoadingState={isLoading} defaultCheckedProp={activeStatus} homePageData={homePageData} />
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

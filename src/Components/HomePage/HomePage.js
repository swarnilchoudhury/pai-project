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
import CreateForm from './CreateForm.js';

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
            <br />
            {
                !showForm ?
                    <>

                        <Button variant="contained" className="HomePageButttons" onClick={(e) => ToggleForm(e)}><AddIcon />&nbsp;ADD NEW STUDENT</Button>
                        <br />
                        <br />
                        <Table columnsProps={homePageHeader} dataProps={approvedData} isLoadingState={isLoading} />
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

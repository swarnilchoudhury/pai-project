import React, { useState } from 'react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../Components/FirebaseConfig.js';
import Tables from './Table.tsx';
import Spinner from '../Spinner.js';
import '../../ComponetsStyles/SearchPage.css';


const SearchPage = () => {

    const [selectedStartDate, setselectedStartDate] = useState(dayjs().subtract(30, 'day'));
    const [selectedToDate, setselectedToDate] = useState(dayjs());
    const [isTableShow, setisTableShow] = useState(false);
    const [TableData, setTableData] = useState([]);
    const [count, setCount] = useState(0);


    const SubmitBtnOnClick = async (e) => {

        e.preventDefault();

        let StartDate = Timestamp.fromDate(selectedStartDate.toDate());
        let ToDate = Timestamp.fromDate(selectedToDate.toDate());

        const StudentDetailsCollection = collection(db, 'StudentDetails');

        let StudentDetailsCollectionquery = query(StudentDetailsCollection, where('CreatedDateTime', '>=', StartDate), where('CreatedDateTime', '<=', ToDate));

        let StudentDetailsArray = [];
        const querySnapshot = await getDocs(StudentDetailsCollectionquery);
        querySnapshot.docs.map((doc) => {
            StudentDetailsArray.push(({ ...doc.data(), id: doc.id }));
        });

        if (StudentDetailsArray.length > 0) {

            setCount(count => count + 1);
            setisTableShow(true);
            setTableData(StudentDetailsArray);

        }

    };

    return (
        <div>
            <section className="vh-200">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <p className="mb-4 pText" style={{ "fontWeight": "bold" }}>Search</p>
                                    <form id='searchForm' onSubmit={SubmitBtnOnClick}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker']}>
                                                <DemoItem className='DateClass' label="Start Date">
                                                    <MobileDatePicker label="Select Date"
                                                        value={selectedStartDate}
                                                        onChange={(startDate) => setselectedStartDate(startDate)}
                                                    />
                                                </DemoItem>
                                                <DemoItem label="To Date">
                                                    <MobileDatePicker label="Select Date"
                                                        value={selectedToDate}
                                                        onChange={(toDate) => setselectedToDate(toDate)}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        <br />
                                        <Button variant="contained" id="SearchBtn" type="submit">Search</Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {isTableShow && <Tables key={count} props={TableData} />}
        </div>
    )
}

export default SearchPage

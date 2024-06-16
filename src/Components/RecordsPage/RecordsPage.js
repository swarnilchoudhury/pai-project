import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Tables from '../Table/Table.tsx';
import { collection, getDocs, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../Configs/FirebaseConfig.js';
import Button from '@mui/material/Button';
import { MdOutlineReplay } from "react-icons/md";
import '../../ComponetsStyles/SearchPage.css';

const RecordsPage = () => {

    const [TableData, setTableData] = useState([]);
    const [count, setCount] = useState(0);

    let todayDate = dayjs().toDate().toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });
    let beforeDate = dayjs().subtract(180, 'day').toDate().toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });

    const StudentTableData = async () => {

        let previousDate = dayjs().subtract(180, 'day');
        let currentDate = dayjs();
        let StartDate = Timestamp.fromDate(previousDate.toDate());
        let ToDate = Timestamp.fromDate(currentDate.toDate());

        const studentDetailsCollection = collection(db, 'StudentDetails');
        let studentDetailsCollectionQuery = query(studentDetailsCollection, where('CreatedDateTime', '>=', StartDate), where('CreatedDateTime', '<=', ToDate), orderBy('CreatedDateTime', 'desc'));

        let studentDetailsArray = [];
        const querySnapshot = await getDocs(studentDetailsCollectionQuery);
        querySnapshot.docs.map((doc) => {
            studentDetailsArray.push(({ ...doc.data(), id: doc.id }));
        });

        if (studentDetailsArray.length > 0) {

            setCount(count => count + 1);
            setTableData(studentDetailsArray);

        }
    }

    useEffect(() => {
        StudentTableData(); // Fetch data when the component mounts
    }, []);


    return (
        <div>
            <section className="vh-200">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <p className="mb-4 pText" style={{ "fontWeight": "bold" }}>Records are fetched from the below Dates.</p>
                                    <p className="mb-4 pText" style={{ "fontWeight": "bold" }}>({beforeDate} - {todayDate})</p>
                                    <Button variant="contained" id="RefreshBtn" onClick={StudentTableData}><MdOutlineReplay />&nbsp;Refresh Table</Button>
                                    <br />
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Tables key={count} props={TableData} showAdditionalData={true} />
        </div>
    )
}

export default RecordsPage

import React, { useState } from 'react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { collection, getDocs, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../Components/FirebaseConfig.js';
import Tables from './Table.tsx';
import { MdDownload } from "react-icons/md";
import Spinner from '../Spinner.js';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MdOutlineReplay } from "react-icons/md";
import '../../ComponetsStyles/SearchPage.css';


const SearchPage = () => {

    const [selectedStartDate, setselectedStartDate] = useState(dayjs().subtract(30, 'day'));
    const [selectedToDate, setselectedToDate] = useState(dayjs());
    const [isLoadingShow, setisLoadingShow] = useState(false);
    const [isTableShow, setisTableShow] = useState(false);
    const [isNoRecords, setisNoRecords] = useState(false);
    const [TableData, setTableData] = useState([]);
    const [count, setCount] = useState(0);


    const SubmitBtnOnClick = async (e) => {

        e.preventDefault();

        setisLoadingShow(true);
        setisTableShow(false);

        let StartDate = Timestamp.fromDate(selectedStartDate.toDate());
        let ToDate = Timestamp.fromDate(selectedToDate.toDate());
        let StudentNameTxt = document.getElementById('StudentNameTxt');
        let LevelTxt = document.getElementById('LevelTxt');
        let StudentDetailsCollectionquery = null;

        const StudentDetailsCollection = collection(db, 'StudentDetails');

        if (StudentNameTxt.value !== null && StudentNameTxt.value.trim() !== ''
            && (LevelTxt.value === null || LevelTxt.value.trim() === '')) {

            StudentDetailsCollectionquery = query(StudentDetailsCollection, where('studentName', '>=', StudentNameTxt.value.toUpperCase()), where('studentName', '<=', StudentNameTxt.value.toUpperCase() + '\uf8ff'), orderBy('studentName'), orderBy('CreatedDateTime', 'desc'));

        }
        else if (LevelTxt.value !== null && LevelTxt.value.trim() !== ''
            && (StudentNameTxt.value === null || StudentNameTxt.value.trim() === '')) {

            StudentDetailsCollectionquery = query(StudentDetailsCollection, where('Level', '==', LevelTxt.value.toUpperCase()), orderBy('CreatedDateTime', 'desc'));

        }
        else if (StudentNameTxt.value !== null && StudentNameTxt.value.trim() !== ''
            && (LevelTxt.value !== null || LevelTxt.value.trim() !== '')) {

            StudentDetailsCollectionquery = query(StudentDetailsCollection, where('studentName', '==', StudentNameTxt.value.toUpperCase()), where('Level', '==', LevelTxt.value.toUpperCase()), orderBy('CreatedDateTime', 'desc'));

        }

        else {
            StudentDetailsCollectionquery = query(StudentDetailsCollection, where('CreatedDateTime', '>=', StartDate), where('CreatedDateTime', '<=', ToDate), orderBy('CreatedDateTime', 'desc'));
        }

        let StudentDetailsArray = [];
        const querySnapshot = await getDocs(StudentDetailsCollectionquery);
        querySnapshot.docs.map((doc) => {
            StudentDetailsArray.push(({ ...doc.data(), id: doc.id }));
        });

        if (StudentDetailsArray.length > 0) {

            setCount(count => count + 1);
            setisTableShow(true);
            setTableData(StudentDetailsArray);
            setisNoRecords(false);

        }
        else {
            setCount(count => count + 1);
            setisNoRecords(true);
        }

        setisLoadingShow(false);


    };

    const ClearBtnOnClick = (e) => {

        e.preventDefault();

        let StudentNameTxt = document.getElementById('StudentNameTxt');
        let LevelTxt = document.getElementById('LevelTxt');

        StudentNameTxt.value = "";
        LevelTxt.value = "";

    }

    const DownloadExcelBtn = () => {

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentDate = new Date();
        const monthName = monthNames[currentDate.getMonth()];
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear().toString();
        const formattedDate = `${day}${month}${year}`;

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.table_to_sheet(document.getElementById('ResultsTable'));

        // Set column widths for A to R
        const columnWidths = Array.from({ length: 18 }, () => ({ wch: 20 }));
        worksheet['!cols'] = columnWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, 'PAI_Results_' + monthName);

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(data, 'PAI_Results_' + monthName + '_' + formattedDate + '.xlsx');
    }


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
                                        <FormControl sx={{ width: '100%' }} variant="outlined">
                                            <InputLabel htmlFor="Student Name">Student Name</InputLabel>
                                            <OutlinedInput
                                                id="StudentNameTxt"
                                                type="text"
                                                label="Student Name"
                                            />
                                        </FormControl>
                                        <br />
                                        <br />
                                        <FormControl sx={{ width: '100%' }} variant="outlined">
                                            <InputLabel htmlFor="Level">Level</InputLabel>
                                            <OutlinedInput
                                                id="LevelTxt"
                                                type="text"
                                                label="Level"
                                                inputProps={{ maxLength: 5 }}
                                            />
                                        </FormControl>
                                        <br />
                                        <br />
                                        <Button variant="contained" id="SearchBtnOnSearch" type="submit">Search</Button>
                                        <Button variant="contained" id="ClearBtnOnSearch" onClick={(e) => ClearBtnOnClick(e)}><MdOutlineReplay /> Clear</Button>
                                        <br />
                                        <br />
                                        {isTableShow && <Button variant="contained" onClick={DownloadExcelBtn}><MdDownload style={{ marginRight: '.5rem' }} />Download Excel</Button>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {isNoRecords && <div id='totalNumberOfRecords'>No Records Found.</div>}
            {isLoadingShow && <div className='spinnerSearchDiv'><Spinner /></div>}
            {isTableShow && <Tables key={count} props={TableData} showAdditionalData={false} />}
        </div>
    )
}

export default SearchPage

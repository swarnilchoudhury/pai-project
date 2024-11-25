import React, { useEffect, useState } from 'react'
import { usePermissions } from '../../Context/PermissionContext';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Button, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import dayjs from 'dayjs';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import '../../ComponetsStyles/CreateForm.css';
import LoadingSpin from 'react-loading-spin';
import CreatePayments from './CreatePayments';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import MiscTable from '../Table/MinimalTable';
import ShowTotalPaymentsPage from './ShowTotalPaymentsPage';

const PaymentsPage = () => {

    const { editPermissions } = usePermissions();
    const navigate = useNavigate();
    const [selectedValues, setSelectedValues] = useState([]);
    const [monthDate, setMonthDate] = useState('');
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [selectMonthOption, setSelectMonthOption] = useState(true);

    const [showSearch, setShowSearch] = useState(false);
    const [showCreatePayment, setShowCreatePayment] = useState(false);
    const [showTotalPaymentsPage, setShowTotalPaymentsPage] = useState(false);
    const [selectedOption, setSelectedOption] = useState('ByMonth');
    const [selectedIsGivenOption, setSelectedIsGivenOption] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStudentOption, setSelectedStudentOption] = useState('');
    const [selectedOptionType, setSelectedOptionType] = useState();
    const [showTableDetails, setShowTableDetails] = useState({
        showTable: false,
        header: [],
        data: null
    });

    //  Render first time when Create Payments Page mounts
    useEffect(() => {
        document.title = 'Create Payments';
    }, []);


    useEffect(() => {
        if (!editPermissions) {
            navigate('/Home');
        }
    }, [editPermissions, navigate]);



    const { handleErrorMessage } = useErrorMessageHandler();


    const handleDateChange = (date) => {
        setShowSearch(false);
        if (date) {
            const formattedDate = dayjs(date).format('MMM_YYYY'); // "MMM_YYYY"
            setMonthDate(formattedDate);
            setShowSearch(true);
        }
    };

    const handleOptionChange = async (e) => {
        setSelectedStudentOption("");
        setMonthDate(null);
        setShowTableDetails({
            showTable: false,
        });
        setShowSearch(false);
        setSelectedOptionType(e.target.value);

        if (e.target.value === 'ByMonth') {
            setSelectedOption('ByMonth');
            setSelectMonthOption(true);
        }
        else {
            setIsLoading(true);
            setSelectedOption('ByStudent');
            setSelectMonthOption(false);
            try {
                let response = await axios.get(process.env.REACT_APP_GET_STUDENTS_API_URL);
                setSelectedValues(response.data);
            }
            catch {
                handleErrorMessage();
            }
            setIsLoading(false);
        }
    };

    const handleIsGivenOptionChange = (e) => {
        setSelectedIsGivenOption(e.target.value);
    }

    const handleSelectStudentsChange = (value) => {
        if (value) {
            setSelectedStudentOption(value);
            setShowSearch(true);
        }
        else {
            setSelectedStudentOption('');
            setShowSearch(false);
        }
    };

    const searchBtnOnClick = async (e) => {
        e.preventDefault();
        setIsBtnLoading(true);
        try {
            if (selectedOptionType === 'ByStudent') {
                let response = await axios.post(process.env.REACT_APP_BY_STUDENTS_PAYMENTS_API_URL,
                    { studentId: selectedStudentOption }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const studentPageHeader = [
                    { accessorKey: 'month', header: 'Payment Month' },
                    { accessorKey: 'amount', header: 'Amount' },
                    { accessorKey: 'modeOfPayment', header: 'Mode of Payment' },
                    { accessorKey: 'paymentDate', header: 'Payment Date' },
                    { accessorKey: 'createdDateTime', header: 'Created Date Time' }
                ];

                setShowTableDetails({
                    showTable: true,
                    header: studentPageHeader,
                    data: response.data
                });

            }
            else {

                let response = await axios.post(process.env.REACT_APP_BY_MONTHLY_PAYMENTS_API_URL,
                    { month: monthDate, isGiven: selectedIsGivenOption }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                let monthPageHeader;
                if (selectedIsGivenOption === 1) {
                    monthPageHeader = [
                        { accessorKey: 'studentName', header: 'Student Name' },
                        { accessorKey: 'studentCode', header: 'Student Code' },
                        { accessorKey: 'modeOfPayment', header: 'Mode of Payment' },
                        { accessorKey: 'amount', header: 'Amount' },
                        { accessorKey: 'paymentDate', header: 'Payment Date' },
                        { accessorKey: 'createdDateTime', header: 'Created Date Time' }
                    ];
                }
                else {
                    monthPageHeader = [
                        { accessorKey: 'studentName', header: 'Student Name' },
                        { accessorKey: 'studentCode', header: 'Student Code' }
                    ];

                }

                setShowTableDetails({
                    showTable: true,
                    header: monthPageHeader,
                    data: response.data
                });
            }

        }
        catch {
            handleErrorMessage();
        }
        setIsBtnLoading(false);

    }

    //  When changing the form from create to home or vice-versa
    const ToggleForm = (e) => {
        e.preventDefault();
        setShowTotalPaymentsPage(false);
        setShowCreatePayment(state => !state);
    };

    const ShowTotalPayments = () => {
        setShowTotalPaymentsPage(true);

    };

    return (
        <div>
            <br />
            <Button variant="contained" className="HomePageButttons" onClick={ToggleForm}>{showCreatePayment ? <><ArrowBackIcon />&nbsp;BACK</> : <><AddIcon />&nbsp;PAYMENTS</>}</Button>
            {!showTotalPaymentsPage && <Button variant="contained" className="HomePageButttons" onClick={ShowTotalPayments}><SearchIcon />&nbsp;TOTAL</Button>}
            {!showTotalPaymentsPage &&
                (!showCreatePayment ?
                    <>
                        <section className="vh-200">
                            <div className="container py-5 h-100">
                                <div className="row d-flex justify-content-center align-items-center h-100">
                                    <div className="formDiv">
                                        <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                            <div className="card-body p-5 text-center">
                                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>SHOW PAYMENTS</p>
                                                <hr />
                                                <div className="form-group row">
                                                    <div className="col-sm-6">
                                                        <Box>
                                                            <FormControl fullWidth>
                                                                <InputLabel id="simple-select-label">Select Option</InputLabel>
                                                                <Select
                                                                    labelId="simple-select-label"
                                                                    id="simple-select"
                                                                    value={selectedOption}
                                                                    label="Payment Mode"
                                                                    onChange={handleOptionChange}
                                                                >
                                                                    <MenuItem value={'ByMonth'}>Show by Month</MenuItem>
                                                                    <MenuItem value={'ByStudent'}>Show by Student</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Box>
                                                    </div>
                                                    <br />
                                                    <div>
                                                        {
                                                            selectMonthOption ?
                                                                <>
                                                                    <br />
                                                                    <div className="col-sm-10">
                                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                            <DemoContainer components={['DatePicker']}>
                                                                                <DatePicker
                                                                                    value={monthDate ? dayjs(monthDate, 'MMM_YYYY') : null}
                                                                                    onChange={(e) => handleDateChange(e)}
                                                                                    label="Payment Month"
                                                                                    views={['month', 'year']}
                                                                                    slotProps={{ field: { clearable: true } }}
                                                                                />
                                                                            </DemoContainer>
                                                                        </LocalizationProvider>
                                                                        <br />
                                                                    </div>
                                                                    <br />
                                                                    <div className="form-group row">
                                                                        <div className="col-sm-6">
                                                                            <Box>
                                                                                <FormControl fullWidth>
                                                                                    <Select
                                                                                        labelId="simple-select-label"
                                                                                        id="simple-select"
                                                                                        value={selectedIsGivenOption}
                                                                                        onChange={handleIsGivenOptionChange}
                                                                                    >
                                                                                        <MenuItem value={1}>Given</MenuItem>
                                                                                        <MenuItem value={0}>Not Given</MenuItem>
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </Box>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    {isLoading ? <LoadingSpin /> :
                                                                        <>
                                                                            <br />
                                                                            <div className="col-sm-8">
                                                                                <Box>
                                                                                    <Autocomplete
                                                                                        fullWidth
                                                                                        options={selectedValues}
                                                                                        getOptionLabel={(option) => option.studentDetails || ""}
                                                                                        value={
                                                                                            selectedValues.find((option) => option.id === selectedStudentOption) || null
                                                                                        }
                                                                                        onChange={(event, value) => {
                                                                                            handleSelectStudentsChange(value ? value.id : "");
                                                                                        }}
                                                                                        renderInput={(params) => (
                                                                                            <TextField {...params} label="Select Student" variant="outlined" />
                                                                                        )}
                                                                                    />
                                                                                </Box>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </>
                                                        }
                                                        {
                                                            !isBtnLoading ?
                                                                <Button variant="contained" id="searchtHomeBtn" disabled={!showSearch} onClick={searchBtnOnClick}><SearchIcon />Search</Button>
                                                                :
                                                                <Button variant="contained" id="searchtHomeBtn" disabled={true}><SearchIcon />Searching...</Button>
                                                        }

                                                    </div>
                                                </div>
                                            </div >
                                        </div >
                                    </div >
                                </div >
                            </div >
                        </section >
                        {showTableDetails.showTable && <MiscTable
                            columnsProps={showTableDetails.header}
                            dataProps={showTableDetails.data}
                            isLoadingState={isBtnLoading} />}
                    </>
                    :
                    <>
                        {showCreatePayment && <CreatePayments />}
                    </>
                )
            }
            <br />
            {showTotalPaymentsPage && <ShowTotalPaymentsPage />}
        </div>
    );
};

export default PaymentsPage;

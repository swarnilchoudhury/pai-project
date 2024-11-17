import React, { useEffect, useState } from 'react'
import MultipleDropdown from '../MultipleDropdown/MultipleDropdown'
import { usePermissions } from '../../Context/PermissionContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import useDialogBoxHandler from '../../CustomHooks/DialogBoxHandler';
import { MdOutlineReplay } from "react-icons/md";
import '../../ComponetsStyles/CreateForm.css';
import CloseIcon from '@mui/icons-material/Close';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Spinner from '../Spinner/Spinner';
import LoadingSpin from 'react-loading-spin';

const PaymentsPage = () => {

    const { editPermissions } = usePermissions();
    const navigate = useNavigate();
    const { showDialogBox } = useDialogBoxHandler();

    let defaultformsTxts = {

        students: [],
        amount: 500,
        modeOfPayment: "",
        month: "",
        paymentDate: ""
    }

    const [formsTxts, setFormsTxts] = useState(defaultformsTxts);
    const [selectedValues, setSelectedValues] = useState([]);
    const [values, setValues] = useState(['Loading...']);
    const [monthDate, setMonthDate] = useState('');
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [selectMonthOption, setSelectMonthOption] = useState(true);
    const [dates, setDates] = useState({ // Set the dates
        selectedPaymentDate: ""
    });
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [selectedOption, setSelectedOption] = useState('ByMonth');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStudentOption, setSelectedStudentOption] = useState('');

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
        if (date) {
            const formattedDate = dayjs(date).format('MMM_YYYY'); // "MMM_YYYY"
            setMonthDate(formattedDate);
            setFormsTxts(prev => ({ ...prev, month: formattedDate }));
        }
    };

    const handleOptionChange = async (e) => {
        if (e.target.value === 'ByMonth') {
            setSelectedOption('ByMonth');
            setSelectMonthOption(true);
        }
        else {
            setIsLoading(true);
            setSelectedOption('ByStudent');
            setSelectMonthOption(false);
            let response = await axios.get(process.env.REACT_APP_GET_STUDENTS_API_URL);
            setSelectedValues(response.data);
            setIsLoading(false);
        }
    };

    const handleSelectStudentsChange = (e) => {
        setSelectedStudentOption(e.target.value);
    };

    // const searchBtnOnClick = async (e) => {
    //     e.preventDefault();
    //     setIsBtnLoading(true);
    //     try {

    //         let response = await axios.post(process.env.REACT_APP_PAYMENTS_VIEWS_API_URL,
    //             { month: monthDate }, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (response.data.message) {
    //             showDialogBox({
    //                 showButtons: true,
    //                 dialogTextContent: response.data.message,
    //                 dialogTextButton: "OK",
    //                 showDefaultButton: true
    //             });
    //             setShowPaymentForm(false);
    //         }
    //         else {
    //             setValues(response.data);
    //             setShowPaymentForm(true);
    //         }

    //         setIsBtnLoading(false);
    //     }
    //     catch {
    //         handleErrorMessage();
    //         setIsBtnLoading(false);
    //     }

    // }

    // // When clicking on Create Button
    // const SaveBtnOnClick = async (e) => {
    //     e.preventDefault();
    //     setIsBtnLoading(true);

    //     try {
    //         let response = await axios.post(process.env.REACT_APP_CREATE_PAYMENTS_API_URL,
    //             JSON.stringify(formsTxts), {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         showDialogBox({
    //             showButtons: true,
    //             dialogTextContent: response.data.message,
    //             dialogTextButton: "OK",
    //             showDefaultButton: true
    //         });

    //         setIsBtnLoading(false);
    //         ResetButtonOnClick(e);
    //     }
    //     catch {
    //         handleErrorMessage();
    //     }

    //     setIsBtnLoading(false);

    // }

    const dateFormater = (datePrm) => { // Format the date to store in Databases

        const date = dayjs(datePrm);
        const formattedDate = date.format('DD/MM/YYYY');
        return formattedDate;

    }

    // const Reset = () => {
    //     setSelectedValues([]);
    //     setModeOfPayment("");
    //     setFormsTxts({ ...defaultformsTxts, month: monthDate });

    // }

    // // When clicking on Reset Button
    // const ResetButtonOnClick = (e) => {

    //     e.preventDefault();
    //     setShowPaymentForm(false);
    //     Reset();
    // }

    // // When clicking on ClearHome Button
    // const ClearHomeBtnOnClick = (e) => {

    //     e.preventDefault();
    //     Reset();

    // }

    return (
        <div>
            <section className="vh-200">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="formDiv">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <div className="form-group row">
                                        {
                                            !showPaymentForm ?
                                                <>
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
                                                                                    disabled={showPaymentForm}
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
                                                                </>
                                                                :
                                                                <>
                                                                    {isLoading ? <LoadingSpin /> :
                                                                        <>
                                                                            <br />
                                                                            <div className="col-sm-8">
                                                                                <Box>
                                                                                    <FormControl fullWidth>
                                                                                        <InputLabel id="simple-select-label">Select Student</InputLabel>
                                                                                        <Select
                                                                                            labelId="simple-select-label"
                                                                                            id="simple-select"
                                                                                            value={selectedStudentOption}
                                                                                            label="Payment Mode"
                                                                                            onChange={handleSelectStudentsChange}
                                                                                        >
                                                                                            {selectedValues.map((option) => (
                                                                                                <MenuItem key={option.id} value={option.id}>
                                                                                                    {option.studentDetails}
                                                                                                </MenuItem>
                                                                                            ))}
                                                                                        </Select>
                                                                                    </FormControl>
                                                                                </Box>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </>
                                                        }
                                                        {showSearch && <Button variant="contained" id="searchtHomeBtn" disabled={!showSearch}><SearchIcon />Search</Button>}
                                                    </div>
                                                </>
                                                :
                                                <>
                                                </>
                                        }
                                    </div>
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </section >
        </div >
    )
}

export default PaymentsPage

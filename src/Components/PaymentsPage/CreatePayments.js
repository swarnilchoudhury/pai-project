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

const CreatePayments = () => {

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
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [dates, setDates] = useState({ // Set the dates
        selectedPaymentDate: ""
    });
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    //  Render first time when Create Payments Page mounts
    useEffect(() => {
        document.title = 'Create Payments';
    }, []);


    useEffect(() => {
        if (!editPermissions) {
            navigate('/Home/Active');
        }
    }, [editPermissions, navigate]);


    useEffect(() => {
        setFormsTxts({ ...formsTxts, students: selectedValues }); // eslint-disable-next-line
    }, [selectedValues])

    useEffect(() => {
        setIsSaveEnabled(isFormValid()); // eslint-disable-next-line
    }, [formsTxts]);

    // When changing any dates
    useEffect(() => {
        setFormsTxts(prevFormsTxts => ({
            ...prevFormsTxts,
            paymentDate: dates.selectedPaymentDate ? dateFormater(dates.selectedPaymentDate) : ""
        }));
    }, [dates]);

    useEffect(() => {
        setFormsTxts(prevFormsTxts => ({
            ...prevFormsTxts,
            month: monthDate
        }));

    }, [monthDate]);


    const { handleErrorMessage } = useErrorMessageHandler();

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = dayjs(date).format('MMM_YYYY'); // "MMM_YYYY"
            setMonthDate(formattedDate);
            setFormsTxts(prev => ({ ...prev, month: formattedDate }));
        }
    };

    const handleModeOfPaymentChange = (e) => {
        setModeOfPayment(e.target.value);
        setFormsTxts({ ...formsTxts, modeOfPayment: e.target.value });
    };

    // Max 10 length for input paramater for PhoneNumber
    const handleAmountInputChange = (e) => {
        const { value } = e.target;
        const maxLength = 5;

        if (value.length <= maxLength) {
            setFormsTxts({ ...formsTxts, amount: parseInt(e.target.value) });
        }
    };

    const isFormValid = () => {
        return formsTxts.amount && formsTxts.modeOfPayment && formsTxts.month && formsTxts.students;
    };

    const searchBtnOnClick = async (e) => {
        e.preventDefault();
        setIsBtnLoading(true);
        try {

            let response = await axios.post(process.env.REACT_APP_PAYMENTS_VIEWS_API_URL,
                { month: monthDate }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.message) {
                showDialogBox({
                    showButtons: true,
                    dialogTextContent: response.data.message,
                    dialogTextButton: "OK",
                    showDefaultButton: true
                });
                setShowPaymentForm(false);
            }
            else {
                setValues(response.data);
                setShowPaymentForm(true);
            }

            setIsBtnLoading(false);
        }
        catch {
            handleErrorMessage();
            setIsBtnLoading(false);
        }

    }

    // When clicking on Create Button
    const SaveBtnOnClick = async (e) => {
        e.preventDefault();
        setIsBtnLoading(true);

        try {
            let response = await axios.post(process.env.REACT_APP_CREATE_PAYMENTS_API_URL,
                JSON.stringify(formsTxts), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            showDialogBox({
                showButtons: true,
                dialogTextContent: response.data.message,
                dialogTextButton: "OK",
                showDefaultButton: true
            });

            setIsBtnLoading(false);
            ResetButtonOnClick(e);
        }
        catch {
            handleErrorMessage();
        }

        setIsBtnLoading(false);

    }

    const dateFormater = (datePrm) => { // Format the date to store in Databases

        const date = dayjs(datePrm);
        const formattedDate = date.format('DD/MM/YYYY');
        return formattedDate;

    }

    const Reset = () => {
        setSelectedValues([]);
        setModeOfPayment("");
        setFormsTxts({ ...defaultformsTxts, month: monthDate });

    }

    // When clicking on Reset Button
    const ResetButtonOnClick = (e) => {

        e.preventDefault();
        setShowPaymentForm(false);
        Reset();
    }

    // When clicking on ClearHome Button
    const ClearHomeBtnOnClick = (e) => {

        e.preventDefault();
        Reset();

    }

    return (
        <div>
            <section className="vh-200">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="formDiv">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <div className="form-group row">
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>CREATE PAYMENTS</p>
                                        <hr />
                                        {
                                            !showPaymentForm ?
                                                <>
                                                    <label htmlFor='SelectMonth' className="col-sm-2 col-form-label">Select Month <span className='required'>*</span></label>
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
                                                    </div>
                                                    <br />
                                                    {
                                                        !isBtnLoading ?
                                                            <Button variant="contained" id="searchBtn" disabled={!monthDate} onClick={searchBtnOnClick}><SearchIcon />Search</Button>
                                                            : <Button variant="contained" id="searchBtn" disabled={true} ><SearchIcon />Searching...</Button>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <label htmlFor='SelectMonth' className="col-sm-2 col-form-label">Select Month <span className='required'>*</span></label>
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
                                                    <div className='buttons'>
                                                        <Button variant="contained" type="reset" onClick={ClearHomeBtnOnClick}><MdOutlineReplay /> Clear</Button>
                                                        <Button variant="contained" type="reset" color="error" onClick={ResetButtonOnClick}><CloseIcon /> Reset</Button>
                                                    </div>
                                                    <hr className="custom-line" />
                                                    <br />
                                                    <form className="form" id="create-form" onSubmit={SaveBtnOnClick}>
                                                        <div>
                                                            <div className="row">
                                                                <label htmlFor='SelectStudents' className="col-sm-4 col-form-label">Select Students<span className='required'>*</span></label>
                                                                <MultipleDropdown values={values} selectedValues={selectedValues} setSelectedValues={setSelectedValues} />
                                                            </div>
                                                            <br />
                                                            <div className="form-group row">
                                                                <label htmlFor='Amount' className="col-sm-2 col-form-label">Amount</label>
                                                                <input type="number" className="form-control" id="LevelTxt" value={formsTxts.amount} onChange={handleAmountInputChange} />
                                                            </div>
                                                            <br />
                                                            <div className="col-sm-10">
                                                                <label htmlFor='ModeOfPaymentTxt' className="col-sm-4 col-form-label" style={{ marginBottom: '10px' }}>Mode of Payment<span className='required'>*</span></label>
                                                                <Box>
                                                                    <FormControl fullWidth>
                                                                        <InputLabel id="simple-select-label">Payment Mode</InputLabel>
                                                                        <Select
                                                                            labelId="simple-select-label"
                                                                            id="simple-select"
                                                                            value={modeOfPayment}
                                                                            label="Payment Mode"
                                                                            onChange={handleModeOfPaymentChange}
                                                                        >
                                                                            <MenuItem value={'Bank'}><AccountBalanceIcon /> Bank</MenuItem>
                                                                            <MenuItem value={'Cash'}><PaymentsIcon /> Cash</MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Box>
                                                            </div>
                                                            <br />
                                                            <div className="col-sm-10">
                                                                <label htmlFor='PaymentDate' className="col-sm-4 col-form-label">Payment Date</label>
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DemoContainer components={['DatePicker']}>
                                                                        <DesktopDatePicker label="Payment Date"
                                                                            onChange={(e) => setDates({ ...dates, selectedPaymentDate: e })}
                                                                            format="DD/MM/YYYY"
                                                                            slotProps={{
                                                                                textField: {
                                                                                    helperText: 'DD/MM/YYYY',
                                                                                },
                                                                                field: { clearable: true }
                                                                            }} />
                                                                    </DemoContainer>
                                                                </LocalizationProvider>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <hr className="custom-line" />
                                                    {
                                                        !isBtnLoading ?
                                                            <Button variant="contained" id="createtHomeBtn" form="create-form" disabled={!isSaveEnabled} type="submit">SAVE</Button>
                                                            : <Button variant="contained" id="createtHomeBtn" disabled={true} form="create-form">SAVING...</Button>
                                                    }
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

export default CreatePayments

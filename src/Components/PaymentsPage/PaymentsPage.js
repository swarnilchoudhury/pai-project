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
import EditForm from '../HomePage/EditForm';
import useDialogBoxHandler from '../../CustomHooks/DialogBoxHandler';

const PaymentsPage = () => {

    const { editPermissions } = usePermissions();
    const navigate = useNavigate();
    const [selectedValues, setSelectedValues] = useState([]);
    const [monthDate, setMonthDate] = useState('');
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [selectMonthOption, setSelectMonthOption] = useState(true);
    const [count, setCount] = useState(0);
    const [showSearch, setShowSearch] = useState(false);
    const [showCreatePayment, setShowCreatePayment] = useState(false);
    const [showTotalPaymentsPage, setShowTotalPaymentsPage] = useState(false);
    const [selectedOption, setSelectedOption] = useState('ByMonth');
    const [selectedIsGivenOption, setSelectedIsGivenOption] = useState(1);
    const [boolSelectedIsGivenOption, setBoolSelectedIsGivenOption] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStudentOption, setSelectedStudentOption] = useState('');
    const [selectedOptionType, setSelectedOptionType] = useState();
    const [showTableDetails, setShowTableDetails] = useState({
        showTable: false,
        header: [],
        data: null
    });


    useEffect(() => {
        if (!showTotalPaymentsPage) {
            if (showCreatePayment) {
                document.title = 'Create Payments'
            }
            else {
                document.title = 'Show Payments'
            }
        }
        else {
            document.title = 'Total Payments'
        }

    }, [showTotalPaymentsPage, showCreatePayment]);

    useEffect(() => {
        if (!editPermissions) {
            navigate('/Home');
        }
    }, [editPermissions, navigate]);

    const [formsTxt, setFormsTxt] = useState({
        showForm: false,
        isDisabled: false
    });


    const { showDialogBox } = useDialogBoxHandler();
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

                setBoolSelectedIsGivenOption(true);

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
                    setBoolSelectedIsGivenOption(true);
                }
                else {
                    monthPageHeader = [
                        { accessorKey: 'studentName', header: 'Student Name' },
                        { accessorKey: 'studentCode', header: 'Student Code' }
                    ];

                    setBoolSelectedIsGivenOption(false);

                }

                setShowTableDetails({
                    showTable: true,
                    data: response.data,
                    header: monthPageHeader
                });
            }

        }
        catch {
            handleErrorMessage();
        }
        setIsBtnLoading(false);

    }

    const ActionButton = async (e, row, closeMenu, action) => {

        closeMenu();
        setCount(count => count + 1);

        setFormsTxt({
            showForm: false
        });

        if (action === 'Edit') {

            let formConfig = {
                fields: [
                    {
                        name: 'modeOfPayment',
                        label: 'Mode Of Payment',
                        type: 'Dropdown',
                        data: [{ value: 'Bank', name: 'Bank' }, { value: 'Cash', name: 'Cash' }]
                    },
                    {
                        name: 'amount',
                        label: 'Amount',
                        isDisabled: true
                    },
                    {
                        name: 'paymentDate',
                        label: 'Payment Date',
                        type: 'Date'
                    }
                ]
            };

            setFormsTxt({
                showForm: true,
                isDisabled: false,
                btnName: "Update",
                title: "Update",
                formConfig,
                id: row.original.id,
                modeOfPayment: row.original.modeOfPayment,
                amount: row.original.amount.toString(),
                month: row.original.month,
                paymentDate: dayjs(row.original.paymentDate, "DD/MM/YYYY").format("YYYY-MM-DD")
            });
        }

        else if (action === 'Delete') {

            const clickFunctionsOnConfirm = async (e) => {
                try {
                    showDialogBox({ dialogTextTitle: 'Message', dialogTextContent: 'Processing...', showButtons: false });

                    const isGivenDropdown = document.getElementById('isGiven-select');
                    let month = '', studentName = '', studentCode = '', studentDetail = '';

                    if (isGivenDropdown) {
                        month = monthDate;
                        studentName = row.original.studentName;
                        studentCode = row.original.studentCode;
                    }
                    else {
                        month = row.original.month;
                        studentDetail = selectedValues.find((option) => option.id === selectedStudentOption).studentDetails || null;
                    }

                    let data = {
                        id: row.original.id,
                        month,
                        amount: row.original.amount,
                        modeOfPayment: row.original.modeOfPayment,
                        studentName,
                        studentCode,
                        studentDetail
                    }

                    let response = await axios.post(process.env.REACT_APP_DELETE_STUDENTS_PAYMENTS_API_URL, data, {
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (response.status === 200) {
                        refreshBtnOnClick();

                        let dialogMessage = 'Sucessfully deleted for ' + (studentDetail || `${row.original.studentName} - ${row.original.studentCode}`);

                        showDialogBox({
                            showButtons: true,
                            dialogTextContent: dialogMessage,
                            dialogTextButton: "OK",
                            showDefaultButton: true
                        });
                    }
                }
                catch {
                    handleErrorMessage();
                }
            }

            const dialogContent = {
                showButtons: true,
                dialogTextTitle: "",
                dialogTextContent: "",
                clickFunctionsOnConfirmFunction: clickFunctionsOnConfirm,
                showCancelBtn: true,
            };

            dialogContent.dialogTextTitle = "Delete";
            dialogContent.dialogTextContent = "Delete " + (selectedValues.find((option) => option.id === selectedStudentOption)?.studentDetails || row.original.studentCode + " - " + row.original.studentName) +  "?";
            dialogContent.dialogTextButtonOnConfirm = "Delete";
            showDialogBox(dialogContent);
        }


    };

    //  When changing the form from create to home or vice-versa
    const ToggleForm = (e) => {
        e.preventDefault();
        setShowTotalPaymentsPage(false);
        setShowCreatePayment(state => !state);
    };

    const ShowTotalPayments = () => {
        setShowTotalPaymentsPage(true);

    };

    const refreshBtnOnClick = () => {
        const refreshButton = document.getElementById('searchBtn');
        refreshButton.click();
    }

    const handleSubmit = async (updatedValues) => {

        showDialogBox({ dialogTextTitle: 'Message', dialogTextContent: 'Processing...', showButtons: false });

        const changedFields = {};
        for (const key in formsTxt) {
            if (formsTxt[key] !== updatedValues[key]) {
                if (key === 'paymentDate') {
                    changedFields[key] = dayjs(updatedValues[key], "YYYY-MM-DD").format("DD/MM/YYYY");
                }
                else {
                    changedFields[key] = updatedValues[key];
                }
            }
        }

        const isGivenDropdown = document.getElementById('isGiven-select');

        let month = "";
        let updateForm;

        if (isGivenDropdown) {
            month = monthDate;
        }
        else {
            month = formsTxt.month;
        }

        updateForm = { id: updatedValues.id, month, ...changedFields };

        let response = await axios.put(process.env.REACT_APP_UPDATE_STUDENTS_PAYMENTS_API_URL,
            { updateForm }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.message) {
            refreshBtnOnClick();

            showDialogBox({
                showButtons: true,
                dialogTextContent: response.data.message,
                dialogTextButton: "OK",
                showDefaultButton: true
            });
        }
    }

    return (
        <div>
            <br />
            <Button variant="contained" className="HomePageButttons" onClick={ToggleForm}>{showCreatePayment ? <><ArrowBackIcon />&nbsp;BACK</> : <><AddIcon />&nbsp;PAYMENTS</>}</Button>
            {formsTxt.showForm && <EditForm key={count}
                onSubmit={handleSubmit}
                formConfig={formsTxt.formConfig}
                initialValues={formsTxt}
                isDisabled={formsTxt.isDisabled} />}
            {!showTotalPaymentsPage && <Button variant="contained" className="HomePageButttons" onClick={ShowTotalPayments} style={{ float: 'right', marginRight: '1rem' }}><SearchIcon />&nbsp;TOTAL</Button>}
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
                                                                                        id="isGiven-select"
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
                                                                <Button variant="contained" id="searchBtn" disabled={!showSearch} onClick={searchBtnOnClick}><SearchIcon />Search</Button>
                                                                :
                                                                <Button variant="contained" id="searchBtn" disabled={true}><SearchIcon />Searching...</Button>
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
                            isLoadingState={isBtnLoading}
                            isEnableRowActions={boolSelectedIsGivenOption}
                            ActionButton={ActionButton} />}
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

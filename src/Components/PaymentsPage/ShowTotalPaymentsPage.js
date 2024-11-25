import React, { useCallback, useEffect, useState } from 'react'
import axios from '../AxiosInterceptor/AxiosInterceptor';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import '../../ComponetsStyles/CreateForm.css';
import MiscTable from '../Table/MinimalTable';
import Spinner from '../Spinner/Spinner';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

const ShowTotalPaymentsPage = () => {

    const [isBtnLoading, setIsBtnLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [showTableDetails, setShowTableDetails] = useState({
        header: [],
        data: null
    });

    const { handleErrorMessage } = useErrorMessageHandler();
    
    const fetchData = useCallback(async () => { 
        setIsLoading(true);
        try {
            let response = await axios.get(process.env.REACT_APP_TOTAL_PAYMENTS_API_URL, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const showTotalPaymentsHeader = [
                { accessorKey: 'month', header: 'Month' },
                { accessorKey: 'bank', header: 'Bank' },
                { accessorKey: 'cash', header: 'Cash' },
                { accessorKey: 'others', header: 'Others' },
                { accessorKey: 'totalAmount', header: 'Total Amount' },
            ];

            setShowTableDetails({
                header: showTotalPaymentsHeader,
                data: response.data,
            });
        } catch (error) {
            handleErrorMessage(); 
        } finally {
            setIsLoading(false);
            setIsBtnLoading(false);
        }
    }, []);

    //  Render first time when Create Payments Page mounts
    useEffect(() => {
        document.title = 'Show Total Payments';
        fetchData();
    }, [fetchData]);

    //  When RefreshTable button is clicked
    const RefreshBtnOnClick = async () => {
        fetchData();
    };

    return (
        <>
            {isBtnLoading ? <Spinner Text="Please Wait..." /> : <><Button variant="contained" id="RefreshBtn" onClick={RefreshBtnOnClick}><RefreshIcon />REFRESH</Button>
                <br />
                <br />
                <MiscTable
                    columnsProps={showTableDetails.header}
                    dataProps={showTableDetails.data}
                    isLoadingState={isLoading} /> </>}
        </>
    );
};

export default ShowTotalPaymentsPage;

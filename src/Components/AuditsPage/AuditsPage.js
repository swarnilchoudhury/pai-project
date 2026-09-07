import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import MiscTable from '../Table/MinimalTable';
import useDialogBoxHandler from '../../CustomHooks/DialogBoxHandler';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';

const AuditsPage = () => {
    const [audits, setAudits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showDialogBox } = useDialogBoxHandler();
    const { handleErrorMessage } = useErrorMessageHandler();

    const auditHeaders = [
        { accessorKey: 'title', header: 'Title', size: 620 },
        { accessorKey: 'user', header: 'User', size: 120 },
        { accessorKey: 'dateTime', header: 'Date Time', size: 180 }
    ];

    const auditsApiUrl = process.env.REACT_APP_AUDITS_API_URL || '/api/audits';
    const clearAuditsApiUrl = process.env.REACT_APP_CLEAR_AUDITS_API_URL || '/api/audits/clear';

    const fetchAudits = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(auditsApiUrl);
            setAudits(Array.isArray(response.data) ? response.data : []);
        } catch {
            handleErrorMessage();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Audits';
        fetchAudits();
    }, []); // eslint-disable-line

    const clearHistory = async () => {
        try {
            const response = await axios.post(clearAuditsApiUrl);
            if (response.status === 200) {
                showDialogBox({
                    showButtons: true,
                    dialogTextTitle: 'Message',
                    dialogTextContent: response.data.message || 'Clear Started',
                    dialogTextButton: 'OK',
                    showDefaultButton: true
                });
                fetchAudits();
            }
        } catch {
            handleErrorMessage();
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 6 } }}>
            <Box sx={{ width: { xs: '100%', md: '75%' }, mx: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Button variant="contained" startIcon={<RefreshIcon />} onClick={fetchAudits}>
                        Refresh
                    </Button>
                    <Button variant="contained" color="error" startIcon={<CleaningServicesIcon />} onClick={clearHistory}>
                        Clear History
                    </Button>
                </Box>
                <MiscTable
                    columnsProps={auditHeaders}
                    dataProps={audits}
                    isLoadingState={isLoading}
                    isEnableTopToolbar={true}
                    pageSize={10}
                    enableWordWrap={true}
                />
            </Box>
        </Box>
    );
};

export default AuditsPage;

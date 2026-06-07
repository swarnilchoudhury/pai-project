import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePermissions } from '../../Context/PermissionContext';
import {
    Container,
    Button,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable, MRT_ActionMenuItem as ActionMenuItem } from 'material-react-table';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import useDialogBoxHandler from '../../CustomHooks/DialogBoxHandler';
import CreateBatch from './CreateBatch';
import BatchDetailView from './BatchDetailView';
import CreateTeacher from './CreateTeacher';
import AddStudentsToBatch from './AddStudentsToBatch';
import TeachersDialog from './TeachersDialog';
import TransitionsModal from '../Modal/TransitionsModal';
import '../../ComponetsStyles/BatchesPage.css';

const BatchesPage = () => {
    const navigate = useNavigate();
    const { editPermissions } = usePermissions();
    const { batchSlug } = useParams();

    const [view, setView] = useState(null);
    const [batches, setBatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateBatchDialog, setShowCreateBatchDialog] = useState(false);
    const [showCreateTeacherDialog, setShowCreateTeacherDialog] = useState(false);
    const [showTeachersDialog, setShowTeachersDialog] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
    const [editTeacher, setEditTeacher] = useState(null);
    const [editTeacherName, setEditTeacherName] = useState('');
    const [historyTableDetails, setHistoryTableDetails] = useState({
        showTable: false,
        header: [],
        data: [],
        isLoadingState: false,
        isEnableTopToolbar: false,
        pageSize: 5
    });
    const [historyModalCount, setHistoryModalCount] = useState(0);

    const { handleErrorMessage } = useErrorMessageHandler();
    const { showDialogBox } = useDialogBoxHandler();

    const getActionFromPath = () => {
        const path = window.location.pathname;
        if (path.includes('/view')) return 'view';
        if (path.includes('/add')) return 'add';
        return null;
    };

    const createSlug = (batchName) =>
        batchName.toLowerCase().replace(/\s+/g, '').replace(/[^\w-]/g, '');

    const findBatchIdBySlug = (slug) => {
        const batch = batches.find((b) => createSlug(b.batchName) === slug);
        return batch?.id || null;
    };

    // Permissions redirect
    useEffect(() => {
        if (editPermissions === false) {
            navigate('/Home/Active');
        }
    }, [editPermissions, navigate]);

    // Page title
    useEffect(() => {
        const path = window.location.pathname.toLowerCase();
        if (path.endsWith('/view')) document.title = 'View Batch';
        else if (path.endsWith('/add')) document.title = 'Add Students Batch';
        else document.title = 'Batches Dashboard';
    }, [view, batchSlug]);

    useEffect(() => {
        if (editPermissions === true) {
            fetchBatches();
        }
    }, [editPermissions, refreshCount]);

    const fetchBatches = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(process.env.REACT_APP_BATCHES_ALL_API_URL);
            setBatches(Array.isArray(res.data) ? res.data : []);
        } catch {
            handleErrorMessage();
        } finally {
            setIsLoading(false);
        }
    };

    // Routing based on slug
    useEffect(() => {
        if (!batchSlug) {
            setView('table');
            return;
        }

        if (batches.length === 0) return;

        const id = findBatchIdBySlug(batchSlug);
        const action = getActionFromPath();

        if (id) {
            setSelectedBatchId(id);
            setView(action === 'view' ? 'detail' : 'add-students');
        } else {
            navigate('/Batches/dashboard');
        }
    }, [batchSlug, batches, navigate]);

    const handleRefresh = () => setRefreshCount((p) => p + 1);

    const fetchTeachers = async () => {
        try {
            setIsLoadingTeachers(true);
            const res = await axios.get(process.env.REACT_APP_BATCH_TEACHERS_ALL_API_URL);
            setTeachers(Array.isArray(res.data) ? res.data : []);
        } catch {
            handleErrorMessage();
            setTeachers([]);
        } finally {
            setIsLoadingTeachers(false);
        }
    };

    const fetchTeacherAuditHistory = async (teacherId) => {
        try {
            const auditPageHeader = [
                { accessorKey: 'systemComments', header: 'Comments' },
                { accessorKey: 'user', header: 'User' },
                { accessorKey: 'updatedDateTime', header: 'Updated Date Time' }
            ];

            setHistoryTableDetails({
                showTable: true,
                header: auditPageHeader,
                data: [],
                isLoadingState: true,
                isEnableTopToolbar: false,
                pageSize: 5
            });
            setHistoryModalCount((prev) => prev + 1);

            const response = await axios.post(process.env.REACT_APP_TEACHER_AUDIT_API_URL, { teacherId });
            setHistoryTableDetails({
                showTable: true,
                header: auditPageHeader,
                data: Array.isArray(response.data) ? response.data : [],
                isLoadingState: false,
                isEnableTopToolbar: false,
                pageSize: 5
            });
        } catch {
            handleErrorMessage();
        }
    };

    const handleShowTeachers = async () => {
        await fetchTeachers();
        setShowTeachersDialog(true);
    };

    const handleDeleteTeacher = async (teacher) => {
        const deleteFunction = async () => {
            try {
                showDialogBox({
                    dialogTextTitle: 'Processing',
                    dialogTextContent: 'Deleting teacher...',
                    showButtons: false
                });

                await axios.post(
                    process.env.REACT_APP_TEACHER_DELETE_API_URL,
                    { teacherId: teacher.id }
                );

                setShowTeachersDialog(false);
                await fetchTeachers();

                showDialogBox({
                    showButtons: true,
                    dialogTextTitle: 'Success',
                    dialogTextContent: 'Teacher deleted successfully',
                    showCancelBtn: false,
                    showDefaultButton: true,
                    dialogTextButton: 'OK'
                });
            } catch {
                handleErrorMessage();
            }
        };

        showDialogBox({
            showButtons: true,
            dialogTextTitle: 'Delete Teacher',
            dialogTextContent: `Delete ${teacher.teacherName}?`,
            dialogTextButtonOnConfirm: 'Delete',
            clickFunctionsOnConfirmFunction: deleteFunction,
            showCancelBtn: true
        });
    };

    const handleUpdateTeacher = (teacher) => {
        setEditTeacher(teacher);
        setEditTeacherName(teacher.teacherName || '');
    };

    const handleTeacherFormSubmit = async () => {
        if (!editTeacherName.trim()) {
            showDialogBox({
                showButtons: true,
                dialogTextTitle: 'Error',
                dialogTextContent: 'Teacher name cannot be empty',
                showCancelBtn: false,
                showDefaultButton: true,
                dialogTextButton: 'OK'
            });
            return;
        }

        try {
            showDialogBox({
                dialogTextTitle: 'Processing',
                dialogTextContent: 'Updating teacher...',
                showButtons: false
            });

            await axios.put(
                `${process.env.REACT_APP_TEACHER_UPDATE_API_URL}/${editTeacher.id}`,
                { teacherName: editTeacherName }
            );

            setEditTeacher(null);
            setEditTeacherName('');
            await fetchTeachers();

            showDialogBox({
                showButtons: true,
                dialogTextTitle: 'Success',
                dialogTextContent: 'Teacher updated successfully',
                showCancelBtn: false,
                showDefaultButton: true,
                dialogTextButton: 'OK'
            });
        } catch {
            handleErrorMessage();
            setEditTeacher(null);
            setEditTeacherName('');
        }
    };

    const handleTeacherAudit = (teacher) => {
        fetchTeacherAuditHistory(teacher.id);
    };

    const handleViewDetails = (id, name) => {
        setSelectedBatchId(id);
        setView('detail');
        navigate(`/Batches/${createSlug(name)}/view`);
    };

    const handleAddStudents = (id, name) => {
        setSelectedBatchId(id);
        setView('add-students');
        navigate(`/Batches/${createSlug(name)}/add`);
    };

    const batchesColumns = useMemo(
        () => [
            {
                accessorKey: 'batchName',
                header: 'Batch Name',
            },
            {
                accessorKey: 'studentCount',
                header: 'Students',
                Cell: ({ row }) => `${row.original.studentIds?.length || 0}/24`,
            },
            {
                accessorKey: 'teacherNames',
                header: 'Teachers',
                Cell: ({ row }) => Array.isArray(row.original.teacherNames)
                    ? row.original.teacherNames.join(', ')
                    : row.original.teacherName || '-',
            },
        ],
        []
    );

    const batchesTable = useMaterialReactTable({
        columns: batchesColumns,
        data: batches,
        enableRowActions: true,
        enableRowSelection: false,
        enableStickyHeader: true,
        muiTableHeadCellProps: { sx: { border: '1px solid rgba(81, 81, 81, .5)', backgroundColor: 'lightgrey', fontWeight: 'bold' } },
        muiTableBodyCellProps: { sx: { border: '1px solid rgba(81, 81, 81, .5)', backgroundColor: '#ffffff' } },
        renderRowActionMenuItems: ({ row, table, closeMenu }) => [
            <ActionMenuItem
                icon={<VisibilityIcon />}
                key="view"
                label="View"
                table={table}
                onClick={() => {
                    closeMenu();
                    handleViewDetails(row.original.id, row.original.batchName);
                }}
            />,
            <ActionMenuItem
                icon={<AddIcon />}
                key="add"
                label="Add Students"
                table={table}
                onClick={() => {
                    closeMenu();
                    handleAddStudents(row.original.id, row.original.batchName);
                }}
            />,
        ],
        state: { isLoading },
        muiSkeletonProps: { animation: 'pulse', height: 28 },
    });

    const renderTableView = () => (
        <Box sx={{ p: { xs: 2, sm: 6 } }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateBatchDialog(true)}>
                    Create New Batch
                </Button>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateTeacherDialog(true)}>
                        Add New Teacher
                    </Button>
                    <Button variant="contained" onClick={handleShowTeachers}>
                        Show Teachers
                    </Button>
                    <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleRefresh}>
                        Refresh
                    </Button>
                </Box>
            </Box>

            <MaterialReactTable table={batchesTable} />
        </Box>
    );

    const renderDetailView = () => (
        <BatchDetailView
            batchId={selectedBatchId}
            onBack={() => {
                setView('table');
                navigate('/Batches/dashboard');
            }}
            onAddStudents={() => {
                const b = batches.find(x => x.id === selectedBatchId);
                if (b) navigate(`/Batches/${createSlug(b.batchName)}/add`);
            }}
        />
    );

    const renderAddStudentsView = () => {
        const b = batches.find(x => x.id === selectedBatchId);
        return (
            <Box sx={{ p: 6 }}>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    sx={{ width: { sm: 'auto' }, mb: 2 }}
                    onClick={() => navigate('/Batches/dashboard')}
                >
                    BACK
                </Button>
                <AddStudentsToBatch
                    batchId={selectedBatchId}
                    batchName={b?.batchName || ''}
                    currentStudentCount={b?.studentIds?.length || 0}
                    onStudentsAdded={() => {
                        setRefreshCount((p) => p + 1);
                        navigate('/Batches/dashboard');
                    }}
                />
            </Box>
        );
    };

    return (
        <Container maxWidth="lg">
            {view === null && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            )}
            {view === 'table' && renderTableView()}
            {view === 'detail' && renderDetailView()}
            {view === 'add-students' && renderAddStudentsView()}

            <Dialog open={showCreateBatchDialog}>
                <CreateBatch onClose={() => setShowCreateBatchDialog(false)} onCreated={handleRefresh} allBatches={batches} />
            </Dialog>

            <Dialog
                open={showCreateTeacherDialog}
                fullWidth
                maxWidth="sm"
            >
                <CreateTeacher onClose={() => setShowCreateTeacherDialog(false)} />
            </Dialog>

            {showTeachersDialog && (
                <TeachersDialog
                    open={showTeachersDialog}
                    onClose={() => setShowTeachersDialog(false)}
                    teachers={teachers}
                    isLoading={isLoadingTeachers}
                    onEdit={handleUpdateTeacher}
                    onDelete={handleDeleteTeacher}
                    onAudit={handleTeacherAudit}
                />
            )}

            {editTeacher && (
                <Dialog open={!!editTeacher} onClose={() => { setEditTeacher(null); setEditTeacherName(''); }}
                    fullWidth maxWidth="sm">
                    <DialogTitle sx={{ wordBreak: 'break-word', whiteSpace: 'normal', overflow: 'visible', py: 2 }}>Edit Teacher {editTeacher.teacherName}</DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        <TextField
                            autoFocus
                            fullWidth
                            value={editTeacherName}
                            onChange={(e) => setEditTeacherName(e.target.value)}
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setEditTeacher(null); setEditTeacherName(''); }}>Cancel</Button>
                        <Button onClick={handleTeacherFormSubmit} variant="contained">Update</Button>
                    </DialogActions>
                </Dialog>
            )}

            {historyTableDetails.showTable && (
                <TransitionsModal
                    key={historyModalCount}
                    heading="Teacher Audit History"
                    columnsProps={historyTableDetails.header}
                    dataProps={historyTableDetails.data}
                    isLoadingState={historyTableDetails.isLoadingState}
                    isEnableTopToolbar={historyTableDetails.isEnableTopToolbar}
                    pageSize={historyTableDetails.pageSize}
                />
            )}
        </Container>
    );
};

export default BatchesPage;
import React, { useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Button,
    CircularProgress
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable, MRT_ActionMenuItem as ActionMenuItem } from 'material-react-table';
import { Edit, Delete } from '@mui/icons-material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';

const TeachersDialog = ({ open, onClose, teachers, isLoading, onEdit, onDelete, onAudit }) => {
    const teacherColumns = useMemo(
        () => [
            {
                accessorKey: 'teacherName',
                header: 'Teacher Name',
            },
            {
                accessorKey: 'createdBy',
                header: 'Created By',
            },
            {
                accessorKey: 'modifiedBy',
                header: 'Modified By',
                Cell: ({ row }) => row.original.modifiedBy || '-',
            },
        ],
        []
    );

    const teacherTable = useMaterialReactTable({
        columns: teacherColumns,
        data: teachers || [],
        enableRowActions: true,
        enableRowSelection: false,
        enableStickyHeader: true,
        muiTableHeadCellProps: { sx: { border: '1px solid rgba(81, 81, 81, .5)', backgroundColor: 'lightgrey', fontWeight: 'bold' } },
        muiTableBodyCellProps: { sx: { border: '1px solid rgba(81, 81, 81, .5)', backgroundColor: '#ffffff' } },
        renderRowActionMenuItems: ({ row, table, closeMenu }) => [
            <ActionMenuItem
                icon={<Edit />}
                key="edit"
                label="Edit"
                table={table}
                onClick={() => {
                    closeMenu();
                    onEdit(row.original);
                }}
            />,
            <ActionMenuItem
                icon={<Delete />}
                key="delete"
                label="Delete"
                table={table}
                onClick={() => {
                    closeMenu();
                    onDelete(row.original);
                }}
            />,
            <ActionMenuItem
                icon={<ErrorOutlineIcon />}
                key="audit"
                label="Audit"
                table={table}
                onClick={() => {
                    closeMenu();
                    onAudit(row.original);
                }}
            />,
        ],
        state: { isLoading },
        muiSkeletonProps: { animation: 'pulse', height: 28 },
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Teachers</DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <MaterialReactTable table={teacherTable} />
                )}
            </DialogContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                    variant="contained"
                    endIcon={<CloseIcon />}
                    onClick={onClose}
                >
                    Close
                </Button>
            </Box>
        </Dialog>
    );
};

export default TeachersDialog;

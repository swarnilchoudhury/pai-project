import React, { useState, useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_ActionMenuItem
} from 'material-react-table';
import PropTypes from 'prop-types';
import { Edit, Delete } from '@mui/icons-material';

const MiscTable = ({ columnsProps,
    dataProps,
    isLoadingState,
    isEnableTopToolbar = true,
    pageSize = 10,
    isEnableRowActions = false,
    ActionButton
}) => {

    // Props validations
    MiscTable.propTypes = {
        columnsProps: PropTypes.arrayOf(
            PropTypes.shape({
                accessorKey: PropTypes.string.isRequired,
                header: PropTypes.string.isRequired,
            })
        ),
        dataProps: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
        ]),
        isLoadingState: PropTypes.bool,
        isEnableTopToolbar: PropTypes.bool,
        pageSize: PropTypes.number,
        isEnableRowActions: PropTypes.bool,
        ActionButton: PropTypes.func
    };

    const data = dataProps; // For Data
    const columns = useMemo(
        // column definitions...
        () => [
            ...columnsProps
        ],
        [columnsProps]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: pageSize,
    });

    // Construct the table
    const table = useMaterialReactTable({
        columns,
        data,
        enableRowActions: isEnableRowActions,
        enableRowSelection: false,
        enableStickyHeader: true,
        enableTopToolbar: isEnableTopToolbar,
        onPaginationChange: setPagination,
        state: {
            isLoading: isLoadingState,
            pagination,
        },
        muiSkeletonProps: {
            animation: 'pulse',
            height: 28,
        },
        muiTableHeadCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                padding: '0.8rem',
                backgroundColor: 'lightgrey'
            },
        },
        muiTableProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
                caption: {
                    captionSide: 'top',
                },
            },
        },
        muiTableBodyCellProps: {
            sx: {
                border: '1px solid rgba(81, 81, 81, .5)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                padding: '0.8rem',
            },
        },
        renderRowActionMenuItems: ({ row, table, closeMenu }) => ([
            <MRT_ActionMenuItem //  eslint-disable-line
                icon={<Edit />}
                key="edit"
                label="Edit"
                onClick={(e) => ActionButton(e, row, closeMenu, 'Edit')}
                table={table}
            />,
            <MRT_ActionMenuItem //  eslint-disable-line
                icon={<Delete />}
                key="delete"
                label="Delete"
                onClick={(e) => ActionButton(e, row, closeMenu, 'Delete')}
                table={table}
            />
        ])
    }
    );

    return (
        <MaterialReactTable table={table} />
    );
};

export default MiscTable;

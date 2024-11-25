import React, { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import PropTypes from 'prop-types';

const MiscTable = ({ columnsProps,
    dataProps,
    isLoadingState
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
        isLoadingState: PropTypes.bool
    };

    const data = dataProps; // For Data
    const columns = useMemo(
        // column definitions...
        () => [
            ...columnsProps
        ],
        [columnsProps]);

    // Construct the table
    const table = useMaterialReactTable({
        columns,
        data,
        enableRowActions: false,
        enableRowSelection: false,
        enableStickyHeader: true,
        state: { isLoading: isLoadingState }, // pass our managed row selection state to the table to use
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
        }
    });

    return (
        <MaterialReactTable table={table} />
    );
};

export default MiscTable;

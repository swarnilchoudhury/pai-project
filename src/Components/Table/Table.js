import React, { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ActionMenuItem
} from 'material-react-table';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';
import { Edit, Delete } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { usePermissions } from '../../Context/PermissionContext';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Table = ({ columnsProps,
  dataProps,
  isLoadingState,
  isShowRowSelectionBtns,
  showRowSelectionBtns,
  rowSelection,
  setRowSelection,
  clickFunctions }) => {

  //Props validations
  Table.propTypes = {
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
    isShowRowSelectionBtns: PropTypes.bool,
    showRowSelectionBtns: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]),
    rowSelection: PropTypes.object,
    setRowSelection: PropTypes.func,
    clickFunctions: PropTypes.func,
  };

  const data = dataProps; //For Data
  const columns = useMemo(
    //column definitions...
    () => [
      ...columnsProps
    ],
    [columnsProps]);

  const { editPermissions } = usePermissions();

  const downloadRows = (rows = []) => {
    let activeToggleBtn = document.getElementById('ActiveToggleBtn');
    let statusName = "";

    if (activeToggleBtn) {
      statusName = activeToggleBtn.checked ? "Active" : "Deactive";
    } else {
      statusName = "Approve";
    }

    let csvConfig = mkConfig({
      fieldSeparator: ',',
      decimalSeparator: '.',
      useKeysAsHeaders: true,
      headers: columnsProps.map(col => col.header), // Extract headers from columnsProps
      filename: 'PAIStudents_' + statusName + "_" + dayjs().format('DDMMYY')
    });

    const rowData = rows.length > 0
      ? rows.map(row => {
        const selectedRow = {};
        columnsProps.forEach(col => {
          selectedRow[col.header] = row.original[col.accessorKey]; // Access data via original for selected rows
        });
        return selectedRow;
      })
      : data.map(item => {
        const fullRow = {};
        columnsProps.forEach(col => {
          fullRow[col.header] = item[col.accessorKey]; // Use full data if no rows are selected
        });
        return fullRow;
      });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  //Export particular rows that are selected
  const handleExportRows = (rows) => {
    downloadRows(rows);
  };

  //Export all rows that are selected
  const handleExportData = () => {
    downloadRows();
  };

  //Construct the table
  const table = useMaterialReactTable({
    columns,
    data,
    enableRowActions: false,
    enableRowSelection: editPermissions,
    enableStickyHeader: true,
    getRowId: (row) => `${row.id}/${row.studentCode}`, //give each row a more useful id
    onRowSelectionChange: setRowSelection, //connect internal row selection state to your own
    state: { rowSelection, isLoading: isLoadingState }, //pass our managed row selection state to the table to use
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
    renderTopToolbarCustomActions: () => (
      <div>
        {isShowRowSelectionBtns && showRowSelectionBtns.DeactiveButton && <Button variant="contained" color='error' id="deactiveBtn" onClick={clickFunctions}><CloseIcon />DEACTIVE</Button>}
        {isShowRowSelectionBtns && showRowSelectionBtns.ActiveButton && <Button variant="contained" color='success' id="activeBtn" onClick={clickFunctions}><Done />ACTIVE</Button>}
        {isShowRowSelectionBtns && showRowSelectionBtns.ApproveButton && <Button variant="contained" color='success' id="approveBtn" onClick={clickFunctions}><Done />APPROVE</Button>}
      </div>
    ),
    renderRowActionMenuItems: ({ row, table }) => ([
      <MRT_ActionMenuItem // eslint-disable-line
        icon={<Edit />}
        key="edit"
        label="Edit"
        onClick={() => console.info('Edit')}
        table={table}
      />,
      <MRT_ActionMenuItem // eslint-disable-line
        icon={<Delete />}
        key="delete"
        label="Delete"
        onClick={() => console.info('Delete')}
        table={table}
      />
    ])
  });

  return (
    <div>
      <MaterialReactTable table={table} />
      <div style={{ backgroundColor: 'White' }}>
        <Button style={{ marginLeft: "1.5rem" }}
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          disabled={
            !data.length > 0
          }
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Download
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Download Rows
        </Button>
      </div>
    </div>
  );
};

export default Table;

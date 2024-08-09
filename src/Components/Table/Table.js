import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React from 'react';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';

const Table = ({ columnsProps, dataProps, isLoadingState, isShowRowSelectionBtns,showRowSelectionBtns, rowSelection, setRowSelection, clickFunctions }) => {

  const data = dataProps;
  const columns = useMemo(
    //column definitions...
    () => [
      ...columnsProps
    ],
    [],
  );
  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.studentCode, //give each row a more useful id
    onRowSelectionChange: setRowSelection, //connect internal row selection state to your own
    state: { rowSelection, isLoading: isLoadingState }, //pass our managed row selection state to the table to use
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    muiTableProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
        caption: {
          captionSide: 'top',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
      },
    },
    renderTopToolbarCustomActions: () => (
      <div>
        {isShowRowSelectionBtns && showRowSelectionBtns.DeactiveButton && <Button variant="contained" color='error' id="deactiveBtn" onClick={clickFunctions}><CloseIcon />DEACTIVE</Button>}
        {isShowRowSelectionBtns && showRowSelectionBtns.ActiveButton && <Button variant="contained" color='success' id="activeBtn" onClick={clickFunctions}><Done />ACTIVE</Button>}
        {isShowRowSelectionBtns && showRowSelectionBtns.ApproveButton && <Button variant="contained" color='success' id="approveBtn" onClick={clickFunctions}><Done />APPROVE</Button>}
      </div>
    )
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default Table;

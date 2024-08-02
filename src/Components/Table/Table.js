import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React from 'react';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const Table = ({ columnsProps, dataProps, isLoadingState, defaultCheckedProp, homePageData }) => {

  const data = dataProps;
  const columns = useMemo(
    //column definitions...
    () => [
      ...columnsProps
    ],
    [],
  );

  const statusToggleOnClick = (e) =>{
    if(e.target.checked){
      homePageData('Active');
    }
    else{
      homePageData('Deactive');
    }
  }

  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState({});

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.Name, //give each row a more useful id
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
        <Switch {...label} defaultChecked={defaultCheckedProp} id='ActiveToggleBtn' onChange={statusToggleOnClick}/> <span style={{ fontWeight: 'bold' }}> Active </span>
        <Switch {...label} defaultChecked={defaultCheckedProp} id='ApprovalToggleBtn' onChange={statusToggleOnClick}/> <span style={{ fontWeight: 'bold' }}> Approved </span>
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

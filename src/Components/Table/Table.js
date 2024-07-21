import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const Table = ({ columnsProps, dataProps, isLoadingState }) => {

  const data = dataProps;
  const columns = useMemo(
    //column definitions...
    () => [
      ...columnsProps
    ],
    [], //end
  );

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
    //Adding a custom button to the bottom toolbar
    renderTopToolbarCustomActions: () => (
      <div>
      <Switch {...label} />
      {/* <Button
      //extract all selected rows from the table instance and do something with them
      // onClick={() => handleDownloadRows(table.getSelectedRowModel().rows)}
      >
        <AddIcon/>  ADD A NEW STUDENT
      </Button> */}
      </div>
    ),
  });

  //do something when the row selection changes...
  useEffect(() => {
    console.info({ rowSelection }); //read your managed row selection state
  }, [rowSelection]);

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default Table;

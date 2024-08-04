import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React from 'react';

const Table = ({ columnsProps, dataProps, isLoadingState }) => {

  const data = dataProps;
  const columns = useMemo(
    //column definitions...
    () => [
      ...columnsProps
    ],
    [],
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
    }
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default Table;

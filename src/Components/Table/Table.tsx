import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../../ComponetsStyles/Tables.css'

const Tables = (props) => {

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


  return (
    <div>
      <div id='totalNumberOfRecords' className='Table'>
        Total Number of Records: {props.props.length}
      </div>
      <TableContainer className="Table" component={Paper}>
        <Table id='ResultsTable' sx={{ minWidth: 1000 }} aria-label="customized table">
          <TableHead >
            <TableRow>
              <StyledTableCell className='tableHeader' align="center">Student&nbsp;Name</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Guardian&nbsp;Name</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Level</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Student&nbsp;Code</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Abacus</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Finger</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Mental&nbsp;viewing</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Mental&nbsp;hearing</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Total</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Attendence</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">C.W</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">H.W</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Braingym</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">s.writing</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Abacus&nbsp;(no. of sums /min)</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Finger&nbsp;(no. of sums /min)</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">M.Hearing&nbsp;(no. of sums /min)</StyledTableCell>
              <StyledTableCell className='tableHeader' align="center">Institute&nbsp;Name</StyledTableCell>
              {props.showAdditionalData ? (
                <>
                  <StyledTableCell className='tableHeader' align="center">Created&nbsp;By</StyledTableCell>
                  <StyledTableCell className='tableHeader' align="center">Created&nbsp;Date</StyledTableCell>
                </>
              ) : (
                <></>
              )}
            </TableRow>
          </TableHead>
          <TableBody className='tableBody'>
            {props.props.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell align="center">{row.studentName}</StyledTableCell>
                <StyledTableCell align="center">{row.guardianName}</StyledTableCell>
                <StyledTableCell align="center">{row.Level}</StyledTableCell>
                <StyledTableCell align="center">{row.studentCode}</StyledTableCell>
                <StyledTableCell align="center">{row.Abacus}</StyledTableCell>
                <StyledTableCell align="center">{row.Finger}</StyledTableCell>
                <StyledTableCell align="center">{row.Mentalviewing}</StyledTableCell>
                <StyledTableCell align="center">{row.Mentalhearing}</StyledTableCell>
                <StyledTableCell align="center">{row.Total}</StyledTableCell>
                <StyledTableCell align="center">{row.Attendence}</StyledTableCell>
                <StyledTableCell align="center">{row.CW}</StyledTableCell>
                <StyledTableCell align="center">{row.HW}</StyledTableCell>
                <StyledTableCell align="center">{row.Braingym}</StyledTableCell>
                <StyledTableCell align="center">{row.swriting}</StyledTableCell>
                <StyledTableCell align="center">{row.Abacus_no_of_sums_min}</StyledTableCell>
                <StyledTableCell align="center">{row.Finger_no_of_sums_min}</StyledTableCell>
                <StyledTableCell align="center">{row.MHearing_no_of_sums_min}</StyledTableCell>
                <StyledTableCell align="center">{row.InstituteName}</StyledTableCell>
                {props.showAdditionalData ? (
                  <>
                    <StyledTableCell align="center">{row.CreatedBy}</StyledTableCell>
                    <StyledTableCell align="center">{row.CreatedDateTime.toDate().toLocaleString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</StyledTableCell>
                  </>
                ) : (
                  <></>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div >
  )
}

export default Tables

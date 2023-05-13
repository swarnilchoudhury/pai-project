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
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Student Name</StyledTableCell>
            <StyledTableCell align="left">Guardian Name</StyledTableCell>
            <StyledTableCell align="left">Level</StyledTableCell>           
            <StyledTableCell align="left">Student Code</StyledTableCell>           
            <StyledTableCell align="left">Abacus</StyledTableCell>           
            <StyledTableCell align="left">Finger</StyledTableCell>           
            <StyledTableCell align="left">Mental viewing</StyledTableCell>           
            <StyledTableCell align="left">Mental hearing</StyledTableCell>           
            <StyledTableCell align="left">Total</StyledTableCell>           
            <StyledTableCell align="left">Attendence</StyledTableCell>           
            <StyledTableCell align="left">C.W</StyledTableCell>           
            <StyledTableCell align="left">H.W</StyledTableCell>           
            <StyledTableCell align="left">Braingym</StyledTableCell>           
            <StyledTableCell align="left">s.writing</StyledTableCell>           
            <StyledTableCell align="left">Abacus (no. of sums /min)</StyledTableCell>           
            <StyledTableCell align="left">Finger (no. of sums /min)</StyledTableCell>           
            <StyledTableCell align="left">M.Hearing (no. of sums /min)</StyledTableCell>          
            <StyledTableCell align="left">Institute Name</StyledTableCell>          
          </TableRow>
        </TableHead>
        <TableBody>
          {props.props.map((row) => (
            <StyledTableRow key={row.id}>             
              <StyledTableCell align="left">{row.studentName}</StyledTableCell>
              <StyledTableCell align="left">{row.guardianName}</StyledTableCell>
              <StyledTableCell align="left">{row.level}</StyledTableCell>
              <StyledTableCell align="left">{row.studentCode}</StyledTableCell>
              <StyledTableCell align="left">{row.Abacus}</StyledTableCell>
              <StyledTableCell align="left">{row.Finger}</StyledTableCell>
              <StyledTableCell align="left">{row.Mentalviewing}</StyledTableCell>
              <StyledTableCell align="left">{row.Mentalhearing}</StyledTableCell>
              <StyledTableCell align="left">{row.Total}</StyledTableCell>
              <StyledTableCell align="left">{row.Attendence}</StyledTableCell>
              <StyledTableCell align="left">{row.CW}</StyledTableCell>
              <StyledTableCell align="left">{row.HW}</StyledTableCell>
              <StyledTableCell align="left">{row.Braingym}</StyledTableCell>
              <StyledTableCell align="left">{row.swriting}</StyledTableCell>
              <StyledTableCell align="left">{row.Abacus_no_of_sums_min}</StyledTableCell>
              <StyledTableCell align="left">{row.Finger_no_of_sums_min}</StyledTableCell>
              <StyledTableCell align="left">{row.MHearing_no_of_sums_min}</StyledTableCell>
              <StyledTableCell align="left">{row.InstituteName}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>    
    </div>
  )
}

export default Tables

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import MiscTable from '../Table/MinimalTable';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90% !important',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};


const TransitionsModal = ({ heading, columnsProps,
  dataProps,
  isLoadingState,
  isEnableTopToolbar,
  pageSize
}) => {

  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <h3>{heading}</h3>
            <MiscTable
              columnsProps={columnsProps}
              dataProps={dataProps}
              isLoadingState={isLoadingState}
              isEnableTopToolbar={isEnableTopToolbar}
              pageSize={pageSize}/>
            <Button variant="contained" onClick={handleClose} style={{ marginTop: '1.2rem',float: 'right' }}><CloseIcon />Close</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default TransitionsModal;

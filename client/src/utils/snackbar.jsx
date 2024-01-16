import React, { useEffect } from 'react';
import {useState} from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const CustomSnackbar = ({ open, type, message}) => {
  const [openS, setOpenS] = useState(false)
  const isSuccess = type === 'success';
  const backgroundColor = isSuccess ? 'green' : 'red';
useEffect(()=>{
  if(open=='true'){
    setOpenS(true)
  }
},[open])
  return (
    <Snackbar
      open={openS}
      autoHideDuration={6000}
      onClose={()=> setOpenS(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor, padding: '8px', borderRadius: '4px' }}>
        {isSuccess ? (
          <CheckCircleIcon style={{ marginRight: '8px', color: 'white' }} />
        ) : (
          <ErrorIcon style={{ marginRight: '8px', color: 'white' }} />
        )}
        <div style={{ color: 'white' }}>{message}</div>
        <IconButton size="small" style={{ color: 'white' }} onClick={()=> setOpenS(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Snackbar>
  );
};

export default CustomSnackbar;

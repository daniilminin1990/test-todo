import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {useAppDispatch, useAppSelector} from "../store/store";
import {setAppErrorAC} from "../redux/appReducer";

export default function CustomizedSnackbars() {
  const errorToApp = useAppSelector(state => state.appReducer.error)
  const dispatch = useAppDispatch()
  const handleClose = () => {
    dispatch(setAppErrorAC(null))
  };

  return (
    <div>
      <Snackbar open={!!errorToApp} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorToApp}
        </Alert>
      </Snackbar>
    </div>
  );
}
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useAppDispatch, useAppSelector} from "../store/store";
import {logoutTC} from "../features/Login/loginSlice";

export default function ButtonAppBar() {
  const isLoggedIn = useAppSelector(state => state.loginReducer.isLoggedIn)
  // const isLoggedIn = useSelector(loginSelectors.isLoggedIn)
  const dispatch = useAppDispatch()
  const logoutHandler = () => {
    dispatch(logoutTC())
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
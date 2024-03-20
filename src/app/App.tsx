import React from 'react';
import './App.css';
import ButtonAppBar from '../components/ButtonAppBar';
import {CircularProgress, Container} from '@mui/material';
import {TodolistsBunch} from "../features/TodolistsBunch/TodolistsBunch";
import {useAppSelector} from "../store/store";
import LinearProgress from '@mui/material/LinearProgress';
import ErrorSnackbar from "../components/ErrorSnackbar";


const App = React.memo(() => {
  const statusTodo = useAppSelector(state => state.appReducer.statusTodo)
  const statusTask = useAppSelector(state => state.appReducer.statusTask)
  return (
    <div className="App">
      <ButtonAppBar/>
      <ErrorSnackbar />
      {statusTask==='loading' && <LinearProgress color="secondary"/>}
      <Container fixed>
        {statusTodo==='loading' && <CircularProgress color='info' style={{
            width: '300px',
            height: '300px',
            position: 'absolute',
            left: '40%',
            top: '20%',
            zIndex: '999'
          }}/>
        }
        <TodolistsBunch/>
      </Container>
    </div>
  );
})

export default App;
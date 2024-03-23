import React, {useEffect} from 'react';
import './App.css';
import ButtonAppBar from '../components/ButtonAppBar';
import {CircularProgress, Container} from '@mui/material';
import {TodolistsBunch} from "../features/TodolistsBunch/TodolistsBunch";
import {useAppDispatch, useAppSelector} from "../store/store";
import LinearProgress from '@mui/material/LinearProgress';
import ErrorSnackbar from "../components/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {BrowserRouter, HashRouter, Navigate, Route, Routes} from "react-router-dom";
import { initialiseMeTC} from "../redux/appReducer";

// For githubpages use this stroke in package.json
// "homepage": "https://daniilminin1990.github.io/test-todo",
// And here use HashRouter instead BrowserRouter


const App = React.memo(() => {
  const statusTodo = useAppSelector(state => state.appReducer.statusTodo)
  const statusTask = useAppSelector(state => state.appReducer.statusTask)
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector(state => state.appReducer.isInitialized)

  useEffect(() => {
    dispatch(initialiseMeTC())
  }, []);

  if(!isInitialized){
    return <div style={{position: "fixed", top: '45%', textAlign: "center", width: '100%'}}>
      <CircularProgress color='info'/>
    </div>
  }
  return (
      <div className="App">
        <ButtonAppBar/>
        <ErrorSnackbar/>
        {statusTask === 'loading' && <LinearProgress color="secondary"/>}
        <Container fixed>
          {statusTodo === 'loading' && <CircularProgress color='info' style={{
            width: '300px',
            height: '300px',
            position: 'absolute',
            left: '40%',
            top: '20%',
            zIndex: '999'
          }}/>
          }
          <Routes>
            <Route path={'/'} element={<TodolistsBunch/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'/404'} element={<h1 style={{textAlign: 'center'}}>404: Page not found</h1>}/>
            <Route path={'*'} element={<Navigate to={'/404'}/>} />
          </Routes>
        </Container>
      </div>
  );
})

export default App;
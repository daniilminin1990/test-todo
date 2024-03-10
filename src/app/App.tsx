import React from 'react';
import './App.css';
import ButtonAppBar from '../components/ButtonAppBar';
import { Container, Grid, Paper } from '@mui/material';
import {TodolistsBunch} from "../features/TodolistsBunch/TodolistsBunch";


const App = React.memo(() => {
  return (
    <div className="App">
      <ButtonAppBar />
      <Container fixed >
        <TodolistsBunch/>
      </Container>
    </div >
  );
})

export default App;
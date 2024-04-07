import React from 'react';
import './App.css';
import ButtonAppBar from '../components/ButtonAppBar';
import {CircularProgress, Container} from '@mui/material';
import {TodolistsBunch} from "../features/TodolistsBunch/TodolistsBunch";
import {useAppSelector} from "../store/store";
import LinearProgress from '@mui/material/LinearProgress';
import ErrorSnackbar from "../components/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {appSelectors} from "../redux/appSlice";
import {styleCircular} from "../utilities";
import AppBarWithToggleLeft from "../components/AppBarWithToggle";


// For githubpages use this stroke in package.json
// "homepage": "https://daniilminin1990.github.io/test-todo",
// And here use HashRouter instead BrowserRouter


// const getDesignTokens = (mode: PaletteMode) => ({
//   palette: {
//     mode,
//     primary: {
//       ...amber,
//       ...(mode === 'dark' && {
//         main: amber[300],
//       }),
//     },
//     ...(mode === 'dark' && {
//       background: {
//         default: deepOrange[900],
//         paper: deepOrange[900],
//       },
//     }),
//     text: {
//       ...(mode === 'light'
//         ? {
//           primary: grey[900],
//           secondary: grey[800],
//         }
//         : {
//           primary: '#fff',
//           secondary: grey[500],
//         }),
//     },
//   },
// });
const App = React.memo(() => {
  const statusTodo = useAppSelector(state => appSelectors.statusTodo(state))
  const statusTask = useAppSelector(state => appSelectors.statusTask(state))
  const isInitialized = useAppSelector(state => appSelectors.isInitialized(state))
  // const statusTodo = useAppSelector(state => state.appReducer.statusTodo)
  // const statusTask = useAppSelector(state => state.appReducer.statusTask)
  // const isInitialized = useAppSelector(state => state.appReducer.isInitialized)


  // const statusTodo = useAppSelector(state =>  appSelectors.statusTodo(state))

  // const statusTodo = useAppSelector(appSelectors.statusTodo)

  // const statusTask = useSelector(appSelectors.statusTask)

  // const statusTask = useAppSelector(state => state.appReducer.statusTask)
  // const isInitialized = useSelector(appSelectors.isInitialized)

  // useEffect(() => {
  //   console.log(isInitialized)
  //   dispatch(appThunks.initialiseMeTC())
  // }, []);
  if(!isInitialized){
    return <div style={styleCircular}>
      <CircularProgress color='info'/>
    </div>
  }
  return (

      <div className="App">
        {statusTodo === 'loading' && <div style={styleCircular}>
          <CircularProgress color='info'/>
        </div>
        }
        {/*<ButtonAppBar/>*/}
        <ErrorSnackbar/>
        {statusTask === 'loading' && <LinearProgress color="secondary"/>}
        <Container fixed>
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
import React, { memo, useCallback } from 'react';
import './App.css';
import { v1 } from 'uuid';
import { Todolist } from './Todolist';
import { AddItemForm } from "./AddItemForm";
import { useDispatch, useSelector } from "react-redux";
import { RootReducerType } from "./store/store";
import { addTodoAC, changeFilterAC, updateTodoTitleAC } from "./redux/todolistReducer";
import ButtonAppBar from './ButtonAppBar';
import { Container, Grid, Paper } from '@mui/material';

// тип task status
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoType = { id: string, title: string, filter: FilterValuesType }
export type TaskType = { id: string, taskTitle: string, isDone: boolean, }
export type TaskStateType = { [todolistId: string]: TaskType[] }

const App = React.memo(() => {
  console.log('App')
  const dispatch = useDispatch()
  const todolists = useSelector<RootReducerType, TodoType[]>((state) => state.todolistReducer)
  // const tasks = useSelector<RootReducerType, TaskStateType>((state) => state.tasksReducer)

  // Фильтрация задач
  const changeFilter = useCallback((todolistId: string, newFilterValue: FilterValuesType) => {
    dispatch(changeFilterAC(todolistId, newFilterValue))
  }, [dispatch])

  const addTodo = useCallback((newTodoTitle: string) => {
    const newTodolistId = v1()
    dispatch(addTodoAC(newTodolistId, newTodoTitle))
  }, [dispatch])

  const updTodoTitle = useCallback((todolistId: string, updTodoTitle: string) => {
    dispatch(updateTodoTitleAC(todolistId, updTodoTitle))
  }, [dispatch])
  return (
    <div className="App">
      <ButtonAppBar />
      <Container fixed >
        <Grid container style={{ padding: '20px' }} >
          <AddItemForm callback={addTodo} />
        </Grid>
        <Grid container spacing={3}>
          {
            todolists.map(tl => {
              // let allTodoTasks = tasks[tl.id]
              return (
                <Grid item key={tl.id}>
                  <Paper elevation={6} style={{ padding: '30px' }}>
                    <Todolist
                      key={tl.id}
                      todolistId={tl.id}
                      todoTitle={tl.title}
                      // tasks={allTodoTasks}
                      tasksFilter={tl.filter}
                      changeFilter={changeFilter}
                      updTodoTitle={updTodoTitle}
                    />
                  </Paper>
                </Grid>

              )
            })
          }
        </Grid>
      </Container>
    </div >
  );
})

export default App;


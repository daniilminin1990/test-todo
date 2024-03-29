import React, {useCallback, useEffect, useState} from "react";
import {RootReducerType, useAppDispatch, useAppSelector} from "../../store/store";
import {useSelector} from "react-redux";
import {
  addTodoTC,
  changeFilterAC,
  changeTodoTitleTC,
  FilterValuesType,
  setTodolistsTC,
  TodoUIType
} from "../../redux/todolistReducer";
import {CircularProgress, Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate, useNavigate} from "react-router-dom";

type TodolistsBunchProps = {}
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  const dispatch = useAppDispatch()
  const todolists = useSelector<RootReducerType, TodoUIType[]>((state) => state.todolistReducer)
  const statusAddTodo = useAppSelector(state => state.appReducer.addStatus)
  const isLoggedIn = useAppSelector(state => state.loginReducer.isLoggedIn)
  const navigate = useNavigate();

  useEffect(() => {
    if(!isLoggedIn){
      return
    }
    dispatch(setTodolistsTC())
  }, []);

  const changeFilter = useCallback((todoListId: string, newFilterValue: FilterValuesType) => {
    dispatch(changeFilterAC({todoListId:todoListId, newFilterValue: newFilterValue}))
  }, [dispatch])

  const addTodo = useCallback((newTodoTitle: string) => {
    dispatch(addTodoTC(newTodoTitle))
  }, [dispatch])

  const updTodoTitle = useCallback((todoListId: string, updTodoTitle: string) => {
    dispatch(changeTodoTitleTC(todoListId, updTodoTitle))
  }, [dispatch])

  if(!isLoggedIn){
    return <Navigate to={'/login'}/>
  }

  return (
    <>
      <Grid container style={{padding: '20px'}}>
        <AddItemForm callback={addTodo}/>
        {statusAddTodo === 'loading' && <CircularProgress color='info'/>}
      </Grid>
      <Grid container spacing={3}>
        {
          todolists.map(tl => {
            // let allTodoTasks = tasks[tl.id]
            return (
              <Grid item key={tl.id}>
                <Paper elevation={6} style={{padding: '30px'}}>
                  <Todolist
                    key={tl.id}
                    todoListId={tl.id}
                    todoTitle={tl.title}
                    // tasks={allTodoTasks}
                    tasksFilter={tl.filter}
                    changeFilter={changeFilter}
                    updTodoTitle={updTodoTitle}
                    entityStatus={tl.entityStatus}
                    disabled={tl.entityStatus}
                  />
                </Paper>
              </Grid>

            )
          })
        }
      </Grid>
    </>
  )
};
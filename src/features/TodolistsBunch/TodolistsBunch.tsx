import React, {useCallback, useEffect} from "react";
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

type TodolistsBunchProps = {}
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  const dispatch = useAppDispatch()
  const todolists = useSelector<RootReducerType, TodoUIType[]>((state) => state.todolistReducer)
  const statusAddTodo = useAppSelector(state => state.appReducer.addStatus)

  useEffect(() => {
    dispatch(setTodolistsTC())
  }, []);

  const changeFilter = useCallback((todolistId: string, newFilterValue: FilterValuesType) => {
    dispatch(changeFilterAC(todolistId, newFilterValue))
  }, [dispatch])

  const addTodo = useCallback((newTodoTitle: string) => {
    dispatch(addTodoTC(newTodoTitle))
  }, [dispatch])

  const updTodoTitle = useCallback((todolistId: string, updTodoTitle: string) => {
    dispatch(changeTodoTitleTC(todolistId, updTodoTitle))
  }, [dispatch])

      return (
        <>
          <Grid container style={{ padding: '20px' }} >
            <AddItemForm callback={addTodo} />
            {statusAddTodo==='loading' && <CircularProgress color='info'/>}
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
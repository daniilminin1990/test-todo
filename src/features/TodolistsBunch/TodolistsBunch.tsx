import React, {useCallback, useEffect, useState} from "react";
import {RootReducerType, useAppDispatch, useAppSelector} from "../../store/store";
import {useSelector} from "react-redux";
import {
  FilterValuesType,
  todolistsActions, todolistsSelectors, todolistsThunks,
  TodoUIType
} from "../../redux/todolistsSlice";
import {CircularProgress, Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {appSelectors, ServerResponseStatusType} from "../../redux/appSlice";
import {loginSelectors} from "../Login/loginSlice";

type TodolistsBunchProps = {}
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  const dispatch = useAppDispatch()
  // const todolists = useSelector<RootReducerType, TodoUIType[]>(state => state.todolist)
  // const todolists = useAppSelector(state => state.todolists)
  const todolists = useAppSelector((state) => todolistsSelectors.todolists(state))
  const statusAddTodo = useAppSelector(state => appSelectors.statusTodo(state))
  const isLoggedIn = useAppSelector(state => loginSelectors.isLoggedIn(state))

  // console.log('TODO-UI-INDEX', todolists[0])

  // useEffect(() => {
  //   if(!isLoggedIn){
  //     return
  //   }
  //   dispatch(fetchTodolistsTC())
  // }, []);
  // Region
const [todoListIdToDrag, setTodoListIdToDrag] = useState<string>('')
  function dragStartHandler(e: React.DragEvent<HTMLDivElement>, startDragId: string) {
    setTodoListIdToDrag(startDragId)
    console.log('DRAGGING-ID', startDragId)
  }

  function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {
  }

  function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function dropHandler(e: React.DragEvent<HTMLDivElement>, endShiftId: string) {
    e.preventDefault()
    // // Определяем UI index тудулиста, НА который перетаскиваем
    // const todoUIIndexToDrag = todolists.findIndex((tl, index) => tl.id === startDragId && index >= 0)
    // const todoUIIndexToShift = todolists.findIndex((tl, index) => tl.id === endShiftId && index >= 0)
    // // Отнимаем 1 из UI index и определяем его id, если таковой есть, то збс. Если нет, то null
    // const idToServer = setIdToServer(todoUIIndexToShift)
    // function setIdToServer(idToShift: number) {
    //   if (idToShift > 0 && idToShift <= todoUIIndexToDrag) {
    //     return todolists[idToShift - 1].id;
    //   } else if (idToShift > todoUIIndexToDrag) {
    //     return endShiftId;
    //   } else {
    //     return null;
    //   }
    // }
    // console.log('ID TO SERVER', idToServer)
    dispatch(todolistsThunks.reorderTodolistTC({startDragId: todoListIdToDrag, endShiftId: endShiftId}))

  }

  // End

  const changeFilter = useCallback((todoListId: string, newFilterValue: FilterValuesType) => {
    dispatch(todolistsActions.changeTodoFilter({todoListId: todoListId, newFilterValue: newFilterValue}))
  }, [dispatch])

  const addTodo = useCallback((newTodoTitle: string) => {
    dispatch(todolistsThunks.addTodoTC(newTodoTitle))
  }, [dispatch])

  const updTodoTitle = useCallback((todoListId: string, updTodoTitle: string) => {
    dispatch(todolistsThunks.updateTodoTitleTC({todoListId: todoListId, title: updTodoTitle}))
  }, [dispatch])

  if (!isLoggedIn) {
    return <Navigate to={'/login'}/>
  }

  return (
    <>
      <Grid container style={{padding: '20px'}}>
        <AddItemForm callback={addTodo}/>
      </Grid>
      <Grid container spacing={3}>
        {
          todolists.map(tl => {
            return (
              <Grid item key={tl.id}
                    draggable={true}
                    onDragStart={(e) => dragStartHandler(e, tl.id)}
                    onDragLeave={(e) => dragEndHandler(e)}
                    onDragEnd={(e) => dragEndHandler(e)}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDrop={(e) => dropHandler(e, tl.id)}
              >
                <Paper elevation={6} style={{padding: '30px'}}>
                  <Todolist
                    key={tl.id}
                    todoListId={tl.id}
                    todoTitle={tl.title}
                    tasksFilter={tl.filter}
                    changeFilter={changeFilter}
                    updTodoTitle={updTodoTitle}
                    entityStatus={tl.entityStatus}
                    disabled={tl.entityStatus}
                    showTasks={tl.showTasks}
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
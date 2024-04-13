import React, { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  FilterValuesType,
  todolistsActions,
  todolistsSelectors,
  todolistsThunks,
} from "../../redux/todolistsSlice";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { appSelectors } from "../../redux/appSlice";
import { loginSelectors } from "../../redux/loginSlice";
import { AddItemForm } from "../../common/components";
import { useActions } from "../../common/hooks/useActions";

type TodolistsBunchProps = {};
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  // const dispatch = useAppDispatch();
  const {
    reorderTodolistTC,
    changeTodoFilter: changeTodoFilterAC,
    addTodoTC,
    updateTodoTitleTC,
  } = useActions();

  const todolists = useAppSelector((state) =>
    todolistsSelectors.todolists(state)
  );
  const statusAddTodo = useAppSelector((state) =>
    appSelectors.statusTodo(state)
  );
  const isLoggedIn = useAppSelector((state) =>
    loginSelectors.isLoggedIn(state)
  );

  // console.log('TODO-UI-INDEX', todolists[0])

  // useEffect(() => {
  //   if(!isLoggedIn){
  //     return
  //   }
  //   dispatch(fetchTodolistsTC())
  // }, []);
  // Region
  const [todoListIdToDrag, setTodoListIdToDrag] = useState<string>("");
  function dragStartHandler(
    e: React.DragEvent<HTMLDivElement>,
    startDragId: string
  ) {
    setTodoListIdToDrag(startDragId);
    console.log("DRAGGING-ID", startDragId);
  }

  function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {}

  function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function dropHandler(e: React.DragEvent<HTMLDivElement>, endShiftId: string) {
    e.preventDefault();
    // dispatch(
    //   todolistsThunks.reorderTodolistTC({
    //     endShiftId: endShiftId,
    //     startDragId: todoListIdToDrag,
    //   })
    // );
    reorderTodolistTC({
      endShiftId: endShiftId,
      startDragId: todoListIdToDrag,
    });
  }

  // End

  const changeFilter = useCallback(
    (todoListId: string, newFilterValue: FilterValuesType) => {
      // dispatch(
      //   todolistsActions.changeTodoFilter({
      //     todoListId: todoListId,
      //     newFilterValue: newFilterValue,
      //   })
      // );
      changeTodoFilterAC({
        todoListId: todoListId,
        newFilterValue: newFilterValue,
      });
    },
    []
  );

  const addTodo = useCallback((newTodoTitle: string) => {
    // dispatch(todolistsThunks.addTodoTC(newTodoTitle));
    addTodoTC(newTodoTitle);
  }, []);

  const updTodoTitle = useCallback(
    (todoListId: string, updTodoTitle: string) => {
      // dispatch(
      //   todolistsThunks.updateTodoTitleTC({
      //     todoListId: todoListId,
      //     title: updTodoTitle,
      //   })
      // );
      updateTodoTitleTC({
        todoListId: todoListId,
        title: updTodoTitle,
      });
    },
    []
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm callback={addTodo} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid
              item
              key={tl.id}
              draggable={true}
              onDragStart={(e) => dragStartHandler(e, tl.id)}
              onDragLeave={(e) => dragEndHandler(e)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => dropHandler(e, tl.id)}
            >
              <Paper
                elevation={6}
                style={{ padding: "30px", borderRadius: "10px" }}
              >
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
          );
        })}
      </Grid>
    </>
  );
};

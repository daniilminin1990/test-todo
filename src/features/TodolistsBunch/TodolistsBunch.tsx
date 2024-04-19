import React, { useCallback, useState } from "react";
import { useAppSelector } from "../../store/store";
import {
  FilterValuesType,
  todolistsSelectors,
} from "../../redux/todolistsSlice";
import { ClassNameMap, Grid, Pagination, Paper } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { Navigate, useSearchParams } from "react-router-dom";
import { appSelectors } from "../../redux/appSlice";
import { loginSelectors } from "../../redux/loginSlice";
import { AddItemForm } from "../../common/components";
import { useActions } from "../../common/hooks/useActions";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { grey, yellow } from "@mui/material/colors";
import { CSSProperties } from "@mui/material/styles/createMixins";
import { createStyles, Theme } from "@material-ui/core/styles";
import {MyPagination} from "../../common/components/MyPagination/MyPagination";

type TodolistsBunchProps = {};
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  // const dispatch = useAppDispatch();
  const {
    reorderTodolistTC,
    reorderTask,
    reorderTasksTC,
    changeTodoFilter: changeTodoFilterAC,
    addTodoTC,
    updateTodoTitleTC,
  } = useActions();

  const [searchParams, setSearchParams] = useSearchParams();

  const todolists = useAppSelector((state) =>
    todolistsSelectors.todolists(state)
  );
  const statusAddTodo = useAppSelector((state) =>
    appSelectors.statusTodo(state)
  );
  const isLoggedIn = useAppSelector((state) =>
    loginSelectors.isLoggedIn(state)
  );

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
    reorderTodolistTC({
      endShiftId: endShiftId,
      startDragId: todoListIdToDrag,
    });
  }

  // End

  const changeFilter = useCallback(
    (todoListId: string, newFilterValue: FilterValuesType) => {
      changeTodoFilterAC({
        todoListId: todoListId,
        newFilterValue: newFilterValue,
      });
    },
    []
  );

  const addTodo = useCallback((newTodoTitle: string) => {
    addTodoTC(newTodoTitle);
  }, []);

  const updTodoTitle = useCallback(
    (todoListId: string, updTodoTitle: string) => {
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
      <MyPagination />
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm callback={addTodo} />
      </Grid>
      <Grid container spacing={3}>
        {todolists
          .filter((e) =>
            searchParams.get("search")
              ? e.title.includes(searchParams.get("search") ?? "")
              : e
          )
          .map((tl) => {
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
                  todolist={tl}
                />
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

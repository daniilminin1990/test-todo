import React, { useCallback, useMemo } from "react";
import { useAppSelector } from "../../store/store";
import { todolistsSelectors } from "../../redux/todolistsSlice";
import { Grid } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { appSelectors } from "../../redux/appSlice";
import { loginSelectors } from "../../redux/loginSlice";
import { AddItemForm } from "../../common/components";
import { useActions } from "../../common/hooks/useActions";
import { SortableContext } from "@dnd-kit/sortable";
import { DndContextHOC } from "../../common/components/DndContextHOC/DndContextHOC";

type TodolistsBunchProps = {};
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  // const dispatch = useAppDispatch();
  const { addTodoTC } = useActions();

  const todolists = useAppSelector((state) =>
    todolistsSelectors.todolists(state)
  );
  const statusAddTodo = useAppSelector((state) =>
    appSelectors.statusTodo(state)
  );
  const isLoggedIn = useAppSelector((state) =>
    loginSelectors.isLoggedIn(state)
  );
  const todolistIds = useMemo(
    () => todolists.allTodolists.map((tl) => tl.id),
    [todolists]
  );

  const addTodo = useCallback((newTodoTitle: string) => {
    addTodoTC(newTodoTitle);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <DndContextHOC>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm callback={addTodo} />
      </Grid>
      <Grid container spacing={3}>
        <SortableContext items={todolistIds}>
          {todolists.allTodolists.map((tl) => {
            return (
              <Grid item key={tl.id}>
                <Todolist key={tl.id} todolist={tl} />
              </Grid>
            );
          })}
        </SortableContext>
      </Grid>
    </DndContextHOC>
  );
};

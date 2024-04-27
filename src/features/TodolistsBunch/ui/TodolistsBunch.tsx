import React, { useCallback, useEffect, useState } from "react";
import { RootReducerType, useAppSelector } from "../../../store/store";
import { FilterValuesType, todolistsSelectors } from "../../../redux/todolistsSlice";
import { ClassNameMap, Grid, Pagination, Paper } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { Navigate, useSearchParams } from "react-router-dom";
import { appSelectors, appSlice } from "../../../redux/appSlice";
import { loginSelectors } from "../../../redux/loginSlice";
import { AddItemForm } from "../../../common/components";
import { useActions } from "../../../common/hooks/useActions";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { grey, yellow } from "@mui/material/colors";
import { CSSProperties } from "@mui/material/styles/createMixins";
import { createStyles, Theme } from "@material-ui/core/styles";
import { MyPagination } from "../../../common/components/MyPagination/MyPagination";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";

type TodolistsBunchProps = {};
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  // const dispatch = useAppDispatch();
  const { reorderTodolistTC, reorderTask, reorderTasksTC, changeTodoFilter: changeTodoFilterAC, addTodoTC, updateTodoTitleTC } = useActions();

  const [searchParams, setSearchParams] = useSearchParams();

  const todolists = useAppSelector((state) => todolistsSelectors.todolists(state));
  const statusAddTodo = useAppSelector((state) => appSelectors.statusTodo(state));
  const isLoggedIn = useAppSelector((state) => loginSelectors.isLoggedIn(state));
  const searchQuery = useSelector<RootReducerType, string>((state) => state.app.searchQuery);

  // Paginaton
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState(4);
  const [query, setQuery] = useState("");

  const theme: any = useTheme();

  useEffect(() => {
    const searchQueryParams: { search?: string } = searchQuery !== "" ? { search: searchQuery } : {};
    const pageQueryParams: { pageQ?: string } = page.toString() !== "1" ? { pageQ: page.toString() } : {};
    const allQuery = { ...searchQueryParams, ...pageQueryParams };
    setSearchParams(allQuery);
  }, [page, searchQuery]);

  const styles = {
    ul: {
      "& .MuiPaginationItem-root": {
        backgroundColor: theme.palette.mode === "dark" ? "#ffffff" : "#171717",
        color: theme.palette.mode === "dark" ? "#171717" : "#ffffff",

        "&.Mui-selected": {
          backgroundColor: "#6c00ea",
        },
      },
    },
  };
  // Region
  const [todoListIdToDrag, setTodoListIdToDrag] = useState<string>("");

  function dragStartHandler(e: React.DragEvent<HTMLDivElement>, startDragId: string) {
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

  const addTodo = useCallback((newTodoTitle: string) => {
    return addTodoTC(newTodoTitle).unwrap();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  const displayedTodolists = todolists.slice((Number(page) - 1) * pageCount, Number(page) * pageCount);
  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm callback={addTodo} />
      </Grid>
      <Grid container spacing={3} justifyContent={"space-evenly"}>
        {displayedTodolists
          .filter((e) => (searchParams.get("search") ? e.title.includes(searchParams.get("search") ?? "") : e))
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
                <Todolist key={tl.id} todoList={tl} />
              </Grid>
            );
          })}
      </Grid>
      <Stack spacing={2} direction={"column"} sx={{ marginTop: "20px" }}>
        <Box
          sx={{
            ...styles.ul,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={Math.ceil(todolists.length / pageCount)}
            shape="rounded"
            variant="outlined"
            onChange={(e, num) => setPage(num)}
            hideNextButton={true}
            hidePrevButton={true}
          />
        </Box>
      </Stack>
    </>
  );
};

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AddItemForm } from "../../../common/components/AddItemForm/AddItemForm";
import EdiatbleSpan from "../../../common/components/EditableSpan/EdiatbleSpan";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { Grid, Paper } from "@mui/material";
import {
  // addTaskTC,
  // updateTaskTC,
  // deleteTaskTC,
  TasksWithEntityStatusType,
  tasksThunks,
  tasksSelectors,
  tasksSlice,
  TaskStateType,
} from "../../../redux/tasksSlice";
import { Task } from "./Task/Task";
import {
  FilterValuesType,
  todolistsActions,
  todolistsSelectors,
  todolistsThunks,
  TodoUIType,
} from "../../../redux/todolistsSlice";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Skeleton from "@mui/material/Skeleton";
import {
  RootReducerType,
  useAppDispatch,
  useAppSelector,
} from "../../../store/store";
import {
  appSelectors,
  ServerResponseStatusType,
} from "../../../redux/appSlice";
import { TaskStatuses } from "../../../common/enums/enums";
import { useActions } from "../../../common/hooks/useActions";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TodolistProps = {
  // todoTitle: string;
  // // tasks: TaskType[]
  // tasksFilter: FilterValuesType;
  // todoListId: string;
  todolist: TodoUIType;
  // changeFilter: (
  //   todoListId: string,
  //   newTasksFilterValue: FilterValuesType
  // ) => void;
  // updTodoTitle: (todoListId: string, updTodoTitle: string) => void;
  // entityStatus: ServerResponseStatusType;
  // disabled: ServerResponseStatusType;
  // showTasks: boolean;
};

export const Todolist = React.memo(({ todolist }: TodolistProps) => {
  const dispatch = useAppDispatch();
  const isBlockDragMode = useSelector(appSelectors.isBlockDragMode);
  const todolists = useAppSelector((state) =>
    todolistsSelectors.todolists(state)
  );
  // const todolist = useAppSelector((state) =>
  //   todolistsSelectors.todolistById(state, todolist.id)
  // );

  const {
    deleteTaskTC,
    addTaskTC,
    updateTaskTC,
    deleteTodoTC,
    changeTodoFilter,
    updateTodoTitleTC,
  } = useActions();

  let allTodoTasks = useAppSelector((state) =>
    tasksSelectors.tasksById(state, todolist.id)
  );

  let tasksIds = useMemo(
    () => allTodoTasks.map((task) => task.id),
    [allTodoTasks]
  );

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todolist.id,
    data: {
      type: "Todolist",
      todolist,
    },
    disabled:
      todolists.isBlockTodosToDrag &&
      !todolist.isTodoDragging &&
      !isBlockDragMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const removeTask = useCallback(
    (taskId: string) => {
      deleteTaskTC({ todoListId: todolist.id, taskId });
    },
    [todolist.id]
  );

  const addTask = useCallback(
    (newTaskTitle: string) => {
      addTaskTC({
        todoListId: todolist.id,
        title: newTaskTitle,
      });
    },
    [todolist.id]
  );

  const changeFilter = (
    todoListId: string,
    newFilterValue: FilterValuesType
  ) => {
    changeTodoFilter({
      todoListId: todoListId,
      newFilterValue: newFilterValue,
    });
  };

  if (todolist.filter === "completed") {
    allTodoTasks = allTodoTasks.filter(
      (t) => t.status === TaskStatuses.Completed
    );
  }
  if (todolist.filter === "active") {
    allTodoTasks = allTodoTasks.filter((t) => t.status === TaskStatuses.New);
  }

  const onAllClickHandler = useCallback(() => {
    changeFilter(todolist.id, "all");
  }, [changeFilter, todolist.id]);
  const onActiveClickHandler = useCallback(() => {
    changeFilter(todolist.id, "active");
  }, [changeFilter, todolist.id]);
  const onCompletedClickHandler = useCallback(() => {
    changeFilter(todolist.id, "completed");
  }, [changeFilter, todolist.id]);

  const removeTodo = useCallback(() => {
    // dispatch(todolistsThunks.deleteTodoTC(todolist.id));
    deleteTodoTC(todolist.id);
  }, []);

  const updTodoTitleHandler = (updTlTitle: string) => {
    updateTodoTitleTC({ todoListId: todolist.id, title: updTlTitle });
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={{ ...style, opacity: 0.5 }}>
        <Paper
          elevation={6}
          style={{
            padding: "30px",
            borderRadius: "10px",
            width: "100%",
            height: "100%",
          }}
        >
          <h3>
            <EdiatbleSpan
              oldTitle={todolist.title}
              callback={updTodoTitleHandler}
              disabled={todolist.entityStatus === "loading"}
            />
            <IconButton
              aria-label="delete"
              onClick={removeTodo}
              disabled={todolist.entityStatus === "loading"}
            >
              <DeleteIcon />
            </IconButton>
          </h3>
          <AddItemForm
            callback={addTask}
            disabled={todolist.entityStatus === "loading"}
          />
          <Skeleton>
            <div>ЛАЛАЛА</div>
          </Skeleton>
        </Paper>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Paper elevation={6} style={{ padding: "30px", borderRadius: "10px" }}>
        <h3
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "0 8px",
          }}
        >
          <EdiatbleSpan
            oldTitle={todolist.title}
            callback={updTodoTitleHandler}
            disabled={todolist.entityStatus === "loading"}
          />
          <IconButton
            aria-label="delete"
            onClick={removeTodo}
            disabled={todolist.entityStatus === "loading"}
          >
            <DeleteIcon />
          </IconButton>
        </h3>
        <AddItemForm
          callback={addTask}
          disabled={todolist.entityStatus === "loading"}
        />
        {allTodoTasks.length !== 0 ? (
          <SortableContext items={tasksIds}>
            <ul>
              {allTodoTasks.map((t) => {
                return todolist.entityStatus === "loading" ? (
                  <Skeleton key={t.id}>
                    <Task key={t.id} task={t} todoListId={todolist.id} />
                  </Skeleton>
                ) : (
                  <Task key={t.id} task={t} todoListId={todolist.id} />
                );
                // </div>
              })}
            </ul>
          </SortableContext>
        ) : todolist.showTasks ? (
          <p>Nothing to show</p>
        ) : (
          <Typography variant="h3">
            <Skeleton />
          </Typography>
        )}
        <Button
          variant={todolist.filter === "all" ? "contained" : "outlined"}
          color="primary"
          onClick={onAllClickHandler}
        >
          All
        </Button>
        <Button
          variant={todolist.filter === "active" ? "contained" : "outlined"}
          color="error"
          onClick={onActiveClickHandler}
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === "completed" ? "contained" : "outlined"}
          color="success"
          onClick={onCompletedClickHandler}
        >
          Completed
        </Button>
      </Paper>
    </div>
  );
});

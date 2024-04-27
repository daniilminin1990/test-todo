import React, { useCallback, useState } from "react";
import { AddItemForm } from "../../../../common/components/AddItemForm/AddItemForm";
import EdiatbleSpan from "../../../../common/components/EditableSpan/EdiatbleSpan";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import { tasksSelectors } from "../../../../redux/tasksSlice";
import { Task } from "./Task/Task";
import { FilterValuesType, TodoUIType } from "../../../../redux/todolistsSlice";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Skeleton from "@mui/material/Skeleton";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { ServerResponseStatusType } from "../../../../redux/appSlice";
import { TaskStatuses } from "../../../../common/enums/enums";
import { useActions } from "../../../../common/hooks/useActions";
import { FilterTasksButton } from "./FilterTasksButton";
import { TodolistTitle } from "./TodolistTitle/TodolistTitle";

type Props = {
  todoList: TodoUIType;
};

export const Todolist = React.memo(({ todoList }: Props) => {
  const { addTaskTC, reorderTasksTC } = useActions();

  let allTodoTasks = useAppSelector((state) => tasksSelectors.tasksById(state, todoList.id));

  // Region
  const [taskIdToDrag, setTaskIdToDrag] = useState<string>("");
  function dragStartHandler(e: React.DragEvent<HTMLDivElement>, startDragId: string) {
    e.stopPropagation();
    setTaskIdToDrag(startDragId);
    console.log("DRAGGING-ID", startDragId);
  }

  function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dropHandler(e: React.DragEvent<HTMLDivElement>, endShiftId: string) {
    e.stopPropagation();
    e.preventDefault();
    reorderTasksTC({
      todoListId: todoList.id,
      startDragId: taskIdToDrag,
      endShiftId: endShiftId,
    });
  }
  // End

  const addTask = useCallback(
    (newTaskTitle: string) => {
      addTaskTC({
        todoListId: todoList.id,
        title: newTaskTitle,
      });
    },
    [todoList.id]
  );

  if (todoList.filter === "completed") {
    allTodoTasks = allTodoTasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  if (todoList.filter === "active") {
    allTodoTasks = allTodoTasks.filter((t) => t.status === TaskStatuses.New);
  }

  return (
    <Paper elevation={6} style={{ padding: "30px", borderRadius: "10px" }}>
      <TodolistTitle todoList={todoList} />
      <AddItemForm callback={addTask} disabled={todoList.entityStatus === "loading"} />
      {allTodoTasks.length !== 0 ? (
        <ul>
          {allTodoTasks.map((t) => {
            return (
              <div
                key={t.id}
                draggable={true}
                onDragStart={(e) => dragStartHandler(e, t.id)}
                onDragLeave={(e) => dragEndHandler(e)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => dropHandler(e, t.id)}
              >
                {todoList.entityStatus === "loading" ? (
                  <Skeleton key={t.id}>
                    <Task key={t.id} task={t} todoListId={todoList.id} />
                  </Skeleton>
                ) : (
                  <Task key={t.id} task={t} todoListId={todoList.id} />
                )}
              </div>
            );
          })}
        </ul>
      ) : todoList.showTasks ? (
        <p>Nothing to show</p>
      ) : (
        <Typography variant="h3">
          <Skeleton />
        </Typography>
      )}
      <FilterTasksButton todoList={todoList} />
    </Paper>
  );
});

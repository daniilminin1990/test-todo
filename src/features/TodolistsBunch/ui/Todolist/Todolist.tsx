import React, { useCallback, useMemo, useState } from "react";
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
import { appSelectors, ServerResponseStatusType } from "../../../../redux/appSlice";
import { TaskStatuses } from "../../../../common/enums/enums";
import { useActions } from "../../../../common/hooks/useActions";
import { FilterTasksButton } from "./FilterTasksButton";
import { TodolistTitle } from "./TodolistTitle/TodolistTitle";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSelector } from "react-redux";

type Props = {
  todolist: TodoUIType;
};

export const Todolist = React.memo(({ todolist }: Props) => {
  const { addTaskTC, reorderTaskTC, deleteTaskTC, updateTaskTC, deleteTodoTC, changeTodoFilter, updateTodoTitleTC } = useActions();

  let allTodoTasks = useAppSelector((state) => tasksSelectors.tasksById(state, todolist.id));
  const isBlockDragMode = useSelector(appSelectors.isBlockDragMode);

  // // Region
  // const [taskIdToDrag, setTaskIdToDrag] = useState<string>("");
  // function dragStartHandler(e: React.DragEvent<HTMLDivElement>, startDragId: string) {
  //   e.stopPropagation();
  //   setTaskIdToDrag(startDragId);
  //   console.log("DRAGGING-ID", startDragId);
  // }
  //
  // function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {
  //   e.stopPropagation();
  // }
  //
  // function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
  //   e.stopPropagation();
  //   e.preventDefault();
  // }
  //
  // function dropHandler(e: React.DragEvent<HTMLDivElement>, endShiftId: string) {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   reorderTasksTC({
  //     todoListId: todoList.id,
  //     startDragId: taskIdToDrag,
  //     endShiftId: endShiftId,
  //   });
  // }
  // // End

  let tasksIds = useMemo(() => allTodoTasks.map((task) => task.id), [allTodoTasks]);
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: todolist.id,
    data: {
      type: "Todolist",
      todolist,
    },
    disabled: isBlockDragMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const addTask = useCallback(
    (newTaskTitle: string) => {
      return addTaskTC({
        todoListId: todolist.id,
        title: newTaskTitle,
      }).unwrap();
    },
    [todolist.id]
  );

  if (todolist.filter === "completed") {
    allTodoTasks = allTodoTasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  if (todolist.filter === "active") {
    allTodoTasks = allTodoTasks.filter((t) => t.status === TaskStatuses.New);
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Paper elevation={6} style={{ padding: "30px", borderRadius: "10px" }}>
        <TodolistTitle todoList={todolist} />
        <AddItemForm callback={addTask} disabled={todolist.entityStatus === "loading"} />
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
        <FilterTasksButton todoList={todolist} />
      </Paper>
    </div>
  );
});

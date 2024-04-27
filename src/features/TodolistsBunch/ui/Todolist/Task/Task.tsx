import React, { ChangeEvent, useCallback } from "react";
import EdiatbleSpan from "../../../../../common/components/EditableSpan/EdiatbleSpan";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { ServerResponseStatusType } from "../../../../../redux/appSlice";
import { TaskStatuses } from "../../../../../common/enums/enums";
import { styled } from "styled-components";
import { useActions } from "../../../../../common/hooks/useActions";
import { TasksWithEntityStatusType } from "../../../../../redux/tasksSlice";
import s from "./Task.module.css";

type Props = {
  todoListId: string;
  task: TasksWithEntityStatusType;
};

export const Task = ({ task, todoListId }: Props) => {
  const { deleteTaskTC, updateTaskTC } = useActions();

  const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let checkToGo = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTaskTC({
      todoListId,
      taskId: task.id,
      model: { status: checkToGo },
    });
  };

  const onRemoveTaskHandler = () => {
    deleteTaskTC({ todoListId, taskId: task.id });
  };

  const onUpdTaskTitleHandler = (updTaskTitle: string) => {
    updateTaskTC({
      todoListId,
      taskId: task.id,
      model: { title: updTaskTitle },
    });
  };

  const isTaskCompleted = task.status === TaskStatuses.Completed;

  return (
    <li className={isTaskCompleted ? s.isDone : ""}>
      <input type="checkbox" checked={isTaskCompleted} onChange={onChangeTaskStatusHandler} disabled={task.entityStatus === "loading"} />
      <EdiatbleSpan oldTitle={task.title} callback={onUpdTaskTitleHandler} disabled={task.entityStatus === "loading"} />
      <IconButton aria-label="delete" onClick={onRemoveTaskHandler} disabled={task.entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </li>
  );
};

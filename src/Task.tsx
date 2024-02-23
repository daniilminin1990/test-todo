import React, { ChangeEvent, useCallback } from 'react';
import EdiatbleSpan from "./EdiatbleSpan";
import { addTaskAC, changeTaskStatusAC, removeTaskAC, updTaskTitleAC } from "./redux/tasksReducer";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

export type TaskProps = {
  taskId: string,
  tIsDone: boolean,
  oldTitle: string,
  onChange: (taskId: string, checked: boolean) => void
  onClick: (taskId: string) => void
  updTaskTitle: (taskId: string, updTaskTitle: string) => void
}

export const Task = React.memo((props: TaskProps) => {

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let checked = e.currentTarget.checked
    props.onChange(props.taskId, checked)
  }
  const onClickHandler = () => {
    props.onClick(props.taskId)
  }

  const updTaskTitleHandler = (updTaskTitle: string) => {
    props.updTaskTitle(props.taskId, updTaskTitle)
  }

  return (
    <li className={props.tIsDone ? 'is-done' : ''}>
      <input type="checkbox" checked={props.tIsDone} onChange={onChangeHandler} />
      <EdiatbleSpan oldTitle={props.oldTitle} callback={updTaskTitleHandler} />
      <IconButton aria-label="delete" onClick={onClickHandler}>
        <DeleteIcon />
      </IconButton>
    </li>
  );
});

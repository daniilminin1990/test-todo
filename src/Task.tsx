import React, {ChangeEvent} from 'react';
import EdiatbleSpan from "./EdiatbleSpan";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {TasksStatuses} from "./api/tasks-api";

export type TaskProps = {
  taskId: string,
  tIsDone: TasksStatuses,
  oldTitle: string,
  onChange: (taskId: string, checked: TasksStatuses) => void
  onClick: (taskId: string) => void
  updTaskTitle: (taskId: string, updTaskTitle: string) => void
}

export const Task = React.memo((props: TaskProps) => {

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let checkedEvent = e.currentTarget.checked
    // let checked = () => {
    //   if (checkedEvent === true) {
    //     return TasksStatuses.Completed
    //   } else {
    //     return TasksStatuses.New
    //   }
    // }
    // props.onChange(props.taskId, checked())
    props.onChange(props.taskId, checkedEvent ? TasksStatuses.Completed : TasksStatuses.New)
  }
  const onClickHandler = () => {
    props.onClick(props.taskId)
  }

  const updTaskTitleHandler = (updTaskTitle: string) => {
    props.updTaskTitle(props.taskId, updTaskTitle)
  }

  const taskCompleted = props.tIsDone === TasksStatuses.Completed
  return (
    <li className={taskCompleted ? 'is-done' : ''}>
      <input type="checkbox" checked={taskCompleted} onChange={onChangeHandler} />
      <EdiatbleSpan oldTitle={props.oldTitle} callback={updTaskTitleHandler} />
      <IconButton aria-label="delete" onClick={onClickHandler}>
        <DeleteIcon />
      </IconButton>
    </li>
  );
});

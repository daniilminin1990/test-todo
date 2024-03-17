import React, {ChangeEvent} from 'react';
import EdiatbleSpan from "../../../../components/EdiatbleSpan";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {TasksStatuses} from "../../../../api/tasks-api";
import {ServerResponseStatusType} from "../../../../redux/appReducer";

export type TaskProps = {
  taskId: string,
  tIsDone: TasksStatuses,
  oldTitle: string,
  entityStatus?: ServerResponseStatusType
  onChange: (taskId: string, checked: TasksStatuses) => void
  onClick: (taskId: string) => void
  updTaskTitle: (taskId: string, updTaskTitle: string) => void
}

export const Task = React.memo((props: TaskProps) => {

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let checkToGo = e.currentTarget.checked ? TasksStatuses.Completed : TasksStatuses.New
    // let checked = () => {
    //   if (checkedEvent === true) {
    //     return TasksStatuses.Completed
    //   } else {
    //     return TasksStatuses.New
    //   }
    // }
    // props.onChange(props.taskId, checked())
    console.log(checkToGo)
    props.onChange(props.taskId, checkToGo)
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
      <input type="checkbox" checked={taskCompleted} onChange={onChangeHandler} disabled={props.entityStatus === 'loading'}/>
      <EdiatbleSpan oldTitle={props.oldTitle} callback={updTaskTitleHandler} disabled={props.entityStatus === 'loading'}/>
      <IconButton aria-label="delete" onClick={onClickHandler} disabled={props.entityStatus === 'loading'}>
        <DeleteIcon />
      </IconButton>
    </li>
  );
});

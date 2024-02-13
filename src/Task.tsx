import React, {ChangeEvent, useCallback} from 'react';
import EdiatbleSpan from "./EdiatbleSpan";
import {addTaskAC, changeTaskStatusAC, removeTaskAC, updTaskTitleAC} from "./redux/tasksReducer";

type TaskProps = {
  taskId: string,
  tIsDone: boolean,
  oldTitle: string,
  onChange: (taskId: string, checked: boolean)=>void
  onClick: (taskId: string)=>void
  updTaskTitle: (taskId: string, updTaskTitle: string)=>void
}

export const Task =  React.memo ((props: TaskProps) =>{

const onChangeHandler = (e: ChangeEvent<HTMLInputElement>)=>{
  let checked = e.currentTarget.checked
  props.onChange(props.taskId, checked)
}
const onClickHandler = () => {
  props.onClick(props.taskId)
}

const updTaskTitleHandler = (updTaskTitle: string) => {
  props.updTaskTitle( props.taskId, updTaskTitle)
}


  return (
    <li>
      <input type="checkbox" checked={props.tIsDone} onChange={onChangeHandler}/>
      {/*<span>{t.taskTitle}</span>*/}
      <EdiatbleSpan oldTitle={props.oldTitle} callback={updTaskTitleHandler}/>
      <button onClick={onClickHandler}>x</button>
    </li>
  );
});

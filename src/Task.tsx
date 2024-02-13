import React, {ChangeEvent} from 'react';
import EdiatbleSpan from "./EdiatbleSpan";

type TaskProps = {
  taskId: string,
  tIsDone: boolean,
  oldTitle: string,
  onChange: (checked: boolean)=>void
  onClick: ()=>void
  updTaskTitle: (updTaskTitle: string)=>void
}

export const Task = (props: TaskProps) => React.memo (()=>{

const onChangeHandler = (e: ChangeEvent<HTMLInputElement>)=>{
  let checked = e.currentTarget.checked
  props.onChange(checked)
}
const onClickHandler = () => {
  props.onClick()
}

const updTaskTitleHandler = (updTaskTitle: string) => {
  props.updTaskTitle(updTaskTitle)
}


  return (
    <li className={props.tIsDone ? 'is-done' : ''}>
      <input type="checkbox" checked={props.tIsDone} onChange={onChangeHandler}/>
      {/*<span>{t.taskTitle}</span>*/}
      <EdiatbleSpan oldTitle={props.oldTitle} callback={updTaskTitleHandler}/>
      <button onClick={onClickHandler}>x</button>
    </li>
  );
});

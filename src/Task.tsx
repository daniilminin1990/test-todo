import React, { ChangeEvent, useCallback } from 'react'
import { EditableSpan } from './EditableSpan'

export type TaskProps = {
  taskId: string,
  taskIsDone: boolean,
  taskTitle: string,
  changeTaskStatus: (taskId: string, taskStatus: boolean) => void
  removeTask: (taskId: string) => void
  updTaskTitle: (taskId: string, newTaskTitle: string) => void
}

const Task = ({ changeTaskStatus, removeTask, updTaskTitle, ...props }: TaskProps) => {
  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let checked = e.currentTarget.checked
    changeTaskStatus(props.taskId, checked)
  }, [changeTaskStatus, props.taskId])
  const onClickHandler = useCallback(() => {
    removeTask(props.taskId)
  }, [removeTask, props.taskId])

  const updTaskTitleHandler = useCallback((newTaskTitle: string) => {
    updTaskTitle(props.taskId, newTaskTitle)
  }, [updTaskTitle, props.taskId])
  return (
    <li key={props.taskId} className={props.taskId ? 'is-done' : ''}>
      <input type="checkbox" checked={props.taskIsDone} onChange={onChangeHandler} />
      {/* <span>{t.taskTitle}</span> */}
      <EditableSpan oldTitle={props.taskTitle} callbackUpdTitle={updTaskTitleHandler} />
      <button onClick={onClickHandler}>x</button>
    </li>
  )
}

export default Task
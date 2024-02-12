import React, { ChangeEvent } from 'react'
import { FilterValuesType, TaskType } from './App'
import {AddItemForm} from "./AddItemForm";
import EditableSpan from "./EditableSpan";

type TodolistProps = {
  todoTitle: string,
  tasks: TaskType[]
  tasksFilter: FilterValuesType
  todolistId: string
  changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
  removeTask: (todolistId: string, taskId: string) => void
  changeFilter: (todolistId: string, newTasksFilterValue: FilterValuesType) => void
  addTask: (todolistId: string, newTaskTitle: string) => void
  removeTodo: (todolistId: string) => void
  updateTodoTitle: (todolistId: string, updTodoTitle: string) => void
  updateTaskTitle: (todolistId: string, taskId: string, updTaskTitle: string) => void
}

export const Todolist = (props: TodolistProps) => {
  const callbackAddTaskHandler = (newTitle: string) => {
    props.addTask(props.todolistId, newTitle)
  }

  const onAllClickHandler = () => { props.changeFilter(props.todolistId,'all') }
  const onActiveClickHandler = () => { props.changeFilter(props.todolistId,'active') }
  const onCompletedClickHandler = () => { props.changeFilter(props.todolistId,'completed') }

  const updateTodoTitleHandler = (updTodoTitle: string) => {
    props.updateTodoTitle(props.todolistId, updTodoTitle)
  }

  const updateTaskTitleHandlerToApp = (taskId: string, updTaskTitle: string) => {
    props.updateTaskTitle(props.todolistId, taskId, updTaskTitle)
  }
  return (
    <div>
      <h3>
        <EditableSpan oldTitle={props.todoTitle} callback={updateTodoTitleHandler}/>
        <button onClick={()=> {props.removeTodo(props.todolistId)}}>x</button>
      </h3>
      <AddItemForm callback={callbackAddTaskHandler} />
      {props.tasks.length === 0
        ? <p>Nothing to show</p>
        : <ul>
          {
            props.tasks.map(t => {
              const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                let checked = e.currentTarget.checked
                props.changeTaskStatus(props.todolistId,t.id, checked)
              }
              const onClickHandler = () => {
                props.removeTask(props.todolistId,t.id)
              }

              const updateTaskTitleHandler = (updTaskTitle: string) => {
                updateTaskTitleHandlerToApp(t.id, updTaskTitle)
              }
              return (
                <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                  <input type="checkbox" checked={t.isDone} onChange={onChangeHandler} />
                  <EditableSpan oldTitle={t.taskTitle} callback={updateTaskTitleHandler}/>
                  <button onClick={onClickHandler}>x</button>
                </li>
              )
            })
          }
        </ul>}
      <button className={props.tasksFilter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</button>
      <button className={props.tasksFilter === 'active' ? 'active-filter' : ''} onClick={onActiveClickHandler}>Active</button>
      <button className={props.tasksFilter === 'completed' ? 'active-filter' : ''} onClick={onCompletedClickHandler}>Completed</button>
    </div>
  )
}

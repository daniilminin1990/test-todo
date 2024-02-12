import React, {ChangeEvent} from 'react'
import {FilterValuesType, TaskType} from './App'
import {AddItemForm} from "./AddItemForm";
import EdiatbleSpan from "./EdiatbleSpan";

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
  updTodoTitle: (todolistId: string, updTodoTitle: string)=> void
  updTaskTitle: (todolistId: string, taskId: string, updTaskTitle: string) => void
}

export const Todolist = (props: TodolistProps) => {

  const onAllClickHandler = () => { props.changeFilter(props.todolistId,'all') }
  const onActiveClickHandler = () => { props.changeFilter(props.todolistId,'active') }
  const onCompletedClickHandler = () => { props.changeFilter(props.todolistId,'completed') }

  const addTaskHandler=(newTodolTitle: string) => {
    props.addTask(props.todolistId, newTodolTitle)
  }

  const updTodoTitleHandler = (updTlTitle: string) => {
    props.updTodoTitle(props.todolistId, updTlTitle)
  }


  return (
    <div>
      <h3>
        {/*<span>{props.todoTitle}</span>*/}
        <EdiatbleSpan oldTitle={props.todoTitle} callback={updTodoTitleHandler}/>
        <button onClick={()=> {props.removeTodo(props.todolistId)}}>x</button>
      </h3>
      <AddItemForm callback={addTaskHandler} />
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

              const updTaskTitleHandler = (updTaskTitle: string) => {
                props.updTaskTitle(props.todolistId, t.id, updTaskTitle)
              }
              return (
                <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                  <input type="checkbox" checked={t.isDone} onChange={onChangeHandler} />
                  {/*<span>{t.taskTitle}</span>*/}
                  <EdiatbleSpan oldTitle={t.taskTitle} callback={updTaskTitleHandler}/>
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

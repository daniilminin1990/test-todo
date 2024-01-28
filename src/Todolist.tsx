import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { TaskStatusFilter, TaskType } from './App'

type TodolistProps = {
  todoTitle: string,
  tasks: TaskType[]
  changeTaskStatus: (taskId: string, isDone: boolean) => void
  removeTask: (taskId: string) => void
  changeTasksFilter: (newTasksFilterValue: TaskStatusFilter) => void
  addTask: (newTaskTitle: string) => void
}

export const Todolist = (props: TodolistProps) => {

  const [newTaskTitle, setNewTaskTitle] = useState<string>('')

  const onClickAddTaskHandler = () => {
    props.addTask(newTaskTitle)
    setNewTaskTitle('')
  }
  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value)
  }
  const onEnterAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && onClickAddTaskHandler()
  }

  return (

    <div>
      <h3>
        <span>{props.todoTitle}</span>
        <button>x</button>
      </h3>
      <input value={newTaskTitle} onChange={onNewTitleChangeHandler} onKeyDown={onEnterAddTask} />
      <button onClick={onClickAddTaskHandler}>+</button>
      {props.tasks.length === 0
        ? <p>Nothing to show</p>
        : <ul>
          {
            props.tasks.map(t => {
              const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                let checked = e.currentTarget.checked
                props.changeTaskStatus(t.id, checked)
              }
              const onClickHandler = () => {
                props.removeTask(t.id)
              }
              return (
                <li key={t.id}>
                  <input type="checkbox" checked={t.isDone} onChange={onChangeHandler} />
                  <span>{t.taskTitle}</span>
                  <button onClick={onClickHandler}>x</button>
                </li>
              )
            })
          }
        </ul>}
      <button onClick={() => props.changeTasksFilter('all')}>All</button>
      <button onClick={() => props.changeTasksFilter('active')}>Active</button>
      <button onClick={() => props.changeTasksFilter('completed')}>Completed</button>
    </div>
  )
}

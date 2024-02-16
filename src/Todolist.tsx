import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { FilterValuesType, TaskType } from './App'
import { EditableSpan } from './EditableSpan'

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
  updTodoTitle: (todolistId: string, newTodoTitle: string) => void
  updTaskTitle: (todolistId: string, taskId: string, newTaskTitle: string) => void
}

export const Todolist = (props: TodolistProps) => {
  let allTasks = props.tasks
  if (props.tasksFilter === 'completed') {
    allTasks = allTasks.filter(t => t.isDone)
  }
  if (props.tasksFilter === 'active') {
    allTasks = allTasks.filter(t => !t.isDone)
  }
  // State для нового названия task
  const [newTaskTitle, setNewTaskTitle] = useState<string>('')
  // State для ошибки
  const [error, setError] = useState<string | null>(null)

  const onClickAddTaskHandler = () => {
    if (newTaskTitle.trim() !== '') {
      props.addTask(props.todolistId, newTaskTitle.trim())
      setNewTaskTitle('')
      setError('')
    } else {
      setNewTaskTitle('')
      setError('Title is required')
    }
  }
  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const titleTyping = e.currentTarget.value
    setNewTaskTitle(titleTyping)
    titleTyping.length !== 0 && setError('')
  }
  const onEnterAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && onClickAddTaskHandler()
  }

  const onAllClickHandler = () => { props.changeFilter(props.todolistId, 'all') }
  const onActiveClickHandler = () => { props.changeFilter(props.todolistId, 'active') }
  const onCompletedClickHandler = () => { props.changeFilter(props.todolistId, 'completed') }

  const updTodoTitle = (newTodoTitle: string) => {
    props.updTodoTitle(props.todolistId, newTodoTitle)
  }
  return (
    <div>
      <h3>
        {/* <span>{props.todoTitle}</span> */}
        <EditableSpan oldTitle={props.todoTitle} callbackUpdTitle={updTodoTitle} />
        <button onClick={() => { props.removeTodo(props.todolistId) }}>x</button>
      </h3>
      <input
        value={newTaskTitle}
        onChange={onNewTitleChangeHandler}
        onKeyDown={onEnterAddTask}
        className={error ? 'error' : ''}
      />
      <button onClick={onClickAddTaskHandler}>+</button>
      {error && <div className={'error-message'}>Title is required</div>}
      {allTasks.length === 0
        ? <p>Nothing to show</p>
        : <ul>
          {
            allTasks.map(t => {
              const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                let checked = e.currentTarget.checked
                props.changeTaskStatus(props.todolistId, t.id, checked)
              }
              const onClickHandler = () => {
                props.removeTask(props.todolistId, t.id)
              }

              const updTaskTitle = (newTaskTitle: string) => {
                props.updTaskTitle(props.todolistId, t.id, newTaskTitle)
              }
              return (
                <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                  <input type="checkbox" checked={t.isDone} onChange={onChangeHandler} />
                  {/* <span>{t.taskTitle}</span> */}
                  <EditableSpan oldTitle={t.taskTitle} callbackUpdTitle={updTaskTitle} />
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

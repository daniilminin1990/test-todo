import React, { ChangeEvent, KeyboardEvent, memo, useCallback, useState } from 'react'
import { FilterValuesType, TaskStateType, TaskType } from './App'
import { EditableSpan } from './EditableSpan'
import { AddItemForm } from './AddItemForm'
import { useSelector } from 'react-redux'
import { RootStoreType } from './store/store'
import { useDispatch } from 'react-redux'
import { addTaskAC, changeTaskStatusAC, removeTaskAC, updTaskTitleAC } from './redux/tasksReducer'
import Task from './Task'
import { changeFilterAC } from './redux/todolistsReducer'
//
type TodolistProps = {
  todoTitle: string,
  tasksFilter: FilterValuesType
  todolistId: string
  allTasks: TaskType[]
  // changeFilter: (todolistId: string, newTasksFilterValue: FilterValuesType) => void
  removeTodo: (todolistId: string) => void
  updTodoTitle: (todolistId: string, newTodoTitle: string) => void
}

export const Todolist = memo(({ updTodoTitle, removeTodo, ...props }: TodolistProps) => {
  console.log('Todolist')
  // const tasks = useSelector<RootStoreType, TaskStateType>(state => state.tasksReducer)
  const dispatch = useDispatch()

  let allTlTasks = props.allTasks
  if (props.tasksFilter === 'completed') {
    allTlTasks = allTlTasks.filter(t => t.isDone)
  }
  if (props.tasksFilter === 'active') {
    allTlTasks = allTlTasks.filter(t => !t.isDone)
  }

  // let allTasks = tasks[props.todolistId]
  // if (props.tasksFilter === 'completed') {
  //   allTasks = allTasks.filter(t => t.isDone)
  // }
  // if (props.tasksFilter === 'active') {
  //   allTasks = allTasks.filter(t => !t.isDone)
  // }

  // Удаление задачи
  const removeTask = useCallback((taskId: string) => {
    dispatch(removeTaskAC(props.todolistId, taskId))
  }, [dispatch, props.todolistId])
  // Добавление задачи
  const addTask = useCallback((newTaskTitle: string) => {
    dispatch(addTaskAC(props.todolistId, newTaskTitle))
  }, [dispatch, props.todolistId])
  const changeFilter = useCallback((newFilterValue: FilterValuesType) => {
    dispatch(changeFilterAC(props.todolistId, newFilterValue))
  }, [dispatch, props.todolistId])
  // Изменение статуса задачи
  const changeTaskStatus = useCallback((taskId: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC(props.todolistId, taskId, isDone))
  }, [dispatch, props.todolistId])
  const updTaskTitle = useCallback((taskId: string, newTaskTitle: string) => {
    dispatch(updTaskTitleAC(props.todolistId, taskId, newTaskTitle))
  }, [dispatch, props.todolistId])

  // const onAllClickHandler = () => { props.changeFilter(props.todolistId, 'all') }
  // const onActiveClickHandler = () => { props.changeFilter(props.todolistId, 'active') }
  // const onCompletedClickHandler = () => { props.changeFilter(props.todolistId, 'completed') }
  const onAllClickHandler = () => { changeFilter('all') }
  const onActiveClickHandler = () => { changeFilter('active') }
  const onCompletedClickHandler = () => { changeFilter('completed') }

  const updTodoTitleHandler = useCallback((newTodoTitle: string) => {
    updTodoTitle(props.todolistId, newTodoTitle)
  }, [updTodoTitle, props.todolistId])

  const removeTodoHandler = useCallback(() => {
    removeTodo(props.todolistId)
  }, [removeTodo, props.todolistId])

  return (
    <div>
      <h3>
        <EditableSpan oldTitle={props.todoTitle} callbackUpdTitle={updTodoTitleHandler} />
        <button onClick={removeTodoHandler}>x</button>
      </h3>
      <AddItemForm callback={addTask} />
      {/* // {allTasks.length === 0 */}
      {allTlTasks.length === 0
        ? <p>Nothing to show</p>
        : <ul>
          {
            // allTasks.map(t => {
            allTlTasks.map(t => {
              return <Task
                key={t.id}
                taskId={t.id}
                taskIsDone={t.isDone}
                taskTitle={t.taskTitle}
                changeTaskStatus={changeTaskStatus}
                removeTask={removeTask}
                updTaskTitle={updTaskTitle}
              />
            })
          }
        </ul>}
      <button className={props.tasksFilter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</button>
      <button className={props.tasksFilter === 'active' ? 'active-filter' : ''} onClick={onActiveClickHandler}>Active</button>
      <button className={props.tasksFilter === 'completed' ? 'active-filter' : ''} onClick={onCompletedClickHandler}>Completed</button>
    </div>
  )
})

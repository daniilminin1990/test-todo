import React, { useCallback } from 'react'
import { FilterValuesType, TaskType } from './App'
import { AddItemForm } from "./AddItemForm";
import EdiatbleSpan from "./EdiatbleSpan";
import { useDispatch } from "react-redux";
import { addTaskAC, changeTaskStatusAC, removeTaskAC, updTaskTitleAC } from "./redux/tasksReducer";
import { Task } from "./Task";
import { removeTodoAC } from "./redux/todolistReducer";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

type TodolistProps = {
  todoTitle: string,
  tasks: TaskType[]
  tasksFilter: FilterValuesType
  todolistId: string
  changeFilter: (todolistId: string, newTasksFilterValue: FilterValuesType) => void
  updTodoTitle: (todolistId: string, updTodoTitle: string) => void
}

export const Todolist = React.memo(({ updTodoTitle, changeFilter, ...props }: TodolistProps) => {
  console.log('Todolist')
  const dispatch = useDispatch()

  const removeTask = useCallback((taskId: string) => {
    dispatch(removeTaskAC(props.todolistId, taskId))
  }, [dispatch, props.todolistId])

  const addTask = useCallback((newTodolTitle: string) => {
    dispatch(addTaskAC(props.todolistId, newTodolTitle))
  }, [dispatch, props.todolistId])

  const changeTaskStatus = useCallback((taskId: string, checked: boolean) => {
    dispatch(changeTaskStatusAC(props.todolistId, taskId, checked))
  }, [dispatch, props.todolistId])

  const updTaskTitle = useCallback((taskId: string, updTaskTitle: string) => {
    dispatch(updTaskTitleAC(props.todolistId, taskId, updTaskTitle))
  }, [dispatch, props.todolistId])

  if (props.tasksFilter === 'completed') {
    props.tasks = props.tasks.filter(t => t.isDone)
  }
  if (props.tasksFilter === 'active') {
    props.tasks = props.tasks.filter(t => !t.isDone)
  }

  const onAllClickHandler = useCallback(() => { changeFilter(props.todolistId, 'all') }, [changeFilter, props.todolistId])
  const onActiveClickHandler = useCallback(() => { changeFilter(props.todolistId, 'active') }, [changeFilter, props.todolistId])
  const onCompletedClickHandler = useCallback(() => { changeFilter(props.todolistId, 'completed') }, [changeFilter, props.todolistId])

  const removeTodo = useCallback((todolistId: string) => {
    dispatch(removeTodoAC(todolistId))
  }, [dispatch])

  const updTodoTitleHandler = useCallback((updTlTitle: string) => {
    updTodoTitle(props.todolistId, updTlTitle)
  }, [updTodoTitle, props.todolistId])

  return (
    <div>
      <h3>
        <EdiatbleSpan oldTitle={props.todoTitle} callback={updTodoTitleHandler} />
        <IconButton aria-label="delete" onClick={() => { removeTodo(props.todolistId) }}>
          <DeleteIcon />
        </IconButton>
      </h3>
      <AddItemForm callback={addTask} />
      {props.tasks.length === 0
        ? <p>Nothing to show</p>
        : <ul>
          {
            props.tasks.map(t => {
              return (
                <Task key={t.id}
                  taskId={t.id}
                  tIsDone={t.isDone}
                  oldTitle={t.taskTitle}
                  onChange={changeTaskStatus}
                  onClick={removeTask}
                  updTaskTitle={updTaskTitle}
                />
              )
            })
          }
        </ul>}
      <Button variant={props.tasksFilter === 'all' ? "contained" : 'outlined'} color='primary' onClick={onAllClickHandler}>All</Button>
      <Button variant={props.tasksFilter === 'active' ? "contained" : 'outlined'} color='error' onClick={onActiveClickHandler}>Active</Button>
      <Button variant={props.tasksFilter === 'completed' ? "contained" : 'outlined'} color='success' onClick={onCompletedClickHandler}>Completed</Button>
    </div>
  )
})

import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from "./AddItemForm";
import EdiatbleSpan from "./EdiatbleSpan";
import {useDispatch, useSelector} from "react-redux";
import {
  addTaskAC, addTaskTC,
  changeTaskStatusAC,
  deleteTaskTC,
  setTasksTC,
  updTaskTitleAC
} from "./redux/tasksReducer";
import {Task} from "./Task";
import {deleteTodoTC, FilterValuesType, removeTodoAC} from "./redux/todolistReducer";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {RootReducerType, useAppDispatch} from './store/store';
import {TasksStatuses, TaskType} from "./api/tasks-api";

type TodolistProps = {
  todoTitle: string,
  // tasks: TaskType[]
  tasksFilter: FilterValuesType
  todolistId: string
  changeFilter: (todolistId: string, newTasksFilterValue: FilterValuesType) => void
  updTodoTitle: (todolistId: string, updTodoTitle: string) => void
}

export const Todolist = React.memo(({ updTodoTitle, changeFilter, ...props }: TodolistProps) => {
  console.log('Todolist')
  let allTodoTasks = useSelector<RootReducerType, TaskType[]>((state) => state.tasksReducer[props.todolistId])
  // let allTodoTasks = tasks[props.todolistId]
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setTasksTC(props.todolistId))
  }, []);

  const removeTask = useCallback((taskId: string) => {
    dispatch(deleteTaskTC(props.todolistId, taskId))
    // dispatch(removeTaskAC(props.todolistId, taskId))
  }, [dispatch, props.todolistId])

  const addTask = useCallback((newTaskTitle: string) => {
    dispatch(addTaskTC(props.todolistId, newTaskTitle))
  }, [dispatch, props.todolistId])

  const changeTaskStatus = useCallback((taskId: string, checked: TasksStatuses) => {
    dispatch(changeTaskStatusAC(props.todolistId, taskId, checked))
  }, [dispatch, props.todolistId])

  const updTaskTitle = useCallback((taskId: string, updTaskTitle: string) => {
    dispatch(updTaskTitleAC(props.todolistId, taskId, updTaskTitle))
  }, [dispatch, props.todolistId])

  if (props.tasksFilter === 'completed') {
    allTodoTasks = allTodoTasks.filter(t => t.status === TasksStatuses.Completed)
  }
  if (props.tasksFilter === 'active') {
    allTodoTasks = allTodoTasks.filter(t => t.status === TasksStatuses.New)
  }

  const onAllClickHandler = useCallback(() => { changeFilter(props.todolistId, 'all') }, [changeFilter, props.todolistId])
  const onActiveClickHandler = useCallback(() => { changeFilter(props.todolistId, 'active') }, [changeFilter, props.todolistId])
  const onCompletedClickHandler = useCallback(() => { changeFilter(props.todolistId, 'completed') }, [changeFilter, props.todolistId])

  const removeTodo = useCallback(() => {
    dispatch(deleteTodoTC(props.todolistId))
  }, [dispatch])

  const updTodoTitleHandler = useCallback((updTlTitle: string) => {
    updTodoTitle(props.todolistId, updTlTitle)
  }, [updTodoTitle, props.todolistId])

  return (
    <div>
      <h3>
        <EdiatbleSpan oldTitle={props.todoTitle} callback={updTodoTitleHandler} />
        <IconButton aria-label="delete" onClick={removeTodo}>
          <DeleteIcon />
        </IconButton>
      </h3>
      <AddItemForm callback={addTask} />
      {allTodoTasks.length === 0
        ? <p>Nothing to show</p>
        : <ul>
          {
            allTodoTasks.map(t => {
              return (
                <Task key={t.id}
                  taskId={t.id}
                  tIsDone={t.status}
                  oldTitle={t.title}
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

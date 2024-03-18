import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from "../../../components/AddItemForm";
import EdiatbleSpan from "../../../components/EdiatbleSpan";
import {useSelector} from "react-redux";
import {
  addTaskTC,
  updateTaskTC,
  deleteTaskTC,
  setTasksTC,
  TasksWithEntityStatusType
} from "../../../redux/tasksReducer";
import {Task} from "./Task/Task";
import {deleteTodoTC, FilterValuesType} from "../../../redux/todolistReducer";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Skeleton from '@mui/material/Skeleton';
import {RootReducerType, useAppDispatch} from '../../../store/store';
import {TasksStatuses} from "../../../api/tasks-api";
import {ServerResponseStatusType} from "../../../redux/appReducer";

type TodolistProps = {
  todoTitle: string,
  // tasks: TaskType[]
  tasksFilter: FilterValuesType
  todoListId: string
  changeFilter: (todoListId: string, newTasksFilterValue: FilterValuesType) => void
  updTodoTitle: (todoListId: string, updTodoTitle: string) => void
  entityStatus: ServerResponseStatusType
  disabled: ServerResponseStatusType
}

export const Todolist = React.memo(({ updTodoTitle, changeFilter, ...props }: TodolistProps) => {
  console.log('Todolist')
  let allTodoTasks = useSelector<RootReducerType, TasksWithEntityStatusType[]>((state) => state.tasksReducer[props.todoListId])
  // let allTodoTasks = tasks[props.todoListId]
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setTasksTC(props.todoListId))
  }, []);

  const removeTask = useCallback((taskId: string) => {
    dispatch(deleteTaskTC(props.todoListId, taskId))
    // dispatch(removeTaskAC(props.todoListId, taskId))
  }, [dispatch, props.todoListId])

  const addTask = useCallback((newTaskTitle: string) => {
    dispatch(addTaskTC(props.todoListId, newTaskTitle))
  }, [dispatch, props.todoListId])

  const changeTaskStatus = useCallback((taskId: string, checked: TasksStatuses) => {
    // dispatch(changeTaskStatusAC(props.todoListId, taskId, checked))
    dispatch(updateTaskTC(props.todoListId, taskId, {status: checked}))
  }, [dispatch, props.todoListId])

  const updTaskTitle = useCallback((taskId: string, updTaskTitle: string) => {
    // dispatch(updTaskTitleAC(props.todoListId, taskId, updTaskTitle))
    dispatch(updateTaskTC(props.todoListId, taskId, {title: updTaskTitle}))
  }, [dispatch, props.todoListId])

  if (props.tasksFilter === 'completed') {
    allTodoTasks = allTodoTasks.filter(t => t.status === TasksStatuses.Completed)
  }
  if (props.tasksFilter === 'active') {
    allTodoTasks = allTodoTasks.filter(t => t.status === TasksStatuses.New)
  }

  const onAllClickHandler = useCallback(() => { changeFilter(props.todoListId, 'all') }, [changeFilter, props.todoListId])
  const onActiveClickHandler = useCallback(() => { changeFilter(props.todoListId, 'active') }, [changeFilter, props.todoListId])
  const onCompletedClickHandler = useCallback(() => { changeFilter(props.todoListId, 'completed') }, [changeFilter, props.todoListId])

  const removeTodo = useCallback(() => {
    dispatch(deleteTodoTC(props.todoListId))
  }, [dispatch])

  const updTodoTitleHandler = useCallback((updTlTitle: string) => {
    updTodoTitle(props.todoListId, updTlTitle)
  }, [updTodoTitle, props.todoListId])

  return (
    <div>
      <h3>
        <EdiatbleSpan oldTitle={props.todoTitle} callback={updTodoTitleHandler} disabled={props.disabled === 'loading'}/>
        <IconButton aria-label="delete" onClick={removeTodo} disabled={props.entityStatus === 'loading'}>
          <DeleteIcon />
        </IconButton>
      </h3>
      <AddItemForm callback={addTask} disabled={props.entityStatus === 'loading'}/>
      {allTodoTasks.length === 0
        ? <p>Nothing to show</p>
        : <ul>
          {
            allTodoTasks.map(t => {

              return (
                props.entityStatus === 'loading'
                ? <Skeleton key={t.id}><Task key={t.id}
                        taskId={t.id}
                        tIsDone={t.status}
                        oldTitle={t.title}
                        onChange={changeTaskStatus}
                        onClick={removeTask}
                        updTaskTitle={updTaskTitle}
                    />
                  </Skeleton>
                : <Task key={t.id}
                        taskId={t.id}
                        tIsDone={t.status}
                        oldTitle={t.title}
                        entityStatus = {t.entityStatus}
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

import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from "./AddItemForm";
import EdiatbleSpan from "./EdiatbleSpan";
import {useDispatch, useSelector} from "react-redux";
import {
  addTaskAC, addTaskTC,
  changeTaskStatusAC,
  deleteTaskTC,
  removeTaskAC,
  setTasksTC,
  updTaskTitleAC
} from "./redux/tasksReducer";
import {Task} from "./Task";
import {FilterValuesType, removeTodoAC} from "./redux/todolistReducer";
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
    // dispatch(addTaskAC(props.todolistId, newTodolTitle))
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

  // ! ---1--- 
  // ! Этот код не нужен. Причина в том, что фильтр меняется при нажатии на кнопку, удетает в state todolist. Затем происходит локальное изменение тасок тудулистId.
  // ! Это изменение тасок иммутабельное, мы не изменяем таски, значит ререндера для if не будет. Смысл useMemo в оптимизации, избалвение от ререндера. А тут ререндера не будет, т.к. state не изменяем
  // ! --2--
  // ! Использовать useMemo нужно только с переменной, к которой будем присваивать возвращаемый результат. Иначе useMemo будет работать в холостую, сам по себе. Либо писать UseMemo в JSX, тогда можно результат писать прямо там без переменной
  // allTodoTasks = useMemo(() => {
  //   console.log('useMemo')
  //   if (props.tasksFilter === 'completed') {
  //     allTodoTasks = allTodoTasks.filter(t => t.isDone)
  //   }
  //   if (props.tasksFilter === 'active') {
  //     allTodoTasks = allTodoTasks.filter(t => !t.isDone)
  //   }
  //   return allTodoTasks
  // }, [props.tasksFilter, allTodoTasks])
  // ? И так работает
  // useMemo(() => {
  //   console.log('useMemo')
  //   if (props.tasksFilter === 'completed') {
  //     allTodoTasks = allTodoTasks.filter(t => t.isDone)
  //   }
  //   if (props.tasksFilter === 'active') {
  //     allTodoTasks = allTodoTasks.filter(t => !t.isDone)
  //   }
  //   return allTodoTasks
  // }, [props.tasksFilter])
  // console.log(allTodoTasks)

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
        <IconButton aria-label="delete" onClick={useCallback(() => { removeTodo(props.todolistId) }, [removeTodo, props.todolistId])}>
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

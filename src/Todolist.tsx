import React, {ChangeEvent, useCallback} from 'react'
import {FilterValuesType, TaskStateType, TaskType} from './App'
import {AddItemForm} from "./AddItemForm";
import EdiatbleSpan from "./EdiatbleSpan";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "./store/store";
import {addTaskAC, changeTaskStatusAC, removeTaskAC, updTaskTitleAC} from "./redux/tasksReducer";
import {Task} from "./Task";

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

export const Todolist = ({updTodoTitle,...props}:TodolistProps) => {
  console.log('Todolist')
  const dispatch = useDispatch()
  // const tasks = useSelector<RootReducerType, TaskStateType>((state)=>state.tasksReducer)

  if (props.tasksFilter === 'completed') {
    props.tasks = props.tasks.filter(t => t.isDone)
  }
  if (props.tasksFilter === 'active') {
    props.tasks = props.tasks.filter(t => !t.isDone)
  }

  const onAllClickHandler = () => { props.changeFilter(props.todolistId,'all') }
  const onActiveClickHandler = () => { props.changeFilter(props.todolistId,'active') }
  const onCompletedClickHandler = () => { props.changeFilter(props.todolistId,'completed') }

  const addTaskHandler=useCallback((newTodolTitle: string) => {
    dispatch(addTaskAC(props.todolistId, newTodolTitle))
  }, [dispatch, props.todolistId])


  const updTodoTitleHandler = useCallback((updTlTitle: string) => {
    updTodoTitle(props.todolistId, updTlTitle)
  }, [updTodoTitle, props.todolistId])

  const onChangeCheckedHandler = useCallback((taskId: string, checked: boolean) => {
    dispatch(changeTaskStatusAC(props.todolistId,taskId, checked))
  }, [dispatch, props.todolistId])

  const onClickRemoveTask = useCallback((taskId: string)=>{
    dispatch(removeTaskAC(props.todolistId,taskId))
  }, [dispatch, props.todolistId])

  const updTaskTitleHandler = useCallback((taskId: string, updTaskTitle: string) => {
    dispatch(updTaskTitleAC(props.todolistId, taskId, updTaskTitle))
  }, [dispatch, props.todolistId])
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
              const onChangeHandlerMap = (e: ChangeEvent<HTMLInputElement>)=>{
                let checked = e.currentTarget.checked
                onChangeCheckedHandler(t.id, checked)
              }
              const onClickHandlerMap = () => {
                onClickRemoveTask(t.id)
              }

              const updTaskTitleHandlerMap = (updTaskTitle: string) => {
                updTaskTitleHandler(t.id, updTaskTitle)
              }
              // const onChangeHandlerMap = (taskChecked: boolean)=>{
              //   onChangeCheckedHandler(t.id, taskChecked)
              // }
              // const onClickHandlerMap = () => {
              //   onClickRemoveTask(t.id)
              // }
              //
              // const updTaskTitleHandlerMap = (updTaskTitle: string) => {
              //   updTaskTitleHandler(t.id, updTaskTitle)
              // }
              return (
                <li className={t.isDone ? 'is-done' : ''}>
                  <input type="checkbox" checked={t.isDone} onChange={onChangeHandlerMap}/>
                  {/*<span>{t.taskTitle}</span>*/}
                  <EdiatbleSpan oldTitle={t.taskTitle} callback={updTaskTitleHandlerMap}/>
                  <button onClick={onClickHandlerMap}>x</button>
                </li>
                // <Task key={t.id}
                //       taskId={t.id}
                //       tIsDone={t.isDone}
                //       oldTitle={t.taskTitle}
                //       onChange={onChangeHandlerMap}
                //       onClick={onClickHandlerMap}
                //       updTaskTitle={updTaskTitleHandlerMap}
                // />
              )
            })
          }
        </ul>}
      <button className={props.tasksFilter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</button>
      <button className={props.tasksFilter === 'active' ? 'active-filter' : ''} onClick={onActiveClickHandler}>Active
      </button>
      <button className={props.tasksFilter === 'completed' ? 'active-filter' : ''} onClick={onCompletedClickHandler}>Completed</button>
    </div>
  )
}

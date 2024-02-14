import React, {useCallback} from 'react'
import {FilterValuesType, TaskType} from './App'
import {AddItemForm} from "./AddItemForm";
import EdiatbleSpan from "./EdiatbleSpan";
import {useDispatch} from "react-redux";
import {addTaskAC, changeTaskStatusAC, removeTaskAC, updTaskTitleAC} from "./redux/tasksReducer";
import {Task} from "./Task";
import {removeTodoAC} from "./redux/todolistReducer";

type TodolistProps = {
  todoTitle: string,
  tasks: TaskType[]
  tasksFilter: FilterValuesType
  todolistId: string
  changeFilter: (todolistId: string, newTasksFilterValue: FilterValuesType) => void
  updTodoTitle: (todolistId: string, updTodoTitle: string)=> void
}

export const Todolist = React.memo(({updTodoTitle,changeFilter, ...props}:TodolistProps) => {
  console.log('Todolist')
  const dispatch = useDispatch()

  const removeTask = useCallback((taskId: string)=>{
    dispatch(removeTaskAC(props.todolistId,taskId))
  }, [dispatch, props.todolistId])

  const addTask=useCallback((newTodolTitle: string) => {
    dispatch(addTaskAC(props.todolistId, newTodolTitle))
  }, [dispatch, props.todolistId])

  const changeTaskStatus = useCallback((taskId: string, checked: boolean) => {
    dispatch(changeTaskStatusAC(props.todolistId,taskId, checked))
  }, [dispatch, props.todolistId])

  const updTaskTitle = useCallback((taskId: string, updTaskTitle: string) => {
    dispatch(updTaskTitleAC(props.todolistId, taskId,updTaskTitle ))
  }, [dispatch, props.todolistId])

  if (props.tasksFilter === 'completed') {
    props.tasks = props.tasks.filter(t => t.isDone)
  }
  if (props.tasksFilter === 'active') {
    props.tasks = props.tasks.filter(t => !t.isDone)
  }

  const onAllClickHandler = useCallback(() => {changeFilter(props.todolistId,'all') }, [changeFilter, props.todolistId]  )
  const onActiveClickHandler = useCallback(() => { changeFilter(props.todolistId,'active') }, [changeFilter, props.todolistId])
  const onCompletedClickHandler = useCallback(() => { changeFilter(props.todolistId,'completed') }, [changeFilter, props.todolistId])

  const removeTodo = useCallback((todolistId: string) => {
    dispatch(removeTodoAC(todolistId))
  }, [dispatch])

  const updTodoTitleHandler = useCallback((updTlTitle: string) => {
    updTodoTitle(props.todolistId, updTlTitle)
  }, [updTodoTitle, props.todolistId])

  return (
    <div>
      <h3>
        {/*<span>{props.todoTitle}</span>*/}
        <EdiatbleSpan oldTitle={props.todoTitle} callback={updTodoTitleHandler}/>
        <button onClick={()=> {removeTodo(props.todolistId)}}>x</button>
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
      <button className={props.tasksFilter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</button>
      <button className={props.tasksFilter === 'active' ? 'active-filter' : ''} onClick={onActiveClickHandler}>Active
      </button>
      <button className={props.tasksFilter === 'completed' ? 'active-filter' : ''} onClick={onCompletedClickHandler}>Completed</button>
    </div>
  )
})

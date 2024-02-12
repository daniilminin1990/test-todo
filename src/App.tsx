import React, {useState} from 'react';
import './App.css';
import {v1} from 'uuid';
import {Todolist} from './Todolist';
import {AddItemForm} from "./AddItemForm";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "./store/store";
import {addTaskAC, changeTaskStatusAC, removeTaskAC, updTaskTitleAC} from "./redux/tasksReducer";
import {addTodoAC, changeFilterAC, removeTodoAC, updateTodoTitleAC} from "./redux/todolistReducer";

// тип task status
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoType = {id: string, title: string, filter: FilterValuesType}
export type TaskType = { id: string, taskTitle: string, isDone: boolean,}
export type TaskStateType = {[todolistId: string]: TaskType[]}


function App() {
  const dispatch = useDispatch()
  const todolists = useSelector<RootReducerType, TodoType[]>((state)=>state.todolistReducer)
  const tasks = useSelector<RootReducerType, TaskStateType>((state)=>state.tasksReducer)

  // Удаление задачи
  const removeTask = (todolistId: string, taskId: string) => {
    // setTasks(tasks.filter(t => t.id !== taskId))
    // setTasks({...tasks, [todolistId]:tasks[todolistId].filter(t => t.id !== taskId)})
    dispatch(removeTaskAC(todolistId, taskId))
  }


  // Фильтрация задач
  const changeFilter = (todolistId: string, newFilterValue: FilterValuesType) => {
    // setTasksFilter(newFilterValue)
    // setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, filter: newFilterValue} : tl))
    dispatch(changeFilterAC(todolistId,newFilterValue))
  }

  // Добавление задачи
  const addTask = (todolistId: string, newTaskTitle: string) => {
    let newTask: TaskType = { id: v1(), taskTitle: newTaskTitle, isDone: false }
    // setTasks([newTask, ...tasks])
    // setTasks({...tasks, [todolistId]:[newTask, ...tasks[todolistId]]})
    dispatch(addTaskAC(todolistId,newTaskTitle ))
  }

  // Изменение статуса задачи
  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    // setTasks(tasks.map(t => t.id === taskId ? { ...t, isDone } : t))
    // setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, isDone} : t)})
    dispatch(changeTaskStatusAC(todolistId,taskId, isDone))
  }

  const removeTodo = (todolistId: string) => {
    // setTodolists(todolists.filter(tl => tl.id !== todolistId))
    dispatch(removeTodoAC(todolistId))
    // const {[todolistId]:rrr, ...rest} = tasks
    // setTasks(rest)
    // const copyTasks = {...tasks}
      // delete copyTasks[todolistId]
    // setTasks(copyTasks)
  }

  const addTodo = (newTodoTitle: string)=> {
    const newTodolistId = v1()
    // const newTodo: TodoType = {id: newTodolistId, title: newTodoTitle, filter: 'all'}
    dispatch(addTodoAC(newTodolistId, newTodoTitle))
    // setTodolists([newTodo, ...todolists])
    // setTasks({...tasks, [newTodolistId]:[]})
  }

  const addTodoTitleHandler = (newTodoTitle: string) => {
    addTodo(newTodoTitle)
  }

  const updTodoTitle = (todolistId: string, updTodoTitle: string) => {
    // setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, title: updTodoTitle} : tl))
    dispatch(updateTodoTitleAC(todolistId, updTodoTitle))
  }
  const updTaskTitle = (todolistId: string, taskId: string, updTaskTitle: string) => {
    // setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, taskTitle: updTaskTitle} : t)})
    dispatch(updTaskTitleAC(todolistId, taskId,updTaskTitle ))
  }
  return (
    <div className="App">
      {/*<div>*/}
      {/*  <input value={newTodoTitle} onChange={onChangeAddTodoTitle}/>*/}
      {/*  <button onClick={()=>{addTodo(newTodoTitle)}}>+</button>*/}
      {/*</div>*/}
      <AddItemForm callback={addTodoTitleHandler}/>
      {
        todolists.map(tl => {
          let tasksChangedByFilter = tasks[tl.id]
          if (tl.filter === 'completed') {
            tasksChangedByFilter = tasksChangedByFilter.filter(t => t.isDone)
          }
          if (tl.filter === 'active') {
            tasksChangedByFilter = tasksChangedByFilter.filter(t => !t.isDone)
          }
          return (
            <Todolist
              key={tl.id}
              todolistId={tl.id}
              todoTitle={tl.title}
              tasks={tasksChangedByFilter}
              tasksFilter={tl.filter}
              changeTaskStatus={changeTaskStatus}
              removeTask={removeTask}
              changeFilter={changeFilter}
              addTask={addTask}
              removeTodo={removeTodo}
              updTodoTitle={updTodoTitle}
              updTaskTitle={updTaskTitle}
            />
          )
        })
      }

    </div>
  );
}

export default App;


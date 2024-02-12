import React, {ChangeEvent, useState} from 'react';
import './App.css';
import {v1} from 'uuid';
import {Todolist} from './Todolist';
import {AddItemForm} from "./AddItemForm";

// тип task status
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoType = {id: string, title: string, filter: FilterValuesType}
export type TaskType = { id: string, taskTitle: string, isDone: boolean,}
export type TaskStateType = {[todolistId: string]: TaskType[]}


function App() {
  const todolistId1 = v1()
  const todolistId2 = v1()
  const [todolists, setTodolists] = useState<TodoType[]>([
    {id: todolistId1, title: 'Оп-оп', filter: 'all'},
    {id: todolistId2, title: 'Вот те нате', filter: 'all'},
  ])
  let [tasks, setTasks] = useState<TaskStateType>({
    [todolistId1]: [
      {id: v1(), taskTitle: 'Купить молоко', isDone: true,},
      {id: v1(), taskTitle: 'Сходить побегать', isDone: false,},
      {id: v1(), taskTitle: 'Понюхать цветы', isDone: false,},
    ],
    [todolistId2]: [
      {id: v1(), taskTitle: 'Купить молоко', isDone: true,},
      {id: v1(), taskTitle: 'Понюхать цветы', isDone: false,},
    ]
  })

  // Удаление задачи
  const removeTask = (todolistId: string, taskId: string) => {
    // setTasks(tasks.filter(t => t.id !== taskId))
    setTasks({...tasks, [todolistId]:tasks[todolistId].filter(t => t.id !== taskId)})
  }

  // Фильтрация задач
  const changeFilter = (todolistId: string, newFilterValue: FilterValuesType) => {
    // setTasksFilter(newFilterValue)
    setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, filter: newFilterValue} : tl))
  }

  // Добавление задачи
  const addTask = (todolistId: string, newTaskTitle: string) => {
    let newTask: TaskType = { id: v1(), taskTitle: newTaskTitle, isDone: false }
    // setTasks([newTask, ...tasks])
    setTasks({...tasks, [todolistId]:[newTask, ...tasks[todolistId]]})
  }

  // Изменение статуса задачи
  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    // setTasks(tasks.map(t => t.id === taskId ? { ...t, isDone } : t))
    setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, isDone} : t)})
  }

  const removeTodo = (todolistId: string) => {
    setTodolists(todolists.filter(tl => tl.id !== todolistId))
    // const {[todolistId]:rrr, ...rest} = tasks
    // setTasks(rest)
    const copyTasks = {...tasks}
    delete copyTasks[todolistId]
    setTasks(copyTasks)
  }

  const addTodo = (newTodoTitle: string)=> {
    const newTodolistId = v1()
    const newTodo: TodoType = {id: newTodolistId, title: newTodoTitle, filter: 'all'}
    setTodolists([newTodo, ...todolists])
    setTasks({...tasks, [newTodolistId]:[]})
  }

  const addTodoTitleHandler = (newTodoTitle: string) => {
    addTodo(newTodoTitle)
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
            />
          )
        })
      }

    </div>
  );
}

export default App;


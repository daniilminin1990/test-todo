import React, { ChangeEvent, useReducer, useState } from 'react';
import './App.css';
import { v1 } from 'uuid';
import { Todolist } from './Todolist';
import { AddItemForm } from "./AddItemForm";
import { addTodoAC, changeFilterAC, removeTodoAC, todolistsReducer, updTodoTitleAC } from './redux/todolistsReducer';
import { addTaskAC, changeTaskStatusAC, removeTaskAC, tasksReducer, updTaskTitleAC } from './redux/tasksReducer';
import { useSelector } from 'react-redux';
import { RootStoreType } from './store/store';
import { useDispatch } from 'react-redux';

// тип task status
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoType = { id: string, title: string, filter: FilterValuesType }
export type TaskType = { id: string, taskTitle: string, isDone: boolean, }
export type TaskStateType = { [todolistId: string]: TaskType[] }


function App() {
  const todolists = useSelector<RootStoreType, Array<TodoType>>(state => state.todolistsReducer)
  const tasks = useSelector<RootStoreType, TaskStateType>(state => state.tasksReducer)
  const dispatch = useDispatch()

  // Удаление задачи
  const removeTask = (todolistId: string, taskId: string) => {
    dispatch(removeTaskAC(todolistId, taskId))
  }

  // Добавление задачи
  const addTask = (todolistId: string, newTaskTitle: string) => {
    dispatch(addTaskAC(todolistId, newTaskTitle))
  }

  // Изменение статуса задачи
  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC(todolistId, taskId, isDone))
  }

  const updTaskTitle = (todolistId: string, taskId: string, newTaskTitle: string) => {
    dispatch(updTaskTitleAC(todolistId, taskId, newTaskTitle))
  }

  const removeTodo = (todolistId: string) => {
    dispatch(removeTodoAC(todolistId))
  }

  const addTodo = (newTodoTitle: string) => {
    dispatch(addTodoAC(newTodoTitle))
  }

  // Фильтрация задач
  const changeFilter = (todolistId: string, newFilterValue: FilterValuesType) => {
    dispatch(changeFilterAC(todolistId, newFilterValue))
  }

  const updTodoTitle = (todolistId: string, newTodoTitle: string) => {
    dispatch(updTodoTitleAC(todolistId, newTodoTitle))
  }

  return (
    <div className="App">
      <AddItemForm callback={addTodo} />
      {
        todolists.map(tl => {
          let tasksChangedByFilter = tasks[tl.id]
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


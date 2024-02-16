import React, { ChangeEvent, memo, useCallback, useReducer, useState } from 'react';
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


const App = memo(() => {
  console.log('App')
  const todolists = useSelector<RootStoreType, Array<TodoType>>(state => state.todolistsReducer)
  const tasks = useSelector<RootStoreType, TaskStateType>(state => state.tasksReducer)
  const dispatch = useDispatch()

  const removeTodo = useCallback((todolistId: string) => {
    dispatch(removeTodoAC(todolistId))
  }, [dispatch])

  // Фильтрация задач
  // const changeFilter = useCallback((todolistId: string, newFilterValue: FilterValuesType) => {
  //   dispatch(changeFilterAC(todolistId, newFilterValue))
  // }, [dispatch])

  const updTodoTitle = useCallback((todolistId: string, newTodoTitle: string) => {
    dispatch(updTodoTitleAC(todolistId, newTodoTitle))
  }, [dispatch])

  const addTodo = useCallback((newTodoTitle: string) => {
    dispatch(addTodoAC(newTodoTitle))
  }, [dispatch])

  return (
    <div className="App">
      <AddItemForm callback={addTodo} />
      {
        todolists.map(tl => {
          let allTasks = tasks[tl.id]
          return (
            <Todolist
              key={tl.id}
              todolistId={tl.id}
              todoTitle={tl.title}
              tasksFilter={tl.filter}
              allTasks={allTasks}
              // changeFilter={changeFilter}
              removeTodo={removeTodo}
              updTodoTitle={updTodoTitle}
            />
          )
        })
      }

    </div>
  );
})

export default App;


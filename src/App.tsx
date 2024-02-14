import React, {useCallback} from 'react';
import './App.css';
import {v1} from 'uuid';
import {Todolist} from './Todolist';
import {AddItemForm} from "./AddItemForm";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "./store/store";
import {addTodoAC, changeFilterAC, updateTodoTitleAC} from "./redux/todolistReducer";

// тип task status
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoType = {id: string, title: string, filter: FilterValuesType}
export type TaskType = { id: string, taskTitle: string, isDone: boolean,}
export type TaskStateType = {[todolistId: string]: TaskType[]}

const App = () =>{
  console.log('App')
  const dispatch = useDispatch()
  const todolists = useSelector<RootReducerType, TodoType[]>((state)=>state.todolistReducer)
  const tasks = useSelector<RootReducerType, TaskStateType>((state)=>state.tasksReducer)

  // Фильтрация задач
  const changeFilter = useCallback((todolistId: string, newFilterValue: FilterValuesType) => {
    dispatch(changeFilterAC(todolistId,newFilterValue))
  }, [dispatch])

  const addTodo = useCallback((newTodoTitle: string)=> {
    const newTodolistId = v1()
    dispatch(addTodoAC(newTodolistId, newTodoTitle))
  }, [dispatch])

  const updTodoTitle = useCallback((todolistId: string, updTodoTitle: string) => {
    dispatch(updateTodoTitleAC(todolistId, updTodoTitle))
  }, [dispatch])
  return (
    <div className="App">
      <AddItemForm callback={addTodo}/>
      {
        todolists.map(tl => {
          let allTodoTasks = tasks[tl.id]

          return (
            <Todolist
              key={tl.id}
              todolistId={tl.id}
              todoTitle={tl.title}
              tasks={allTodoTasks}
              tasksFilter={tl.filter}
              changeFilter={changeFilter}
              updTodoTitle={updTodoTitle}
            />
          )
        })
      }

    </div>
  );
}

export default App;


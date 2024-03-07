import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoUIType = TodolistType & {
  filter: FilterValuesType
}

export const todolistId1 = v1()
export const todolistId2 = v1()

const initState: TodoUIType[] =[
  // {id: todolistId1, title: 'Оп-оп', filter: 'all', addedDate: '', order: 0},
  // {id: todolistId2, title: 'Вот те нате', filter: 'all', addedDate: '', order: 0},
]

export const todolistReducer = (state: TodoUIType[]=initState, action: MutualTodoType): Array <TodoUIType> => {
  switch(action.type){
    case 'REMOVE-TODO': {
      return state.filter(tl => tl.id !== action.payload.todolistId)
    }
    case 'ADD-TODO': {
    const a = action.payload
      const newTodo: TodoUIType = {id: a.todolistId, title: a.newTodoTitle, filter: 'all', addedDate: '', order: 0}
      return [newTodo, ...state]
    }
    case 'CHANGE-TODO-FILTER': {
      const a = action.payload
      return state.map(tl => tl.id === a.todolistId ? {...tl, filter: a.newFilterValue} : tl)
    }
    case "UPDATE-TODO-TITLE": {
      const a = action.payload
      return state.map(tl => tl.id === a.todolistId ? {...tl, title: a.updTodoTitle} : tl)
    }
    case "SET-TODO": {
      return action.todolists.map(tl => ({...tl, filter: 'all'}))
    }
    default: {
      return state
    }
  }
}


export type MutualTodoType = RemoveTodoACType | AddTodoACType | ChangeFilterAC | UpdateTodoTitleAC | SetTodosActionType

export type RemoveTodoACType = ReturnType<typeof removeTodoAC>
export const removeTodoAC = (todolistId: string)=> {
  return {
    type: 'REMOVE-TODO',
    payload: {
      todolistId,
    }
  } as const
}

export type AddTodoACType = ReturnType<typeof addTodoAC>
export const addTodoAC = (todolistId: string, newTodoTitle: string)=>{
  return {
    type:"ADD-TODO",
    payload:{
      todolistId,
      newTodoTitle
    }
  }as const
}

export type ChangeFilterAC = ReturnType<typeof changeFilterAC>
export const changeFilterAC = (todolistId: string, newFilterValue: FilterValuesType) => {
  return {
    type: 'CHANGE-TODO-FILTER',
    payload: {
      todolistId,
      newFilterValue,
    }
  } as const
}

export type UpdateTodoTitleAC = ReturnType<typeof updateTodoTitleAC>
export const updateTodoTitleAC = (todolistId: string, updTodoTitle: string)=> {
  return {
    type: 'UPDATE-TODO-TITLE',
    payload: {
      todolistId,
      updTodoTitle
    }
  } as const
}

//! ActionCreator для сета тудулистов с сервера
export type SetTodosActionType = {
  type: 'SET-TODO',
  todolists: TodolistType[]
}
export const setTodosAC = (todolists: TodolistType[]): SetTodosActionType => {
  return {
    type: "SET-TODO",
    todolists: todolists
  } as const
}

//! Thunk
export const setTodolistsTC = () => (dispatch: Dispatch) => {
  todolistsAPI.getTodolists()
    .then(res => {
      dispatch(setTodosAC(res.data))
    })
}
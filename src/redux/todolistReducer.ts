import {FilterValuesType, TodoType} from "../App";
import {v1} from "uuid";

export const todolistId1 = v1()
export const todolistId2 = v1()

const initState: TodoType[] =[
  {id: todolistId1, title: 'Оп-оп', filter: 'all'},
  {id: todolistId2, title: 'Вот те нате', filter: 'all'},
]

export const todolistReducer = (state: TodoType[]=initState, action: MutualTodoType): Array <TodoType> => {
  switch(action.type){
    case 'REMOVE-TODO': {
      return state.filter(tl => tl.id !== action.payload.todolistId)
    }
    case 'ADD-TODO': {
      const newTodo: TodoType = {id: action.payload.todolistId, title: action.payload.newTodoTitle, filter: 'all'}
      return [newTodo, ...state]
    }
    case 'CHANGE-TODO-FILTER': {
      return state.map(tl => tl.id === action.payload.todolistId ? {...tl, filter: action.payload.newFilterValue} : tl)
    }
    case "UPDATE-TODO-TITLE": {
      return state.map(tl => tl.id === action.payload.todolistId ? {...tl, title: action.payload.updTodoTitle} : tl)
    }
    default: {
      return state
    }
  }
}


export type MutualTodoType = RemoveTodoACType | AddTodoACType | ChangeFilterAC | UpdateTodoTitleAC

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



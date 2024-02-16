import { FilterValuesType, TaskType } from './../App';
import { v1 } from "uuid"
import { ACTION_TYPES } from "./actionTypes"
import { TodoType } from "../App"

export const todolistsReducer = (state: Array<TodoType>, action: MutualTypes): Array<TodoType>=> {
  switch(action.type){
    case ACTION_TYPES.todolists.addTodo: {
      const newTodo: TodoType = {id: action.payload.todolistId, title: action.payload.newTodoTitle, filter: 'all'}
      return [newTodo, ...state]
    }
    case ACTION_TYPES.todolists.removeTodo: {
      return state.filter(tl => tl.id !== action.payload.todolistId)
    }
    case ACTION_TYPES.todolists.changeFilter: {
      return state.map(tl => {
        return tl.id === action.payload.todolistId 
          ? {...tl, filter: action.payload.newFilterValue} 
          : tl})
    }
    default:return state
  }
}

type MutualTypes = AddTodoACType | RemoveTodoAC | ChangeFilterAC

export type AddTodoACType = ReturnType<typeof addTodoAC>

export const addTodoAC = (newTodoTitle: string) => ({
    type: ACTION_TYPES.todolists.addTodo,
    payload: {
      todolistId: v1(),
      newTodoTitle
    }
  }
)

export type RemoveTodoAC = ReturnType<typeof removeTodoAC>

export const removeTodoAC = (todolistId: string) => ({
    type: ACTION_TYPES.todolists.removeTodo,
    payload: {
      todolistId
    }
  }
)

export type ChangeFilterAC = ReturnType<typeof changeFilterAC>

export const changeFilterAC = (todolistId: string, newFilterValue: FilterValuesType) => ({
  type: ACTION_TYPES.todolists.changeFilter,
  payload: {
    todolistId,
    newFilterValue
  }
}
)
import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {addStatusAC, addTodoStatusAC, AddTodoStatusACType, setErrorAC} from "./appReducer";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoUIType = TodolistType & {
  filter: FilterValuesType
}

export const todolistId1 = v1()
export const todolistId2 = v1()

const initState: TodoUIType[] = [
  // {id: todolistId1, title: 'Оп-оп', filter: 'all', addedDate: '', order: 0},
  // {id: todolistId2, title: 'Вот те нате', filter: 'all', addedDate: '', order: 0},
]

export const todolistReducer = (state: TodoUIType[] = initState, action: MutualTodoType): Array<TodoUIType> => {
  switch (action.type) {
    case 'REMOVE-TODO': {
      return state.filter(tl => tl.id !== action.payload.todolistId)
    }
    case 'ADD-TODO': {
      // const a = action.payload
      // const newTodo: TodoUIType = {id: a.todolistId, title: a.newTodoTitle, filter: 'all', addedDate: '', order: 0}
      // return [newTodo, ...state]
      const newTodo: TodoUIType = {...action.payload.newTodolist, filter: 'all'}
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


export type MutualTodoType = RemoveTodoACType | AddTodoACType
  | ChangeFilterAC | UpdateTodoTitleAC | SetTodosActionType

export type RemoveTodoACType = ReturnType<typeof removeTodoAC>
export const removeTodoAC = (todolistId: string) => {
  return {
    type: 'REMOVE-TODO',
    payload: {
      todolistId,
    }
  } as const
}

export type AddTodoACType = ReturnType<typeof addTodoAC>
export const addTodoAC = (newTodolist: TodolistType) => {
  return {
    type: "ADD-TODO",
    payload: {
      newTodolist
    }
  } as const
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
export const updateTodoTitleAC = (todolistId: string, updTodoTitle: string) => {
  return {
    type: 'UPDATE-TODO-TITLE',
    payload: {
      todolistId,
      updTodoTitle
    }
  } as const
}

//! ActionCreator для сета тудулистов с сервера
// export type SetTodosActionType = {
//   type: 'SET-TODO',
//   todolists: TodolistType[]
// }
// или так
export type SetTodosActionType = ReturnType<typeof setTodosAC>

// export const setTodosAC = (todolists: TodolistType[]): SetTodosActionType => {
export const setTodosAC = (todolists: TodolistType[]) => {
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
      dispatch(addTodoStatusAC('success'))
    })
}

export const deleteTodoTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistsAPI.deleteTodolist(todolistId)
    .then(() => {
      dispatch(removeTodoAC(todolistId))
    })
}

export const addTodoTC = (newTodotitle: string) => (dispatch: Dispatch) => {
  dispatch(addStatusAC('loading'))
  todolistsAPI.createTodolist(newTodotitle)
    .then((res) => {
      if(res.data.resultCode===0){
        dispatch(addTodoAC(res.data.data.item))
        dispatch(addStatusAC('success'))
      } else {
        if(res.data.messages.length){ // Если придет текст ошибки с сервера (МЫ НЕ ПРОВЕРЯЕМ НА 100 символов, это делает сервер)
          dispatch(setErrorAC(res.data.messages[0]))
        } else { // Если не придет текст ошибки с сервера, то откинем свой текст
          dispatch(setErrorAC('Oops. Something went wrong. Reload page'))
        }
      }
    })
    .finally(() => {
      dispatch(addStatusAC('success'))
    })
}

export const changeTodoTitleTC = (todolistId: string, newTodotitle: string) => (dispatch: Dispatch) => {
  todolistsAPI.updateTodolist(todolistId, newTodotitle)
    .then((res) => {
      dispatch(updateTodoTitleAC(todolistId, newTodotitle))
    })
}
import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {addAppStatusAC, addAppTodoStatusAC, AddAppTodoStatusACType, ServerResponseStatusType, setAppErrorAC} from "./appReducer";
import {AxiosError} from "axios";
import {errorFunctionMessage} from "../utilities/utilities";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoUIType = TodolistType & {
  filter: FilterValuesType
  entityStatus: ServerResponseStatusType
}

// export const todolistId1 = v1()
// export const todolistId2 = v1()

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
      const newTodo: TodoUIType = {...action.payload.newTodolist, filter: 'all', entityStatus: 'idle'}
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
      return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    }
    case "UPDATE-TODO-ENTITY-STATUS": {
      const a = action.payload
      return state.map(tl => tl.id === a.todoId ? {...tl, entityStatus: a.entityStatus} : tl)
    }
    default: {
      return state
    }
  }
}

export type MutualTodoType = RemoveTodoACType | AddTodoACType
  | ChangeFilterAC | UpdateTodoTitleAC | SetTodosActionType | UpdateEntityStatusTodoAC

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

//! AC для EntityStatus
export type UpdateEntityStatusTodoAC = ReturnType<typeof updateEntityStatusTodoAC>
export const updateEntityStatusTodoAC = (todoId: string, entityStatus: ServerResponseStatusType) => {
  return {
    type: 'UPDATE-TODO-ENTITY-STATUS',
    payload: {
      todoId,
      entityStatus
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
      dispatch(addAppTodoStatusAC('success'))
    })
}

export const deleteTodoTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(updateEntityStatusTodoAC(todolistId, 'loading')) // перед запросом поставим в loading
  todolistsAPI.deleteTodolist(todolistId)
    .then(() => {
      dispatch(removeTodoAC(todolistId))
      dispatch(updateEntityStatusTodoAC(todolistId, 'success')) // если все удачно, то в success
    })
}

export const addTodoTC = (newTodotitle: string) => (dispatch: Dispatch) => {
  dispatch(addAppStatusAC('loading'))
  todolistsAPI.createTodolist(newTodotitle)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(addTodoAC(res.data.data.item))
        dispatch(addAppStatusAC('success'))
      } else {
        // errorFunctionMessage(res.data, dispatch)
        errorFunctionMessage<{item: TodolistType}>(res.data, dispatch)
      }
    }).catch((e: AxiosError) => setAppErrorAC(e.message))
    .finally(() => {
      dispatch(addAppStatusAC('success'))
    })
}

export const changeTodoTitleTC = (todolistId: string, newTodotitle: string) => (dispatch: Dispatch) => {
  todolistsAPI.updateTodolist(todolistId, newTodotitle)
    .then((res) => {
      dispatch(updateTodoTitleAC(todolistId, newTodotitle))
    })
}


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

// export const todoListId1 = v1()
// export const todoListId2 = v1()

const initState: TodoUIType[] = [
  // {id: todoListId1, title: 'Оп-оп', filter: 'all', addedDate: '', order: 0},
  // {id: todoListId2, title: 'Вот те нате', filter: 'all', addedDate: '', order: 0},
]

export const todolistReducer = (state: TodoUIType[] = initState, action: MutualTodoType): Array<TodoUIType> => {
  switch (action.type) {
    case 'REMOVE-TODO': {
      return state.filter(tl => tl.id !== action.payload.todoListId)
    }
    case 'ADD-TODO': {
      // const a = action.payload
      // const newTodo: TodoUIType = {id: a.todoListId, title: a.newTodoTitle, filter: 'all', addedDate: '', order: 0}
      // return [newTodo, ...state]
      const newTodo: TodoUIType = {...action.payload.newTodolist, filter: 'all', entityStatus: 'idle'}
      return [newTodo, ...state]
    }
    case 'CHANGE-TODO-FILTER': {
      const a = action.payload
      return state.map(tl => tl.id === a.todoListId ? {...tl, filter: a.newFilterValue} : tl)
    }
    case "UPDATE-TODO-TITLE": {
      const a = action.payload
      return state.map(tl => tl.id === a.todoListId ? {...tl, title: a.updTodoTitle} : tl)
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
export const removeTodoAC = (todoListId: string) => {
  return {
    type: 'REMOVE-TODO',
    payload: {
      todoListId,
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
export const changeFilterAC = (todoListId: string, newFilterValue: FilterValuesType) => {
  return {
    type: 'CHANGE-TODO-FILTER',
    payload: {
      todoListId,
      newFilterValue,
    }
  } as const
}

export type UpdateTodoTitleAC = ReturnType<typeof updateTodoTitleAC>
export const updateTodoTitleAC = (todoListId: string, updTodoTitle: string) => {
  return {
    type: 'UPDATE-TODO-TITLE',
    payload: {
      todoListId,
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

export const deleteTodoTC = (todoListId: string) => (dispatch: Dispatch) => {
  dispatch(updateEntityStatusTodoAC(todoListId, 'loading')) // перед запросом поставим в loading
  todolistsAPI.deleteTodolist(todoListId)
    .then(() => {
      dispatch(removeTodoAC(todoListId))
      dispatch(updateEntityStatusTodoAC(todoListId, 'success')) // если все удачно, то в success
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

export const changeTodoTitleTC = (todoListId: string, newTodotitle: string) => (dispatch: Dispatch) => {
  todolistsAPI.updateTodolist(todoListId, newTodotitle)
    .then((res) => {
      dispatch(updateTodoTitleAC(todoListId, newTodotitle))
    })
}


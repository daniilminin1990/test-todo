import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {
  setAppStatusAC,
  setAppTodoStatusAC,
  ServerResponseStatusType,
  setAppErrorAC
} from "./appReducer";
import {AxiosError} from "axios";
import {errorFunctionMessage} from "../utilities/utilities";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoUIType = TodolistType & {
  filter: FilterValuesType
  entityStatus: ServerResponseStatusType
}

const initState: TodoUIType[] = []

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
export type SetTodosActionType = ReturnType<typeof setTodosAC>

export const setTodosAC = (todolists: TodolistType[]) => {
  return {
    type: "SET-TODO",
    todolists: todolists
  } as const
}

//! Thunk
export const setTodolistsTC = () => (dispatch: Dispatch) => {
  dispatch(setAppTodoStatusAC({statusTodo: 'loading'}))
  todolistsAPI.getTodolists()
    .then(res => {
      dispatch(setTodosAC(res.data))
      dispatch(setAppTodoStatusAC({statusTodo: 'success'}))
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
    })
}

export const deleteTodoTC = (todoListId: string) => (dispatch: Dispatch) => {
  dispatch(setAppTodoStatusAC({statusTodo: 'loading'}))
  dispatch(updateEntityStatusTodoAC(todoListId, 'loading')) // перед запросом поставим в loading
  todolistsAPI.deleteTodolist(todoListId)
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(removeTodoAC(todoListId))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Something wrong, try later')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppTodoStatusAC({statusTodo: 'success'}))
      dispatch(updateEntityStatusTodoAC(todoListId, 'success')) // если все удачно, то в success
    })
}

export const addTodoTC = (newTodotitle: string) => (dispatch: Dispatch) => {
  dispatch(setAppTodoStatusAC({statusTodo: 'loading'}))
  todolistsAPI.createTodolist(newTodotitle)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(addTodoAC(res.data.data.item))
        // dispatch(addAppStatusAC('success'))
      } else {
        // errorFunctionMessage(res.data, dispatch)
        errorFunctionMessage<{ item: TodolistType }>(res.data, dispatch, 'Oops! Something gone wrong. Length should be less 100 symbols')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppTodoStatusAC({statusTodo: 'success'}))
    })
}

export const changeTodoTitleTC = (todoListId: string, newTodotitle: string) => (dispatch: Dispatch) => {
  dispatch(setAppTodoStatusAC({statusTodo: 'loading'}))
  todolistsAPI.updateTodolist(todoListId, newTodotitle)
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(updateTodoTitleAC(todoListId, newTodotitle))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Length should be less than 100 symbols')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppTodoStatusAC({statusTodo: 'success'}))
    })
}


import {Dispatch} from "redux";
import {loginAPI} from "../api/login-api";
import {setIsLoggedInAC} from "../features/Login/loginReducer";

export type ServerResponseStatusType = 'idle' | 'success' | 'loading' | 'failed'

type InitialStateType = {
  statusTodo: ServerResponseStatusType
  statusTask: ServerResponseStatusType
  addStatus: ServerResponseStatusType,
  error: null | string
  isInitialized: boolean
}

const initialState: InitialStateType = {
  statusTodo: 'idle' as const,
  statusTask: 'idle' as const,
  addStatus: 'idle' as const,
  error: null,
  isInitialized: false
}

export const initialiseMeTC = () => (dispatch: Dispatch) => {
  loginAPI.initialiseMe()
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(changeInitializedAC(true))
      } else {

      }
    })
    .finally(() => {
      dispatch(setIsLoggedInAC({value: true}))
    })
}

export const appReducer = (state = initialState, action: AppReducerType) => {
  switch (action.type) {
    case "SET-TODO-STATUS": {
      return {...state, statusTodo: action.payload.status}
    }
    case "SET-TASK-STATUS": {
      return {...state, statusTask: action.payload.status}
    }
    case "ADD-STATUS": {
      return {...state, addStatus: action.payload.status}
    }
    case "SET-ERROR": {
      return {...state, error: action.payload.error}
    }
    case "CHANGE-INITIALIZED":{
      return {...state, isInitialized: action.payload.value}
    }
    default: {
      return  state
    }
  }
}

type AppReducerType = AddAppTodoStatusACType | AddAppTaskStatusACType | AddAppStatusACType | SetAppErrorACType | ChangeInitializedAC

export type AddAppTodoStatusACType = ReturnType<typeof addAppTodoStatusAC>
export const addAppTodoStatusAC = (status: ServerResponseStatusType) => {
  return {
    type: 'SET-TODO-STATUS',
    payload: {
      status
    }
  } as const
}

export type AddAppTaskStatusACType = ReturnType<typeof addAppTaskStatusAC>
export const addAppTaskStatusAC = (status: ServerResponseStatusType) => {
  return {
    type: 'SET-TASK-STATUS',
    payload: {
      status
    }
  } as const
}

export type AddAppStatusACType = ReturnType<typeof addAppStatusAC>
export const addAppStatusAC = (status: ServerResponseStatusType) => {
  return {
    type: 'ADD-STATUS',
    payload: {
      status
    }
  } as const
}

export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export const setAppErrorAC = (error: null|string) => {
  return {
    type: 'SET-ERROR',
    payload: {
      error
    }
  } as const
}

export type ChangeInitializedAC = ReturnType<typeof changeInitializedAC>
export const changeInitializedAC = (value: boolean) => {
  return {
    type: 'CHANGE-INITIALIZED',
    payload: {
      value
    }
  } as const
}
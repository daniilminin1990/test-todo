import {Dispatch} from "redux";
import {loginAPI} from "../api/login-api";
import {setIsLoggedInAC} from "../features/Login/loginReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ServerResponseStatusType = 'idle' | 'success' | 'loading' | 'failed'

// type InitialStateType = {
//   statusTodo: ServerResponseStatusType
//   statusTask: ServerResponseStatusType
//   addStatus: ServerResponseStatusType,
//   error: null | string
//   isInitialized: boolean
// }

const initialState= {
  statusTodo: 'idle' as ServerResponseStatusType,
  statusTask: 'idle' as ServerResponseStatusType,
  addStatus: 'idle' as ServerResponseStatusType,
  error: null as null | string,
  isInitialized: false
}

const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppTodoStatusAC(state, action: PayloadAction<{ statusTodo: ServerResponseStatusType }>) {
      state.statusTodo = action.payload.statusTodo
    },
    setAppStatusTaskAC(state, action: PayloadAction<{ statusTask: ServerResponseStatusType }>){
      state.statusTask = action.payload.statusTask
    },
    setAppStatusAC(state, action: PayloadAction<{ appStatus: ServerResponseStatusType }>) {
      state.addStatus = action.payload.appStatus
    },
    setAppErrorAC(state,action: PayloadAction<{error: null | string}>){
      state.error = action.payload.error
    },
    changeInitializedAC(state, action: PayloadAction<{value: boolean}>){
      state.isInitialized = action.payload.value
    }
  }
})

export const appReducer = slice.reducer

export const {setAppTodoStatusAC,
  setAppStatusTaskAC,
  setAppStatusAC,
  setAppErrorAC,
  changeInitializedAC
} = slice.actions

export const initialiseMeTC = () => (dispatch: Dispatch) => {
  loginAPI.initialiseMe()
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(changeInitializedAC({value: true}))
      } else {

      }
    })
    .finally(() => {
      dispatch(setIsLoggedInAC({value: true}))
    })
}
//
// export const appReducer = (state = initialState, action: AppReducerType) => {
//   switch (action.type) {
//     case "SET-TODO-STATUS": {
//       return {...state, statusTodo: action.payload.status}
//     }
//     case "SET-TASK-STATUS": {
//       return {...state, statusTask: action.payload.status}
//     }
//     case "ADD-STATUS": {
//       return {...state, addStatus: action.payload.status}
//     }
//     case "SET-ERROR": {
//       return {...state, error: action.payload.error}
//     }
//     case "CHANGE-INITIALIZED":{
//       return {...state, isInitialized: action.payload.value}
//     }
//     default: {
//       return  state
//     }
//   }
// }
//
// type AppReducerType = SetAppTodoStatusACType | SetAppTaskStatusACType | SetAppStatusACType | SetAppErrorACType | ChangeInitializedAC
//
// export type SetAppTodoStatusACType = ReturnType<typeof setAppTodoStatusAC>
// export const setAppTodoStatusAC = (status: ServerResponseStatusType) => {
//   return {
//     type: 'SET-TODO-STATUS',
//     payload: {
//       status
//     }
//   } as const
// }
//
// export type SetAppTaskStatusACType = ReturnType<typeof setAppTaskStatusAC>
// export const setAppTaskStatusAC = (status: ServerResponseStatusType) => {
//   return {
//     type: 'SET-TASK-STATUS',
//     payload: {
//       status
//     }
//   } as const
// }
//
// export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
// export const setAppStatusAC = (status: ServerResponseStatusType) => {
//   return {
//     type: 'ADD-STATUS',
//     payload: {
//       status
//     }
//   } as const
// }
//
// export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
// export const setAppErrorAC = (error: null|string) => {
//   return {
//     type: 'SET-ERROR',
//     payload: {
//       error
//     }
//   } as const
// }
//
// export type ChangeInitializedAC = ReturnType<typeof changeInitializedAC>
// export const changeInitializedAC = (value: boolean) => {
//   return {
//     type: 'CHANGE-INITIALIZED',
//     payload: {
//       value
//     }
//   } as const
// }
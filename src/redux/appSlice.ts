import {Dispatch} from "redux";
import {loginAPI} from "../api/login-api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loginActions} from "../features/Login/loginSlice";

export type ServerResponseStatusType = 'idle' | 'success' | 'loading' | 'failed'


const slice = createSlice({
  name: 'app',
  initialState: {
    statusTodo: 'idle' as ServerResponseStatusType,
    statusTask: 'idle' as ServerResponseStatusType,
    addStatus: 'idle' as ServerResponseStatusType,
    error: null as null | string,
    isInitialized: false
  },
  reducers: {
    setAppTodoStatus(state, action: PayloadAction<{ statusTodo: ServerResponseStatusType }>) {
      state.statusTodo = action.payload.statusTodo
    },
    setAppStatusTask(state, action: PayloadAction<{ statusTask: ServerResponseStatusType }>){
      state.statusTask = action.payload.statusTask
    },
    setAppStatus(state, action: PayloadAction<{ appStatus: ServerResponseStatusType }>) {
      state.addStatus = action.payload.appStatus
    },
    setAppError(state,action: PayloadAction<{error: null | string}>){
      state.error = action.payload.error
    },
    changeInitialized(state, action: PayloadAction<{value: boolean}>){
      state.isInitialized = action.payload.value
    }
  },
  // selectors: {
    // selectAddStatus: sliceState=> sliceState.addStatus,
  //   statusTodo: (sliceState) => sliceState.statusTodo,
  //   statusTask: (sliceState) => sliceState.statusTask,
  //   isInitialized: (sliceState) => sliceState.isInitialized,
  //   error: (sliceState) => sliceState.error
  // }
})

export const appSlice = slice.reducer

export const appActions = slice.actions
// export const appSelectors = slice.selectors
export type AppInitialState = ReturnType<typeof slice.getInitialState>

export const initialiseMeTC = () => (dispatch: Dispatch) => {
  loginAPI.initialiseMe()
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(appActions.changeInitialized({value: true}))
        dispatch(loginActions.setIsLoggedInAC({value: true}))
      } else {

      }
    })
    .finally(() => {
      dispatch(appActions.changeInitialized({value: true}))
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
// type AppReducerType = setAppTodoStatusType | SetAppTaskStatusACType | setAppStatusType | setAppErrorType | changeInitialized
//
// export type setAppTodoStatusType = ReturnType<typeof setAppTodoStatus>
// export const setAppTodoStatus = (status: ServerResponseStatusType) => {
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
// export type setAppStatusType = ReturnType<typeof setAppStatus>
// export const setAppStatus = (status: ServerResponseStatusType) => {
//   return {
//     type: 'ADD-STATUS',
//     payload: {
//       status
//     }
//   } as const
// }
//
// export type setAppErrorType = ReturnType<typeof setAppError>
// export const setAppError = (error: null|string) => {
//   return {
//     type: 'SET-ERROR',
//     payload: {
//       error
//     }
//   } as const
// }
//
// export type changeInitialized = ReturnType<typeof changeInitialized>
// export const changeInitialized = (value: boolean) => {
//   return {
//     type: 'CHANGE-INITIALIZED',
//     payload: {
//       value
//     }
//   } as const
// }
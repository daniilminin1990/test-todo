export type ServerResponseStatusType = 'idle' | 'success' | 'loading' | 'failed'

type InitialStateType = {
  statusTodo: ServerResponseStatusType
  statusTask: ServerResponseStatusType
  addStatus: ServerResponseStatusType,
  error: null | string
}

const initialState: InitialStateType = {
  statusTodo: 'loading' as const,
  statusTask: 'idle' as const,
  addStatus: 'idle' as const,
  error: null
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
    default: {
      return  state
    }
  }
}

type AppReducerType = AddTodoStatusACType | AddTaskStatusACType | AddStatusACType | SetErrorACType

export type AddTodoStatusACType = ReturnType<typeof addTodoStatusAC>
export const addTodoStatusAC = (status: ServerResponseStatusType) => {
  return {
    type: 'SET-TODO-STATUS',
    payload: {
      status
    }
  } as const
}

export type AddTaskStatusACType = ReturnType<typeof addTaskStatusAC>
export const addTaskStatusAC = (status: ServerResponseStatusType) => {
  return {
    type: 'SET-TASK-STATUS',
    payload: {
      status
    }
  } as const
}

export type AddStatusACType = ReturnType<typeof addStatusAC>
export const addStatusAC = (status: ServerResponseStatusType) => {
  return {
    type: 'ADD-STATUS',
    payload: {
      status
    }
  } as const
}

export type SetErrorACType = ReturnType<typeof setErrorAC>
export const setErrorAC = (error: null|string) => {
  return {
    type: 'SET-ERROR',
    payload: {
      error
    }
  } as const
}
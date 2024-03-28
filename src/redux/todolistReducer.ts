import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {ServerResponseStatusType, setAppErrorAC, setAppTodoStatusAC} from "./appReducer";
import {AxiosError} from "axios";
import {errorFunctionMessage} from "../utilities/utilities";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "../common/actions/common.actions";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoUIType = TodolistType & {
  filter: FilterValuesType
  entityStatus: ServerResponseStatusType
}

const initState: TodoUIType[] = []

const slice = createSlice({
  name: 'todolists',
  initialState: initState,
  reducers: {
    removeTodoAC(state, action: PayloadAction<{todoListId: string}>){
      const id = state.findIndex(tl => tl.id === action.payload.todoListId)
      // delete state[id] ЭТО НЕ ПОДОЙДЕТ, ИНАЧЕ БУДЕТ ПУСТОЙ ЭЛЕМЕНТ В МАССИВЕ И НУЖНО ПРОВЕРИТЬ, А НАЙДЕТ ЛИ ВАЩЕ ТАКОЙ ID
      if(id>-1) state.splice(id, 1)
    },
    addTodoAC(state, action: PayloadAction<{newTodolist: TodolistType, filter: FilterValuesType, entityStatus: ServerResponseStatusType}>) {
      state.unshift({...action.payload.newTodolist, filter: action.payload.filter, entityStatus: action.payload.entityStatus})
    },
    changeFilterAC(state, action: PayloadAction<{todoListId: string, newFilterValue: FilterValuesType}>){
      const id = state.findIndex(tl => tl.id === action.payload.todoListId)
      state[id] = {...state[id], filter: action.payload.newFilterValue}
    },
    updateTodoTitleAC(state, action: PayloadAction<{todoListId: string, newTodoTitle: string}>){
      const id = state.findIndex(tl => tl.id === action.payload.todoListId)
      state[id] = {...state[id], title: action.payload.newTodoTitle}
    },
    updateEntityStatusTodoAC(state, action: PayloadAction<{todoId: string, entityStatus: ServerResponseStatusType}>){
      const id = state.findIndex(tl => tl.id === action.payload.todoId)
      state[id] = {...state[id], entityStatus: action.payload.entityStatus}
    },
    setTodosAC(state, action: PayloadAction<{todolists: TodolistType[]}>) {
      return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    },
  },
  extraReducers: builder => {
    builder.addCase(clearTasksAndTodos, () => {
      return []
    })
  }
})

export const todolistReducer = slice.reducer
export const {
  removeTodoAC,
  addTodoAC,
  changeFilterAC,
  updateTodoTitleAC,
  updateEntityStatusTodoAC,
  setTodosAC,
} = slice.actions

// export const todolistReducer = (state: TodoUIType[] = initState, action: MutualTodoType): Array<TodoUIType> => {
//   switch (action.type) {
//     case 'REMOVE-TODO': {
//       return state.filter(tl => tl.id !== action.payload.todoListId)
//     }
//     case 'ADD-TODO': {
//       // const a = action.payload
//       // const newTodo: TodoUIType = {id: a.todoListId, title: a.newTodoTitle, filter: 'all', addedDate: '', order: 0}
//       // return [newTodo, ...state]
//       const newTodo: TodoUIType = {...action.payload.newTodolist, filter: 'all', entityStatus: 'idle'}
//       return [newTodo, ...state]
//     }
//     case 'CHANGE-TODO-FILTER': {
//       const a = action.payload
//       return state.map(tl => tl.id === a.todoListId ? {...tl, filter: a.newFilterValue} : tl)
//     }
//     case "UPDATE-TODO-TITLE": {
//       const a = action.payload
//       return state.map(tl => tl.id === a.todoListId ? {...tl, title: a.updTodoTitle} : tl)
//     }
//     case "SET-TODO": {
//       return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
//     }
//     case "UPDATE-TODO-ENTITY-STATUS": {
//       const a = action.payload
//       return state.map(tl => tl.id === a.todoId ? {...tl, entityStatus: a.entityStatus} : tl)
//     }
//     default: {
//       return state
//     }
//   }
// }
//
// export type MutualTodoType = RemoveTodoACType | AddTodoACType
//   | ChangeFilterAC | UpdateTodoTitleAC | SetTodosActionType | UpdateEntityStatusTodoAC
//
export type RemoveTodoACType = ReturnType<typeof removeTodoAC>
// export const removeTodoAC = (todoListId: string) => {
//   return {
//     type: 'REMOVE-TODO',
//     payload: {
//       todoListId,
//     }
//   } as const
// }
//
export type AddTodoACType = ReturnType<typeof addTodoAC>
// export const addTodoAC = (newTodolist: TodolistType) => {
//   return {
//     type: "ADD-TODO",
//     payload: {
//       newTodolist
//     }
//   } as const
// }
//
export type ChangeFilterAC = ReturnType<typeof changeFilterAC>
// export const changeFilterAC = (todoListId: string, newFilterValue: FilterValuesType) => {
//   return {
//     type: 'CHANGE-TODO-FILTER',
//     payload: {
//       todoListId,
//       newFilterValue,
//     }
//   } as const
// }
//
export type UpdateTodoTitleAC = ReturnType<typeof updateTodoTitleAC>
// export const updateTodoTitleAC = (todoListId: string, updTodoTitle: string) => {
//   return {
//     type: 'UPDATE-TODO-TITLE',
//     payload: {
//       todoListId,
//       updTodoTitle
//     }
//   } as const
// }
//
// //! AC для EntityStatus
export type UpdateEntityStatusTodoAC = ReturnType<typeof updateEntityStatusTodoAC>
// export const updateEntityStatusTodoAC = (todoId: string, entityStatus: ServerResponseStatusType) => {
//   return {
//     type: 'UPDATE-TODO-ENTITY-STATUS',
//     payload: {
//       todoId,
//       entityStatus
//     }
//   } as const
// }
//
// //! ActionCreator для сета тудулистов с сервера
export type SetTodosActionType = ReturnType<typeof setTodosAC>
//
// export const setTodosAC = (todolists: TodolistType[]) => {
//   return {
//     type: "SET-TODO",
//     todolists: todolists
//   } as const
// }

//! Thunk
export const setTodolistsTC = () => (dispatch: Dispatch) => {
  dispatch(setAppTodoStatusAC({statusTodo: 'loading'}))
  todolistsAPI.getTodolists()
    .then(res => {
      dispatch(setTodosAC({todolists: res.data}))
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
  dispatch(updateEntityStatusTodoAC({todoId: todoListId, entityStatus: 'loading'})) // перед запросом поставим в loading
  todolistsAPI.deleteTodolist(todoListId)
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(removeTodoAC({todoListId: todoListId}))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Something wrong, try later')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppTodoStatusAC({statusTodo: 'success'}))
      dispatch(updateEntityStatusTodoAC({todoId: todoListId, entityStatus: 'success'})) // если все удачно, то в success
    })
}

export const addTodoTC = (newTodotitle: string) => (dispatch: Dispatch) => {
  dispatch(setAppTodoStatusAC({statusTodo: 'loading'}))
  todolistsAPI.createTodolist(newTodotitle)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(addTodoAC({newTodolist: res.data.data.item, filter: 'all', entityStatus: 'idle'}))
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
        dispatch(updateTodoTitleAC({todoListId: todoListId, newTodoTitle: newTodotitle}))
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


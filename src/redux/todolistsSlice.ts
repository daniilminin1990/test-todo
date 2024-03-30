import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {appActions, ServerResponseStatusType} from "./appSlice";
import {AxiosError} from "axios";
import {errorFunctionMessage} from "../utilities/utilities";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "../common/actions/common.actions";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoUIType = TodolistType & {
  filter: FilterValuesType
  entityStatus: ServerResponseStatusType
}

const slice = createSlice({
  name: 'todolists',
  initialState: [] as TodoUIType[],
  reducers: {
    removeTodo(state, action: PayloadAction<{todoListId: string}>){
      const id = state.findIndex(tl => tl.id === action.payload.todoListId)
      // delete state[id] ЭТО НЕ ПОДОЙДЕТ, ИНАЧЕ БУДЕТ ПУСТОЙ ЭЛЕМЕНТ В МАССИВЕ И НУЖНО ПРОВЕРИТЬ, А НАЙДЕТ ЛИ ВАЩЕ ТАКОЙ ID
      if(id>-1) state.splice(id, 1)
    },
    addTodo(state, action: PayloadAction<{newTodolist: TodolistType, filter: FilterValuesType, entityStatus: ServerResponseStatusType}>) {
      state.unshift({...action.payload.newTodolist, filter: action.payload.filter, entityStatus: action.payload.entityStatus})
    },
    changeTodoFilter(state, action: PayloadAction<{todoListId: string, newFilterValue: FilterValuesType}>){
      const id = state.findIndex(tl => tl.id === action.payload.todoListId)
      state[id] = {...state[id], filter: action.payload.newFilterValue}
    },
    updateTodoTitle(state, action: PayloadAction<{todoListId: string, newTodoTitle: string}>){
      const id = state.findIndex(tl => tl.id === action.payload.todoListId)
      state[id] = {...state[id], title: action.payload.newTodoTitle}
    },
    updateEntityStatusTodo(state, action: PayloadAction<{todoId: string, entityStatus: ServerResponseStatusType}>){
      const id = state.findIndex(tl => tl.id === action.payload.todoId)
      state[id] = {...state[id], entityStatus: action.payload.entityStatus}
    },
    setTodos(state, action: PayloadAction<{todolists: TodolistType[]}>) {
      return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    },
  },
  extraReducers: builder => {
    builder.addCase(clearTasksAndTodos, () => {
      return []
    })
  },
  // selectors: {
  //   todolists: sliceState => sliceState
  // }
})

export const todolistsSlice = slice.reducer
export const todolistsActions = slice.actions
// export const todolistsSelectors = slice.selectors

//! Thunk
export const setTodolistsTC = () => (dispatch: Dispatch) => {
  dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
  todolistsAPI.getTodolists()
    .then(res => {
      dispatch(todolistsActions.setTodos({todolists: res.data}))
      dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
    })
    .catch((e: AxiosError) => {
      appActions.setAppError({error: e.message})
    })
    .finally(() => {
    })
}

export const deleteTodoTC = (todoListId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
  dispatch(todolistsActions.updateEntityStatusTodo({todoId: todoListId, entityStatus: 'loading'})) // перед запросом поставим в loading
  todolistsAPI.deleteTodolist(todoListId)
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(todolistsActions.removeTodo({todoListId: todoListId}))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Something wrong, try later')
      }
    })
    .catch((e: AxiosError) => {
      appActions.setAppError({error: e.message})
    })
    .finally(() => {
      dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
      dispatch(todolistsActions.updateEntityStatusTodo({todoId: todoListId, entityStatus: 'success'})) // если все удачно, то в success
    })
}

export const addTodoTC = (newTodotitle: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
  todolistsAPI.createTodolist(newTodotitle)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(todolistsActions.addTodo({newTodolist: res.data.data.item, filter: 'all', entityStatus: 'idle'}))
        // dispatch(addAppStatusAC('success'))
      } else {
        // errorFunctionMessage(res.data, dispatch)
        errorFunctionMessage<{ item: TodolistType }>(res.data, dispatch, 'Oops! Something gone wrong. Length should be less 100 symbols')
      }
    })
    .catch((e: AxiosError) => {
      appActions.setAppError({error: e.message})
    })
    .finally(() => {
      dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
    })
}

export const changeTodoTitleTC = (todoListId: string, newTodotitle: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
  todolistsAPI.updateTodolist(todoListId, newTodotitle)
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(todolistsActions.updateTodoTitle({todoListId: todoListId, newTodoTitle: newTodotitle}))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Length should be less than 100 symbols')
      }
    })
    .catch((e: AxiosError) => {
      appActions.setAppError({error: e.message})
    })
    .finally(() => {
      dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
    })
}


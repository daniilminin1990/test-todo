import {todolistsAPI, TodolistType, UpdateTodoArgs} from "../api/todolists-api";
import {Dispatch} from "redux";
import {appActions, ServerResponseStatusType} from "./appSlice";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "../common/actions/common.actions";
import {handleServerAppError, handleServerNetworkError} from "../utilities/utilities";
import {createAppAsyncThunk} from "../utilities/createAppAsyncThunk";
import {tasksThunks} from "./tasksSlice";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoUIType = TodolistType & {
  filter: FilterValuesType
  entityStatus: ServerResponseStatusType
  showTasks: boolean
}

const slice = createSlice({
  name: 'todolists',
  initialState: [] as TodoUIType[],
  reducers: {
    // removeTodo(state, action: PayloadAction<{ todoListId: string }>) {
    //   const id = state.findIndex(tl => tl.id === action.payload.todoListId)
    //   // delete state[id] ЭТО НЕ ПОДОЙДЕТ, ИНАЧЕ БУДЕТ ПУСТОЙ ЭЛЕМЕНТ В МАССИВЕ И НУЖНО ПРОВЕРИТЬ, А НАЙДЕТ ЛИ ВАЩЕ ТАКОЙ ID
    //   if (id > -1) state.splice(id, 1)
    // },
    // addTodo(state, action: PayloadAction<{
    //   newTodolist: TodolistType,
    //   filter: FilterValuesType,
    //   entityStatus: ServerResponseStatusType
    // }>) {
    //   state.unshift({
    //     ...action.payload.newTodolist,
    //     filter: action.payload.filter,
    //     entityStatus: action.payload.entityStatus
    //   })
    // },
    changeTodoFilter(state, action: PayloadAction<{ todoListId: string, newFilterValue: FilterValuesType }>) {
      const id = state.findIndex(tl => tl.id === action.payload.todoListId)
      if (id > -1) state[id] = {...state[id], filter: action.payload.newFilterValue}
    },
    // updateTodoTitle(state, action: PayloadAction<{ todoListId: string, newTodoTitle: string }>) {
    //   const id = state.findIndex(tl => tl.id === action.payload.todoListId)
    //   state[id] = {...state[id], title: action.payload.newTodoTitle}
    // },
    updateEntityStatusTodo(state, action: PayloadAction<{ todoId: string, entityStatus: ServerResponseStatusType }>) {
      const id = state.findIndex(tl => tl.id === action.payload.todoId)
      if(id > -1) state[id] = {...state[id], entityStatus: action.payload.entityStatus}
    },
    // fetchTodos(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
    //   return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    // },
    showTasks(state, action: PayloadAction<{todoListId: string}>){
      const id = state.findIndex(tl => tl.id === action.payload.todoListId)
      if (id > -1) state[id].showTasks = true
    }
  },
  extraReducers: builder => {
    builder
      .addCase(clearTasksAndTodos, () => {
        return []
      })
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle', showTasks: false}))
      })
      .addCase(deleteTodoTC.fulfilled, (state, action) => {
        const id = state.findIndex(tl => tl.id === action.payload.todoListId)
        // delete state[id] ЭТО НЕ ПОДОЙДЕТ, ИНАЧЕ БУДЕТ ПУСТОЙ ЭЛЕМЕНТ В МАССИВЕ И НУЖНО ПРОВЕРИТЬ, А НАЙДЕТ ЛИ ВАЩЕ ТАКОЙ ID
        if (id > -1) state.splice(id, 1)
      })
      .addCase(addTodoTC.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload.newTodolist,
          filter: action.payload.filter,
          entityStatus: action.payload.entityStatus,
          showTasks: action.payload.showTasks
        })
      })
      .addCase(updateTodoTitleTC.fulfilled, (state, action) => {
        const id = state.findIndex(tl => tl.id === action.payload.todoListId)
        state[id] = {...state[id], title: action.payload.title}
      })
  },
  selectors: {
    todolists: sliceState => sliceState,
  }
})

export const todolistsSlice = slice.reducer
export const todolistsActions = slice.actions
export const todolistsSelectors = slice.selectors

//! Thunk
const fetchTodolistsTC = createAppAsyncThunk<
  { todolists: TodolistType[] },
  void
>(
  `${slice.name}/fetchTodolists`,
  async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
    try {
      const res = await todolistsAPI.getTodolists()
      res.data.forEach(tl => {
        dispatch(tasksThunks.fetchTasksTC(tl.id)).then(() => {
          // dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
          dispatch(todolistsActions.showTasks({todoListId: tl.id}))
        })
      })
      return {todolists: res.data}
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      dispatch(appActions.setAppTodoStatus({statusTodo: 'failed'}))
      return rejectWithValue(null)
    } finally {
      dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
    }
  }
)
// export const _fetchTodolistsTC = () => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
//   todolistsAPI.getTodolists()
//     .then(res => {
//       dispatch(todolistsActions.fetchTodos({todolists: res.data}))
//     })
//     .catch((e: AxiosError) => {
//       dispatch(appActions.setAppError({error: e.message}))
//       dispatch(appActions.setAppStatus({appStatus: 'failed'}))
//     })
//     .finally(() => {
//       dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
//     })
// }

const deleteTodoTC = createAppAsyncThunk <
  {todoListId: string},
  string
>
(
  `${slice.name}/deleteTodo`,
    async (todoListId, thunkAPI) => {
      const {dispatch, rejectWithValue} = thunkAPI
      dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
      dispatch(todolistsActions.updateEntityStatusTodo({todoId: todoListId, entityStatus: 'loading'})) // перед запросом поставим в loading
      try{
        const res = await todolistsAPI.deleteTodolist(todoListId)
        if (res.data.resultCode === 0) {
          return {todoListId}
        } else {
          handleServerAppError(res.data, dispatch, 'Something wrong, try later')
          return rejectWithValue(null)
        }
      } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
      } finally {
        dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
        dispatch(todolistsActions.updateEntityStatusTodo({todoId: todoListId, entityStatus: 'success'})) // если все удачно, то в success
      }
    }
)
// export const _deleteTodoTC = (todoListId: string) => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
//   dispatch(todolistsActions.updateEntityStatusTodo({todoId: todoListId, entityStatus: 'loading'})) // перед запросом поставим в loading
//   todolistsAPI.deleteTodolist(todoListId)
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(todolistsActions.removeTodo({todoListId: todoListId}))
//       } else {
//         handleServerAppError(res.data, dispatch, 'Something wrong, try later')
//       }
//     })
//     .catch((e: AxiosError) => {
//       dispatch(appActions.setAppError({error: e.message}))
//       dispatch(appActions.setAppTodoStatus({statusTodo: 'failed'}))
//     })
//     .finally(() => {
//       dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
//       dispatch(todolistsActions.updateEntityStatusTodo({todoId: todoListId, entityStatus: 'success'})) // если все удачно, то в success
//     })
// }

const addTodoTC = createAppAsyncThunk<
  {newTodolist: TodolistType, filter: FilterValuesType, entityStatus: ServerResponseStatusType, showTasks: boolean},
  string
>(
  `${slice.name}/addTodo`,
  async(newTodolistTitle, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
    try{
      const res = await todolistsAPI.createTodolist(newTodolistTitle)
      if (res.data.resultCode === 0) {
        return {newTodolist: res.data.data.item, filter: 'all', entityStatus: 'idle', showTasks: true}
        // dispatch(addAppStatusAC('success'))
      } else {
        // handleServerAppError(res.data, dispatch)
        handleServerAppError(res.data, dispatch, 'Oops! Something gone wrong. Length should be less 100 symbols')
        return rejectWithValue(null)
      }
    } catch(e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    } finally {
      dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
    }
  }
)
// export const _addTodoTC = (newTodotitle: string) => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
//   todolistsAPI.createTodolist(newTodotitle)
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(todolistsActions.addTodo({newTodolist: res.data.data.item, filter: 'all', entityStatus: 'idle'}))
//         // dispatch(addAppStatusAC('success'))
//       } else {
//         // handleServerAppError(res.data, dispatch)
//         handleServerAppError<{
//           item: TodolistType
//         }>(res.data, dispatch, 'Oops! Something gone wrong. Length should be less 100 symbols')
//       }
//     })
//     .catch((e: AxiosError) => {
//       dispatch(appActions.setAppError({error: e.message}))
//       dispatch(appActions.setAppTodoStatus({statusTodo: 'failed'}))
//     })
//     .finally(() => {
//       dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
//     })
// }

const updateTodoTitleTC = createAppAsyncThunk<
  UpdateTodoArgs,
  UpdateTodoArgs
>(
  `${slice.name}/updateTodoTitle`,
  async (args, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
    try {
      const res = await todolistsAPI.updateTodolist(args)
      if (res.data.resultCode === 0) {
        return args
      } else {
        handleServerAppError(res.data, dispatch, 'Length should be less 100 symbols')
        return rejectWithValue(null)
      }
    } catch(e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    } finally {
      dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
    }

  }
)
// export const _updateTodoTitleTC = (todoListId: string, newTodotitle: string) => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppTodoStatus({statusTodo: 'loading'}))
//   todolistsAPI.updateTodolist(todoListId, newTodotitle)
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(todolistsActions.updateTodoTitle({todoListId: todoListId, newTodoTitle: newTodotitle}))
//       } else {
//         handleServerAppError(res.data, dispatch, 'Length should be less than 100 symbols')
//       }
//     })
//     .catch((e: AxiosError) => {
//       dispatch(appActions.setAppError({error: e.message}))
//       dispatch(appActions.setAppTodoStatus({statusTodo: 'failed'}))
//     })
//     .finally(() => {
//       dispatch(appActions.setAppTodoStatus({statusTodo: 'success'}))
//     })
// }

export const todolistsThunks = {fetchTodolistsTC, deleteTodoTC, addTodoTC, updateTodoTitleTC}
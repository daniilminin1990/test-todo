import {TaskPriorities, tasksApi, TaskStatuses, TaskType, UpdateTaskType} from "../api/tasks-api";
import {Dispatch} from "redux";
import {RootReducerType} from "../store/store";
import {appActions, ServerResponseStatusType} from "./appSlice";
import {createModelTask, errorFunctionMessage} from "../utilities/utilities";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "../common/actions/common.actions";
import {todolistsActions} from "./todolistsSlice";

export type TaskStateType = {
  [todoListId: string]: TasksWithEntityStatusType[]
}

export type TasksWithEntityStatusType = TaskType & {
  entityStatus: ServerResponseStatusType
}

export type UpdateTaskUtilityType = {
  title?: string,
  description?: string,
  status?: TaskStatuses,
  priority?: TaskPriorities,
  startDate?: string,
  deadline?: string
}

const slice = createSlice({
  name: 'tasks',
  initialState: {} as TaskStateType,
  reducers: {
    removeTask(state, action: PayloadAction<{ todoListId: string, taskId: string }>) {
      const id = state[action.payload.todoListId].findIndex(t => t.id === action.payload.taskId)
      if (id > -1) state[action.payload.todoListId].splice(id, 1)
    },
    addTask(state, action: PayloadAction<TasksWithEntityStatusType>) {
      state[action.payload.todoListId].unshift(action.payload)
    },
    updateTask(state, action: PayloadAction<{ todoListId: string, taskId: string, model: UpdateTaskUtilityType }>) {
      const tasks = state[action.payload.todoListId]
      const id = tasks.findIndex(t => t.id === action.payload.taskId)
      if (id > -1) {
        tasks[id] = {...tasks[id], ...action.payload.model}
      }
    },
    setTasks(state, action: PayloadAction<{ todoId: string, tasks: TaskType[] }>) {
      const {todoId, tasks} = action.payload
      state[todoId] = tasks.map(t => ({...t, entityStatus: 'idle'}))
    },
    updateTaskEntityStatus(state, action: PayloadAction<{
      todoId: string,
      taskId: string | undefined,
      entityStatus: ServerResponseStatusType
    }>) {
      const tasks = state[action.payload.todoId]
      const id = tasks.findIndex(t => t.id === action.payload.taskId)
      if (id > -1) {
        tasks[id] = {...tasks[id], entityStatus: action.payload.entityStatus}
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(todolistsActions.addTodo, (state, action) => {
        state[action.payload.newTodolist.id] = []
      })
      .addCase(todolistsActions.removeTodo, (state, action) => {
        delete state[action.payload.todoListId]
      })
      .addCase(todolistsActions.setTodos, (state, action) => {
        action.payload.todolists.forEach(tl => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodos, () => {
        return {}
      })
  },
  // selectors: {
  //   tasksState: sliceState => sliceState as TaskStateType
  // }
})

export const tasksActions = slice.actions

export const tasksSlice = slice.reducer
// export const tasksSelectors = slice.selectors

//! Thunk
export const setTasksTC = (todoId: string) => (dispatch: Dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(appActions.setAppStatusTask({statusTask: 'loading'}))
    tasksApi.getTasks(todoId)
      .then(res => {
        dispatch(tasksActions.setTasks({todoId, tasks: res.data.items}))
        resolve(res)
      })
      .catch((e: AxiosError) => {
        appActions.setAppError({error: e.message})
        reject(e)
      })
      .finally(() => {
        dispatch(appActions.setAppStatusTask({statusTask: 'success'}))
      })
  })
}

export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusTask({statusTask: 'loading'}))
  dispatch(tasksActions.updateTaskEntityStatus({todoId, taskId, entityStatus: 'loading'}))
  tasksApi.deleteTask(todoId, taskId)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(tasksActions.removeTask({todoListId: todoId, taskId}))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Something wrong, try later')
      }
    })
    .catch((e: AxiosError) => {
      appActions.setAppError({error: e.message})
    })
    .finally(() => {
      dispatch(appActions.setAppStatusTask({statusTask: 'success'}))
      dispatch(tasksActions.updateTaskEntityStatus({todoId, taskId, entityStatus: 'success'}))
    })
}
export const addTaskTC = (todoId: string, newTaskTitle: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusTask({statusTask: 'loading'}))
  tasksApi.createTask(todoId, newTaskTitle)
    .then(res => {
      if (res.data.resultCode === 0) {
        const taskToServer: TasksWithEntityStatusType = {...res.data.data.item, entityStatus: 'idle'}
        dispatch(tasksActions.addTask(taskToServer))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Oops! Something gone wrong. Length should be less 100 symbols')
      }
    })
    .catch((e: AxiosError) => {
      appActions.setAppError({error: e.message})
    })
    .finally(() => {
      dispatch(appActions.setAppStatusTask({statusTask: 'success'}))
    })
}
export const updateTaskTC = (todoListId: string, taskId: string, utilityModel: UpdateTaskUtilityType) => (dispatch: Dispatch, getState: () => RootReducerType) => {
  dispatch(appActions.setAppStatusTask({statusTask: 'loading'}))
  dispatch(tasksActions.updateTaskEntityStatus({todoId: todoListId, taskId, entityStatus: 'loading'}))
  const state = getState()
  const task = state.tasksReducer[todoListId].find(tl => tl.id === taskId)

  if (!task) {
    throw new Error('Task not found in the state')
  }
  const elementToUpdate: UpdateTaskType = createModelTask(task, utilityModel)
  tasksApi.updateTask(todoListId, taskId, elementToUpdate)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(tasksActions.updateTask({todoListId, taskId, model: elementToUpdate}))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Length should be less than 100 symbols')
      }
    })
    .catch((e: AxiosError) => {
      appActions.setAppError({error: e.message})
    })
    .finally(() => {
      dispatch(appActions.setAppStatusTask({statusTask: 'success'}))
      dispatch(tasksActions.updateTaskEntityStatus({todoId: todoListId, taskId, entityStatus: 'success'}))
    })
}


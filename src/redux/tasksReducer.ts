import {
  addTodoAC,
  AddTodoACType, FilterValuesType,
  removeTodoAC,
  RemoveTodoACType,
  setTodosAC,
  SetTodosActionType
} from "./todolistReducer";
import {TaskPriorities, tasksApi, TaskStatuses, TaskType, UpdateTaskType} from "../api/tasks-api";
import {Dispatch} from "redux";
import {RootReducerType} from "../store/store";
import {ServerResponseStatusType, setAppErrorAC, setAppStatusTaskAC} from "./appReducer";
import {createModelTask, errorFunctionMessage} from "../utilities/utilities";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TodolistType} from "../api/todolists-api";

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

const initStateTasks: TaskStateType = {}

const slice = createSlice({
  name: 'tasks',
  initialState: initStateTasks,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string }>) {
      const id = state[action.payload.todoListId].findIndex(t => t.id === action.payload.taskId)
      if (id > -1) state[action.payload.todoListId].splice(id, 1)
    },
    addTaskAC(state, action: PayloadAction< TasksWithEntityStatusType >) {
      state[action.payload.todoListId].unshift(action.payload)
    },
    updateTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string, model: UpdateTaskUtilityType }>) {
      const tasks = state[action.payload.todoListId]
      const id = tasks.findIndex(t => t.id === action.payload.taskId)
      if (id > -1) {
        tasks[id] = {...tasks[id], ...action.payload.model}
      }
    },
    setTasksAC(state, action: PayloadAction<{ todoId: string, tasks: TaskType[] }>) {
      const {todoId, tasks} = action.payload
      state[todoId] = tasks.map(t => ({...t, entityStatus: 'idle'}))
    },
    updateTaskEntityStatusAC(state, action: PayloadAction<{
      todoId: string,
      taskId: string | undefined,
      entityStatus: ServerResponseStatusType
    }>) {
      const tasks = state[action.payload.todoId]
      const id = tasks.findIndex(t => t.id === action.payload.taskId)
      if (id > -1) {
        tasks[id] = {...tasks[id], entityStatus: action.payload.entityStatus}
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(addTodoAC, (state, action) => {
      state[action.payload.newTodolist.id] = []
    });
    builder.addCase(removeTodoAC, (state, action) => {
      delete state[action.payload.todoListId]
    });
    builder.addCase(setTodosAC, (state, action) => {
      action.payload.todolists.forEach(tl => {
        state[tl.id] = []
      })
    })
  }
})

export const {
  removeTaskAC,
  addTaskAC,
  updateTaskAC,
  setTasksAC,
  updateTaskEntityStatusAC
} = slice.actions

export const tasksReducer = slice.reducer

// export const tasksReducer = (state: TaskStateType = initStateTasks, action: MutualTaskType): TaskStateType => {
//   switch (action.type) {
//     case 'REMOVE-TASK': {
//       const a = action.payload
//       return {...state, [a.todoListId]: state[a.todoListId].filter(t => t.id !== a.taskId)}
//     }
//     case "ADD-TASK": {
//       const a = action.payload
//       console.log('A-PAYLOAD', a)
//       return {...state, [a.todoListId]: [a, ...state[a.todoListId]]}
//     }
//     case "UPDATE-TASK": {
//       const a = action.payload
//       return {...state, [a.todoListId]: state[a.todoListId].map(t => t.id === a.taskId ? {...t, ...a.model} : t)}
//     }
//     case "UPDATE-TASK-TITLE": {
//       const a = action.payload
//       return {
//         ...state,
//         [a.todoListId]: state[a.todoListId].map(t => t.id === a.taskId ? {...t, title: a.updTaskTitle} : t)
//       }
//     }
//     // case "ADD-TODO": {
//     case addTodoAC.type: {
//       const a = action.payload
//       // return {...state, [a.todoListId]: []}
//       return {...state, [a.newTodolist.id]: []}
//     }
//     // case 'REMOVE-TODO': {
//     case removeTodoAC.type: {
//       const a = action.payload
//       const {[a.todoListId]: rrr, ...rest} = state
//       return rest
//     }
//     // case 'SET-TODOS': {
//     case setTodosAC.type: {
//       const copyState = {...state}
//       action.payload.todolists.forEach(tl => {
//         copyState[tl.id] = []
//       })
//       return copyState
//     }
//     case "SET-TASKS": {
//       return {...state, [action.todoId]: action.tasks.map(t => ({...t, entityStatus: 'idle'}))}
//     }
//     case "UPDATE-TASK-ENTITY-STATUS": {
//       const a = action.payload
//       return {
//         ...state,
//         [a.todoId]: state[a.todoId].map(t => t.id === a.taskId ? {...t, entityStatus: a.entityStatus} : t)
//       }
//     }
//     default: {
//       return state
//     }
//   }
// }
// export type MutualTaskType = RemoveTaskAC
//   | AddTaskAC
//   | ChangeTaskStatusAC
//   | UpdTaskTitleAC
//   | AddTodoACType
//   | RemoveTodoACType
//   | SetTodosActionType
//   | SetTasksACType
//   | UpdateTaskEntityStatusAC
//
// export type RemoveTaskAC = ReturnType<typeof removeTaskAC>
//
// export const removeTaskAC = (todoListId: string, taskId: string) => {
//   return {
//     type: 'REMOVE-TASK',
//     payload: {
//       todoListId,
//       taskId
//     }
//   } as const
// }
//
// export type AddTaskAC = ReturnType<typeof addTaskAC>
// export const addTaskAC = (task: TasksWithEntityStatusType) => {
//   console.log('TASK', task.todoListId)
//   return {
//     type: 'ADD-TASK',
//     payload: task
//   } as const
// }
//
// export type ChangeTaskStatusAC = ReturnType<typeof updateTaskAC>
// export const updateTaskAC = (todoListId: string, taskId: string, model: UpdateTaskUtilityType) => {
//   return {
//     type: 'UPDATE-TASK',
//     payload: {
//       todoListId,
//       taskId,
//       model
//     }
//   } as const
// }
//
// export type UpdTaskTitleAC = ReturnType<typeof updTaskTitleAC>
// export const updTaskTitleAC = (todoListId: string, taskId: string, updTaskTitle: string) => {
//   return {
//     type: 'UPDATE-TASK-TITLE',
//     payload: {
//       todoListId,
//       taskId,
//       updTaskTitle
//     }
//   } as const
// }
//
// // ! AC для ENTITY ЕБАНЫЙ СТАТУС ДЛЯ ТАСКИ ЕБУЧЕЙ
// export type UpdateTaskEntityStatusAC = ReturnType<typeof updateTaskEntityStatusAC>
// export const updateTaskEntityStatusAC = (todoId: string, taskId: string | undefined, entityStatus: ServerResponseStatusType) => {
//   return {
//     type: 'UPDATE-TASK-ENTITY-STATUS',
//     payload: {
//       todoId,
//       taskId,
//       entityStatus
//     }
//   } as const
// }
//
// //! ActionCreator для сета тасок с сервера
// export type SetTasksACType = ReturnType<typeof setTasksAC>
// export const setTasksAC = (todoId: string, tasks: TaskType[]) => {
//   return {
//     type: "SET-TASKS",
//     todoId,
//     tasks
//   } as const
// }

//! Thunk
export const setTasksTC = (todoId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusTaskAC({statusTask: 'loading'}))
  tasksApi.getTasks(todoId)
    .then(res => {
      dispatch(setTasksAC({todoId, tasks: res.data.items}))
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppStatusTaskAC({statusTask: 'success'}))
    })
}

export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusTaskAC({statusTask: 'loading'}))
  dispatch(updateTaskEntityStatusAC({todoId, taskId, entityStatus: 'loading'}))
  tasksApi.deleteTask(todoId, taskId)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(removeTaskAC({todoListId: todoId, taskId}))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Something wrong, try later')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppStatusTaskAC({statusTask: 'success'}))
      dispatch(updateTaskEntityStatusAC({todoId, taskId, entityStatus: 'success'}))
    })
}
export const addTaskTC = (todoId: string, newTaskTitle: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusTaskAC({statusTask: 'loading'}))
  tasksApi.createTask(todoId, newTaskTitle)
    .then(res => {
      if (res.data.resultCode === 0) {
        const taskToServer: TasksWithEntityStatusType = {...res.data.data.item, entityStatus: 'idle'}
        dispatch(addTaskAC(taskToServer))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Oops! Something gone wrong. Length should be less 100 symbols')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppStatusTaskAC({statusTask: 'success'}))
    })
}
export const updateTaskTC = (todoListId: string, taskId: string, utilityModel: UpdateTaskUtilityType) => (dispatch: Dispatch, getState: () => RootReducerType) => {
  dispatch(setAppStatusTaskAC({statusTask: 'loading'}))
  dispatch(updateTaskEntityStatusAC({todoId: todoListId, taskId, entityStatus: 'loading'}))
  const state = getState()
  const task = state.tasksReducer[todoListId].find(tl => tl.id === taskId)

  if (!task) {
    throw new Error('Task not found in the state')
  }
  const elementToUpdate: UpdateTaskType = createModelTask(task, utilityModel)
  tasksApi.updateTask(todoListId, taskId, elementToUpdate)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(updateTaskAC({ todoListId, taskId,model: elementToUpdate}))
      } else {
        errorFunctionMessage(res.data, dispatch, 'Length should be less than 100 symbols')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppStatusTaskAC({statusTask: 'success'}))
      dispatch(updateTaskEntityStatusAC({todoId: todoListId, taskId, entityStatus:'success'}))
    })
}


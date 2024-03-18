import {v1} from "uuid";
import {AddTodoACType, RemoveTodoACType, SetTodosActionType} from "./todolistReducer";
import {TaskPriorities, tasksApi, TasksStatuses, TaskType, UpdateTaskType} from "../api/tasks-api";
import {Dispatch} from "redux";
import {RootReducerType} from "../store/store";
import {addAppTaskStatusAC, AddAppTaskStatusACType, ServerResponseStatusType, setAppErrorAC} from "./appReducer";
import {errorFunctionMessage} from "../utilities/utilities";
import {AxiosError} from "axios";

export type TaskStateType = {
  [todolistId: string]: TasksWithEntityStatusType[]
}

export type TasksWithEntityStatusType = TaskType & {
  entityStatus: ServerResponseStatusType
}

export type UpdateTaskUtilityType = {
  title?: string,
  description?: string,
  status?: TasksStatuses,
  priority?: TaskPriorities,
  startDate?: string,
  deadline?: string
}

const initStateTasks: TaskStateType = {}
export const tasksReducer = (state: TaskStateType = initStateTasks, action: MutualTaskType): TaskStateType => {
  switch (action.type) {
    case 'REMOVE-TASK': {
      const a = action.payload
      return {...state, [a.todolistId]: state[a.todolistId].filter(t => t.id !== a.taskId)}
    }
    // case "ADD-TASK": {
    //   const a = action.payload
    //   return {...state, [a.todolistId]: [a.task, ...state[a.todolistId]]}
    // }
    case "ADD-TASK": {
      const a = action.payload
      let newTask: TasksWithEntityStatusType = {
        id: v1(), title: a.newTaskTitle, status: TasksStatuses.New,
        todolistId: a.todolistId, description: '', order: 0,
        startDate: '', deadline: '', addedDate: '', priority: TaskPriorities.Low, entityStatus: 'idle'
      }
      return {...state, [a.todolistId]: [newTask, ...state[a.todolistId]]}
    }
    case "UPDATE-TASK": {
      const a = action.payload
      // return {...state, [a.todolistId]: state[a.todolistId].map(t => t.id === a.taskId ? {...t, status: a.status} : t)}
      return {...state, [a.todolistId]: state[a.todolistId].map(t => t.id === a.taskId ? {...t, ...a.model} : t)}
    }
    case "UPDATE-TASK-TITLE": {
      const a = action.payload
      return {
        ...state,
        [a.todolistId]: state[a.todolistId].map(t => t.id === a.taskId ? {...t, title: a.updTaskTitle} : t)
      }
    }
    case "ADD-TODO": {
      const a = action.payload
      // return {...state, [a.todolistId]: []}
      return {...state, [a.newTodolist.id]: []}
    }
    case 'REMOVE-TODO': {
      const a = action.payload
      const {[a.todolistId]: rrr, ...rest} = state
      return rest
    }
    case "SET-TODO": {
      const copyState = {...state}
      action.todolists.forEach(tl => {
        copyState[tl.id] = []
      })
      return copyState
    }
    case "SET-TASKS": {
      // const copyState = {...state}
      // copyState[action.todoId] = action.tasks
      return {...state, [action.todoId]: action.tasks.map(t => ({...t, entityStatus: 'idle'}))}
    }
    case "UPDATE-TASK-ENTITY-STATUS": {
      const a = action.payload
      return {
        ...state,
        [a.todoId]: state[a.todoId].map(t => t.id === a.taskId ? {...t, entityStatus: a.entityStatus} : t)
      }
    }
    default: {
      return state
    }
  }
}
export type MutualTaskType = RemoveTaskAC
  | AddTaskAC
  | ChangeTaskStatusAC
  | UpdTaskTitleAC
  | AddTodoACType
  | RemoveTodoACType
  | SetTodosActionType
  | SetTasksACType
  | UpdateTaskEntityStatusAC

export type RemoveTaskAC = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (todolistId: string, taskId: string) => {
  return {
    type: 'REMOVE-TASK',
    payload: {
      todolistId,
      taskId
    }
  } as const
}

export type AddTaskAC = ReturnType<typeof addTaskAC>
// export const addTaskAC = (todolistId: string, newTask: TaskType) => {
//   return {
//     type: 'ADD-TASK',
//     payload: {
//       todolistId,
//       task: newTask
//     }
//   } as const
// }
export const addTaskAC = (todolistId: string, newTaskTitle: string) => {
  return {
    type: 'ADD-TASK',
    payload: {
      todolistId,
      newTaskTitle,
    }
  } as const
}

export type ChangeTaskStatusAC = ReturnType<typeof updateTaskAC>
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateTaskUtilityType) => {
  return {
    type: 'UPDATE-TASK',
    payload: {
      todolistId,
      taskId,
      model
    }
  } as const
}

export type UpdTaskTitleAC = ReturnType<typeof updTaskTitleAC>
export const updTaskTitleAC = (todolistId: string, taskId: string, updTaskTitle: string) => {
  return {
    type: 'UPDATE-TASK-TITLE',
    payload: {
      todolistId,
      taskId,
      updTaskTitle
    }
  } as const
}

// ! AC для ENTITY ЕБАНЫЙ СТАТУС ДЛЯ ТАСКИ ЕБУЧЕЙ
export type UpdateTaskEntityStatusAC = ReturnType<typeof updateTaskEntityStatusAC>
export const updateTaskEntityStatusAC = (todoId: string, taskId: string | undefined, entityStatus: ServerResponseStatusType) => {
  return {
    type: 'UPDATE-TASK-ENTITY-STATUS',
    payload: {
      todoId,
      taskId,
      entityStatus
    }
  } as const
}

//! ActionCreator для сета тасок с сервера
export type SetTasksACType = ReturnType<typeof setTasksAC>
export const setTasksAC = (todoId: string, tasks: TaskType[]) => {
  return {
    type: "SET-TASKS",
    todoId,
    tasks
  } as const
}

//! Thunk
export const setTasksTC = (todoId: string) => (dispatch: Dispatch) => {
  // dispatch(addAppTaskStatusAC('loading'))
  tasksApi.getTasks(todoId)
    .then(res => {
      dispatch(setTasksAC(todoId, res.data.items))
    })
    .catch((e: AxiosError) => {
      setAppErrorAC(e.message)
    })
    .finally(() => {
      dispatch(addAppTaskStatusAC('success'))
    })
}

export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(addAppTaskStatusAC('loading'))
  dispatch(updateTaskEntityStatusAC(todoId, taskId, 'loading'))
  tasksApi.deleteTask(todoId, taskId)
    .then(res => {
      dispatch(removeTaskAC(todoId, taskId))
      dispatch(addAppTaskStatusAC('success'))
      dispatch(updateTaskEntityStatusAC(todoId, taskId, 'success'))
    })
    .catch((e: AxiosError) => {
      setAppErrorAC(e.message)
    })
}

// export const addTaskTC = (todoId: string, newTask: TaskType) => (dispatch: Dispatch) => {
//   tasksApi.createTask(todoId, newTask)
//     .then(res => {
//       dispatch(addTaskAC(todoId, newTask))
//     })
// }
// }
export const addTaskTC = (todoId: string, newTaskTitle: string) => (dispatch: Dispatch) => {
  dispatch(addAppTaskStatusAC('loading'))
  tasksApi.createTask(todoId, newTaskTitle)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(addTaskAC(todoId, newTaskTitle))
        dispatch(addAppTaskStatusAC('success'))
      } else {
        errorFunctionMessage(res.data, dispatch)
      }
      return res
    })
    .catch((e: AxiosError) => {
      setAppErrorAC(e.message)
    })
}
export const updateTaskTC = (todolistId: string, taskId: string, utilityModel: UpdateTaskUtilityType) => (dispatch: Dispatch, getState: () => RootReducerType) => {
  dispatch(addAppTaskStatusAC('loading'))
  dispatch(updateTaskEntityStatusAC(todolistId, taskId, 'loading'))
  const state = getState()
  const task = state.tasksReducer[todolistId].find(tl => tl.id === taskId)

  if (!task) {
    throw new Error('Task not found in the state')
    console.warn('Task not found in the state')
    return
  }
  const apiModel: UpdateTaskType = {
    status: task.status,
    startDate: task.deadline,
    title: task.title,
    priority: task.priority,
    description: task.description,
    deadline: task.deadline,
    ...utilityModel
  }
  tasksApi.updateTask(todolistId, taskId, apiModel)
    .then(res => {
      console.log(res)
      console.log(res.data.resultCode)
      if (res.data.resultCode === 0) {
        dispatch(updateTaskAC(todolistId, taskId, apiModel))
        dispatch(addAppTaskStatusAC('success'))
        dispatch(updateTaskEntityStatusAC(todolistId, taskId, 'success'))
      } else {
        errorFunctionMessage<UpdateTaskUtilityType>(res.data, dispatch)
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC(e.message)
    })
    .finally(() => {
      dispatch(addAppTaskStatusAC('success'))
    })
}


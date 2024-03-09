import {v1} from "uuid";
import {AddTodoACType, RemoveTodoACType, SetTodosActionType, todolistId1, todolistId2} from "./todolistReducer";
import {TaskPriorities, tasksApi, TasksStatuses, TaskType} from "../api/tasks-api";
import {Dispatch} from "redux";

export type TaskStateType = {
  [todolistId: string]: TaskType[]
}

const initStateTasks: TaskStateType = {
  // [todolistId1]: [
  //   {id: v1(), title: 'Купить молоко', status: TasksStatuses.Completed,
  //     todolistId: todolistId1, description: '', order: 0,
  //     startDate: '', deadline: '', addedDate: '', priority: TaskPriorities.Low},
  //   {id: v1(), title: 'Сходить побегать', status: TasksStatuses.New,
  //     todolistId: todolistId1, description: '', order: 0,
  //     startDate: '', deadline: '', addedDate: '', priority: TaskPriorities.Low},
  //   {id: v1(), title: 'Понюхать цветы', status: TasksStatuses.New,
  //     todolistId: todolistId1, description: '', order: 0,
  //     startDate: '', deadline: '', addedDate: '', priority: TaskPriorities.Low},
  // ],
  // [todolistId2]: [
  //   {id: v1(), title: 'Купить молоко', status: TasksStatuses.Completed,
  //     todolistId: todolistId2, description: '', order: 0,
  //     startDate: '', deadline: '', addedDate: '', priority: TaskPriorities.Low},
  //   {id: v1(), title: 'Понюхать цветы', status: TasksStatuses.New,
  //     todolistId: todolistId2, description: '', order: 0,
  //     startDate: '', deadline: '', addedDate: '', priority: TaskPriorities.Low},
  // ]
}
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
      let newTask: TaskType = {
        id: v1(), title: a.newTaskTitle, status: TasksStatuses.New,
        todolistId: a.todolistId, description: '', order: 0,
        startDate: '', deadline: '', addedDate: '', priority: TaskPriorities.Low
      }
      return {...state, [a.todolistId]: [newTask, ...state[a.todolistId]]}
    }
    case "CHANGE-TASK-STATUS": {
      const a = action.payload
      return {...state, [a.todolistId]: state[a.todolistId].map(t => t.id === a.taskId ? {...t, status: a.status} : t)}
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
      return {...state, [a.todolistId]: []}
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
      const copyState = {...state}
      copyState[action.todoId] = action.tasks
      return copyState
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
      newTaskTitle
    }
  } as const
}

export type ChangeTaskStatusAC = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (todolistId: string, taskId: string, status: TasksStatuses) => {
  return {
    type: 'CHANGE-TASK-STATUS',
    payload: {
      todolistId,
      taskId,
      status
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
  tasksApi.getTasks(todoId)
    .then(res => {
      dispatch(setTasksAC(todoId, res.data.items))
    })
}

export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
  tasksApi.deleteTask(todoId, taskId)
    .then(res => {
      dispatch(removeTaskAC(todoId, taskId))
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
  tasksApi.createTask(todoId, newTaskTitle)
    .then(res => {
      dispatch(addTaskAC(todoId, newTaskTitle))
    })
}

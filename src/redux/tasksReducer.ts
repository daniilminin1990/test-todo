import {TaskStateType, TaskType} from "../App";
import {v1} from "uuid";
import {AddTodoACType, RemoveTodoACType, todolistId1, todolistId2} from "./todolistReducer";



const initStateTasks: TaskStateType = {
  [todolistId1]: [
    {id: v1(), taskTitle: 'Купить молоко', isDone: true,},
    {id: v1(), taskTitle: 'Сходить побегать', isDone: false,},
    {id: v1(), taskTitle: 'Понюхать цветы', isDone: false,},
  ],
  [todolistId2]: [
    {id: v1(), taskTitle: 'Купить молоко', isDone: true,},
    {id: v1(), taskTitle: 'Понюхать цветы', isDone: false,},
  ]
}
export const tasksReducer = (state: TaskStateType = initStateTasks, action: MutualTaskType): TaskStateType  => {
  switch (action.type) {
    case 'REMOVE-TASK': {
      return {...state, [action.payload.todolistId]:state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)}
    }
    case "ADD-TASK": {
      let newTask: TaskType = { id: v1(), taskTitle: action.payload.newTaskTitle, isDone: false }
      return {...state, [action.payload.todolistId]:[newTask, ...state[action.payload.todolistId]]}
    }
    case "CHANGE-TASK-STATUS": {
      return {...state, [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {...t, isDone: action.payload.isDone} : t)}
    }
    case "UPDATE-TASK-TITLE": {
      return {...state, [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {...t, taskTitle: action.payload.updTaskTitle} : t)}
    }
    case "ADD-TODO":{
      return {...state, [action.payload.todolistId]:[]}
    }
    case 'REMOVE-TODO': {
      const {[action.payload.todolistId]:rrr, ...rest} = state
      return rest
    }
    default: {
      return state
    }
  }
}
export type MutualTaskType = RemoveTaskAC | AddTaskAC | ChangeTaskStatusAC | UpdTaskTitleAC | AddTodoACType | RemoveTodoACType

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
export const addTaskAC = (todolistId: string, newTaskTitle: string) => {
  return {
    type: 'ADD-TASK',
    payload: {
      todolistId,
      newTaskTitle
    }
  }as const
}

export type ChangeTaskStatusAC = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (todolistId: string, taskId: string, isDone: boolean) => {
  return {
    type: 'CHANGE-TASK-STATUS',
    payload: {
      todolistId,
      taskId,
      isDone
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


import { FilterValuesType, TaskStateType, TaskType } from './../App';
import { v1 } from "uuid"
import { ACTION_TYPES } from "./actionTypes"
import { AddTodoType, RemoveTodoType } from './todolistsReducer';

export const todolistsReducer = (state: TaskStateType, action: MutualTypes): TaskStateType=> {
  switch(action.type){
    case ACTION_TYPES.tasks.addTask: {
      const el = action.payload
      const newTask = {id: v1(), taskTitle: el.newTaskTitle, isDone: false}
      return {
        ...state, 
        [el.todolistId]: [newTask, 
          ...state[el.todolistId]]
      }
    }
    case ACTION_TYPES.tasks.removeTask: {
      const el = action.payload
      return {
        ...state,
        [el.todolistId]:
          state[el.todolistId].filter(t => {
            return t.id !== el.taskId})
      }
    }
    case ACTION_TYPES.tasks.changeTaskStatus: {
      const el = action.payload
      return {...state, [el.todolistId]: state[el.todolistId]
      .map(t => t.id === el.taskId ? {...t, isDone: el.isDone} : t)}
    }
    case ACTION_TYPES.tasks.updateTask: {
      const el = action.payload
      return {
        ...state,
        [el.todolistId]: state[el.todolistId].map(t => t.id === el.taskId
          ? {...t, taskTitle: el.newTaskTitle}
          : t)
      }
    }
    case 'TL/TODOLISTS/ADD-TODO': {
      const el = action.payload
      return {...state, [el.todolistId]: []}
    }
    case 'TL/TODOLISTS/REMOVE-TODO': {
      const el = action.payload
      // const {[el.todolistId]:restTodo, ...restState} = state
      // return restState
      const copyState = {...state}
      delete copyState[el.todolistId]
      return state
    }
    default:return state
  }
}

type MutualTypes = AddTaskType | RemoveTaskType 
| ChangeTaskStatusType 
| UpdTaskTitleType 
| AddTodoType
| RemoveTodoType

export type AddTaskType = ReturnType<typeof addTaskAC>

export const addTaskAC = (todolistId: string, newTaskTitle: string) => ({
  type: ACTION_TYPES.tasks.addTask,
  payload: {
    todolistId,
    newTaskTitle
  }
})

export type RemoveTaskType = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (todolistId: string, taskId: string) => ({
  type: ACTION_TYPES.tasks.removeTask,
  payload: {
    todolistId,
    taskId
  }
})

export type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>

export const changeTaskStatusAC = (todolistId: string, taskId: string, isDone: boolean) => ({
  type: ACTION_TYPES.tasks.changeTaskStatus,
  payload: {
    todolistId,
    taskId,
    isDone
  }
})

export type UpdTaskTitleType = ReturnType<typeof updTaskTitleAC>

export const updTaskTitleAC = (todolistId: string, taskId: string, newTaskTitle: string) => ({
  type: ACTION_TYPES.tasks.updateTask,
  payload: {
    todolistId,
    taskId,
    newTaskTitle
  }
})
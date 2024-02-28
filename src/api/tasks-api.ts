import {instance} from "./todolists-api";
import axios from "axios";

export type TaskType = {
  description: string
  title: string
  completed: boolean
  status: number
  priority: number
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}

export type UpdateTaskType = Omit<TaskType, 'id' | 'todolistId' | 'order' | 'addedDate'>

export type GetTasksResponse = {
  items: Array<TaskType>,
  totalCount: number,
  error: string
}

type ResponseType<D = {}> = {
  resultCode: number,
  messages: Array<string>,
  data: D
}

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  createTask(todolistId: string, title: string){
    return instance.post<ResponseType>(`todo-lists/${todolistId}/tasks`, {title})
  },
  deleteTask(todolistId: string, taskId: string){
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask(todolistId: string, taskId: string, title: string){
    return instance.put<UpdateTaskType>(`todo-lists/${todolistId}/tasks/${taskId}`, {title})
  }
}
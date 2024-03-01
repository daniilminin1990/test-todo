import {instance} from "./todolists-api";
import axios from "axios";

export type UpdateTaskType = Omit<TaskType, 'id' | 'todolistId' | 'order' | 'addedDate' | 'completed'>

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

export type TaskType = {
  id: string
  todolistId: string
  description: string
  order: number
  startDate: string
  deadline: string
  addedDate: string
  title: string
  status: TasksStatuses
  priority: TaskPriorities
}

export enum TasksStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  High = 2,
  Urgent = 3,
  Later = 4
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
  // updateTask(todolistId: string, taskId: string, title: string){
  updateTask(todolistId: string, taskId: string, model: UpdateTaskType){
    return instance.put<UpdateTaskType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  }
}
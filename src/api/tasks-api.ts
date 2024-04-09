import {instance} from "./todolists-api";
import axios, {AxiosResponse} from "axios";
import {ServerResponseStatusType} from "../redux/appSlice";

export type UpdateTaskType = {
  description: string
  startDate: string
  deadline: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
}

export type GetTasksResponse = {
  items: Array<TaskType>,
  totalCount: number,
  error: string | null
}

type ResponseType<D = {}> = {
  resultCode: number,
  messages: Array<string>,
  data: D
}

export type TaskType = {
  id: string
  todoListId: string
  order: number
  addedDate: string
  description: string
  startDate: string
  deadline: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
}

export enum TaskStatuses {
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
  getTasks(todoListId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todoListId}/tasks`)
  },
  // createTask(todoListId: string, newTask: TaskType){
  //   return instance.post<ResponseType<TaskType>>(`todo-lists/${todoListId}/tasks`, {newTask})
  // },
  createTask(arg: CreateTaskArgs){
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todoListId}/tasks`, {title: arg.title})
  },
  // createTask(todoListId: string, title: string){
  //   return instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todoListId}/tasks`, {title})
  // },
  deleteTask(args: DeleteTaskArgs){
    return instance.delete<ResponseType>(`todo-lists/${args.todoListId}/tasks/${args.taskId}`)
  },
  // updateTask(todoListId: string, taskId: string, title: string){
  updateTask(todoListId: string, taskId: string, model: UpdateTaskType){
    return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todoListId}/tasks/${taskId}`, model)
  },
  reorderTasks(args: ReorderTasksArgs){
    return instance.put<ResponseType>(`todo-lists/${args.todoListId}/tasks/${args.startDragId}/reorder`, {
      putAfterItemId: args.endShiftId
    })
  }
}

export type CreateTaskArgs = {todoListId: string, title: string}
export type DeleteTaskArgs = {todoListId: string, taskId: string}
export type ReorderTasksArgs = { todoListId: string, startDragId: string, endShiftId: string | null }
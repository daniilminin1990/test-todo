import axios, {AxiosResponse} from "axios";

// export const settings = {
//   withCredentials: true,
//   headers: {
//     "API-KEY": "ccce7055-9c90-4467-bfd9-5c1357460985"
//   }
// }

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    "API-KEY": "ccce7055-9c90-4467-bfd9-5c1357460985"
  }
})

export type TodolistType = {
  id: string,
  title: string,
  addedDate: string,
  order: number
}

export type ResponseType<D = {}> = {
  resultCode: number,
  messages: Array<string>,
  data: D
}

export const todolistsAPI = {
  getTodolists() {
    // const promise = axios.get<Array<TodolistType>>("https://social-network.samuraijs.com/api/1.1/todo-lists", settings)
    return instance.get<Array<TodolistType>>("todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{item: TodolistType}>, AxiosResponse<ResponseType<{item: TodolistType}>>, { title: string }>("todo-lists", {title})
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(args: UpdateTodoArgs) {
    return instance.put<ResponseType>(`todo-lists/${args.todoListId}`, {title: args.title})
  },
  reorderTodolist(args: ReorderTodoListArgs) {
    return instance.put<ResponseType>(`todo-lists/${args.startDragId}/reorder`, {putAfterItemId: args.endShiftId})
  }
}

export type UpdateTodoArgs = {
  todoListId: string, title: string
}

export type ReorderTodoListArgs = {
  startDragId: string,
  endShiftId: string | null
}
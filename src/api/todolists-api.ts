import axios, { AxiosResponse } from "axios";
import { instance } from "../common/instance/instance";
import { BasicResponseType } from "../common/types";
import { ReorderTodoListArgs, TodolistType, UpdateTodoArgs } from "./todolists-api.types";

export const todolistsAPI = {
  getTodolists() {
    // const promise = axios.get<Array<TodolistType>>("https://social-network.samuraijs.com/api/1.1/todo-lists", settings)
    return instance.get<Array<TodolistType>>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<BasicResponseType<{ item: TodolistType }>>("todo-lists", { title });
  },
  deleteTodolist(id: string) {
    return instance.delete<BasicResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(args: UpdateTodoArgs) {
    return instance.put<BasicResponseType>(`todo-lists/${args.todoListId}`, {
      title: args.title,
      // addedDate: "2024-04-11T20:06:17.457",
      // order: -999,
    });
  },
  reorderTodolist(args: ReorderTodoListArgs) {
    return instance.put<BasicResponseType>(`todo-lists/${args.startDragId}/reorder`, { putAfterItemId: args.endShiftId });
  },
};

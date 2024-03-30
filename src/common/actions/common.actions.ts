import {createAction, nanoid} from "@reduxjs/toolkit";
import {TaskStateType} from "../../redux/tasksSlice";
import {TodoUIType} from "../../redux/todolistsSlice";

export type ClearTasksAndTodosType = {
  tasks: TaskStateType,
  todos: TodoUIType[]
}
export const clearTasksAndTodos = createAction('common/clear-tasks-todos')
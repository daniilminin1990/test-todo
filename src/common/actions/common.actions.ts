import {createAction, nanoid} from "@reduxjs/toolkit";
import {TaskStateType} from "../../redux/tasksReducer";
import {TodoUIType} from "../../redux/todolistReducer";

export type ClearTasksAndTodosType = {
  tasks: TaskStateType,
  todos: TodoUIType[]
}
export const clearTasksAndTodos = createAction('common/clear-tasks-todos')
import { TaskPriorities, TaskStatuses } from "../common/enums/enums";
import { BasicResponseType } from "../common/types";
import { instance } from "../common/instance/instance";
import { CreateTaskArgs, DeleteTaskArgs, GetTasksResponse, ReorderTasksArgs, TaskType, UpdateTaskType } from "./tasks-api.types";

export const tasksApi = {
  getTasks(todoListId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todoListId}/tasks`);
  },
  // createTask(todoListId: string, newTask: TaskType){
  //   return instance.post<BasicResponseType<TaskType>>(`todo-lists/${todoListId}/tasks`, {newTask})
  // },
  createTask(arg: CreateTaskArgs) {
    return instance.post<BasicResponseType<{ item: TaskType }>>(`todo-lists/${arg.todoListId}/tasks`, { title: arg.title });
  },
  // createTask(todoListId: string, title: string){
  //   return instance.post<BasicResponseType<{item: TaskType}>>(`todo-lists/${todoListId}/tasks`, {title})
  // },
  deleteTask(args: DeleteTaskArgs) {
    return instance.delete<BasicResponseType>(`todo-lists/${args.todoListId}/tasks/${args.taskId}`);
  },
  // updateTask(todoListId: string, taskId: string, title: string){
  updateTask(todoListId: string, taskId: string, model: UpdateTaskType) {
    return instance.put<BasicResponseType<{ item: TaskType }>>(`todo-lists/${todoListId}/tasks/${taskId}`, model);
  },
  reorderTasks(args: ReorderTasksArgs) {
    return instance.put<BasicResponseType>(`todo-lists/${args.todoListId}/tasks/${args.startDragId}/reorder`, {
      putAfterItemId: args.endShiftId,
    });
  },
};

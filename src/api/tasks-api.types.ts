import { TaskPriorities, TaskStatuses } from "../common/enums/enums";
import { BasicResponseType } from "../common/types";
import { instance } from "../common/instance/instance";

export type UpdateTaskType = {
  description: string;
  startDate: string;
  deadline: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
};

export type GetTasksResponse = {
  items: Array<TaskType>;
  totalCount: number;
  error: string | null;
};

export type TaskType = {
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
  description: string;
  startDate: string;
  deadline: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
};

export type CreateTaskArgs = { todoListId: string; title: string };
export type DeleteTaskArgs = { todoListId: string; taskId: string };
export type ReorderTasksArgs = {
  todoListId: string;
  startDragId: string;
  endShiftId: string | null;
};

import {TaskPriorities, TaskStatuses, TaskType} from "../api/tasks-api";

// Утилитная функция для изменения таски, т.е. могут на изменение придти title или Status ну и может Priority
type ModelForUpdateType = {
  [key: string]: string | TaskStatuses | TaskPriorities
}
export const createModelTask = (task: TaskType, utilityModel: ModelForUpdateType) => {
  return {
    status: task.status,
    startDate: task.deadline,
    title: task.title,
    priority: task.priority,
    description: task.description,
    deadline: task.deadline,
    ...utilityModel
    // Т.е. то что придет в utilityModel, title или status или priority, перезапишет то что было тут написано
  }
}
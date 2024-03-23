import {setAppErrorAC} from "../redux/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/tasks-api";
import {UpdateTaskUtilityType} from "../redux/tasksReducer";

// export const errorFunctionMessage = (data: ResponseType, dispatch: Dispatch) => {
// export const errorFunctionMessage = (data: ResponseType, dispatch: Dispatch) => {

// Функция для обработки ошибок от ответов от сервера. НУЖЕН ДЖЕНЕРИК, потому что у наса ResponseType от сервера дженериковый
export const errorFunctionMessage = <T>(data: ResponseType<T>, dispatch: Dispatch, errorText: string) => {
  if (data.messages.length) { // Если придет текст ошибки с сервера (МЫ НЕ ПРОВЕРЯЕМ НА 100 символов, это делает сервер)
    dispatch(setAppErrorAC(data.messages[0]))
  } else { // Если не придет текст ошибки с сервера, то откинем свой текст
    dispatch(setAppErrorAC(errorText))
  }
}

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
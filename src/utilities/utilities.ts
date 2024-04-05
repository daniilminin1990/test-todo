import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/tasks-api";
import {appActions} from "../redux/appSlice";
import {AppDispatch} from "../store/store";
import axios from "axios";
import {CSSProperties} from "react";

// export const handleServerAppError = (data: ResponseType, dispatch: Dispatch) => {
// export const handleServerAppError = (data: ResponseType, dispatch: Dispatch) => {

// Функция для обработки ошибок от ответов от сервера. НУЖЕН ДЖЕНЕРИК, потому что у наса ResponseType от сервера дженериковый
export const handleServerAppError  = <T>(data: ResponseType<T>, dispatch: Dispatch, errorText: string) => {
  if (data.messages.length) { // Если придет текст ошибки с сервера (МЫ НЕ ПРОВЕРЯЕМ НА 100 символов, это делает сервер)
    dispatch(appActions.setAppError({error: data.messages[0]}))
  } else { // Если не придет текст ошибки с сервера, то откинем свой текст
    dispatch(appActions.setAppError({error: errorText}))
  }
  dispatch(appActions.setAppStatus({appStatus: 'failed'}))
}


export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
  let errorMessage = 'Some error occured';

  if(axios.isAxiosError(err)){
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
  } else if (err instanceof Error){
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err)
  }
  dispatch(appActions.setAppError({error: errorMessage}))
  dispatch(appActions.setAppStatus({appStatus: 'failed'}))
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

export const styleCircular: CSSProperties = {position: "absolute", top: '45%', textAlign: "center", width: '100%', zIndex: '999'}

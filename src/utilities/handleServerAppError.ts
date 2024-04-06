// Функция для обработки ошибок от ответов от сервера. НУЖЕН ДЖЕНЕРИК, потому что у наса ResponseType от сервера дженериковый
import {ResponseType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {appActions} from "../redux/appSlice";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, errorText: string) => {
  if (data.messages.length) { // Если придет текст ошибки с сервера (МЫ НЕ ПРОВЕРЯЕМ НА 100 символов, это делает сервер)
    dispatch(appActions.setAppError({error: data.messages[0]}))
  } else { // Если не придет текст ошибки с сервера, то откинем свой текст
    dispatch(appActions.setAppError({error: errorText}))
  }
  dispatch(appActions.setAppStatus({appStatus: 'failed'}))
}
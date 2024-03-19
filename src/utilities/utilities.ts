import {setAppErrorAC} from "../redux/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

// export const errorFunctionMessage = (data: ResponseType, dispatch: Dispatch) => {
// export const errorFunctionMessage = (data: ResponseType, dispatch: Dispatch) => {
export const errorFunctionMessage = <T>(data: ResponseType<T>, dispatch: Dispatch, errorText: string) => {
  if (data.messages.length) { // Если придет текст ошибки с сервера (МЫ НЕ ПРОВЕРЯЕМ НА 100 символов, это делает сервер)
    dispatch(setAppErrorAC(data.messages[0]))
  } else { // Если не придет текст ошибки с сервера, то откинем свой текст
    dispatch(setAppErrorAC(errorText))
  }
}
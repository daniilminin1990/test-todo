import {instance, ResponseType} from "./todolists-api";
import {AxiosResponse} from "axios";

export type LoginParamsType = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string
}

type InitialiseMeType = {
  userId: number, email: string, login: string
}

export const loginAPI = {
  login(data: LoginParamsType) {
    // return instance.post<ResponseType<LoginParamsType>, AxiosResponse<ResponseType<{userId: number}>>>('auth/login', data) // ОБРАТИ ВНИМАНИЕ -- DATA не {}, потому что сама data это уже объект
    return instance.post<LoginParamsType, AxiosResponse<ResponseType<{userId: number}>>>('auth/login', data) // ОБРАТИ ВНИМАНИЕ  - DATA не {}, потому что сама data это уже объект
  },
  initialiseMe (){
    return instance.get<ResponseType<InitialiseMeType>>('auth/me')
  },
  logout(){
    return instance.delete<ResponseType>('auth/login')
  }
}
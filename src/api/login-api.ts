import { AxiosResponse } from "axios";
import { instance } from "../common/instance/instance";
import { ResponseType } from "../common/types";
import { InitialiseMeType, LoginParamsType } from "./login-api.types";

export const loginAPI = {
  login(data: LoginParamsType) {
    // return instance.post<ResponseType<LoginParamsType>, AxiosResponse<ResponseType<{userId: number}>>>('auth/login', data) // ОБРАТИ ВНИМАНИЕ -- DATA не {}, потому что сама data это уже объект
    return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>("auth/login", data); // ОБРАТИ ВНИМАНИЕ  - DATA не {}, потому что сама data это уже объект
  },
  initialiseMe() {
    return instance.get<ResponseType<InitialiseMeType>>("auth/me");
  },
  logout() {
    return instance.delete<ResponseType>("auth/login");
  },
};

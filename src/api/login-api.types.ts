import { AxiosResponse } from "axios";
import { instance } from "../common/instance/instance";
import { ResponseType } from "../common/types";

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
};

export type InitialiseMeType = {
  userId: number;
  email: string;
  login: string;
};

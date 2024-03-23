import {Dispatch} from "redux";
import {addAppStatusAC, AddAppStatusACType, setAppErrorAC, SetAppErrorACType} from "../../redux/appReducer";
import {loginAPI, LoginParamsType} from "../../api/login-api";
import {errorFunctionMessage} from "../../utilities/utilities";
import {AxiosError} from "axios";

const initialState = {
  isLoggedIn: false
}

type InitialStateType = typeof initialState

export const loginReducer = (state: InitialStateType = initialState, action: MutualLoginType): InitialStateType => {
  switch(action.type){
    case 'login/SET-IS-LOGGED-IN': {
      return {...state, isLoggedIn: action.payload.value}
    }
    default : {
      return state
    }
  }
}

// actions
type SetIsLoggedInACType = ReturnType<typeof setIsLoggedIn>
export const setIsLoggedIn = (value: boolean) => {
  return {
    type: 'login/SET-IS-LOGGED-IN',
    payload: {value}
  }
}

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(addAppStatusAC('loading'))
  loginAPI.login(data)
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(setIsLoggedIn(true))
      } else {
        errorFunctionMessage<{ userId: number }>(res.data, dispatch, 'Oops! Something gone wrong')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC(e.message)
    })
    .finally(() => {
      dispatch(addAppStatusAC('success'))
    })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(addAppStatusAC('loading'))
  loginAPI.logout()
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(setIsLoggedIn(false))
      } else {
        errorFunctionMessage<{}>(res.data, dispatch, 'Oops! Something gone wrong')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC(e.message)
    })
    .finally(() => {
      dispatch(addAppStatusAC('success'))
    })
}

type MutualLoginType = SetIsLoggedInACType | AddAppStatusACType | SetAppErrorACType

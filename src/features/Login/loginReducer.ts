import {Dispatch} from "redux";
import {addAppStatusAC, AddAppStatusACType, setAppErrorAC, SetAppErrorACType} from "../../redux/appReducer";
import {loginAPI, LoginParamsType} from "../../api/login-api";
import {errorFunctionMessage} from "../../utilities/utilities";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
  isLoggedIn: false
}

type InitialStateType = {
  isLoggedIn: boolean
}

const slice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>){
      state.isLoggedIn = action.payload.value
    }
  }
})

export const loginReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(addAppStatusAC('loading'))
  loginAPI.login(data)
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(setIsLoggedInAC({value: true}))
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
        dispatch(setIsLoggedInAC({value: false}))
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

import {Dispatch} from "redux";
import {setAppErrorAC, setAppStatusAC} from "../../redux/appReducer";
import {loginAPI, LoginParamsType} from "../../api/login-api";
import {errorFunctionMessage} from "../../utilities/utilities";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "../../common/actions/common.actions";

const initialState = {
  isLoggedIn: false
}

// type InitialStateType = {
//   isLoggedIn: boolean
// }

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
  dispatch(setAppStatusAC({appStatus: 'loading'}))
  loginAPI.login(data)
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(setIsLoggedInAC({value: true}))
      } else {
        errorFunctionMessage<{ userId: number }>(res.data, dispatch, 'Oops! Something gone wrong')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppStatusAC({appStatus: 'success'}))
    })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({appStatus: 'loading'}))
  loginAPI.logout()
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(setIsLoggedInAC({value: false}))
        dispatch(clearTasksAndTodos())
      } else {
        errorFunctionMessage<{}>(res.data, dispatch, 'Oops! Something gone wrong')
      }
    })
    .catch((e: AxiosError) => {
      setAppErrorAC({error: e.message})
    })
    .finally(() => {
      dispatch(setAppStatusAC({appStatus: 'success'}))
    })
}

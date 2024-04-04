import {Dispatch} from "redux";
import {loginAPI, LoginParamsType} from "../../api/login-api";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodos} from "../../common/actions/common.actions";
import {appActions} from "../../redux/appSlice";
import {handleServerAppError} from "../../utilities/utilities";

// type InitialStateType = {
//   isLoggedIn: boolean
// }

const slice = createSlice({
  name: 'login',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>){
      state.isLoggedIn = action.payload.value
    }
  },
  selectors: {
    isLoggedIn: (sliceState) => sliceState.isLoggedIn,
  }
})

export const loginSlice = slice.reducer
export const loginActions = slice.actions
export const loginSelectors = slice.selectors

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({appStatus: 'loading'}))
  loginAPI.login(data)
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(loginActions.setIsLoggedInAC({value: true}))
      } else {
        handleServerAppError<{ userId: number }>(res.data, dispatch, 'Oops! Something gone wrong')
      }
    })
    .catch((e: AxiosError) => {
      appActions.setAppError({error: e.message})
    })
    .finally(() => {
      dispatch(appActions.setAppStatus({appStatus: 'success'}))
    })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({appStatus: 'loading'}))
  loginAPI.logout()
    .then((res) => {
      if(res.data.resultCode === 0){
        dispatch(loginActions.setIsLoggedInAC({value: false}))
        dispatch(clearTasksAndTodos())
      } else {
        handleServerAppError<{}>(res.data, dispatch, 'Oops! Something gone wrong')
      }
    })
    .catch((e: AxiosError) => {
      appActions.setAppError({error: e.message})
    })
    .finally(() => {
      dispatch(appActions.setAppStatus({appStatus: 'success'}))
    })
}

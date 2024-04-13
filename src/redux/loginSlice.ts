import { Dispatch } from "redux";
import { loginAPI, LoginParamsType } from "../api/login-api";
import { AxiosError } from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodos } from "../common/actions/common.actions";
import { appActions } from "./appSlice";
import {
  createAppAsyncThunk,
  handleServerAppError,
  handleServerNetworkError,
} from "../common/utilities";
import { todolistsThunks } from "./todolistsSlice";

// type InitialStateType = {
//   isLoggedIn: boolean
// }

const slice = createSlice({
  name: "login",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.value;
    });
    // .addCase(logoutTC.fulfilled, (state, action) => {
    //   state.isLoggedIn = action.payload.value;
    // });
  },
  selectors: {
    isLoggedIn: (sliceState) => sliceState.isLoggedIn,
  },
});

export const loginSlice = slice.reducer;
export const loginActions = slice.actions;
export const loginSelectors = slice.selectors;

// thunks
const loginTC = createAppAsyncThunk<{ value: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (data, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ appStatus: "loading" }));
    try {
      const res = await loginAPI.login(data);
      if (res.data.resultCode === 0) {
        dispatch(todolistsThunks.fetchTodolistsTC());
        return { value: true };
      } else {
        handleServerAppError<{ userId: number }>(
          res.data,
          dispatch,
          "Oops! Something gone wrong"
        );
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatus({ appStatus: "success" }));
    }
  }
);
// export const _loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppStatus({appStatus: 'loading'}))
//   loginAPI.login(data)
//     .then((res) => {
//       if(res.data.resultCode === 0){
//         dispatch(loginActions.setIsLoggedInAC({value: true}))
//       } else {
//         handleServerAppError<{ userId: number }>(res.data, dispatch, 'Oops! Something gone wrong')
//       }
//     })
//     .catch((e: AxiosError) => {
//       appActions.setAppError({error: e.message})
//     })
//     .finally(() => {
//       dispatch(appActions.setAppStatus({appStatus: 'success'}))
//     })
// }

const logoutTC = createAppAsyncThunk<{ value: boolean }, undefined>(
  `${slice.name}/logout`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ appStatus: "loading" }));
    try {
      const res = await loginAPI.logout();
      if (res.data.resultCode === 0) {
        dispatch(loginActions.setIsLoggedInAC({ value: false }));
        return { value: true };
      } else {
        handleServerAppError(res.data, dispatch, "Oops! Something gone wrong");
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatus({ appStatus: "success" }));
    }
  }
);
// export const _logoutTC = () => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppStatus({appStatus: 'loading'}))
//   loginAPI.logout()
//     .then((res) => {
//       if(res.data.resultCode === 0){
//         dispatch(loginActions.setIsLoggedInAC({value: false}))
//         dispatch(clearTasksAndTodos())
//       } else {
//         handleServerAppError<{}>(res.data, dispatch, 'Oops! Something gone wrong')
//       }
//     })
//     .catch((e: AxiosError) => {
//       appActions.setAppError({error: e.message})
//     })
//     .finally(() => {
//       dispatch(appActions.setAppStatus({appStatus: 'success'}))
//     })
// }

export const loginThunks = { loginTC, logoutTC };

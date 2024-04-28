import { Dispatch, UnknownAction } from "redux";
import { loginAPI } from "../api/login-api";
import { AxiosError } from "axios";
import { createSlice, isAnyOf, isFulfilled, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodos } from "../common/actions/common.actions";
import { appActions } from "./appSlice";
import { createAppAsyncThunk } from "../common/utilities";
import { todolistsThunks } from "./todolistsSlice";
import { LoginParamsType } from "../api/login-api.types";

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
    builder
      //   .addCase(loginTC.fulfilled, (state, action) => {
      //   state.isLoggedIn = action.payload.value;
      // });
      // Вот это гавно не нужно, иначе приожение крякнет, нельзя будет нормально разлогиниться и  залогиниться
      // .addCase(logoutTC.fulfilled, (state, action) => {
      //   state.isLoggedIn = action.payload.value;
      // });
      .addMatcher(isFulfilled(loginThunks.loginTC), (state, action: PayloadAction<{ value: boolean }>) => {
        state.isLoggedIn = action.payload.value;
      });
  },
  selectors: {
    isLoggedIn: (sliceState) => sliceState.isLoggedIn,
  },
});

export const loginSlice = slice.reducer;
export const loginActions = slice.actions;
export const loginSelectors = slice.selectors;

// thunks
const loginTC = createAppAsyncThunk<{ value: boolean }, LoginParamsType>(`${slice.name}/login`, async (data, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  // dispatch(appActions.setAppStatus({ appStatus: "loading" }));
  try {
    const res = await loginAPI.login(data);
    if (res.data.resultCode === 0) {
      dispatch(todolistsThunks.fetchTodolistsTC());
      return { value: true };
    } else {
      // handleServerAppError<{ userId: number }>(res.data, dispatch, "Oops! Something gone wrong");
      return rejectWithValue(null);
    }
  } catch (e) {
    // handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
  // finally {
  // dispatch(appActions.setAppStatus({ appStatus: "success" }));
  // }
});

const logoutTC = createAppAsyncThunk<{ value: boolean }, undefined>(`${slice.name}/logout`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  // dispatch(appActions.setAppStatus({ appStatus: "loading" }));
  try {
    const res = await loginAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(loginActions.setIsLoggedInAC({ value: false }));
      return { value: true };
    } else {
      // handleServerAppError(res.data, dispatch, "Oops! Something gone wrong");
      return rejectWithValue(null);
    }
  } catch (e) {
    // handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
  // finally {
  // dispatch(appActions.setAppStatus({ appStatus: "success" }));
  // }
});

export const loginThunks = { loginTC, logoutTC };

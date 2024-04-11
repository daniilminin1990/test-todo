import { Dispatch } from "redux";
import { loginAPI } from "../api/login-api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginActions } from "./loginSlice";
import { todolistsThunks } from "./todolistsSlice";
import {
  createAppAsyncThunk,
  handleServerAppError,
  handleServerNetworkError,
} from "../common/utilities";
import { tasksThunks } from "./tasksSlice";

export type ServerResponseStatusType =
  | "idle"
  | "success"
  | "loading"
  | "failed";

const slice = createSlice({
  name: "app",
  initialState: {
    statusTodo: "idle" as ServerResponseStatusType,
    statusTask: "idle" as ServerResponseStatusType,
    addStatus: "idle" as ServerResponseStatusType,
    error: null as null | string,
    isInitialized: false,
  },
  reducers: {
    setAppTodoStatus(
      state,
      action: PayloadAction<{ statusTodo: ServerResponseStatusType }>
    ) {
      state.statusTodo = action.payload.statusTodo;
    },
    setAppStatusTask(
      state,
      action: PayloadAction<{ statusTask: ServerResponseStatusType }>
    ) {
      state.statusTask = action.payload.statusTask;
    },
    setAppStatus(
      state,
      action: PayloadAction<{ appStatus: ServerResponseStatusType }>
    ) {
      state.addStatus = action.payload.appStatus;
    },
    setAppError(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error;
    },
    // changeInitialized(state, action: PayloadAction<{value: boolean}>){
    //   state.isInitialized = action.payload.value
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initialiseMeTC.fulfilled, (state, action) => {
        state.isInitialized = action.payload.value;
      })
      // НУЖНО ЧТОБЫ ПРИЛОЖЕНИЕ НЕ МОРГАЛО, ЕСЛИ ЗАЛОГИНЕН И ПЕРЕЗАГРУЖАЕШЬ СТРАНИЦУ
      .addCase(initialiseMeTC.rejected, (state, action) => {
        state.isInitialized = true;
      })
      .addCase(tasksThunks.reorderTasksTC.rejected, (state, action) => {
        console.log("ERROR");
        state.statusTask = "success";
      });
  },
  selectors: {
    selectAddStatus: (sliceState) => sliceState.addStatus,
    statusTodo: (sliceState) => sliceState.statusTodo,
    statusTask: (sliceState) => sliceState.statusTask,
    isInitialized: (sliceState) => sliceState.isInitialized,
    error: (sliceState) => sliceState.error,
  },
});

export const appSlice = slice.reducer;

export const appActions = slice.actions;
export const appSelectors = slice.selectors;
export type AppInitialState = ReturnType<typeof slice.getInitialState>;

const initialiseMeTC = createAppAsyncThunk<{ value: boolean }, void>(
  `${slice.name}/initialiseMe`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await loginAPI.initialiseMe();
      if (res.data.resultCode === 0) {
        dispatch(loginActions.setIsLoggedInAC({ value: true }));
        dispatch(todolistsThunks.fetchTodolistsTC());
        return { value: true };
      } else {
        handleServerAppError(
          res.data,
          dispatch,
          "It seems that something wrong"
        );
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      // dispatch(appActions.setAppStatus({appStatus: 'success'}))
    }
  }
);
// export const _initialiseMeTC = () => (dispatch: Dispatch) => {
//   loginAPI.initialiseMe()
//     .then((res) => {
//       if(res.data.resultCode === 0){
//         dispatch(appActions.changeInitialized({value: true}))
//         dispatch(loginActions.setIsLoggedInAC({value: true}))
//       } else {
//
//       }
//     })
//     .finally(() => {
//       dispatch(appActions.changeInitialized({value: true}))
//     })
// }

export const appThunks = { initialiseMeTC };

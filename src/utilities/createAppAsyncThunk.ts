import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, RootReducerType} from "../store/store";
import {Dispatch} from "redux";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootReducerType
  dispatch: AppDispatch
  rejectValue: null
}>()
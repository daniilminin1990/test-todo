import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootReducerType } from "../../store/store";
import { ResponseType } from "../types";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootReducerType;
  dispatch: AppDispatch;
  rejectValue: ResponseType | null;
}>();

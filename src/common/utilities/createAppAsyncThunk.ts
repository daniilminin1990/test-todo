import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootReducerType } from "../../store/store";
import { BasicResponseType } from "../types";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootReducerType;
  dispatch: AppDispatch;
  rejectValue: BasicResponseType | null;
}>();

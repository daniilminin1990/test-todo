import {combineReducers, legacy_createStore} from "redux";
import {todolistReducer} from "../redux/todolistReducer";
import {tasksReducer} from "../redux/tasksReducer";

const rootReducer = combineReducers({
  todolistReducer: todolistReducer,
  tasksReducer: tasksReducer,
})
export type RootReducerType = ReturnType<typeof rootReducer>
export const store = legacy_createStore(rootReducer)


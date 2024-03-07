import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {todolistReducer} from "../redux/todolistReducer";
import {tasksReducer} from "../redux/tasksReducer";
import {thunk} from "redux-thunk";
import {useDispatch} from "react-redux";

const rootReducer = combineReducers({
  todolistReducer: todolistReducer,
  tasksReducer: tasksReducer,
})
export type RootReducerType = ReturnType<typeof rootReducer>
// @ts-ignore
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

// const store = configureStore({
//   reducer: rootReducer,
// })

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types

export default store
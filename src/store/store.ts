import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {todolistReducer} from "../redux/todolistReducer";
import {tasksReducer} from "../redux/tasksReducer";
import {thunk, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "../redux/appReducer";
import {loginReducer} from "../features/Login/loginReducer";

const rootReducer = combineReducers({
  todolistReducer: todolistReducer,
  tasksReducer: tasksReducer,
  appReducer: appReducer,
  loginReducer: loginReducer
})
export type RootReducerType = ReturnType<typeof rootReducer>
// @ts-ignore
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

// const store = configureStore({
//   reducer: rootReducer,
// })

// * 1 вариант типизации из доки RTK
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
// // Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// * 2 вариант типизации для useDispatch и useSelector из урока
export type AppDispatch = ThunkDispatch<RootReducerType, any, AnyAction>
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootReducerType> = useSelector

export default store
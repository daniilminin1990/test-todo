import {combineReducers} from "redux";
import {todolistReducer} from "../redux/todolistReducer";
import {tasksReducer} from "../redux/tasksReducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "../redux/appReducer";
import {loginReducer} from "../features/Login/loginReducer";
import {configureStore} from '@reduxjs/toolkit'


const rootReducer = combineReducers({
  todolistReducer: todolistReducer,
  tasksReducer: tasksReducer,
  appReducer: appReducer,
  loginReducer: loginReducer
})
export type RootReducerType = ReturnType<typeof rootReducer>
// @ts-ignore
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware()
//       .prepend(thunk)
// })

export const store = configureStore({
  reducer: rootReducer,
  // middleware: () => new Tuple(thunk),
})
// ВОТ ЭТОТ НОРМ, НЕ РУГАЕТСЯ!

// export type AppDispatch = ThunkDispatch<RootReducerType, unknown, AnyAction>
export type AppDispatch = typeof store.dispatch
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootReducerType> = useSelector

export default store
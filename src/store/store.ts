import {combineReducers} from "redux";
import {todolistsSlice} from "../redux/todolistsSlice";
import {tasksSlice} from "../redux/tasksSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appSlice} from "../redux/appSlice";
import {loginSlice} from "../features/Login/loginSlice";
import {configureStore} from '@reduxjs/toolkit'


// const rootReducer = combineReducers({
//   todolistReducer: todolistsSlice,
//   tasksReducer: tasksSlice,
//   appReducer: appSlice,
//   loginReducer: loginSlice
// })
// @ts-ignore
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware()
//       .prepend(thunk)
// })

export const store = configureStore({
  reducer: {
    todolistReducer: todolistsSlice,
    tasksReducer: tasksSlice,
    appReducer: appSlice,
    loginReducer: loginSlice
  },
  // middleware: () => new Tuple(thunk),
})
// ВОТ ЭТОТ НОРМ, НЕ РУГАЕТСЯ!
export type RootReducerType = ReturnType<typeof store.getState>

// export type AppDispatch = ThunkDispatch<RootReducerType, unknown, AnyAction>
export type AppDispatch = typeof store.dispatch
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootReducerType> = useSelector

export default store
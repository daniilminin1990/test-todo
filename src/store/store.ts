import { combineReducers, legacy_createStore } from 'redux';
import { todolistsReducer } from '../redux/todolistsReducer';
import { tasksReducer } from '../redux/tasksReducer';
const rootReducer = combineReducers({
  todolistsReducer: todolistsReducer,
  tasksReducer: tasksReducer
})

export type RootStoreType = ReturnType<typeof rootReducer>

export const store = legacy_createStore(rootReducer)
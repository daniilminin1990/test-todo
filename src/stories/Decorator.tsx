import {combineReducers, legacy_createStore} from "redux";
import {tasksSlice} from "../redux/tasksSlice";
import {todolistsSlice} from "../redux/todolistsSlice";
import {v1} from "uuid";
import {Provider} from "react-redux";
import React from "react";
import {RootReducerType} from "../store/store";

const rootReducer = combineReducers({
  todolistReducer: todolistsSlice,
  tasksReducer: tasksSlice,
})

const initialGlobalState = {
  initState: [
    {id: "todoListId1", title: "What to learn", filter: "all"},
    {id: "todoListId2", title: "What to buy", filter: "all"}
  ] ,
  initStateTasks: {
    ["todoListId1"]: [
      {id: v1(), title: "HTML&CSS", isDone: true},
      {id: v1(), title: "JS", isDone: false}
    ],
    ["todoListId2"]: [
      {id: v1(), title: "Milk", isDone: false},
      {id: v1(), title: "React Book", isDone: true}
    ]
  }
};

// @ts-ignore
export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as RootReducerType);


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
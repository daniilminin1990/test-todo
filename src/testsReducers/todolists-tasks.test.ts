import {
  todolistsSlice,
  todolistsActions,
  TodoUIType,
  todolistsThunks,
} from "../redux/todolistsSlice";
import { tasksSlice, TaskStateType } from "../redux/tasksSlice";
import { TodolistType } from "../api/todolists-api";
import { UnknownAction } from "redux";

test("All id should be equals", () => {
  const startTasksState: TaskStateType = {};
  const startTodolistsState = {
    allTodolists: [] as TodoUIType[],
    isBlockTodosToDrag: false,
  };

  type AddTodoType = Omit<ReturnType<typeof todolistsThunks.addTodoTC>, "meta">;
  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };
  const action: AddTodoType = {
    type: todolistsThunks.addTodoTC.fulfilled.type,
    payload: {
      newTodolist: todolist,
      filter: "all",
      entityStatus: "idle",
    },
  };

  const endTasksState = tasksSlice(startTasksState, <UnknownAction>action);
  const endTodolistsState = todolistsSlice(
    startTodolistsState,
    <UnknownAction>action
  );

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState.allTodolists[0].id;

  expect(idFromTasks).toBe(todolist.id);
  expect(idFromTodolists).toBe(todolist.id);
});

import {
  FilterValuesType,
  todolistsSlice,
  todolistsActions,
  TodoUIType,
  todolistsThunks,
} from "../redux/todolistsSlice";
import { v1 } from "uuid";
import { ServerResponseStatusType } from "../redux/appSlice";
import { UnknownAction } from "redux";

let todolistId1: string;
let todolistId2: string;
let startState = {
  allTodolists: [] as Array<TodoUIType>,
  isBlockTodosToDrag: false,
};

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = {
    allTodolists: [
      {
        id: todolistId1,
        title: "What to learn",
        filter: "all",
        addedDate: "",
        order: 0,
        entityStatus: "idle",
        showTasks: true,
        isTodoDragging: false,
        isTodoDragOver: false,
      },
      {
        id: todolistId2,
        title: "What to buy",
        filter: "all",
        addedDate: "",
        order: 0,
        entityStatus: "idle",
        showTasks: true,
        isTodoDragging: false,
        isTodoDragOver: false,
      },
    ],
    isBlockTodosToDrag: false,
  };
});

test("correct todolist should be removed", () => {
  type DeleteTodoType = Omit<
    ReturnType<typeof todolistsThunks.deleteTodoTC.fulfilled>,
    "meta"
  >;
  const action: DeleteTodoType = {
    type: todolistsThunks.deleteTodoTC.fulfilled.type,
    payload: {
      todoListId: todolistId1,
    },
  };
  const endState = todolistsSlice(startState, action);
  expect(endState.allTodolists.length).toBe(1);
  expect(endState.allTodolists[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  type AddTodoType = Omit<
    ReturnType<typeof todolistsThunks.addTodoTC.fulfilled>,
    "meta"
  >;
  let newTodolist = {
    id: "asdasdffdagwhfhdfh",
    title: "new todolist",
    addedDate: "",
    order: 0,
  };
  const action: AddTodoType = {
    type: todolistsThunks.addTodoTC.fulfilled.type,
    payload: {
      newTodolist: newTodolist,
      filter: "all",
      entityStatus: "idle",
      showTasks: true,
      isTodoDragging: false,
      isTodoDragOver: false,
    },
  };
  const endState = todolistsSlice(startState, action);

  expect(endState.allTodolists.length).toBe(3);
  expect(endState.allTodolists[0].title).toBe(newTodolist.title);
  expect(endState.allTodolists[0].filter).toBe("all");
});

test("correct todolist should change its name", () => {
  type UpdateTodoTitleType = Omit<
    ReturnType<typeof todolistsThunks.updateTodoTitleTC.fulfilled>,
    "meta"
  >;
  let newTodolistTitle = "new Todolist";
  const action: UpdateTodoTitleType = {
    type: todolistsThunks.updateTodoTitleTC.fulfilled.type,
    payload: {
      todoListId: todolistId2,
      title: newTodolistTitle,
    },
  };
  const endState = todolistsSlice(startState, action);

  expect(endState.allTodolists[0].title).toBe("What to learn");
  expect(endState.allTodolists[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "completed";
  const action = todolistsActions.changeTodoFilter({
    todoListId: todolistId2,
    newFilterValue: newFilter,
  });
  const endState = todolistsSlice(startState, action);

  expect(endState.allTodolists[0].filter).toBe("all");
  expect(endState.allTodolists[1].filter).toBe(newFilter);
});

test("todolist should be added", () => {
  type FetchTodosType = Omit<
    ReturnType<typeof todolistsThunks.fetchTodolistsTC.fulfilled>,
    "meta"
  >;

  const action: FetchTodosType = {
    type: todolistsThunks.fetchTodolistsTC.fulfilled.type,
    payload: { todolists: startState.allTodolists },
  };
  const endState = todolistsSlice(
    { allTodolists: [], isBlockTodosToDrag: false },
    action
  );
  expect(endState.allTodolists.length).toBe(2);
});
test("correct entity status of todolist should be changed", () => {
  let newStatus: ServerResponseStatusType = "loading";
  const action = todolistsActions.updateEntityStatusTodo({
    todoId: todolistId2,
    entityStatus: newStatus,
  });
  const endState = todolistsSlice(startState, action);
  expect(endState.allTodolists[0].entityStatus).toBe("idle");
  expect(endState.allTodolists[1].entityStatus).toBe(newStatus);
});

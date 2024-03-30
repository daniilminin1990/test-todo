import {todolistsSlice, todolistsActions, TodoUIType} from "../redux/todolistsSlice";
import {tasksSlice, TaskStateType} from "../redux/tasksSlice";
import {TodolistType} from "../api/todolists-api";

test('All id should be equals', () => {
  const startTasksState: TaskStateType = {}
  const startTodolistsState: Array<TodoUIType> = [];

  let todolist: TodolistType = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0
  }

  const action = todolistsActions.addTodo({ newTodolist: todolist, filter: 'all', entityStatus: 'idle' })

  const endTasksState = tasksSlice(startTasksState, action)
  const endTodolistsState = todolistsSlice(startTodolistsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.newTodolist.id)
  expect(idFromTodolists).toBe(action.payload.newTodolist.id)
})
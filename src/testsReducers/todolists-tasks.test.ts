import {addTodoAC, todolistReducer, TodoUIType} from "../redux/todolistReducer";
import {tasksReducer, TaskStateType} from "../redux/tasksReducer";
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

  const action = addTodoAC({ newTodolist: todolist, filter: 'all', entityStatus: 'idle' })

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.newTodolist.id)
  expect(idFromTodolists).toBe(action.payload.newTodolist.id)
})
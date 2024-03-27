
import {
  addTodoAC, changeFilterAC,
  FilterValuesType,
  removeTodoAC,
  setTodosAC,
  todolistReducer, TodoUIType, updateEntityStatusTodoAC,
  updateTodoTitleAC
} from "../redux/todolistReducer";
import {v1} from "uuid";
import {ServerResponseStatusType, setAppTodoStatusAC} from "../redux/appReducer";

let todolistId1: string
let todolistId2: string
let startState: Array<TodoUIType> = []

beforeEach(()=> {
  todolistId1 = v1()
  todolistId2 = v1()
  startState = [
    {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
  ]
})

test('correct todolist should be removed', () => {
  const endState = todolistReducer(startState, removeTodoAC({todoListId: todolistId1}))
  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
  let newTodolist = {id: 'asdasdffdagwhfhdfh', title: 'new todolist', addedDate: '', order: 0};
  const endState = todolistReducer(startState, addTodoAC({newTodolist: newTodolist, filter: 'all', entityStatus: 'idle'}))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolist.title)
  expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
  let newTodolistTitle = 'new Todolist'
  const action = updateTodoTitleAC({todoListId: todolistId2, newTodoTitle: newTodolistTitle})
  const endState = todolistReducer(startState, action)

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValuesType = 'completed'
  const action = changeFilterAC({todoListId: todolistId2, newFilterValue: newFilter})
  const endState = todolistReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})

test('todolist should be added', () => {
  const action = setTodosAC({todolists: startState})
  const endState = todolistReducer([], action)
  expect(endState.length).toBe(2)
})
test('correct entity status of todolist should be changed', () => {
  let newStatus: ServerResponseStatusType = 'loading'
  const action = updateEntityStatusTodoAC({todoId: todolistId2, entityStatus: newStatus})
  const endState = todolistReducer(startState, action)
  expect(endState[0].entityStatus).toBe('idle')
  expect(endState[1].entityStatus).toBe(newStatus)
})
import {addTodoAC, removeTodoAC, setTodosAC} from "../redux/todolistReducer";
import {
  addTaskAC,
  removeTaskAC,
  setTasksAC,
  tasksReducer,
  TaskStateType,
  TasksWithEntityStatusType,
  updateTaskAC
} from "../redux/tasksReducer";

import {TaskStatuses} from "../api/tasks-api";


let startState: TaskStateType = {}

beforeEach(() => {
  startState = {
    'todolistId1': [
      {
        id: '1', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: 0, entityStatus: 'idle'
      },
      {
        id: '2', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: 0, entityStatus: 'idle'
      },
      {
        id: '3', title: 'React', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: 0, entityStatus: 'idle'
      }
    ],
    'todolistId2': [
      {
        id: '1', title: 'bread', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: 0, entityStatus: 'idle'
      },
      {
        id: '2', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: 0, entityStatus: 'idle'
      },
      {
        id: '3', title: 'React', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: 0, entityStatus: 'idle'
      }
    ]
  }
})

test('correct task should be deleted from correct array', () => {
  const action = removeTaskAC({todoListId: 'todolistId2', taskId: '2'});
  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(2)
  expect(endState['todolistId2'].every(t => t.id != '2')).toBeTruthy()
})

test('correct task should be added to correct array', () => {
  //const action = addTaskAC('juice', 'todolistId2');
  let task: TasksWithEntityStatusType = {
    todoListId: 'todolistId2',
    title: 'juice',
    status: TaskStatuses.New,
    addedDate: '',
    deadline: '',
    description: '',
    order: 0,
    priority: 0,
    startDate: '',
    id: 'id exists',
    entityStatus: 'idle'
  };
  const action = addTaskAC(task);

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(4)
  expect(endState['todolistId2'][0].id).toBeDefined()
  expect(endState['todolistId2'][0].title).toBe('juice')
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
  const action = updateTaskAC({todoListId: 'todolistId2', taskId: '2', model: {status: TaskStatuses.Completed}});

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.Completed)
})

test('title of specified task should be changed', () => {
  const action = updateTaskAC({todoListId: 'todolistId2', taskId: '2', model: {title: 'YOGURT'}});

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'][1].title).toBe('JS');
  expect(endState['todolistId2'][1].title).toBe('YOGURT')
  expect(endState['todolistId2'][0].title).toBe('bread')
})

test('new array should be added when new todolist is added', () => {
  let newTodolist = {id: 'asdasdffdagwhfhdfh', title: 'new todolist', addedDate: '', order: 0};
  const action = addTodoAC({entityStatus: 'idle', filter: 'all', newTodolist: newTodolist});

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
  if (!newKey) {
    throw new Error('new key should be added')
  }
  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
  const action = removeTodoAC({todoListId: 'todolistId2'});
  const endState = tasksReducer(startState, action)
  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId2']).toBeUndefined()
})

test('empty arrays should be added when we set todolists', () => {
  const action = setTodosAC({
    todolists: [
      {id: '1', title: 'title 1', order: 0, addedDate: ''},
      {id: '2', title: 'title 2', order: 0, addedDate: ''}
    ]
  })

  const endState = tasksReducer({}, action)
  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState['1']).toStrictEqual([])
  expect(endState['2']).toStrictEqual([])
})

test('tasks should be added for todolist', () => {
  const action = setTasksAC({tasks: startState['todolistId1'], todoId: "todolistId1"});
  const endState = tasksReducer({
    'todolistId2': [],
    'todolistId1': [],
  }, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(0)
})
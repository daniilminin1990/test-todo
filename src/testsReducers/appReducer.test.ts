import {appReducer, initialState, ServerResponseStatusType, setAppErrorAC, setAppStatusAC} from "../redux/appReducer";


type InitialStateType = {
  statusTodo: ServerResponseStatusType
  statusTask: ServerResponseStatusType
  addStatus: ServerResponseStatusType,
  error: null | string
  isInitialized: boolean
}

let startState: InitialStateType;

beforeEach(() => {
  startState = {
    statusTodo: 'idle',
    statusTask: 'idle',
    addStatus: 'idle',
    error: null,
    isInitialized: false,
  }
})

test('correct error should be set', () => {
  const endState = appReducer(startState, setAppErrorAC({error: 'test error'}))
  expect(endState.error).toBe ('test error')
})

test('correct status should be set', () => {
  const endState = appReducer(startState, setAppStatusAC({appStatus: 'loading'}))
  expect(endState.addStatus).toBe ('loading')
})
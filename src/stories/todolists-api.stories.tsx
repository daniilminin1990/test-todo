import React, {ChangeEvent, useEffect, useState} from 'react'
import {todolistsAPI} from "../api/todolists-api";

export default {
  title: 'API',
}

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)
  const getTasks = () => {
    todolistsAPI.getTodolists()
      .then((res) => {
        setState(res.data)
      })
  }

  return <div>
    {JSON.stringify(state)}
    <div>
      <button onClick={getTasks}>Get todolists</button>
    </div>
  </div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  const [createTodo, setCreateTodo] = useState<string>('')

  const createTodolist =() => {
      todolistsAPI.createTodolist(createTodo)
      .then((res) => {
        setState(res.data)
      })
  }

  const onChangeNewTodoTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateTodo(e.currentTarget.value)
  }

  return <div>
    {JSON.stringify(state)}
    <div>
      <input placeholder={'Title for newTodo'} onChange={onChangeNewTodoTitle} value={createTodo}/>
    </div>
    <button onClick={createTodolist}>Create todo</button>
  </div>
}

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  const [todolistId, setTodolistId] = useState<string>('')

  const deleteTodolist = () => {
    todolistsAPI.deleteTodolist(todolistId)
      .then((res) => {
        setState(res.data)
      })
  }

  const onChangeTodolistId = (e: ChangeEvent<HTMLInputElement>) => {
    setTodolistId(e.currentTarget.value)
  }

  return <div>
    {JSON.stringify(state)}
    <div>
      <input placeholder={'todolistId'} onChange={onChangeTodolistId} value={todolistId}/>
    </div>
    <button onClick={deleteTodolist}>Delete todo</button>
  </div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  const [todolistId, setTodolistId] = useState<string>('')
  const [todoUpdateTitle, setTodoUpdateTitle] = useState<string>('')

  const onChangeTodolistId = (e: ChangeEvent<HTMLInputElement>) => {
    setTodolistId(e.currentTarget.value)
  }
  const onChangeUpdateTodo = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoUpdateTitle(e.currentTarget.value)
  }

  const updateTodo = () => {
    todolistsAPI.updateTodolist(todolistId, todoUpdateTitle)
      .then((res) => {
        setState(res.data)
      })
  }

  return <div>
    {JSON.stringify(state)}
    <div>
      <input placeholder={'todolistId'} onChange={onChangeTodolistId} value={todolistId}/>
      <input placeholder={'Update Todo'} onChange={onChangeUpdateTodo} value={todoUpdateTitle}/>
    </div>
    <button onClick={updateTodo}>Update todo</button>
  </div>
}

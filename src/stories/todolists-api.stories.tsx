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
    setCreateTodo('')
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
  const [todoListId, settodoListId] = useState<string>('')

  const deleteTodolist = () => {
    todolistsAPI.deleteTodolist(todoListId)
      .then((res) => {
        setState(res.data.data)
      })
    settodoListId('')
  }

  const onChangetodoListId = (e: ChangeEvent<HTMLInputElement>) => {
    settodoListId(e.currentTarget.value)
  }

  return <div>
    {JSON.stringify(state)}
    <div>
      <input placeholder={'todoListId'} onChange={onChangetodoListId} value={todoListId}/>
    </div>
    <button onClick={deleteTodolist}>Delete todo</button>
  </div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  const [todoListId, settodoListId] = useState<string>('')
  const [todoUpdateTitle, setTodoUpdateTitle] = useState<string>('')

  const onChangetodoListId = (e: ChangeEvent<HTMLInputElement>) => {
    settodoListId(e.currentTarget.value)
  }
  const onChangeUpdateTodo = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoUpdateTitle(e.currentTarget.value)
  }

  const updateTodo = () => {
    todolistsAPI.updateTodolist({todoListId, title: todoUpdateTitle})
      .then((res) => {
        setState(res.data)
      })
    settodoListId('')
    setTodoUpdateTitle('')
  }

  return <div>
    {JSON.stringify(state)}
    <div>
      <input placeholder={'todoListId'} onChange={onChangetodoListId} value={todoListId}/>
      <input placeholder={'Update Todo'} onChange={onChangeUpdateTodo} value={todoUpdateTitle}/>
    </div>
    <button onClick={updateTodo}>Update todo</button>
  </div>
}

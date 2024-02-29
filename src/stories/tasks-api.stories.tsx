import React, {ChangeEvent, useEffect, useState} from "react";
import {tasksApi} from "../api/tasks-api";

export default {
  title: 'API',
}

export const GetTasks = () => {
  const [state, setState] = useState<any>(null)
  const [todolistId, setTodolistId] = useState<string>('')

  const onTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodolistId(e.currentTarget.value)
  }

  const getTasks = () => {
    tasksApi.getTasks(todolistId)
      .then((res) => {
        setState(res.data.items)
      })
    setTodolistId('')
  }

  return <div>
      {JSON.stringify(state)}
    <div>
      <input placeholder={'todolistId'} value={todolistId} onChange={onTodoChange}/>
    </div>
    <button onClick={getTasks}>Get tasks</button>
  </div>
}
export const CreateTask = () => {
  const [state, setState] = useState<any>(null)
  const [todolistId, setTodolistId] = useState<string>('')
  const [createdTaskTitle, setCreatedTaskTitle] = useState<string>('')
  console.log(createdTaskTitle)

  const onTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodolistId(e.currentTarget.value)
  }

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreatedTaskTitle(e.currentTarget.value)
  }

  const createTask = () => {
    tasksApi.createTask(todolistId, createdTaskTitle)
      .then((res) => {
        setState(res.data)
      })
    setTodolistId('')
    setCreatedTaskTitle('')
  }

  return <div>
    {JSON.stringify(state)}
    <div>
      <input placeholder={'todolistId'} value={todolistId} onChange={onTodoChange}/>
      <input placeholder={'Create new task'} value={createdTaskTitle} onChange={onTitleChange}/>
    </div>
    <button onClick={createTask}>Make new task</button>
  </div>
}
export const DeleteTask = () => {
  const [state, setState] = useState<any>(null)
  const [todolistId, setTodolistId] = useState<string>('')
  const [taskId, setTaskId] = useState<string>('')

  const onTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodolistId(e.currentTarget.value)
  }
  const onTaskChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskId(e.currentTarget.value)
  }

  const deleteTask = () => {
    tasksApi.deleteTask(todolistId, taskId)
      .then((res) => {
        setState(res.data)
      })
    setTodolistId('')
    setTaskId('')
  }


  return <div>
    {JSON.stringify(state)}
    <div>
      <input placeholder={'todolistId'} value={todolistId} onChange={onTodoChange}/>
      <input placeholder={'taskId'} value={taskId} onChange={onTaskChange}/>
    </div>
    <button onClick={deleteTask}>Delete task</button>
  </div>
}
export const UpdateTask = () => {
  const [state, setState] = useState<any>(null)
  const [todolistId, setTodolistId] = useState<string>('')
  const [taskId, setTaskId] = useState<string>('')
  const [newTaskTitle, setNewTaskTitle] = useState<string>('')

  const [taskDescription, setTaskDescription] = useState<string>('')
  const [status, setStatus] = useState<number>(0)
  const [priority, setPriority] = useState<number>(0)
  const [startDate, setStartDaate] = useState<string>('')
  const [deadLine, setDeadline] = useState<string>('')

  const onTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodolistId(e.currentTarget.value)
  }
  const onTaskChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskId(e.currentTarget.value)
  }
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value)
  }
  const updateTitle = () => {
    tasksApi.updateTask(todolistId, taskId, {
      deadline: '',
      description: taskDescription,
      priority: priority,
      startDate: '',
      status: status,
      title: newTaskTitle
    })
      .then((res) => {
        setState(res.data)
      })
    setTodolistId('')
    setTaskId('')
    setNewTaskTitle('')
    setTaskDescription('')
    setStatus(0)
  }
  return <div>
    {JSON.stringify(state)}
    <div>
      <input placeholder={'todolistId'} value={todolistId} onChange={onTodoChange}/>
      <input placeholder={'taskId'} value={taskId} onChange={onTaskChange}/>
      <input placeholder={'set new taskTitle'} value={newTaskTitle} onChange={onTitleChange}/>
      <input placeholder={'task descripton'} value={taskDescription} onChange={(e) => setTaskDescription(e.currentTarget.value)}/>
      <input placeholder={'status'} value={status} onChange={(e) => setStatus(+e.currentTarget.value)} type={'number'}/>
      <input placeholder={'priority'} value={priority} onChange={(e) => setPriority(+e.currentTarget.value)} type={'number'}/>
    </div>
    <button onClick={updateTitle}>Update taskTitle</button>
  </div>
}
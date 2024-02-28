import React, {useEffect, useState} from "react";
import {tasksApi} from "../api/tasks-api";

export default {
  title: 'API',
}

export const GetTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "d8b5ef01-270d-4647-8d7d-0686f77519e8"
    tasksApi.getTasks(todolistId)
      .then((res) => {
        setState(res.data.items)
      })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const CreateTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "d8b5ef01-270d-4647-8d7d-0686f77519e8"
    const title = 'ВОЗРАДУЙСЯ'
    tasksApi.createTask(todolistId, title)
      .then((res) => {
        setState(res.data)
      })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const DeleteTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "d8b5ef01-270d-4647-8d7d-0686f77519e8"
    const taskId = '2c6560f9-1232-4c43-ab17-4ec181a15561'
    tasksApi.deleteTask(todolistId, taskId)
      .then((res) => {
        setState(res.data)
      })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const UpdateTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "d8b5ef01-270d-4647-8d7d-0686f77519e8"
    const taskId = 'd9a32fcf-aa44-4685-95bd-42c9a126777d'
    const title = 'ТАНЦУЙ И РАДУЙСЯ'
    tasksApi.updateTask(todolistId, taskId, title)
      .then((res) => {
        setState(res.data)
      })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
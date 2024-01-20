import React, { ChangeEvent } from 'react'
import { TaskProps } from './App'

type TodolistProps = {
  todoTitle: string,
  tasks: TaskProps[]
  onChange: (id: string, isDone: boolean) => void
}

export const Todolist = (props: TodolistProps) => {



  return (

    <div>
      <h3>{props.todoTitle}</h3>
      {
        props.tasks.map(el => {
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let checked = e.currentTarget.checked
            props.onChange(el.id, checked)
          }
          return (
            <div>
              <input type="checkbox" checked={el.isDone} onChange={onChangeHandler} />
              <span>{el.taskTitle}</span>
            </div>
          )
        })
      }
    </div>
  )
}

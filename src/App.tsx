import React, { useState } from 'react';
import './App.css';
import { v1 } from 'uuid';
import { Todolist } from './Todolist';

type TaskData = {
  todoTitle: 'Whaatda',
  tasks: TaskType[]
}

export type TaskType = {
  id: string,
  taskTitle: string,
  isDone: boolean,
}

// тип task status
export type TaskStatusFilter = 'all' | 'active' | 'completed'

function App() {
  let [tasks, setTasks] = useState<TaskType[]>([
    {
      id: v1(),
      taskTitle: 'Купить молоко',
      isDone: false,
    },
    {
      id: v1(),
      taskTitle: 'Сходить побегать',
      isDone: false,
    },
    {
      id: v1(),
      taskTitle: 'Понюхать цветы',
      isDone: false,
    },
  ])

  // state для фильтрации
  let [tasksFilter, setTasksFilter] = useState<TaskStatusFilter>('all')

  // Удаление задачи
  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  // Фильтрация задач
  const changeTasksFilter = (newTasksFilterValue: TaskStatusFilter) => {
    setTasksFilter(newTasksFilterValue)
  }
  let tasksChangedByFilter = tasks
  if (tasksFilter === 'completed') {
    tasksChangedByFilter = tasks.filter(t => t.isDone === true)
  }
  if (tasksFilter === 'active') {
    tasksChangedByFilter = tasks.filter(t => t.isDone === false)
  }

  // Добавление задачи
  const addTask = (newTaskTitle: string) => {
    let newTask: TaskType = { id: v1(), taskTitle: newTaskTitle, isDone: false }
    setTasks([newTask, ...tasks])
  }

  // Изменение статуса задачи
  const changeTaskStatus = (taskId: string, isDone: boolean) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isDone } : t))
    // Еще один вариант без map, но с find
    // let task = tasks.find(t => t.id === taskId)
    // if (task) task.isDone = isDone
    // setTasks([...tasks])
  }

  return (
    <div className="App">
      <Todolist
        todoTitle='What to buy?'
        tasks={tasksChangedByFilter}
        changeTaskStatus={changeTaskStatus}
        removeTask={removeTask}
        changeTasksFilter={changeTasksFilter}
        addTask={addTask}
        tasksFilter={tasksFilter}
      />
    </div>
  );
}

export default App;

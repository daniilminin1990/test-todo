import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { v1 } from 'uuid';
import { Todolist } from './Todolist';

type TaskData = {
  todoTitle: 'Whaatda',
  tasks: TaskProps[]
}

export type TaskProps = {
  id: string,
  taskTitle: string,
  isDone: boolean,
}



function App() {
  let [tasks, setTasks] = useState([
    {
      id: v1(),
      taskTitle: 'Купить яйайва',
      isDone: true,
    },
    {
      id: v1(),
      taskTitle: 'Купить яйайва',
      isDone: true,
    },
  ])

  const onChange = (id: string, isDone: boolean) => {
    setTasks(tasks.map(el => {
      if (id === el.id) {
        return { ...el, isDone }
      }
      else {
        return el
      }

    }))
  }

  return (
    <div className="App">
      <Todolist
        todoTitle='What to buy?'
        tasks={tasks}
        onChange={onChange}
      />
    </div>
  );
}

export default App;

export const ACTION_TYPES = {
  todolists: {
    addTodo: 'TL/TODOLISTS/ADD-TODO',
    removeTodo: 'TL/TODOLISTS/REMOVE-TODO',
    changeFilter: 'TL/TODOLISTS/CHAGE-FILTER',
    updateTodo: 'TL/TODOLISTS/UPDATE-TODO'
  },
  tasks: {
    addTask: 'TL/TASKS/ADD-TASK',
    removeTask: 'TL/TASKS/REMOVE-TASK',
    updateTask: 'TL/TASKS/UPDATE-TASK',
  }
} as const
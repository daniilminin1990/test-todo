import { tasksApi } from "../api/tasks-api";
import { appActions, ServerResponseStatusType } from "./appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodos } from "../common/actions/common.actions";
import { todolistsActions, todolistsThunks } from "./todolistsSlice";
import { createAppAsyncThunk, dndUniversalIdChanger } from "../common/utilities";
import { CreateTaskArgs, DeleteTaskArgs, ReorderTasksArgs, TaskType, UpdateTaskType } from "../api/tasks-api.types";
import { dndIdChangerForTaskAcrossTodos } from "../common/utilities/dragAndDropIdChangerFunctions";

export type TaskStateType = {
  [todoListId: string]: TasksWithEntityStatusType[];
};

export type TasksWithEntityStatusType = TaskType & {
  entityStatus: ServerResponseStatusType;
};

const slice = createSlice({
  name: "tasks",
  initialState: {} as TaskStateType,
  reducers: {
    // removeTask(state, action: PayloadAction<{ todoListId: string, taskId: string }>) {
    //   const id = state[action.payload.todoListId].findIndex(t => t.id === action.payload.taskId)
    //   if (id > -1) state[action.payload.todoListId].splice(id, 1)
    // },
    // addTask(state, action: PayloadAction<TasksWithEntityStatusType>) {
    //   state[action.payload.todoListId].unshift(action.payload)
    // },
    // updateTask(state, action: PayloadAction<{ todoListId: string, taskId: string, model: UpdateTaskUtilityType }>) {
    //   const tasks = state[action.payload.todoListId]
    //   const id = tasks.findIndex(t => t.id === action.payload.taskId)
    //   if (id > -1) {
    //     tasks[id] = {...tasks[id], ...action.payload.model}
    //   }
    // },
    // setTasks(state, action: PayloadAction<{ todoId: string, tasks: TaskType[] }>) {
    //   const {todoId, tasks} = action.payload
    //   state[todoId] = tasks.map(t => ({...t, entityStatus: 'idle'}))
    // },

    updateTaskEntityStatus(
      state,
      action: PayloadAction<{
        todoListId: string;
        taskId: string | undefined;
        entityStatus: ServerResponseStatusType;
      }>
    ) {
      const tasks = state[action.payload.todoListId];
      const id = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (id > -1) {
        tasks[id] = { ...tasks[id], entityStatus: action.payload.entityStatus };
      }
    },
    reorderTask(state, action: PayloadAction<ReorderTasksArgs>) {
      const { todoListId, startDragId, endShiftId } = action.payload;
      const dragIndex = state[todoListId].findIndex((t) => t.id === startDragId);
      const targetIndex = state[todoListId].findIndex((t) => t.id === endShiftId);
      if (dragIndex > -1 && targetIndex > -1) {
        const draggedItem = state[todoListId].splice(dragIndex, 1)[0];
        state[todoListId].splice(targetIndex, 0, draggedItem);
      }
    },
    moveTaskAcrossTodolists(
      state,
      action: PayloadAction<{
        todoListId: string;
        endTodoListId: string;
        startDragId: string;
        endShiftId: string | null;
      }>
    ) {
      const { startDragId, endShiftId, todoListId, endTodoListId } = action.payload;

      const startTodolistTasks = state[todoListId];
      const endTodolistTasks = state[endTodoListId];
      console.groupCollapsed("moveTaskAcrossTodolists");
      console.log({
        startTodolistTasks,
        endTodolistTasks,
        startDragId,
        endShiftId,
        todoListId,
        endTodoListId,
      });
      console.groupEnd();

      const startTaskIndex = startTodolistTasks.findIndex((task) => task.id === startDragId);
      const endTaskIndex = endTodolistTasks.findIndex((task) => task.id === endShiftId);

      const draggedTask = startTodolistTasks[startTaskIndex];
      draggedTask.todoListId = endTodoListId;

      if (!draggedTask) {
        console.warn(`Task with id ${startDragId} not found`);
        return;
      }

      startTodolistTasks.splice(startTaskIndex, 1);

      if (endShiftId) {
        endTodolistTasks.splice(endTaskIndex, 0, draggedTask);
      } else {
        endTodolistTasks.push(draggedTask);
      }
    },
    moveTaskInEmptyTodolists(
      state,
      action: PayloadAction<{
        todoListId: string;
        endTodoListId: string;
        startDragId: string;
      }>
    ) {
      const { startDragId, todoListId, endTodoListId } = action.payload;

      const endTodolistTasks = state[endTodoListId];
      const taskToPut = state[todoListId].find((task) => task.id === startDragId);

      const startTodolistTasks = state[todoListId];
      startTodolistTasks.splice(
        startTodolistTasks.findIndex((task) => task.id === startDragId),
        1
      );

      if (taskToPut) {
        endTodolistTasks.unshift(taskToPut);
        taskToPut.todoListId = endTodoListId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsThunks.addTodoTC.fulfilled, (state, action) => {
        state[action.payload.newTodolist.id] = [];
      })
      .addCase(todolistsThunks.deleteTodoTC.fulfilled, (state, action) => {
        delete state[action.payload.todoListId];
      })
      .addCase(todolistsThunks.fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      // Очистка стейта после разлогинивания
      .addCase(clearTasksAndTodos, () => {
        return {};
      })
      // Таски с сервера с ошибками
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        const { todolistId, tasks } = action.payload;
        state[todolistId] = tasks.map((t) => ({ ...t, entityStatus: "idle" }));
        return state;
      })
      // Таски с сервера с ошибками
      // .addCase(fetchTasksTC.rejected, (state, action) => {
      //
      // })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift({
          ...action.payload.task,
          entityStatus: "idle",
        });
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoListId];
        const id = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (id > -1) {
          tasks[id] = { ...tasks[id], ...action.payload.model };
        }
      })
      .addCase(deleteTaskTC.fulfilled, (state, action) => {
        const id = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId);
        if (id > -1) state[action.payload.todoListId].splice(id, 1);
      });
    // .addCase(reorderTasksTC.fulfilled, (state, action) => {
    //   const { todoListId, startDragId, endShiftId } = action.payload;
    //   const dragIndex = state[todoListId].findIndex((t) => t.id === startDragId);
    //   const targetIndex = state[todoListId].findIndex((t) => t.id === endShiftId);
    //   if (dragIndex > -1 && targetIndex > -1) {
    //     const draggedItem = state[todoListId].splice(dragIndex, 1)[0];
    //     state[todoListId].splice(targetIndex, 0, draggedItem);
    //   }
    // })
    // .addCase(reorderTasksTC.rejected, (state, action) => {});
  },
  selectors: {
    tasksState: (sliceState) => sliceState as TaskStateType,
    tasksById: (sliceState, todoId: string) => sliceState[todoId] as TasksWithEntityStatusType[],
  },
});

export const tasksActions = slice.actions;

export const tasksSlice = slice.reducer;
export const tasksSelectors = slice.selectors;

//! Thunk
const fetchTasksTC = createAppAsyncThunk<
  {
    todolistId: string;
    tasks: TaskType[];
  },
  string
>(`${slice.name}/fetchTasks`, async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  // dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
  console.log("FETCHTASKT=TC");
  try {
    const res = await tasksApi.getTasks(todolistId);
    const tasks = res.data.items;
    return { todolistId: todolistId, tasks };
  } catch (e) {
    // handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
  // finally {
  //   dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
  // }
});

// export const _fetchTasksTC = (todoId: string) => (dispatch: Dispatch) => {
//   return new Promise((resolve, reject) => {
//     dispatch(appActions.setAppStatusTask({statusTask: 'loading'}))
//     tasksApi.getTasks(todoId)
//       .then(res => {
//         dispatch(tasksActions.setTasks({todoId, tasks: res.data.items}))
//         resolve(res)
//       })
//       .catch((e: AxiosError) => {
//         appActions.setAppError({error: e.message})
//         reject(e)
//       })
//       .finally(() => {
//         dispatch(appActions.setAppStatusTask({statusTask: 'success'}))
//       })
//   })
// }

const deleteTaskTC = createAppAsyncThunk<DeleteTaskArgs, DeleteTaskArgs>(`${slice.name}/deleteTask`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.taskId,
      entityStatus: "loading",
    })
  );
  // dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
  // console.log("DELETETASKT=TC");
  try {
    const res = await tasksApi.deleteTask(args);
    if (res.data.resultCode === 0) {
      return { todoListId: args.todoListId, taskId: args.taskId };
    } else {
      // handleServerAppError(res.data, dispatch, "Something wrong, try later");
      return rejectWithValue(null);
    }
  } finally {
    // catch (e) {
    //   // handleServerNetworkError(e, dispatch);
    //   return rejectWithValue(null);
    // }
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.taskId,
        entityStatus: "success",
      })
    );
    // dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
  }
});
// export const _deleteTaskTC = (todoListId: string, taskId: string) => (dispatch: Dispatch) => {
//   // dispatch(appActions.setAppStatusTask({statusTask: 'loading'}))
//   dispatch(tasksActions.updateTaskEntityStatus({todoListId, taskId, entityStatus: 'loading'}))
//   tasksApi.deleteTask(todoListId, taskId)
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         dispatch(tasksActions.removeTask({todoListId, taskId}))
//       } else {
//         handleServerAppError(res.data, dispatch, 'Something wrong, try later')
//       }
//     })
//     .catch((e: AxiosError) => {
//       appActions.setAppError({error: e.message})
//     })
//     .finally(() => {
//       dispatch(appActions.setAppStatusTask({statusTask: 'success'}))
//       dispatch(tasksActions.updateTaskEntityStatus({todoListId, taskId, entityStatus: 'success'}))
//     })
// }
const addTaskTC = createAppAsyncThunk<
  {
    task: TaskType;
  },
  CreateTaskArgs
>(`${slice.name}/addTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  // dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
  // try {
  const res = await tasksApi.createTask(arg);
  if (res.data.resultCode === 0) {
    const task = res.data.data.item;
    // dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    return { task };
  } else {
    // handleServerAppError(res.data, dispatch, "Oops! Something gone wrong. Length should be less 100 symbols");
    return rejectWithValue(res.data);
  }
  // }
  // catch (e) {
  //   // handleServerNetworkError(e, dispatch);
  //   return rejectWithValue(null);
  // }
  // finally {
  //   dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
  // }
});
const addTaskDnDTC = createAppAsyncThunk<
  {
    task: TaskType;
  },
  CreateTaskArgs
>(`${slice.name}/addTaskDnDTC`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  // try {
  const res = await tasksApi.createTask(arg);
  if (res.data.resultCode === 0) {
    const task = res.data.data.item;
    // dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    return { task };
  } else {
    // handleServerAppError(res.data, dispatch, "Oops! Something gone wrong. Length should be less 100 symbols");
    return rejectWithValue(null);
  }
  // }
  // catch (e) {
  //   // handleServerNetworkError(e, dispatch);
  //   return rejectWithValue(null);
  // }
});
// export const _addTaskTC = (todoId: string, newTaskTitle: string) => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppStatusTask({statusTask: 'loading'}))
//   tasksApi.createTask(todoId, newTaskTitle)
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         const taskToServer: TasksWithEntityStatusType = {...res.data.data.item, entityStatus: 'idle'}
//         dispatch(tasksActions.addTask(taskToServer))
//       } else {
//         handleServerAppError(res.data, dispatch, 'Oops! Something gone wrong. Length should be less 100 symbols')
//       }
//     })
//     .catch((e: AxiosError) => {
//       appActions.setAppError({error: e.message})
//     })
//     .finally(() => {
//       dispatch(appActions.setAppStatusTask({statusTask: 'success'}))
//     })
// }
const updateTaskTC = createAppAsyncThunk<
  { todoListId: string; taskId: string; model: UpdateTaskType },
  {
    todoListId: string;
    taskId: string;
    model: Partial<UpdateTaskType>;
  }
>(`${slice.name}/updateTask`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const state = getState();
  const task = state.tasks[args.todoListId].find((tl) => tl.id === args.taskId);
  // dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.taskId,
      entityStatus: "loading",
    })
  );
  console.log("UPDATETASK=TC");

  if (!task) {
    throw new Error("Task not found in the state");
  }

  const apiModel: UpdateTaskType = { ...task, ...args.model };
  try {
    const res = await tasksApi.updateTask(args.todoListId, args.taskId, apiModel);
    if (res.data.resultCode === 0) {
      return {
        todoListId: args.todoListId,
        taskId: args.taskId,
        model: apiModel,
      };
    } else {
      // handleServerAppError(res.data, dispatch, "Oops! Something gone wrong. Length should be less than 100 symbols");
      return rejectWithValue(null);
    }
  } finally {
    // catch (e) {
    //   // handleServerNetworkError(e, dispatch);
    //   return rejectWithValue(null);
    // }
    // dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.taskId,
        entityStatus: "success",
      })
    );
  }
});

const updateTaskDnDTC = createAppAsyncThunk<
  { todoListId: string; taskId: string; model: UpdateTaskType },
  {
    todoListId: string;
    task: TaskType;
    model: Partial<UpdateTaskType>;
  }
>(`${slice.name}/updateTask`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  // dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.task.id,
      entityStatus: "loading",
    })
  );
  // console.log("UPDATETASK=TC");

  if (!args.task) {
    throw new Error("Task not found in the state");
  }

  const apiModel: UpdateTaskType = { ...args.task, ...args.model };
  try {
    const res = await tasksApi.updateTask(args.todoListId, args.task.id, apiModel);
    if (res.data.resultCode === 0) {
      return {
        todoListId: args.todoListId,
        taskId: args.task.id,
        model: apiModel,
      };
    } else {
      // handleServerAppError(res.data, dispatch, "Oops! Something gone wrong. Length should be less than 100 symbols");
      return rejectWithValue(null);
    }
  } finally {
    // catch (e) {
    //   // handleServerNetworkError(e, dispatch);
    //   return rejectWithValue(null);
    // }
    // dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.task.id,
        entityStatus: "success",
      })
    );
  }
});

// export const _updateTaskTC = (todoListId: string, taskId: string, utilityModel: UpdateTaskUtilityType) => (dispatch: Dispatch, getState: () => RootReducerType) => {
//   dispatch(appActions.setAppStatusTask({statusTask: 'loading'}))
//   dispatch(tasksActions.updateTaskEntityStatus({todoId: todoListId, taskId, entityStatus: 'loading'}))
//   const state = getState()
//   const task = state.tasks[todoListId].find(tl => tl.id === taskId)
//
//   if (!task) {
//     throw new Error('Task not found in the state')
//   }
//   const elementToUpdate: UpdateTaskType = createModelTask(task, utilityModel)
//   tasksApi.updateTask(todoListId, taskId, elementToUpdate)
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         dispatch(tasksActions.updateTask({todoListId, taskId, model: elementToUpdate}))
//       } else {
//         handleServerAppError(res.data, dispatch, 'Length should be less than 100 symbols')
//       }
//     })
//     .catch((e: AxiosError) => {
//       appActions.setAppError({error: e.message})
//     })
//     .finally(() => {
//       dispatch(appActions.setAppStatusTask({statusTask: 'success'}))
//       dispatch(tasksActions.updateTaskEntityStatus({todoId: todoListId, taskId, entityStatus: 'success'}))
//     })
// }

const reorderTaskTC = createAppAsyncThunk<undefined, ReorderTasksArgs>(`${slice.name}/reorderTasksSoloTodoDnDTC`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const tasks = getState().tasks[args.todoListId];
  const idToServer = dndUniversalIdChanger(tasks, args);
  // try {
  const res = await tasksApi.reorderTasks({
    todoListId: args.todoListId,
    startDragId: args.startDragId,
    endShiftId: idToServer,
  });
  if (res.data.resultCode === 0) {
    return undefined;
  } else {
    // handleServerAppError(res.data, dispatch, "Oops! Something gone wrong. Length should be less than 100 symbols");
    return rejectWithValue(null);
  }
  // }
  // catch (e) {
  //   // handleServerNetworkError(e, dispatch);
  //   return rejectWithValue(null);
  // }
});

const reorderTaskAcrossTodosTC = createAppAsyncThunk<
  undefined,
  {
    todoListId: string;
    startDragId: string;
    endShiftId: string;
  }
>(`${slice.name}/reorderTasksDnDByOrderTC`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const tasks = getState().tasks[args.todoListId];
  const idToServer = dndIdChangerForTaskAcrossTodos({
    tasks,
    endShiftId: args.endShiftId,
  });
  // try {
  const res = await tasksApi.reorderTasks({
    todoListId: args.todoListId,
    startDragId: args.startDragId,
    endShiftId: idToServer,
  });
  if (res.data.resultCode === 0) {
    return undefined;
  } else {
    // handleServerAppError(res.data, dispatch, "Oops! Something gone wrong. Length should be less than 100 symbols");
    return rejectWithValue(null);
  }
  // }
  // catch (e) {
  //   // handleServerNetworkError(e, dispatch);
  //   return rejectWithValue(null);
  // }
});

export const tasksThunks = {
  fetchTasksTC,
  addTaskTC,
  updateTaskTC,
  updateTaskDnDTC,
  deleteTaskTC,
  reorderTaskTC,
  addTaskDnDTC,
  reorderTaskAcrossTodosTC,
};

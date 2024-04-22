import {
  CreateTaskArgs,
  DeleteTaskArgs,
  ReorderTasksArgs,
  tasksApi,
  TaskType,
  UpdateTaskType,
} from "../api/tasks-api";
import { appActions, ServerResponseStatusType } from "./appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodos } from "../common/actions/common.actions";
import { todolistsActions, todolistsThunks } from "./todolistsSlice";
import {
  createAppAsyncThunk,
  dragAndDropIdChanger,
  handleServerAppError,
  handleServerNetworkError,
} from "../common/utilities";
import { dragAndDropIdChangerKIT } from "../common/utilities/dragAndDropIdChangerKIT";
import { dragAndDropIdChangerByOrder } from "../common/utilities/dragAndDropIdChanger";

export type TaskStateType = {
  [todoListId: string]: TasksWithEntityStatusType[];
};

export type TasksWithEntityStatusType = TaskType & {
  entityStatus: ServerResponseStatusType;
  isTaskDragging: boolean;
  isTaskDragOver: boolean;
};

const slice = createSlice({
  name: "tasks",
  initialState: {
    allTasks: {} as TaskStateType,
    isBlockTasksToDrag: true,
  },
  reducers: {
    removeTask(
      state,
      action: PayloadAction<{ todoListId: string; taskId: string }>
    ) {
      const id = state.allTasks[action.payload.todoListId].findIndex(
        (t) => t.id === action.payload.taskId
      );
      if (id > -1) state.allTasks[action.payload.todoListId].splice(id, 1);
    },
    addTask(
      state,
      action: PayloadAction<{ todoListId: string; task: TaskType | undefined }>
    ) {
      if (action.payload && action.payload.task) {
        const { todoListId, task } = action.payload;
        console.log("addTask", todoListId);
        state.allTasks[todoListId].unshift({
          ...task,
          entityStatus: "idle",
          isTaskDragging: false,
          isTaskDragOver: false,
        });
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
      const { startDragId, endShiftId, todoListId, endTodoListId } =
        action.payload;

      const startTodolistTasks = state.allTasks[todoListId];
      const endTodolistTasks = state.allTasks[endTodoListId];

      const startTaskIndex = startTodolistTasks.findIndex(
        (task) => task.id === startDragId
      );
      const endTaskIndex = endTodolistTasks.findIndex(
        (task) => task.id === endShiftId
      );

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

      const endTodolistTasks = state.allTasks[endTodoListId];
      const taskToPut = state.allTasks[todoListId].find(
        (task) => task.id === startDragId
      );

      const startTodolistTasks = state.allTasks[todoListId];
      startTodolistTasks.splice(
        startTodolistTasks.findIndex((task) => task.id === startDragId),
        1
      );

      if (taskToPut) {
        endTodolistTasks.unshift(taskToPut);
      }
    },

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
      const tasks = state.allTasks[action.payload.todoListId];
      const id = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (id > -1) {
        tasks[id] = { ...tasks[id], entityStatus: action.payload.entityStatus };
      }
    },
    reorderTask(state, action: PayloadAction<ReorderTasksArgs>) {
      const { todoListId, startDragId, endShiftId } = action.payload;
      const dragIndex = state.allTasks[todoListId].findIndex(
        (t) => t.id === startDragId
      );
      const targetIndex = state.allTasks[todoListId].findIndex(
        (t) => t.id === endShiftId
      );
      if (dragIndex > -1 && targetIndex > -1) {
        const draggedItem = state.allTasks[todoListId].splice(dragIndex, 1)[0];
        state.allTasks[todoListId].splice(targetIndex, 0, draggedItem);
      }
    },
    changeTaskIsDragging(
      state,
      action: PayloadAction<{
        todoListId: string;
        taskId: string;
        isTaskDragging: boolean;
      }>
    ) {
      const { todoListId, taskId, isTaskDragging } = action.payload;
      const tasks = state.allTasks[todoListId];
      const id = tasks.findIndex((t) => t.id === taskId);
      if (id > -1) tasks[id] = { ...tasks[id], isTaskDragging };
    },
    changeTaskIsDragOver(
      state,
      action: PayloadAction<{
        todoListId: string;
        taskId: string;
        isTaskDragOver: boolean;
      }>
    ) {
      const { todoListId, taskId, isTaskDragOver } = action.payload;
      const tasks = state.allTasks[todoListId];
      const id = tasks.findIndex((t) => t.id === taskId);
      if (id > -1) tasks[id] = { ...tasks[id], isTaskDragOver };
    },
    changeIsBlockTasksToDrag(state, action: PayloadAction<boolean>) {
      state.isBlockTasksToDrag = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsThunks.addTodoTC.fulfilled, (state, action) => {
        state.allTasks[action.payload.newTodolist.id] = [];
      })
      .addCase(todolistsThunks.deleteTodoTC.fulfilled, (state, action) => {
        delete state.allTasks[action.payload.todoListId];
      })
      .addCase(todolistsThunks.fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state.allTasks[tl.id] = [];
        });
      })
      // Очистка стейта после разлогинивания
      .addCase(clearTasksAndTodos, () => {
        return {
          allTasks: {},
          isBlockTasksToDrag: false,
        };
      })
      // Таски с сервера с ошибками
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        const { todolistId, tasks } = action.payload;
        state.allTasks[todolistId] = tasks.map((t) => ({
          ...t,
          entityStatus: "idle",
          isTaskDragging: false,
          isTaskDragOver: false,
        }));
        return state;
      })
      // Таски с сервера с ошибками
      // .addCase(fetchTasksTC.rejected, (state, action) => {
      //
      // })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        state.allTasks[action.payload.task.todoListId].unshift({
          ...action.payload.task,
          entityStatus: "idle",
          isTaskDragging: false,
          isTaskDragOver: false,
        });
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state.allTasks[action.payload.todoListId];
        const id = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (id > -1) {
          tasks[id] = { ...tasks[id], ...action.payload.model };
        }
      })
      .addCase(deleteTaskTC.fulfilled, (state, action) => {
        const id = state.allTasks[action.payload.todoListId].findIndex(
          (t) => t.id === action.payload.taskId
        );
        if (id > -1) state.allTasks[action.payload.todoListId].splice(id, 1);
      })
      .addCase(reorderTasksTC.fulfilled, (state, action) => {
        const { todoListId, startDragId, endShiftId } = action.payload;
        const dragIndex = state.allTasks[todoListId].findIndex(
          (t) => t.id === startDragId
        );
        const targetIndex = state.allTasks[todoListId].findIndex(
          (t) => t.id === endShiftId
        );
        if (dragIndex > -1 && targetIndex > -1) {
          const draggedItem = state.allTasks[todoListId].splice(
            dragIndex,
            1
          )[0];
          state.allTasks[todoListId].splice(targetIndex, 0, draggedItem);
        }
      })
      .addCase(reorderTasksTC.rejected, (state, action) => {});
  },
  selectors: {
    tasksState: (sliceState) => sliceState.allTasks as TaskStateType,
    isBlockTasksToDrag: (sliceState) =>
      sliceState.isBlockTasksToDrag as boolean,
    tasksById: (sliceState, todoId: string) =>
      sliceState.allTasks[todoId] as TasksWithEntityStatusType[],
    // isTaskDragging: (sliceState, todoId: string) =>
    //   sliceState[todoId] as TasksWithEntityStatusType[],
  },
});

//! Thunk
const fetchTasksTC = createAppAsyncThunk<
  { todolistId: string; tasks: TaskType[] },
  string
>(`${slice.name}/fetchTasks`, async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
  console.log("FETCHTASKT=TC");
  try {
    const res = await tasksApi.getTasks(todolistId);
    const tasks = res.data.items;
    return { todolistId: todolistId, tasks };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
  }
});
const deleteTaskTC = createAppAsyncThunk<DeleteTaskArgs, DeleteTaskArgs>(
  `${slice.name}/deleteTask`,
  async (args, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.taskId,
        entityStatus: "loading",
      })
    );
    dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
    try {
      const res = await tasksApi.deleteTask(args);
      if (res.data.resultCode === 0) {
        return { todoListId: args.todoListId, taskId: args.taskId };
      } else {
        handleServerAppError(res.data, dispatch, "Something wrong, try later");
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(
        tasksActions.updateTaskEntityStatus({
          todoListId: args.todoListId,
          taskId: args.taskId,
          entityStatus: "success",
        })
      );
      dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    }
  }
);

// ! Разделяю, чтобы при DND не перерисовывать страницу
const addTaskTC = createAppAsyncThunk<{ task: TaskType }, CreateTaskArgs>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
    try {
      const res = await tasksApi.createTask(arg);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
        return { task };
      } else {
        handleServerAppError(
          res.data,
          dispatch,
          "Oops! Something gone wrong. Length should be less 100 symbols"
        );
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    }
  }
);

const updateTaskTC = createAppAsyncThunk<
  { todoListId: string; taskId: string; model: UpdateTaskType },
  { todoListId: string; taskId: string; model: Partial<UpdateTaskType> }
>(`${slice.name}/updateTask`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const state = getState();
  const task = state.tasks.allTasks[args.todoListId].find(
    (tl) => tl.id === args.taskId
  );
  dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
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
    const res = await tasksApi.updateTask(
      args.todoListId,
      args.taskId,
      apiModel
    );
    if (res.data.resultCode === 0) {
      return {
        todoListId: args.todoListId,
        taskId: args.taskId,
        model: apiModel,
      };
    } else {
      handleServerAppError(
        res.data,
        dispatch,
        "Oops! Something gone wrong. Length should be less than 100 symbols"
      );
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.taskId,
        entityStatus: "success",
      })
    );
  }
});

const reorderTasksTC = createAppAsyncThunk<ReorderTasksArgs, ReorderTasksArgs>(
  `${slice.name}/reorderTasks`,
  async (args, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const tasks = getState().tasks.allTasks[args.todoListId];
    const idToServer = dragAndDropIdChanger(tasks, args);
    dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.startDragId,
        entityStatus: "loading",
      })
    );
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.endShiftId ? args.endShiftId : "",
        entityStatus: "loading",
      })
    );

    try {
      const res = await tasksApi.reorderTasks({
        todoListId: args.todoListId,
        startDragId: args.startDragId,
        endShiftId: idToServer,
      });
      if (res.data.resultCode === 0) {
        // dispatch(fetchTasksTC(args.todoListId))
        return args;
      } else {
        handleServerAppError(
          res.data,
          dispatch,
          "Oops! Something gone wrong. Length should be less than 100 symbols"
        );
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
      dispatch(
        tasksActions.updateTaskEntityStatus({
          todoListId: args.todoListId,
          taskId: args.startDragId,
          entityStatus: "success",
        })
      );
      dispatch(
        tasksActions.updateTaskEntityStatus({
          todoListId: args.todoListId,
          taskId: args.endShiftId ? args.endShiftId : "",
          entityStatus: "success",
        })
      );
    }
  }
);
// Region
// !  Thunks for Drag and Drop to prevent rerender
// Do not need only for deleteTaskThunk
const addTaskDnDTC = createAppAsyncThunk<{ task: TaskType }, CreateTaskArgs>(
  `${slice.name}/addTaskDnDTC`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
    try {
      const res = await tasksApi.createTask(arg);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
        return { task };
      } else {
        handleServerAppError(
          res.data,
          dispatch,
          "Oops! Something gone wrong. Length should be less 100 symbols"
        );
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    }
  }
);

const reorderTasksSoloTodoDnDTC = createAppAsyncThunk<
  undefined,
  ReorderTasksArgs
>(`${slice.name}/reorderTasksSoloTodoDnDTC`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const tasks = getState().tasks.allTasks[args.todoListId];
  const idToServer = dragAndDropIdChanger(tasks, args);
  dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.startDragId,
      entityStatus: "loading",
    })
  );
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.endShiftId ? args.endShiftId : "",
      entityStatus: "loading",
    })
  );

  try {
    const res = await tasksApi.reorderTasks({
      todoListId: args.todoListId,
      startDragId: args.startDragId,
      endShiftId: idToServer,
    });
    if (res.data.resultCode === 0) {
      // dispatch(fetchTasksTC(args.todoListId))
      return undefined;
    } else {
      handleServerAppError(
        res.data,
        dispatch,
        "Oops! Something gone wrong. Length should be less than 100 symbols"
      );
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.startDragId,
        entityStatus: "success",
      })
    );
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.endShiftId ? args.endShiftId : "",
        entityStatus: "success",
      })
    );
  }
});

const reorderTasksDnDByOrderTC = createAppAsyncThunk<
  undefined,
  {
    todoListId: string;
    startOrder: number;
    startDragId: string;
    endShiftId: string;
  }
>(`${slice.name}/reorderTasksDnDByOrderTC`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const tasks = getState().tasks.allTasks[args.todoListId];
  const idToServer = dragAndDropIdChangerByOrder(tasks, args);
  // const idToServer =
  //   tasks.findIndex((t) => t.id === args.endShiftId) === 0
  //     ? null
  //     : args.endShiftId;
  dispatch(appActions.setAppStatusTask({ statusTask: "loading" }));
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.startDragId,
      entityStatus: "loading",
    })
  );
  dispatch(
    tasksActions.updateTaskEntityStatus({
      todoListId: args.todoListId,
      taskId: args.endShiftId ? args.endShiftId : "",
      entityStatus: "loading",
    })
  );

  try {
    const res = await tasksApi.reorderTasks({
      todoListId: args.todoListId,
      startDragId: args.startDragId,
      endShiftId: idToServer,
    });
    if (res.data.resultCode === 0) {
      // dispatch(fetchTasksTC(args.todoListId))
      return undefined;
    } else {
      handleServerAppError(
        res.data,
        dispatch,
        "Oops! Something gone wrong. Length should be less than 100 symbols"
      );
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatusTask({ statusTask: "success" }));
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.startDragId,
        entityStatus: "success",
      })
    );
    dispatch(
      tasksActions.updateTaskEntityStatus({
        todoListId: args.todoListId,
        taskId: args.endShiftId ? args.endShiftId : "",
        entityStatus: "success",
      })
    );
  }
});

export const tasksActions = slice.actions;
export const tasksSlice = slice.reducer;
export const tasksSelectors = slice.selectors;
export const tasksThunks = {
  fetchTasksTC,
  addTaskTC,
  updateTaskTC,
  deleteTaskTC,
  reorderTasksTC,
  addTaskDnDTC,
  reorderTasksSoloTodoDnDTC,
  reorderTasksDnDByOrderTC,
};

// ================================================
// ================================================
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
// ================================================
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
// ================================================
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
// ================================================
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

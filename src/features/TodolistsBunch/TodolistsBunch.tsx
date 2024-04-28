import React, { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  FilterValuesType,
  todolistsActions,
  todolistsSelectors,
  todolistsThunks,
  TodoUIType,
} from "../../redux/todolistsSlice";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { appSelectors } from "../../redux/appSlice";
import { loginSelectors } from "../../redux/loginSlice";
import { AddItemForm } from "../../common/components";
import { useActions } from "../../common/hooks/useActions";
import {
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskType } from "../../api/tasks-api";
import { Task } from "./Todolist/Task/Task";
import {
  tasksSelectors,
  TasksWithEntityStatusType,
} from "../../redux/tasksSlice";
import { todolistsAPI, TodolistType } from "../../api/todolists-api";

type TodolistsBunchProps = {};
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  // const dispatch = useAppDispatch();
  const {
    changeTodoFilter: changeTodoFilterAC,
    updateTodoTitleTC,
    reorderTodolist,
    reorderTodolistTC,
    addTodoTC,
    addTaskDnDTC,
    deleteTaskTC,
    removeTask,
    addTask,
    reorderTask,
    reorderTasksTC,
    reorderTasksSoloTodoDnDTC,
    reorderTasksDnDByOrderTC,
    moveTaskAcrossTodolists,
    fetchTasksTC,
    fetchTodolistsTC,
    addTaskTC,
    changeTaskIsDragging,
    changeTaskIsDragOver,
    changeTodoIsDragging,
    changeTodoIsDragOver,
    changeIsBlockTodosToDrag,
    changeIsBlockTasksToDrag,
    moveTaskInEmptyTodolists,
    sortTasksByOrder,
  } = useActions();

  const todolists = useAppSelector((state) =>
    todolistsSelectors.todolists(state)
  );
  const statusAddTodo = useAppSelector((state) =>
    appSelectors.statusTodo(state)
  );
  const isLoggedIn = useAppSelector((state) =>
    loginSelectors.isLoggedIn(state)
  );

  const [activeTodo, setActiveTodo] = useState<TodoUIType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [memoActiveTodoId, setMemoActiveTodoId] = useState<string | null>(null);
  const [memoOverTodoId, setMemoOverTodoId] = useState<string | null>(null);
  const [memoActiveTaskId, setMemoActiveTaskId] = useState<string | null>(null);
  const [memoOverTaskId, setMemoOverTaskId] = useState<string | null>(null);
  const [memoActiveTaskCopy, setMemoActiveTaskCopy] = useState<TaskType | null>(
    null
  );
  const [memoTodosServerAr, setMemoTodosServerAr] = useState<TodolistType[]>();
  const [memoActiveTodoOrder, setMemoActiveTodoOrder] = useState<number>(0);
  const [memoOverTodoOrder, setMemoOverTodoOrder] = useState<number>(0);
  const [memoOverTask, setMemoOverTask] = useState<TaskType | null>(null);
  const [mA, setMA] = useState<any | null>(null);
  const [mO, setMO] = useState<any | null>(null);

  const todolistIds = useMemo(
    () => todolists.allTodolists.map((tl) => tl.id),
    [todolists]
  );
  const tasks = useAppSelector(tasksSelectors.tasksState);

  const changeFilter = useCallback(
    (todoListId: string, newFilterValue: FilterValuesType) => {
      changeTodoFilterAC({
        todoListId: todoListId,
        newFilterValue: newFilterValue,
      });
    },
    []
  );

  const addTodo = useCallback((newTodoTitle: string) => {
    addTodoTC(newTodoTitle);
  }, []);

  const updTodoTitle = useCallback(
    (todoListId: string, updTodoTitle: string) => {
      updateTodoTitleTC({
        todoListId: todoListId,
        title: updTodoTitle,
      });
    },
    []
  );

  const onDragStartHandler = (event: DragStartEvent) => {
    const getTodos = async () => {
      const res = await todolistsAPI.getTodolists();
      setMemoTodosServerAr(res.data);
    };
    getTodos();
    if (event.active.data.current?.type === "Todolist") {
      setActiveTodo(event.active.data.current.todolist);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      event.active.data.current.todoListId =
        event.active.data.current.task.todoListId;
      return;
    }
  };
  const onDragOverHandler = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    let activeTodoListId = active.data.current?.todolist?.id;
    const activeTaskId = active.data.current?.task?.id;
    let overTodoListId = over.data.current?.todolist?.id;
    const overTaskId = over.data.current?.task?.id;
    // 1 сценарий, дропаю таску на другую таску в одном или другом туду
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isActiveATodolist = active.data.current?.type === "Todolist";
    const isOverATodolist = over.data.current?.type === "Todolist";
    const extraActiveTodoListId =
      active.data.current?.todolist?.id ||
      active.data.current?.task?.todoListId;
    const extraOverTodoListId =
      over.data.current?.todolist?.id || over.data.current?.task?.todoListId;
    const activeTodoOrder = memoTodosServerAr?.find(
      (tl) => tl.id === extraActiveTodoListId
    )?.order;
    const overTodoOrder = memoTodosServerAr?.find(
      (tl) => tl.id === extraOverTodoListId
    )?.order;

    // Region Активная таска
    // ? Над таской, в одном тудулисте
    if (isActiveATask && isOverATask && activeTodoOrder === overTodoOrder) {
      activeTodoListId = active.data.current?.task?.todoListId;
      overTodoListId = over.data.current?.task?.todoListId;
      // ! Когда activeTodolistId === overTodolistId
      // setMemoActiveTodoId(activeTodoListId.toString());
      // setMemoOverTodoId(overTodoListId.toString());
      // setMemoActiveTaskId(activeTaskId);
      setMemoOverTaskId(overTaskId);
      reorderTask({
        todoListId: activeTodoListId,
        startDragId: activeTaskId,
        endShiftId: overTaskId,
      });
    }
    // ? Над таской, в другом тудулисте
    if (isActiveATask && isOverATask && activeTodoOrder !== overTodoOrder) {
      activeTodoListId = active.data.current?.task?.todoListId;
      overTodoListId = over.data.current?.task?.todoListId;
      if (activeTaskId === overTaskId) return;
      setMemoActiveTodoId(activeTodoListId);
      setMemoOverTodoId(overTodoListId.toString());
      setMemoActiveTaskId(activeTaskId);
      setMemoOverTaskId(overTaskId);
      setMemoActiveTodoOrder(activeTodoOrder || 0);
      setMemoOverTodoOrder(overTodoOrder || 0);
      setMemoOverTask(over.data.current?.task);

      moveTaskAcrossTodolists({
        todoListId: activeTodoListId,
        endTodoListId: overTodoListId,
        startDragId: activeTaskId,
        endShiftId: overTodoListId,
      });
    }
    // ? В другой пустой тудулист
    if (
      isActiveATask &&
      isOverATodolist &&
      tasks[overTodoListId]?.length === 0
    ) {
      activeTodoListId = active.data.current?.task?.todoListId;
      overTodoListId = over.data.current?.todolist.id;
      setMemoActiveTodoId(activeTodoListId);
      setMemoOverTodoId(overTodoListId);
      setMemoActiveTaskId(activeTaskId);
      setMemoOverTaskId(overTaskId);
      setMemoActiveTaskCopy(active.data.current?.task);
      moveTaskInEmptyTodolists({
        todoListId: activeTodoListId,
        endTodoListId: overTodoListId,
        startDragId: activeTaskId,
      });
      // if (tasks[overTodoListId]?.length !== 0) {
      //   moveTaskAcrossTodolists({
      //     todoListId: activeTodoListId,
      //     endTodoListId: overTodoListId,
      //     startDragId: activeTaskId,
      //     endShiftId: overTaskId,
      //   });
      // }
    }
    // Region Активный тудулист
    if (isActiveATodolist && isOverATodolist) {
      activeTodoListId = active?.data.current?.todolist.id;
      overTodoListId = over?.data.current?.todolist.id;
      setMemoOverTodoId(overTodoListId);
      setMemoActiveTodoId(activeTodoListId);
      if (activeTodo) {
        // reorderTodolistTC({ endShiftId: overTodoListId, startDragId: activeTodo.id });
        reorderTodolist({
          endShiftId: overTodoListId,
          startDragId: activeTodo.id,
        });
      }
    }
  };

  const onDragEndHandler = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    let activeTodoListId = active.data.current?.todolist?.id;
    const activeTaskId = active.data.current?.task?.id;
    let overTodoListId = over.data.current?.todolist?.id;
    const overTaskId = over.data.current?.task?.id;
    // 1 сценарий, дропаю таску на другую таску в одном или другом туду
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isActiveATodolist = active.data.current?.type === "Todolist";
    const isOverATodolist = over.data.current?.type === "Todolist";
    // const extraActiveTodoListId =
    //   active.data.current?.todolist?.id ||
    //   active.data.current?.task?.todoListId;
    // const extraOverTodoListId =
    //   over.data.current?.todolist?.id || over.data.current?.task?.todoListId;
    // const activeTodoOrder = memoTodosServerAr?.find(
    //   (tl) => tl.id === extraActiveTodoListId
    // )?.order;
    // const overTodoOrder = memoTodosServerAr?.find(
    //   (tl) => tl.id === extraOverTodoListId
    // )?.order;
    // Region Активная таска
    // ? Над таской, в одном тудулисте
    if (isActiveATask && isOverATask && memoActiveTodoId === memoOverTodoId) {
      // activeTodoListId = memoTodosServerAr?.find(
      //   (tl) => tl.order === activeTodoOrder
      // )?.id;
      // overTodoListId = memoTodosServerAr?.find(
      //   (tl) => tl.order === overTodoOrder
      // )?.id;
      // ! Когда activeTodolistId === overTodolistId
      // Поделено, чтобы на UI работало норм
      // End Нужно для endShiftId использовать функцию dragAndDropIdChanger
      reorderTasksSoloTodoDnDTC({
        todoListId: activeTask?.todoListId || "",
        startDragId: activeTaskId,
        endShiftId: overTaskId,
      }).then(() => {
        fetchTasksTC(activeTask?.todoListId || "");
      });
    }
    // ? Над таской, в другом тудулисте
    if (isActiveATask && isOverATask && memoActiveTodoId !== memoOverTodoId) {
      activeTodoListId = active.data.current?.task?.todoListId;
      overTodoListId = over.data.current?.task?.todoListId;
      const activeCopy: TaskType = active.data.current?.task;
      // Чтобы нормально на UI отрисовалось перемещение
      reorderTask({
        todoListId: overTodoListId,
        startDragId: activeTaskId,
        endShiftId: overTaskId,
      });
      // ! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
      deleteTaskTC({
        todoListId: activeTask?.todoListId || "",
        taskId: activeTaskId,
      }).then(() => {
        //! 2 создаем в новом тудулисте новую
        if (overTodoListId) {
          addTaskDnDTC({
            todoListId: overTodoListId,
            title: activeCopy.title,
          }).then((res) => {
            if (res.payload?.task.id) {
              console.log(tasks);
              //! 3 делаем на созданную таску реордер и ререндер
              // End Нужно сделать смену этой санки на SoloDndTC, и для endShiftId использовать функцию dragAndDropIdChangerByOrder (ПОМЕНЯТЬ НАЗВАНИЕ)
              reorderTasksDnDByOrderTC({
                todoListId: overTodoListId,
                startDragId: res.payload.task.id,
                // End Я НЕ РАБОТАЮ ТУТ С STARTORDER
                startOrder: res.payload.task.order,
                endShiftId: activeTaskId,
                // Тут активная таск Id, иначе если ставить over,то будет ругаться т.к. я не знаю почему, у меня были ошибки,
                // Вероятно потому что мы тут создали таску, и она является активной, именно ее нужно воспринимать как ту,
                // чей Id мы должны отправлять на сервер, нам не нужно менять ордер у over таски
              }).then(() => {
                fetchTasksTC(overTodoListId);
                fetchTasksTC(memoActiveTodoId || "");
              });
            }
          });
        }
      });
    }
    // ? В другой пустой тудулист
    if (
      isActiveATask &&
      isOverATodolist &&
      tasks[overTodoListId]?.length === 0
    ) {
      activeTodoListId = active.data.current?.task?.todoListId;
      const activeCopy = memoActiveTaskCopy;
      // ! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
      deleteTaskTC({
        todoListId: activeTask?.todoListId || "",
        taskId: activeTaskId,
      }).then(() => {
        //! 2 создаем в новом тудулисте новую
        if (activeCopy) {
          addTaskTC({
            todoListId: overTodoListId,
            title: activeCopy.title,
          });
        }
      });
    }
    // Region Активный тудулист
    if (isActiveATodolist && isOverATodolist) {
      const startDragId = activeTodoListId;
      const endShiftId = overTodoListId;
      reorderTodolistTC({ endShiftId, startDragId });
    }

    setActiveTodo(null);
    setActiveTask(null);
    setMemoActiveTodoId(null);
    setMemoOverTodoId(null);
    setMemoActiveTaskId(null);
    setMemoOverTaskId(null);
    setMemoActiveTodoOrder(0);
    setMemoOverTodoOrder(0);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <DndContext
      onDragStart={onDragStartHandler}
      onDragOver={onDragOverHandler}
      onDragEnd={onDragEndHandler}
      sensors={sensors}
      collisionDetection={closestCorners}
    >
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm callback={addTodo} />
      </Grid>
      <Grid container spacing={3}>
        <SortableContext items={todolistIds}>
          {todolists.allTodolists.map((tl) => {
            return (
              <Grid item key={tl.id}>
                <Todolist
                  key={tl.id}
                  todoListId={tl.id}
                  todoTitle={tl.title}
                  tasksFilter={tl.filter}
                  changeFilter={changeFilter}
                  updTodoTitle={updTodoTitle}
                  entityStatus={tl.entityStatus}
                  disabled={tl.entityStatus}
                  showTasks={tl.showTasks}
                  todolist={tl}
                />
              </Grid>
            );
          })}
        </SortableContext>
      </Grid>
      {createPortal(
        <DragOverlay>
          {activeTodo && (
            <Grid item>
              <Todolist
                key={activeTodo.id}
                todoListId={activeTodo.id}
                todoTitle={activeTodo.title}
                tasksFilter={activeTodo.filter}
                changeFilter={changeFilter}
                updTodoTitle={updTodoTitle}
                entityStatus={activeTodo.entityStatus}
                disabled={activeTodo.entityStatus}
                showTasks={activeTodo.showTasks}
                todolist={activeTodo}
              />
            </Grid>
          )}
          {activeTask && (
            <Task
              key={activeTask.id}
              taskId={activeTask.id}
              tIsDone={activeTask.status}
              oldTitle={activeTask.title}
              todoListId={activeTask.todoListId}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

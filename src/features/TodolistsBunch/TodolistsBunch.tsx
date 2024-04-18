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
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskType } from "../../api/tasks-api";
import { Task } from "./Todolist/Task/Task";
import {
  tasksSelectors,
  TasksWithEntityStatusType,
} from "../../redux/tasksSlice";

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
    reorderTask,
    reorderTasksTC,
    reorderTasksSoloTodoDnDTC,
    reorderTasksDnDBetweenTodosTC,
    moveTaskAcrossTodolists,
    fetchTasksTC,
    fetchTodolistsTC,
    addTaskTC,
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
  const [memoTodoId, setMemoTodoId] = useState<string | null>(null);
  const [memoOverTodoId, setMemoOverTodoId] = useState<string | null>(null);
  const [memoActiveTaskId, setMemoActiveTaskId] = useState<string | null>(null);
  const [memoOverTaskId, setMemoOverTaskId] = useState<string | null>(null);

  const todolistIds = useMemo(() => todolists.map((tl) => tl.id), [todolists]);
  const tasks = useAppSelector(tasksSelectors.tasksState);
  // console.log('TODO-UI-INDEX', todolists[0])

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
    console.log("Событие", event.active.data);
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
    const activeId = active.id;
    const activeTId = active.data.current?.task?.id;
    const overId = over.id;
    const overTId = over.data.current?.task?.id;

    if (activeId === overId) return;

    if (activeTodo) {
      console.log("activeTodo");
    }
    // 1 сценарий, дропаю таску на другую таску в одном или другом туду
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    // if (!isActiveATask) return;
    if (isActiveATask && isOverATask) {
      // if (activeTId === overTId) {
      //   console.log("activeTId === overTId");
      //   return;
      // }
      const activeTodoListId = active.data.current?.task.todoListId || "";
      const overTodoListId = over.data.current?.task.todoListId || "";
      // Когда activeTodolistId === overTodolistId
      if (activeTodoListId === overTodoListId) {
        if (activeTId !== overTId) {
          setMemoActiveTaskId(activeTId);
          setMemoOverTaskId(overTId);
          console.log("activeTodoListId === overTodoListId");
          console.log("memoTaskId", memoActiveTaskId);
          console.log("overTaskId", overTId);
          reorderTask({
            todoListId: active.data.current?.task.todoListId,
            startDragId: activeTId.toString(),
            endShiftId: overTId?.toString() || null,
          });
        }
      }
      if (activeTodoListId !== overTodoListId) {
        console.log("activeTodoListId !== overTodoListId");
        setMemoTodoId(activeTodoListId);
        setMemoOverTodoId(overTodoListId);
        setMemoActiveTaskId(activeTId);
        setMemoOverTaskId(overTId);
        moveTaskAcrossTodolists({
          todoListId: activeTodoListId,
          endTodoListId: overTodoListId,
          startDragId: activeId.toString(),
          endShiftId: overId.toString(),
        });
      }
    }
  };
  const onDragEndHandler = (event: DragEndEvent) => {
    setActiveTodo(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    console.log("onDragEndHandler", {
      activeId: event.active.id,
      memoId: memoTodoId,
      memoActiveTaskId: memoActiveTaskId,
      memoOverTaskId: memoOverTaskId,
      overId: event.over?.id,
      activeTId: event.active.data.current?.task?.id,
      overTId: event.over?.data.current?.task?.id,
    });

    // const activeId = memoTodoId
    //   ? tasks[memoTodoId].findIndex((task) => task.id === active.id)
    //   : active.id;
    const activeId = memoTodoId;
    const activeTId = memoActiveTaskId;

    // const overId = over.id;
    const overId = over.id;
    const overTId = memoOverTaskId;
    if (activeTId === overTId && activeId === overId) {
      console.log("activeId === overId");
      return;
    }

    // Region 1 сценарий, дропаю таску на другую таску в одном или другом туду
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    // if (!isActiveATask) {
    //   console.log("!isActiveATask");
    //   return;
    // }
    if (isActiveATask && isOverATask) {
      // const activeTodoListId = active.data.current?.task.todoListId || "";
      const activeTodoListId = active.data.current?.task.todoListId;
      const overTodoListId = over.data.current?.task.todoListId;
      // console.log("activeTodoListId", activeTodoListId);
      // console.log("overTodoListId", overTodoListId);
      //! Когда activeTodolistId === overTodolistId
      if (memoTodoId === memoOverTodoId) {
        console.log("activeTodoListId === overTodoListId");
        if (activeTId !== overTId) {
          console.log("activeTId !== overTId");
          console.log("ReorferTasksSoloTodoDnD", {
            todoListId: activeTodoListId,
            startDragId: memoActiveTaskId,
            endShiftId: memoOverTaskId,
          });
          reorderTasksSoloTodoDnDTC({
            todoListId: activeTodoListId,
            startDragId: memoActiveTaskId || "",
            endShiftId: memoOverTaskId || "",
          });
        }
      }
      // todo Антоним
      if (memoTodoId !== memoOverTodoId) {
        console.log("memoTodoId !== overTodoListId");
        if (memoTodoId === null) return;
        const activeCopy: TaskType = active.data.current?.task;
        // ! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
        deleteTaskTC({
          todoListId: memoTodoId,
          taskId: memoActiveTaskId || "",
        }).then(() => {
          //! 2 создаем в новом тудулисте новую
          if (memoOverTodoId) {
            addTaskDnDTC({
              todoListId: memoOverTodoId,
              title: activeCopy.title,
            }).then((res) => {
              if (res.payload?.task.id) {
                console.log("reorderTasksDnDBetweenTodosTC", {
                  todoListId: memoOverTodoId,
                  endShiftId: memoOverTaskId,
                });
                const searchEndIndex = tasks[memoOverTodoId].findIndex(
                  (t) => t.id === memoOverTaskId
                );
                // todo How to change the id to set the task if task goes upward?
                //! 3 делаем на созданную таску реордер и ререндер
                reorderTasksDnDBetweenTodosTC({
                  todoListId: memoOverTodoId,
                  startDragId: res.payload.task.id,
                  endShiftId: memoOverTaskId || "",
                  newTodoListId: res.payload?.task.todoListId.toString(),
                }).then(() => {
                  // fetchTasksTC();
                  fetchTodolistsTC();
                });
              }
            });
          }
        });
      }
    }
    if (event.over?.data.current?.type === "Todolist") {
      const isOverATodolist = over.data.current?.type === "Todolist";
      console.log(isOverATodolist);
      console.log("A СЮДА ПОПАЛ?");
      const endShiftId = event.over?.data.current?.todolist.id;
      if (activeTodo) {
        reorderTodolistTC({ endShiftId, startDragId: activeTodo.id });
        reorderTodolist({ endShiftId, startDragId: activeTodo.id });
      }
      // Region 2 сценарий - пустой тудулист
      if (isActiveATask && isOverATodolist) {
        console.log("ВАВАААААААААААААААААААААААААААА");
        const activeTodoListId = active.data.current?.task.todoListId;
        const overTodoListId = over.data.current?.todolist.id;
        console.log(overTodoListId);
        const activeCopy: TaskType = active.data.current?.task;
        // ! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
        deleteTaskTC({
          todoListId: activeTodoListId,
          taskId: event.active.id.toString(),
        }).then(() => {
          //! 2 создаем в новом тудулисте новую
          if (overTodoListId) {
            addTaskTC({
              todoListId: overTodoListId,
              title: activeCopy.title,
            });
          }
        });
      }
    }

    // if (over?.data.current?.type === "Todolist") {
    //   console.log("A СЮДА ПОПАЛ?");
    //   const endShiftId = event.over?.data.current?.todolist.id;
    //   if (activeTodo) {
    //     reorderTodolistTC({ endShiftId, startDragId: activeTodo.id });
    //     reorderTodolist({ endShiftId, startDragId: activeTodo.id });
    //   }
    // }

    setMemoTodoId(null);
    setMemoOverTodoId(null);
    setMemoActiveTaskId(null);
    setMemoOverTaskId(null);
  };

  // End
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
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
    >
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm callback={addTodo} />
      </Grid>
      <Grid container spacing={3}>
        <SortableContext items={todolistIds}>
          {todolists.map((tl) => {
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

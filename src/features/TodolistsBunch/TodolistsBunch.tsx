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
    changeTaskIsDragging,
    changeTaskIsDragOver,
    changeTodoIsDragging,
    changeTodoIsDragOver,
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
  const [mA, setMA] = useState<any | null>(null);
  const [mO, setMO] = useState<any | null>(null);

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
      const isTodoDragging = todolists.find(
        (tl) => tl.id === event.active.data.current?.todolist.id
      )?.isTodoDragging;
      changeTodoIsDragging({
        todoListId: event.active.data.current.todolist.id,
        isTodoDragging: true,
      });
      // changeTaskIsDragging({
      //   todoListId: event.active.data.current.task.todolistId,
      //   taskId: tasks[event.active.data.current.task.todoListId].findIndex(
      //     (t) => t.id
      //   ),
      //   isDragging: false,
      // });
      console.log(event.active);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      changeTaskIsDragging({
        todoListId: event.active.data.current.task.todoListId,
        taskId: event.active.data.current.task.id,
        isDragging: true,
      });
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

    if (activeTodoListId === overTodoListId) return;

    // 1 сценарий, дропаю таску на другую таску в одном или другом туду
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (isActiveATask && isOverATask) {
      // activeTodoListId = active.data.current?.task.todoListId || "";
      // overTodoListId = over.data.current?.task.todoListId || "";
      // Когда activeTodolistId === overTodolistId
      if (activeTodoListId === overTodoListId && activeTaskId !== overTaskId) {
        setMemoActiveTaskId(activeTaskId);
        setMemoOverTaskId(overTaskId);
        console.log("WHATATTTAI");
        // reorderTask({
        //   todoListId: activeTask?.todoListId || "",
        //   startDragId: activeTaskId.toString(),
        //   endShiftId: overTaskId?.toString() || null,
        // });
        changeTaskIsDragOver({
          todoListId: activeTodoListId,
          taskId: overTaskId,
          isDragOver: true,
        });
      }
      if (activeTodoListId !== overTodoListId) {
        console.log("activeTodoListId !== overTodoListId");
        setMemoTodoId(activeTodoListId.toString());
        setMemoOverTodoId(overTodoListId.toString());
        setMemoActiveTaskId(activeTaskId);
        setMemoOverTaskId(overTaskId);
        moveTaskAcrossTodolists({
          todoListId: activeTask?.todoListId || "",
          endTodoListId: overTodoListId.toString(),
          startDragId: activeTask?.id.toString() || "",
          endShiftId: overTodoListId.toString(),
        });
      }
    }
  };
  const onDragEndHandler = (event: DragEndEvent) => {
    //   const { active, over } = event;
    //   if (!over) return;
    //
    //   const activeId = memoTodoId;
    //   const activeTId = memoActiveTaskId;
    //
    //   const overId = over.id;
    //   const overTId = memoOverTaskId;
    //   if (activeTId === overTId && activeId === overId) {
    //     console.log("activeId === overId");
    //     return;
    //   }
    //
    //   // Region 1 сценарий, дропаю таску на другую таску в одном или другом туду
    //   const isActiveATask = active.data.current?.type === "Task";
    //   const isOverATask = over.data.current?.type === "Task";
    //   if (isActiveATask && isOverATask) {
    //     const activeTodoListId = active.data.current?.task.todoListId;
    //     const overTodoListId = over.data.current?.task.todoListId;
    //     //! Когда activeTodolistId === overTodolistId
    //     if (memoTodoId === memoOverTodoId) {
    //       console.log("activeTodoListId === overTodoListId");
    //       if (activeTId !== overTId) {
    //         console.log("activeTId !== overTId");
    //         console.log("ReorferTasksSoloTodoDnD", {
    //           todoListId: activeTodoListId,
    //           startDragId: memoActiveTaskId,
    //           endShiftId: memoOverTaskId,
    //         });
    //         reorderTasksSoloTodoDnDTC({
    //           todoListId: activeTodoListId,
    //           startDragId: memoActiveTaskId || "",
    //           endShiftId: memoOverTaskId || "",
    //         });
    //       }
    //     }
    //     // todo Антоним
    //     if (memoTodoId !== memoOverTodoId) {
    //       console.log("memoTodoId !== overTodoListId");
    //       if (memoTodoId === null) return;
    //       const activeCopy: TaskType = active.data.current?.task;
    //       // ! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
    //       deleteTaskTC({
    //         todoListId: memoTodoId,
    //         taskId: memoActiveTaskId || "",
    //       }).then(() => {
    //         //! 2 создаем в новом тудулисте новую
    //         if (memoOverTodoId) {
    //           addTaskDnDTC({
    //             todoListId: memoOverTodoId,
    //             title: activeCopy.title,
    //           }).then((res) => {
    //             if (res.payload?.task.id) {
    //               console.log("reorderTasksDnDBetweenTodosTC", {
    //                 todoListId: memoOverTodoId,
    //                 endShiftId: memoOverTaskId,
    //               });
    //               const searchEndIndex = tasks[memoOverTodoId].findIndex(
    //                 (t) => t.id === memoOverTaskId
    //               );
    //               // todo How to change the id to set the task if task goes upward?
    //               //! 3 делаем на созданную таску реордер и ререндер
    //               reorderTasksDnDBetweenTodosTC({
    //                 todoListId: memoOverTodoId,
    //                 startDragId: res.payload.task.id,
    //                 endShiftId: memoOverTaskId || "",
    //                 newTodoListId: res.payload?.task.todoListId.toString(),
    //               }).then(() => {
    //                 // fetchTasksTC();
    //                 fetchTodolistsTC();
    //               });
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    //   if (event.over?.data.current?.type === "Todolist") {
    //     const isOverATodolist = over.data.current?.type === "Todolist";
    //     console.log(isOverATodolist);
    //     console.log("A СЮДА ПОПАЛ?");
    //     const endShiftId = event.over?.data.current?.todolist.id;
    //     if (activeTodo) {
    //       reorderTodolistTC({ endShiftId, startDragId: activeTodo.id });
    //       reorderTodolist({ endShiftId, startDragId: activeTodo.id });
    //     }
    //     // Region 2 сценарий - пустой тудулист
    //     if (isActiveATask && isOverATodolist) {
    //       console.log("ВАВАААААААААААААААААААААААААААА");
    //       const activeTodoListId = active.data.current?.task.todoListId;
    //       const overTodoListId = over.data.current?.todolist.id;
    //       console.log(overTodoListId);
    //       const activeCopy: TaskType = active.data.current?.task;
    //       // ! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
    //       deleteTaskTC({
    //         todoListId: activeTodoListId,
    //         taskId: event.active.id.toString(),
    //       }).then(() => {
    //         //! 2 создаем в новом тудулисте новую
    //         if (overTodoListId) {
    //           addTaskTC({
    //             todoListId: overTodoListId,
    //             title: activeCopy.title,
    //           });
    //         }
    //       });
    //     }
    //   }
    //
    //   setActiveTodo(null);
    //   setActiveTask(null);
    //   setMemoTodoId(null);
    //   setMemoOverTodoId(null);
    //   setMemoActiveTaskId(null);
    //   setMemoOverTaskId(null);
  };

  // End
  // const customCollisionDetection: CollisionDetection = (active, over) => {
  //   const activeRect = active.rect;
  //   const overRect = over.rect;

  //   const intersection = rectIntersection(activeRect, overRect);

  //   if (!intersection) {
  //     return null;
  //   }

  //   const intersectionWidth = intersection.right - intersection.left;
  //   const intersectionHeight = intersection.bottom - intersection.top;
  //   const overArea = overRect.width * overRect.height;
  //   const intersectionArea = intersectionWidth * intersectionHeight;

  //   const overlapPercent = (intersectionArea / overArea) * 100;

  //   if (overlapPercent < 50) {
  //     return null;
  //   }

  //   return [{
  //     active,
  //     over,
  //     rect: intersection,
  //   }];
  // }

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
      // collisionDetection={customCollisionDetection}
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

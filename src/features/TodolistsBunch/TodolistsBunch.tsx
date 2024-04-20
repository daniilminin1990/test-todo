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

  const todolistIds = useMemo(
    () => todolists.allTodolists.map((tl) => tl.id),
    [todolists]
  );
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
      const isTodoDragging = todolists.allTodolists.find(
        (tl) => tl.id === event.active.data.current?.todolist.id
      )?.isTodoDragging;
      changeTodoIsDragging({
        todoListId: event.active.data.current.todolist.id,
        isTodoDragging: true,
      });
      changeIsBlockTasksToDrag(true);
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
      changeIsBlockTodosToDrag(true);
      changeTaskIsDragging({
        todoListId: event.active.data.current.task.todoListId,
        taskId: event.active.data.current.task.id,
        isTaskDragging: true,
      });
      console.log(event.active);
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
    // Region Активная таска
    // ? Над таской, в одном тудулисте
    if (isActiveATask && isOverATask) {
      activeTodoListId = active.data.current?.task?.todoListId;
      overTodoListId = over.data.current?.task?.todoListId;
      if (activeTodoListId === overTodoListId && activeTaskId !== overTaskId) {
        setMemoActiveTaskId(activeTaskId);
        setMemoOverTaskId(overTaskId);
      }
      if (activeTodoListId !== overTodoListId) {
        console.log("activeTodoListId !== overTodoListId");
        setMemoTodoId(activeTodoListId.toString());
        setMemoOverTodoId(overTodoListId.toString());
        setMemoActiveTaskId(activeTaskId);
        setMemoOverTaskId(overTaskId);
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
    // Region Активная таска
    // ? Над таской, в одном тудулисте
    if (isActiveATask && isOverATask && activeTodoListId === overTodoListId) {
      console.log("Над таской, в одном тудулисте");
      activeTodoListId = active.data.current?.task?.todoListId;
      overTodoListId = over.data.current?.task?.todoListId;
      // ! Когда activeTodolistId === overTodolistId
      // Поделено, чтобы на UI работало норм
      reorderTasksSoloTodoDnDTC({
        todoListId: activeTodoListId,
        startDragId: activeTaskId,
        endShiftId: overTaskId,
      });
      reorderTask({
        todoListId: activeTodoListId,
        startDragId: activeTaskId,
        endShiftId: overTaskId,
      });
    }
    // ? Над таской, в другом тудулисте
    if (isActiveATask && isOverATask && activeTodoListId !== overTodoListId) {
      activeTodoListId = active.data.current?.task?.todoListId;
      overTodoListId = over.data.current?.task?.todoListId;
      console.log("Над таской, в другом тудулист");
      if (memoTodoId === null) return;
      // СТРОКУ НИЖE В DRAGOVER
      if (activeTaskId === overTaskId) return;
      const activeCopy: TaskType = active.data.current?.task;
      setMemoTodoId(activeTodoListId);
      setMemoActiveTaskId(activeTaskId);
      // ! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
      deleteTaskTC({
        todoListId: activeTodoListId,
        taskId: activeTaskId,
      }).then(() => {
        //! 2 создаем в новом тудулисте новую
        if (overTodoListId) {
          addTaskDnDTC({
            todoListId: overTodoListId,
            title: activeCopy.title,
          }).then((res) => {
            if (res.payload?.task.id) {
              //! 3 делаем на созданную таску реордер и ререндер
              reorderTasksDnDByOrderTC({
                todoListId: overTodoListId,
                startDragId: res.payload.task.id,
                startOrder: res.payload.task.order,
                endShiftId: overTaskId,
              }).then(() => {
                fetchTasksTC(overTodoListId);
                fetchTasksTC(activeTodoListId);
              });
            }
          });
        }
      });
      // moveTaskAcrossTodolists({
      //   todoListId: memoTodoId,
      //   endTodoListId: overTodoListId,
      //   startDragId: memoActiveTaskId || "",
      //   endShiftId: overTodoListId,
      // });
    }
    // ? В другой пустой тудулист
    if (
      isActiveATask &&
      isOverATodolist &&
      tasks[overTodoListId]?.length === 0
    ) {
      activeTodoListId = active.data.current?.task?.todoListId;
      // overTodoListId = over.data.current?.task?.todoListId;
      console.log("В другой пустой тудулист");
      const activeCopy: TaskType = active.data.current?.task;
      // ! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
      deleteTaskTC({
        todoListId: activeTodoListId,
        taskId: event.active.id.toString(),
      }).then(() => {
        //! 2 создаем в новом тудулисте новую
        if (overTodoListId) {
          console.log("OVERTODO", overTodoListId);
          addTaskTC({
            todoListId: overTodoListId,
            title: activeCopy.title,
          });
        }
      });
    }
    // Region Активный тудулист
    if (isActiveATodolist && isOverATodolist) {
      const endShiftId = event.over?.data.current?.todolist.id;
      if (activeTodo) {
        reorderTodolistTC({ endShiftId, startDragId: activeTodo.id });
        reorderTodolist({ endShiftId, startDragId: activeTodo.id });
      }
    }

    changeIsBlockTasksToDrag(false);
    changeIsBlockTodosToDrag(false);
    setActiveTodo(null);
    setActiveTask(null);
    setMemoTodoId(null);
    setMemoOverTodoId(null);
    setMemoActiveTaskId(null);
    setMemoOverTaskId(null);
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
      // collisionDetection={customCollisionDetection}
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

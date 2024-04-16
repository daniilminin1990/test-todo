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
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskType } from "../../api/tasks-api";
import { Task } from "./Todolist/Task/Task";
import { tasksSelectors } from "../../redux/tasksSlice";

type TodolistsBunchProps = {};
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  // const dispatch = useAppDispatch();
  const {
    reorderTodolist,
    reorderTodolistTC,
    reorderTask,
    reorderTasksTC,
    changeTodoFilter: changeTodoFilterAC,
    addTodoTC,
    updateTodoTitleTC,
    deleteTaskTC,
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
  const [todoIdToAddNewTask, setTodoIdToAddNewTask] = useState<string>("");

  const todolistIds = useMemo(() => todolists.map((tl) => tl.id), [todolists]);
  const tasks = useAppSelector(tasksSelectors.tasksState);
  // console.log('TODO-UI-INDEX', todolists[0])

  // useEffect(() => {
  //   if(!isLoggedIn){
  //     return
  //   }
  //   dispatch(fetchTodolistsTC())
  // }, []);
  // Region
  // const [todoListIdToDrag, setTodoListIdToDrag] = useState<string>("");
  // function dragStartHandler(
  //   e: React.DragEvent<HTMLDivElement>,
  //   startDragId: string
  // ) {
  //   setTodoListIdToDrag(startDragId);
  //   console.log("DRAGGING-ID", startDragId);
  // }
  //
  // function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {}
  //
  // function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
  //   e.preventDefault();
  // }
  //
  // function dropHandler(e: React.DragEvent<HTMLDivElement>, endShiftId: string) {
  //   e.preventDefault();
  //   // dispatch(
  //   //   todolistsThunks.reorderTodolistTC({
  //   //     endShiftId: endShiftId,
  //   //     startDragId: todoListIdToDrag,
  //   //   })
  //   // );
  //   reorderTodolistTC({
  //     endShiftId: endShiftId,
  //     startDragId: todoListIdToDrag,
  //   });
  // }

  // End

  const changeFilter = useCallback(
    (todoListId: string, newFilterValue: FilterValuesType) => {
      // dispatch(
      //   todolistsActions.changeTodoFilter({
      //     todoListId: todoListId,
      //     newFilterValue: newFilterValue,
      //   })
      // );
      changeTodoFilterAC({
        todoListId: todoListId,
        newFilterValue: newFilterValue,
      });
    },
    []
  );

  const addTodo = useCallback((newTodoTitle: string) => {
    // dispatch(todolistsThunks.addTodoTC(newTodoTitle));
    addTodoTC(newTodoTitle);
  }, []);

  const updTodoTitle = useCallback(
    (todoListId: string, updTodoTitle: string) => {
      // dispatch(
      //   todolistsThunks.updateTodoTitleTC({
      //     todoListId: todoListId,
      //     title: updTodoTitle,
      //   })
      // );
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
      setTodoIdToAddNewTask(event.active.data.current.todolist.id);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      event.active.data.current.todoListId =
        event.active.data.current.task.todoListId;
    }
  };

  const onDragEndHandler = (event: DragEndEvent) => {
    setActiveTodo(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // if (event.over?.data.current?.type === "Todolist") {
    //   const endShiftId = event.over.data.current.todolist.id;
    //   if (activeTodo) {
    //     reorderTodolist({ endShiftId, startDragId: activeTodo.id });
    //     reorderTodolistTC({ endShiftId, startDragId: activeTodo.id });
    //   }
    // }
    if (event.over?.data.current?.type === "Todolist") {
      console.log("A СЮДА ПОПАЛ?");
      const endShiftId = event.over.data.current.todolist.id;
      if (activeTodo) {
        reorderTodolistTC({ endShiftId, startDragId: activeTodo.id });
        reorderTodolist({ endShiftId, startDragId: activeTodo.id });
      }
    }
  };

  // Region Вариант 1 На UI без запросов - не работает для дропа тасок между тудулистами и дропа в пустой тудулист
  const onDragOverHandler = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    // console.log("ACTIVE ID", active);
    const overId = over.id;

    if (activeId === overId) return;
    // 1 сценарий, дропаю таску на другую таску в одном или другом туду
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (!isActiveATask) return;
    if (isActiveATask && isOverATask) {
      let activeTodoListId = active.data.current?.task.todoListId || "";
      let overTodoListId = over.data.current?.task.todoListId || "";
      console.log("activeTodoListId", activeTodoListId);
      console.log("overTodoListId", overTodoListId);
      // Когда activeTodolistId === overTodolistId
      if (activeTodoListId === overTodoListId) {
        reorderTask({
          startDragId: activeId.toString(),
          endShiftId: overId.toString(),
          todoListId: activeTodoListId,
          endTodoListId: overTodoListId,
        });
        // reorderTask({
        //   todoListId: active.data.current?.task.todoListId,
        //   startDragId: activeId.toString(),
        //   endShiftId: overId.toString(),
        // });
      }
      // todo Антоним
      if (activeTodoListId !== overTodoListId) {
        activeTodoListId = overTodoListId;
        const activeTitleCopy = active.data.current?.task.title;
        reorderTask({
          startDragId: activeId.toString(),
          endShiftId: overId.toString(),
          todoListId: activeTodoListId,
          endTodoListId: overTodoListId,
        });
      }
    }
    const isOverATodolist = over.data.current?.type === "Todolist";
    if (!isActiveATask) return;
    if (isActiveATask && isOverATodolist) {
      const activeTask = active.data.current?.task;
      const overTodolist = over.data.current?.todolist;
      if (!activeTask || !overTodolist) return; // добавляем проверку на существование тасок и тудулиста

      reorderTask({
        startDragId: activeId.toString(),
        endShiftId: overId.toString(),
        todoListId: overTodolist.id,
        endTodoListId: overTodolist.id,
      });
    }
  };
  // End

  // Region 2 Вариант с запросами, работающий только для перетаскивания тасок внутри туду
  // const onDragOverHandler = (event: DragOverEvent) => {
  //   const { active, over } = event;
  //   if (!over) return;
  //
  //   const activeId = active.id;
  //   // console.log("ACTIVE ID", active);
  //   const overId = over.id;
  //
  //   if (activeId === overId) return;
  //   // 1 сценарий, дропаю таску на другую таску в одном или другом туду
  //   const isActiveATask = active.data.current?.type === "Task";
  //   const isOverATask = over.data.current?.type === "Task";
  //   if (!isActiveATask) return;
  //   if (isActiveATask && isOverATask) {
  //     const activeTodoListId = active.data.current?.task.todoListId || "";
  //     const overTodoListId = over.data.current?.task.todoListId || "";
  //     console.log("activeTodoListId", activeTodoListId);
  //     console.log("overTodoListId", overTodoListId);
  //     // Когда activeTodolistId === overTodolistId
  //     if (activeTodoListId === overTodoListId) {
  //       reorderTasksTC({
  //         todoListId: active.data.current?.task.todoListId,
  //         startDragId: activeId.toString(),
  //         endShiftId: overId.toString(),
  //       });
  //       reorderTask({
  //         todoListId: active.data.current?.task.todoListId,
  //         startDragId: activeId.toString(),
  //         endShiftId: overId.toString(),
  //       });
  //     }
  //   }
  // };
  // End

  // Region Вариант 3 как вариант 2 только вместе с попыткой перетаскивания тасок в другой туду с тасками. Работает, но лишние запросы и лишние таски появляются
  // const onDragOverHandler = (event: DragOverEvent) => {
  //   const { active, over } = event;
  //   if (!over) return;
  //
  //   const activeId = active.id;
  //   // console.log("ACTIVE ID", active);
  //   const overId = over.id;
  //
  //   if (activeId === overId) return;
  //   // 1 сценарий, дропаю таску на другую таску в одном или другом туду
  //   const isActiveATask = active.data.current?.type === "Task";
  //   const isOverATask = over.data.current?.type === "Task";
  //   if (!isActiveATask) return;
  //   if (isActiveATask && isOverATask) {
  //     const activeTodoListId = active.data.current?.task.todoListId || "";
  //     const overTodoListId = over.data.current?.task.todoListId || "";
  //     console.log("activeTodoListId", activeTodoListId);
  //     console.log("overTodoListId", overTodoListId);
  //     // Когда activeTodolistId === overTodolistId
  //     if (activeTodoListId === overTodoListId) {
  //       reorderTasksTC({
  //         todoListId: active.data.current?.task.todoListId,
  //         startDragId: activeId.toString(),
  //         endShiftId: overId.toString(),
  //       });
  //       reorderTask({
  //         todoListId: active.data.current?.task.todoListId,
  //         startDragId: activeId.toString(),
  //         endShiftId: overId.toString(),
  //       });
  //     }
  //     // todo Антоним
  //     if (activeTodoListId !== overTodoListId) {
  //       const activeTitleCopy = active.data.current?.task.title;
  //       reorderTask({
  //         todoListId: overTodoListId,
  //         startDragId: activeId.toString(),
  //         endShiftId: overId.toString(),
  //       });
  //       //! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
  //       deleteTaskTC({
  //         todoListId: active.data.current?.task.todoListId,
  //         taskId: activeId.toString(),
  //       });
  //       //! 2 создаем в новом тудулисте новую
  //       if (overTodoListId) {
  //         addTaskTC({
  //           todoListId: overTodoListId,
  //           title: activeTitleCopy,
  //         }).then((res) => {
  //           console.log("ДОСТУЧАЛСЯ!", res);
  //           if (res.payload?.task.id) {
  //             //! 3 делаем на созданную таску реордер
  //             reorderTasksTC({
  //               todoListId: overTodoListId,
  //               startDragId: activeId.toString(),
  //               endShiftId: res.payload?.task.id.toString(),
  //             });
  //           }
  //         });
  //       }
  //     }
  //   }
  // };
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

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
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEndHandler = (event: DragEndEvent) => {
    // setActiveTodo(null);
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
      const activeIndex = tasks[active.data.current?.task.todoListId].findIndex(
        (t) => t.id === activeId
      );
      const overIndex = tasks[active.data.current?.task.todoListId].findIndex(
        (t) => t.id === overId
      );
      const activeTodoList = tasks[active.data.current?.task.todoListId];
      const activeTodolistId = activeTodoList.find(
        (t) => t.id === overId
      )?.todoListId;
      const overTodoList = tasks[active.data.current?.task.todoListId];
      const overTodolistId = overTodoList.find(
        (t) => t.id === overId
      )?.todoListId;
      if (activeTodolistId !== overTodolistId) {
        //! 1 удаляем с сервера active таску БЕЗ AddCase, его нужно отключить, сделать reducer и вообще таски через редьюсер и сервер добавлять
        //! 2 создаем в новом тудулисте новую
        //! 3 делаем на созданную таску реордер
      }

      console.log("ACTIVE", active, "OVER", over);
      console.log("ACTIVE INDEX", activeIndex, "OVERINDEX", overIndex);
      reorderTasksTC({
        todoListId: active.data.current?.task.todoListId,
        startDragId: activeId.toString(),
        endShiftId: overId.toString(),
      });
      reorderTask({
        todoListId: active.data.current?.task.todoListId,
        startDragId: activeId.toString(),
        endShiftId: overId.toString(),
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm callback={addTodo} />
      </Grid>
      <Grid container spacing={3}>
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
      </Grid>
    </>
  );
};

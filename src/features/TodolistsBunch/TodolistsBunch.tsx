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
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

type TodolistsBunchProps = {};
export const TodolistsBunch: React.FC<TodolistsBunchProps> = () => {
  // const dispatch = useAppDispatch();
  const {
    reorderTodolistTC,
    changeTodoFilter: changeTodoFilterAC,
    addTodoTC,
    updateTodoTitleTC,
    reorderTodolist,
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

  const todolistIds = useMemo(() => todolists.map((tl) => tl.id), [todolists]);

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
  };

  const onDragEndHandler = (event: DragEndEvent) => {
    if (event.over?.data.current?.type === "Todolist") {
      const endShiftId = event.over.data.current.todolist.id;
      if (activeTodo) {
        reorderTodolist({ endShiftId, startDragId: activeTodo.id });
        reorderTodolistTC({ endShiftId, startDragId: activeTodo.id });
      }
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
    <DndContext
      onDragStart={onDragStartHandler}
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
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

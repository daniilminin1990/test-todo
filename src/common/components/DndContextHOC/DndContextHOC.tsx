import { closestCenter, closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../../store/store";
import { todolistsSelectors, TodoUIType } from "../../../redux/todolistsSlice";
import { useState } from "react";
import { tasksSelectors, TasksWithEntityStatusType } from "../../../redux/tasksSlice";
import { TaskType } from "../../../api/tasks-api.types";
import { createPortal } from "react-dom";
import { Grid } from "@mui/material";
import { Todolist } from "../../../features/TodolistsBunch/ui/Todolist/Todolist";
import { Task } from "../../../features/TodolistsBunch/ui/Todolist/Task/Task";

type Props = {};
export const DndContextHOC = (props: { children: React.ReactNode }) => {
  const [activeTodo, setActiveTodo] = useState<TodoUIType | null>(null);
  const [activeTask, setActiveTask] = useState<TasksWithEntityStatusType | null>(null);
  const [memoActiveTodoId, setMemoActiveTodoId] = useState<string | null>(null);
  const [memoOverTodoId, setMemoOverTodoId] = useState<string | null>(null);
  const [memoActiveTaskCopy, setMemoActiveTaskCopy] = useState<TaskType | null>(null);
  const todolists = useAppSelector((state) => todolistsSelectors.todolists(state));
  const tasks = useAppSelector(tasksSelectors.tasksState);
  const {
    changeTodoFilter: changeTodoFilterAC,
    updateTodoTitleTC,
    reorderTodolist,
    reorderTodolistTC,
    addTodoTC,
    addTaskDnDTC,
    deleteTaskTC,
    reorderTask,
    reorderTaskTC,
    reorderTaskAcrossTodosTC,
    moveTaskAcrossTodolists,
    fetchTasksTC,
    addTaskTC,
    moveTaskInEmptyTodolists,
  } = useActions();

  const onDragStartHandler = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Todolist") {
      setActiveTodo(event.active.data.current.todolist);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      event.active.data.current.todoListId = event.active.data.current.task.todoListId;
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
    if (isActiveATask && isOverATask && activeTodoListId === overTodoListId) {
      activeTodoListId = active.data.current?.task?.todoListId;
      overTodoListId = over.data.current?.task?.todoListId;
      // ! Когда activeTodolistId === overTodolistId
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
      if (activeTaskId === overTaskId) return;
      setMemoActiveTodoId(activeTodoListId);
      setMemoOverTodoId(overTodoListId.toString());
      moveTaskAcrossTodolists({
        todoListId: activeTodoListId,
        endTodoListId: overTodoListId,
        startDragId: activeTaskId,
        endShiftId: overTodoListId,
      });
    }
    // ? В другой пустой тудулист
    if (isActiveATask && isOverATodolist && tasks[overTodoListId]?.length === 0) {
      activeTodoListId = active.data.current?.task?.todoListId;
      overTodoListId = over.data.current?.todolist.id;
      setMemoActiveTodoId(activeTodoListId);
      setMemoOverTodoId(overTodoListId);
      setMemoActiveTaskCopy(active.data.current?.task);
      moveTaskInEmptyTodolists({
        todoListId: activeTodoListId,
        endTodoListId: overTodoListId,
        startDragId: activeTaskId,
      });
    }
    // Region Активный тудулист
    if (isActiveATodolist && isOverATodolist) {
      activeTodoListId = active?.data.current?.todolist.id;
      overTodoListId = over?.data.current?.todolist.id;
      setMemoOverTodoId(overTodoListId);
      setMemoActiveTodoId(activeTodoListId);
      if (activeTodo) {
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
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isActiveATodolist = active.data.current?.type === "Todolist";
    const isOverATodolist = over.data.current?.type === "Todolist";
    // ? Над таской, в одном тудулисте
    // Сравниваем по memoActive потому что в противном случае работает некорректно
    // Из-за того, что dndKit думает изначально что actvieTodoId === overTodoId
    if (isActiveATask && isOverATask && memoActiveTodoId === memoOverTodoId) {
      reorderTaskTC({
        todoListId: activeTask?.todoListId || "",
        startDragId: activeTaskId,
        endShiftId: overTaskId,
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
            if (res.payload && "task" in res.payload) {
              console.log(res.payload?.task?.id);
              //! 3 делаем на созданную таску реордер и ререндер
              reorderTaskAcrossTodosTC({
                todoListId: overTodoListId,
                startDragId: res.payload.task.id,
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
    if (isActiveATask && isOverATodolist && tasks[overTodoListId]?.length === 0) {
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
    if (isActiveATodolist && isOverATodolist) {
      const startDragId = activeTodoListId;
      const endShiftId = overTodoListId;
      reorderTodolistTC({ endShiftId, startDragId });
    }

    setActiveTodo(null);
    setActiveTask(null);
    setMemoActiveTodoId(null);
    setMemoOverTodoId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  return (
    <DndContext onDragStart={onDragStartHandler} onDragOver={onDragOverHandler} onDragEnd={onDragEndHandler} sensors={sensors} collisionDetection={closestCorners}>
      {props.children}
      {createPortal(
        <DragOverlay>
          {activeTodo && (
            <Grid item>
              <Todolist key={activeTodo.id} todolist={activeTodo} />
            </Grid>
          )}
          {activeTask && <Task key={activeTask.id} task={activeTask} todoListId={activeTask.todoListId} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

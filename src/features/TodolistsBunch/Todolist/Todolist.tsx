import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AddItemForm } from "../../../common/components/AddItemForm/AddItemForm";
import EdiatbleSpan from "../../../common/components/EditableSpan/EdiatbleSpan";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { Grid, Paper } from "@mui/material";
import {
  // addTaskTC,
  // updateTaskTC,
  // deleteTaskTC,
  TasksWithEntityStatusType,
  tasksThunks,
  tasksSelectors,
  tasksSlice,
  TaskStateType,
} from "../../../redux/tasksSlice";
import { Task } from "./Task/Task";
import {
  FilterValuesType,
  todolistsActions,
  todolistsSelectors,
  todolistsThunks,
  TodoUIType,
} from "../../../redux/todolistsSlice";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Skeleton from "@mui/material/Skeleton";
import {
  RootReducerType,
  useAppDispatch,
  useAppSelector,
} from "../../../store/store";
import { ServerResponseStatusType } from "../../../redux/appSlice";
import { TaskStatuses } from "../../../common/enums/enums";
import { useActions } from "../../../common/hooks/useActions";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TodolistProps = {
  todoTitle: string;
  // tasks: TaskType[]
  tasksFilter: FilterValuesType;
  todoListId: string;
  todolist: TodoUIType;
  changeFilter: (
    todoListId: string,
    newTasksFilterValue: FilterValuesType
  ) => void;
  updTodoTitle: (todoListId: string, updTodoTitle: string) => void;
  entityStatus: ServerResponseStatusType;
  disabled: ServerResponseStatusType;
  showTasks: boolean;
};

export const Todolist = React.memo(
  ({ updTodoTitle, changeFilter, ...props }: TodolistProps) => {
    const dispatch = useAppDispatch();

    const {
      deleteTaskTC,
      addTaskTC,
      updateTaskTC,
      deleteTodoTC,
      reorderTasksTC,
    } = useActions();

    let allTodoTasks = useAppSelector((state) =>
      tasksSelectors.tasksById(state, props.todoListId)
    );

    let tasksIds = useMemo(
      () => allTodoTasks.map((task) => task.id),
      [allTodoTasks]
    );

    const {
      setNodeRef,
      attributes,
      listeners,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props.todoListId,
      data: {
        type: "Todolist",
        todolist: props.todolist,
      },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    // Region
    // const [taskIdToDrag, setTaskIdToDrag] = useState<string>("");
    // function dragStartHandler(
    //   e: React.DragEvent<HTMLDivElement>,
    //   startDragId: string
    // ) {
    //   e.stopPropagation();
    //   setTaskIdToDrag(startDragId);
    //   console.log("DRAGGING-ID", startDragId);
    // }
    //
    // function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {}
    //
    // function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    //   e.stopPropagation();
    //   e.preventDefault();
    // }
    //
    // function dropHandler(
    //   e: React.DragEvent<HTMLDivElement>,
    //   endShiftId: string
    // ) {
    //   e.stopPropagation();
    //   e.preventDefault();
    //   // dispatch(
    //   //   tasksThunks.reorderTasksTC({
    //   //     todoListId: props.todoListId,
    //   //     startDragId: taskIdToDrag,
    //   //     endShiftId: endShiftId,
    //   //   })
    //   // );
    //   reorderTasksTC({
    //     todoListId: props.todoListId,
    //     startDragId: taskIdToDrag,
    //     endShiftId: endShiftId,
    //   });
    // }
    // End

    const removeTask = useCallback(
      (taskId: string) => {
        // dispatch(
        //   tasksThunks.deleteTaskTC({ todoListId: props.todoListId, taskId })
        // );
        deleteTaskTC({ todoListId: props.todoListId, taskId });
      },
      [props.todoListId]
    );

    const addTask = useCallback(
      (newTaskTitle: string) => {
        // dispatch(
        //   tasksThunks.addTaskTC({
        //     todoListId: props.todoListId,
        //     title: newTaskTitle,
        //   })
        // );
        addTaskTC({
          todoListId: props.todoListId,
          title: newTaskTitle,
        });
      },
      [props.todoListId]
    );

    const changeTaskStatus = useCallback(
      (taskId: string, checked: TaskStatuses) => {
        console.log("CHANGE-TASK-STATUS");
        // dispatch(
        //   tasksThunks.updateTaskTC({
        //     todoListId: props.todoListId,
        //     taskId,
        //     model: { status: checked },
        //   })
        // );
        updateTaskTC({
          todoListId: props.todoListId,
          taskId,
          model: { status: checked },
        });
      },
      [props.todoListId]
    );

    const updTaskTitle = useCallback(
      (taskId: string, updTaskTitle: string) => {
        // dispatch(
        //   tasksThunks.updateTaskTC({
        //     todoListId: props.todoListId,
        //     taskId,
        //     model: { title: updTaskTitle },
        //   })
        // );
        updateTaskTC({
          todoListId: props.todoListId,
          taskId,
          model: { title: updTaskTitle },
        });
      },
      [props.todoListId]
    );

    if (props.tasksFilter === "completed") {
      allTodoTasks = allTodoTasks.filter(
        (t) => t.status === TaskStatuses.Completed
      );
    }
    if (props.tasksFilter === "active") {
      allTodoTasks = allTodoTasks.filter((t) => t.status === TaskStatuses.New);
    }

    const onAllClickHandler = useCallback(() => {
      changeFilter(props.todoListId, "all");
    }, [changeFilter, props.todoListId]);
    const onActiveClickHandler = useCallback(() => {
      changeFilter(props.todoListId, "active");
    }, [changeFilter, props.todoListId]);
    const onCompletedClickHandler = useCallback(() => {
      changeFilter(props.todoListId, "completed");
    }, [changeFilter, props.todoListId]);

    const removeTodo = useCallback(() => {
      // dispatch(todolistsThunks.deleteTodoTC(props.todoListId));
      deleteTodoTC(props.todoListId);
    }, []);

    const updTodoTitleHandler = useCallback(
      (updTlTitle: string) => {
        updTodoTitle(props.todoListId, updTlTitle);
      },
      [updTodoTitle, props.todoListId]
    );

    if (isDragging) {
      return (
        <div ref={setNodeRef} style={{ ...style, opacity: 0.5 }}>
          <Paper
            elevation={6}
            style={{
              padding: "30px",
              borderRadius: "10px",
              width: "100%",
              height: "100%",
            }}
          >
            <h3>
              <EdiatbleSpan
                oldTitle={props.todoTitle}
                callback={updTodoTitleHandler}
                disabled={props.disabled === "loading"}
              />
              <IconButton
                aria-label="delete"
                onClick={removeTodo}
                disabled={props.entityStatus === "loading"}
              >
                <DeleteIcon />
              </IconButton>
            </h3>
            <AddItemForm
              callback={addTask}
              disabled={props.entityStatus === "loading"}
            />
            <Skeleton>
              <div>ЛАЛАЛА</div>
            </Skeleton>
          </Paper>
        </div>
      );
    }

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Paper elevation={6} style={{ padding: "30px", borderRadius: "10px" }}>
          <h3
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "0 8px",
            }}
          >
            <EdiatbleSpan
              oldTitle={props.todoTitle}
              callback={updTodoTitleHandler}
              disabled={props.disabled === "loading"}
            />
            <IconButton
              aria-label="delete"
              onClick={removeTodo}
              disabled={props.entityStatus === "loading"}
            >
              <DeleteIcon />
            </IconButton>
          </h3>
          <AddItemForm
            callback={addTask}
            disabled={props.entityStatus === "loading"}
          />
          {allTodoTasks.length !== 0 ? (
            <SortableContext items={tasksIds}>
              <ul>
                {allTodoTasks.map((t) => {
                  return (
                    // <div
                    //   key={t.id}
                    //   style={{
                    //     borderRadius: "5px",
                    //     marginBottom: "10px",
                    //     marginTop: "10px",
                    //     padding: "5px",
                    //     border: "0.5px solid gray",
                    //   }}
                    //   // draggable={true}
                    //   // onDragStart={(e) => dragStartHandler(e, t.id)}
                    //   // onDragLeave={(e) => dragEndHandler(e)}
                    //   // onDragEnd={(e) => dragEndHandler(e)}
                    //   // onDragOver={(e) => dragOverHandler(e)}
                    //   // onDrop={(e) => dropHandler(e, t.id)}
                    // >
                    props.entityStatus === "loading" ? (
                      <Skeleton key={t.id}>
                        <Task
                          key={t.id}
                          taskId={t.id}
                          tIsDone={t.status}
                          oldTitle={t.title}
                          onChange={changeTaskStatus}
                          onClick={removeTask}
                          updTaskTitle={updTaskTitle}
                          todoListId={props.todoListId}
                        />
                      </Skeleton>
                    ) : (
                      <Task
                        key={t.id}
                        taskId={t.id}
                        tIsDone={t.status}
                        oldTitle={t.title}
                        entityStatus={t.entityStatus}
                        onChange={changeTaskStatus}
                        onClick={removeTask}
                        updTaskTitle={updTaskTitle}
                        todoListId={props.todoListId}
                      />
                    )
                    // </div>
                  );
                })}
              </ul>
            </SortableContext>
          ) : props.showTasks ? (
            <p>Nothing to show</p>
          ) : (
            <Typography variant="h3">
              <Skeleton />
            </Typography>
          )}
          <Button
            variant={props.tasksFilter === "all" ? "contained" : "outlined"}
            color="primary"
            onClick={onAllClickHandler}
          >
            All
          </Button>
          <Button
            variant={props.tasksFilter === "active" ? "contained" : "outlined"}
            color="error"
            onClick={onActiveClickHandler}
          >
            Active
          </Button>
          <Button
            variant={
              props.tasksFilter === "completed" ? "contained" : "outlined"
            }
            color="success"
            onClick={onCompletedClickHandler}
          >
            Completed
          </Button>
        </Paper>
      </div>
    );
  }
);

import React, { useCallback, useEffect, useState } from "react";
import { AddItemForm } from "../../../common/components/AddItemForm/AddItemForm";
import EdiatbleSpan from "../../../common/components/EditableSpan/EdiatbleSpan";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { useSelector } from "react-redux";
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

type TodolistProps = {
  todoTitle: string;
  // tasks: TaskType[]
  tasksFilter: FilterValuesType;
  todoListId: string;
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

    // Region
    const [taskIdToDrag, setTaskIdToDrag] = useState<string>("");
    function dragStartHandler(
      e: React.DragEvent<HTMLDivElement>,
      startDragId: string
    ) {
      e.stopPropagation();
      setTaskIdToDrag(startDragId);
      console.log("DRAGGING-ID", startDragId);
    }

    function dragEndHandler(e: React.DragEvent<HTMLDivElement>) {}

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
      e.stopPropagation();
      e.preventDefault();
    }

    function dropHandler(
      e: React.DragEvent<HTMLDivElement>,
      endShiftId: string
    ) {
      e.stopPropagation();
      e.preventDefault();
      // dispatch(
      //   tasksThunks.reorderTasksTC({
      //     todoListId: props.todoListId,
      //     startDragId: taskIdToDrag,
      //     endShiftId: endShiftId,
      //   })
      // );
      reorderTasksTC({
        todoListId: props.todoListId,
        startDragId: taskIdToDrag,
        endShiftId: endShiftId,
      });
    }
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

    return (
      <div>
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
        {allTodoTasks.length !== 0 ? (
          <ul>
            {allTodoTasks.map((t) => {
              return (
                <div
                  key={t.id}
                  style={{
                    borderRadius: "5px",
                    marginBottom: "10px",
                    marginTop: "10px",
                    padding: "5px",
                    border: "0.5px solid gray",
                  }}
                  draggable={true}
                  onDragStart={(e) => dragStartHandler(e, t.id)}
                  onDragLeave={(e) => dragEndHandler(e)}
                  onDragEnd={(e) => dragEndHandler(e)}
                  onDragOver={(e) => dragOverHandler(e)}
                  onDrop={(e) => dropHandler(e, t.id)}
                >
                  {props.entityStatus === "loading" ? (
                    <Skeleton key={t.id}>
                      <Task
                        key={t.id}
                        taskId={t.id}
                        tIsDone={t.status}
                        oldTitle={t.title}
                        onChange={changeTaskStatus}
                        onClick={removeTask}
                        updTaskTitle={updTaskTitle}
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
                    />
                  )}
                </div>
              );
            })}
          </ul>
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
          variant={props.tasksFilter === "completed" ? "contained" : "outlined"}
          color="success"
          onClick={onCompletedClickHandler}
        >
          Completed
        </Button>
      </div>
    );
  }
);

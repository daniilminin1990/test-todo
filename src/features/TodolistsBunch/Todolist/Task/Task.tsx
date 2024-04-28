import React, { ChangeEvent, useCallback } from "react";
import EdiatbleSpan from "../../../../common/components/EditableSpan/EdiatbleSpan";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  appSelectors,
  ServerResponseStatusType,
} from "../../../../redux/appSlice";
import { TaskStatuses } from "../../../../common/enums/enums";
import { styled } from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppSelector } from "../../../../store/store";
import {
  tasksSelectors,
  TasksWithEntityStatusType,
} from "../../../../redux/tasksSlice";
import { TaskType } from "../../../../api/tasks-api";
import { useSelector } from "react-redux";
import { useActions } from "../../../../common/hooks/useActions";

export type TaskProps = {
  todoListId: string;
  task: TasksWithEntityStatusType;
};

export const Task = React.memo(({ task, todoListId }: TaskProps) => {
  const tasks = useAppSelector((state) =>
    tasksSelectors.tasksById(state, todoListId)
  );

  const { updateTaskTC, deleteTaskTC } = useActions();
  const isBlockTasksToDrag = useAppSelector(tasksSelectors.tasksState);
  const isBlockDragMode = useSelector(appSelectors.isBlockDragMode);
  // const isTaskDragging =
  //   tasks[tasks.findIndex((t) => t.id === props.taskId)].isTaskDragging;
  // const isTaskDragOver =
  //   tasks[tasks.findIndex((t) => t.id === props.taskId)].isTaskDragOver;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task: tasks[tasks.findIndex((t) => t.id === task.id)],
    },
    disabled: isBlockDragMode && isBlockTasksToDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    // transition,
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let checkToGo = e.currentTarget.checked
      ? TaskStatuses.Completed
      : TaskStatuses.New;
    updateTaskTC({
      todoListId,
      taskId: task.id,
      model: { status: checkToGo },
    });
  };
  const onClickHandler = () => {
    deleteTaskTC({ todoListId, taskId: task.id });
  };

  const updTaskTitleHandler = (updTaskTitle: string) => {
    updateTaskTC({
      todoListId,
      taskId: task.id,
      model: { title: updTaskTitle },
    });
  };

  const taskCompleted = task.status === TaskStatuses.Completed;

  if (isDragging) {
    return (
      <Li
        className={taskCompleted ? "is-done" : ""}
        ref={setNodeRef}
        style={{
          ...style,
          opacity: 0.3,
          border: "mistyrose 2px solid",
          backgroundColor: "lightgreen",
          minHeight: "40px",
        }}
      />
    );
  }

  return (
    <Li
      className={taskCompleted ? "is-done" : ""}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <input
        type="checkbox"
        checked={taskCompleted}
        onChange={onChangeHandler}
        disabled={task.entityStatus === "loading"}
      />
      <EdiatbleSpan
        oldTitle={task.title}
        callback={updTaskTitleHandler}
        disabled={task.entityStatus === "loading"}
      />
      <IconButton
        aria-label="delete"
        onClick={onClickHandler}
        disabled={task.entityStatus === "loading"}
      >
        <DeleteIcon />
      </IconButton>
    </Li>
  );
});

const Li = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 0.5px solid gray;
`;

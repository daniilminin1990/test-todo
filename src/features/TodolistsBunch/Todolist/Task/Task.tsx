import React, { ChangeEvent } from "react";
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

export type TaskProps = {
  todoListId: string;
  taskId: string;
  tIsDone: TaskStatuses;
  oldTitle: string;
  entityStatus?: ServerResponseStatusType;
  onChange?: (taskId: string, checked: TaskStatuses) => void;
  onClick?: (taskId: string) => void;
  updTaskTitle?: (taskId: string, updTaskTitle: string) => void;
};

export const Task = React.memo((props: TaskProps) => {
  const tasks = useAppSelector((state) =>
    tasksSelectors.tasksById(state, props.todoListId)
  );
  const isBlockDragMode = useSelector(appSelectors.isBlockDragMode);
  const isTaskDragging =
    tasks[tasks.findIndex((t) => t.id === props.taskId)].isDragging;
  const isTaskDragOver =
    tasks[tasks.findIndex((t) => t.id === props.taskId)].isDragOver;

  const {
    setNodeRef,
    attributes,
    listeners,
    // transform,
    // transition,
    isDragging,
  } = useSortable({
    id: props.taskId,
    data: {
      type: "Task",
      task: tasks[tasks.findIndex((t) => t.id === props.taskId)],
    },
    disabled: isBlockDragMode,
  });

  const style = {
    // transform: CSS.Transform.toString(transform),
    // transition,
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let checkToGo = e.currentTarget.checked
      ? TaskStatuses.Completed
      : TaskStatuses.New;
    if (props.onChange) {
      props.onChange(props.taskId, checkToGo);
    }
  };
  const onClickHandler = () => {
    if (props.onClick) {
      props.onClick(props.taskId);
    }
  };

  const updTaskTitleHandler = (updTaskTitle: string) => {
    if (props.updTaskTitle) {
      props.updTaskTitle(props.taskId, updTaskTitle);
    }
  };

  const taskCompleted = props.tIsDone === TaskStatuses.Completed;

  if (isTaskDragging && isDragging) {
    return (
      <Li
        isTaskDragging={isTaskDragging}
        isTaskDragOver={isTaskDragOver}
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
      isTaskDragging={isTaskDragging}
      isTaskDragOver={isTaskDragOver}
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
        disabled={props.entityStatus === "loading"}
      />
      <EdiatbleSpan
        oldTitle={props.oldTitle}
        callback={updTaskTitleHandler}
        disabled={props.entityStatus === "loading"}
      />
      <IconButton
        aria-label="delete"
        onClick={onClickHandler}
        disabled={props.entityStatus === "loading"}
      >
        <DeleteIcon />
      </IconButton>
    </Li>
  );
});

interface LiProps {
  isTaskDragging: boolean;
  isTaskDragOver: boolean;
}

const Li = styled.li<LiProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 0.5px solid gray;
  opacity: ${({ isTaskDragging }) => (isTaskDragging ? 0.5 : 1)};
  background-color: ${({ isTaskDragOver }) =>
    isTaskDragOver ? "ligthgray" : ""};
`;

import React, { ChangeEvent } from "react";
import EdiatbleSpan from "../../../../common/components/EditableSpan/EdiatbleSpan";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { ServerResponseStatusType } from "../../../../redux/appSlice";
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

export type TaskProps = {
  taskId: string;
  tIsDone: TaskStatuses;
  oldTitle: string;
  entityStatus?: ServerResponseStatusType;
  onChange: (taskId: string, checked: TaskStatuses) => void;
  onClick: (taskId: string) => void;
  updTaskTitle: (taskId: string, updTaskTitle: string) => void;
  tasks: TasksWithEntityStatusType[];
};

export const Task = React.memo((props: TaskProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.taskId,
    data: {
      type: "Task",
      task: props.tasks[props.tasks.findIndex((t) => t.id === props.taskId)],
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let checkToGo = e.currentTarget.checked
      ? TaskStatuses.Completed
      : TaskStatuses.New;
    props.onChange(props.taskId, checkToGo);
  };
  const onClickHandler = () => {
    props.onClick(props.taskId);
  };

  const updTaskTitleHandler = (updTaskTitle: string) => {
    props.updTaskTitle(props.taskId, updTaskTitle);
  };

  const taskCompleted = props.tIsDone === TaskStatuses.Completed;
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

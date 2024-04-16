import React, { ChangeEvent } from "react";
import EdiatbleSpan from "../../../../common/components/EditableSpan/EdiatbleSpan";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { ServerResponseStatusType } from "../../../../redux/appSlice";
import { TaskStatuses } from "../../../../common/enums/enums";
import { styled } from "styled-components";

export type TaskProps = {
  taskId: string;
  tIsDone: TaskStatuses;
  oldTitle: string;
  entityStatus?: ServerResponseStatusType;
  onChange?: (taskId: string, checked: TaskStatuses) => void;
  onClick?: (taskId: string) => void;
  updTaskTitle?: (taskId: string, updTaskTitle: string) => void;
};

export const Task = React.memo((props: TaskProps) => {
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

  return (
    <Li className={taskCompleted ? "is-done" : ""}>
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

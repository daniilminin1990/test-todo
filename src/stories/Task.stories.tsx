import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Task } from "../features/TodolistsBunch/Todolist/Task/Task";
import { useState } from "react";
import { TaskStatuses } from "../common/enums/enums";
import { ServerResponseStatusType } from "../redux/appSlice";

const meta: Meta<typeof Task> = {
  title: "TODOLIST/Task",
  component: Task,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;

// Чекбокс нет
export type Story = StoryObj<typeof Task>;

export const TaskExampleNoCheck: Story = {};

// Чекбокс есть
export const TaskCheck: Story = {
  args: {
    task: {
      startDate: "",
      id: "asdasd",
      title: "Чет написано",
      status: TaskStatuses.Completed,
      todoListId: "todoListId",
      entityStatus: "idle" as ServerResponseStatusType,
      addedDate: "",
      deadline: "",
      description: "",
      order: 0,
      priority: 0,
      isTaskDragging: false,
      isTaskDragOver: false,
    },
  },
};

// Чек таски
export const TaskToDelete = () => {
  const [tIsDone, setTIsDone] = useState<TaskStatuses>(TaskStatuses.New);

  const onChange = () => {
    setTIsDone(tIsDone ? TaskStatuses.Completed : TaskStatuses.New);
  };

  return (
    <Task
      task={{
        startDate: "",
        id: "asdasd",
        title: "Чет написано",
        status: tIsDone,
        todoListId: "todoListId",
        entityStatus: "idle" as ServerResponseStatusType,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: 0,
        isTaskDragging: false,
        isTaskDragOver: false,
      }}
      todoListId={"todoListId"}
    />
  );
};

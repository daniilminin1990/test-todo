import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Task } from "../features/TodolistsBunch/Todolist/Task/Task";
import { useState } from "react";
import { TaskStatuses } from "../common/enums/enums";

const meta: Meta<typeof Task> = {
  title: "TODOLIST/Task",
  component: Task,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    tIsDone: TaskStatuses.New, // Состояние по умолчанию
    oldTitle: "Title",
    taskId: "taskId", // Это слово я увижу в toolbar в control
    onChange: action("Change task status"), // Меняю статус - показывает этот текст в actions
    onClick: action("Delete task"),
    updTaskTitle: action("Change task title"),
  },
  argTypes: {
    tIsDone: {
      type: "boolean", // В toolbar меню даст контроль из true в false
      description: "if true - task is done and it should be greyish",
    },
    oldTitle: {
      type: "string",
      description: "Shows the title",
    },
    onChange: { description: "Change task status" }, // Меняю статус - показывает этот текст в actions,
    onClick: { description: "Adds title on click" },
    updTaskTitle: { description: "Update taskTitle" },
  },
};
export default meta;

// Чекбокс нет
export type Story = StoryObj<typeof Task>;

export const TaskExampleNoCheck: Story = {};

// Чекбокс есть
export const TaskCheck: Story = {
  args: {
    oldTitle: "Алиллуйя", // Это слово я увижу в toolbar в control
    tIsDone: TaskStatuses.Completed,
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
      oldTitle={"Чет написано"}
      tIsDone={tIsDone}
      taskId={"asdasd"}
      onChange={onChange}
      onClick={action("onclickAction")}
      updTaskTitle={action("updateTasktion")}
      todoListId={"todoListId"}
    />
  );
};

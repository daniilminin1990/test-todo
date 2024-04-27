import { Meta, StoryObj } from "@storybook/react";
import { Task } from "../features/TodolistsBunch/ui/Todolist/Task/Task";
import { useState } from "react";
import { TaskPriorities, TaskStatuses } from "../common/enums";
import { ServerResponseStatusType } from "../redux/appSlice";

const meta: Meta<typeof Task> = {
  title: "TODOLIST/Task",
  component: Task,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    task: {
      title: "Чет написано",
      status: TaskStatuses.New,
      id: "asdasd",
      entityStatus: "success" as ServerResponseStatusType,
      todoListId: "todoListId",
      order: 0,
      addedDate: "",
      description: "",
      startDate: "",
      priority: TaskPriorities.High,
      deadline: "",
    },
    // tIsDone: TaskStatuses.New, // Состояние по умолчанию
    // oldTitle: "Title",
    // taskId: "taskId", // Это слово я увижу в toolbar в control
  },
  argTypes: {
    task: {
      title: "Чет написано",
      status: TaskStatuses.New,
      id: "asdasd",
      entityStatus: "success" as ServerResponseStatusType,
      todoListId: "todoListId",
      order: 0,
      addedDate: "",
      description: "",
      startDate: "",
      priority: TaskPriorities.High,
      deadline: "",
    },
    // tIsDone: {
    //   type: "boolean", // В toolbar меню даст контроль из true в false
    //   description: "if true - task is done and it should be greyish",
    // },
    // oldTitle: {
    //   type: "string",
    //   description: "Shows the title",
    // },
  },
};
export default meta;

const task = {
  title: "Чет написано",
  status: TaskStatuses.New,
  id: "asdasd",
  entityStatus: "success" as ServerResponseStatusType,
  todoListId: "todoListId",
  order: 0,
  addedDate: "",
  description: "",
  startDate: "",
  priority: TaskPriorities.High,
  deadline: "",
};

// Чекбокс нет
export type Story = StoryObj<typeof Task>;

export const TaskExampleNoCheck: Story = {};

// Чекбокс есть
export const TaskCheck: Story = {
  args: {
    task,
  },
};

// Чек таски
export const TaskToDelete = () => {
  const [tIsDone, setTIsDone] = useState<TaskStatuses>(TaskStatuses.New);

  const onChange = () => {
    setTIsDone(tIsDone ? TaskStatuses.Completed : TaskStatuses.New);
  };

  return <Task todoListId={"todoListId"} task={{ ...task, status: tIsDone }} />;
};

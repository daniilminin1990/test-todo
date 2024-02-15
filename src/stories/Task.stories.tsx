import { Meta, StoryObj } from "@storybook/react";
import { action } from '@storybook/addon-actions'
import { Task } from "../Task";

const meta: Meta<typeof Task> = {
  title: 'Task',
  component: Task,
  tags: ['autodocs'],
  argTypes: {
    tIsDone: {
      type: 'boolean', // В toolbar меню даст контроль из true в false 
      description: 'if true - task is done and it should be greyish',
    },
    oldTitle: {
      type: 'string',
      description: 'Shows the title'
    },
    onChange: { description: 'Change task status' }, // Меняю статус - показывает этот текст в actions,
    onClick: { description: 'Adds title on click' },
    updTaskTitle: { description: 'Update taskTitle' }
  },
}
export default meta

export type Story = StoryObj<typeof Task>

export const TaskExample: Story = {
  args: {
    tIsDone: false, // Состояние по умолчанию
    oldTitle: 'Title', // Это слово я увижу в toolbar в control 
    taskId: 'taskId', // Это слово я увижу в toolbar в control
    onChange: action('Change task status'), // Меняю статус - показывает этот текст в actions
    onClick: action('Delete task'),
    updTaskTitle: action('Change task title')
  },
}
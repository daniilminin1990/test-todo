import {Meta, StoryObj} from "@storybook/react";
import {action} from '@storybook/addon-actions'
import {Task} from "../Task";

const meta: Meta<typeof Task> = {
  title: 'Task',
  component: Task,
  tags: ['autodocs'],
  args: {
    tIsDone: false,
    oldTitle: 'Title',
    taskId: 'taskId',
    onChange: action('title from editable span changed'),
    onClick: action('you clicked'),
    updTaskTitle: action('taskTitle changed')
  },
}
export default meta

export type Story = StoryObj<typeof Task>

export const TaskExample: Story = {
}
import { Meta, StoryObj } from "@storybook/react";
import { AddItemForm } from "../AddItemForm";
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof AddItemForm> = {
  title: 'AddItemForm',
  component: AddItemForm,
  tags: ['autodocs'],
  argTypes: {
    callback: {
      description: 'add newTitle for tl or task'
    }
  }
}
export default meta

export type Story = StoryObj<typeof AddItemForm>

export const AddItemFormExample: Story = {
  args: {
    callback: action('Add this todo/task title')
  },
}
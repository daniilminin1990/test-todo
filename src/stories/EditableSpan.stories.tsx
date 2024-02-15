import { Meta, StoryObj } from "@storybook/react";
import { action } from '@storybook/addon-actions'
import EdiatbleSpan from "../EdiatbleSpan";

const meta: Meta<typeof EdiatbleSpan> = {
  title: 'EditableSpan',
  component: EdiatbleSpan,
  tags: ['autodocs'],
  argTypes: {
    oldTitle: {
      description: 'previousTtle'
    },
    callback: {
      description: 'add newTitle for tl or task'
    }
  }
}
export default meta

export type Story = StoryObj<typeof EdiatbleSpan>

export const EditableSpanExample: Story = {
  args: {
    oldTitle: 'oldTitle',
    callback: action('title from editable span changed')
  },
}
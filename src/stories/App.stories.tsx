import { Meta, StoryObj } from "@storybook/react";
import { ReduxStoreProviderDecorator } from "./Decorator";
import App from "../app/App";

const meta: Meta<typeof App> = {
  title: 'App',
  component: App,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocks'],
  decorators: [ReduxStoreProviderDecorator]
}
export default meta

export type Story = StoryObj<typeof App>

export const EditableSpanExample: Story = {}
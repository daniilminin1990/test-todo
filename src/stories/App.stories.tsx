import {Meta, StoryObj} from "@storybook/react";
import {ReduxStoreProviderDecorator} from "./Decorator";
import App from "../App";

const meta: Meta<typeof App> = {
  title: 'App',
  component: App,
  tags: ['autodocks'],
  decorators: [ReduxStoreProviderDecorator]
}
export default meta

export type Story = StoryObj<typeof App>

export const EditableSpanExample: Story = {}
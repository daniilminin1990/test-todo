import { Meta, StoryObj } from "@storybook/react";
import { action } from '@storybook/addon-actions'
import EdiatbleSpan, { EdiatbleSpanProps } from "../components/EdiatbleSpan";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";

const meta: Meta<typeof EdiatbleSpan> = {
  title: 'TODOLIST/EditableSpan',
  component: EdiatbleSpan,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    oldTitle: {
      description: 'previousTtle'
    },
    callback: {
      description: 'add newTitle for tl or task'
    }
  },
}
export default meta

export type Story = StoryObj<typeof EdiatbleSpan>

export const EditableSpanExample: Story = {
  args: {
    oldTitle: 'oldTitle',
    callback: action('title from editable span changed')
  },
}

export const EdiatbleSpanStory = () => {
  const [edit, setEdit] = useState<boolean>(false)
  const [updTitle, setUpdTitle] = useState<string>('Чет старое')
  const [error, setError] = useState<string | null>(null)

  const swapHandler = () => {
    setEdit(!edit)
    edit === false && setUpdTitle(updTitle)
    if (updTitle.trim() === '') {
      setEdit(true)
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let typing = e.currentTarget.value
    setUpdTitle(typing)
    if (typing.trim() !== '') {
      setError('')
    } else {
      setError('Title is required')
    }
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      swapHandler()
    }
  }

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {edit
        ? <input onBlur={swapHandler} value={updTitle} onChange={onChangeHandler} autoFocus onKeyDown={onKeyDownHandler} />
        : <span onDoubleClick={swapHandler}>{updTitle}</span>
      }
    </>
  );
};
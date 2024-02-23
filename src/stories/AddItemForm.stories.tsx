import { Meta, StoryObj } from "@storybook/react";
import { AddItemForm, AddItemFormProps, StyledTextField } from "../AddItemForm";
import { action } from '@storybook/addon-actions'
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { styles } from "../styles";

const meta: Meta<typeof AddItemForm> = {
  title: 'TODOLIST/AddItemForm',
  component: AddItemForm,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    callback: {
      description: 'add newTitle for tl or task'
    }
  }
}
export default meta

// Стандартный вид
export type Story = StoryObj<typeof AddItemForm>

export const AddItemFormExample: Story = {
  args: {
    callback: action('Add this todo/task title')
  },
}

// Вид с ошибкой
export const AddItemFormError = (props: AddItemFormProps) => {

  const [newTitle, setNewTitle] = useState<string>('')
  const [error, setError] = useState<string | null>('Порошок не входи')

  // setError('Порошок не входи')

  const onClickAddItemHandler = () => {
    if (newTitle.trim() !== '') {
      // setNewTitle(newTitle.trim())
      setNewTitle('')
      setError('')
    } else {
      setNewTitle('')
      setError('sdfsd')
    }
  }
  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const titleTyping = e.currentTarget.value
    setNewTitle(titleTyping)
    console.log(newTitle)
    titleTyping.length !== 0 && setError('')
  }
  const onEnterAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && onClickAddItemHandler()
  }

  return (
    <div>
      <StyledTextField
        id="outlined-basic"
        error={!!error}
        // label="Type title"
        label={error ? error : 'Type smth'}
        variant="outlined"
        value={newTitle}
        onChange={onNewTitleChangeHandler}
        onKeyDown={onEnterAddItem}
        className={error ? 'error' : ''}
      />
      <Button onClick={onClickAddItemHandler} variant="contained" style={styles}>+</Button>
      {/*{error && <div className={'error-message'}>Title is required</div>}*/}
    </div>
  );
};

// // Вид с ошибкой № 2
// const AddItemFormError1 = (props: AddItemFormProps) => {

//   const [newTitle, setNewTitle] = useState<string>('')
//   const [error, setError] = useState<string | null>('Порошок не входи')

//   const onClickAddItemHandler = () => {
//     if (newTitle.trim() !== '') {

//       setNewTitle('')
//       setError('')
//     } else {
//       setNewTitle('')
//       setError('sdfsd')
//     }
//   }
//   const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
//     const titleTyping = e.currentTarget.value
//     setNewTitle(titleTyping)
//     console.log(newTitle)
//     titleTyping.length !== 0 && setError('')
//   }
//   const onEnterAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
//     e.key === 'Enter' && onClickAddItemHandler()
//   }

//   return (
//     <div>
//       <StyledTextField
//         id="outlined-basic"
//         error={!!error}
//         // label="Type title"
//         label={error ? error : 'Type smth'}
//         variant="outlined"
//         value={newTitle}
//         onChange={onNewTitleChangeHandler}
//         onKeyDown={onEnterAddItem}
//         className={error ? 'error' : ''}
//       />
//       <Button onClick={onClickAddItemHandler} variant="contained" style={styles}>+</Button>
//       {/*{error && <div className={'error-message'}>Title is required</div>}*/}
//     </div>
//   );
// };

// export const AddItemFormError1Story: Story = {
//   render: () => <AddItemFormError1 callback={action('clicked')} />
// }
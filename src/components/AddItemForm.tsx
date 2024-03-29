import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {getStyles} from "../styles";
import { styled } from '@mui/system';

export type AddItemFormProps = {
  callback: (newTitle: string) => void
  disabled?: boolean
}

// Кастомная стилизация TextField от MUI
export const StyledTextField = styled(TextField, {
  name: 'StyledTextField'
})({
  '& .MuiOutlinedInput-input': {
    padding: '8px 14px'
  },
  '& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': {
    transform: 'translate(14px, 10px) scale(1)'
  },
})

export const AddItemForm = React.memo((props: AddItemFormProps) => {
  console.log('AddItemForm')
  const [newTitle, setNewTitle] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const onClickAddItemHandler = () => {
    if (newTitle.trim() !== '') {
      props.callback(newTitle.trim())
      setNewTitle('')
      setError('')
    } else {
      setNewTitle('')
      setError('Title is required')
    }
  }
  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const titleTyping = e.currentTarget.value
    setNewTitle(titleTyping)
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
        disabled = {props.disabled}
      />
      <Button onClick={onClickAddItemHandler} variant="contained" style={getStyles(props.disabled)} disabled = {props.disabled}>+</Button>
      {/*{error && <div className={'error-message'}>Title is required</div>}*/}
    </div>
  );
});
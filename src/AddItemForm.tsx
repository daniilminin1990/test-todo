import React, { ChangeEvent, KeyboardEvent, useState } from "react";

type AddItemFormProps = {
  callback: (newTitle: string) => void
}

export const AddItemForm = (props: AddItemFormProps) => {
  const [newTitle, setNewTitle] = useState<string>('')

  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const titleTyping = e.currentTarget.value
    setNewTitle(titleTyping)
    titleTyping.length !== 0 && setError('')
  }
  const onEnterAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && onNewTitleChangeHandler
  }

  return (
    <div>
      <input value={newTitle} onChange={onNewTitleChangeHandler} />
      <button onClick={() => {
        props.callback(newTitle)
      }}>+
      </button>
    </div>
  );
};
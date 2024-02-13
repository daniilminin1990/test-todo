import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type AddItemFormProps = {
  callback: (newTitle: string)=>void
}

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
      <input
        value={newTitle}
        onChange={onNewTitleChangeHandler}
        onKeyDown={onEnterAddItem}
        className={error ? 'error' : ''}
      />
      <button onClick={onClickAddItemHandler}>+</button>
      {error && <div className={'error-message'}>Title is required</div>}
    </div>
  );
});
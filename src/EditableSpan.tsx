import React, {ChangeEvent, useState} from 'react';

type EditableSpanProps = {
  oldTitle: string
  callback: (title: string) => void
}
const EditableSpan = (props: EditableSpanProps) => {
  const [editMode, setEditMode] = useState(false)
  const [updatedTitle, setUpdatedTitle] = useState(props.oldTitle)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(e.currentTarget.value)
  }

  const swapType = () => {
    setEditMode(!editMode)
    !editMode && props.callback(updatedTitle)
  }
  return (
    editMode
      ? <input value={updatedTitle} onChange={onChangeHandler} onBlur={swapType} autoFocus/>
      : <span onDoubleClick={swapType}>{updatedTitle}</span>
  );
};

export default EditableSpan;

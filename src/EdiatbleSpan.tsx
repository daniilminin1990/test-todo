import React, {ChangeEvent, useState} from 'react';

type EdiatbleSpanProps = {
  oldTitle: string
  callback: (updTitle: string) => void
}
const EdiatbleSpan = (props: EdiatbleSpanProps) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [updTitle, setUpdTitle] = useState<string>(props.oldTitle)

  const swapHandler = () => {
    setEdit(!edit)
    edit === false && props.callback(updTitle)
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdTitle(e.currentTarget.value)
  }

  return (
    edit
      ? <input onBlur={swapHandler} value={updTitle} onChange={onChangeHandler} autoFocus/>
      : <span onDoubleClick={swapHandler}>{updTitle}</span>
  );
};

export default EdiatbleSpan;

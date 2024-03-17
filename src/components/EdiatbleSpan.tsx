import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

export type EdiatbleSpanProps = {
  oldTitle: string
  callback: (updTitle: string) => void
  disabled: boolean
}
const EdiatbleSpan = React.memo((props: EdiatbleSpanProps) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [updTitle, setUpdTitle] = useState<string>(props.oldTitle)
  const [error, setError] = useState<string | null>(null)

  const swapHandler = () => {
    if(!props.disabled){
      setEdit(!edit)
      // edit === false && props.callback(updTitle)
      edit === true && props.callback(updTitle)
      if (updTitle.trim() === '') {
        setEdit(true)
      }
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
        ?
        <input onBlur={swapHandler} value={updTitle} onChange={onChangeHandler} autoFocus onKeyDown={onKeyDownHandler}/>
        : <span onDoubleClick={swapHandler}>{updTitle}</span>}
    </>
  );
});

export default EdiatbleSpan;

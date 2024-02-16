import { ChangeEvent, KeyboardEvent, useState } from "react"

type EditableSpanProps = {
  oldTitle: string,
  callbackUpdTitle: (updTitle: string) => void
}

export const EditableSpan = (props: EditableSpanProps) => {
  const [title, setTitle] = useState<string>(props.oldTitle)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    let typing = e.currentTarget.value
    setTitle(typing)
    if (typing.trim() !== '') {
      setError('')
    } else {
      setError('Title is required')
    }
  }

  const changeEditHandler = () => {
    setEditMode(!editMode)
    editMode && props.callbackUpdTitle(title)
    if (title.trim() === '') {
      setEditMode(true)
    }
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      changeEditHandler()
    }
  }

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {editMode === false
        ? <span onDoubleClick={changeEditHandler}> {props.oldTitle} </span>
        : <input value={title} onChange={onChangeTitle} onBlur={changeEditHandler} autoFocus onKeyDown={onKeyDownHandler} />}
    </>
  )
}
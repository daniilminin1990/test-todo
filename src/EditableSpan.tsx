import { ChangeEvent, KeyboardEvent, memo, useCallback, useState } from "react"

type EditableSpanProps = {
  oldTitle: string,
  callbackUpdTitle: (updTitle: string) => void
}

export const EditableSpan = memo(({ callbackUpdTitle, ...props }: EditableSpanProps) => {
  console.log('Editable')
  const [title, setTitle] = useState<string>(props.oldTitle)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    let typing = e.currentTarget.value
    setTitle(typing)
    if (typing.trim() !== '') {
      setError('')
    } else {
      setError('Title shouldn\'t be empty')
    }
  }

  const changeEditHandler = useCallback(() => {
    setEditMode(!editMode)
    editMode && callbackUpdTitle(title)
    if (title.trim() === '') {
      setEditMode(true)
    }
  }, [callbackUpdTitle])

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    // if (e.key === 'Enter') {
    //   changeEditHandler()
    // }
    e.key === 'Enter' && changeEditHandler()
  }

  return (
    <>
      {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
      {editMode === false
        ? <span onDoubleClick={changeEditHandler}> {title} </span>
        : <input value={title} onChange={onChangeTitle} onBlur={changeEditHandler} autoFocus onKeyDown={onKeyDownHandler} />}
    </>
  )
})
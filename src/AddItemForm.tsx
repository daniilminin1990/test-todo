import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type AddItemFormProps = {
  callback: (newTitle: string)=>void
}

export const AddItemForm = (props: AddItemFormProps) => {
  const [newTitle, setNewTitle] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const onClickAddTaskHandler = () => {
    if (newTitle.trim() !== "") {
      props.callback(newTitle.trim());
      setError(null);
      setNewTitle("");
    } else {
      setNewTitle("");
      setError("Title is empty");
    }
  };

  const onChangeAddTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const titleTyping = e.currentTarget.value;
    setNewTitle(titleTyping);
    titleTyping.trim().length !== 0 && setError(null);
  };

  const onEnterAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onClickAddTaskHandler();
    }
  };

  return (
    <div>
      <input value={newTitle} onChange={onChangeAddTitle} onKeyDown={onEnterAddTask}/>
      <button onClick={onClickAddTaskHandler}>+
      </button>
      {error && <div className={'error-message'}>Title is required</div>}
    </div>
  );
};
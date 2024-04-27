import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { getStyles } from "../../../styles";
import { ServerResponseStatusType } from "../../../redux/appSlice";

export type AddItemFormProps = {
  callback: (newTitle: string) => Promise<any>;
  disabled?: boolean;
};

export const AddItemForm = React.memo((props: AddItemFormProps) => {
  const [newTitle, setNewTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const onClickAddItemHandler = () => {
    if (newTitle.trim() !== "") {
      props
        .callback(newTitle.trim())
        .then((res) => {
          setNewTitle("");
        })
        .catch((err: ServerResponseStatusType) => {
          setError(err);
        });
    } else {
      setNewTitle("");
      setError("Title is required");
    }
  };
  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const titleTyping = e.currentTarget.value;
    setNewTitle(titleTyping);
    titleTyping.length !== 0 && setError("");
  };
  const onEnterKeyAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && onClickAddItemHandler();
  };

  return (
    <div>
      <TextField
        id="outlined-basic"
        error={!!error}
        // label="Type title"
        label={error ? error : "Type smth"}
        variant="outlined"
        value={newTitle}
        onChange={onNewTitleChangeHandler}
        onKeyDown={onEnterKeyAddItem}
        className={error ? "error" : ""}
        disabled={props.disabled}
      />
      <Button onClick={onClickAddItemHandler} variant="contained" style={getStyles(props.disabled)} disabled={props.disabled}>
        +
      </Button>
      {/*{error && <div className={'error-message'}>Title is required</div>}*/}
    </div>
  );
});

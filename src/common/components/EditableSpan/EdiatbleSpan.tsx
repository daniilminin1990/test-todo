import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import {useAppDispatch} from "../../../store/store";
import {appActions} from "../../../redux/appSlice";

export type EdiatbleSpanProps = {
  oldTitle: string;
  callback: (updTitle: string) => void;
  disabled: boolean;
};
const EdiatbleSpan = React.memo((props: EdiatbleSpanProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [updTitle, setUpdTitle] = useState<string>(props.oldTitle);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  dispatch(appActions.changeBlockDragMode({blockDragMode: edit}))

  const swapHandler = () => {
    if (!props.disabled) {
      setEdit(!edit);
      // edit === false && props.callback(updTitle)
      edit === true && props.callback(updTitle);
      if (updTitle.trim() === "") {
        setEdit(true);
      }
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let typing = e.currentTarget.value;
    setUpdTitle(typing);
    if (typing.trim() !== "") {
      setError("");
    } else {
      setError("Title is required");
    }
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      swapHandler();
    }
  };

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {edit ? (
        <TextField
          id="outlined-multiline-flexible"
          multiline
          maxRows={4}
          onBlur={swapHandler}
          value={updTitle}
          onChange={onChangeHandler}
          autoFocus
          onKeyDown={onKeyDownHandler}
          InputProps={{
            style: {
              padding: "5px 10px",
              border: "none", // отменить стандартный padding
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              border: "none", // убрать обводку
            },
          }}
        />
      ) : (
        <p
          style={{
            display: "inline-block",
            alignItems: "center",
            height: "90%",
            width: "100%",
            overflowX: "hidden",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            margin: "5px 10px",
          }}
          onDoubleClick={swapHandler}
        >
          {updTitle}
        </p>
      )}
    </>
  );
});

export default EdiatbleSpan;

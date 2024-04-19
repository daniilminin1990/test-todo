import React, {ChangeEvent, KeyboardEvent, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { getStyles } from "../../../styles";
import {useDispatch, useSelector} from "react-redux";
import {useAppDispatch} from "../../../store/store";
import {appActions, appSelectors} from "../../../redux/appSlice";
// import { styled } from '@mui/system';

export type AddItemFormProps = {
  callback: (newTitle: string) => void;
  disabled?: boolean;
};

// Кастомная стилизация TextField от MUI
// export const StyledTextField = styled(TextField, {
//   name: 'StyledTextField'
// })({
//   '& .MuiOutlinedInput-input': {
//     padding: '8px 14px'
//   },
//   '& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': {
//     transform: 'translate(14px, 10px) scale(1)'
//   },
// })

export const AddItemForm = React.memo((props: AddItemFormProps) => {
  const [newTitle, setNewTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const isBlockDragMode = useSelector(appSelectors.isBlockDragMode);
  const onClickAddItemHandler = () => {
    if (newTitle.trim() !== "") {
      props.callback(newTitle.trim());
      setNewTitle("");
      setError("");

    } else {
      setNewTitle("");
      setError("Title is required");
    }
  };
  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const titleTyping = e.currentTarget.value;
    setNewTitle(titleTyping);
    titleTyping.length !== 0 && setError("");
    dispatch(appActions.changeBlockDragMode({isBlockDragMode: true}))
  };
  const onEnterAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && onClickAddItemHandler();
  };

  const onFocusHandler = () => {
    dispatch(appActions.changeBlockDragMode({isBlockDragMode: true}));
  }
  const onBlurHandler = () => {
    dispatch(appActions.changeBlockDragMode({isBlockDragMode: false}));
  }

  useEffect(() => {
    if (newTitle === "") {
      dispatch(appActions.changeBlockDragMode({isBlockDragMode: false}));
    }
  }, []);

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
        onKeyDown={onEnterAddItem}
        className={error ? "error" : ""}
        disabled={props.disabled}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      />
      <Button
        onClick={onClickAddItemHandler}
        variant="contained"
        style={getStyles(props.disabled)}
        disabled={props.disabled}
      >
        +
      </Button>
      {/*{error && <div className={'error-message'}>Title is required</div>}*/}
    </div>
  );
});

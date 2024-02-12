import React, {ChangeEvent} from 'react';

type CheckboxUniversalProps = {
  checked: boolean,
  callback: (newStatus: boolean)=> void
}
const CheckboxUniversal = (props: CheckboxUniversalProps) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>)=> {
    props.callback(e.currentTarget.checked)
  }
  return (
    <input type="checkbox" checked={props.checked} onChange={onChangeHandler}/>
  );
};

export default CheckboxUniversal;

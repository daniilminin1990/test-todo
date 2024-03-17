const getStyles = (disabled: boolean | undefined) => ({
  maxWidth: '38px',
  maxHeight: '38px',
  minWidth: '38px',
  minHeight: '38px',
  backgroundColor: disabled ? 'lightgray' : '#3cb37b'
});

const styleTextField = {
  maxHeight: '38px',
  minHeight: '38px',
  maxWidth: '210px'
}

export {
  getStyles,
  styleTextField
}
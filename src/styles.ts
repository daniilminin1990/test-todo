const getStyles = (disabled: boolean | undefined) => ({
  maxWidth: "30px",
  maxHeight: "100%",
  minWidth: "30px",
  minHeight: "100%",
  backgroundColor: disabled ? "lightgray" : "#3cb37b",
});

export const taskButton = {
  maxHeight: "100%",
  minHeight: "100%",
};

const styleTextField = {
  maxHeight: "38px",
  minHeight: "38px",
  maxWidth: "210px",
};

export { getStyles, styleTextField };

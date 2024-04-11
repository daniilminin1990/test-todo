import React, { useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ColorModeContext } from "../ThemeTogglerSlider/ThemeTogglerSlider";
import { grey, lightBlue, teal } from "@mui/material/colors";

const initTheme = JSON.parse(localStorage.getItem("theme") || "{}");

export const ThemeTogglerHOC = (props: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">(
    initTheme.theme ? initTheme.theme : "light"
  );
  console.log("initTheme.theme", initTheme.theme);
  let theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#3f51b5",
          },
          ...(mode === "light" && {
            background: {
              default: "#eeeeee",
            },
          }),
          ...(mode === "dark" && {
            background: {
              default: grey[900],
            },
          }),
        },
      }),
    [mode]
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          return prevMode === "light" ? "dark" : "light";
        });
      },
    }),
    []
  );

  console.log(initTheme);

  useEffect(() => {
    // setMode(localStorage.getItem('theme') === 'light' ? 'dark': 'light' )
    localStorage.setItem("theme", JSON.stringify({ theme: mode }));
  }, [mode]);
  // const dispatch = useAppDispatch()
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

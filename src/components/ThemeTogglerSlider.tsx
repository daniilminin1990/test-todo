import {useTheme} from '@mui/material/styles'
import Box from '@mui/material/Box';
import React, {createContext, useContext} from "react";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const ThemeTogglerSlider = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
  );
}
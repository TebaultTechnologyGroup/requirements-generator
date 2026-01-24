
// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4f46e5' }, // indigo-600-ish
    secondary: { main: '#06b6d4' }, // cyan-500-ish
    background: {
      default: '#f7f7fb',
      paper: '#ffffff',
    },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
});

import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? '#6DB7E3' : '#155C8B', dark: '#0B3554', light: isDark ? '#173D58' : '#D8EAF5' },
      secondary: { main: isDark ? '#68C5B2' : '#217A68', dark: '#104E42', light: isDark ? '#173F38' : '#DAEFEA' },
      background: { default: isDark ? '#0E1722' : '#F4F7FA', paper: isDark ? '#152231' : '#FFFFFF' },
      error: { main: isDark ? '#FF8A80' : '#B42318', light: isDark ? '#3E1F22' : '#FDE7E5' },
      warning: { main: isDark ? '#F4B860' : '#B86B00', light: isDark ? '#3D2B13' : '#FFF1D6' },
      success: { main: isDark ? '#80D6A8' : '#247A4D', light: isDark ? '#173826' : '#DDF3E7' },
      text: { primary: isDark ? '#EEF4FA' : '#162331', secondary: isDark ? '#A8B7C8' : '#5B6775' },
      divider: isDark ? '#253445' : '#E1E7EE',
    },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h4: { fontWeight: 800, letterSpacing: 0 },
    h5: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 800, letterSpacing: 0 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 180ms ease, color 180ms ease',
        },
        'input, textarea': {
          backgroundColor: 'transparent',
        },
        'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active': {
          WebkitTextFillColor: isDark ? '#EEF4FA' : '#162331',
          caretColor: isDark ? '#EEF4FA' : '#162331',
          WebkitBoxShadow: `0 0 0 1000px ${isDark ? '#111C2A' : '#FFFFFF'} inset`,
          transition: 'background-color 9999s ease-out 0s',
        },
        'input:-internal-autofill-selected': {
          appearance: 'menulist-button',
          backgroundImage: 'none',
          backgroundColor: `${isDark ? '#111C2A' : '#FFFFFF'} !important`,
          color: `${isDark ? '#EEF4FA' : '#162331'} !important`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark' ? '0 18px 42px rgba(0, 0, 0, 0.32)' : '0 14px 34px rgba(22, 35, 49, 0.08)',
          backgroundImage: 'none',
        }),
      },
    },
    MuiButton: { defaultProps: { variant: 'contained' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            backgroundColor: isDark ? '#111C2A' : '#FFFFFF',
          },
        },
        input: {
          color: isDark ? '#EEF4FA' : '#162331',
          backgroundColor: 'transparent',
          '&:-webkit-autofill': {
            WebkitTextFillColor: isDark ? '#EEF4FA' : '#162331',
            caretColor: isDark ? '#EEF4FA' : '#162331',
            WebkitBoxShadow: `0 0 0 1000px ${isDark ? '#111C2A' : '#FFFFFF'} inset`,
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: isDark ? '#A8B7C8' : '#5B6775',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: isDark ? '#A8B7C8' : '#5B6775',
          '&.Mui-focused': {
            color: isDark ? '#6DB7E3' : '#155C8B',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? '#111C2A' : '#FFFFFF',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },
        },
      },
    },
  },
  });
};

import { createTheme, alpha } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

const colors = {
  primary: {
    main: '#1976d2', // A professional blue
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#dc004e', // A vibrant pink for secondary actions
    light: '#ff4081',
    dark: '#9a0036',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f4f6f8',
    paper: '#ffffff',
  },
  text: {
    primary: '#212b36',
    secondary: '#637381',
    disabled: '#919eab',
  },
};

// Create RTL cache
export const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    divider: alpha(colors.text.primary, 0.12),
    action: {
      active: colors.text.secondary,
      hover: alpha(colors.primary.main, 0.08),
      selected: alpha(colors.primary.main, 0.16),
      disabled: alpha(colors.text.primary, 0.3),
      disabledBackground: alpha(colors.text.primary, 0.1),
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '3.5rem' },
    h2: { fontWeight: 700, fontSize: '3rem' },
    h3: { fontWeight: 700, fontSize: '2.25rem' },
    h4: { fontWeight: 700, fontSize: '2rem' },
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    h6: { fontWeight: 600, fontSize: '1.125rem' },
    subtitle1: { fontSize: '1rem', fontWeight: 600 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          boxShadow: `0 8px 16px 0 ${alpha(colors.primary.main, 0.24)}`,
        },
        containedSecondary: {
          boxShadow: `0 8px 16px 0 ${alpha(colors.secondary.main, 0.24)}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
        InputLabelProps: { shrink: true },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.text.primary, 0.08),
          '&:hover': {
            backgroundColor: alpha(colors.text.primary, 0.12),
          },
          '&.Mui-focused': {
            backgroundColor: alpha(colors.text.primary, 0.12),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: `0 2px 4px -1px ${alpha(colors.text.primary, 0.2)}, 0 4px 5px 0px ${alpha(colors.text.primary, 0.14)}, 0 1px 10px 0px ${alpha(colors.text.primary, 0.12)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: `0 0 2px 0 ${alpha(colors.text.primary, 0.2)}, 0 12px 24px -4px ${alpha(colors.text.primary, 0.12)}`,
          borderRadius: 16,
        },
      },
    },
  },
});
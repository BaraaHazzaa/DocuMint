import { createTheme, alpha } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';

// Syrian flag colors
const colors = {
  green: {
    main: '#009A44',
    light: '#33AE6B',
    dark: '#006B2F',
    contrast: '#FFFFFF',
  },
  red: {
    main: '#CE1126',
    light: '#D83E51',
    dark: '#900B1A',
    contrast: '#FFFFFF',
  },
  black: {
    main: '#000000',
    light: '#2C2C2C',
    dark: '#000000',
    contrast: '#FFFFFF',
  },
  white: {
    main: '#FFFFFF',
    dark: '#F5F5F5',
    darker: '#EEEEEE',
    contrast: '#000000',
  },
};

// Create RTL cache
export const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create theme
export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: colors.green.main,
      light: colors.green.light,
      dark: colors.green.dark,
      contrastText: colors.green.contrast,
    },
    secondary: {
      main: colors.red.main,
      light: colors.red.light,
      dark: colors.red.dark,
      contrastText: colors.red.contrast,
    },
    error: {
      main: colors.red.main,
      light: colors.red.light,
      dark: colors.red.dark,
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    success: {
      main: colors.green.main,
      light: colors.green.light,
      dark: colors.green.dark,
    },
    text: {
      primary: colors.black.main,
      secondary: colors.black.light,
      disabled: alpha(colors.black.main, 0.38),
    },
    background: {
      default: colors.white.darker,
      paper: colors.white.main,
    },
    divider: alpha(colors.black.main, 0.12),
    action: {
      active: alpha(colors.black.main, 0.54),
      hover: alpha(colors.black.main, 0.04),
      selected: alpha(colors.black.main, 0.08),
      disabled: alpha(colors.black.main, 0.26),
      disabledBackground: alpha(colors.black.main, 0.12),
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: 0.1,
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: 0.15,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: 0.15,
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: 0.4,
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: 0.4,
      lineHeight: 1.66,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        '#root': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '2rem',
          paddingBottom: '2rem',
          '@media (max-width:600px)': {
            paddingTop: '1rem',
            paddingBottom: '1rem',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)',
          },
        },
        elevation1: {
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)',
        },
        elevation3: {
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.2)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            boxShadow: 'none',
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${colors.green.dark}, ${colors.green.main})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.green.main}, ${colors.green.light})`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(45deg, ${colors.red.dark}, ${colors.red.main})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.red.main}, ${colors.red.light})`,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        textPrimary: {
          '&:hover': {
            backgroundColor: alpha(colors.green.main, 0.1),
          },
        },
        textSecondary: {
          '&:hover': {
            backgroundColor: alpha(colors.red.main, 0.1),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 8,
          '&:hover': {
            backgroundColor: alpha(colors.black.main, 0.04),
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: colors.green.main,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 2px ${alpha(colors.green.main, 0.25)}`,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px 0 rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.green.main, 0.1),
          color: colors.green.dark,
        },
        standardError: {
          backgroundColor: alpha(colors.red.main, 0.1),
          color: colors.red.dark,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: alpha(colors.black.main, 0.04),
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white.main,
          color: colors.black.main,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.MuiChip-colorPrimary': {
            backgroundColor: alpha(colors.green.main, 0.1),
            color: colors.green.dark,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: alpha(colors.red.main, 0.1),
            color: colors.red.dark,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
          backgroundColor: alpha(colors.black.main, 0.9),
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          overflow: 'hidden',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
        },
      },
    },
  },
});
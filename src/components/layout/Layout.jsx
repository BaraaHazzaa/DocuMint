import { Box, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const NAV_WIDTH = 280;

export default function Layout({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: `${theme.spacing(3)}`,
          px: `${theme.spacing(2)}`,
          width: { lg: `calc(100% - ${NAV_WIDTH}px)` },
          mt: `64px`, // AppBar height
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
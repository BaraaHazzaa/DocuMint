import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  const theme = useTheme();
  const _isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: '1 1 auto',
          width: '100%',
          paddingTop: { xs: '56px', sm: '64px' }, // Account for fixed navbar
          paddingBottom: { xs: 2, sm: 3 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
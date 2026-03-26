import { Typography, Box, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const WelcomeHeader = () => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 5,
        p: 3,
        backgroundColor: 'primary.lighter',
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.primary.light}`,
      }}
    >
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          width: 56,
          height: 56,
          mr: 2,
          color: 'primary.contrastText',
        }}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>
      <Box>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your account today.
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomeHeader;

import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function LoadingState({ message = 'جاري التحميل...' }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 2,
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
        }}
      />
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
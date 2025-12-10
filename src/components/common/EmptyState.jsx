import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        textAlign: 'center',
        padding: theme.spacing(3),
      }}
    >
      {Icon && (
        <Icon
          sx={{
            fontSize: 64,
            color: theme.palette.action.active,
            marginBottom: 2,
          }}
        />
      )}
      
      <Typography
        variant="h5"
        color="textPrimary"
        sx={{
          fontWeight: 500,
          marginBottom: 1,
        }}
      >
        {title}
      </Typography>
      
      <Typography
        variant="body1"
        color="textSecondary"
        sx={{
          maxWidth: 400,
          marginBottom: 3,
        }}
      >
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          color="primary"
          onClick={onAction}
          sx={{
            minWidth: 200,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
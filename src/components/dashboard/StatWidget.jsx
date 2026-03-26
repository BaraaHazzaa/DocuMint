import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * A widget for displaying a single statistic with a title and icon.
 *
 * @param {object} props
 * @param {string} props.title - The title of the statistic.
 * @param {string|number} props.value - The value of the statistic.
 * @param {React.ReactNode} props.icon - The icon to display.
 * @param {boolean} props.loading - Whether the widget is in a loading state.
 */
const StatWidget = ({ title, value, icon, loading }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {loading ? (
        <SkeletonLoader lines={2} height={30} />
      ) : (
        <>
          <Box>
            <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        </>
      )}
    </Paper>
  );
};

export default StatWidget;

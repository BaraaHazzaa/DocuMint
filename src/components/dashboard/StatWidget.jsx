import { Paper, Typography, Box, CircularProgress, alpha, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * A widget for displaying a single statistic with a title and icon.
 *
 * @param {object} props
 * @param {string} props.title - The title of the statistic.
 * @param {string|number} props.value - The value of the statistic.
 * @param {React.ReactNode} props.icon - The icon to display.
 * @param {boolean} props.loading - Whether the widget is in a loading state.
 * @param {string} props.color - The color of the statistic (default: 'primary').
 * @param {string} [props.link] - Optional URL to link to.
 */
const StatWidget = ({ title, value, icon, loading, color = 'primary', link }) => {
  const theme = useTheme();
  const bgColor = alpha(theme.palette[color].main, 0.1);
  const iconColor = theme.palette[color].main;

  const content = (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        backgroundColor: bgColor,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': link ? {
          transform: 'translateY(-4px)',
          boxShadow: `0 4px 20px 0 ${alpha(theme.palette[color].main, 0.25)}`,
        } : {},
      }}
    >
      {loading ? (
        <SkeletonLoader lines={2} height={30} />
      ) : (
        <>
          <Box>
            <Typography variant="h3" component="p" sx={{ fontWeight: 'bold', color: iconColor }}>
              {value}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ color: iconColor, fontSize: '3rem' }}>{icon}</Box>
        </>
      )}
    </Paper>
  );

  if (link) {
    return (
      <Link to={link} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default StatWidget;

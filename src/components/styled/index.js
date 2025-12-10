import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Typography,
  Paper,
  CardContent,
  Button,
  IconButton,
} from '@mui/material';

// Styled components for cards and containers
export const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
}));

export const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

// Styled paper for form sections
export const FormSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

// Page title component
export const PageTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  paddingBottom: theme.spacing(1),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '60px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    borderRadius: theme.shape.borderRadius,
  },
}));

// Status indicator
export const StatusChip = styled(Box)(({ theme, status }) => {
  const getColor = () => {
    switch (status) {
      case 'approved':
        return theme.palette.success;
      case 'rejected':
        return theme.palette.error;
      case 'pending':
        return theme.palette.warning;
      default:
        return theme.palette.info;
    }
  };

  const color = getColor();

  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '0.875rem',
    fontWeight: 500,
    backgroundColor: color.main + '14', // Using hex opacity
    color: color.dark,
    border: `1px solid ${color.main}40`, // Using hex opacity
  };
});

// Action buttons
export const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 120,
  '&.approve': {
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  '&.deny': {
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

// Circular icon button with background
export const CircularIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
  },
}));

// File upload zone
export const UploadZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

// Container with bottom gradient border
export const GradientBorderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, 
      ${theme.palette.primary.main}, 
      ${theme.palette.secondary.main}
    )`,
  },
}));

// Grid layout container with responsive gap
export const ResponsiveGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  },
}));
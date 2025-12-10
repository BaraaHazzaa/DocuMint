import { Box, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    right: 0,
    width: 60,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export default function SectionHeader({ 
  title,
  subtitle,
  action,
  divider = true,
}) {
  return (
    <>
      <StyledHeader>
        <Box sx={{ flex: 1 }}>
          <StyledTitle variant="h5" gutterBottom>
            {title}
          </StyledTitle>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </StyledHeader>
      {divider && <StyledDivider />}
    </>
  );
}
import { Box, Container, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, 
      ${theme.palette.primary.main},
      ${theme.palette.secondary.main}
    )`,
  },
}));

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: { xs: 'center', sm: 'left' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            © {currentYear} نظام المعاملات الإلكترونية. جميع الحقوق محفوظة
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link
              href="#"
              color="textSecondary"
              underline="hover"
              variant="body2"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="#"
              color="textSecondary"
              underline="hover"
              variant="body2"
            >
              شروط الاستخدام
            </Link>
            <Link
              href="#"
              color="textSecondary"
              underline="hover"
              variant="body2"
            >
              اتصل بنا
            </Link>
          </Box>
        </Box>
      </Container>
    </StyledFooter>
  );
}
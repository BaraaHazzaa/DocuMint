import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOpenIcon from '@mui/icons-material/LockOpen';

// You can replace this with your actual logo or an illustration
const LoginIllustration = () => (
  <Box
    sx={{
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
      color: 'primary.contrastText',
      p: 4,
    }}
  >
    <Stack spacing={2} alignItems="center">
      <Typography variant="h3" component="h1" fontWeight="bold">
        DocuMint
      </Typography>
      <Typography variant="h6" align="center">
        Your streamlined document workflow solution.
      </Typography>
    </Stack>
  </Box>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('validation.invalidEmail'))
        .required(t('validation.required')),
      password: Yup.string().required(t('validation.required')),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.email, values.password);
        navigate('/dashboard');
      } catch (error) {
        setErrors({ email: error.message || t('login.invalidCredentials') });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Stack alignItems="center" spacing={2} sx={{ mb: 5 }}>
            <LockOpenIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography component="h1" variant="h4" fontWeight="bold">
              {t('login.title')}
            </Typography>
            <Typography color="text.secondary">
              {t('login.subtitle', 'Sign in to continue')}
            </Typography>
          </Stack>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ width: '100%' }}
          >
            <Stack spacing={3}>
              {formik.errors.email && !formik.touched.email && (
                <Alert severity="error">{formik.errors.email}</Alert>
              )}

              <TextField
                required
                fullWidth
                id="email"
                label={t('login.username')}
                name="email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                required
                fullWidth
                name="password"
                label={t('login.password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={formik.isSubmitting}
              sx={{ mt: 4, mb: 2, py: 1.5 }}
            >
              {formik.isSubmitting ? t('login.loggingIn') : t('login.title')}
            </Button>
          </Box>
        </Box>
      </Grid>
      <LoginIllustration />
    </Grid>
  );
}
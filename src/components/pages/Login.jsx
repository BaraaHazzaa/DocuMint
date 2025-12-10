import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setError(`تم تأمين الحساب مؤقتاً. يرجى المحاولة بعد ${minutesLeft} دقائق.`);
      return;
    }

    // Validate input
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setError('البريد الإلكتروني غير صالح');
      return;
    }

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      
      // Reset attempts on successful login
      setLoginAttempts(0);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLoginAttempts(prev => prev + 1);
      
      // Implement lockout after 3 failed attempts
      if (loginAttempts >= 2) {
        const lockoutTime = Date.now() + 15 * 60000; // 15 minutes
        setLockoutUntil(lockoutTime);
        setError('تم تأمين الحساب مؤقتاً بسبب محاولات تسجيل دخول متكررة. يرجى المحاولة بعد 15 دقيقة.');
      } else {
        setError('فشل تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <Container component="main" maxWidth="xs" dir="rtl">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            تسجيل الدخول
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="البريد الإلكتروني"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
            />
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={handleRememberMeChange} color="primary" />}
              label="تذكرني"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
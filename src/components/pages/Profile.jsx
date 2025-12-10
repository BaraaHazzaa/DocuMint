import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    try {
      setMessage({
        type: 'success',
        text: 'تم تحديث الملف الشخصي بنجاح'
      });
    } catch {
      setMessage({
        type: 'error',
        text: 'فشل تحديث الملف الشخصي'
      });
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'كلمات المرور غير متطابقة'
      });
      return;
    }
    // In a real app, this would call an API
    try {
      setMessage({
        type: 'success',
        text: 'تم تغيير كلمة المرور بنجاح'
      });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch {
      setMessage({
        type: 'error',
        text: 'فشل تغيير كلمة المرور'
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }} dir="rtl">
      <Typography variant="h4" gutterBottom align="center">
        الملف الشخصي
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6">{user?.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.role === 'manager' && 'مدير'}
                  {user?.role === 'director' && 'مدير عام'}
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleProfileUpdate}>
              <TextField
                fullWidth
                label="الاسم"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                type="email"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                حفظ التغييرات
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              تغيير كلمة المرور
            </Typography>
            <form onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                label="كلمة المرور الحالية"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="كلمة المرور الجديدة"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="تأكيد كلمة المرور الجديدة"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                تغيير كلمة المرور
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
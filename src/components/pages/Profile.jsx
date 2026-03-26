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
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const profileValidationSchema = Yup.object().shape({
  name: Yup.string().required('الاسم مطلوب'),
  email: Yup.string().email('صيغة البريد الإلكتروني غير صحيحة').required('البريد الإلكتروني مطلوب'),
});

const passwordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('كلمة المرور الحالية مطلوبة'),
  newPassword: Yup.string()
    .min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
    .required('كلمة المرور الجديدة مطلوبة'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور الجديدة مطلوب'),
});

export default function Profile() {
  const { user } = useAuth();

  const handleProfileUpdate = (values, { setSubmitting }) => {
    // In a real app, this would call an API
    try {
      console.log('Updating profile with:', values);
      toast.success('تم تحديث الملف الشخصي بنجاح');
      setSubmitting(false);
    } catch {
      toast.error('فشل تحديث الملف الشخصي');
      setSubmitting(false);
    }
  };

  const handlePasswordChange = (values, { setSubmitting, resetForm }) => {
    // In a real app, this would call an API
    try {
      console.log('Changing password with:', values);
      toast.success('تم تغيير كلمة المرور بنجاح');
      setSubmitting(false);
      resetForm();
    } catch {
      toast.error('فشل تغيير كلمة المرور. يرجى التحقق من كلمة المرور الحالية.');
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }} dir="rtl">
      <Typography variant="h4" gutterBottom align="center">
        الملف الشخصي
      </Typography>

      <Grid container spacing={5}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  mb: 2
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5">{user?.name}</Typography>
              <Typography variant="body1" color="textSecondary">
                {user?.role}
              </Typography>
            </Box>

            <Formik
              initialValues={{ name: user?.name || '', email: user?.email || '' }}
              validationSchema={profileValidationSchema}
              onSubmit={handleProfileUpdate}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    name="name"
                    label="الاسم"
                    margin="normal"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    name="email"
                    label="البريد الإلكتروني"
                    margin="normal"
                    type="email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              تغيير كلمة المرور
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Formik
              initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
              validationSchema={passwordValidationSchema}
              onSubmit={handlePasswordChange}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    type="password"
                    name="currentPassword"
                    label="كلمة المرور الحالية"
                    margin="normal"
                    error={touched.currentPassword && !!errors.currentPassword}
                    helperText={touched.currentPassword && errors.currentPassword}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    type="password"
                    name="newPassword"
                    label="كلمة المرور الجديدة"
                    margin="normal"
                    error={touched.newPassword && !!errors.newPassword}
                    helperText={touched.newPassword && errors.newPassword}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    type="password"
                    name="confirmPassword"
                    label="تأكيد كلمة المرور الجديدة"
                    margin="normal"
                    error={touched.confirmPassword && !!errors.confirmPassword}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {isSubmitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
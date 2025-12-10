import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import { useNotifications as _useNotifications } from '../../context/NotificationContext';

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    email: true,
    browser: true,
    approvalNeeded: true,
    statusUpdates: true,
    comments: true,
    deadlineReminders: true
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.checked
    });
  };

  const handleSave = async () => {
    try {
      // In a real app, this would save to the backend
      // await notificationService.updatePreferences(preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        إعدادات الإشعارات
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          تم حفظ التفضيلات بنجاح
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          قنوات الإشعارات
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.email}
                onChange={handleChange}
                name="email"
              />
            }
            label="البريد الإلكتروني"
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.browser}
                onChange={handleChange}
                name="browser"
              />
            }
            label="إشعارات المتصفح"
          />
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          أنواع الإشعارات
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.approvalNeeded}
                onChange={handleChange}
                name="approvalNeeded"
              />
            }
            label="معاملات تحتاج موافقة"
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.statusUpdates}
                onChange={handleChange}
                name="statusUpdates"
              />
            }
            label="تحديثات الحالة"
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.comments}
                onChange={handleChange}
                name="comments"
              />
            }
            label="التعليقات الجديدة"
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.deadlineReminders}
                onChange={handleChange}
                name="deadlineReminders"
              />
            }
            label="تنبيهات المواعيد النهائية"
          />
        </FormGroup>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        حفظ التفضيلات
      </Button>
    </Paper>
  );
}
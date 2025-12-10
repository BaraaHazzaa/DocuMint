import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/api';
import { io } from 'socket.io-client';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.on('notification', (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      await notificationService.markAsRead(notification.id);
      navigate(`/transactions/${notification.transactionId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Container maxWidth="sm" dir="rtl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          الإشعارات
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} disablePadding>
                <ListItemButton onClick={() => handleNotificationClick(notification)}>
                  <ListItemText
                    primary={notification.message}
                    secondary={new Date(notification.timestamp).toLocaleString('ar-SY')}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}
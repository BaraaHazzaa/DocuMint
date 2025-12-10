import { useState, createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const NOTIFICATION_TYPES = {
  NEW_TRANSACTION: 'new_transaction',
  APPROVAL_NEEDED: 'approval_needed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
  COMMENT: 'comment',
  DEADLINE_APPROACHING: 'deadline_approaching',
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // If no backend URL is configured, skip socket connection (frontend-only development)
    const apiUrl = import.meta.env.VITE_API_URL || '';
    if (!apiUrl) {
      console.info('Notification socket disabled: VITE_API_URL not set');
      return;
    }

    // Connect to WebSocket for real-time notifications with safe guards
    let socket;
    try {
      socket = io(apiUrl, {
        auth: {
          token: sessionStorage.getItem('token') || ''
        },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3
      });

      socket.on('connect', () => {
        console.info('Notification socket connected');
      });

      socket.on('connect_error', (err) => {
        console.warn('Notification socket connect error:', err && err.message ? err.message : err);
      });

      socket.on('notification', (notification) => {
        try {
          addNotification(notification);
        } catch (e) {
          console.error('Error handling incoming notification:', e);
        }
      });
    } catch (err) {
      console.warn('Failed to initialize notification socket:', err);
    }

    // Cleanup
    return () => {
      try {
        socket?.disconnect();
      } catch (e) {
        /* ignore disconnect errors */
      }
    };
  }, [user]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show browser notification if supported
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png'
      });
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationContent = (type, data) => {
    const templates = {
      [NOTIFICATION_TYPES.NEW_TRANSACTION]: {
        title: 'معاملة جديدة',
        message: `تم إنشاء معاملة جديدة: ${data.title}`,
        severity: 'info'
      },
      [NOTIFICATION_TYPES.APPROVAL_NEEDED]: {
        title: 'يتطلب موافقة',
        message: `معاملة تحتاج إلى موافقتك: ${data.title}`,
        severity: 'warning'
      },
      [NOTIFICATION_TYPES.APPROVED]: {
        title: 'تمت الموافقة',
        message: `تمت الموافقة على المعاملة: ${data.title}`,
        severity: 'success'
      },
      [NOTIFICATION_TYPES.REJECTED]: {
        title: 'تم الرفض',
        message: `تم رفض المعاملة: ${data.title}`,
        severity: 'error'
      },
      [NOTIFICATION_TYPES.ESCALATED]: {
        title: 'تم التصعيد',
        message: `تم تصعيد المعاملة: ${data.title}`,
        severity: 'warning'
      },
      [NOTIFICATION_TYPES.DEADLINE_APPROACHING]: {
        title: 'موعد نهائي وشيك',
        message: `موعد نهائي قريب للمعاملة: ${data.title}`,
        severity: 'warning'
      }
    };

    return templates[type] || {
      title: 'إشعار',
      message: data.message,
      severity: 'info'
    };
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    getNotificationContent,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { NOTIFICATION_TYPES } from '../context/WorkflowContext';

export function useNotificationManager(options = {}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize notification handlers
  const memoHandleApprovalRequest = useCallback((n) => handleApprovalRequest(n), [handleApprovalRequest]);
  const memoHandleApproval = useCallback((n) => handleApproval(n), [handleApproval]);
  const memoHandleRejection = useCallback((n) => handleRejection(n), [handleRejection]);
  const memoHandleEscalation = useCallback((n) => handleEscalation(n), [handleEscalation]);
  const memoHandleReminder = useCallback((n) => handleReminder(n), [handleReminder]);

  useEffect(() => {
    if (!user) return;

    notificationService.registerHandler(NOTIFICATION_TYPES.PENDING_APPROVAL, memoHandleApprovalRequest);
    notificationService.registerHandler(NOTIFICATION_TYPES.APPROVED, memoHandleApproval);
    notificationService.registerHandler(NOTIFICATION_TYPES.REJECTED, memoHandleRejection);
    notificationService.registerHandler(NOTIFICATION_TYPES.ESCALATED, memoHandleEscalation);
    notificationService.registerHandler(NOTIFICATION_TYPES.REMINDER, memoHandleReminder);

    const socket = notificationService.initializeSocket(sessionStorage.getItem('token'));
    return () => {
      socket.disconnect();
    };
  }, [user, memoHandleApprovalRequest, memoHandleApproval, memoHandleRejection, memoHandleEscalation, memoHandleReminder]);

  // Load initial notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationService.getPendingNotifications({
        userId: user.id,
        ...options
      });
      
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, options]);

  const memoLoadNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!user) return;
    memoLoadNotifications();
  }, [user, memoLoadNotifications]);

  // Notification handlers
  const handleApprovalRequest = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    showBrowserNotification('New Approval Request', notification.message);
  }, []);

  const handleApproval = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    showBrowserNotification('Transaction Approved', notification.message);
  }, []);

  const handleRejection = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    showBrowserNotification('Transaction Rejected', notification.message);
  }, []);

  const handleEscalation = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    showBrowserNotification('Transaction Escalated', notification.message);
  }, []);

  const handleReminder = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    showBrowserNotification('Reminder', notification.message);
  }, []);

  // Browser notifications
  const showBrowserNotification = (title, message) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/logo.png'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, {
            body: message,
            icon: '/logo.png'
          });
        }
      });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const promises = notifications
        .filter(n => !n.read)
        .map(n => notificationService.markAsRead(n.id));
      
      await Promise.all(promises);
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications
  };
}
import axios from 'axios';
import { io } from 'socket.io-client';

class NotificationService {
  constructor() {
    this.socket = null;
    this.notificationHandlers = new Map();
    this.baseURL = import.meta.env.VITE_API_URL;
    this.emailQueue = [];
    this.whatsappQueue = [];
    this.processingQueue = false;
  }

  // Initialize socket connection
  initializeSocket(token) {
    this.socket = io(this.baseURL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.setupSocketListeners();
    return this.socket;
  }

  // Setup socket event listeners
  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to notification service');
      this.processQueuedNotifications();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification service');
    });

    this.socket.on('notification', (notification) => {
      this.handleNotification(notification);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Register notification handler
  registerHandler(type, handler) {
    this.notificationHandlers.set(type, handler);
  }

  // Handle incoming notifications
  handleNotification(notification) {
    const handler = this.notificationHandlers.get(notification.type);
    if (handler) {
      handler(notification);
    }
  }

  // Send email notification with retry mechanism
  async sendEmailNotification(recipient, subject, content, options = {}) {
    const notification = {
      recipient,
      subject,
      content,
      options,
      retries: 0,
      maxRetries: options.maxRetries || 3
    };

    if (!this.socket?.connected) {
      this.emailQueue.push(notification);
      return;
    }

    try {
      const response = await axios.post(`${this.baseURL}/notifications/email`, {
        recipient,
        subject,
        content,
        ...options
      });

      // Emit real-time notification
      this.socket.emit('emailSent', {
        recipient,
        subject,
        timestamp: new Date()
      });

      return response.data;
    } catch (error) {
      if (notification.retries < notification.maxRetries) {
        notification.retries++;
        this.emailQueue.push(notification);
        setTimeout(() => this.processQueuedNotifications(), 1000 * Math.pow(2, notification.retries));
      }
      throw error;
    }
  }

  // Send WhatsApp notification
  async sendWhatsAppNotification(recipient, message, options = {}) {
    const notification = {
      recipient,
      message,
      options,
      retries: 0,
      maxRetries: options.maxRetries || 3
    };

    if (!this.socket?.connected) {
      this.whatsappQueue.push(notification);
      return;
    }

    try {
      const response = await axios.post(`${this.baseURL}/notifications/whatsapp`, {
        recipient,
        message,
        ...options
      });

      this.socket.emit('whatsappSent', {
        recipient,
        timestamp: new Date()
      });

      return response.data;
    } catch (error) {
      if (notification.retries < notification.maxRetries) {
        notification.retries++;
        this.whatsappQueue.push(notification);
        setTimeout(() => this.processQueuedNotifications(), 1000 * Math.pow(2, notification.retries));
      }
      throw error;
    }
  }

  // Schedule reminder with custom notification channels
  async scheduleReminder(transactionId, recipientId, delay, channels = ['email', 'whatsapp']) {
    try {
      const response = await axios.post(`${this.baseURL}/notifications/reminder`, {
        transactionId,
        recipientId,
        delay,
        channels
      });

      this.socket.emit('reminderScheduled', {
        transactionId,
        recipientId,
        scheduledFor: new Date(Date.now() + delay * 60000)
      });

      return response.data;
    } catch (error) {
      console.error('Failed to schedule reminder:', error);
      throw error;
    }
  }

  // Schedule escalation with notification preferences
  async scheduleEscalation(transactionId, currentApproverId, nextApproverId, delay, options = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/notifications/escalation`, {
        transactionId,
        currentApproverId,
        nextApproverId,
        delay,
        notifyCurrentApprover: options.notifyCurrentApprover !== false,
        escalationType: options.escalationType || 'standard',
        channels: options.channels || ['email', 'whatsapp']
      });

      this.socket.emit('escalationScheduled', {
        transactionId,
        nextApproverId,
        scheduledFor: new Date(Date.now() + delay * 60000)
      });

      return response.data;
    } catch (error) {
      console.error('Failed to schedule escalation:', error);
      throw error;
    }
  }

  // Process queued notifications
  async processQueuedNotifications() {
    if (this.processingQueue || !this.socket?.connected) return;

    this.processingQueue = true;
    
    try {
      // Process email queue
      while (this.emailQueue.length > 0) {
        const notification = this.emailQueue.shift();
        await this.sendEmailNotification(
          notification.recipient,
          notification.subject,
          notification.content,
          notification.options
        );
      }

      // Process WhatsApp queue
      while (this.whatsappQueue.length > 0) {
        const notification = this.whatsappQueue.shift();
        await this.sendWhatsAppNotification(
          notification.recipient,
          notification.message,
          notification.options
        );
      }
    } finally {
      this.processingQueue = false;
    }
  }

  // Get pending notifications with filtering and pagination
  async getPendingNotifications(filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/notifications/pending`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get pending notifications:', error);
      throw error;
    }
  }

  // Mark notification as read with additional metadata
  async markAsRead(notificationId, metadata = {}) {
    try {
      const response = await axios.put(`${this.baseURL}/notifications/${notificationId}/read`, {
        readAt: new Date(),
        ...metadata
      });

      this.socket.emit('notificationRead', {
        notificationId,
        timestamp: new Date()
      });

      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  // Get user notification preferences
  async getNotificationPreferences(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/notifications/preferences/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get notification preferences:', error);
      throw error;
    }
  }

  // Update user notification preferences
  async updateNotificationPreferences(userId, preferences) {
    try {
      const response = await axios.put(`${this.baseURL}/notifications/preferences/${userId}`, preferences);
      return response.data;
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
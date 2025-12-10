import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add security headers and token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token'); // Use sessionStorage instead of localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('خطأ في الاتصال بالخادم'));
    }

    // Handle different HTTP status codes
    switch (error.response.status) {
      case 401:
        // Clear session and redirect to login
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new Error('انتهت صلاحية الجلسة'));

      case 403:
        return Promise.reject(new Error('ليس لديك صلاحية للقيام بهذا الإجراء'));

      case 404:
        return Promise.reject(new Error('لم يتم العثور على المورد المطلوب'));

      case 422: {
        // Handle validation errors
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          const errorMessage = Object.values(validationErrors).flat().join('\n');
          return Promise.reject(new Error(errorMessage));
        }
        return Promise.reject(new Error('بيانات غير صالحة'));
      }

      case 500:
        console.error('Server error:', error);
        return Promise.reject(new Error('حدث خطأ في الخادم'));

      default:
        console.error('API error:', error);
        return Promise.reject(new Error('حدث خطأ غير متوقع'));
    }
  }
);

export const transactionService = {
  // Get all transactions (with optional filters)
  async getTransactions(filters = {}) {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  // Get single transaction by ID
  async getTransaction(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Create new transaction
  async createTransaction(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'file') {
        formData.append('file', data.file);
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await api.post('/transactions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update transaction status
  async updateTransactionStatus(id, { status, comment, signature }) {
    const response = await api.put(`/transactions/${id}/status`, {
      status,
      comment,
      signature
    });
    return response.data;
  },

  // Get transaction history/audit log
  async getTransactionHistory(id) {
    const response = await api.get(`/transactions/${id}/history`);
    return response.data;
  }
};

export const userService = {
  // Get user profile
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Change password
  async changePassword(data) {
    const response = await api.put('/users/change-password', data);
    return response.data;
  }
};

export const notificationService = {
  // Get user notifications
  async getNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Mark notification as read
  async markAsRead(id) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  }
};
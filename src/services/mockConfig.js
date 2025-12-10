// Mock API configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiConfig = {
  baseURL: BASE_URL,
  endpoints: {
    users: '/users',
    transactions: '/transactions',
    workflow: '/workflow',
    signatures: '/signatures',
    comments: '/comments',
    notifications: '/notifications'
  }
};

// Helper function to add query parameters
export const addQueryParams = (url, params) => {
  const queryParams = new URLSearchParams(params).toString();
  return queryParams ? `${url}?${queryParams}` : url;
};

// Response interceptor to simulate network delay
export const addResponseDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Error simulation (uncomment to test error scenarios)
export const simulateError = (probability = 0.1) => {
  if (Math.random() < probability) {
    throw new Error('Simulated API error');
  }
};
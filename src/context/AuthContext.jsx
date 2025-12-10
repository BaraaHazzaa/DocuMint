import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate it
    const token = sessionStorage.getItem('token');
    if (token) {
      // Validate token expiration safely
      try {
        const parts = token.split('.');
        let tokenData = null;

        if (parts.length === 3) {
          // JWT style token
          // payload may be URL-safe base64, normalize it
          const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          tokenData = JSON.parse(atob(payload));
        } else {
          // Fallback: token might be a plain base64-encoded JSON (older mock)
          try {
            tokenData = JSON.parse(atob(token));
          } catch (e) {
            throw new Error('Invalid token format');
          }
        }

        const expirationTime = tokenData?.exp ? tokenData.exp * 1000 : null;
        if (expirationTime && Date.now() >= expirationTime) {
          // Token expired
          logout();
          return;
        }

        // Get user data from session storage
        const userData = JSON.parse(sessionStorage.getItem('user'));
        if (userData) {
          // Sanitize user data before setting
          const sanitizedUser = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            name: userData.name
          };
          setUser(sanitizedUser);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Mock users for testing
  const MOCK_USERS = [
    {
      email: 'manager@documint.com',
      password: 'password123',
      userData: {
        id: '1',
        email: 'manager@documint.com',
        role: 'manager',
        name: 'مدير النظام'
      }
    },
    {
      email: 'director@documint.com',
      password: 'password123',
      userData: {
        id: '2',
        email: 'director@documint.com',
        role: 'director',
        name: 'المدير العام'
      }
    }
  ];

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user
      const mockUser = MOCK_USERS.find(user => 
        user.email === email && user.password === password
      );

      if (!mockUser) {
        throw new Error('Invalid credentials');
      }

      // Create a lightweight JWT-like token: header.payload.signature (all base64)
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: mockUser.userData.id,
        email: mockUser.userData.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
      }));
      const signature = btoa('signature');
      const mockToken = `${header}.${payload}.${signature}`;

      // Store in sessionStorage
      sessionStorage.setItem('token', mockToken);
      sessionStorage.setItem('user', JSON.stringify(mockUser.userData));

      setUser(mockUser.userData);
      return { token: mockToken, user: mockUser.userData };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    // Clear all session data
    sessionStorage.clear();
    setUser(null);
    
    // Invalidate token on server (to be implemented)
    try {
      // api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
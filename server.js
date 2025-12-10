import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(join(__dirname, 'public')));

// Simulate delay
app.use((req, res, next) => {
  setTimeout(() => next(), 800);
});

// Custom routes
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token: 'mock-jwt-token-' + user.id
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

server.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer mock-jwt-token-')) {
    const userId = authHeader.split('-')[3];
    const user = router.db.get('users').find({ id: parseInt(userId) }).value();
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: 'User not found' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Use router
server.use(router);

const port = 3001;
server.listen(port, () => {
  console.log(`Mock API Server is running on http://localhost:${port}`);
});
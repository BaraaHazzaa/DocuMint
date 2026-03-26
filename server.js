/* eslint-env node */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

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

// Custom simple auth routes that read the mock DB (safe for dev only)
app.post('/auth/login', (req, res) => {
  const { email, password: inputPassword } = req.body;
  try {
    const dbPath = join(__dirname, 'mock', 'db.json');
    const dbRaw = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(dbRaw);
    const users = db.users || [];

    const user = users.find(u => u.email === email && (u.password ? u.password === inputPassword : true));

    if (user) {
      const { password: _password, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword, token: `mock-jwt-token-${user.id}` });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer mock-jwt-token-')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = authHeader.replace('Bearer mock-jwt-token-', '').trim();
  try {
    const dbPath = join(__dirname, 'mock', 'db.json');
    const dbRaw = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(dbRaw);
    const users = db.users || [];
    const user = users.find(u => String(u.id) === String(userId));

  if (!user) return res.status(401).json({ message: 'User not found' });
  const { password: _password, ...userWithoutPassword } = user;
  return res.json(userWithoutPassword);
  } catch (err) {
    console.error('Auth me error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with pagination and search
app.get('/users', (req, res) => {
  try {
    const dbPath = join(__dirname, 'mock', 'db.json');
    const dbRaw = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(dbRaw);
    let users = db.users || [];

    const { page = 0, pageSize = 10, search = '' } = req.query;
    const pageNumber = parseInt(page, 10);
    const size = parseInt(pageSize, 10);
    const searchQuery = search.toLowerCase();

    if (searchQuery) {
      users = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery)
      );
    }

    const total = users.length;
    const paginatedUsers = users.slice(pageNumber * size, (pageNumber + 1) * size);

    // Omit password from all users
    const safeUsers = paginatedUsers.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    res.json({ data: safeUsers, total });
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
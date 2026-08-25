import { Router } from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import config from '../config/config.js';

const router = Router();

interface MemoryUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

const memoryUsers = new Map<string, MemoryUser>();

const isMongoReady = () => mongoose.connection.readyState === 1;

const findUserByEmailOrUsername = async (email: string, username: string) => {
  if (!isMongoReady()) {
    return Array.from(memoryUsers.values()).find((user) => user.email === email || user.username === username) || null;
  }

  return User.findOne({ $or: [{ email }, { username }] });
};

const createMemoryUser = async (username: string, email: string, password: string): Promise<MemoryUser> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: MemoryUser = {
    id: `memory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  memoryUsers.set(user.id, user);
  return user;
};

const findMemoryUserByEmail = async (email: string) => {
  return Array.from(memoryUsers.values()).find((user) => user.email === email) || null;
};

const compareMemoryPassword = async (candidatePassword: string, hashedPassword: string) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

// Interface for JWT payload
interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

// Extend Express Request to include user
export interface AuthRequest extends Request {
  userId?: string;
}

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmailOrUsername(email, username);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    let user;

    if (isMongoReady()) {
      user = await User.create({
        username,
        email,
        password,
      });
    } else {
      user = await createMemoryUser(username, email, password);
    }

    // Generate JWT token
    const userId = (user as any)._id?.toString?.() || user.id;
    const token = jwt.sign(
      { userId },
      config.JWT_SECRET as jwt.Secret,
      { expiresIn: config.JWT_EXPIRE } as jwt.SignOptions
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user',
    });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    let user: any = null;

    if (isMongoReady()) {
      user = await User.findOne({ email }).select('+password');
    } else {
      user = await findMemoryUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = isMongoReady()
      ? await user.comparePassword(password)
      : await compareMemoryPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET as jwt.Secret,
      { expiresIn: config.JWT_EXPIRE } as jwt.SignOptions
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in',
    });
  }
});

// Logout route (frontend will handle token removal)
router.post('/logout', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.',
  });
});

// Verify token route
router.get('/verify', (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      userId: decoded.userId,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
});

export default router;

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken } from '../config/jwt';

interface LoginRequestBody {
  email: string;
  password: string;
}

export const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken({ 
      userId: user._id,
      email: user.email,
      username: user.username
    });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request<{}, {}, { username: string; email: string; password: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken({
      userId: user._id,
      email: user.email,
      username: user.username
    });

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

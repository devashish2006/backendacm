import jwt, { Algorithm } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  options: {
    expiresIn: '24h',
    algorithm: 'HS256' as Algorithm,
    issuer: 'your-app-name',
    audience: 'your-app-name',
  }
};

export const generateToken = (payload: Record<string, any>): string => {
  return jwt.sign(payload, JWT_CONFIG.secret, JWT_CONFIG.options);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_CONFIG.secret, JWT_CONFIG.options);
};

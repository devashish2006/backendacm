import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required' });
    }

    try {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

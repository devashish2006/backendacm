import { Router, Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../controllers/userController';

const router = Router();

router.post('/register', (req: Request<{}, {}, { username: string; email: string; password: string }>, res: Response, next: NextFunction) => {
  registerUser(req, res, next);
});

router.post('/login', (req: Request<{}, {}, { email: string; password: string }>, res: Response, next: NextFunction) => {
  loginUser(req, res, next);
});

export { router as userRoutes };

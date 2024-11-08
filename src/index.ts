import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { connectToDatabase } from './config/database';
import { eventRoutes } from './routes/eventRoutes';
import { userRoutes } from './routes/userRoutes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(cors());
app.use(json());

// Route setup
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Database connection and server start
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

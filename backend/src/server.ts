import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import experienceRoutes from './routes/experiences';
import bookingRoutes from './routes/bookings';
import promoRoutes from './routes/promo';
import seedRoutes from './routes/seed';





dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Add this line with other routes
app.use('/api/seed', seedRoutes);


// Connect to MongoDB
connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BookIt API is running' });
});

app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api/health`);
});

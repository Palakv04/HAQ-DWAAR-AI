import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import aiMitraRoutes from './routes/aiMitraRoutes.js';
import readinessRoutes from './routes/readinessRoutes.js';
import actionPlanRoutes from './routes/actionPlanRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import claimRoutes from './routes/claimRoutes.js';

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'HaqDwaar AI API Gateway',
    timestamp: new Date().toISOString(),
    geminiActive: !!process.env.GEMINI_API_KEY,
    database: 'MongoDB Connected',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai-mitra', aiMitraRoutes);
app.use('/api/readiness', readinessRoutes);
app.use('/api/action-plan', actionPlanRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/claims', claimRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[HaqDwaar AI Server] Listening on http://localhost:${PORT}`);
});

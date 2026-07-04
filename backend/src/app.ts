import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

import authRoutes from './routes/auth.routes';
import complaintRoutes from './routes/complaint.routes';
import geminiRoutes from './routes/gemini.routes';
import healthRoutes from './routes/health.routes';
import analysisRoutes from './routes/analysis.routes';
import dashboardRoutes from './routes/dashboard.routes';
import analyticsRoutes from './routes/analytics.routes';
import aiRoutes from './routes/ai.routes';
import activityRoutes from './routes/activity.routes';
import reportsRoutes from './routes/reports.routes';
import heatmapRoutes from './routes/heatmap.routes';
import { errorHandler } from './middlewares/error';


const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Logging Middleware
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/heatmap', heatmapRoutes);


// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Nxt2Echo API' });
});

// Global Error Handler
app.use(errorHandler);

export default app;


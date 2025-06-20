import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import clientRoutes from './routes/client.routes';
import processRoutes from './routes/process.routes';
import taskRoutes from './routes/task.routes';
import tagRoutes from './routes/tag.routes';
import reportRoutes from './routes/report.routes';
import documentRoutes from './routes/document.routes';
import activityRoutes from './routes/activity.routes';
import expenseRoutes from './routes/expense.routes';
import timesheetRoutes from './routes/timesheet.routes';
import { createAdminUser } from './controllers/authController';
import path from 'path';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/timesheet', timesheetRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Criar usuário admin ao iniciar o servidor
createAdminUser().catch(console.error);

const PORT = process.env.BACKEND_PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 
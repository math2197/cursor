import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import clientRoutes from './routes/client.routes';
import processRoutes from './routes/process.routes';
import taskRoutes from './routes/task.routes';
import tagRoutes from './routes/tag.routes';
import reportRoutes from './routes/report.routes';

// Importação das rotas
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/reports', reportRoutes);

// Rota de teste
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 
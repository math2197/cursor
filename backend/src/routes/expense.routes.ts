import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

let expenses = [
  { id: '1', description: 'Protocolo', value: 100, processId: '1' },
  { id: '2', description: 'Cópia', value: 50, processId: '1' },
];

router.get('/', (_req, res) => res.json(expenses));
router.post('/', (req, res) => {
  const { description, value, processId } = req.body;
  const newExpense = { id: String(Date.now()), description, value, processId };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { description, value } = req.body;
  expenses = expenses.map(e => e.id === id ? { ...e, description, value } : e);
  res.json(expenses.find(e => e.id === id));
});
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  expenses = expenses.filter(e => e.id !== id);
  res.status(204).send();
});

export default router; 
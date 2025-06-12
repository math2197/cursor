import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

let activities = [
  { id: '1', title: 'Audiência', date: '2024-06-01', processId: '1' },
  { id: '2', title: 'Despacho', date: '2024-06-02', processId: '1' },
];

router.get('/', (_req, res) => res.json(activities));
router.post('/', (req, res) => {
  const { title, date, processId } = req.body;
  const newActivity = { id: String(Date.now()), title, date, processId };
  activities.push(newActivity);
  res.status(201).json(newActivity);
});
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, date } = req.body;
  activities = activities.map(a => a.id === id ? { ...a, title, date } : a);
  res.json(activities.find(a => a.id === id));
});
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  activities = activities.filter(a => a.id !== id);
  res.status(204).send();
});

export default router; 
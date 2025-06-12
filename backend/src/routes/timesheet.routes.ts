import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

let timesheets = [
  { id: '1', description: 'Reunião', hours: 2, processId: '1' },
  { id: '2', description: 'Estudo de caso', hours: 3, processId: '1' },
];

router.get('/', (req, res) => res.json(timesheets));
router.post('/', (req, res) => {
  const { description, hours, processId } = req.body;
  const newTimesheet = { id: String(Date.now()), description, hours, processId };
  timesheets.push(newTimesheet);
  res.status(201).json(newTimesheet);
});
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { description, hours } = req.body;
  timesheets = timesheets.map(t => t.id === id ? { ...t, description, hours } : t);
  res.json(timesheets.find(t => t.id === id));
});
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  timesheets = timesheets.filter(t => t.id !== id);
  res.status(204).send();
});

export default router; 
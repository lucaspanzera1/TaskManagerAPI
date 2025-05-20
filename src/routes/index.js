import express from 'express';
import * as TarefaController from '../controllers/tarefaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas de tarefas protegidas
router.get('/tarefas', authMiddleware, TarefaController.getAllTarefas);
router.get('/tarefas/:id', authMiddleware, TarefaController.getTarefaById);
router.post('/tarefas', authMiddleware, TarefaController.createTarefa);
router.put('/tarefas/:id', authMiddleware, TarefaController.updateTarefa);
router.delete('/tarefas/:id', authMiddleware, TarefaController.deleteTarefa);

export default router;

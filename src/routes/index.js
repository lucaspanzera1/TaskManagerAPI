import express from 'express';
import * as TarefaController from '../controllers/tarefaController.js';

const router = express.Router();

// Rotas de tarefas
router.get('/tarefas', TarefaController.getAllTarefas);
router.get('/tarefas/:id', TarefaController.getTarefaById);
router.post('/tarefas', TarefaController.createTarefa);
router.put('/tarefas/:id', TarefaController.updateTarefa);
router.delete('/tarefas/:id', TarefaController.deleteTarefa);

export default router;
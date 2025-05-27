import express from 'express';
import * as TarefaController from '../controllers/tarefaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getComando } from '../arduino/comando.js';

const router = express.Router();

// Rotas de tarefas protegidas
router.get('/tarefas', authMiddleware, TarefaController.getAllTarefas);
router.get('/tarefas/:id', authMiddleware, TarefaController.getTarefaById);
router.post('/tarefas', authMiddleware, TarefaController.createTarefa);
router.put('/tarefas/:id', authMiddleware, TarefaController.updateTarefa);
router.delete('/tarefas/:id', authMiddleware, TarefaController.deleteTarefa);

let ultimoComando = null;

router.get('/arduino/comando', (req, res) => {
  const comando = getComando();
  res.json({ comando });
});


export default router;

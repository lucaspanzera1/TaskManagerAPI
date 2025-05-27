import express from 'express';
import * as TarefaController from '../controllers/tarefaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { enviarComandoArduino } from '../arduino/arduinoController.js';

const router = express.Router();

// Rotas de tarefas protegidas
router.get('/tarefas', authMiddleware, TarefaController.getAllTarefas);
router.get('/tarefas/:id', authMiddleware, TarefaController.getTarefaById);
router.post('/tarefas', authMiddleware, TarefaController.createTarefa);
router.put('/tarefas/:id', authMiddleware, TarefaController.updateTarefa);
router.delete('/tarefas/:id', authMiddleware, TarefaController.deleteTarefa);

router.post('/arduino/efeito', (req, res) => {
  const { ligar } = req.body;

  if (typeof ligar !== 'boolean') {
    return res.status(400).json({ error: 'Campo "ligar" deve ser booleano.' });
  }

  const comando = ligar ? 'start_effect' : 'stop_effect';
  enviarComandoArduino(comando);

  res.json({ status: `Efeito ${ligar ? 'iniciado' : 'parado'}` });
});

export default router;

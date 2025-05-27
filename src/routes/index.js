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

let ultimoComando = null;

router.post('/arduino/comando', (req, res) => {
  const { comando } = req.body;
  if (!comando) return res.status(400).json({ error: 'Comando obrigatório.' });

  ultimoComando = comando;
  console.log('Comando recebido para o Arduino:', comando);
  res.json({ status: 'Comando registrado.' });
});

router.get('/arduino/comando', (req, res) => {
  res.json({ comando: ultimoComando });
  ultimoComando = null; // limpa após envio
});


export default router;

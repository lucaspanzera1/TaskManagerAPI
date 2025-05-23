import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/index.js';
import authRoutes from './routes/auth.js';

// Configurações iniciais
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Corrigir "__dirname" em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.use('/api', routes);
app.use('/api', authRoutes);

// Rota base da API
app.get('/api', (req, res) => {
  res.json({
    message: 'API de Gerenciamento de Tarefas',
    versao: '1.0.0',
    status: 'online'
  });
});

// Fallback: redirecionar qualquer rota não API para o frontend (SPA friendly)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

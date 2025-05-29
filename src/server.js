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
app.use(express.static(path.join(__dirname, '../frontend'), { index: false }));


// Rotas da API
app.use('/api', routes);
app.use('/api', authRoutes);

// Rota base da API
app.get('/api', (req, res) => {
  res.json({
    message: 'API TaskManager',
    versao: 'Beta',
    status: 'online'
  });
});

// Rota da documentação pública
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/docs.html'));
});

// Página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/auth.html'));
});

// Página principal do app
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});



// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

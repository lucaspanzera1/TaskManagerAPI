import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import authRoutes from './routes/auth.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota base da API
app.use('/api', routes);
// Habilitar CORS
app.use('/api', authRoutes);
app.use(cors());

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Gerenciamento de Tarefas',
    versao: '1.0.0',
    status: 'online'
  });
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
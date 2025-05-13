# API de Gerenciamento de Tarefas

API RESTful para gerenciamento de tarefas construída com Node.js e Supabase.

## Tecnologias

- Node.js
- Express
- Supabase (Banco de dados PostgreSQL)
- Joi (Validação)
- Dotenv (Variáveis de ambiente)

## Configuração

### 1. Clone o repositório

```bash
git clone https://seu-repositorio/tarefas-api.git
cd tarefas-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie uma conta no [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. No SQL Editor, crie a tabela `tarefas` com o seguinte SQL:

```sql
CREATE TABLE tarefas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  prioridade TEXT NOT NULL DEFAULT 'media',
  data_vencimento DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Adicione alguns índices para melhorar a performance
CREATE INDEX idx_tarefas_status ON tarefas(status);
CREATE INDEX idx_tarefas_prioridade ON tarefas(prioridade);
CREATE INDEX idx_tarefas_data_vencimento ON tarefas(data_vencimento);
```

4. Copie a URL e a Chave da API do seu projeto Supabase

### 4. Configure as Variáveis de Ambiente

Renomeie o arquivo `.env.example` para `.env` e preencha as variáveis:

```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase
PORT=3000
```

### 5. Inicie o servidor

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## Testando a API com Postman

### Configuração do Postman

1. Baixe e instale o [Postman](https://www.postman.com/downloads/)
2. Crie uma nova coleção (Collection) para organizar suas requisições
3. Adicione as requisições abaixo para testar cada funcionalidade da API

### Requisições para Teste

#### 1. Verificar Status da API
- **Método**: GET
- **URL**: `http://localhost:3000/`
- **Descrição**: Verifica se a API está online
- **Resposta esperada**:
  ```json
  {
    "message": "API de Gerenciamento de Tarefas",
    "versao": "1.0.0",
    "status": "online"
  }
  ```

#### 2. Listar Todas as Tarefas
- **Método**: GET
- **URL**: `http://localhost:3000/api/tarefas`
- **Descrição**: Retorna todas as tarefas cadastradas
- **Parâmetros opcionais**:
  - `status` (query): Filtrar por status (pendente, em_andamento, concluida)
  - Exemplo: `http://localhost:3000/api/tarefas?status=pendente`

#### 3. Obter Tarefa por ID
- **Método**: GET
- **URL**: `http://localhost:3000/api/tarefas/{id}`
- **Descrição**: Retorna uma tarefa específica pelo ID
- **Exemplo**: `http://localhost:3000/api/tarefas/550e8400-e29b-41d4-a716-446655440000`

#### 4. Criar Nova Tarefa
- **Método**: POST
- **URL**: `http://localhost:3000/api/tarefas`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "titulo": "Comprar mantimentos",
    "descricao": "Ir ao supermercado e comprar itens da lista",
    "status": "pendente",
    "prioridade": "alta",
    "data_vencimento": "2023-12-31"
  }
  ```
- **Resposta esperada** (status 201):
  ```json
  {
    "success": true,
    "message": "Tarefa criada com sucesso",
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "titulo": "Comprar mantimentos",
      "descricao": "Ir ao supermercado e comprar itens da lista",
      "status": "pendente",
      "prioridade": "alta",
      "data_vencimento": "2023-12-31",
      "created_at": "2023-05-12T12:00:00.000Z"
    }
  }
  ```

#### 5. Atualizar Tarefa Existente
- **Método**: PUT
- **URL**: `http://localhost:3000/api/tarefas/{id}`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "titulo": "Comprar mantimentos - atualizado",
    "descricao": "Ir ao supermercado e comprar itens atualizados da lista",
    "status": "em_andamento",
    "prioridade": "media",
    "data_vencimento": "2023-12-31"
  }
  ```
- **Resposta esperada** (status 200):
  ```json
  {
    "success": true,
    "message": "Tarefa atualizada com sucesso",
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "titulo": "Comprar mantimentos - atualizado",
      "descricao": "Ir ao supermercado e comprar itens atualizados da lista",
      "status": "em_andamento",
      "prioridade": "media",
      "data_vencimento": "2023-12-31",
      "created_at": "2023-05-12T12:00:00.000Z",
      "updated_at": "2023-05-12T14:30:00.000Z"
    }
  }
  ```

#### 6. Excluir Tarefa
- **Método**: DELETE
- **URL**: `http://localhost:3000/api/tarefas/{id}`
- **Descrição**: Remove uma tarefa específica pelo ID
- **Resposta esperada** (status 200):
  ```json
  {
    "success": true,
    "message": "Tarefa excluída com sucesso"
  }
  ```

### Fluxo de Teste Completo

1. Inicie o servidor com `npm run dev`
2. Execute a requisição #1 para verificar se a API está online
3. Execute a requisição #4 para criar uma nova tarefa (guarde o ID retornado)
4. Execute a requisição #2 para listar todas as tarefas e confirmar que sua tarefa foi criada
5. Execute a requisição #3 com o ID da tarefa criada para obter detalhes específicos
6. Execute a requisição #5 com o ID da tarefa para atualizá-la
7. Execute novamente a requisição #3 para verificar se as atualizações foram aplicadas
8. Execute a requisição #6 para excluir a tarefa
9. Execute a requisição #2 para confirmar que a tarefa foi removida

## Estrutura do Projeto

```
.
├── src/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   └── tarefaController.js
│   ├── models/
│   │   └── tarefaModel.js
│   ├── routes/
│   │   └── index.js
│   ├── validations/
│   │   └── tarefaValidation.js
│   └── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

## Licença

MIT
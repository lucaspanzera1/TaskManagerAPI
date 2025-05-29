import * as TarefaModel from '../models/tarefaModel.js';
import { tarefaSchema } from '../validations/tarefaValidation.js';

export async function getAllTarefas(req, res) {
  try {
    const status = req.query.status;
    const userId = req.user.id;
    let tarefas;

    if (status) {
      tarefas = await TarefaModel.getTarefasByStatusAndUser(status, userId);
    } else {
      tarefas = await TarefaModel.getAllTarefasByUser(userId);
    }

    return res.status(200).json({ success: true, data: tarefas });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return res.status(500).json({ success: false, message: 'Erro ao buscar tarefas', error: error.message });
  }
}

export async function getTarefaById(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const tarefa = await TarefaModel.getTarefaById(id, userId);

    if (!tarefa) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      data: tarefa
    });
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar tarefa',
      error: error.message
    });
  }
}

export async function createTarefa(req, res) {
  try {
    const { value, error } = tarefaSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors });
    }

    const novaTarefa = {
      ...value,
      user_id: req.user.id,
      created_at: new Date().toISOString()
    };

    const tarefa = await TarefaModel.createTarefa(novaTarefa);

    return res.status(201).json({
      success: true,
      message: 'Tarefa criada com sucesso',
      data: tarefa
    });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar tarefa',
      error: error.message
    });
  }
}

export async function updateTarefa(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const tarefaExistente = await TarefaModel.getTarefaById(id, userId);

    if (!tarefaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    const { value, error } = tarefaSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors
      });
    }

    const dadosAtualizados = {
      ...value,
      updated_at: new Date().toISOString()
    };

    const tarefaAtualizada = await TarefaModel.updateTarefa(id, dadosAtualizados);

    return res.status(200).json({
      success: true,
      message: 'Tarefa atualizada com sucesso',
      data: tarefaAtualizada
    });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar tarefa',
      error: error.message
    });
  }
}

export async function deleteTarefa(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const tarefaExistente = await TarefaModel.getTarefaById(id, userId);

    if (!tarefaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    await TarefaModel.deleteTarefa(id);

    return res.status(200).json({
      success: true,
      message: 'Tarefa excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir tarefa',
      error: error.message
    });
  }
}

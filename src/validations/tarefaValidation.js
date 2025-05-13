import Joi from 'joi';

export const tarefaSchema = Joi.object({
  titulo: Joi.string().required().min(3).max(100).messages({
    'string.base': 'O título deve ser um texto',
    'string.empty': 'O título é obrigatório',
    'string.min': 'O título deve ter pelo menos {#limit} caracteres',
    'string.max': 'O título deve ter no máximo {#limit} caracteres',
    'any.required': 'O título é obrigatório'
  }),
  
  descricao: Joi.string().allow('').max(500).messages({
    'string.base': 'A descrição deve ser um texto',
    'string.max': 'A descrição deve ter no máximo {#limit} caracteres'
  }),
  
  status: Joi.string().valid('pendente', 'em_andamento', 'concluida').default('pendente').messages({
    'string.base': 'O status deve ser um texto',
    'any.only': 'O status deve ser pendente, em_andamento ou concluida'
  }),
  
  prioridade: Joi.string().valid('baixa', 'media', 'alta').default('media').messages({
    'string.base': 'A prioridade deve ser um texto',
    'any.only': 'A prioridade deve ser baixa, media ou alta'
  }),
  
  data_vencimento: Joi.date().iso().allow(null).messages({
    'date.base': 'A data de vencimento deve ser uma data válida',
    'date.format': 'A data de vencimento deve estar no formato ISO (YYYY-MM-DD)'
  })
});
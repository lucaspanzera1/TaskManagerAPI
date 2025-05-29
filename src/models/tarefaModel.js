import supabase from '../config/supabase.js';

const TABLE_NAME = 'tarefas';

export async function getAllTarefasByUser(userId) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTarefaById(id, userId) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createTarefa(tarefa) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([tarefa])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateTarefa(id, tarefa) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(tarefa)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteTarefa(id) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getTarefasByStatusAndUser(status, userId) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('status', status)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

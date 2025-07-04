import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { setComando } from '../arduino/comando.js';


dotenv.config();

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  // 1. Cria o usuário
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) return res.status(400).json({ error: error.message });

  const user = data.user;

  // 2. Cria o profile com username
  const { error: profileError } = await supabase.from('profiles').insert({
  id: user.id,
  username,
  email
});

  if (profileError) return res.status(400).json({ error: profileError.message });

  res.status(201).json({ message: 'Usuário criado com sucesso' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    return res.status(400).json({ error: 'Usuário não encontrado' });
  }

  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password
  });

  if (loginError) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // ✅ Envia comando para Arduino
  setComando('on');

  res.json({
    token: loginData.session.access_token,
    user: loginData.user
  });
});



export default router;


// middlewares/authMiddleware.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token ausente' });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) return res.status(401).json({ error: 'Token inválido' });

  req.user = data.user;
  next();
}


import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Usuário de exemplo (você pode usar o Supabase depois)
const fakeUser = {
  id: 1,
  username: 'admin',
  password: '$2b$10$XHFQA2tpO59WRosvxz1XA.gPDK5VRDKpS79OS5ITRSLksWXISZNMi'
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== fakeUser.username || !(await bcrypt.compare(password, fakeUser.password))) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: fakeUser.id, username: fakeUser.username }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  res.json({ token });
});

export default router;


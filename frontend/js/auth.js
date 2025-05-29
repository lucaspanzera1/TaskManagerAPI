// Configuração da API
const baseUrl = window.location.origin.includes('localhost')
  ? 'http://localhost:3000/api'
  : 'https://taskmanagerapi-production-ad12.up.railway.app/api';

const API_URL = `${baseUrl}`;

document.getElementById('login-tab').addEventListener('click', () => switchTab('login'));
document.getElementById('register-tab').addEventListener('click', () => switchTab('register'));

function switchTab(tab) {
  document.getElementById('login-tab').classList.toggle('active', tab === 'login');
  document.getElementById('register-tab').classList.toggle('active', tab === 'register');
  document.getElementById('login-content').classList.toggle('active', tab === 'login');
  document.getElementById('register-content').classList.toggle('active', tab === 'register');
}

// REGISTRO
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Registro bem-sucedido! Agora faça login.');
    switchTab('login');
  } else {
    alert(data.error || 'Erro ao registrar');
  }
});

// LOGIN
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = '/app';
  } else {
    alert(data.error || 'Erro ao fazer login');
  }
});

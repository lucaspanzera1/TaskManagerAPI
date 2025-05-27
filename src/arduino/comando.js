let ultimoComando = null;

export function setComando(comando) {
  ultimoComando = comando;
}

export function getComando() {
  const comando = ultimoComando;
  ultimoComando = null; // Limpa após pegar
  return comando;
}

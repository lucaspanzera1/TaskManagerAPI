import { SerialPort } from 'serialport';

const port = new SerialPort({
  path: '/dev/tty.usbmodemFD1201', // Substitua por sua porta serial. Ex: COM4, /dev/ttyUSB0...
  baudRate: 9600,
  autoOpen: true
});

port.on('open', () => {
  console.log('Conexão com o Arduino aberta!');
});

port.on('error', (err) => {
  console.error('Erro na comunicação com o Arduino:', err.message);
});

export function enviarComandoArduino(comando) {
  const mensagem = `${comando}\n`; // <- isso é essencial!

  port.write(mensagem, (err) => {
    if (err) {
      console.error('Erro ao enviar comando:', err.message);
    } else {
      console.log(`Comando "${comando}" enviado ao Arduino.`);
    }
  });
}


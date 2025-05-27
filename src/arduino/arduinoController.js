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

export function acionarServo(valor) {
  const comando = valor === 1 ? '1' : '0';
  port.write(comando, (err) => {
    if (err) {
      return console.error('Erro ao enviar comando:', err.message);
    }
    console.log(`Comando "${comando}" enviado para o Arduino.`);
  });


}

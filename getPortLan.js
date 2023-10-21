const path = require('path');
const net = require('net');
const fs = require('fs');
const os = require('os');

function checkPort(port, timeout) {
  const client = new net.Socket();

  client.setTimeout(timeout);
  client.on('timeout', () => {
    client.destroy();
    console.log(`A porta ${port} não está respondendo.`);
  });

  client.on('connect', () => {
    console.log(`A porta ${port} está aberta e respondendo.`);
    client.destroy();
    return true;
  });

  client.on('error', (err) => {
    console.error(`Erro ao tentar se conectar à porta ${port}: ${err.message}`);
    client.destroy();
    return false;
  });
  client.connect(port, 'localhost');
}

const filePath = path.join(os.homedir(), 'AppData\\Roaming\\.minecraft\\logs\\latest.log');
const regex = /\[System\] \[CHAT\] Local game hosted on port \[(\d+)\]/;

let lastPort = null;

fs.watchFile(filePath, (event, stats) => {
  if (stats) {
    console.log(`O arquivo foi alterado.`);

    const fileStream = fs.createReadStream(filePath);
    let buffer = '';

    fileStream.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        const match = line.match(regex);
        if (match) {
          lastPort = match[1];
        }
      }
    });

    fileStream.on('end', () => {
      if (lastPort !== null) {
        console.log(`Última porta encontrada: ${lastPort}`);
        const checkPort = checkPort(lastPort, 100);
        checkPort ? console.warn('COMPARTILHAR COM O SERVIDOR') : null;
      } else {
        console.log('Nenhuma porta encontrada no arquivo.');
      }
    });
  } else {
    console.log('O arquivo foi deletado.');
  }
});

console.log(`Observando o arquivo ${filePath} para alterações...`);
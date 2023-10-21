const fs = require('fs');
const os = require('os');
const path = require('path');

const filePath = path.join(os.homedir(), 'AppData\\Roaming\\.minecraft\\logs\\latest.log');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo:', err);
    return;
  }

  const regex = /\[System\] \[CHAT\] Local game hosted on port \[(\d+)\]/g;
  let match;
  let lastMatch = null;

  while ((match = regex.exec(data)) !== null) {
    lastMatch = match;
  }

  if (lastMatch) {
    const porta = lastMatch[1];
    console.log(`Porta do jogo local: ${porta}`);
  } else {
    console.log('A string não foi encontrada no arquivo.');
  }
});
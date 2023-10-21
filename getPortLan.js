const path = require('path');
const fs = require('fs');
const os = require('os');

const filePath = path.join(os.homedir(), 'AppData\\Roaming\\.minecraft\\logs\\latest.log');

fs.watchFile(filePath, (evento, nomeArquivo) => {
  if (nomeArquivo) {
    console.log(`O arquivo ${nomeArquivo} foi alterado.`);
    
    // Faça o que você precisa fazer quando o arquivo é alterado
  } else {
    console.log('O arquivo foi deletado.');
    
    // Faça o que você precisa fazer quando o arquivo é deletado
  }
});

console.log(`Observando o arquivo ${filePath} para alterações...`);
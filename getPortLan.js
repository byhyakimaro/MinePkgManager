const path = require('path');
const fs = require('fs');
const os = require('os');

const filePath = path.join(os.homedir(), 'AppData\\Roaming\\.minecraft\\logs\\latest.log');

fs.watchFile(filePath, (event, stats) => {
  if (stats) {
    console.log(`O arquivo foi alterado.`);
    
  } else {
    console.log('O arquivo foi deletado.');
  }
});

console.log(`Observando o arquivo ${filePath} para alterações...`);
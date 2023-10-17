const Utils = require('./utils');
const path = require('path');
const fs = require('fs');
const os = require('os');

class Bootstrap {
  constructor() {
    this.utils = new Utils();
  };

  initManifest() {
    if (process.argv.includes('--help') || process.argv.includes('-h')) return console.log(`
    Usage: PackManager [options]

    Description of your script here.
    
    Options:
      -h, --help                  Show this help message
      -v, --version               Show version information
      --dir "<directory>"         Specify the working directory
      --file "<directory/file>"   Specify the program file directory
      --inst "<directory>"        Select the working instance directory    
    `);

    if (process.argv.includes('--versions') || process.argv.includes('-v')) return console.log('HHUB MinePkgManager - v1.0.1');

    const dirPackage = process.argv.includes('--dir')
      ? process.argv[process.argv.indexOf('--dir') + 1]
      : path.join(os.homedir(), '\\AppData\\Roaming\\HHUB\\Minecraft\\bin');

    const dirProgram = process.argv.includes('--file')
      ? process.argv[process.argv.indexOf('--file') + 1]
      : path.join(os.homedir(), '\\AppData\\Roaming\\HHUB\\Minecraft\\bin\\minecraft.exe');

    const dirIns = process.argv.includes('--inst')
      ? process.argv[process.argv.indexOf('--inst') + 1] : null;

    const fileManifest = path.join(dirPackage, `\\modules\\manifest.json`);

    if (!process.argv.includes('--dir') && !process.argv.includes('--inst')
      && fs.existsSync(fileManifest)) {
      console.log('the version this manifest file exist.');
      return JSON.parse(fs.readFileSync(fileManifest, 'utf8'));
    }

    const manifestObj = {
      "config": {
        "urlProgramAPI": 'https://horizonshubapi.knws.repl.co/public/v1/minecraft/version/',
        "directoryInstance": dirIns,
        "directoryProgram": dirProgram,
        "directoryPackage": dirPackage,
        "memoryAllocInstance": "-Xmx4096m -Xms256m"
      },
      "manifestType": "MinecraftModPack",
      "manifestVersion": 1
    };
    fs.writeFileSync(fileManifest, JSON.stringify(manifestObj));
    
    return manifestObj;
  };
}
module.exports = Bootstrap;
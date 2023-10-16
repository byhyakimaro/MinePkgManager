const Utils = require('./libs/utils');
const Bootstrap = require('./libs/bootstrap');
const path = require('path');
const fs = require('fs');
const os = require('os');

class ManagerPkgsMinecraft {
  constructor(manifest) {
    this.manifest = manifest;
    this.Utils = new Utils();
  };

  async getFilesCurseApi(manifestInstance) {
    const versionsManifest = Utils
    // this.Utils._downloadFile()
  };

  saveProfileInstance() {
    // pathProfileDefault.profiles[listModsCursed.name] = {
    //   "created": new Date().toISOString(),
    //   "javaArgs": "-Xmx4096m -Xms256m -Dfml.ignorePatchDiscrepancies=true -Dfml.ignoreInvalidMinecraftCertificates=true",
    //   "gameDir" : "C:\\Users\\avara\\AppData\\Roaming\\HHUB\\Minecraft\\instances\\"+listModsCursed.name,
    //   "lastUsed": "2023-10-15T19:45:49.8388535Z",
    //   "lastVersionId": listModsCursed.minecraft.modLoaders[0].id,
    //   "name": listModsCursed.name,
    //   "resolution": {
    //     "height": 768,
    //     "width": 1024
    //   },
    //   "type": "custom"
    // };
  };

  async loadInstance() {
    const { directoryInstance } = this.manifest.config;
    if (!directoryInstance) throw new Error('set directory instance for run.');

    const inkInstManifest = path.join(String(directoryInstance), 'manifest.json');
    const instManifest = JSON.parse(fs.readFileSync(inkInstManifest));
    
    await this.getFilesCurseApi(instManifest);
  };
};

const bootstrap = (new Bootstrap()).getManifest();
const managerPkg = new ManagerPkgsMinecraft(bootstrap);

managerPkg.loadInstance();
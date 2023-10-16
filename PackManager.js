const Utils = require('./libs/utils');
const Bootstrap = require('./libs/bootstrap');
const path = require('path');
const fs = require('fs');
const os = require('os');

class ManagerPkgsMinecraft {
  constructor(manifest) {
    this.manifest = manifest;
    this.utils = new Utils();
  };

  async loadVersionsCurseApi(manifestInstance) {
    const versionInstance = manifestInstance.minecraft.version;
    const { config } = this.manifest;
    
    const urlVersion = path.join(config.urlProgramAPI, versionInstance);
    const inkVersion = await fetch(urlVersion);
    const { jarDownloadUrl, jsonDownloadUrl } = (await inkVersion.json()).data;
    
    const pathVersionInstance = path.join(config.directoryInstance, `overrides\\versions\\${versionInstance}`);
    this.utils._downloadFile(pathVersionInstance, jarDownloadUrl, versionInstance);
    this.utils._downloadFile(pathVersionInstance, jsonDownloadUrl, versionInstance);
    
    const versionModInstance = manifestInstance.minecraft?.modLoaders[0].id;
    const urlModVersion = path.join(config.urlProgramAPI, versionModInstance);
    const inkModVersion = await fetch(urlModVersion);
    const { downloadUrl, versionJson } = (await inkModVersion.json()).data;

    const pathModVersionInstance = path.join(config.directoryInstance, `overrides\\versions\\${versionModInstance}`);
    this.utils._downloadFile(pathModVersionInstance, downloadUrl, versionModInstance);
  };

  saveProfileInstance() {
    // https://horizonshubapi.knws.repl.co/public/v1/minecraft/version/forge-47.2.1
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

    await this.loadVersionsCurseApi(instManifest);
  };
};

const bootstrap = (new Bootstrap()).getManifest();
const managerPkg = new ManagerPkgsMinecraft(bootstrap);

managerPkg.loadInstance();
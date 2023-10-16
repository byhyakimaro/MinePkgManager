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

  async loadVersionsInstanceCurseApi(manifestInstance) {
    const versionInstance = manifestInstance.minecraft.version;
    const { urlProgramAPI, directoryInstance } = this.manifest.config;

    const urlVersion = path.join(urlProgramAPI, versionInstance);
    const inkVersion = await fetch(urlVersion);
    const { jarDownloadUrl, jsonDownloadUrl } = (await inkVersion.json()).data;

    const pathVersionInstance = path.join(directoryInstance, `overrides\\versions\\${versionInstance}`);
    this.utils._downloadFile(pathVersionInstance, jarDownloadUrl, versionInstance);
    this.utils._downloadFile(pathVersionInstance, jsonDownloadUrl, versionInstance);

    try {
      const versionModInstance = manifestInstance.minecraft?.modLoaders[0].id;
      const urlModVersion = path.join(urlProgramAPI, versionModInstance);
      const inkModVersion = await fetch(urlModVersion);
      const { downloadUrl, versionJson } = (await inkModVersion.json()).data;

      const pathModVersionInstance = path.join(directoryInstance, `overrides\\versions\\${versionModInstance}`);
      this.utils._downloadFile(pathModVersionInstance, downloadUrl, versionModInstance);

      fs.writeFileSync(`${pathModVersionInstance}/${versionModInstance}.json`, versionJson);

    } catch (err) { console.log('modLoaders not found in manifest', err); };
  };

  async loadModsInstanceCurseApi(manifestInstance) {
    const { directoryInstance } = this.manifest.config;
    const { files } = manifestInstance;

    const pathEnd = path.join(directoryInstance, '\\overrides\\mods');

    files.forEach(({ fileID }) => {
      const urlDownload = `https://www.curseforge.com/api/v1/mods/864599/files/${fileID}/download`;
      this.utils._downloadFile(pathEnd, urlDownload);
    });
  };

  saveProfileInstanceSync(manifestInstance) {
    const { directoryInstance, memoryAllocInstance } = this.manifest.config;
    const { name } = manifestInstance;

    const versionModInstance = manifestInstance.minecraft?.modLoaders
      ? manifestInstance.minecraft?.modLoaders[0].id : manifestInstance.minecraft.version;

    const inkProfiles = path.join(directoryPackage, 'launcher_profiles_default.json');
    const { profiles } = JSON.parse(fs.readFileSync(inkProfiles));

    profiles[name] = {
      "created": new Date().toISOString(),
      "javaArgs": `${memoryAllocInstance} -Dfml.ignorePatchDiscrepancies=true -Dfml.ignoreInvalidMinecraftCertificates=true`,
      "gameDir": directoryInstance,
      "lastUsed": "2023-10-15T19:45:49.8388535Z",
      "lastVersionId": versionModInstance,
      "name": name,
      "resolution": {
        "height": 768,
        "width": 1024
      },
      "type": "custom"
    };

    console.log(profiles);
  };

  async loadInstance() {
    const { directoryInstance } = this.manifest.config;
    if (!directoryInstance) throw new Error('set directory instance for run.');

    const inkInstManifest = path.join(String(directoryInstance), 'manifest.json');
    if (!fs.existsSync(inkInstManifest)) return console.log('manifest instance not found.');

    const instManifest = JSON.parse(fs.readFileSync(inkInstManifest));

    await this.loadVersionsInstanceCurseApi(instManifest);
    await this.loadModsInstanceCurseApi(instManifest);

    this.saveProfileInstanceSync(instManifest);
  };
};

const bootstrap = (new Bootstrap()).getManifest();
const managerPkg = new ManagerPkgsMinecraft(bootstrap);

managerPkg.loadInstance();
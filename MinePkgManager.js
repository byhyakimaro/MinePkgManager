const Utils = require('./libs/utils');
const Bootstrap = require('./libs/bootstrap');
const { spawn } = require('node:child_process');
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

    const pathVersionInstance = path.join(directoryInstance, `versions\\${versionInstance}`);
    this.utils._downloadFile(pathVersionInstance, jarDownloadUrl, versionInstance);
    this.utils._downloadFile(pathVersionInstance, jsonDownloadUrl, versionInstance);

    const pathInstance = path.join(directoryInstance, `versions`);
    this.utils._downloadFile(pathInstance, 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json');

    try {
      const versionModInstance = manifestInstance.minecraft?.modLoaders[0].id;
      const urlModVersion = path.join(urlProgramAPI, versionModInstance);
      const inkModVersion = await fetch(urlModVersion);
      const { downloadUrl, versionJson } = (await inkModVersion.json()).data;

      const pathModVersionInstance = path.join(directoryInstance, `versions\\${versionModInstance}`);
      // this.utils._downloadFile(pathModVersionInstance, downloadUrl, versionModInstance);
      this.utils._addFolderSync(pathModVersionInstance);
      const formattedVersionJson = JSON.parse(versionJson)
      formattedVersionJson.jar = versionInstance;
      formattedVersionJson.logging = {};

      fs.writeFileSync(`${pathModVersionInstance}/${versionModInstance}.json`, JSON.stringify(formattedVersionJson));

    } catch (err) { console.log('modLoaders not found in manifest', err); };
  };

  async loadModsInstanceCurseApi(manifestInstance) {
    const { directoryInstance } = this.manifest.config;
    const { files } = manifestInstance;

    const pathEnd = path.join(directoryInstance, '\\mods');

    files.forEach(({ fileID }) => {
      const urlDownload = `https://www.curseforge.com/api/v1/mods/864599/files/${fileID}/download`;
      this.utils._downloadFile(pathEnd, urlDownload);
    });
  };

  saveProfileInstanceSync(manifestInstance) {
    const { directoryInstance, directoryPackage, memoryAllocInstance } = this.manifest.config;
    const { name } = manifestInstance;

    const versionModInstance = manifestInstance.minecraft?.modLoaders
      ? manifestInstance.minecraft?.modLoaders[0].id : manifestInstance.minecraft.version;

    const inkProfiles = path.join(directoryPackage, 'launcher_profiles_default.json');
    const pathProfileDefault = JSON.parse(fs.readFileSync(inkProfiles));

    pathProfileDefault.profiles[name] = {
      "created": new Date().toISOString(),
      "javaArgs": `${memoryAllocInstance} -Dminecraft.applet.TargetDirectory=\"${directoryInstance}\" -Dfml.ignorePatchDiscrepancies=true -Dfml.ignoreInvalidMinecraftCertificates=true`,
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
    const fileProfilePath = path.join(directoryInstance, 'launcher_profiles.json')

    fs.writeFileSync(fileProfilePath, JSON.stringify(pathProfileDefault));
  };

  async loadInstance() {
    const { directoryInstance } = this.manifest.config;
    if (!directoryInstance) throw new Error('set directory instance for run.');

    const inkInstManifest = path.join(String(directoryInstance), 'manifest.json');
    if (!fs.existsSync(inkInstManifest)) return console.log('manifest instance not found.');

    const instManifest = JSON.parse(fs.readFileSync(inkInstManifest));
    await this.loadVersionsInstanceCurseApi(instManifest);
    await this.loadModsInstanceCurseApi(instManifest);

    try {
      const overrides = path.join(directoryInstance, 'overrides');
      this.utils._copyFolderSync(overrides, directoryInstance);
      this.utils._deleteFilesRecursivelySync(overrides);
      fs.rmSync(path.join(directoryInstance, 'modlist.html'));
      fs.rmSync(path.join(directoryInstance, 'manifest.json'));
    } catch (err) { }

    this.saveProfileInstanceSync(instManifest);
  };

  async openInstance() {
    await this.loadInstance();
    const { directoryInstance, directoryProgram } = this.manifest.config;

    const pathMinecraft = path.join(os.homedir(), 'AppData\\Roaming\\.minecraft');

    const inkVersion_Minecraft = path.join(pathMinecraft, 'versions');
    const inkProfile_Minecraft = path.join(pathMinecraft, 'launcher_profiles.json');

    const inkProfile_Temp = path.join(os.tmpdir(), 'MinePkg\\launcher_profiles.json');

    const inkVersion_Instance = path.join(directoryInstance, 'versions');
    const inkProfile_Instance = path.join(directoryInstance, 'launcher_profiles.json');

    try{ fs.copyFileSync(inkProfile_Minecraft, inkProfile_Temp); }catch(e){};

    this.utils._copyFolderSync(inkVersion_Instance, inkVersion_Minecraft);
    fs.copyFileSync(inkProfile_Instance, inkProfile_Minecraft);

    const processProgram = spawn(directoryProgram);
    processProgram.on('exit', (code) => {
      try{ fs.copyFileSync(inkProfile_Temp, inkProfile_Minecraft); }catch(e){};
      this.utils._deleteFilesRecursivelySync(path.join(os.tmpdir(), 'MinePkg'));

      console.log(`O programa foi fechado com o código de saída ${code}`);
    });
  }
};

const bootstrap = (new Bootstrap()).initManifest();
if (bootstrap) {
  const managerPkg = new ManagerPkgsMinecraft(bootstrap);
  managerPkg.openInstance();
}
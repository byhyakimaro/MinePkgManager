const Utils = require('./libs/utils');
const Bootstrap = require('./libs/bootstrap');
const path = require('path');
const fs = require('fs');
const os = require('os');

class ManagerPkgsMinecraft {
  constructor(manifest) {
    this.manifest = manifest;
  };

  saveProfileInstance() {

  };

  loadInstance() {
    const { directoryInstance } = this.manifest.config;
    if (!directoryInstance) throw new Error('set directory instance for run.');

    const inkInstManifest = path.join(String(directoryInstance), 'manifest.json');
    const instManifest = JSON.parse(fs.readFileSync(inkInstManifest));

    console.log(instManifest);
  };
};

const bootstrap = (new Bootstrap()).getManifest();
const managerPkg = new ManagerPkgsMinecraft(bootstrap);

managerPkg.loadInstance();
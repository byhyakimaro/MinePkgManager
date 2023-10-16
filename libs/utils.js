const { Readable } = require('stream');
const { finished } = require('stream/promises');
const path = require('path');
const fs = require('fs');
const os = require('os');

class Utils {
  _addPath(path) {
    if (!fs.existsSync(path)) {
      try {
        fs.mkdirSync(path, { recursive: true });
        return true;
      } catch (err) {
        return err;
      };
    };
  };

  _copyFolderSync(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    this._addPath(src);
    const files = fs.readdirSync(src);

    files.forEach((file) => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      if (fs.statSync(srcPath).isDirectory()) {
        this.copyFolder(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      };
    });
  };

  _deleteFilesRecursivelySync(directoryPath) {
    const items = fs.readdirSync(directoryPath);

    for (const item of items) {
      const itemPath = path.join(directoryPath, item);

      if (fs.lstatSync(itemPath).isDirectory()) {
        this.deleteFilesRecursivelySync(itemPath);
      } else {
        fs.unlinkSync(itemPath);
      };
    };
    fs.rmdirSync(directoryPath);
  };

  async _downloadFileJar(pathEnd, urlDownload) {
    if (!urlDownload.includes('http')) reject('just files web accepted.');
    this._addPath(pathEnd);

    const { url, body } = await fetch(urlDownload);
    const fileName = decodeURIComponent(url.match(/\/([^/]+)$/)[1]).replace(/\+/g,' ');
    const stream = fs.createWriteStream(path.join(pathEnd, fileName));
    await finished(Readable.fromWeb(body).pipe(stream));
  };

  getFileCurseApi(listPkgsInstance) {
    
  };
};
module.exports = Utils;
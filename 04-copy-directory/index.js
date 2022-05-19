const fsPromises = require('fs/promises');
const path = require('path');

fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true})
  .then();

fsPromises.readdir(path.join(__dirname, 'files'), {withFileTypes: true})
  .then(data => {
    data.forEach(file => {
      fsPromises.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, path.join('files-copy', file.name)));
    });
  });

const fsPromises = require('fs/promises');
const path = require('path');

fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true})
  .then();

try {
  fsPromises.access(path.join(__dirname, 'files-copy')).then();
  fsPromises.readdir(path.join(__dirname, 'files-copy'), {withFileTypes: true})
    .then(data => {
      data.forEach(file => {
        fsPromises.unlink(path.join(__dirname, 'files-copy', file.name), err => {
          console.log(err);
        });
      });
    });
} catch {
  fsPromises.readdir(path.join(__dirname, 'files'), {withFileTypes: true})
    .then(data => {
      data.forEach(file => {
        fsPromises.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, path.join('files-copy', file.name)));
      });
    });
}

fsPromises.readdir(path.join(__dirname, 'files'), {withFileTypes: true})
  .then(data => {
    data.forEach(file => {
      fsPromises.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, path.join('files-copy', file.name)));
    });
  });

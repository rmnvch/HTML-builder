const fsPromises = require('fs/promises');
const path = require('path');

fsPromises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
  .then(
    data => {
      data.forEach(async dirent => {
        if(dirent.isFile()) {
          const ext = path.extname(dirent.name);
          const basename = path.basename(dirent.name, ext);
          const sizeInBytes = await fsPromises.stat(path.join(__dirname, 'secret-folder', dirent.name));
          
          console.log(basename + ' - ' + ext + ' - ' + sizeInBytes.size +'kb');
        }
      });
    },
    error => console.log(error)
  );


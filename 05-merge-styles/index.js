const path = require('path');
const fs = require('fs');


(function getBundle() {
  let temp =[];

  fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true})
    .then(list => {
      list.forEach(file => {
        if(file.isFile() && path.extname(file.name) === '.css') {
          const readStream =fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
          readStream.on('data', chunk => {
            temp.push(chunk.toString());
            const writeStream =fs.createWriteStream(path.join(__dirname,'project-dist', 'bundle.css'), 'utf-8');
            writeStream.write(temp.join('\n'));
            writeStream.end();
          });
        }  
      });
    });
})();
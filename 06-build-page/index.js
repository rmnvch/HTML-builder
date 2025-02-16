const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

fs.promises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});

(function getCSSBundle() {
  let temp =[];

  fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true})
    .then(list => {
      list.forEach(file => {
        if(file.isFile() && path.extname(file.name) === '.css') {
          const readStream =fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
          readStream.on('data', chunk => {
            temp.push(chunk.toString());
            const writeStream =fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
            writeStream.write(temp.reverse().join('\n'));
            writeStream.end();
          });
        }  
      });
    });
})();

function readDir(folder) {
  fs.promises.readdir(folder, {withFileTypes: true})
    .then(files => files.forEach(file => {
      if(file.isFile()) {
        fs.promises.mkdir(path.join(__dirname, 'project-dist','assets', path.basename(folder)), {recursive: true}).then(() => {
          fs.promises.copyFile(path.resolve(__dirname, folder, file.name), path.join(__dirname, 'project-dist','assets',path.basename(folder), file.name));  
        });
      } else {
        readDir(path.join(__dirname, 'assets', file.name));
      }
    })
    );  
}

function emptyDir(folder) {
  fs.promises.readdir(folder, {withFileTypes: true})
    .then(files => files.forEach(file => {
      if(file.isFile()) {
        fs.promises.unlink(path.resolve(__dirname, folder, file.name));  
      } else {
        readDir(path.join(__dirname, 'assets', file.name));
      }
    })
    );  
}

(function getAssetsBundle() {

  fs.promises.access(path.join(__dirname, 'project-dist', 'assets'))
    .then(() => {
      emptyDir(path.join(__dirname, 'project-dist', 'assets'));
      readDir(path.join(__dirname, 'assets'));
    })
    .catch(() => {
      readDir(path.join(__dirname, 'assets'));
    });
})();

(function getHTMLOutput() {
  
  const templateStream = fs.createReadStream(path.join(__dirname, 'template.html'));
  const trasnformedFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

  const transform = new Transform({
    transform(chunk, enc, cb) {
      let regExp = /{{\w*}}/gi;
      let components = [];
      chunk.toString().replace(regExp, (m,t) => {
        components.push(m);
      });

      Promise.all(components.map(comp => {
        return fs.promises.readFile(path.join(__dirname, 'components', `${comp.slice(2,-2)}.html`));
      })).then(buffer => {
        let output;
        for(let i = 0; i < buffer.length; i++) {
          output = chunk.toString().replace(components[i], buffer[i].toString());
          chunk = output;
        }
        this.push(output);
        cb();  
      });
    }
  });

  templateStream.pipe(transform).pipe(trasnformedFile);


})();

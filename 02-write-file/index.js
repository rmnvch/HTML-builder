const path = require('path');
const fs = require('fs');

const { stdin, stdout } = process; 

fs.writeFile(path.join(__dirname, 'text.txt'), '', err => {
  if(err) throw err;
});

stdout.write('Howdy!!\nHow can I help you?\n');
stdin.on('data', data => {
  if(data.toString().trim() == 'exit') {
    stdout.write('Looking forward to seeing you soon');
    process.exit();
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), 
    data.toString(),
    err => {
      if(err) throw err;
    });
});

process.on('SIGINT', () => {
  stdout.write('Looking forward to seeing you soon');
  process.exit();
});
const path = require('path');
const fs = require('fs');

const location = path.join(__dirname, 'text.txt'); 

const readableStream = fs.createReadStream(location, 'utf-8');

readableStream.on('data', chunk => console.log(chunk));
readableStream.on('end', () => console.log('THAT IS IT'));

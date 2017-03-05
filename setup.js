'use strict';

var fs = require('fs');
fs.stat('.env', function(err, stat) {
  if (err == null) {
    console.log('.env already exists');
  } else if (err.code == 'ENOENT') {
    // Create file .env
    fs.createReadStream('.sample-env').pipe(fs.createWriteStream('.env'));
  } else {
    console.log('An error occured: ', err.code);
  }
});

'use strict';

require('should');

var fs = require('fs');

fs.readdirSync(__dirname).forEach(function (file) {
  if (file === 'index.js') { return; }
  describe(file.split('.')[0], function () {
    require('./' + file);
  });
});

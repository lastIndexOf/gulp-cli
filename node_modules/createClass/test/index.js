
var fs = require('fs');
var API = require('../.');
var should = require('should/as-function');

fs.readdirSync(__dirname).forEach(function (file) {
  if (file === 'index.js') { return; }
  describe(file.split('.')[0], function () {
    require('./' + file)(API, should);
  });
});

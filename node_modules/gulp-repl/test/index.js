'use strict';


var fs = require('fs');
var Gulp = require('gulp').constructor;
var should = require('should');

var api = require('../.');
var repl = api.start();

fs.readdirSync(__dirname).forEach(function (file) {
  if (file === 'index.js') {
    return;
  }

  describe(file.split('.')[0], function () {
    require('./' + file)(api, repl, Gulp, should);
  });
});

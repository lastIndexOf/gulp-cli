'use strict';

var path = require('path');
var pack = require('../');

require('should');

[
  'paths.js',
  'params.js',
  'options.js',
  'notFound.js'
].forEach(function(file){
  if(file === 'index.js'){ return; }
  var suite = path.basename(file, path.extname(file));
  describe(suite, function(){
    require('./' + file)(pack);
  });
});

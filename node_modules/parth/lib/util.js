'use strict';

exports = module.exports = {};

// dependencies
//
exports.clone = require('lodash.clone');
exports.merge = require('lodash.merge');

// assorted
//
exports.getQueryString = function(url){
  if(!url){ return null; }

  var index = url.indexOf('?');

  if(index > -1 && url.charAt(index + 1) !== ':'){
    return url.substring(index);
  } else {
    return null;
  }
};

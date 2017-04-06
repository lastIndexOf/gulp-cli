'use strict';

exports = module.exports = {};

// shortcuts
//
var __toString = ({}).toString;

// library deps
//
exports.defineProperty = require('./defineProperty');

// get class of the constructor if any
//
exports.getClassType = function(src){
  return __toString.call(src).match(/\w+/g)[1].toLowerCase();
};

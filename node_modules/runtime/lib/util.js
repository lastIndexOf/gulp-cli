'use strict';

var objClass = '[object Object]';
var __toString = Object.prototype.toString;

exports = module.exports = {};

// dependencies
//
exports.once = require('once');
exports.clone = require('lodash.clone');
exports.merge = require('lodash.merge');
exports.asyncDone = require('async-done');
exports.createClass = require('createClass');

// assorted util
//

exports.mapFrom = function (argv, args, pos) {
  var index = -1;
  var length = args.length;

  while (++pos < length) {
    argv[++index] = args[pos];
  }
};

exports.isPlainObject = function (value) {
  return value && __toString.call(value) === objClass;
};

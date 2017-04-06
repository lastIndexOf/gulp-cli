'use strict';

exports = module.exports = defineProperty;

// defineProperty shorcut
//
function defineProperty(obj, prop, matches, value){

  matches = matches || '';

  var descriptor = {
    writable: /w/.test(matches),
    enumerable: /e/.test(matches),
    configurable: /c/.test(matches)
  };

  if(value){ descriptor.value = value; }
  Object.defineProperty(obj, prop, descriptor);
}

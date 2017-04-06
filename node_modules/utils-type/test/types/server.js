'use strict';

var Stream = require('stream');
var EventEmitter = require('events').EventEmitter;

exports.checks = [
  'undefined','null','string', 'number', 'boolean', 'symbol',
  'nan', 'infinity', 'arguments',
  'object', 'plainObject', 'function', 'array', 'regexp', 'error',
  'date', 'math', 'buffer', 'stream', 'eventemitter',
  'integer', 'float'
];

module.exports.types = (function(){
  return ([
    {
        src : [null],
      check : ['null']
    },
    {
        src : [undefined],
      check : ['undefined']
    },
    {
        src : [true, false, Boolean('')],
      check : ['boolean']
    },
    {
        src : [ NaN ],
      check : ['nan']
    },
    {
        src : [ Infinity ],
      check : ['number', 'infinity']
    },
    {
        src : [-3, -2, -1, 0, 1, 2, 3],
      check : ['number', 'integer']
    },
    {
        src : [ -3.3, -2.2, -1.1, 1.01, 2.1, Math.E, Math.PI],
      check : ['number', 'float']
    },
    {
        src : ['a string', '', '     '],
      check : ['string']
    },
    /*{
        src : ['', '      ', null, undefined, function(a,b){   }, 0, NaN, { }],
      check : ['empty']
    },*/,
    {
        src : [{ }, { yep : 'yep' }],
      check : ['object', 'plainObject']
    },
    {
        src : [arguments],
      check : ['object', 'arguments']
    },
    {
        src : [[1,2,3], [arguments, 1, function(){}, [1,23,4]]],
      check : ['object', 'array']
    },
    {
        src : [function something(){ }, function(){ }],
      check : ['object', 'function']
    },
    {
        src : [Math],
      check : ['object', 'math']
    },
    {
        src : [new Error(), new TypeError()],
      check : ['object', 'error']
    },
    {
        src : [new RegExp()],
      check : ['object', 'regexp']
    },
    {
        src : [new Date()],
      check : ['object', 'date']
    },
    {
        src : [new Buffer('hello')],
      check : ['object', 'buffer']
    },
    {
        src : [new Stream()],
      check : ['object', 'stream', 'eventemitter']
    },
    {
        src : [new EventEmitter()],
      check : ['object', 'eventemitter']
    }
  ]);
})();

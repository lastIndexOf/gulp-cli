'use strict';

var type = require('../.');
var should = require('should');
var server = { };
    server.testSuite = require('./types/server');

describe('utils-type:server', function(){

  var types = server.testSuite.types;
  describe('type(value) should have property {typeName}', function(){
    types.forEach(function(typeUnit){
      var typeList = typeUnit.src;
      var typeChecks = typeUnit.check;
      typeList.forEach(function(value){
        it('type('+value+') to have prop {'+typeChecks.join('}, {')+'}',
          function(){
          typeChecks.forEach(function(typeName, index){
            if( typeName === 'integer' ){
              should(type(value))
                .have.property(typeName, value);
            } else {
              should(type(value))
              .have.property(typeName,
                index > 1
                  ? value
                  : value || Boolean(value+'') || ' '
              );
            }
          });
        });
      });
    });
  });

  var checks = server.testSuite.checks;
  describe('should not have other property types',
    function(){
    server.testSuite.types.forEach(function(typeUnit){
      var typeList = typeUnit.src;
      var typeChecks = typeUnit.check;
      typeList.forEach(function(value){
        it('type('+value+') NOT be anything but {'+typeChecks.join('} or {')+'}',
          function(){
          checks.forEach(function(typeName){
            if( typeChecks.indexOf(typeName) > -1 ){ return ; }
            should(type(value)).not.have.property(typeName);
          });
        });
      });
    });
  });

  describe('should type(value).match(/name/) = value || Bolean(value+\'\') || \' \'',
    function(){
    types.forEach(function(typeUnit){
      var typeList = typeUnit.src;
      var typeChecks = typeUnit.check;
      typeList.forEach(function(value){
        it('should type('+value+').match(/'+typeChecks.join('|')+'/g) = ' +
          (value || Boolean(value+'') || ' '),
          function(){
          var re = new RegExp(typeChecks.join('|'),'g');
          should(type(value).match(re)).be.eql(value || Boolean(value+'') || ' ');
        });
      });
    });
  });

  describe('type.match should return null if it doesnt match its type(s)', function(){
    server.testSuite.types.forEach(function(typeUnit){
      var typeList = typeUnit.src;
      var typeChecks = typeUnit.check;
      var checkNots = [];
      typeList.forEach(function(value){
        checks.filter(function(typeName){
          if( typeChecks.indexOf(typeName) > -1 ){ return ; }
          checkNots.push(typeName);
        });
        var types = Object.keys(type(value));
            types.splice(types.indexOf('match'), 1);
        it('should only type('+value+').match(/'+types.join('|')+'/)',
          function(){
            should(type(value).match(checkNots.join('|'))).be.eql(null);
        });
      });
    });
  });
});

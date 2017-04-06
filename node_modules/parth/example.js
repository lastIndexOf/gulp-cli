'use strict';

var input, result;
var parth = require('./.')();

// #set
input = [
  '/',
  '/page',
  '/page/:number(\\d+)',
  'get /',
  'get /page',
  'get /:page',
  'get :page/:view',
  'get /:page/:view',
  'get /page/:number(\\d+)',
  'get /:page(\\w+)/number',
  'get /:page(\\w+)/:number(\\d+)',
  '(get|post) /page/number',
  '(get|post) /:page(\\w+)/number',
  '(get|post) /:page(\\w+)/:Number(\\d+)',
  'get /page/number',
  '(get|post) /:page(\\w+)/:view([^.\\/\\s]+)',
  '1', '2', '1 2',
  'obj.path',
  'obj.:path(\\S+).:number(\\d+)',
  'obj.:number(\\d+).:path(\\S+)',
  'obj.path.:here',
  'obj.(prop|path).:here',
  ':obj.(method|prop).:here'

];

input.forEach(function(stem){
  parth.set(stem);
});

// #get
input = [
  '1',
  '2',
  '1 2',
  'obj.path.10',
  'obj.10.prop',
  'obj.10.10',
  'array.method.prop',
  'get weekend/baby?query=string#hash user.10.beers',
  'get /weekend/baby?query=string#hash user.10.beers now',
  'get /user/view/#hash',
  'post /user/page/photo?query=name&path=tree#hash'
];

console.log(' -- parth.get -- ');
input.forEach(function(stem, index){
  result = parth.get(stem);
  console.log(' input =', stem);
  console.log('result =', result);
  console.log((input[index + 1] ? ' -- ' : '' ));
});

if(process.argv.indexOf('-l') < 0){ return; }
Object.keys(parth).forEach(function(prop){
  console.log(parth[prop]);
  console.log(' --\n');
});

parth.regex.forEach(function(re){
  console.log(re.stem);
});

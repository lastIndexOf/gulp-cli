# parth [![NPM version][badge-version]][x-npm] [![downloads][badge-downloads]][x-npm]

[documentation](#documentation) -
[examples](#examples) -
[install](#install) -
[todo](#todo) -
[why](#why)

[![build][badge-build]][x-travis]

## sample

```js
var Parth = require('parth');

var parth = new Parth();
var props = {handle: function(){}};

parth.set('(get|post) /:page/:view', props)
     .get('get /weekend/baby?query=string#hash user.10.beers now')
// =>
{
  path: 'get /:page/:view',
  stem: ':0(get|post) /:page/:view:qs(?:\\/?)?([?#][^\\/\s]*)?',
  depth: 2,
  regex: /^(get|post) \/([^?#.\/\s]+)\/([^?#.\/\s]+)(?:\/?)?([?#][^\/\s]*)?/,
  match: 'get /weekend/baby?query=string#hash',
  handle: [Function],
  notFound: ' user.10.beers now',
  params: {
    page: 'weekend',
    view: 'baby',
    qs: '?query=string#hash'
  }
}
```

## documentation

The `module.exports` a `Parth` constructor

````js
var Parth = require('parth');
````

which can take the options below

```js
var parth = new Parth(options);
```

_options_ type `object`, can be
 - `options.defaultRE` default `regex` used if none is given after the params

example:

```js
var parth = new Parth({ defaultRE: /[^\s\/?#]+/ });

parth.set('/page/:view') // no regex given after ":view"
     .get('/page/10/?query=here')
// =>
{
  path: '/page/:view/',
  stem: '/page/:view:qs(?:\\/?)([?#][^\\/\\s]*)?',
  depth: 2,
  regex: /^\/page\/([^\s\/?#]+)(?:\/?)([?#][^\/\s]*)?/,
  match: '/page/10/?query=here',
  params: {
    view: '10',
    qs: '?query=here'
  },
  notFound: ''
}
```

> NOTE: the query string is separated by default and assigned to `qs`.
> This will only happen if the path given to `parth.set` has no query string

## parth.set

```js
function set(string path[, object options])
```
This method job is to sanitize `path` and order it with those previously stored.

_arguments_
 - `path`, type `string`, path to be set
 - `options`, type `object`, to merge with this path properties

_returns_ `this`

> NOTE: `options` is deep cloned beforehand to avoid mutation

`path` can contain any number of parameters(regexes) in the form
```js
 :param-label(\\regexp(?:here))
```
Any string matching the regular expression below qualifies as a parameter

````js
/:([-\w]+)(\([^\s]+?[)][?)]*)?/g;
````

[Go to http://regexr.com/](http://regexr.com/3cuqq) and test it out.

## parth.get
```js
function get(string path)
```

Take a string and return a clone of the store object properties

_arguments_
 - `path`, type `string` to match stored paths with

_return_
 - null for non-supported types or not matching paths
 - object with all the information stored in `parth.set`

> All matches are partial i.e. /^regex baby/.
> Not being strict is useful for `notFound` paths.
>
> NOTE: the returned object is a deep copy of the original `options`
> given in `parth.set` to avoid mutation

### parth properties

 - `parth.store`: all paths set for match are here
 - `parth.regex`: array of carefully ordered regexes
 - `parth.regex.master`: regex aggregating all learned

## why

I need it for the [gulp-runtime](https://github.com/stringparser/gulp-runtime) module.

## install

With [npm](http://npmjs.org)

    npm install --save parth

### examples

Run the [`example.js`](example.js) file.

### test

    npm test

```
➜  parth (master) ✓ npm t
parth
  paths
    ✓ object
    ✓ raw object paths
    ✓ unix paths
    ✓ raw unix paths
    ✓ urls
    ✓ raw urls
    ✓ urls: querystring is stripped
    ✓ urls: hash is stripped
    ✓ urls: parameters are not mistaken as querystrings
    ✓ space separated paths
    ✓ raw, space separated paths
    ✓ unix, object and url paths together
    ✓ raw: unix, object and urls paths together
  params
    ✓ can be given as a string regex
    ✓ will contain all parameter keys at _
    ✓ parameter values should be at params
  notFound
    ✓ should be false for perfect match
    ✓ should have what is left of the path


18 passing (16ms)
```

### todo

 - [ ] set support for regexp input

### license

The MIT License (MIT)

Copyright (c) 2014-present Javier Carrillo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[x-npm]: https://npmjs.org/package/parth
[x-travis]: https://travis-ci.org/stringparser/parth/builds
[badge-build]: http://img.shields.io/travis/stringparser/parth/master.svg?style=flat-square
[badge-version]: http://img.shields.io/npm/v/parth.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/parth.svg?style=flat-square

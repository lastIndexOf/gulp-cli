# runtime [![NPM version][badge-version]][x-npm][![downloads][badge-downloads]][x-npm]
[![Build status][badge-build]][x-travis]

[breaking changes](#breaking-changes) -
[documentation](#documentation) -
[examples](#examples) -
[install](#install) -
[todo](#todo) -
[why](#why)

The aim of the project is to compose asynchronous functions and provide a basic api to create an interface around them. It is for people who hate so many choices around the same problem (i.e. callbacks, promises, streams, ...)

Once these asynchronous functions are composed, they are not executed right away. Instead another function is returned leaving execution of this `stack` to the writer. This function can be used multiple times.

Note that every function is made asynchronous and should be resolved either with a callback, returning a stream, a promise or a [RxJS observable][RxJS-observable].

## usage

As an example let's make 3 async functions. One using a callback, other returning a promise and another a stream.

```js
var fs = require('fs');
var through = require('through2');
var Promise = require('es6-promise').Promise;

function foo (next, value) {
  console.log('received `%s`', value);
  setTimeout(function () {
    next(null, 'Callback');
  }, Math.random() * 10);
}

function bar (next, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value + 'Promise');
    }, Math.random() * 10);
  });
}

function baz (next, value) {
  var stream = fs.createReadStream(__filename);

  return stream.once('end', function () {
    next(null, value + 'Stream');
  });
}
```

All right we have 3 functions. Lets setup an interface around them. For the sake of simplicity lets make a logger with error handling.

```js
var Runtime = require('runtime');

// create a composer class that will have what we need
var Composer = Runtime.createClass({
  reduceStack: function (stack, site) {
    if(typeof site === 'function'){
      stack.push({
        fn: site,
        label: Array.isArray(site.stack)
          ? this.tree(site.stack).label
          : site.label || site.name || 'anonymous'
      });
    }
  },
  onHandleStart: function (site, stack) {
    console.log('`%s` started', site.label);
    site.time = process.hrtime();
  },
  onHandleEnd: function (site, stack) {
    var diff = process.hrtime(site.time);
    console.log('`%s` ended after %s ms',
      site.label, diff[0]*1e+3 + Math.floor(diff[1]*1e-6)
    );
  },
  onHandleError: function (error, site) {
    var file = error.stack.match(/\/[^)]+/).pop();
    console.log('`%s` errored at', site.label, file);
    console.log(error.stack);
  }
});
```

Now let's compose those into _one_ asynchronous function using
this brand new `runtime` instance we have created.

How does it look like?

The default goes like this: last argument for options, all the others for functions.


```js
// create a Composer instance
var runtime = Composer.create();

var composed = runtime.stack(foo, bar, baz, { wait: true });
// runtime.stack will run each site in parallel by default
// to change it pass `{ wait: true }` and each site will run in series

// lets make it pretty
console.log('Stack tree -> %s',
  require('archy')(runtime.tree(composed.stack))
);

// use it just as normal async function
composed('insert args here', function done(error, result){
  if (error) {
    console.log(err.stack);
  } else {
    console.log('result: `%s`', result);
  }
});
```

Here we go. This is the output logged.

```sh
Stack tree -> foo, bar, baz
├── foo
├── bar
└── baz

`foo` started
received `insert args here`
`foo` ended after 3 ms
`bar` started
`bar` ended after 3 ms
`baz` started
`baz` ended after 7 ms
result: `CallbackPromiseStream`
```

## documentation

Work in progress.

## install

With [npm](http://npmjs.org)

    npm install --save runtime

## breaking changes

If you where using a previous version, the internals have been cleaned and simplified a lot to offer the same idea with less opinions and more reuse.

Now `runtime.stack` composes only functions **by default**. If you want to
give strings that then are mapped to a function, that is, you want to write

```js
var composed = runtime.stack('foo', 'bar');
```
you will have to use the following approach

```js
var Runtime = require('runtime');

// create a class
var RuntimeClass = Runtime.createClass({
  create: function () {
    this.tasks = {};
  },
  task: function (name, handle) {
    if (typeof name !== 'string') {
      throw new TypeError('`name` should be a string');
    } else if (typeof handle !== 'function') {
      throw new TypeError('`handle` should be a function');
    }

    this.tasks[name] = handle;
    return this;
  },
  // similar to Array.prototype.reduce with an empty array
  // given for the for the previous argument (stack = [] on first call)
  reduceStack: function (stack, site) {
    if (typeof site === 'string' && typeof this.tasks[site] === 'function') {
      stack.push(this.tasks[site]);
    } else if (typeof site === 'function') {
      stack.push(site);
    }
  }
});

// instantiate
var runtime = RuntimeClass.create();

// register your mapping from string to function
runtime.task('one', function handleOne (next, myArg) {
  // do async things
  next(); // or return a  promise, stream or RxJS observable
});

function two (next, myArg) {
  // do async things
  next(); // or return a  promise, stream or RxJS observable
}

// now you can `stack` functions and strings together
var composer = runtime.stack('one', two);

// run the `stack` function returned
composer('myArg', function onStackEnd (err, result) {
  if (err) { throw err; }
  console.log(result);
});
```

### test

```
➜  runtime (master) ✔ npm test

api
  ✓ onHandleStart is called before each site
  ✓ onHandleEnd is called before each site
  ✓ nested: onHandleStart is called before and after each site
  ✓ nested: onHandleEnd is called before and after each site
  ✓ context for each stack can be given {context: [Object]}
  ✓ can be reused with no side-effects
  ✓ create({wait: true}) makes all stacks wait

exports
  ✓ create() should return a new instance
  ✓ create(object mixin) should add to the instance properties
  ✓ createClass() should return a new constructor
  ✓ createClass(object mixin) mixin with new constructor
  ✓ createClass({create: [Function]}) should be used as ctor

stack-callbacks
  ✓ uses the callback when a fn throws
  ✓ uses the callback when passes the error
  ✓ passes error to onHandleError when no callback given
  ✓ runs the callback on completion
  ✓ runs fns in parallel by default
  ✓ {wait: true} should run functions in series
  ✓ passes arguments when fns wait
  ✓ does NOT pass arguments when fns does NOT wait

stack-promises
  ✓ uses the callback when a promise throws
  ✓ uses the callback when promises rejects
  ✓ passes error to onHandleError if no callback was given
  ✓ runs the callback after completion of all promises
  ✓ runs in parallel by default
  ✓ runs in series with {wait: true}
  ✓ passes arguments when it waits
  ✓ does NOT pass arguments when fns does NOT wait

stack-streams
  ✓ uses the callback when a stream throws an error
  ✓ uses the callback when a stream emits an error
  ✓ passes error to onHandleError if no callback was given
  ✓ runs the callback after completion of all streams
  ✓ runs in parallel by default
  ✓ runs in series with {wait: true}

stacks-composed
  ✓ runs callback if fn throws from other stack
  ✓ runs callback if error given to next from other stack
  ✓ runs the callback on completion of all stacks
  ✓ runs stacks in parallel by default
  ✓ {wait: true} should run stacks in series
  ✓ series: callback is run after all stacks are finished
  ✓ passes arguments when host and completed stack waits
  ✓ does NOT pass arguments when stacks does NOT wait


42 passing (229ms)
```

## why

There are several ways to manage complexity for asynchronous functions.
Ones are better than others for some use-cases and sometimes with callbacks
is more than enough. But we all want to avoid callback hell and reuse as much
as possible.

### todo
 - [ ] be able to redo or rewind within the same stack

### license

The MIT License (MIT)

Copyright (c) 2015-present Javier Carrillo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<!-- links -->

[x-npm]: https://npmjs.org/package/runtime
[x-travis]: https://travis-ci.org/stringparser/runtime
[async-done]: https://github.com/gulpjs/async-done

[badge-build]: http://img.shields.io/travis/stringparser/runtime/master.svg?style=flat-square
[badge-version]: http://img.shields.io/npm/v/runtime.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/runtime.svg?style=flat-square

[RxJS-observable]: https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md

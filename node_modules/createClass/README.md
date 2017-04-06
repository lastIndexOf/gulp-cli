# createClass [![NPM version][b-version]][npm] [![downloads][badge-downloads]][npm]

[![build][b-build]][travis]

[docs](#docs) -
[install](#install)

Just sugar.

## usage

Contrived example time! :D

```js
var createClass = require('createClass');

var Logger = createClass({
  create: function Logger (props) {
    console.log(this.constructor.name, 'created with props', props);

    Object.keys(this.constructor.prototype).forEach(function (method) {
      var self = this;
      self[method] = function (/* arguments */) {
        console.log(self.constructor.name, 'is going to', method);
        self.constructor.prototype[method].apply(self, arguments);
      };
    }, this);
  }
});

var Animal = createClass(Logger, {
  create: function Animal (props) {
    Animal.super_.call(this, props);
    this.props = props;
  }
});

var FelineMixin = {
  talk: function () {
    console.log('meoww (%s)', this.props.thinking);
  }
};

var Cat = Animal.createClass({
  mixins: [FelineMixin],
  create: function Cat (props) {
    Cat.super_.call(this, props);
  }
});

var cat = new Cat({ thinking: 'hungry' });

setInterval(function () {
  cat.talk();
}, 100);
```

## docs

The `module.exports` a function

```js
var createClass = require('createClass');
```

When assigning `createClass` to a function makes it the super class.

```js
function Constructor () {}
Constructor.createClass = createClass;

var Child = Constructor.createClass();
// behold! Child will inherit from `Constructor` now
```

## createClass

Can take 2 arguments

```js
function createClass ([Function Super, Object spec])
```

_arguments_
- `Super`, type `function`, to use as super class
- `spec`, type `object`, to be added to the constructor prototype. Can be either passed as 1st or 2nd argument to the function

_returns_ a new class with the given `spec` in its prototype and two static methods

- `NewClass.create`: creates a new instance (up to 3 arguments)
- `NewClass.createClass`: same as `createClass` but using `NewClass` as super

example:

```js
var Animal = createClass({
  talk: function () {
    console.log('?');
  }
});

var Cat = createClass(Animal, {
  talk: function () {
    console.log('meoww');
  }
});

var cat = Cat.create();

cat.talk();
// => meoww
```

`spec` has some special properties

### spec.create

Should be a `Function`.

If given, it will be used the constructor function for the returned class.

The module is using [`inherits`](https://github.com/isaacs/inherits) to do inheritance which means: `super_` is set as a static property.

```js
var Animal = createClass({
  create: function Animal (props) {
    this.props = props;
  }
});
```

and since `Super` can be passed as first argument

```js
var Cat = createClass(Animal, {
  create: function Cat (/* arguments */) {
    Cat.super_.apply(this, arguments);
  }
});

var cat = Cat.create({ thinking: 'hungry' });

console.log(cat.props);
// => { thinking: 'hungry' }
```

### spec.mixins

Same as `merge`/`extend`/`Object.assign` with the resulting class prototype. The element at the tail of the array is the first to be used and from there back to the beginning of the array.

Each element of the `Array` can be `object` or `function`.

When an element is ...

- `object`, its properties are directly assigned
- `function`, its prototype (enumerable) properties are assigned

In both cases there is no method override. If was defined on already it will not be overridden.

```js
function Animal () {}
Animal.prototype.talk = function () {
  console.log('Yo!');
};

function Mammal () {}
Mammal.prototype.hasFur = function () {
  return true;
};

var AnimalMixin = {
  poop: function () {
    console.log('Pooping now. Wait for it...');
    setTimeout(function () {
      console.log('.');
    }, Math.random()*1000);
  }
};

var Bear = createClass(Animal, {
  mixins: [AnimalMixin, Mammal]
  poop: function () {
    console.log('Bear pooping now!');
    console.log('.');
    console.log('Bear pooped!');
  },
  talk: function () {
    console.log('bearrrrrrr!');
  }
});

var Cat = createClass(Animal, {
  mixins: [AnimalMixin, Mammal]
  talk: function () {
    console.log('meowww');
  }
});
```

Mixins are good looking because you can put them together with just objects, and one may think there is less of the "[you wanted a bannana but you got a gorilla holding a banana](http://www.johndcook.com/blog/2011/07/19/you-wanted-banana/)" problem,  but there are still issues with them see: [mixins are considered harmful](https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html#why-mixins-are-broken).

So we should be careful grasshoppers.

### spec.statics

Object of static properties to add to the new class.

```js
var Animal = createClass({
  statics: {
    isMammal: function (animal) {
      if (animal && typeof animal !== 'function') {
        return animal.props && animal.props.neocortex;
      }
    }
  }
});
```

# install

With [npm](https://npmjs.com)

```sh
npm install --save-dev createClass
```

### license

The MIT License (MIT)

Copyright (c) 2016-present Javier Carrillo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<!-- links -->
[npm]: https://npmjs.com/createClass
[travis]: https://travis-ci.org/stringparser/createClass/builds

[b-build]: https://travis-ci.org/stringparser/createClass.svg?branch=master
[b-version]: http://img.shields.io/npm/v/createClass.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/createClass.svg?style=flat-square

'use strict';

var Runtime = require('../');

it('create() should return a new instance', function () {
  var runtime = Runtime.create();
  runtime.constructor.should.be.eql(Runtime);
});

it('create(object props) should add to the instance properties', function () {
  var props = {name: 'name'};
  var runtime = Runtime.create(props);
  (runtime).should.have.properties({ props: props });
});

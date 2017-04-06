'use strict';

var Runtime = require('../');
var Promise = require('es6-promise').Promise;

it('uses the callback when a promise throws', function (done) {
  var error = Error('on no!');
  var runtime = Runtime.create();

  function one () {
    return new Promise(function () {
      throw error;
    });
  }

  runtime.stack(one)(function (err) {
    err.should.be.eql(error);
    done();
  });
});

it('uses the callback when promises rejects', function (done) {
  var error = Error('on no!');
  var runtime = Runtime.create();

  function one () {
    return new Promise(function (resolve, reject) {
      reject(error);
    });
  }

  runtime.stack(one)(function (err) {
    err.should.be.eql(error);
    done();
  });
});

it('passes error to onHandleError if no callback was given', function (done) {
  var error = new Error('not again...');

  var runtime = Runtime.createClass({
    onHandleError: function (err) {
      if (!(err instanceof Error)) {
        return done(new Error('was\'t an instance of error'));
      }
      err.should.be.eql(error);
      done();
    }
  }).create();

  function one () {
    return new Promise(function (resolve, reject) {
      reject(error);
    });
  }

  runtime.stack(one)();
});

it('runs the callback after completion of all promises', function (done) {
  var runtime = Runtime.create();

  var count = 0;
  function one () {
    return new Promise(function (resolve) {
      ++count; resolve();
    });
  }
  function two () {
    return new Promise(function (resolve) {
      ++count; resolve();
    });
  }

  runtime.stack(one, two)(function (err) {
    if (err) { return done(err); }
    count.should.be.eql(2);
    done();
  });
});

it('runs in parallel by default', function (done) {
  var runtime = Runtime.create();

  var stack = '';
  function one () {
    return new Promise(function (res) {
      setTimeout(function () {
        stack += 'one';
        res();
      }, Math.random()*10);
    });
  }
  function two () {
    return new Promise(function (res) {
      stack += 'two';
      res();
    });
  }

  runtime.stack(one, two)(function (err) {
    if (err) { return done(err); }
    stack.should.be.eql('twoone');
    done();
  });
});

it('runs in series with {wait: true}', function (done) {
  var runtime = Runtime.create();

  var stack = '';
  function one () {
    return new Promise(function (res) {
      setTimeout(function () {
        stack += 'one';
        res();
      }, Math.random()*10);
    });
  }
  function two () {
    return new Promise(function (res) {
      stack += 'two';
      res();
    });
  }

  runtime.stack(one, two, {wait: true})(function (err) {
    if (err) { return done(err); }
    stack.should.be.eql('onetwo');
    done();
  });
});

it('passes arguments when it waits', function (done) {
  var runtime = Runtime.create();

  function one (next, value) {
    next.wait = true;
    value.should.be.eql(1);
    return Promise.resolve(2);
  }
  function two (next, value) {
    value.should.be.eql(2);
    next();
  }

  runtime.stack(one, two)(1, done);
});

it('does NOT pass arguments when fns does NOT wait', function (done) {
  var runtime = Runtime.create();

  function one (next, value) {
    value.should.be.eql(1);
    return Promise.resolve(2);
  }
  function two (next, value) {
    value.should.be.eql(1);
    next();
  }

  runtime.stack(one, two)(1, done);
});

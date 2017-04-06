'use strict';

var Runtime = require('../');

it('uses the callback when a fn throws', function (done) {
  var error = Error('on no!');
  var runtime = Runtime.create();

  function one () { throw error; }

  runtime.stack(one)(function (err) {
    err.should.be.eql(error);
    done();
  });
});

it('uses the callback when passes the error', function (done) {
  var error = Error('on no!');
  var runtime = Runtime.create();

  function one (next) { next(error); }

  runtime.stack(one)(function (err) {
    err.should.be.eql(error);
    done();
  });
});

it('passes error to onHandleError when no callback given', function (done) {
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

  function one (next) {
    next(error);
  }

  runtime.stack(one)();
});

it('runs the callback on completion', function (done) {
  var runtime = Runtime.create();

  var count = 0;
  function one (next) {
    ++count; next();
  }
  function two (next) {
    ++count; next();
  }

  runtime.stack(one, two)(function (err) {
    if (err) { return done(err); }
    count.should.be.eql(2);
    done();
  });
});

it('runs fns in parallel by default', function (done) {
  var runtime = Runtime.create();

  var stack = '';
  function one (next) {
    setTimeout(function () {
      stack += 'one';
      next();
    }, Math.random()*10);
  }
  function two (next) {
    stack += 'two';
    next();
  }

  runtime.stack(one, two)(function (err) {
    if (err) { return done(err); }
    stack.should.be.eql('twoone');
    done();
  });
});

it('{wait: true} should run functions in series', function (done) {
  var runtime = Runtime.create();

  var stack = '';
  function one (next) {
    setTimeout(function () {
      stack += 'one';
      next();
    }, Math.random()*10);
  }
  function two (next) {
    stack += 'two';
    next();
  }

  runtime.stack(one, two, {wait: true})(function (err) {
    if (err) { return done(err); }
    stack.should.be.eql('onetwo');
    done();
  });
});

it('passes arguments when fns wait', function (done) {
  var runtime = Runtime.create();

  function one (next, foo, bar) {
    next.wait = true;
    [foo, bar].should.be.eql([1, 2]);
    next(3, 4);
  }
  function two (next, foo, bar) {
    [foo, bar].should.be.eql([3, 4]);
    next();
  }

  runtime.stack(one, two)(1, 2, done);
});

it('does NOT pass arguments when fns does NOT wait', function (done) {
  var runtime = Runtime.create();

  function one (next, foo, bar) {
    [foo, bar].should.be.eql([1, 2]);
    next(3, 4);
  }
  function two (next, foo, bar) {
    [foo, bar].should.be.eql([1, 2]);
    next();
  }

  runtime.stack(one, two)(1, 2, done);
});

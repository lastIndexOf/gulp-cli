'use strict';

var Runtime = require('../');
var through = require('through2');

var EndStream = through.ctor(
  function write (chunk, enc, callback) {
    this.push(chunk);
    callback();
  },
  function end (callback) {
    callback(); this.emit('end');
  }
);

it('uses the callback when a stream throws an error', function (done) {
  var runtime = Runtime.create();

  function one () {
    var stream = through();

    setTimeout(function () {
      stream.write({});
    }, Math.random()*10);

    return stream;
  }

  runtime.stack(one)(function (err) {
    err.should.be.instanceof(Error);
    done();
  });
});

it('uses the callback when a stream emits an error', function (done) {
  var error = Error('on no!');
  var runtime = Runtime.create();

  function one () {
    var stream = new EndStream();

    setTimeout(function () {
      stream.emit('error', error);
    }, Math.random()*10);

    return stream;
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
    var stream = new EndStream();

    setTimeout(function () {
      stream.emit('error', error);
    }, Math.random()*10);

    return stream;
  }

  runtime.stack(one)();
});

it('runs the callback after completion of all streams', function (done) {
  var runtime = Runtime.create();

  var count = 0;
  function one () {
    var stream = new EndStream().once('end', function () {
      ++count;
    });

    setTimeout(function () {
      stream.end('one');
    }, Math.random()*10);

    return stream;
  }
  function two () {
    var stream = new EndStream().once('end', function () {
      ++count;
    });

    setTimeout(function () {
      stream.end('two');
    }, Math.random()*10);

    return stream;
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
    var stream = new EndStream().once('end', function () {
      stack += 'one';
    });

    setTimeout(function () {
      stream.end();
    }, Math.random()*10);

    return stream;
  }
  function two () {
    var stream = new EndStream().once('end', function () {
      stack += 'two';
    });

    setTimeout(stream.end.bind(stream));

    return stream;
  }

  runtime.stack(one, two, one, two)(function (err) {
    if (err) { return done(err); }
    stack.should.not.be.eql('onetwoonetwo');
    done();
  });
});

it('runs in series with {wait: true}', function (done) {
  var runtime = Runtime.create();

  var stack = '';
  function one () {
    var stream = new EndStream().once('end', function () {
      stack += 'one';
    });

    setTimeout(function () {
      stream.end();
    }, Math.random()*10);

    return stream;
  }
  function two () {
    var stream = new EndStream().once('end', function () {
      stack += 'two';
    });

    setTimeout(stream.end.bind(stream));

    return stream;
  }

  runtime.stack(one, two, {wait: true})(function (err) {
    if (err) { return done(err); }
    stack.should.be.eql('onetwo');
    done();
  });
});

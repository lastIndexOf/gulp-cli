'use strict';

exports = module.exports = function (api, repl, Gulp, should) {

  it('repl should be a readline Interface', function () {
    var readline = require('readline');
    repl.constructor.should.be.eql(readline.Interface);
  });

  it('emit dispatches registered tasks', function (done) {
    var pile = [];
    var gulp = new Gulp();

    api.add(gulp);

    gulp.task('one', function (cb) {
      pile.push('one');
      if (pile.length > 1) { end(); }
      cb();
    });

    gulp.task('two', function (cb) {
      pile.push('two');
      if (pile.length > 1) { end(); }
      cb();
    });

    repl.emit('line', 'one two');

    function end () {
      pile.should.containDeep(['one', 'two']);
      done();
    }
  });

  it('undefined tasks should not run', function (done) {
    var gulp = new Gulp();

    api.add(gulp);

    gulp.task('one', function (cb) {
      done(new Error('should not run failed'));
      setTimeout(cb, 0);
    });

    should.exist(gulp.tasks || gulp._registry._tasks);

    var prompt = repl.prompt;
    repl.prompt = function () {
      repl.prompt = prompt;
      prompt.apply(repl, arguments);
      done();
    };

    repl.emit('line', 'not found task');
  });

  it('should handle more than one instance', function (done) {
    var pile = [];

    var gulp1 = new Gulp();
    var gulp2 = new Gulp();

    api.add(gulp1).add(gulp2);

    should(gulp1 !== gulp2).be.eql(true);

    api.get(gulp1).gulp.should.be.eql(gulp1);
    api.get(gulp2).gulp.should.be.eql(gulp2);

    gulp1.task('three', function (cb) {
      pile.push('three');
      if (pile.length > 1) { end(); }
      cb();
    });

    gulp2.task('four', function (cb) {
      pile.push('four');
      if (pile.length > 1) { end(); }
      cb();
    });

    repl.emit('line', 'three four');

    function end () {
      pile.should.containDeep(['three', 'four']);
      done();
    }
  });

  it('should run found tasks indenpently of instances', function (done) {
    var pile = [];
    var gulp1 = new Gulp();
    var gulp2 = new Gulp();

    api.reset();

    api.add(gulp1);
    api.add(gulp2);

    gulp1.task('one', function (cb) {
      pile.push('one');
      if (pile.length > 1) { end(); }
      cb();
    });

    gulp2.task('two', function (cb) {
      pile.push('two');
      if (pile.length > 1) { end(); }
      cb();
    });

    repl.emit('line', 'one two');

    function end () {
      pile.should.containDeep(['one', 'two']);
      done();
    }
  });

  it('should prompt after not found tasks', function (done) {
    var gulp = new Gulp();

    api.add(gulp);

    var prompt = repl.prompt;
    repl.prompt = function () {
      repl.prompt = prompt;
      prompt.apply(repl, arguments);
      done();
    };

    repl.emit('line', 'not found task');
  });
};

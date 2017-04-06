'use strict';

var util = require('./lib/util');

var repl = null;
var instances = [];

exports = module.exports = {};

// get the instance properties used by the REPL
exports.get = function (gulp) {
  if (!arguments.length) {
    return instances.concat();
  }

  var length = instances.length;

  for (var index = 0; index < length; ++index) {
    var instance = instances[index] || {};
    if (instance.gulp === gulp) {
      return instance;
    }
  }

  return null;
};

// add the given instance to the REPL lookup
exports.add = function (_gulp_) {
  if (_gulp_ && !this.get(_gulp_)) {
    var gulp = util.getGulp(_gulp_);

    instances.push({
      gulp: gulp,
      index: instances.length,
      tasks: util.getTasks(gulp),
      runner: gulp.start || gulp.parallel
    });
  }
  return this;
};

// reset the instances array
exports.reset = function () {
  instances = [];
  return this;
};

// remove the instance from the instances array
exports.remove = function (_gulp_) {
  var instance = this.get(_gulp_);
  if (instance) {
    instances.splice(instance.index, 1);
  }
  return this;
};

// create a readline instance if there is none
exports.start = function (_gulp_) {
  this.add(_gulp_);

  // only create one repl listening on stdin
  if (repl) { return repl; }

  repl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: function onComplete (line) {
      return util.completer(line, instances);
    }
  });

  // queue tasks when line is not empty
  repl.on('line', function onLine (input) {
    var line = input.trim();
    if (!line) { return repl.prompt(); }

    var queue = {
      found: [],
      notFound: line.split(/[ ]+/)
    };

    instances.forEach(function (inst) {
      var tasks = util.getQueue(queue.notFound.join(' '), inst.tasks);
      if (tasks.found.length) {
        queue.found.push({ inst: inst, tasks: tasks.found });
      }
      queue.notFound = tasks.notFound;
    });

    if (queue.notFound.length) {
      console.log(' `%s` not found', queue.notFound.join(' '));
      return repl.prompt();
    }

    queue.found.forEach(function (found) {
      var result = found.inst.runner.apply(found.inst.gulp, found.tasks);
      if (typeof result === 'function') {
        result(); // gulp#4.0
      }
    });

    return this;
  });

  // exit on SIGINT
  repl.on('SIGINT', function onSIGINT () {
    process.stdout.write('\n');
    process.exit(0);
  });

  return repl;
};

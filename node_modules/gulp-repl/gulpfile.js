'use strict';

var gulp = require('gulp');
gulp.repl = require('./.')(gulp);

gulp.task('foo', function (cb) {
  setTimeout(cb, Math.random() * 1000);
});

gulp.task('bar', function (cb) {
  setTimeout(cb, Math.random() * 500);
});

gulp.task('default');

gulp.repl.emit('line', 'foo bar');

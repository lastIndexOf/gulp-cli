'use strict';

exports = module.exports = function (api, repl, Gulp, should) {

  it('should return null if the instance is not set', function () {
    var gulp = new Gulp();
    should(api.get(gulp)).be.eql(null);
  });

  it('should return an object with the instance set', function () {
    var gulp = new Gulp();

    api.add(gulp).get(gulp).gulp.should.be.eql(gulp);
  });

  it('should return all instances when called with no arguments', function () {
    var gulp1 = new Gulp();
    var gulp2 = new Gulp();

    api.add(gulp1).add(gulp2);

    api.get().map(function (stored) {
      return stored.gulp;
    }).should.containDeep([gulp1, gulp2]);
  });
};

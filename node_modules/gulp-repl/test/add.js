'use strict';

exports = module.exports = function (api, repl, Gulp, should) {

  it('should return the module', function () {
    var gulp = new Gulp();

    api.add(gulp).should.be.eql(api);
  });

  it('should add to the instances store', function () {
    var gulp = new Gulp();

    should(api.get(gulp)).be.eql(null);

    api.add(gulp);

    should(api.get().filter(function (instance) {
      return instance.gulp === gulp;
    }).length).be.eql(1);
  });

  it('should not add an instance more than once', function () {
    var gulp = new Gulp();

    api.reset();

    '1234567890'.split('').forEach(function () {
      api.add(gulp).get().length.should.be.eql(1);
    });
  });
};

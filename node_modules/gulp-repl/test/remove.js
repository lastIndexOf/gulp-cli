'use strict';

exports = module.exports = function (api, repl, Gulp, should) {

  it('should delete the instance from the instances store', function () {
    var gulp = new Gulp();

    should(api.get(gulp)).be.eql(null);

    api.add(gulp);

    should(api.get(gulp).gulp).be.eql(gulp);

    api.remove(gulp);

    should(api.get(gulp)).be.eql(null);
  });
};

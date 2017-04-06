

exports = module.exports = function (API, should) {

  it('reserved statics should not be set on the constructor', function () {
    var statics = { value: 1, method: function () {} };

    var Tor = API({ statics: statics });

    should(Tor).have.properties(statics);
    should(new Tor()).not.have.properties(statics);
  });
};

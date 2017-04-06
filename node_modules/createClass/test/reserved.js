

exports = module.exports = function (API, should) {
  var RESERVED_KEYS = API.internals.RESERVED_KEYS;

  it('should have spec reserved keys', function () {
    should(RESERVED_KEYS).have.property('spec');
    should(RESERVED_KEYS.spec).containDeep(
      ['mixins', 'statics', 'create']
    );
  });

  it('should have static reserved keys', function () {
    should(RESERVED_KEYS).have.property('statics');
    should(RESERVED_KEYS.statics).containDeep(
      ['super_', 'create', 'createClass']
    );
  });

  it('spec should not be set on the prototype', function () {
    var spec = {};

    RESERVED_KEYS.spec.forEach(function (key) {
      spec[key] = function () {};
    });

    var Tor = API(spec);

    RESERVED_KEYS.spec.forEach(function (key) {
      should(Tor.prototype).not.have.property(key);
    });
  });

  it('reserved statics should not be set on the constructor', function () {
    var statics = {};

    RESERVED_KEYS.statics.forEach(function (key) {
      statics[key] = function () {};
    });

    var Tor = API({ statics: statics });

    RESERVED_KEYS.statics.forEach(function (key) {
      should(Tor[key]).not.be.eql(statics[key]);
    });
  });
};

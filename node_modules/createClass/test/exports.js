
exports = module.exports = function (API, should) {

  it('API() should return a constructor function', function () {
    var Tor = API();

    should(typeof Tor).be.eql('function');
    should(Tor.prototype).be.empty();
    should(typeof Tor.prototype).be.eql('object');
  });

  it('API() has create and createClass functions as statics', function () {
    var Tor = API();

    should(Tor).have.properties(['create', 'createClass']);
    should(typeof Tor.create).be.eql('function');
    should(typeof Tor.createClass).be.eql('function');
  });

  it('API assigned as static property makes this function super', function () {
    var SuperTor = function () {};
    SuperTor.createClass = API;

    var Child = SuperTor.createClass();
    should(Child.super_).be.eql(SuperTor);
    should(new Child() instanceof SuperTor).be.eql(true);
  });
};

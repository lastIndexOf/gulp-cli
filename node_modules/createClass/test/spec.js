
exports = module.exports = function (API, should) {

  it('API(Object spec) constructor should have spec', function () {
    var spec = {methodA: function () {}, methodB: function () {}};
    var Tor = API(spec);

    should(Tor.prototype).have.properties(spec);
  });

  it('API({create: [Function]}) to be used as constructor', function () {
    var props = { happened: true };
    var MyTor = function MyTor () {
      for (var name in props) {
        if (props.hasOwnProperty(name)) {
          this[name] = props[name];
        }
      }
    };
    var Child = API({ create: MyTor });

    should(typeof Child).be.eql('function');
    should(typeof Child.prototype).be.eql('object');
    should(Child.prototype.constructor).be.eql(MyTor);
    should(new Child()).have.properties(props);
    should(new Child() instanceof MyTor).be.eql(true);
  });
};

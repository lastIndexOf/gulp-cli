

exports = module.exports = function (API, should) {

  it('API({ mixins: [A, ...] }) should be part of the prototype', function () {
    var A = { methodA: function (){} };
    var B = { methodB: function (){} };

    var Tor = API({ mixins: [A, B] });
    var proto = Tor.prototype;

    should(proto).have.properties(A);
    should(proto).have.properties(B);
  });

  it('API({ mixins: [A, ...] }) can be either function or object', function () {
    var A = { methodA: function (){} };
    var B = function () {};
    B.prototype.methodB = { methodB: function (){} };

    var Tor = API({ mixins: [A, B] });
    var proto = Tor.prototype;

    should(proto).have.properties(A);
    should(proto).have.properties(B.prototype);
  });

  it('API({ mixins: [A, ...] }) should be found on the instance', function () {
    var A = { methodA: function (){} };
    var B = { methodB: function (){} };

    var Tor = API({ mixins: [A, B] });
    var instance = Tor.create();

    should(instance).have.properties(A);
    should(instance).have.properties(B);
  });

  it('API({ mixins: [A, ...] }) are overriden right to left', function () {
    var A = { method: function (){}, methodB: function (){} };
    var B = { method: function (){}, methodB: function (){} };
    var C = { method: function (){} };

    var Tor = API({ mixins: [A, B, C] });
    var proto = Tor.prototype;

    should(proto).have.properties({
      method: C.method,
      methodB: B.method
    });
  });

  it('API({ mixins: [A, ...] }).create() has all mixins', function () {
    var A = { methodA: function (){} };
    var B = { methodB: function (){} };
    var C = { methodC: function (){} };

    var Tor = API({ mixins: [A, B, C] });
    var instance = Tor.create();

    should(instance).have.properties({
      methodA: A.methodA,
      methodB: B.methodB,
      methodC: C.methodC
    });
  });
};

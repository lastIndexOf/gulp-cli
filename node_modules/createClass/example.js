
var createClass = require('./.');

var Logger = createClass({
  create: function Logger (props) {
    console.log(this.constructor.name, 'created with props', props);

    Object.keys(this.constructor.prototype).forEach(function (method) {
      var self = this;
      self[method] = function (/* arguments */) {
        console.log(self.constructor.name, 'is going to', method);
        self.constructor.prototype[method].apply(self, arguments);
      };
    }, this);
  }
});

var Animal = createClass(Logger, {
  create: function Animal (props) {
    Animal.super_.call(this, props);
    this.props = props;
  }
});

var FelineMixin = {
  talk: function () {
    console.log('meoww (%s)', this.props.thinking);
  }
};

var Cat = Animal.createClass({
  mixins: [FelineMixin],
  create: function Cat (props) {
    Cat.super_.call(this, props);
  }
});

var cat = new Cat({ thinking: 'hungry' });

setInterval(function () {
  cat.talk();
}, 1000);

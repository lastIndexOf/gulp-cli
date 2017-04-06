'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(options){
  if(!(this instanceof Parth)){
    return new Parth(options);
  }

  this.store = {};
  this.regex = [];
  this.regex.master = new RegExp('(?:[])');
  this.regex.defaultRE = /[^?#./\s]+/;

  if(options){
    this.regex.defaultRE = options.defaultRE || this.regex.defaultRE;
  }
}

var qshRE = /[?#][^\/\s]*/g;
var depthRE = /((^|[/?#.\s]+)[(:\w])/g;
var paramRE = /:([-\w]+)(\([^\s]+?[)][?)]*)?/g;
var noParamRE = /(^|[/.=\s]+)(\(.+?\)+)/g

Parth.prototype.set = function(path, opt){
  if(typeof path !== 'string'){
    return this;
  }

  var o = util.clone(opt || {}, true);
  o.path = path.replace(/\s+/g, ' ').trim();

  if(this.store[o.path]){
    util.merge(this.store[o.path], o);
    return this;
  }
  this.regex.push(this.store[o.path] = o);

  var index = -1;
  var defaultRE = '(' + this.regex.defaultRE.source + ')';

  o.stem = o.path.replace(noParamRE, function($0, $1, $2){
    return $1 + ':' + (++index) + $2;
  });

  var url = (o.stem.match(/[^\s]*\/\S*/) || [null]).pop();
  var qsh = util.getQueryString(url);

  if(url && !qsh){
    o.stem = o.stem.replace(url, url.replace(/\/$/, '$1') +
      ':qs(?:\\/)?(' + qshRE.source + ')?'
    );
  }

  o.depth = o.stem.split(depthRE).length || -1;
  o.regex = new RegExp('^' +
    o.stem.replace(/\S+/g, function(s){
      return s.replace(paramRE, function($0, $1, $2){
        return ($2 || defaultRE);
      });
    }).replace(/[^?( )+*$]+(?=\(|$)/g, function escapeRegExp($0){
      return $0.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    })
  );

  // order regexes according to depth (# of separation tokes) or,
  // if that fails, use localCompare

  this.regex.sort(function(x, y){
    return (y.depth - x.depth) || y.stem.localeCompare(x.stem);
  });

  // sum up all learned (void all groups and make a giant regex)
  this.regex.master = new RegExp( '(' +
    this.regex.map(function voidRegExp(el){
      return el.regex.source.replace(/\((?=[^?])/g, '(?:');
    }).join(')|(') + ')'
  );

  return this;
};

Parth.prototype.get = function(path){
  if(typeof path !== 'string'){
    return null;
  }

  path = path.replace(/\s+/g, ' ').trim();

  if(this.store[path]){
    return util.merge(util.clone(this.store[path], true), {
      match: path,
      notFound: ''
    });
  }

  var found = this.regex.master.exec(path);
  if(!found){ return null; }

  var o = {match: found.shift(), params: {}};

  found = this.regex[found.indexOf(o.match)];
  o.notFound = path.slice(o.match.length);

  var index = -1;
  var params = found.regex.exec(path).slice(1);

  found.stem.replace(paramRE, function($0, $1){
    o.params[$1] = params[++index];
  });

  return util.merge(util.clone(found, true), o);
};

'use strict';

var path, match;

function check(result) {
  result.should.have.properties({
    path: path,
    match: match
  });
}

module.exports = function(Parth){
  var parth = new Parth();

  it('object', function(){
    path = 'hello.:there';
    match = 'hello.awesome';
    check(parth.set(path).get(match));
  });

  it('raw object paths', function(){
    match = path = 'hello.there';
    check(parth.set(path).get(match));
  });

  it('unix paths', function(){
    path = '/hello/:there/:you';
    match = '/hello/awesome/human';
    check(parth.set(path).get(match));
  });

  it('raw unix paths', function(){
    path = '/hello/there/you';
    match = '/hello/there/you?here';
    check(parth.set(path).get(match));
  });

  it('urls', function(){
    path = '/hello/:there';
    match = '/hello/awesome/?query';
    check(parth.set(path).get(match));
  });

  it('raw urls', function(){
    path = '/hello/there';
    match = '/hello/there/?query';
    check(parth.set(path).get(match));
  });

  it('urls: querystring is stripped', function(){
    path = 'get page.thing /hello/there';
    match = 'get page.thing /hello/there/?query';
    check(parth.set(path).get(match));
  });

  it('urls: hash is stripped', function(){
    path = 'get page.thing /hello/there';
    match = 'get page.thing /hello/there#hello';
    check(parth.set(path).get(match));
  });

  it('urls: parameters are not mistaken as querystrings', function(){
    path = 'get page.thing /hello/:here(?:\\w+you)';
    match = 'get page.thing /hello/helloyou';
    check(parth.set(path).get(match));
  });

  it('space separated paths', function(){
    path = 'you are an :there :you';
    match = 'you are an awesome human';
    check(parth.set(path).get(match));
  });

  it('raw, space separated paths', function(){
    match = path = 'you are an there you';
    check(parth.set(path).get(match));
  });

  it('unix, object and url paths together', function(){
    path = 'get page.:thing /hello/:there';
    match = 'get page.data /hello/awesome/?query';
    check(parth.set(path).get(match));
  });

  it('raw: unix, object and urls paths together', function(){
    path = 'get page.thing /hello/there';
    match = 'get page.thing /hello/there/?query';
    check(parth.set(path).get(match));
  });

};

'use strict';

var stem, path, result;

module.exports = function(Parth){
  var parth = new Parth();

  it('can be given as part of the input string', function(){
    stem = 'post /:number(\\d+)';
    path = 'post /1';
    result = parth.set(stem).get(path);
    result.should.have.properties({
      params: {
        number: '1'
      }
    });
  });

  it('may not contain labels', function(){
    stem = '(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/10';
    result = parth.set(stem).get(path);
    result.should.have.properties({
      params: {
        '0': 'post',
        you: '10',
        there: 'awesome'
      }
    });
  });

  it('query fragment is setup by default for an url', function(){
    stem = '(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/10?query=string#here';
    result = parth.set(stem).get(path);
    result.should.have.properties({
      params: {
        '0': 'post',
        you: '10',
        there: 'awesome',
        qs: '?query=string#here'
      }
    });
  });

  it('querystring may contain parameters', function(){
    stem = 'post /:page\\/?:query(\\?[^/#\\s]+)?:fragment(#[^?\\s]+)?';
    path = 'post /page?query=here#hash';
    result = parth.set(stem).get(path);

    result.should.have.properties({
      params: {
        page: 'page',
        query: '?query=here',
        fragment: '#hash'
      }
    });
  });
};

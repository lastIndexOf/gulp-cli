'use strict';

var path, stems, result;

module.exports = function(Parth){
  var parth = new Parth();

  it('should be empty string for perfect match', function(){
    stems = ':method(get) /hello/:there';
    path = 'get /hello/awesome?query#hash';

    result = parth.set(stems).get(path);
    result.should.not.be.eql(null);
    result.notFound.should.be.eql('');
  });

  it('should have what is left of the path', function(){
    stems = ':method(get) /hello/:there';
    path = 'get /hello/awesome/human';
    result = parth.set(stems).get(path);
    result.should.not.be.eql(null);
    result.notFound.should.be.eql('human');
  });
};

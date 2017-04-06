'use strict';

var path, stems, result;

module.exports = function(Parth){

  it('default regex can be changed using options', function(){
    var parth = new Parth({
      defaultRE: /\S+/
    });

    stems = 'do :src :dest';
    path = 'do /src/**/*.js /dest/';

    result = parth.set(stems).get(path);
    result.notFound.should.be.eql('');
    result.regex.source.should.match(/[\\]+S\+/);
  });
};

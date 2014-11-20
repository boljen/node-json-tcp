var framework = require('javascript-protocol-framework')
  , net = require('net')
  , protocol = require('./../../lib/protocol');

var proto = new framework.Protocol();


proto.addReceiver('test', function() {
  console.log('gotten test');
})

var crypto = require('crypto');
var createCipher= function(key, iv) {
  return crypto.createCipheriv('aes-192-cfb8', key, iv);
};

var createDecipher= function(key, iv) {
  return crypto.createDecipheriv('aes-192-cfb8', key, iv);
};


net.createServer(function(s) {
  var ses = new framework.Session({
    protocol: proto
  });
  var enc = createCipher('testtesttesttesttesttest', 'testtesttesttest');
  var dec = createDecipher('testtesttesttesttesttest', 'testtesttesttest');

  s.pipe(dec);
  enc.pipe(s);

  protocol(ses, dec, enc);

  ses.send({
    type: 'test',
    data: 'hello',
  });

}).listen(80);

var c = net.connect(80);
var ses = new framework.Session({
  protocol: proto
});

var enc = createCipher('testtesttesttesttesttest', 'testtesttesttest');
var dec = createDecipher('testtesttesttesttesttest', 'testtesttesttest');

c.pipe(dec);
enc.pipe(c);

protocol(ses, dec, enc);
